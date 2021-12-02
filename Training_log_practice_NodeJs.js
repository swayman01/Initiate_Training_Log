// cd /Users/swayman/Documents/Classes/NodeJs/Practice/Training_log_practice
// nodemon Training_log_practice_NodeJs.js
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
    res.end(training_log_head_html)
  })
})

// Connect to database
var db = new sqlite3.Database('./db/initial_training_log.db', (err) => {
  if (err) {
    console.log('Could not connect to database:', err)
  }
})
console.log('Connected to database')
var join_categories_to_workouts = `
SELECT category_position, isClosed, category_subheading, categories.category_name, workouts.workout_name,
workout_url, date_array, toRepeat, workout_comment
FROM categories 
INNER JOIN categories_to_workouts 
on categories.category_name = categories_to_workouts.category_name
INNER JOIN workouts
on categories_to_workouts.workout_name = workouts.workout_name
ORDER BY category_position, last_date DESC

`
workout_array = []
db.all(join_categories_to_workouts, [], (err, rows) => {
  if (err) {
    throw(err)
  }
  i = 0;
  workout_array = rows
  rows.forEach((row) => {
    i+=1;
    console.log('66: ',i, row.category_position, row.category_name, row.workout_name, row.date_array);
  });
})
console.log('56: or here')
// db.all('SELECT * FROM categories', [], (err, rows) => {
//   if (err) {
//     throw(err)
//   }
//   rows.forEach((row) => {
//     console.log('51: ', row.category_name);
//   });

// })

// app.all('*', (req, res) => {
//   res.status(404).send('resource not found')
// })

app.listen(port, () => {
  console.log(`server is listening on port ${port} ....`)
})

function write_details() {

}

// Sync version
// global.html_head = readFileSync('./head_input.html', 'utf8')
// global.html_body_1 = readFileSync('./body_1.html', 'utf8')
// writeFileSync(
//   './sync_test.html',
//   `${html_head}, ${html_body_1}`,
//   { flag: 'a' }
// )
// console.log('27: completed sync test')

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










