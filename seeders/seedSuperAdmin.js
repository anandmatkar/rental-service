const { Pool } = require('pg')
const uuid = require("node-uuid");
const bcrypt = require('bcrypt')

var connection = new Pool({
    host: "localhost",
    user: "postgres",
    password: "root",
    database: "rental_service",
    charset: 'utf8mb4'
});

connection.connect()
let id = uuid.v4()
let password = "Admin@123#"
let encryptedPassword = bcrypt.hashSync(password, 10)
console.log("running seed");

connection.query(`insert into super_admin (id,name,email,password) values('${id}','superadmin', 'superadmin@yopmail.com', '${encryptedPassword}')`, err => {
    if (err) {
        throw err
    }
    console.log("seed complete");
    connection.end()
    process.exit()
})