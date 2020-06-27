//   json-server --watch desktop/site/game/quiz.json

function renderQuestion(){
    let q = questions[runningQuestion];
    question.innerHTML = "<p>"+ q.question +"</p>";
    qImg.innerHTML = "<img src="+ q.image +">";
    choiceA.innerHTML = q.answers[0][0];
    choiceB.innerHTML = q.answers[1][0];
    choiceC.innerHTML = q.answers[2][0];
    choiceD.innerHTML = q.answers[3][0];
}

function prestartQuiz(){
    questions.sort(() => Math.random() - 0.5); //shuffles the questions array
    scorediv.style.display = "none";
    runningQuestion = 0;
    count = 0;
    score = 0;
    butoane.style.display = "none";
    textanimation();
    setTimeout(function(){ startQuiz();},6000);
}


function textanimation(){
    var textanim = {};
    textanim.opacityIn = [0,1];
    textanim.scaleIn = [0.2, 1];
    textanim.scaleOut = 3;
    textanim.durationIn = 800;
    textanim.durationOut = 600;
    textanim.delay = 500;
    animation
    .add({
        targets: '.starttext .start-1',
        opacity: textanim.opacityIn,
        scale: textanim.scaleIn,
        duration: textanim.durationIn
    }).add({
        targets: '.starttext .start-1',
        opacity: 0,
        scale: textanim.scaleOut,
        duration: textanim.durationOut,
        easing: "easeInExpo",
        delay: textanim.delay
    }).add({
        targets: '.starttext .start-2',
        opacity: textanim.opacityIn,
        scale: textanim.scaleIn,
        duration: textanim.durationIn
    }).add({
        targets: '.starttext .start-2',
        opacity: 0,
        scale: textanim.scaleOut,
        duration: textanim.durationOut,
        easing: "easeInExpo",
        delay: textanim.delay
    }).add({
        targets: '.starttext .start-3',
        opacity:    textanim.opacityIn,
        scale: textanim.scaleIn,
        duration: textanim.durationIn
    }).add({
        targets: '.starttext .start-3',
        opacity: 0,
        scale: textanim.scaleOut,
        duration: textanim.durationOut,
        easing: "easeInExpo",
        delay: textanim.delay
    }).add({
        targets: '.starttext',
        opacity: 0,
        duration: 500,
        delay: 500
    })
}

function startQuiz(){
    choices.style.display = "grid";
    timer.style.display = "block";
    restartProgress();
    renderQuestion();
    quiz.style.display = "grid";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter,1000);
}

function restartProgress(){
    progress.innerHTML = "";
}

function renderProgress(){
    for(let qIndex = 0; qIndex <= quizlength; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}

function renderCounter(){
    if(count <= questionTime){
        counter.innerHTML = count;
        timeGauge.style.width = (count * 100 / questionTime) + "%";
        count++
    }else{
        count = 0;
        answerIsWrong();
        if(runningQuestion < quizlength){
            runningQuestion++;
            renderQuestion();
        }else{
            clearInterval(TIMER);
            scoreRender();
        }
    }
}


function checkAnswer(answer){
    if(questions[runningQuestion].answers[answer][1]==true){
        score++;
        answerIsCorrect();
    }else{
        answerIsWrong();
    }
    count = 0;
    if(runningQuestion < quizlength){
        runningQuestion++;
        renderQuestion();
    }else{
        clearInterval(TIMER);
        scoreRender();
    }
}

function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

function scoreRender(){
    butoane.style.display = "grid";
    start.innerText = "Restart Quiz!"
    quiz.style.display = "none";
    scorediv.style.display = "block";
    scorediv.innerHTML = "Score: " + score;
    submitscore();
}

function submitquestion(){
    scorediv.style.display = "none";
    butoane.style.display = "none";
    submitinterface.style.display = "grid";
    submitinterface.innerHTML = "<p>Enter your question</p><input id = 'inputquestion'>";
    submitinterface.innerHTML += "<p>Enter question image URL</p><input id = 'inputurl'>"
    for(let i=1; i<=4; i++){
        submitinterface.innerHTML += "<p>Enter answer " + i + "</p>" + "<input id = 'inputanswer" + i + "'></input>"
    }
    submitinterface.innerHTML += "<p>Enter correct answer(1 - 4) </p> <input id = 'correctanswer'> <button class = 'but' id='submitbut'>Submit Question</button><button class = 'but' id='cancel'>Cancel</button>";
    const sub = document.getElementById("submitbut");
    const cancel = document.getElementById("cancel");
    cancel.addEventListener('click',cancelrestore);
    sub.addEventListener('click',submitq);
}

function cancelrestore(){
    butoane.style.display = "grid";
    submitinterface.style.display = "none";
    quizmanager.style.display = "none";
    highscorediv.style.display = "none";
    if(start.innerHTML == "Restart Quiz!"){
        scorediv.style.display = "block";
    }

}


function submitq() {
    var name = document.getElementById("inputquestion").value;
    var img = document.getElementById("inputurl").value;
    var answer1 = document.getElementById("inputanswer1").value;
    var answer2 = document.getElementById("inputanswer2").value;
    var answer3 = document.getElementById("inputanswer3").value;
    var answer4 = document.getElementById("inputanswer4").value;
    var correctanswer = document.getElementById("correctanswer").value;

    var newQuestion = {
        "question": name,
        "answers": [[answer1,false],[answer2,false],[answer3,false],[answer4,false]],
        "image":img
    }
    newQuestion.answers[correctanswer-1][1] = true;
    fetch('http://localhost:3000/questions', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
    }).then(function(response) {
        console.log(response);
    })
}

