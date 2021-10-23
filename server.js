
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
    // Creates a promise for quering the database for current roles
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

    const getManagersFromDB = new Promise( (resolve, reject) => {
        db.query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL', (err, res) => {
            
            if (err) return res.status(400).console.log(err)

            let managers = res.map(function(manager) {
                return manager.first_name + " " + manager.last_name;
            })
            if (managers) {
                resolve(managers)
            } else {
                reject("Something went wrong");
            }
        })
    })
    
    
    // Calls the promise function incorporates the data from query into next set of questions
    Promise.all([getRolesFromDB, getManagersFromDB])
    .then((values) => {
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
                choices: values[0]
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "employeeManager",
                choices: values[1]
            },
        ]

        // Prompts the user for information about the new employee
        inquirer
            .prompt(addEmployeeQuestions)

            .then(response => {
                console.log(response.firstName);
                
                // grab responses

                //do db query for insert statements
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.first_name, response.last_name, response.employeeRole, resonse.employeeManager], (err, results) => {
                    if (err) return res.status(400).json(err);
                    res.json("Success!");
                } )
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





