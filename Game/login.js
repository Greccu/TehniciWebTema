/// nodemon login.js

// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

// Create user
app.post("/users", (req, res) => {
  const usersList = readJSONFile();
  ///create user
  var newuser = {
    id : uuid.v4.apply(),
    username: req.body.username,
    password: req.body.password
  }
  usersList.push(newuser)
  writeJSONFile(usersList);
  res.status(200).send(newuser);
});


// Read One user
app.get("/users/:id", (req, res) => {
  const usersList = readJSONFile();
  var id = req.params.id;
  console.log(id);
  var ok = false;
  usersList.forEach(user => {
      if(user.id == id) {
          ok = true;
          console.log('dadada')
          res.status(200).send(user);
      }
  });

  if(ok === false) {
      res.status(404).send("User not found!");
  }
});



// Read All users
app.get("/users", (req, res) => {
  const usersList = readJSONFile();
  console.log("getting users");
  if(usersList != undefined){
    res.status(200).send(usersList);
  } else {
      res.status(404).send("No user found");
  }
});

// Update user
app.put("/users/:id", (req, res) => {
  const usersList = readJSONFile();
  var id = req.body.id;
  var checkIfExists = false;
  for(let i = 0; i < usersList.length; i++){
    if(usersList[i].id == id) {
      usersList[i].username = req.body.username;
      usersList[i].password = req.body.password;
      checkIfExists = true;
      break;
  }
  }
  if(checkIfExists === true) {
    writeJSONFile(usersList);
    res.status(200).send("User updated!");
} else {
    res.status(404).send("User not found!");
}
});

// Delete
app.delete("/users/:id", (req, res) => {
    res.status(404).send("user not found!");

  const usersList = readJSONFile();
  console.log(req);
  var iddel = req.params.id;
  var okdel = false;
  for(let i = 0; i < usersList.length; i++) {
      if(usersList[i].id == iddel) {
          okdel = true;
          usersList.splice(i, 1); 
          break;
      }
}

  if(okdel === true) {
    writeJSONFile(usersList);
    res.status(200).send("user deleted!");
} else {
    res.status(404).send("user not found!");
}

});


///////////////////////////////////////////////////////////////////////questions



// Create question
app.post("/questions", (req, res) => {
  const usersList = readJSONFileQuiz();
  var newuser = {
    id : uuid.v4.apply(),
    username: req.body.username,
    password: req.body.password
  }
  usersList.push(newuser)
  writeJSONFileQuiz(usersList);
  res.status(200).send(newuser);
});


// Read All questions
app.get("/questions", (req, res) => {
  const questionsList = readJSONFileQuiz();
  console.log("getting questions");
  if(questionsList != undefined){
    res.status(200).send(questionsList);
  } else {
      res.status(404).send("No question found");
  }
});



///////////////////////////////////////////////////////////////////////highscores



// Create highscore
app.post("/highscores", (req, res) => {
  const hsList = readJSONFileHS();
  var newhs = {
    id : uuid.v4.apply(),
    username: req.body.username,
    score: req.body.score,
    date: req.body.date
  }
  hsList.push(newhs)
  writeJSONFileHS(hsList);
  res.status(200).send(newhs);
});


// Read All highscores
app.get("/highscores", (req, res) => {
  const highscoresList = readJSONFileHS();
  console.log("getting highscores");
  if(highscoresList != undefined){
    res.status(200).send(highscoresList);
  } else {
      res.status(404).send("No highscore found");
  }
});


// Read One user
app.get("/highscores/:id", (req, res) => {
  const hsList = readJSONFileHS();
  var id = req.params.id;
  console.log(id);
  var ok = false;
  hsList.forEach(hs => {
      if(hs.id == id) {
          ok = true;
          console.log('dadada')
          res.status(200).send(hs);
      }
  });

  if(ok === false) {
      res.status(404).send("HS not found!");
  }
});

// Delete all highscores
app.delete("/highscores", (req, res) => {
  const hs = [];
  writeJSONFileHS(hs);
  res.status(200).send("highscores reseted!");


});

// Delete one highscore
app.delete("/highscores/:id", (req, res) => {
const hsList = readJSONFileHS();
var iddel = req.params.id;
var okdel = false;
for(let i = 0; i < hsList.length; i++) {
    if(hsList[i].id == iddel) {
        okdel = true;
        hsList.splice(i, 1); 
        break;
    }
}
if(okdel === true) {
  writeJSONFileHS(hsList);
  res.status(200).send("highscore deleted!");
} else {
  res.status(404).send("highscore nott found!");
}

});








// Functia de citire din fisierul users.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("users.json"))["users"];
}

// Functia de scriere in fisierul users.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "users.json",
    JSON.stringify({ users: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Functia de citire din fisierul quiz.json
function readJSONFileQuiz() {
  return JSON.parse(fs.readFileSync("quiz.json"))["questions"];
}

// Functia de scriere in fisierul quiz.json
function writeJSONFileQuiz(content) {
  fs.writeFileSync(
    "quiz.json",
    JSON.stringify({ questions: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}


// Functia de citire din fisierul highscores.json
function readJSONFileHS() {
  return JSON.parse(fs.readFileSync("highscore.json"))["highscores"];
}

// Functia de scriere in fisierul highscores.json
function writeJSONFileHS(content) {
  fs.writeFileSync(
    "highscore.json",
    JSON.stringify({ highscores: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}


// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);






