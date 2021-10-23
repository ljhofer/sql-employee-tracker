INSERT INTO department (name)
    VALUES ("Front Office"),
           ("Barn"),
           ("Nursery");

INSERT INTO role (title, salary, department_id)
    VALUES ("Office Manager", 99000, 1),
           ("Barn Manager", 99000, 2),
           ("Nursery Manager", 99000, 3),
           ("Office Employee", 75000, 1),
           ("Barn Employee", 75000, 2),
           ("Nursery Employee", 75000, 3),
           ("Office Intern", 30000, 1),
           ("Barn Intern", 30000, 2),
           ("Nursery Intern", 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Julie", "Knopp", 1, null),
           ("Laura", "Hofer", 2, null),
           ("Mark", "Hiner", 3, null),
           ("Jessica", "Davies-Lopez", 4, 1),
           ("Bridget", "Finnegan Forbes", 5, 2),
           ("Kurt", "Pederson", 6, 3),
           ("Minnie", "Hofer", 7, 1),
           ("Huxley", "Hofer", 8, 2),
           ("Marian", "Maciej-Hiner", 9, 3);