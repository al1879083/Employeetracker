const inquirer = require('inquirer');
const mysql = require('mysql2/promise');


mainMenu();

async function mainMenu(){
    // Establish connection to database.
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'employee_db',
        password: '12T_ulare'
    });
    
    // Main menu for the program.
    do{

        var repeat = await promptTask(connection);

    }while (repeat);
    console.log('Quit program');
    
}

async function promptTask(connection){
    // Prompt the user for what they want to do.
    const task = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'Add new employee',
                'Add new role',
                'Add new department',
                'View all employees',
                'View all employees by department',
                'View all employees by manager',
                'Remove employee',
                'Remove role',
                'Remove department',
                'Update role',
                'Update employee',
                'Update department',
                'EXIT'
            ]
        }
    ]);

    switch (task.choice){
        case 'Add new employee': {
            await addEmployee(connection);
            break;
        }
        case 'Add new role': {
            await addRole(connection);
            break;
        }
        case 'Add new department': {
            await addDepartment(connection);
            break;
        }
        case 'View all employees': {
            getEmployees(connection);
            break;
        }
        case 'View all employees by department': {
            await getEmployeesDep(connection);
            break;
        }
        case 'View all employees by manager': {
            await getEmployeesManager(connection);
            break;
        }
        case 'Remove employee': {
            await removeEmployee(connection);
            break;
        }
        case 'Remove role': {
            await removeRole(connection);
            break;
        }
        case 'Remove department': {
            await removeDepartment(connection);
            break;
        }
        case 'Update role': {
            await updateRole(connection);
            break;
        }
        case 'Update employee': {
            await updateEmployee(connection);
            break;
        }
        case 'Update department': {
            await updateDepartment(connection);
            break;
        }
        case 'EXIT': {
            return false;
        }
    }
    return true;
}

// Return a list of all department names.
async function getDepartments(connection){
    const [res] = await connection.execute("SELECT department_name FROM departments")
    const deps = []
    res.forEach(dep => {
        deps.push(dep.department_name)
    })
    return deps;
}

// Return a list of all role titles.
async function getRoles(connection){
    const [res] = await connection.execute("SELECT title FROM roles")
    const roles = []
    res.forEach(role => {
        roles.push(role.title)
    })
    return roles;
}

// Return a list of all employee names.
async function getEmployeeNames(connection){
    const [res] = await connection.execute("SELECT name FROM employees")
    const names = []
    res.forEach(name => {
        names.push(name.name)
    })
    return names;
}

// Prints a table of all the employee information.
async function getEmployees(connection){
    const query = 
    `SELECT employees.name, roles.title, roles.salary, departments.department_name, employees.name FROM employees 
    INNER JOIN roles ON employees.role_id = roles.id 
    INNER JOIN departments ON roles.department_id = departments.id`
    const [employees] = await connection.execute(query)
    console.log('\n')
    console.table(employees)
}

// Prints a table of all information of employees in a given department.
async function getEmployeesDep(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'dep',
            message: 'Which department would you like to view?',
            choices: await getDepartments(connection)
        }
    ])
    const query = 
    `SELECT employees.name, roles.title, roles.salary, departments.department_name, employees.name FROM employees 
    INNER JOIN roles ON employees.role_id = roles.id 
    INNER JOIN departments ON roles.department_id = departments.id 
    WHERE departments.department_name = ?`
    const [employees] = await connection.execute(query, [ans.dep]);
    console.log('\n')
    console.table(employees)
}

// Prints a table of all employees under a given manager.
async function getEmployeesManager(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: 'Which manager would you like to sort by?',
            choices: await getEmployeeNames(connection)
        }
    ])
    const [managerID] = await connection.execute("SELECT employees.id FROM employees WHERE name = ?", [ans.manager]);
    const query = 
    `SELECT employees.name, roles.title, roles.salary, departments.department_name, employees.name FROM employees 
    INNER JOIN roles ON employees.role_id = roles.id 
    INNER JOIN departments ON roles.department_id = departments.id 
    WHERE employees.manager_id = ?`
    const [employees] = await connection.execute(query, [managerID[0].id]);
    console.log('\n')
    console.table(employees)
}

