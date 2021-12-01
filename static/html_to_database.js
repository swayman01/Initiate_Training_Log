// This doesn't work from html_to_database.js because the html file is blank
// Global variables
var workout_title, workout_link, workout_date

console.log('5 html_to_database loaded')
// This file reads the data from the training log html file and places in the form to pass the
//the NodeJS file to load into the SQL database
var SQL_dataJSON = get_categories()
var SQL_data = JSON.parse(SQL_dataJSON)
// Someday make dictionary - read how to get to NodeJS
document.getElementById("categories_data").value = SQL_dataJSON

// TODO: Clear input here?

function get_categories() {
    //This function returns an array of categories to set up the database
    let xdetails = document.getElementsByTagName('details'); // array of all workouts in a category
    let workout_categories = [];
    let categories_to_workouts = [];
    let workout_name = [];
    let workout_details = []

    for (i = 0; i < xdetails.length; i++) {
        let workout_row = [];
        category_name = xdetails[i].getElementsByTagName('summary')[0].innerText
        workout_row.push(category_name);
        workout_row.push(i);
        // console.log('28 workout_row: ',i, workout_row[0])
        let isClosed = 1;
        if (xdetails[i].open == true) isClosed = 0;
        workout_row.push(isClosed);

        let subheading = '';
        if (xdetails[i].getElementsByClassName('subheading').length > 0) {
            subheading = xdetails[i].getElementsByClassName('subheading')[0].innerText
        }
        workout_row.push(subheading);
        workout_categories.push(workout_row)
        //categories_to_workouts
        wdetails = xdetails[i].getElementsByClassName('link')
        // console.log('41 i, xdetails[i]: ', i, xdetails[i])
        workout_list = xdetails[i].getElementsByClassName('workout')
        for (j = 0; j < wdetails.length; j++) {
            // Thanks to https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
            workout_name = wdetails[j].innerText.replace(/\s\s+/g, ' ')
            categories_to_workouts.push([category_name, workout_name])
            workout_url = wdetails[j].href
            // These lines helped debug the index.html file. One workout was
            // missing <li> tags
            console.log('50 ',j, category_name, workout_name)
            console.log('51 wdetails[j]: ', wdetails[j].innerText)
            console.log('52 workout_list[j]: ', workout_list[j].innerText)
            console.log(' ')

            if(workout_list[j].getElementsByClassName('dates'))
            if (workout_list[j].getElementsByClassName('dates').length == 0) date_array = []
            else {
                date_array = workout_list[j].getElementsByClassName('dates')[0].innerText
            }
            if (workout_list[j].getElementsByClassName('comment').length == 0) workout_comment = ""
            else workout_comment = workout_list[j].getElementsByClassName('comment')[0].innerText
            if (workout_list[j].getElementsByTagName('strong').length == 0) toRepeat = 0
            else toRepeat = 1
            workout_details_row = [workout_name, workout_url, date_array, toRepeat, workout_comment]
            workout_details.push(workout_details_row)
         }
    }

    SQL_data = [workout_categories, categories_to_workouts, workout_details]
    SQL_dataJSON = JSON.stringify(SQL_data)
    let options = {
        method: 'GET',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: SQL_dataJSON
    }
    return SQL_dataJSON
}