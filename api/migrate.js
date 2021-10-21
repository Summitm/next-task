// const { resolve, reject } = require('core-js/fn/promise');
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'S3cur3@2021'
});

//create connection
conn.connect(err => {
    if(err) console.error(`Unable to connect: ${err.message}`)
    console.log("Connection successful!")
});


//create database
const db_name = "todos_db";
conn.query(`CREATE DATABASE IF NOT EXISTS ${db_name}`, (err, result) => {
    if(err) console.error(`${err.stack}`)
    console.log(`Database ${db_name} created...`);

    // select database
    conn.changeUser({database: db_name}, function(err) {
        if(err) console.log(`${err.message}`)
        console.log(`Database ${db_name} is selected...`);

        // create all tables by calling the table creator process
        craeteTables();
    });
});


// task processor
function craeteTables() {

    // wait for all promises to resolve
    Promise.all([
        createUsersTable(),
        // any other table shld be added here
    ]).then(() => {
        conn.end();
        console.log("Connection clossed");
    });

}

// create Users table
function createUsersTable() {
    let table_name = 'users_tbl';
    let stmt = `CREATE TABLE IF NOT EXISTS ${table_name}(
        id INT AUTO_INCREMENT NOT NULL,
        username VARCHAR(255) NOT NULL,
        fullname VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        UNIQUE KEY (username)
    )`;

    // call the query executer
    return createTableHelper(stmt, table_name);
}

// create table or give an error
function createTableHelper(sql, tablename) {
    return new Promise((resolve, reject) => {
        conn.query(sql, function(err, result) {
            if(err) console.log(err.stack)
            console.log(`Table ${tablename} created...`);
            resolve(result)
        });
    });
}