function deleteQuestion(id) {
    fetch('http://localhost:3000/questions/' + id, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        window.location.reload();
    })
}

function updateQuesiton() {
    var name = document.getElementById("inputquestion").value;
    var img = document.getElementById("inputurl").value;
    var answer1 = document.getElementById("inputanswer1").value;
    var answer2 = document.getElementById("inputanswer2").value;
    var answer3 = document.getElementById("inputanswer3").value;
    var answer4 = document.getElementById("inputanswer4").value;
    var correctanswer = document.getElementById("correctanswer").value;

    var newQuestion = {
        "question": name,
        "answers": [[answer1,false],[answer2,false],[answer3,false],[answer4,false]],
        "image":img
    }

    console.log(newQuestion, id)

    fetch('http://localhost:3000/questions/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
    }).then(function(response) {
        window.location.reload();
    })
}

function login(){
    let us = document.getElementById("username").value;
    let pas = document.getElementById("password").value;
    let ok = 0;
    for(let i = 0; i < users.length; i++){
        if(users[i].username == us && users[i].password == pas){
            ok = 1;
            break;
        }
    }
    if(ok){
        localStorage.setItem("username",us);
        loginsuccesful();
    }
    else{
        let warning = document.getElementById("warning");
        warning.innerHTML = "<p> USERNAME OR PASSWORD ARE INCORRECT</p>";
    }

}



function change_to_register(){
    document.getElementById("warning").innerHTML = "";
    document.getElementById("registerform").style.display = "block";
    loginbut.removeEventListener('click',login);
    registerbut.removeEventListener('click',change_to_register);
    loginbut.addEventListener('click',change_to_login);
    registerbut.addEventListener('click',register);
    for(let i = 0; i < input.length; i++){
        input[i].removeEventListener('keypress',function(e){ if (13 == e.keyCode) {login();}})
        input[i].addEventListener('keypress',function(e){ if (13 == e.keyCode) {register();}})
    }
}


function change_to_login(){
    document.getElementById("warning").innerHTML = "";
    document.getElementById("registerform").style.display = "none";
    loginbut.removeEventListener('click',change_to_login);
    registerbut.removeEventListener('click',register);
    loginbut.addEventListener('click',login);
    registerbut.addEventListener('click',change_to_register);
    for(let i = 0; i < input.length; i++){
        input[i].removeEventListener('keypress',function(e){ if (13 == e.keyCode) {register();}})
        input[i].addEventListener('keypress',function(e){ if (13 == e.keyCode) {login();}})
    }

}

function getquestions(){
    fetch('http://localhost:3000/questions', {
        method: 'get'
    }).then((response) => {
        response.json().then((data) => {
            questions = data;
            console.log(data);
            console.log(questions);
        })
    })
}

function getusers(){
    fetch('http://localhost:3000/users', {
        method: 'get'
    }).then((response) => {
        response.json().then((data) => {
            users = data;
            checklogin();
        })
    })

}

function register(){
    let us = document.getElementById("username").value;
    let pas = document.getElementById("password").value;
    let pasc = document.getElementById("confirmpassword").value;
    let warning = document.getElementById("warning");
    if(pas != pasc){
        warning.innerHTML = "<p>PASSWORDS DO NOT MATCH</p>"
    }
    else{
        let ok = 1;
        for(let i = 0; i < users.length; i++){
            if(users[i].username == us){
                ok = 0;
                break;
            }
        }

        if(ok == 0){
            warning.innerHTML = "<p>USERNAME ALREADY EXISTS</p>"
        }
        else{
            var newUser = {
                "username":us,
                "password":pas
            }
            console.log(newUser);
            fetch('http://localhost:3000/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        }).then(function(response) {
            console.log(response);
    })
        }
    }
}

function loginsuccesful(){
    butoane.style.display = 'grid';
    loginform.style.display = 'none';
    checkadmin();
    getquestions();
}


