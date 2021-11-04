// This doesn't work from html_to_database.js because the html file is blank
// Global variables
var workout_title, workout_link, workout_date

console.log('html_to_database loaded')
var workout_categoriesJSON = get_categories()
// TODO make dictionary - read how to get to NodeJS
console.log("workout_categoriesJSON:\n", workout_categoriesJSON)
document.getElementById("transfer_data").value = workout_categoriesJSON

function get_categories() {
    //TODO generalize for multiple categories
    //TODO add to database

    //This function returns an array of categories to set up the database
    let xdetails = document.getElementsByTagName('details');
    let x = document.getElementsByTagName('summary');
    let workout_categories = [];
    
    for (i = 0; i < x.length; i++) {
        let workout_row =[];
        workout_row.push(xdetails[i].getElementsByTagName('summary')[0].innerText);
        workout_row.push(i);
        let isClosed = 1;
        if (xdetails[i].open == true) isClosed = 0;
        workout_row.push(isClosed);
        // add category closed
        let subheading = '';
        if (xdetails[i].getElementsByClassName('subheading').length>0) {
            subheading = xdetails[i].getElementsByClassName('subheading')[0].innerText
        }
        workout_row.push(subheading);
        // add TODO subheading
        workout_categories.push(workout_row)
    }
    var workout_categoriesJSON = JSON.stringify(workout_categories)
    console.log("22: ", workout_categories)
    let options = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: workout_categoriesJSON
        // body: workout_categories
    }
    return workout_categoriesJSON
    // return workout_categories
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