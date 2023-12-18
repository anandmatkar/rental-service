const { Pool } = require("pg");

let connection = new Pool({
  user: "postgres",
  host: "localhost",
  database: "rental_space",
  password: "root", //enter your postgres password here
  port: 5432,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected successfully....");
  }
});

module.exports = connection;
