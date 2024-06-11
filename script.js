let num1, num2, correctAnswer, questionCount = 0;
const totalQuestions = 30;
let correctAnswers = [];
let currentMode = 'multiplication';
let startTime;
let currentRecognition;
// const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit'; // ここにスプレッドシートのURLを入力

const sounds = {
    start: new Audio('start.mp3'),
    correct: new Audio('correct.mp3'),
    wrong: new Audio('wrong.mp3')
};

const correctImages = [
    {src: 'images/correct1.png', weight: 1},
    {src: 'images/correct2.png', weight: 1},
    {src: 'images/correct3.png', weight: 1},
    {src: 'images/correct4.png', weight: 1},
    {src: 'images/correct5.png', weight: 1},
    {src: 'images/correct6.png', weight: 1},
    {src: 'images/correct7.png', weight: 1},
    {src: 'images/correct8.png', weight: 1},
    {src: 'images/correct9.png', weight: 1},
    {src: 'images/correct10.png', weight: 1},
    {src: 'images/correct11.png', weight: 1}
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomImage(images) {
    const totalWeight = images.reduce((acc, image) => acc + image.weight, 0);
    const randomNum = Math.random() * totalWeight;
    let sum = 0;

    for (let image of images) {
        sum += image.weight;
        if (randomNum <= sum) {
            return image.src;
        }
    }
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

        startTime = new Date();
        startVoiceRecognition();
    } else {
        showResults();
    }
}

function checkAnswer(userAnswer) {
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
        result: userAnswer === correctAnswer ? '正解' : '不正解',
        mode: getModeName(currentMode)
    };

    correctAnswers.push(resultRecord);

    if (userAnswer === correctAnswer) {
        const imgSrc = getRandomImage(correctImages);
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.className = 'pop-out';
        document.body.appendChild(imgElement);
        resultElement.innerText = '正解！';
        resultElement.className = 'correct-answer';
        sounds.correct.play();
        setTimeout(() => {
            resultElement.innerText = '';
            document.body.removeChild(imgElement);
            generateQuestion();
        }, 2000);
    } else {
        resultElement.innerText = '残念...！';
        resultElement.className = 'incorrect-answer';
        sounds.wrong.play();
        setTimeout(() => {
            resultElement.innerText = '';
            generateQuestion();
        }, 2000);
    }
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
    let correctCount = correctAnswers.filter(answer => answer.result === '正解').length;
    let incorrectCount = correctAnswers.length - correctCount;
    resultElement.innerHTML += `<br>正解：${correctCount} 問<br>不正解：${incorrectCount} 問`;

    let summaryHTML = '<h2>正誤結果</h2><table><tr><th>日時</th><th>問題</th><th>正解</th><th>あなた
