// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Initiate_Training_log_NodeJs.js
// This program is for one-time use to the Training log database
// Reference: Free Code Camp Coursehttps://www.youtube.com/watch?v=Oe421EPjeBE
// Reference: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
// TODO: do I need closed to open alert

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
console.log('Connected to database')

// Create tables
function create_table_categories() {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT,
  category_position INTEGER,
  isClosed INTEGER DEFAULT 0,
  category_subheading TEXT)`, (err) => {
    if (err) {
      console.log('CREATE TABLE categories ERROR!', err)
    }
  })
}

function create_table_categories_to_workouts() {
  db.run(`CREATE TABLE IF NOT EXISTS categories_to_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT,
  workout_name TEXT)`, (err) => {
    if (err) {
      console.log('create_table_categories_to_workouts error', err)
    }
  })
}

function create_table_workouts() {
  db.run(`CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_name TEXT,
  workout_url TEXT,
  date_array TEXT,
  toRepeat INTEGER DEFAULT 0,
  workout_comment TEXT)`, (err) => {
    if (err) {
      console.log('CREATE TABLE workouts ERROR!', err)
    }
  })
}

create_table_categories()
create_table_categories_to_workouts()
create_table_workouts()

// Load index file
app.get('/', (req, res, next) => {
  readFile('./index.html', 'utf8', (err, result) => {
    if (err) {
      console.log('get index.html error: ', err)
      return
    }
    res.sendFile(path.resolve(base_dir, './index.html'))
  })
})

async function clear_table(table_names) {
  // Clear all rows in table_names 
  try {
    for (let i = 0; i < table_names.length; i++) {
      console.log(table_names)
      table = table_names[i]
      res_clear = db.run(`DELETE FROM ${table} WHERE EXISTS (SELECT * FROM ${table})`);
      console.log(`'64 res_clear: ', ${table}`, res_clear)
    }
  } catch (e) {
    console.log(`Could not Clear Table: ${table})`, res_clear)
  }
}

app.use(express.urlencoded({
  extended: false
}))

//parse form data and insert into database
app.post('/get_categories', function (req, res) {
  // var data_for_SQL = req.body;
  // data_list = JSON.parse(data_for_SQL.categories_data)
  console.log('in get/categories')
  var data_for_SQL = req.body;
  var data_list

  async function populate_tables() {
    try {
      data_list = JSON.parse(data_for_SQL.categories_data)
      var categories_cleared = clear_table(['categories'])
      await populate_categories(data_list)
      var categories_to_workouts_cleared = clear_table(['categories_to_workouts'])
      await populate_categories_to_workouts(data_list)
      var workouts_cleared = clear_table(['workouts'])
      await populate_workouts(data_list)
    } catch (e) {
      console.log(`107 Error:`, e)
    }
  }

  async function populate_categories(data_list) {
    table = 'categories'
    for (let i = 0; i < data_list[0].length; i++) {
      category_name = data_list[0][i][0];
      category_position = data_list[0][i][1];
      isClosed = data_list[0][i][2];
      category_subheading = data_list[0][i][3];
      db.run(`INSERT INTO ${table} (category_name, category_position, isClosed, category_subheading) 
                  VALUES(?, ?, ?, ?)`, [category_name, category_position, isClosed, category_subheading]);
      //reference https://stackabuse.com/a-sqlite-tutorial-with-node-js/
      console.log(`120: added row ${table} ${category_name}, ${category_position}, ${isClosed}, ${category_subheading}`)
    }
  }

  async function populate_categories_to_workouts(data_list) {
    table = 'categories_to_workouts'
    for (let i = 0; i < data_list[1].length; i++) {
      category_name = data_list[1][i][0];
      workout_name = data_list[1][i][1];
      db.run(`INSERT INTO ${table} (category_name, workout_name) 
                    VALUES(?, ?)`, [category_name, workout_name]);
      if (i < 5) console.log(`131: added row to ${table} ${category_name}, ${workout_name}`)
    } 
  }

  async function populate_workouts(data_list) {
    table = 'workouts'
    for (let i = 0; i < data_list[2].length; i++) {
      workout_name = data_list[2][i][0];
      workout_url = data_list[2][i][1];
      date_array = data_list[2][i][2];
      toRepeat = data_list[2][i][3];
      workout_comment = data_list[2][i][4];
      db.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, toRepeat, workout_comment) 
                    VALUES(?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, toRepeat, workout_comment]);
      if (i < 5) console.log(`157: added row to ${table} ${category_name}, ${workout_url}, ${date_array}, ${toRepeat}, ${workout_comment}`)
    }
  }
  populate_tables()
  res.redirect('/')
})



// db.close()

app.all('*', (req, res) => {
  res.status(404).send(' - check indentation')
})

app.listen(port, () => {
  console.log(`116: server is listening on port ${port} ....`)
})