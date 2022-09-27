const express = require("express");
const mysql = require("mysql");
require("dotenv").config()

const app = express();
app.use(express.json());

// My Sql connection
const connection = mysql.createConnection({
  host: process.env['HOST'],
  user: process.env['USERNAME'],
  password: process.env['PASSWORD'],
  database: process.env['DATABASE'],
});

connection.connect((e) => {
  if (e) {
    console.log("errorconnect MySql =", e);
    return;
  }
  console.log("MySql conect success");
});

// path
app.post("/create", (req, res) => {
  const { name, email, password } = req.body;

  try {
    connection.query(
      "INSERT INTO usr (email, fname, password) VALUES(?, ?, ?)",
      [email, name, password],
      (err, result, fiends) => {
        if (err) {
          console.log("Error while inserting a user into database", err);
          return res.status(400).send();
        }
        return res
          .status(201)
          .json({ message: "New user successfully created" });
      }
    );
  } catch (err) {
    console.log(error);
    return res.status(500).send();
  }
});

// Read
app.get("/read", (req, res) => {
  try {
    connection.query("SELECT * FROM usr", (err, result, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(result);
    });
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
});

// get single data
app.get("/read/single/:email", (req, res) => {
  const email = req.params.email;
  try {
    connection.query(
      "SELECT * FROM usr WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(result);
      }
    );
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
});

// UPDATE DATA
app.put("/update/:email", (req, res) => {
  const email = req.params.email;
  const newPassword = req.body.newPassword;
  try {
    connection.query(
      "UPDATE usr SET password = ? WHERE email = ?",
      [newPassword, email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json("User password updated success");
      }
    );
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
});

app.delete("/delete/:email", (req, res) => {
  const email = req.params.email;

  try {
    connection.query(
      "DELETE FROM usr WHERE email = ?",
      [email],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if(result.affectedRows === 0){

            return res.status(404).json({message: "No user with taht email ~!"});
        }
        return res.status(200).json({message: "User deleted successfully"})
      }
    );
  } catch (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
  }
});

const port = 3000;
app.listen(port, () => {
  console.log("run at port:", port);
});
