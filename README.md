# employee-tracker

## Summary 
Employee Tracker is a CLI applicaiton for building and maintaining companies employee data base. Employee allows managers or someone within the company to view all employees, roles, as well as departments. It also allows for adding employees, roles, departments and updating employees all from your CLI.

## Demo
![Site](https://drive.google.com/file/d/1G7hsifYef6Sbj6-W8UZhzeTErlaSIKTd/view) 
![Site2](https://drive.google.com/file/d/1xL9xeQMW1lDk3ailZwKH8kHROmiiS169/view)

## Getting Started

### Instructions:
In order to use this application you will need to first run an npm install in your CLI to install the dependencies that have been loaded into the json files for you. Once this is done, run node app.js in your CLI to start the prompts that will walk you through the verious tasks you can perform with this application. 

 
## Technologies Used
- MySQL2: Relational database management system based on SQL – Structured Query Language, used in this applicationt to warehouse and query employee and company data. 
- Node.js - Used for package managment and to execute JavaScript code to build command line tool for server-side scripting.
- Javascript - Used to base functionality of functions and prompts within the application.
- Git - Version control system to track changes to source code
- GitHub - Hosts repository that can be deployed to GitHub Pages
 
## Code Snippet
The following code snippet shows the schema that is the base for our link between our index.js file that oeprates the functions for building upon our employee regestry, and data base we create with this same schema setup in our sql workbench. Once these two are connected via calling upon our required mysql package and connection port and host thats configured in our JavaScript. We can then execute the functionality of the application through our JavaScript.

```sql
CREATE DATABASE /*!32312 IF NOT EXISTS*/ employee_db /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE employee_db;

DROP TABLE IF EXISTS departments;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS employees;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `role_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS roles;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL,
  `salary` decimal(8,2) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



```

## Built With
* [MySQL2](https://www.npmjs.com/package/mysql2)
* [Node.js](https://nodejs.org/en/)
* [npmjs](https://docs.npmjs.com/)
* [inquirer](https://www.npmjs.com/package/inquirer)

## Authors

**Adrian Landa**

- [Link to Github](https://github.com/al1879083/Employeetracker))