// Add a new employee to the database.
async function addEmployee(connection){
    const names = await getEmployeeNames(connection);
    names.push('No manager');

    const roles = await getRoles(connection);
    if (roles.length <=0){
        console.log("Plese create a valid role before adding employees...");
        return;
    }
    
    const employeeNames = ['John Haller', 'Elise Chue'];
    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Enter employee's full name",

        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: names

        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles
        }
    ])
    var managerID = null;
    if(ans.manager !== 'No manager'){
        const [manager] = await connection.execute("SELECT id from employees WHERE name = ?", [ans.manager]);
        managerID = manager[0].id;
    }

    const [role] = await connection.execute("SELECT id from roles WHERE title = ?", [ans.role]);
    roleID = role[0].id;

    await connection.execute("INSERT INTO employees (name, role_id, manager_id) VALUES (?,?,?)", [ans.name, roleID, managerID])
    console.log('Employee Added...');
}

// Remove an employee from the database.
async function removeEmployee(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which role do you want to remove?',
            choices: await getEmployeeNames(connection)
        }
    ]);
    
    try{
        await connection.execute("DELETE FROM employees WHERE name = ?", [ans.name], (err) => {
            if (err) throw err;
        })
    } catch (err){
        console.log("Make sure this employee is not a manager before deleting.");
        return;
    }
    console.log(`Deleting ${ans.name}...`);
}

// Add a new role to the database.
async function addRole(connection){
    const deps = await getDepartments(connection);
    if (deps.length <=0){
        console.log("Plese create a valid department before adding roles...");
        return;
    }

    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department is this role in?',
            choices: deps
        }
    ]);
    const [dep] = await connection.execute("SELECT id from departments WHERE department_name = ?", [ans.department])
    connection.execute("INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)", [ans.title, ans.salary, dep[0].id])

}

// Remove a role from the database.
async function removeRole(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to remove?',
            choices: await getRoles(connection)
        }
    ]);
    try{
        await connection.query("DELETE FROM roles WHERE title = ?", [ans.role], (err) => {
            if (err) throw err;
        });
    } catch (err){
        console.log("Make sure no employees have this role before deleting.");
        return;
    }
    
    console.log(`Deleting ${ans.role}...`);
}

// Add a new department to the database.
async function addDepartment(connection){
    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the new department?'
        }
    ]);
    connection.execute("INSERT INTO departments (department_name) VALUES (?)",[ans.department], (err) => {
        if (err) throw err;
    })
}

// Remove a department from the database.
async function removeDepartment(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which department do you want to remove?',
            choices: await getDepartments(connection)
        }
    ]);
    try {
        await connection.query("DELETE FROM departments WHERE department_name = ?", [ans.department], (err) => {
            if (err) throw err;
        });
    } catch (err){
        console.log("Make sure no roles use this department before deleting.");
        return;
    }
    console.log(`Deleting ${ans.department}...`);
}

// Update the information for a role.
async function updateRole(connection){
    const deps = await getDepartments(connection);

    const role = await inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to update?',
            choices: await getRoles(connection)
        }
    ]);

    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the new title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the new salary for this role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department is this role in?',
            choices: deps
        }
    ]);
    const [dep] = await connection.execute("SELECT id from departments WHERE department_name = ?", [ans.department])

    await connection.execute("UPDATE roles SET title = ?, salary = ?, department_id = ? WHERE title = ?", 
    [ans.title, ans.salary, dep[0].id, role.role], (err, res) => {
        if (err) throw err;
    })

    console.log("Role updated...");
}

// Update the information for an employee.
async function updateEmployee(connection){
    const roles = await getRoles(connection);
    const names = await getEmployeeNames(connection)
    names.push('No manager');

    const name = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which employee do you want to update?',
            choices: names
        }
    ]);

    const ans = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the new name of the employee?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the new role for this employee?',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the the manager of this employee?',
            choices: names
        }
    ]);

    var managerID = null;
    if(ans.manager !== 'No manager'){
        const [manager] = await connection.execute("SELECT id from employees WHERE name = ?", [ans.manager]);
        managerID = manager[0].id;
    }

    const [role] = await connection.execute("SELECT id from roles WHERE title = ?", [ans.role]);
    roleID = role[0].id;


    await connection.execute("UPDATE employees SET name = ?, role_id = ?, manager_id = ? WHERE name = ?", 
    [ans.name, roleID, managerID, name.name], (err, res) => {
        if (err) throw err;
    })

    console.log("Employee updated...");
}

// Update the information for a department.
async function updateDepartment(connection){
    const ans = await inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: 'Which deparment would you like to update?',
            choices: await getDepartments(connection)
        },
        {
            type: 'input',
            name: 'name',
            message: 'What is the new name of the department?'
        }
    ]);
    await connection.execute("UPDATE departments SET department_name = ? WHERE department_name = ?", [ans.name, ans.department])
    console.log("Department updated...");
}
