// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
// TODO: Check out repeats after Bare Minimum
//  Read .css file here and add to variable
//   Add body tags and javascript tags
// TODO: Organize routes - https://stackoverflow.com/questions/59681974/how-to-organize-routes-in-nodejs-express-app
//  and https://vegibit.com/node-js-routes-tutorial/
// TODO: look up guide in https://stackoverflow.com/questions/59898760/assigning-a-promise-result-to-a-variable-in-nodejs

const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const path = require('path')
const app = express()
// TODO update base_dir to avoid hardcoded path
const base_dir = path.resolve(__dirname)
const {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  appendFileSync
} = require('fs')
const port = 5001
// Reference: https://www.geeksforgeeks.org/node-js-date-format-api/
const date_format = require('date-and-time')
var workoutGLOBAL = {}
app.use(express.urlencoded({extended:false}))

//Read in the head for html
head_input = './head_input.html'
var training_log_head_html = ''
readFile(head_input, 'utf8', (err, data) => {
  if (err) {
    console.log('22', error)
    return
  }
  training_log_head_html = data
})

// TODO: Move to routes director

// Load header file
app.get('/', (req, res, next) => {
  readFile('./index.html', 'utf8', (err, result) => {
    res.end(training_log_head_html+workouts_html)
  })
})

// Retrieve workout_id
app.post('/add_date.html', (req, res) => {
  var workout_id = req.body.name
  console.log('52 workout_id ', workout_id, Date.now())
  today = new Date()
  new_date = date_format.format(today,'MM/DD/YYYY')

  let select_workout = `
    SELECT workout_name, workout_url, date_array, toRepeat, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
  
    // TODO: Make async function
    db.get(select_workout, [], (err, row) => {
    workoutGLOBAL = row
    // console.log('66 workoutGLOBAL in retrieve_workout', workoutGLOBAL, row)
  })

  //TODO: Different actions for different buttons
  var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>Add Date to ${workoutGLOBAL.workout_name}</h2>

<form action="/update_db.html" method="POST"">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="work_out_date" name="work_out_date" value=${new_date}><br>
  <input type="submit" value="Submit New Date">
</form> 

<div><span>Cancel Button</span><span>Edit Workout Button</span><span>Add New Workout Button</span></div>

</body>
<script>
console.log("87 in script")
</script>
</html>

  `
  res.end(add_date_html)


  // res.sendFile(path.resolve(base_dir, './add_date.html'))
  // res.send(req.body.name)
})

app.post('/update_db.html', (req, res) => {
  console.log('100 req\n', req.body)
  console.log('102 update database here', workoutGLOBAL)
  let new_date = req.body.work_out_date
  console.log('103 req.body: ', req.body)

  //add date to date array
  workoutGLOBAL.date_array.split(',').push(new_date)
  new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
  console.log('107 new_date_array', Date.now(), '  ', new_date_array)

  // Update db for new_date_array
  update_command = `
UPDATE  workouts 
SET date_array = "${new_date_array}"
WHERE id = ${workoutGLOBAL.id}
  `
  console.log('116 update_command: ', Date.now(), update_command)
  // let db_update_promise = db.run(update_command)
  console.log('118: time', Date.now())
  data_updated = new Promise((resolve, reject) => {
    db.run(update_command)
    // console.log('121 in data_updated : ', Date.now())
    }).then(()=>{
      retrieve_data() 
      // res.redirect('/')
    }).then(()=>{
      console.log('126 data_updated Promise: ', Date.now())
    })
  
    // resolve(console.log('122: ', data_updated))
 
    


  // Reload home page
  
  // res.send(req.body.name)
})

// Connect to database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('43: Connected to database')
})

var workout_array = []
let retrieve_data = async function retrieve_data() {
  try {
    console.log('149 start retrieve_data: ', Date.now())
    let join_categories_to_workouts = `
    SELECT category_position, isClosed, category_subheading, categories.category_name, workouts.workout_name,
    workout_url, date_array, toRepeat, workout_length, workout_comment, workouts.id
    FROM categories 
    INNER JOIN categories_to_workouts 
    on categories.category_name = categories_to_workouts.category_name
    INNER JOIN workouts
    on categories_to_workouts.workout_name = workouts.workout_name
    ORDER BY category_position, last_date DESC
    `
    db.all(join_categories_to_workouts, [], (err, rows) => {
      i = 0;
      workout_array = rows
      rows.forEach((row) => {
        i+=1;
        workout_array.push(row)
        // console.log('68: ',i, row.category_position, row.category_name, row.workout_name, row.date_array);
      });
      // console.log('70: ', workout_array)
      console.log('169 finish retrieve_data: ', Date.now())
      write_html(workout_array)
    })
  } catch (e) {
    console.log('Did not retrieve data:)', e)
  }
}

var workouts_html = ''
function write_html(workout_array) {
  console.log('80 in workout_array')
  var last_category = -1
  for (let i=0; i < workout_array.length; i++) {
    if (last_category != workout_array[i].category_position) {
      if (last_category != -1) {
        write_details_end_html()
      }
      write_details_beginning_html(workout_array[i]) 
    }
    write_workouts(workout_array[i])
    last_category = workout_array[i].category_position
  
  }
  write_details_end_html()
}

function write_details_end_html() {
  workouts_html = workouts_html + '</ul></details>'
}

function write_details_beginning_html(workout_row) {
  workouts_html = workouts_html + `<details open><summary>${workout_row.category_name}</summary>
  <ul class="workouts">`
}

function write_workouts(workout_row) {
  //TODO Add Strong to name
  //TODO Add dates routine
  // Put button and form on one line
  var add_date = `
  <form action="/add_date.html" method="POST">
    <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
  <button type="submit" class="block">+</button>
</form> 
  `
  workout = `
  <li id="wo_${workout_row.id}" "class="workout" >
                <span id="wos_${workout_row.id}" class="push_button" "display:inline-block">${add_date}
                <a href="${workout_row.workout_url}"
                    target="_blank" rel="noopener noreferrer" class="link">${workout_row.workout_name}</a>
                </span>
                <span class="length">${workout_row.workout_length}</span>
                <span class="separator">-</span>
                <span class="dates">${workout_row.date_array}</span>
                <span class="comments">${workout_row.workout_comment}</span>
            </li>
  `
  workouts_html = workouts_html + workout
}

retrieve_data()

app.listen(port, () => {
  console.log(`132: server is listening on port ${port} ....`)
})