function checkadmin(){
    if (localStorage.username == "admin"){
        adminbut.style.display = "block";
        adminbut.addEventListener('click',managequestions);
        adminbut2.style.display = "block";
        adminbut2.addEventListener('click',manageusers);
    }
    else{
        adminbut2.style.display = "block";
        adminbut2.addEventListener('click',manageuser);
        adminbut2.innerHTML = "Manage your user";
    }
}

function checklogin(){
    console.log(users);
    for(let i = 0; i < users.length; i++){
        if(users[i].username == localStorage.username){
            loginsuccesful();
            break;
        }
    }
    
}


const butoane = document.getElementById("buttoncontainer");
const start = document.getElementById("start");
const restart = document.getElementById("restart");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const choiceD = document.getElementById("D");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scorediv = document.getElementById("scoreContainer");
const submit = document.getElementById("quizsubmit");
const submitinterface = document.getElementById("quizinput");
const loginform = document.getElementById("login");
const loginbut = document.getElementById("loginbut");
const registerbut = document.getElementById("registerbut");
const input = document.getElementsByClassName("input");
const quizmanager = document.getElementById("quizmanager")
const usersmanager = document.getElementById("quizmanager")
const adminbut = document.getElementById("adminbut");
const adminbut2 = document.getElementById("adminbut2");
const highscorebut = document.getElementById("highscore");
const highscorediv = document.getElementById("highscores");
const scores = document.getElementById("scores");
const quizlength = 10 - 1;
const questionTime = 10; // seconds
var animation = anime.timeline();
var runningQuestion = 0;
var count = 0;
var TIMER;
var score = 0;
var questions;
var users;
var highs;
//////// get users and check login
getusers();

window.onload = function(){
    start.addEventListener('click',prestartQuiz);
    submit.addEventListener('click',submitquestion);
    loginbut.addEventListener('click',login);
    registerbut.addEventListener('click',change_to_register);
    highscorebut.addEventListener('click',showhighscores)

    for(let i = 0; i < input.length; i++){
        input[i].addEventListener('keypress',function(e){ if (13 == e.keyCode) {login();}})
    }

}


function managequestions(){
    butoane.style.display = "none";
    quizmanager.style.display = "flex";
    quizmanager.innerHTML = "";
    let buttt;
    for(let i=0; i<questions.length; i++){
        quizmanager.innerHTML += "<li id = 'expandmenu" + questions[i].id + "'>" + questions[i].question +"<button class = 'expand' id = 'expandbut" + questions[i].id + "'></button></li>";
        buttt = document.getElementById("expandbut" + questions[i].id)
        buttt.addEventListener('click',expand(questions[i].id))
    }
    quizmanager.innerHTML += "<button class = 'but' id='cancel2'>Cancel</button>";
    const cancel2 = document.getElementById("cancel2");
    cancel2.addEventListener('click',cancelrestore);
}

function cancelrestore2(){

}

function expand(id){
    console.log(id)
    let exp = document.getElementById("expandmenu"+id)
    console.log("expandmenu"+id)
    console.log(exp)
    exp.innerHTML += '<br>expandable menu';
    //exp.style.height = "100px"
    //document.getElementById("expandbut"+id).removeEventListener('click',expand(id))
}

function logout(){
    localStorage.clear();
    location.reload();
}

function showhighscores(){
    butoane.style.display = "none";
    highscorediv.style.display = "grid";
    fetch('http://localhost:3000/highscores', {
        method: 'get'
    }).then((response) => {
        response.json().then((data) => {
            highs = data;
            highs.sort(function(a,b){
                return b.score - a.score;
            });
            console.log(highs);
            scores.innerHTML = ""
            for(let i = 0;i<10 && i<highs.length;i++){
                scores.innerHTML += "<li>" + highs[i].username + " - " + highs[i].score +  " - " + highs[i].date + "</li>";
            }
            const resetscores = document.getElementById("reset")
            resetscores.addEventListener('click',resethighscores)
            const resetownscores = document.getElementById("resetown")
            resetownscores.addEventListener('click',resetownhighscores)
            const cancel3 = document.getElementById("back");
            cancel3.addEventListener('click',cancelrestore);
        })
    })
    
}


function submitscore(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    var newScore = {
        "score": score,
        "username": localStorage.username,
        "date": today
        
    }
    fetch('http://localhost:3000/highscores', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newScore)
    }).then(function(response) {
        //response.preventDefault();
        console.log(response);
    })
}

function resethighscores(){
    fetch('http://localhost:3000/highscores/', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        console.log(response);
        //window.location.reload();
    })

}

function resetownhighscores(){
    console.log("reseting")
    let uhs = localStorage.username;
    for(let i = 0; i < highs.length; i++){
        if(uhs == highs[i].username){
            console.log('deleting from http://localhost:3000/highscores/' + highs[i].id)
            fetch('http://localhost:3000/highscores/' + highs[i].id, {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                console.log(response);
            })

        }
    }

}


