
// Calls packages required for the app
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Defines the PORT that will be used
const db = mysql.createConnection (
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: "farmsanctuary_db"
    },
    console.log("Connected to the farmsanctuary_db database.")
);


// Array for the inital question
const initialQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "initQuestion",
        choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Exit Application"]
    }
]


// Starts app by calling intial question
start = () => {
    inquirer
        .prompt(initialQuestion)

        .then(response => {
            // Routes user to next function based on answer to intial question
            if (response === "View All Employees"){
                viewAllEmployees();
            } 
            else if (response === "Add Employee"){
                addEmployee();
            } 
            else if (response === "Update Employee Role"){
                updateEmployeeRole();
            } 
            else if (response === "View All Roles"){
                viewAllRoles();
            }
            else if (response === "Add Role"){
                addRole();
            }
            else if (response === "View All Departments"){
                viewAllDepartments();
            }
            else if (response === "Add Department"){
                addDepartment();
            }
            else return;        
        })

}

// Shows all employees in the database
viewAllEmployees = () => {

}

 // Adds an employee to the database
addEmployee = () => {

}

updateEmployeeRole = () => {

}

// Shows all roles in the database
viewAllRoles = () => {

}

// Adds a role to the database
addRole = () => {

}

// Shows all departments in the database
viewAllDepartments = () => {

}


// Adds adepartment to the database
addDepartment = () => {

}







