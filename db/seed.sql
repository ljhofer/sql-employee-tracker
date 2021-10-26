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
    VALUES ("Sandy", "Knopp", 1, null),
           ("Yoselin", "Hofer", 2, null),
           ("Jamal", "Smith", 3, null),
           ("Julieta", "Lopez", 4, 1),
           ("Katie", "Finnegan", 5, 2),
           ("Jesus", "Gomez", 6, 3),
           ("Minnie", "Adichie", 7, 1),
           ("Huxley", "Hiner", 8, 2),
           ("Amanda", "Kim", 9, 3);