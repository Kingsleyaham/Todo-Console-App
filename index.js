let todos = [];

const commandLine = require("readline");
const prompts = commandLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

printWelcomeMessage();
questionPrompt();

function questionPrompt() {
  prompts.question(
    "Please enter a list item to add or a command to perform: ",
    (str = "") => {
      str = str.trim().toLowerCase();

      if (!str.includes("-") && !str.includes("completed")) {
        if (addTodo(str)) {
          questionPrompt();
          return;
        }
        print("Task already exist in todos\n");
        questionPrompt();
        return;
      }

      runCommand(str);
    }
  );
}

function runCommand(command = "") {
  const completedSingleTodoCommand = command.slice(0, 10) === "completed ";
  const removeTodoCommand = command.slice(command.length - 1) === "-";

  if (command === "-help") {
    printAllCommandsAndUsage();
    questionPrompt();
    return;
  }

  if (command === "-show") {
    viewTodos();
    questionPrompt();
    return;
  }

  if (command === "-exit") {
    exitProcess();
    return;
  }

  if (command === "completed-") {
    clearCompletedTodos();
    print("completed todos cleared successfully");
    questionPrompt();
    return;
  }

  if (removeTodoCommand) {
    if (removeTodo(getTodoIndex(command.slice(0, command.length - 1)))) {
      print(
        `'${titleCase(
          command.slice(0, command.length - 1)
        )}' removed successfully`
      );
      questionPrompt();
      return;
    }

    print(
      `'${titleCase(
        command.slice(0, command.length - 1)
      )}' does not exist in todos`
    );
    questionPrompt();
    return;
  }

  if (completedSingleTodoCommand && !removeTodoCommand) {
    if (markTodoCompleted(getTodoIndex(command.slice(10)))) {
      print(`'${titleCase(command.slice(10))}' marked completed`);
      questionPrompt();
      return;
    }

    print(`'${titleCase(command.slice(10))}' does not exist in todos`);
    questionPrompt();
    return;
  }

  print("command does not exist");
  printCommandList();
  questionPrompt();
  return;
}

// ---------------------------------------------------//
// Todo Actions

function addTodo(todo = "") {
  if (!todoExists(todo)) {
    const newTodo = { name: todo.toLowerCase(), completed: false };
    todos.push(newTodo);
    return true;
  }

  return false;
}

function removeTodo(todoIndex = -1) {
  if (todoIndex >= 0) {
    const remainingTodos = todos.filter((todo, index) => index !== todoIndex);
    setTodo(remainingTodos);
    return true;
  }

  return false;
}

function viewTodos() {
  print("***********TODO LIST***********");

  todos.forEach((todo) => {
    print(`${titleCase(todo.name)}  |  ${getTodoStatus(todo.completed)}`);
  });

  print("-------------------------------");
}

function markTodoCompleted(todoIndex = -1) {
  if (todoIndex >= 0) {
    const updatedTodo = todos.map((todo, index) => {
      if (index === todoIndex) {
        return { ...todo, completed: true };
      }

      return todo;
    });
    setTodo(updatedTodo);

    return true;
  }

  return false;
}

function clearCompletedTodos() {
  const activeTodos = todos.filter((todo) => todo.completed !== true);
  setTodo(activeTodos);
}

function setTodo(updatedTodo = []) {
  todos = updatedTodo;
}

function getTodoStatus(status = false) {
  switch (status) {
    case false:
      return "Active";
    case true:
      return "Completed";
    default:
      break;
  }
}

function getTodoIndex(todoName = "") {
  todoName = todoName.toLowerCase();
  let todoIndex = -1;

  todos.forEach((todo, index) => {
    if (todo.name.toLowerCase() === todoName) {
      todoIndex = index;
    }
  });

  return todoIndex;
}

function todoExists(todoName = "") {
  const todoIndex = getTodoIndex(todoName);
  if (todoIndex >= 0) {
    return true;
  }

  return false;
}

// ---------------------------------------------------//

function printCommandList() {
  const commands = [
    "'-help'",
    "'-exit'",
    "'-show'",
    "'<todoName>-'",
    "'completed <TodoName>'",
    "'completed-'",
  ];

  print(`Commands: ${commands.join(", ")}\n`);
}

function printWelcomeMessage() {
  print("Welcome to a Todo Console App with Complete Todo Functionality");
  printCommandList();
}

function exitProcess() {
  print(
    "\n***Thanks for using our our todo app. We hope to see you next time***\n"
  );
  process.exit();
}

function printAllCommandsAndUsage() {
  print("\nUsage:\n");
  print("-help                  list all help commands and their usage");
  print("-exit                  terminate or exit application");
  print("-show                  list all todos");
  print("completed-             clear completed todos");
  print("<todoName>-            delete the todo");
  print("completed <todoName>   mark the todo completed\n");
}

// ---------------------------------------------------//
// utility functions

function print(message = "") {
  console.log(message);
}

function titleCase(str = "") {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
// ---------------------------------------------------//
