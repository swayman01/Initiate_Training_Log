// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
// TODO: Check out repeats after Bare Minimum
//  Read .css file here and add to variable
//   Add body tags and javascript tags
// TODO: Organize routes - https://stackoverflow.com/questions/59681974/how-to-organize-routes-in-nodejs-express-app
//  and https://vegibit.com/node-js-routes-tutorial/
// TODO: look up guide in https://stackoverflow.com/questions/59898760/assigning-a-promise-result-to-a-variable-in-nodejs
// See Simple_Form_nodeJS.js for ways to read in css files
const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const path = require('path')
const app = express()
// TODO update base_dir to avoid hardcoded path See Multiple_Submit_Buttons.js
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
// Interval time since db does not seem to work with Promises
const INTERVAL_TIME = 500  // 500 works, 200 doesn't
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
    // console.log('45: app.get: ', Date.now(), '\n', workouts_htmlGLOBAL.slice(800,1000))
    res.end(training_log_head_html+workouts_htmlGLOBAL)
})

app.post('/', (req, res, next) => {
    // console.log('52: app.post: ', Date.now(), '\n', workouts_htmlGLOBAL.slice(800,1000))
    res.redirect("/")
  })

// Retrieve workout_id
app.post('/add_date', (req, res) => {
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

<form action="/update_db_date" method="POST">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="workout_date" name="workout_date" value=${new_date}><br>
  <input type="submit" value="Submit New Date">
  <input type="submit" value="Add New Workout" formaction="/new_workout">
  <input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>
  `
  res.end(add_date_html)
  }, INTERVAL_TIME)

})

app.post('/new_workout', (req, res) => {
  
    var new_workout_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>Add New Workout</h2>

<form action="/add_workout" method="POST">
  <label for="workout_name">Category Name:</label><br>
  <input type="text" id="category_name" name="category_name" ><br>
  <label for="workout_name">Workout Name:</label><br>
  <input type="text" id="workout_name" name="workout_name" ><br>
  <label for="workout_url">Workout URL (optional) :</label><br>
  <input type="text" id="workout_url" name="workout_url" ><br>
  <label for="date">Workout Date:</label><br>
  <input type="text" id="workout_date" name="workout_date" value=${new_date}><br>
  <label for="workout_length">Workout Length (optional) :</label><br>
  <input type="text" id="workout_length" name="workout_length" ><br>
  <label for="toRepeat">Repeat Workout (default is no) TODO make Y/N choice:</label><br>
  <input type="text" id="toRepeat" name="toRepeat" ><br>
  <label for="workout_comment">Workout Comment (optional) :</label><br>
  <input type="text" id="workout_comment" name="workout_comment" ><br>

  <input type="submit" value="Add New Workout" formaction="/update_db_workout">
  <input type="submit" value="Cancel" formaction="/">
  
</form> 
</body>
</html>

  `
  res.end(new_workout_html)
})

app.post('/update_db_date', (req, res) => {
  console.log('133 app.post update_db_date', Date.now())
  let new_date = req.body.workout_date
  //add date to date array
  workoutGLOBAL.date_array.split(',').push(new_date)
  new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
  try {
    last_dateSTR = new_date_array.split(',')[0]
    last_dateOBJ = new Date(last_dateSTR)
    last_date = last_dateOBJ.getTime()
    console.log('143 last_date', Date.now(), last_date)
  }
    catch(err) {
      console.log('146 err: ', err, '\n')
    }
  // Update db for new_date_array and last_date
  update_command = `
UPDATE  workouts 
SET date_array = "${new_date_array}",
last_date = "${last_date}"
WHERE id = ${workoutGLOBAL.id}
  `
  // Reference: https://stackoverflow.com/questions/6597493/synchronous-database-queries-with-node-js
  db_return = db.run(update_command) //TODO: See if we can something with the return code
  // console.log('119 db_return', db_return, Date.now())
  console.log('\n149 update_command: ', Date.now()) //new_date_array is updated
  setTimeout(() => {
    retrieve_data()
  }, INTERVAL_TIME) // This delay is needed 1/1/22
  // TODO Learn about unhandled promise rejection
  setTimeout(() => {
    // Reload home page
    console.log('156 redirect after update_command: ', Date.now(), '\n')
    res.redirect("/")
  }, INTERVAL_TIME * 2) // Set to 0 1/1/22
  // console.log('pause 127', Date.now()) //executes before the timeout
})

