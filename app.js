// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).json({
        "message" : "Hello World!"
    });
});

app.post("/bookmarks", (req, res) =>{
  const {id, url, title} = req.body;
  if (!url || !title){
    return res.status(422).json({
      "error" : "required field(s) missing",
    })
  }
  connection.query('INSERT INTO bookmark SET ?', req.body, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    }
    connection.query('SELECT * FROM bookmark WHERE id = ?', results.insertId, (err2, records) => {
      if (err2) {
        return res.status(500).json({
          error: err2.message,
          sql: err2.sql,
        });
      }
      return res
        .status(201)
        .json(records[0]);
    });
  })
})
app.get("/bookmarks/:id", (req, res) => {
  const idBookmarks = req.params.id;
  connection.query( "SELECT * from bookmark WHERE id=?", [idBookmarks], (err, results) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Bookmark not found" });
    }
        res.status(200).json(results[0]);
  });
});

module.exports = app;
