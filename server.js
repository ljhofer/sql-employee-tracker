
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
    // Creates a promise for querying the database for current roles
    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title, id FROM role`, (err, res) => {
            if (err) return res.status(400).console.log(err)
            
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    })

    // Creates a promise for querying the database for current managers
    const getManagersFromDB = new Promise( (resolve, reject) => {
        db.query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL', (err, res) => {
            
            if (err) return res.status(400).console.log(err)

            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    })
    

    // Calls the promise function incorporates the data from query into next set of questions
    Promise.all([getRolesFromDB, getManagersFromDB])
    .then((values) => {

        // Creates a variable of the current roles to pass into the questions
        let roleTitles = values[0].map(function(results) {
            return results.title; 
        })

        // Creates a varible of the current managers to pas into the questions
        let managers = values[1].map(function(manager) {
            return manager.first_name + " " + manager.last_name;  })

        // Defines the add employee questions and sets choices equal to the current values in the database
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
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "employeeManager",
                choices: managers
            },
        ]

        // Prompts the user for information about the new employee
        inquirer
            .prompt(addEmployeeQuestions)

            .then(response => {
                
                let chosenRole = response.employeeRole;
                let chosenManager = response.employeeManager;
                                
                // Iterates over the roles to find the index vlaue for the role selected
                let roleIndexNumber = values[0].findIndex(function(role) {
                    return chosenRole === role.title;
                })  

                // Sets the value of the role id number for the role selected 
                let thisRoleId = values[0][roleIndexNumber].id;

                 // Iterates over managers to find the index vlaue for the manager selected
                 let managerIndexNumber = values[1].findIndex(function(manager) {
                    return chosenManager === manager.first_name + " " + manager.last_name;
                })  

                // Sets the value of the manager id number for the manager selected 
                let thisManagerId = values[1][managerIndexNumber].id;
         
                // Queries with insert statement to add employee to database
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [response.firstName, response.lastName, thisRoleId, thisManagerId], (err, results) => {
                    if (err) return res.status(400).json(err);

                    console.log("Added " + response.firstName + " " + response.lastName + " to the database.")
                    
                    // Calls the start function
                    start();
                })
            })
    })
    .catch( err => 
        console.log(err))   
};

// Updates an employee's role in the database
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

// Adds a department to the database
addDepartment = () => {

};



// Calls start function 
start();