app.post('/update_db_workout', (req, res) => {
  // TODO: Sort by date
      category_name = req.body.category_name;
      table = 'workouts'
      workout_name = req.body.workout_name;
      workout_url = req.body.workout_url;
      date_array = req.body.workout_date;
      last_dateOBJ = new Date(date_array)
      last_date = last_dateOBJ.getTime()
      if (isNaN(last_date)) last_date = 0
      workout_length = req.body.workout_length;
      toRepeat = req.body.toRepeat
      workout_comment = req.body.workout_comment;
      console.log('172 req.body', Date.now(), req.body)
      // Check for existing category
      var select_categories = `
    SELECT id, category_name, category_position, isClosed, category_subheading
    FROM categories 
    WHERE category_name = '${category_name}'
    LIMIT 1
    `
      db.get(select_categories, [], (err, rows) => {
        if (err) {
          console.log('181 err: ', Date.now(), err)
          // TODO Add error handling here
        }
        console.log('184 rows in categories: ', Date.now(), rows)
        if (rows == undefined) {
          console.log(Date.now(), 'Category Does Not Exist. Capability to be added. In the meantime add using DB Browser.')
          res.end('/')
        } else {
          table = 'categories_to_workouts'
          db.run(`INSERT INTO ${table} (workout_name, category_name) 
                      VALUES(?, ?)`, [workout_name, category_name]);
          console.log('193 db_return for categories_to_workouts', Date.now())
          //TODO set error

          setTimeout(() => {
            console.log('\n196', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
            table = 'workouts'
            console.log('197 setTimeout: ', Date.now(), '\n')
            // workout_categories = rows
            db.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                      VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
            console.log('201 db_return for workouts', Date.now())

          }, INTERVAL_TIME)

          setTimeout(() => {
            console.log('202 call retrieve_data ', Date.now())
            retrieve_data()
          }, INTERVAL_TIME * 2) // This delay is needed 1/1/22

          setTimeout(() => {
            // Reload home page
            console.log('213redirect to home page in retrieve_data ', Date.now())
            res.redirect("/")
            // res.end(training_log_head_html+workouts_htmlGLOBAL)

          }, INTERVAL_TIME * 3) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
        }
      })
  
})

// Connect to database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('140: Connected to database', Date.now())
})

var workout_array = []
let retrieve_data = async function retrieve_data() {
  try {
    //db.open //db.open is not a function
    console.log('265 start retrieve_data: ', Date.now())
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
      if (err) {
        console.log('279 error in join_categories_to_workouts', Date.now(), err)
      }
    })
    // TODO - Use a if (err) to catch the error)
  } catch (e) {
    console.log('284 Did not retrieve data:)', e) // Is this used?
  }

  setTimeout(()=>{
    write_html(workout_array)
    }, INTERVAL_TIME) // This delay needed 1/1/22
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
      // TODO Fix undefined for the first row
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
  <form action="/add_date" method="POST">
    <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
  <button type="submit" class="block">+</button>
</form> 
  `
  workout = `
  <li id="wo_${workout_row.id}" "class="workout" >
                <p>attempt to force one line
                <span id="wos_${workout_row.id}" class="push_button" "display:inline-block">${add_date}
                <a href="${workout_row.workout_url}"
                    target="_blank" rel="noopener noreferrer" class="link">${workout_row.workout_name}</a>
                </span>
                </p>
                <p>
                <span class="length">${workout_row.workout_length}</span>
                <span class="separator">-</span>
                <span class="dates">${workout_row.date_array}</span>
                <span class="comments">${workout_row.workout_comment}</span>
                </p>
            </li>
  `
  // if (workout_row.id == 1538) {
  //   console.log('236 workout_row.date_array: ', workout_row.date_array,'\n\n') 
  //   console.log('237 workout', workout)
  //   // workout is updated here
  // }
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + workout
//   if (workout_row.id == 1538) {
//   console.log('244: write_workouts: ', Date.now(), '\n', workouts_htmlGLOBAL.slice(800,1000))
// }
  // not updated here
  // },0)


}

retrieve_data()

app.listen(port, () => {
  console.log(`241: server is listening on port ${port} ....`)
})

