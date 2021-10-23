
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



const addRoleQuestions = [


]

const addDepartmentQuestions = [


]
// Starts app by calling intial question
start = () => {
    inquirer
        .prompt(initialQuestion)

        .then(response => {

            // Routes user to next function based on answer to intial question
            if (response.initQuestion === "View All Employees"){
                viewAllEmployees();  
            } 
            else if (response.initQuestion === "Add Employee"){
                addEmployee();
            } 
            else if (response.initQuestion === "Update Employee Role"){
                updateEmployeeRole();
            } 
            else if (response.initQuestion === "View All Roles"){
                viewAllRoles();
            }
            else if (response.initQuestion === "Add Role"){
                addRole();
            }
            else if (response.initQuestion === "View All Departments"){
                viewAllDepartments();
            }
            else if (response.initQuestion === "Add Department"){
                addDepartment();
            }
            else return; 
        })
}

// Shows all employees in the database
viewAllEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) return res.status(400).console.log(err)
        console.table(res);
        start();
    })
};

 // Adds an employee to the database
addEmployee = () => {

    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title FROM role`, (err, res) => {
            if (err) return res.status(400).console.log(err)
            // let currentRoles = res.body.title;
            
            let roleTitles = res.map(function(results) {
                return results.title; 
            })

            if (roleTitles) {
                resolve(roleTitles)
            } else {
                reject("Something went wrong");
            }
        })
    })

    getRolesFromDB
    .then( roleTitles => {
        const addEmployeeQuestions = [
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employeeRole",
                choices: roleTitles
            },
        ]

        inquirer
            .prompt(addEmployeeQuestions)

            .then(response => {
                console.log(response);
            })
    })
    .catch( err => 
        console.log(err))   
};

updateEmployeeRole = () => {

};

// Shows all roles in the database
viewAllRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) return res.status(400).console.log(err)
        console.table(res);
        start();
    })
};

// Adds a role to the database
addRole = () => {

};

// Shows all departments in the database
viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) return res.status(400).console.log(err)
        console.table(res);
        start();
    })
};

// Adds adepartment to the database
addDepartment = () => {

};



// Calls start function 
start();





