//Importing data and programs from  othere folders
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Blue rose",
    database: "employees_DB",
});

connection.connect(function(err) {
  if (err) throw err;
  startScreen();
  startMenu();
});

//start the program 
const startScreen = () =>{
    console.log("Welcome to the SQL Employee Tracker!")
    console.log("Choose what you want to do with the employee!")
}

//figures out what they want to do 
function startMenu() {
    inquirer.prompt([
      //option of what you want to do 
      {
          type: 'list',
          message: 'What would you like to do?',
          choices: ["View all Employees?","View All Department?","View All Role?","Add Employee","Add Department","Add Role","Update Employee","Update Department","Update Roles","Remove Employee","Remove Department","Remove Role","ViewTwoTables","Exit"],
          name: 'optionChoices',
          loop: false,
      },

    ])
     .then(function(response){
        switch (response.optionChoices) {
          case "View all Employees?":
            viewAll('employee');
            break;
          case "View All Department?":
            viewAll('department');
          break;
          case "View All Role?":
            viewAll('Role');
          break;
          case "Add Employee":
            employeeQueston();
          break;
          case "Add Department":
            addDepartment();
          break;
          case "Add Role":
            addRole();
          break;
          case "Update Employee":
            update('employee',["first_name","last_name","role_id","manager_id"]);
          break;
          case "Update Department":
            update('department',["name"]);
          break; 
          case "Update Roles":
            update('Role',["title","salary","department_id","manager_id"]);
          break; 
          case "Remove Employee":
            remove('employee');
          break; 
          case "Remove Department":
            remove('department');
          break; 
          case "Remove Role":
            remove('Role');
          break; 
          case "ViewTwoTables":
            joinTable();
          break; 
          case "Exit":
            exitWindow()
            connection.end();
          break;
        }
    });
}
//pass in the function in order to update a table
function update(tableType,list){
  inquirer.prompt([
     {
        type: "input",
        name: "id",
        message: `Which ${tableType} would you like to update? (Enter ${tableType} ID)`
      },
      {
        type: "list",
        name: "option",
        choices: list,
        message: `Please choice which value of the ${tableType} table you would like to update`
      },
      {
        type: "input",
        name: "newVal",
        message: "What is the new Value?"
      },
    
    ]).then(response => {const query = `UPDATE ${tableType} SET ${response.option} = ? WHERE id = ?`;
      connection.query(query, [response.newVal, response.id], (err, data) => {
        if(err) {
            console.log(err);
        }
        console.log(query);
        viewAll(tableType);
      })
      }).catch(err => {
      console.log(err);
      });
}

//pass in the function in order to remove from a table
function remove(tableType){
  inquirer.prompt([
     {
        type: "input",
        name: "id",
        message: `Which ${tableType} item would you like to Remove (Enter ${tableType} ID)`
      },
    ]).then(response => {const query = `DELETE FROM ${tableType} WHERE id = ?`;
      connection.query(query, [response.id], (err, data) => {
        if(err) {
            console.log(err);
        }
        console.log(query);
        viewAll(tableType);
      })
      }).catch(err => {
      console.log(err);
      });
}

//pass in the function in order to display from a table
function searchInfo(value){
  let val = value;
  let data =[]
  let querySet ="";

  //department
  if(val.colNum === 2){
   querySet += `SELECT id, ${val.colOne} FROM ${val.theTable}`;
  }
  //role
  else if(val.colNum === 4){
   querySet += `SELECT id, ${val.colOne}, ${val.colTwo}, ${val.colThree} FROM ${val.theTable}`;
    
  }
  //employee
  else if(val.colNum === 5){
    querySet += `SELECT id, ${val.colOne}, ${val.colTwo}, ${val.colThree}, ${val.colFour} FROM ${val.theTable}`;
  }
  
  connection.query(querySet, function(err, res) {
    if(err) {
      console.log(err);
    }
    console.table(res);
    data.push(res);
    startMenu(); 
  });
}

