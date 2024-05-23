let num1, num2, correctAnswer, questionCount = 0;
const totalQuestions = 30;
let correctAnswers = [];
let currentMode = 'multiplication';
let startTime;
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/1qK0yubjDx4b6_M3kk1C-5DtYrMrS493MoB9ocOTmwSk/edit#gid=0'; // ここにスプレッドシートのURLを入力

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
    {src: 'images/correct8.png', weight: 1}
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
        buttons[i].classList.remove('selected'); // 選択状態を解除
    }
}

function submitResult(resultRecord) {
  const url = 'https://script.google.com/macros/s/AKfycbx-jbOQKeoUnMmO-J4RrlSS6el3tHzZb9nPlVcjYB8mtzDJr32oyYSH1DVmNrdmgnLT_Q/exec'; // ここにGoogle Apps ScriptのURLを入力
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resultRecord)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'error') {
      console.error('Error:', data.message);
    } else {
      console.log('Success:', data);
      document.getElementById('open-google-sheet').style.display = 'block'; // 成功時にスプレッドシートを開くボタンを表示
    }
  })
  .catch(error => console.error('Error:', error));
}

function checkAnswer(selectedChoice) {
    const buttons = document.getElementsByClassName('choice');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected'); // 他のボタンの選択状態を解除
    }
    buttons[selectedChoice].classList.add('selected'); // 選択状態を追加

    const userAnswer = parseInt(buttons[selectedChoice].innerText);
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

    let summaryHTML = '<h2>正誤結果</h2><table><tr><th>日時</th><th>問題</th><th>正解</th><th>あなたの答え</th><th>所要時間 (秒)</th><th>結果</th><th>モード</th></tr>';
    correctAnswers.forEach(record => {
        summaryHTML += `<tr>
            <td>${record.date}</td>
            <td>${record.question}</td>
            <td>${record.correctAnswer}</td>
            <td>${record.userAnswer}</td>
            <td>${record.timeTaken.toFixed(2)}</td>
            <td>${record.result}</td>
            <td>${record.mode}</td>
        </tr>`;
    });
    summaryHTML += '</table>';
    summaryElement.innerHTML = summaryHTML;

    // Googleスプレッドシートに送信ボタンを表示
    document.getElementById('send-to-google').style.display = 'block';
}

function downloadResults() {
    const headers = ["日時", "問題", "正解", "あなたの答え", "所要時間 (秒)", "結果", "モード"];
    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + correctAnswers.map(record => [
            record.date,
            record.question,
            record.correctAnswer,
            record.userAnswer,
            record.timeTaken.toFixed(2),
            record.result,
            record.mode
        ].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sendResultsToGoogle() {
    correctAnswers.forEach(record => submitResult(record));
}

function openGoogleSheet() {
    window.open(googleSheetUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
    generateQuestion();
});
