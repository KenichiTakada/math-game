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
                wrongAnswer = getRandomInt(1, 100);
            } while (wrongAnswer === correctAnswer || choices.includes(wrongAnswer));
            choices.push(wrongAnswer);
        }
    }
    const buttons = document.getElementsByClassName('choice');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].innerText = choices[i];
    }
}

function checkAnswer(selectedChoice) {
    const userAnswer = parseInt(document.getElementsByClassName('choice')[selectedChoice].innerText);
    const resultElement = document.getElementById('result');
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    const date = endTime.toLocaleString();

    let resultRecord = {
        question: `${num1} ${getSymbol(currentMode)} ${num2}`,
        correctAnswer,
        userAnswer,
        date,
        timeTaken,
        correct: userAnswer === correctAnswer ? '正解' : '不正解'
    };

    if (userAnswer === correctAnswer) {
        resultElement.innerText = '正解！';
        resultElement.className = 'correct-answer';
        sounds.correct.play();
        resultRecord.correct = '正解';
    } else {
        resultElement.innerText = '残念...！';
        resultElement.className = 'incorrect-answer';
        sounds.wrong.play();
        resultRecord.correct = '不正解';
    }
    correctAnswers.push(resultRecord);

    setTimeout(() => {
        resultElement.innerText = '';
        generateQuestion();
    }, 2000);
}

function getSymbol(mode) {
    switch (mode) {
        case 'multiplication':
            return '×';
        case 'addition':
            return '+';
        case 'subtraction':
            return '-';
    }
}

function showResults() {
    const resultElement = document.getElementById('result');
    const summaryElement = document.getElementById('summary');
    resultElement.innerText = 'ゲーム終了！結果：';
    let correctCount = correctAnswers.filter(answer => answer.correct === '正解').length;
    let incorrectCount = correctAnswers.length - correctCount;
    resultElement.innerHTML += `<br>正解：${correctCount} 問<br>不正解：${incorrectCount} 問`;

    let summaryHTML = '<h2>正誤結果</h2><table><tr><th>日時</th><th>問題</th><th>正解</th><th>あなたの答え</th><th>所要時間 (秒)</th><th>結果</th></tr>';
    correctAnswers.forEach(record => {
        summaryHTML += `<tr>
            <td>${record.date}</td>
            <td>${record.question}</td>
            <td>${record.correctAnswer}</td>
            <td>${record.userAnswer}</td>
            <td>${record.timeTaken.toFixed(2)}</td>
            <td>${record.correct}</td>
        </tr>`;
    });
    summaryHTML += '</table>';
    summaryElement.innerHTML = summaryHTML;
}

window.onload = () => {
    sounds.start.play();
    generateQuestion();
};
