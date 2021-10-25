

-- View all employees --
SELECT employee.id, first_name, last_name, title, department.name AS department, salary, manager_id
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

-- View all managers with ids--
SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL;

-- Add employee --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
        (first_name, last_name, role_id, manager_id);

-- Update employee role
UPDATE employee
SET role_id =
WHERE id = ;

-- View all roles --
SELECT title, role.id AS role_id, department.name AS department, salary
FROM role
JOIN department ON role.department_id = department.id;

-- Add role --
INSERT INTO role (title, salary, department_id)
    VALUES 
        (title, salary, department_id);

-- View all departments --
SELECT * department;

-- Add department --
INSERT INTO department (name)
    VALUES
        (name);

