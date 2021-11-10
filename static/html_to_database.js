// This doesn't work from html_to_database.js because the html file is blank
// Global variables
var workout_title, workout_link, workout_date

console.log('5 html_to_database loaded')
// This file reads the data from the training log html file and places in the form to pass the
//the NodeJS file to load into the SQL database
var SQL_dataJSON = get_categories()
var SQL_data = JSON.parse(SQL_dataJSON)
// TODO make dictionary - read how to get to NodeJS
console.log("9 workout_categoriesJSON:\n", SQL_data[0])
document.getElementById("categories_data").value = SQL_dataJSON
// document.getElementById("categories_to_workouts_data").value = categories_to_workouts_dataJSON
document.getElementById("categories_to_workouts_data").value = SQL_dataJSON

// TODO: Clear input here?

function get_categories() {
    //This function returns an array of categories to set up the database
    let xdetails = document.getElementsByTagName('details');
    // let x = document.getElementsByTagName('summary');
    let workout_categories = [];
    let categories_to_workouts = [];
    let workout_name = [];

    for (i = 0; i < xdetails.length; i++) {
        let workout_row = [];
        category_name = xdetails[i].getElementsByTagName('summary')[0].innerText
        workout_row.push(category_name);
        workout_row.push(i);
        let isClosed = 1;
        if (xdetails[i].open == true) isClosed = 0;
        workout_row.push(isClosed);
        // add category closed
        let subheading = '';
        if (xdetails[i].getElementsByClassName('subheading').length > 0) {
            subheading = xdetails[i].getElementsByClassName('subheading')[0].innerText
        }
        workout_row.push(subheading);
        workout_categories.push(workout_row)
        //categories_to_workouts
        wdetails = xdetails[i].getElementsByClassName('link')
        for (j = 0; j < wdetails.length; j++) {
            workout_name = wdetails[j].innerText
            categories_to_workouts.push([workout_name, category_name])
        }
        // console.log('44 categories_to_workouts\n', categories_to_workouts)
    }
    var workout_categoriesJSON = JSON.stringify(workout_categories)
    var categories_to_workouts_dataJSON = JSON.stringify(categories_to_workouts)
    SQL_data = [workout_categories, categories_to_workouts]
    SQL_dataJSON = JSON.stringify(SQL_data)
    // console.log("49: ", SQL_dataJSON)
    let options = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: SQL_dataJSON
}
    // var categories_to_workouts_dataJSON = JSON.stringify(categories_to_workouts_data)
    // console.log("53: ", categories_to_workouts_data)
    //     options = {
    //     method: 'GET',
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     },
    //     body1: categories_to_workouts_dataJSON
    // }
    return SQL_dataJSON
}
// Maybe: try socketio
// from https://stackoverflow.com/questions/7733848/how-do-i-pass-data-from-the-client-side-to-my-nodejs-server-using-socketio
// Yes. Client side or server side you simply emit events and handle events.

// client side:

// var socket = io.connect('http://localhost');
// socket.emit('my other event', { my: 'data' });
// server side:

// io.sockets.on('connection', function (socket) {
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });