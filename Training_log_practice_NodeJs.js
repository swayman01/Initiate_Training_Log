// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
// TODO: Check out repeats after Bare Minimum
//  Read .css file here and add to variable
//   Add body tags and javascript tags
// TODO: Organize routes - https://stackoverflow.com/questions/59681974/how-to-organize-routes-in-nodejs-express-app
//  and https://vegibit.com/node-js-routes-tutorial/
// TODO: look up guide in https://stackoverflow.com/questions/59898760/assigning-a-promise-result-to-a-variable-in-nodejs
// See Simple_Form_nodeJS.js for ways to read in css files
// TODO: fix date sort for 2 digit months
// TODO: Open/Close on Categories
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
var workout_actionGLOBAL = ''
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
app.post('/modify_workouts', (req, res) => {
  var workout_id = req.body.name
  console.log('54 workout_id ', workout_id, Date.now()) // workout_id is passed
  today = new Date()
  new_date = date_format.format(today,'MM/DD/YYYY')
  workout_actionGLOBAL = 'Modify'

  let select_workout = `
    SELECT workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
    // TODO: Make async function
    db.get(select_workout, [], (err, row) => {
    workoutGLOBAL = row
    console.log('73 workoutGLOBAL in retrieve_workout', Date.now(), workoutGLOBAL)
  })
  setTimeout(()=>{
    var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>${workout_actionGLOBAL} ${workoutGLOBAL.workout_name}</h2>

<form action="/update_db_date" method="POST">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="workout_date" name="workout_date" value=${new_date}><br>
  <input type="submit" value="Submit New Date">
  <input type="submit" value="Add New Workout" formaction="/new_workout">
  <input type="submit" value="Edit This Workout" formaction="/edit_workout">
  <input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>
  `
  res.end(add_date_html)
  }, INTERVAL_TIME)

})