function manageusers(){
    butoane.style.display = "none";
    usersmanager.style.display = "flex";
    usersmanager.innerHTML = "";
    let usbut;
    for(let i=0; i<users.length; i++){
        usersmanager.innerHTML += "<li id = 'expandmenu" + users[i].id + "'>" + users[i].username +"<button class = 'expand' id = 'deletebut" + users[i].id + "'onclick = 'deleteuser( "+ users[i].id+")'></button></li>";
        usbut = document.getElementById("deletebut" + users[i].id)
    }
    usersmanager.innerHTML += "<button class = 'but' id='cancelll'>Cancel</button>";
    let cancelll = document.getElementById("cancelll");
    cancelll.addEventListener('click',cancelrestore);
}

function deleteuser(id){
    fetch('http://localhost:3000/users/' + id, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        //window.location.reload();
        console.log(response)
    })
}



function manageuser(){
    butoane.style.display = "none";
    usersmanager.style.display = "flex";
    usersmanager.innerHTML = "<p>Enter new username</p><input id = 'newusernameinput'>";
    usersmanager.innerHTML += "<p>Enter new password</p><input id = 'newpasswordinput'>";
    usersmanager.innerHTML += "<button class = 'but' id='newusername'>Update username</button>";
    usersmanager.innerHTML += "<button class = 'but' id='newpassword'>Update password</button>";
    usersmanager.innerHTML += "<button class = 'but' id='canceluser'>Cancel</button>";
    let canceluser = document.getElementById("canceluser");
    let updateusername = document.getElementById('newusername');
    let updatepassword = document.getElementById('newpassword');
    canceluser.addEventListener('click',cancelrestore);
    updateusername.addEventListener('click',updateusernamef);
    updatepassword.addEventListener('click',updatepasswordf);
}

function updateusernamef(){
    var newusername = document.getElementById("newusernameinput").value;
    for(let i = 0; i < users.length; i ++){
        if(localStorage.username == users[i].username){
            var updatedUser = users[i];
            break;
        }
    }
    updatedUser.username = newusername;
    id = updatedUser.id;
    console.log(updatedUser);
    fetch('http://localhost:3000/users/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    }).then(function(response) {
        //window.location.reload();
        console.log(response)
    })
}

function updatepasswordf(){
    var newpassword = document.getElementById("newpasswordinput").value;
    for(let i = 0; i < users.length; i ++){
        if(localStorage.username == users[i].username){
            var updatedUser = users[i];
            break;
        }
    }
    updatedUser.password = newpassword;
    id = updatedUser.id;
    console.log(updatedUser);
    fetch('http://localhost:3000/users/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    }).then(function(response) {
        //window.location.reload();
        console.log(response)
    })
}

let position = 0;
let bgtimer = setInterval(move,20);
function move(){
        document.body.style.backgroundPosition = position + 'px' ;
        position += 1;
}











var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var wx = window.innerWidth;
var wy = window.innerHeight;
canvas.width = wx;
canvas.height = wy;
var gravity = 1;
c.strokeWidth=5;

function Ball() {
    this.color = 'red';
    this.radius = Math.random() * 10 + 20;
    this.x = Math.random() * (wx - this.radius * 2) + this.radius;
    this.y = Math.random() * (wy - this.radius);
    this.dy = Math.random() * 2;
    this.dx = Math.round((Math.random() - 0.5) * 10);
    this.velocity = 0.2;
    this.update = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 15);
        c.fillStyle = this.color;
        c.shadowBlur = 20;
        c.shadowColor = "black";
        c.fill();
};
}

var bal = [];
for (var i=0; i<200; i++){
    bal.push(new Ball());
}

function animate() {    
    if (wx != window.innerWidth || wy != window.innerHeight) {
        wx = window.innerWidth;
        wy = window.innerHeight;
        canvas.width = wx;
        canvas.height = wy;
    }
    requestAnimationFrame(animate);
    c.clearRect(0, 0, wx, wy);
    for (var i = 0; i < bal.length; i++) {
        bal[i].update();
        bal[i].y += bal[i].dy;
        bal[i].x += bal[i].dx;
        if (bal[i].y + bal[i].radius >= wy) {
            bal[i].dy = -bal[i].dy * gravity;
        } 
        else {
            bal[i].dy += bal[i].velocity;
        }    
        if(bal[i].x + bal[i].radius > wx || bal[i].x - bal[i].radius < 0){
            bal[i].dx *= -1;
        }
        }
}

animate();

// la 400ms schimb mingiile
setInterval(function() {
    bal.push(new Ball());
    bal.splice(0, 1);
  }, 400);
