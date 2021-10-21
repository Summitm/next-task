const conn = require('../dbConf');
const config = require('../config');
const jwt = require('jsonwebtoken');
const validator = require('express-validator');
const bcrypt = require('bcryptjs');
// const { resolve } = require('core-js/fn/promise');

// Register a user
module.exports.register = [
    validator.body('username', 'Please enter a valid email!').isEmail().normalizeEmail(),
    validator.body('full_name', 'Please enter your full name').isLength({min: 2}),

    // check if email exists.
    validator.body('username').custom(value => {
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM users_tbl WHERE email = ?', [value], (err, results) =>{
                if(err) {
                    reject(new Error('Server Error'));
                }
                if(results.length > 0) {
                    reject(new Error('This username is already taken!'));
                }
                resolve(true);
            });
        });
    }),
    
    validator.body('password', 'Password too short or does not met the criteria').isLength({min: 6}),

    function(req, res) {
        // after checking validations errors, throw them if any
        const errors = validator.validationResult(req);
        if(!errors.isEmpty) {
            return res.status(422);
        }

        // initialize data to be sent
        const user = {};
        user.username = req.body.username;
        user.fullname = req.body.full_name;
        user.password = req.body.password;

        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        // destructuring user.password
        user.password = hash;

        //save records to db
        conn.query('INSERT INTO users_tbl SET ?', user, (err, results, fields) => {
            if(err) {
                return res.status(500).json({message: 'Unable to save record!', err: err})
            }
            return res.status(200).json({message: 'Registered successfully! Proceed to login'})
        })
    }
];