let num1, num2, correctAnswer, questionCount = 0;
const totalQuestions = 30;
let correctAnswers = [];
let currentMode = 'multiplication';
let startTime;
let currentRecognition;
let pendingAnswer;
let firstNumbers = [...Array(10).keys()];
let secondNumbers = [...Array(10).keys()];

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

function getRandomInt(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

function startGame() {
    document.getElementById('start-voice').style.display = 'none';
    firstNumbers = Array.from(document.querySelectorAll('#first-numbers input:checked')).map(el => parseInt(el.value));
    secondNumbers = Array.from(document.querySelectorAll('#second-numbers input:checked')).map(el => parseInt(el.value));
    updateMode();
    generateQuestion();
}

function generateQuestion() {
    if (questionCount < totalQuestions) {
        sounds.start.play();
        questionCount++;
        num1 = getRandomInt(firstNumbers);
        num2 = getRandomInt(secondNumbers);

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

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('answer-input').value);
    if (!isNaN(userAnswer)) {
        checkAnswer(userAnswer);
    } else {
        alert('入力された回答が数字ではありません');
    }
    document.getElementById('answer-input').value = '';
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
});

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('このブラウザは音声認識をサポートしていません。');
        return;
    }

    if (currentRecognition) {
        currentRecognition.abort(); // stopの代わりにabortを使用
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true; // interimResultsをtrueに設定
    recognition.maxAlternatives = 1;
    currentRecognition = recognition;

    recognition.onstart = function() {
        document.getElementById('voice-status').innerText = '音声認識中...';
    };

    recognition.onresult = function(event) {
        const interim_transcript = event.results[0][0].transcript;
        if (event.results[0].isFinal) {
            processVoiceInput(interim_transcript);
        } else {
            document.getElementById('voice-status').innerText = `音声認識中...: ${interim_transcript}`;
        }
    };

    recognition.onerror = function(event) {
        if (event.error === 'aborted') {
            console.warn('音声認識が中断されました。再試行します。');
            startVoiceRecognition();
        } else {
            alert('音声認識中にエラーが発生しました: ' + event.error);
            document.getElementById('voice-status').innerText = '';
        }
    };

    recognition.onend = function() {
        document.getElementById('voice-status').innerText = '';
        if (!pendingAnswer) {
            startVoiceRecognition();
        }
    };

    recognition.start();
}

function processVoiceInput(transcript) {
    const userAnswer = parseInt(transcript);
    if (!isNaN(userAnswer)) {
        if (userAnswer === correctAnswer) {
            checkAnswer(userAnswer);
        } else {
            const recognizedAnswerElement = document.getElementById('recognized-answer');
            recognizedAnswerElement.innerText = `認識された回答: ${userAnswer}`;
            const confirmationElement = document.getElementById('confirmation');
            confirmationElement.style.display = 'block';
            pendingAnswer = userAnswer;
        }
    } else {
        alert('認識された回答が数字ではありません: ' + transcript);
    }
}

function confirmAnswer(isConfirmed) {
    const confirmationElement = document.getElementById('confirmation');
    confirmationElement.style.display = 'none';

    if (isConfirmed) {
        checkAnswer(pendingAnswer);
        pendingAnswer = null;
    } else {
        startVoiceRecognition();
    }
}
