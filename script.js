let num1, num2, correctAnswer, questionCount = 0;
const totalQuestions = 30;
let correctAnswers = [];
let currentMode = 'multiplication';
let startTime;

const sounds = {
    start: new Audio('start.mp3'),
    correct: new Audio('correct.mp3'),
    wrong: new Audio('wrong.mp3')
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateMode() {
    currentMode = document.getElementById('mode').value;
    document.getElementById('current-mode').innerText = `現在の計算モード: ${getModeName(currentMode)}`;
    generateQuestion();
}

function getModeName(mode) {
    switch (mode) {
        case 'multiplication':
            return '掛け算';
        case 'addition':
            return '足し算';
        case 'subtraction':
            return '引き算';
        default:
            return '掛け算';
    }
}

function generateQuestion() {
    if (questionCount < totalQuestions) {
        sounds.start.play();
        questionCount++;
        const min1 = parseInt(document.getElementById('min1').value);
        const max1 = parseInt(document.getElementById('max1').value);
        const min2 = parseInt(document.getElementById('min2').value);
        const max2 = parseInt(document.getElementById('max2').value);

        num1 = getRandomInt(min1, max1);
        num2 = getRandomInt(min2, max2);

        switch (currentMode) {
            case 'multiplication':
                correctAnswer = num1 * num2;
                document.getElementById('question').innerText = `${num1} × ${num2} = ?`;
                break;
            case 'addition':
                correctAnswer = num1 + num2;
                document.getElementById('question').innerText = `${num1} + ${num2} = ?`;
                break;
            case 'subtraction':
                correctAnswer = num1 - num2;
                document.getElementById('question').innerText = `${num1} - ${num2} = ?`;
                break;
        }

        generateChoices();
        startTime = new Date();
    } else {
        showResults();
    }
}

function generateChoices() {
    let choices = [];
    const correctPosition = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
        if (i === correctPosition) {
            choices.push(correctAnswer);
        } else {
            let wrongAnswer;
            do {
               
