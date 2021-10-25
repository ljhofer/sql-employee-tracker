
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


// Starts app by calling intial question
start = () => {

    // Array for the inital question
    const initialQuestion = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "initQuestion",
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Exit Application"]
        }
    ]

    // Prompts user with inital questions
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
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

 // Adds an employee to the database
addEmployee = () => {
    // Creates a promise for querying the database for current roles
    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title, id FROM role`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    // Creates a promise for querying the database for current managers
    const getManagersFromDB = new Promise( (resolve, reject) => {
        db.query('SELECT first_name, last_name, id FROM employee WHERE manager_id IS NULL', (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });
    

    // Calls the promise functions 
    Promise.all([getRolesFromDB, getManagersFromDB])
    .then((values) => {

        // Creates a variable of the current roles to pass into the questions
        let roleTitles = values[0].map(function(results) {
            return results.title; 
        })

        // Creates a varible of the current managers to pas into the questions
        let managers = values[1].map(function(manager) {
            return manager.first_name + " " + manager.last_name; 
        })

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
                                
                // Iterates over the roles to find the index valaue for the role selected
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
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Added " + response.firstName + " " + response.lastName + " to the database.")
                    
                    // Calls the start function
                    start();
                })
            })
    })
    .catch( err => 
        console.log(err));  
};

// Updates an employee's role in the database
updateEmployeeRole = () => {
    // Creates a promise for querying the database for current employees
    const getEmployeesFromDB = new Promise( (resolve, reject) => { 
        db.query(`SELECT first_name, last_name, id FROM employee`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    // Creates a promise for querying the database for current roles
    const getRolesFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT title, id FROM role`, (err, res) => {   
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    });

    Promise.all([getEmployeesFromDB, getRolesFromDB])
    .then((values) => {
        
        // Creates a variable of the current employees
        let currentEmployees = values[0].map(function(employee) {
            return employee.first_name + " " + employee.last_name;
        })

        let currentRoles = values[1].map(function(employee) {
            return employee.title;
        })

        // Defines the update role questions and sets the answers choices equal to the current values in the database
        const updateEmployeeRoleQuestions = [
            {
                type: "list",
                message: "Which employee's role would you like to update?",
                name: "employeeToUpdate",
                choices: currentEmployees
            },
            {
                type: "list",
                message: "Which role would you like to assign to chosen employee?",
                name: "updatedRole",
                choices: currentRoles
            }
        ]

        // Prompts the user for the information about the role to be updated
        inquirer    
            .prompt(updateEmployeeRoleQuestions)

            .then(response => { 

                let chosenEmployee = response.employeeToUpdate;
                let chosenRole = response.updatedRole;

                // Iterates over the employees to find the index value of the employee being updated
                let employeeIndexNumber = values[0].findIndex(function(employee) {
                    return chosenEmployee === employee.first_name + " " + employee.last_name;
                })

                // Sets the value of the employee id number for the employee selected
                let thisEmployeeId = values[0][employeeIndexNumber].id;


                // Iterates over the roles to find the index value of the role selected
                let roleIndexNumber = values[1].findIndex(function(role){
                    return chosenRole === role.title;
                })

                // Set the value of role id number to the role selected
                let thisRoleId = values[1][roleIndexNumber].id;

                // Queries with update statement to update employee's role in database
                db.query(`UPDATE employee SET role_id = (?) WHERE id= (?)`, [thisRoleId, thisEmployeeId], (err, results) => {
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Updated " + chosenEmployee + " in the database.")
                    
                    // Calls the start function
                    start();
                })
            })
    })
}

// Shows all roles in the database
viewAllRoles = () => {
    db.query(`SELECT title, role.id AS role_id, department.name AS department, salary FROM role JOIN department ON role.department_id = department.id`, (err, res) => {
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

// Adds a role to the database
addRole = () => {
    // Creates a promise for querying the database for current departments
    const getDepartmentsFromDB = new Promise( (resolve, reject) => {
        db.query(`SELECT name, id FROM department`, (err, res) => {
            if (res) {
                resolve(res)
            } else {
                reject("Something went wrong");
            }
        })
    })
    
    // Calls the promise function
    getDepartmentsFromDB
    .then((values) => {

        // Creates a variable of the current departments to pass into the next set of questions
        let departments = values.map(function(results) {
            return results.name;
        })        

        // Defines the questions for adding a role and sets the answer options in department question equal to the list of current departments
        const addRoleQuestions = [
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName"
            },
            {
                type: "input",
                message: "What is the salary of the role?",
                name: "roleSalary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "roleDepartment",
                choices: departments
            },
        ]

        inquirer
            .prompt(addRoleQuestions)

            .then(response => {

                let chosenDepartment = response.roleDepartment;

                // Iterates over the department to find the index value of the chosen department
                let departmentIndexNumber = values.findIndex(function(department){
                    return chosenDepartment === department.name;
                })

                // Sets the value of the department id number for the department chosen
                let thisDepartmentId = values[departmentIndexNumber].id;

                // Queries with insert statement to add role to the database
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [response.roleName, response.roleSalary, thisDepartmentId], (err, res) => {
                    if (err) {
                        return console.log(err);
                      }
                    console.log("Added " + response.roleName + " to the database");

                    // Calls the start function
                    start();
                })
            })
    })
    .catch( err =>
        console.log(err));   
};

// Shows all departments in the database
viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) {
            return console.log(err);
          }
        console.table(res);
        start();
    })
};

// Adds a department to the database
addDepartment = () => {
    // Array for question
    const addDepartmentQuestions = [
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        },
    ]

    inquirer
        .prompt(addDepartmentQuestions)

        .then(response => {

            // Queries with insert statement to add role to the database
            db.query(`INSERT INTO department (name) VALUES (?)`, (response.departmentName), (err, res) => {
                if (err) {
                    return console.log(err);
                  }
                console.log("Added " + response.departmentName + " to the database");

                // Calls start function
                start();
            })
        })
};



// Calls start function 
start();





