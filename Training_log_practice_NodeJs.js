// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
// TODO:Check out occasional name not defined in title of add_date.html
// TODO: Check out repeats after Bare Minimum
//  Read .css file here and add to variable
//   Add body tags and javascript tags
// TODO: Organize routes - https://stackoverflow.com/questions/59681974/how-to-organize-routes-in-nodejs-express-app
//  and https://vegibit.com/node-js-routes-tutorial/
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
// const { readFile, writeFile, appendFile } = require('fs').promises// - TODO - this creates base program to crash
const port = 5001

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
  // console.log('26: ', data)
  // console.log('27: ', training_log_head_html)
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
  console.log('56 workout_id ', workout_id, Date.now())
  // Moved from retrieve_workout
  let select_workout = `
    SELECT workout_name, workout_url, date_array, toRepeat, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
      db.get(select_workout, [], (err, row) => {
        workout = row
        console.log('61 workout in retrieve_workout', workout, row.workout_name)
      })
  // retrieve_workout(workout_id).then(() =>{
  // console.log('58 x: ',x, workoutGLOBAL, Date.now())})

  // retrieve_workout(workout_id)
  // console.log('61 x: ',x, workoutGLOBAL, Date.now())

  // Moved to retrieve_workout 12/24/21
  var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>Add Date to ${workout.workout_name}</h2>

<form action="/update_db.html" method="POST"">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="work_out_date" name="work_out_date" value="Today's Date"><br>
  <input type="submit" value="Submit New Date">
</form> 

<div><span>Cancel Button</span><span>Edit Workout Button</span><span>Add New Workout Button</span></div>

</body>
</html>

  `
  res.end(add_date_html)
  // end Moved to retrieve_workout 12/24/21

  // res.sendFile(path.resolve(base_dir, './add_date.html'))
  // res.send(req.body.name)
})

app.post('/update_db.html', (req, res) => {
  console.log('58 update database here', workout)


  // res.sendFile(path.resolve(base_dir, './add_date.html'))
  // res.send(req.body.name)
})

// Connect to database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  } else console.log('43: Connected to database')
})

var workout_array = []
workout_array
//TODO Add Workout Length
let retrieve_data = async function retrieve_data() {
  try {
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
      // if (err) {
      //   throw(err)
      // }
      i = 0;
      workout_array = rows
      rows.forEach((row) => {
        i+=1;
        workout_array.push(row)
        // console.log('68: ',i, row.category_position, row.category_name, row.workout_name, row.date_array);
      });
      // console.log('70: ', workout_array)
      write_html(workout_array)
    })
  } catch (e) {
    console.log('Did not retrieve data:)', e)
  }
}

// let retrieve_workout = async function retrieve_workout(workout_id) {
  async function retrieve_workout(workout_id) {
    try {
      let select_workout = `
    SELECT workout_name, workout_url, date_array, toRepeat, workout_length, toRepeat, workout_comment, workouts.id
    FROM workouts 
    WHERE id = ${workout_id}
    LIMIT 1
    `
      db.get(select_workout, [], (err, row) => {
        workout = row
        console.log('145 workout in retrieve_workout', workout, Date.now())
// Moved from xxx 12/24/21
var add_date_html = `
  <!DOCTYPE html>
<html>
<body>

<h2>Add Date to Workout Name (use {})</h2>

<form action="/update_db.html" method="POST"">
  <label for="date">Workout Date:</label><br>
  <input type="text" id="work_out_date" name="work_out_date" value="Today's Date"><br>
  <input type="submit" value="Submit New Date">
</form> 

<div><span>Cancel Button</span><span>Edit Workout Button</span><span>Add New Workout Button</span></div>

</body>
</html>

  `
  res.send(add_date_html)

// End moved from xxx 12/24/21

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
  // console.log("98:\n", workouts_html)
}

function write_details_end_html() {
  workouts_html = workouts_html + '</ul></details>'
}

function write_details_beginning_html(workout_row) {
  // console.log(`<details open><summary>${workout_row.category_name}</summary><ul class="workouts">`)
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



// x = retrieve_data()
retrieve_data()

app.listen(port, () => {
  console.log(`132: server is listening on port ${port} ....`)
})



//Async version
// Read files
// Modify header (if needed)
// Write html file when both files are read and modified


// var head_input = './head_input.html'
// var body_1 = './body_1.html'
// write_head_and_body_1('./head_input.html', './body_1.html')
// TODO Look for way to pass arguments
// Paused at 3:04:17
//End Async test


// app.use(express.static(path.join(base_dir, 'static')))
// app.use(express.json())

// Load index file
// app.get('/', (req, res, next) => {
//   readFile('./index.html', 'utf8', (err, result) => {
//     console.log('65: reading index.html')
//     if (err) {
//       console.log(err)
//       return
//     }
//     res.sendFile(path.resolve(base_dir, './index.html'))
//   })
// })

// readFile('./body_1.html', 'utf8', (err, result) => {
//   //callback function executes when done
//   if (err) {
//     console.log('110:\n', err);
//   }
//   body_1 = result
//   console.log('41 inside function\n', body_1)
//   })
// read_modify_write_header_sync('./head_input.html')


// app.use(express.urlencoded({
//   extended: false
// })) //parse form data

//         var data_for_SQL = req.body;
//         // console.log(' 47 req.body\n', req.body)
//         // console.log(' 48 data_for_SQL:\n', data_for_SQL)
//         // console.log(' 49 data_for_SQL.transfer_data[0]:\n', data_for_SQL.transfer_data[0])
//         data_list = JSON.parse(data_for_SQL.transfer_data) 
//         console.log('152 data_list', data_list, '\n', data_list[0], data_list[1])
//         for (let i=0; i<data_list.length-1; i++) {
//           category_name = data_list[i][0];
//           category_position = data_list[i][1];
//           isClosed = data_list[i][2];
//           category_subheading = data_list[i][3];
//           db.run(`INSERT INTO categories (category_name, category_position, isClosed, category_subheading) 
//             VALUES(?, ?, ?, ?)`,[category_name, category_position, isClosed, category_subheading], (err) => {
//             //reference https://stackabuse.com/a-sqlite-tutorial-with-node-js/{
//               if (err) {
//                   console.log(err.message)
//               } else {
//                   console.log('added row')
//               }
//             })}
//             db.close()
//         res.redirect('/')
//       })


// function read_modify_write_header_sync(head_input) {
//   readFile(head_input, 'utf8', (err, result) => {
//     //callback function executes when done
//     if (err) {
//       console.log("75:\n", err);
//     }
//     // console.log("result:\n", result, "end of result")
//     //     const first = result // How to sequence Asynchronous actions
//     //     readFile('./HelloWorld.js', 'utf8', (err, result) => {
//     //         if (err) {
//     //             console.log(err);
//     //             return
//     //         }
//     //         // console.log("result:\n", result)
//     //         const second = result
//     //         writeFile(
//     //             './result_async.txt',
//     //             `Here is the result: ${first}, ${second}`,
//     //             {flag: 'a'},
//     //             (err,result)=>{
//     //             }
//     //  

//     html_head = result
//     writeFile('./test.html', html_head, (err,result)=>{

//     })
//     appendFileSync('./test.html', html_head, (err,result)=>{

//     })
//     console.log('96 inside function\n', html_head)
//   })
//   }
// TODO: look up guide in https://stackoverflow.com/questions/59898760/assigning-a-promise-result-to-a-variable-in-nodejs
