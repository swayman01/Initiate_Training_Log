// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Initiate_Training_log_NodeJs.js
// This program is for one-time use to the Training log database
// Reference: Free Code Camp Coursehttps://www.youtube.com/watch?v=Oe421EPjeBE
const express = require('express')
const path = require('path')
const app = express()
const base_dir = '/Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice'
const {
  readFile,
} = require('fs')
const sqlite3 = require('sqlite3').verbose();
const port = 5001

app.use(express.static(path.join(base_dir, 'static')))
app.use(express.json())

// Create database
// Requires manual copy of database to avoid accidental deletion of an existing database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  }
})
console.log('25: Connected to database')
// table_name = 'categories'
// reference: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

function create_table_categories() {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT,
  category_position INTEGER,
  isClosed INTEGER DEFAULT 0,
  category_subheading TEXT)`, (err) => {
    if (err) {
      console.log('37: CREATE TABLE categories ERROR!', err)
    }
    console.log('39: left CREATE TABLE categories')
  })
}

function create_table_categories_to_workouts() {
  db.run(`CREATE TABLE IF NOT EXISTS categories_to_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT,
  workout_name TEXT)`, (err) => {
    if (err) {
      console.log('49: ERROR!', err)
    }
    console.log('51: left CREATE TABLE categories_to_workouts')
  })
}

create_table_categories()
// create_table_categories_to_workouts()

async function clear_table(table_name) {
  // Clear all rows in table_name
  try {
    res_clear = db.run(`DELETE FROM categories
    WHERE EXISTS (SELECT * FROM categories)`);
    console.log('63 res_clear: ', res_clear)
    if (table_name == 'categories') {
      res = await console.log('65', table_name, ' cleared')
      for (let i = 0; i < data_list[0].length - 1; i++) {
        category_name = data_list[0][i][0];
        category_position = data_list[0][i][1];
        isClosed = data_list[0][i][2];
        category_subheading = data_list[0][i][3];
        db.run(`INSERT INTO categories (category_name, category_position, isClosed, category_subheading) 
                    VALUES(?, ?, ?, ?)`, [category_name, category_position, isClosed, category_subheading]);
        // db.run(`INSERT INTO categories (category_name, category_position, isClosed, category_subheading) 
        //             VALUES(${category_name}, ${category_position}, ${isClosed}, ${category_subheading})`);
        // db.run(`INSERT INTO categories (category_name, category_position, isClosed, category_subheading) 
                    // VALUES('category_name', 1, 1, 'category_subheading')`);
        // db.run(`INSERT INTO categories (category_name) VALUES('category_name')`);
        //reference https://stackabuse.com/a-sqlite-tutorial-with-node-js/
        console.log(`74: added row ${category_name}, ${category_position}, ${isClosed}, ${category_subheading}`)
      }
    }
  } catch (e) {
    // console.log(`78: Could not Clear Table: ${table_name})`, res_clear)
  }
  // console.log(`80: populated TABLE ${table_name} res_clear: `, res_clear)
}
// Load index file
app.get('/', (req, res, next) => {
  console.log('83 in app.get')
  readFile('./index.html', 'utf8', (err, result) => {
    console.log('71: reading index.html')
    if (err) {
      console.log('73: ', err)
      return
    }
    res.sendFile(path.resolve(base_dir, './index.html'))

  })
})

app.use(express.urlencoded({
  extended: false
}))

//parse form data and insert into database
app.post('/get_categories', function (req, res) {
  clear_table('categories')
  var data_for_SQL = req.body;
  data_list = JSON.parse(data_for_SQL.categories_data)
  // console.log('104 data_list', data_list, '\n', data_list[0], data_list[1])

  res.redirect('/')
})
// db.close()

app.all('*', (req, res) => {
  res.status(404).send(' - check indentation')
})

app.listen(port, () => {
  console.log(`116: server is listening on port ${port} ....`)
})