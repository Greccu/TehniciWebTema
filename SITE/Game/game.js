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
    questions.sort(() => Math.random() - 0.5); //shuffles the array
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
    var id = document.getElementById("input-id").value;
    var name = document.getElementById("input-update-name").value;
    var img = document.getElementById("input-update-img").value;
    var newQuestion = {
    }

    console.log(newDog, id)

    fetch('http://localhost:3000/dogs/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDog)
    }).then(function(response) {
        window.location.reload();
    })
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

animation = anime.timeline();
const quizlength = 10 - 1;
let runningQuestion = 0;
let count = 0;
const questionTime = 10; // seconds
let TIMER;
let score = 0;
let questions;

var questionrequest = new XMLHttpRequest();
questionrequest.open('GET','http://localhost:3000/questions');
questionrequest.onload = function(){
    questions = JSON.parse(questionrequest.responseText);
};
questionrequest.send();

start.addEventListener('click',prestartQuiz);
submit.addEventListener('click',submitquestion);
loginbut.addEventListener('click',login);
registerbut.addEventListener('click',change_to_register);

/////////////////////

var users;
var usersrequest = new XMLHttpRequest();
usersrequest.open('GET','http://localhost:3000/users');
usersrequest.onload = function(){
    users = JSON.parse(usersrequest.responseText);
}
usersrequest.send();

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
        butoane.style.display = 'grid';
        loginform.style.display = 'none';
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

}


function change_to_login(){
    document.getElementById("warning").innerHTML = "";
    document.getElementById("registerform").style.display = "none";
    loginbut.removeEventListener('click',change_to_login);
    registerbut.removeEventListener('click',register);
    loginbut.addEventListener('click',login);
    registerbut.addEventListener('click',change_to_register);

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
    /*
    var newQuestion = {
        
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
    */
}