function viewAll(option){

   //department
   if(option === "department"){
    let value = {colNum:2, colOne:"name",theTable:`${option}`}
    searchInfo(value) 
  }
  //Role
  else if(option === 'Role'){
    let value = {colNum:4, colOne:"title",colTwo:"salary",colThree:"department_id",theTable:`${option}`}
    searchInfo(value) 
  }
  //employee
  else if(option === 'employee'){
    let value = {colNum:5, colOne:"first_name",colTwo:"last_name",colThree:"role_id",colFour:"manager_id",theTable:`${option}`}
    searchInfo(value) 
  }
 
}

const employeeQueston = () => 
    inquirer.prompt([
        //Basic QUesiton for everyone 
        {
          type: 'name',
          message: 'What is your First Name?',
          name: 'first',
        },
        {
          type: 'name',
          message: 'What is the Last Name?',
          name: 'last'
        },
        {
          type: 'number',
          message: 'What is the role number?',
          name: 'employeeRole'
        },
        {
          type: 'number',
          message: 'What is your manager EmployeeID num?',
          name: 'EmployeeManag'
        },

        ]).then((response) =>{
        let query =  "INSERT INTO employee SET ?";
        connection.query(query, {first_name:response.first,last_name:response.last,role_id:response.employeeRole,manager_id:response.EmployeeManag}, (err, data) => {
          if(err) {
            console.log(err);
          }
          console.log(query);
          startMenu();     
        });
});

const addDepartment = () => 
    inquirer.prompt([
      {
      type: 'input',
      message: 'What department would you like to add?',
      name: 'departmentName',
    },
  ]).then((response) =>{
      let query =  "INSERT INTO department SET ?";
      connection.query(query, {name:response.departmentName}, (err, data) => {
        if(err) {
          console.log(err);
        }
        console.log(query);
        startMenu();     
      });
});

const addRole = () => 
    inquirer.prompt([
        //Basic QUesiton for everyone 
        {
          type: 'input',
          message: 'What is the role title?',
          name: 'roleTitle',
      },
      {
          type: 'number',
          message: 'What is the Salary?',
          name: 'salary'
      },
      {
          type: 'number',
          message: 'What is the Department ID?',
          name: 'departmentID'
      },

    ]) .then((response) =>{
        let query =  "INSERT INTO Role SET ?";
        connection.query(query, {title: response.roleTitle, salary: response.salary, department_id: response.departmentID}, (err, data) => {
          if(err) {
            console.log(err);
          }
          console.log(query);
          startMenu();     
        });
});

//pass in the function in order to display from a table
function joinConnection(tableOne,tableTwo){

  let querySet ="";
 
   //user chose to join table to it self 
  if(tableOne === tableTwo){
    viewAll(tableOne)
  }
  //role
  else if((tableOne === 'employee' && tableTwo === 'Role')||(tableOne === 'Role' && tableTwo === 'employee')){
   querySet += `SELECT *  FROM employee INNER JOIN Role ON employee.role_id = Role.id`;
   connection.query(querySet, function(err, res) {
    if(err) {
      console.log(err);
    }
    console.table(res);
    startMenu(); 
  });
  }
  //employee
  else if((tableOne === 'employee' && tableTwo === 'department')||(tableOne === 'department' && tableTwo === 'employee')){
    querySet += `SELECT *  FROM employee INNER JOIN Role ON employee.role_id = Role.id INNER JOIN department ON role.department_id = department.id`;
    connection.query(querySet, function(err, res) {
      if(err) {
        console.log(err);
      }
      console.table(res);
      startMenu(); 
    });
  }
  else if((tableOne === 'department' && tableTwo === 'Role')||(tableOne === 'Role' && tableTwo === 'department')){
    querySet += `SELECT *  FROM Role INNER JOIN department ON role.department_id = department.id`;
    connection.query(querySet, function(err, res) {
      if(err) {
        console.log(err);
      }
      console.table(res);
      startMenu(); 
    });
  }
}


const joinTable = () => 
inquirer.prompt([
  {
     type: "list",
     name: "tableOne",
     choices: ["employee","department","Role"],
     message: `Which Is the first tables would you like to Join ?`
   },
   {
    type: "list",
    name: "tableTwo",
    choices: ["employee","department","Role"],
    message: `Which is the Second tables would you like to Join ?`
  },
 ]).then(response => {
     joinConnection(response.tableOne,response.tableTwo)
});

// exit window 
function exitWindow(){
  console.log("Thank you! Good Bye");
  return 
}