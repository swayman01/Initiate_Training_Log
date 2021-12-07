// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
// TODO: Check out repeats
const sqlite3 = require('sqlite3').verbose();
const express = require('express')
const path = require('path')
const app = express()
const axios = require('axios');
const base_dir = '/Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice'
const {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  appendFileSync
} = require('fs')
// const { readFile, writeFile, appendFile } = require('fs').promises// - TODO - this creates base program to crash
const port = 5001

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

// Load header file
app.get('/', (req, res, next) => {
  readFile('./index.html', 'utf8', (err, result) => {
    res.end(training_log_head_html+workouts_html)
  })
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
    workout_url, date_array, toRepeat, workout_comment
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
      console.log('70: ', workout_array)
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
  console.log(workouts_html)
}

function write_details_end_html() {
  console.log('</ul></details>')
  workouts_html = workouts_html + '</ul></details>'
}

function write_details_beginning_html(workout_row) {
  console.log(`<details open><summary>${workout_row.category_name}</summary><ul class="workouts">`)
  workouts_html = workouts_html + `<details open><summary>${workout_row.category_name}</summary><ul class="workouts">`
}

function write_workouts(workout_row) {
  //TODO Add Strong to name
  //TODO Add dates routine
  workout = `
  <li class="workout">
                <a href="${workout_row.workout_url}"
                    target="_blank" rel="noopener noreferrer" class="link">${workout_row.workout_name}</a>
                </span>
                <span class="length">$workout_row.workout_length}</span>
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
