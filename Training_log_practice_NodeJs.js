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
var workouts_htmlGLOBAL = ''
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
    console.log('46: app.get: ', Date.now(), '\n', workouts_htmlGLOBAL.slice(800,1000))
    res.end(training_log_head_html+workouts_htmlGLOBAL)
  })
})

// Retrieve workout_id
app.post('/add_date.html', (req, res) => {
  var workout_id = req.body.name
  console.log('54 workout_id ', workout_id, Date.now()) // workout_id is passed
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
  setTimeout(()=>{
    var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>Add Date to ${workoutGLOBAL.workout_name}</h2>

<form action="/update_db" method="POST"">
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
  }, 250)

  //TODO: Different actions for different buttons
})

app.post('/update_db', (req, res) => {
  console.log('101 app.post update_db', Date.now())
  let new_date = req.body.work_out_date
  //add date to date array
  workoutGLOBAL.date_array.split(',').push(new_date)
  new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
  // console.log('108 new_date_array', new_date_array, Date.now()) // new_date_array is updated

  // Update db for new_date_array
  update_command = `
UPDATE  workouts 
SET date_array = "${new_date_array}"
WHERE id = ${workoutGLOBAL.id}
  `
  // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js
db_return = db.run(update_command)  //TODO: See if we can something with the return code
// console.log('119 db_return', db_return, Date.now())
setTimeout(()=>{
  console.log('119 setTimeout: ', Date.now(), '\n') //new_date_array is updated
  // workoutGLOBAL = {}
  retrieve_data()
    // TODO Learn about unhandled promise rejection
    setTimeout(()=>{
    // console.log('127 last update before  res.end: \n', workouts_htmlGLOBAL.slice(800,1000), Date.now())
    // workouts_htmlGLOBAL NOT updated
    res.redirect("/")
    // res.end(training_log_head_html+workouts_htmlGLOBAL)
  }, 500) // This delay is needed 1/1/22
    
    // workouts_htmlGLOBAL not updated
  

  // Reload home page
  
}, 0)  // Set to 0 1/1/22
  // console.log('pause 138', Date.now()) //executes before the timeout
})

// Connect to database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('140: Connected to database')
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
      workout_array = rows
    })
  } catch (e) {
    console.log('172 Did not retrieve data:)', e)
  }

  setTimeout(()=>{
    console.log('173 workout_array: ', Date.now(), workout_array[0].id)
    write_html(workout_array)
    }, 250) // This delay needed 1/1/22
}

function write_html(workout_array) {
  workouts_htmlGLOBAL = {}
  // console.log('179 workout_array in write_html', Date.now(), workout_array[0].date_array, '\n')
  //workout_array is updated here
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

 // }, 500) did not work here
  
  }
  write_details_end_html()
   
}

function write_details_end_html() {
  // console.log('203 in write_details_end_html', Date.now(), workouts_htmlGLOBAL.slice(800,1000))
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + '</ul></details>'
}

function write_details_beginning_html(workout_row) {
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + `<details open><summary>${workout_row.category_name}</summary>
  <ul class="workouts">`
}

function write_workouts(workout_row) {
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
  // if (workout_row.id == 1538) {
  //   console.log('236 workout_row.date_array: ', workout_row.date_array,'\n\n') 
  //   console.log('237 workout', workout)
  //   // console.log('232 write_details: ', Date.now(), '\n', workout)
  //   // workout is updated here
  // }
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + workout
//   if (workout_row.id == 1538) {
//   console.log('244: write_workouts: ', Date.now(), '\n', workouts_htmlGLOBAL.slice(800,1000))
// }
  // not updated here
  // },0)


  // res.end(training_log_head_html+workouts_html) res not defined
}

retrieve_data()

app.listen(port, () => {
  console.log(`241: server is listening on port ${port} ....`)
})