app.post('/new_workout', (req, res) => {
  workout_actionGLOBAL = 'Add'
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

app.post('/edit_workout', (req, res) => {
  // TODO Add checks for undefined
  // TODO Add Categories, comma separated
  toRepeat = 'N'
  if ((workoutGLOBAL.toRepeat == 1) || (workoutGLOBAL.toRepeat == 'Y')) toRepeat = 'Y'
  workout_name = workoutGLOBAL.workout_name
  console.log('141 workout_name ', Date.now(), workout_name)
  workout_actionGLOBAL = 'Edit'
  var edit_workout_html = `
<!DOCTYPE html>
<html>
<body>

<h2>${workout_actionGLOBAL} Workout ${workoutGLOBAL.workout_name}</h2>

<form action="/add_workout" method="POST">
<label for="workout_name">Category Name:</label><br>
<input type="text" id="category_name" name="category_name" ><br>
<label for="workout_url">Workout URL (optional) :</label><br>
<input type="text" id="workout_url" name="workout_url" value="${workoutGLOBAL.workout_url}"><br>
<label for="date">Workout Dates:</label><br>
<input type="text" id="workout_date" name="workout_date" value="${workoutGLOBAL.date_array}"><br>
<label for="workout_length">Workout Length (optional) :</label><br>
<input type="text" id="workout_length" name="workout_length" value="${workoutGLOBAL.workout_length}" ><br>
<label for="toRepeat">Repeat Workout:</label><br>
<input type="text" id="toRepeat" name="toRepeat" value="${toRepeat}"><br>
<label for="workout_comment">Workout Comment (optional) :</label><br>
<input type="text" id="workout_comment" name="workout_comment" value="${workoutGLOBAL.workout_comment}"><br>
<input type="submit" value="Save Changes" formaction="/update_db_workout">
<input type="submit" value="Cancel" formaction="/">
</form> 
</body>
</html>

`
res.end(edit_workout_html)
})

app.post('/update_db_date', (req, res) => {
  console.log('170 app.post update_db_date', Date.now())
  let new_date = req.body.workout_date
  //add date to date array
  workoutGLOBAL.date_array.split(',').push(new_date)
  new_date_array = new_date.concat(', ', workoutGLOBAL.date_array)
  try {
    last_dateSTR = new_date_array.split(',')[0]
    last_dateOBJ = new Date(last_dateSTR)
    last_date = last_dateOBJ.getTime()
    console.log('179 last_date', Date.now(), last_date)
  }
    catch(err) {
      console.log('182 err: ', err, '\n')
    }
  // Update db for new_date_array and last_date
  update_command = `
UPDATE workouts 
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
  }, INTERVAL_TIME * 2)
})

app.post('/update_db_workout', (req, res) => {
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
      console.log('223 req.body', Date.now(), req.body)
      // Check for existing category
      var select_categories = `
    SELECT id, category_name, category_position, isClosed, category_subheading
    FROM categories 
    WHERE category_name = '${category_name}'
    LIMIT 1
    `
      db.get(select_categories, [], (err, rows) => {
          if (err) {
            console.log('233 err: ', Date.now(), err)
            // TODO Add error handling here
          }
          console.log('236 rows in categories: ', Date.now(), workout_actionGLOBAL, rows)
          // workout_name = workoutGLOBAL.workout_name
          if (workout_actionGLOBAL == 'Add') {
            //TODO modify when adding categories
            if (rows == undefined) {
              console.log(Date.now(), 'Category Does Not Exist. Capability to be added. In the meantime add using DB Browser.')
              res.end('/')
            } else {
              table = 'categories_to_workouts'
              db.run(`INSERT INTO ${table} (workout_name, category_name) 
                      VALUES(?, ?)`, [workout_name, category_name]);
              console.log('241193 db_return for categories_to_workouts', Date.now())
              //TODO set error
            }
            setTimeout(() => {
              console.log('\n252', Date.now(), workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date)
              table = 'workouts'
              console.log('254 setTimeout: ', Date.now(), '\n')
              db.run(`INSERT INTO ${table} (workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date) 
                      VALUES(?, ?, ?, ?, ?, ?, ?)`, [workout_name, workout_url, date_array, workout_length, toRepeat, workout_comment, last_date]);
            }, INTERVAL_TIME * 2)
          }
          if (workout_actionGLOBAL == 'Edit') {
            setTimeout(() => {
            console.log('262 db.run Update', Date.now())
            db.run(`UPDATE ${table} 
            SET workout_url = "${workout_url}",
            date_array = "${date_array}",
            workout_length = "${workout_length}",
            toRepeat = "${toRepeat}",
            workout_comment = "${workout_comment}",
            last_date = "${last_date}"
            WHERE id = "${workoutGLOBAL.id}"
            `)
            if (err) {
              console.log('271 update error: ', err)
            }
          })
        }
          setTimeout(() => {
            console.log('277 call retrieve_data ', Date.now())
            retrieve_data()
          }, INTERVAL_TIME * 3) // This delay is needed 1/1/22

          setTimeout(() => {
            // Reload home page
            console.log('262 redirect to home page in retrieve_data ', Date.now())
            res.redirect("/")
          }, INTERVAL_TIME * 4) // Set to 0 1/1/22, reset on 1/6/22 after adding functionality
        })
      })
  

// Connect to database
var db = new sqlite3.Database('./db/training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('140: Connected to database', Date.now())
})

var workout_array = []
let retrieve_data = async function retrieve_data() {
  try {
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
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + '</ul></details>'
}

function write_details_beginning_html(workout_row) {
  if (workout_row.isClosed == 1) details = 'open'
  else details = 'closed'
  workouts_htmlGLOBAL = workouts_htmlGLOBAL + `<details ${details}><summary>${workout_row.category_name}</summary>
  <ul class="workouts">`
}

function write_workouts(workout_row) {
  // Put button and form on one line
  var add_date = `
  <form action="/modify_workouts" method="POST">
    <input type="hidden" name="name" id="name" autocomplete="false" value=${workout_row.id}>
  <button type="submit" class="block">+</button>
</form> 
  `
  // console.log('350 toRepeat', workout_row.toRepeat, workout_row.workout_name)
  strong_a = ' '
  strong_b = ' '
  if ((workout_row.toRepeat=='Y') || (workout_row.toRepeat=='1')) {
    strong_a = '<strong>'
    strong_b = '</strong>'
  }
  
// Start modifications
//<li id="wo_1" "class=" workout">
    // <div id="wos_1" class="flex-container" "push_button">
    //   <div>
  //       <form action="/modify_workouts" method="POST">
  //         <input type="hidden" name="name" id="name" autocomplete="false" value=1>
  //         <button type="submit" class="block">+</button>
  //       </form>
  //     </div>
  //     <div> <a href="https://manflowyoga.tv/programs/mfyl-workout-for-core-strength-breathing-balance" target="_blank"
  //         rel="noopener noreferrer" class="link"> Workout for Core Strength, Breathing, & Balance (BSF #2) </a>
  //       </div>
  //     <div class="length">26:27</div>
  //     <div class="separator">-</div>
  //     <div class="dates">11/18/20, 11/4/20</div>
  //     <div class="comments"></div>
  //   </div>
  // </li>

// End Modifications


  workout = `
  <li id="wo_${workout_row.id}" "class="workout" >
    <div class="flex-container" "push_button">
      <div>
       ${add_date}
      </div>
      <div>   
        <a href="${workout_row.workout_url}"
            target="_blank" rel="noopener noreferrer" 
            class="link">${strong_a}${workout_row.workout_name}${strong_b}</a>
        </div>  
        <div class="length">${workout_row.workout_length}</div>
        <div class="separator">-</div>
        <div class="dates">${workout_row.date_array}</div>
        <div class="comments">${workout_row.workout_comment}</div>
      </div>
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

