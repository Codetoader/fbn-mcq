let timerElement = document.getElementById('timer');
let questionElement = document.getElementById('question');
let optionsElement = document.getElementById('options');
let popup = document.getElementById('popup');
let popupMessage = document.getElementById('popup-message');
let overlay = document.getElementById('overlay');
let explanationElement = document.getElementById('explanation');
let modeToggle = document.getElementById('mode-toggle');

let questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        correct: 0,
        explanation: "Paris is the capital city of France, known for its art, fashion, and culture. Landmarks like the Eiffel Tower and the Louvre Museum are located here."
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "Based on basic mathematics, 2 plus 2 equals 4."
    },
    {
        question: 'Refer to the table below and answer the following question:<br><br>\
                  <div class="table-container"><table class="table">\
                    <tr>\
                      <th>FUNCTION</th>\
                      <th>Recommended Retail Price per Unit</th>\
                      <th>Discounted Retail Price per Unit</th>\
                      <th>Maintenance Cost per Year</th>\
                      <th>Ink Cartridge</th>\
                      <th>Pages Printed per Cartridge</th>\
                    </tr>\
                    <tr>\
                      <td>Quick Print</td>\
                      <td>N995</td>\
                      <td>N775</td>\
                      <td>N75</td>\
                      <td>N19.95</td>\
                      <td>750</td>\
                    </tr>\
                    <tr>\
                      <td>Clear Print 1</td>\
                      <td>N1,895</td>\
                      <td>N975</td>\
                      <td>N75</td>\
                      <td>N17.95</td>\
                      <td>900</td>\
                    </tr>\
                    <tr>\
                      <td>Clear Print 2</td>\
                      <td>N1,395</td>\
                      <td>N1,115</td>\
                      <td>N95</td>\
                      <td>N25.00</td>\
                      <td>1,000</td>\
                    </tr>\
                    <tr>\
                      <td>Super Print</td>\
                      <td>N1,595</td>\
                      <td>N1,275</td>\
                      <td>N95</td>\
                      <td>N17.95</td>\
                      <td>950</td>\
                    </tr>\
                    <tr>\
                      <td>Deluxe Print</td>\
                      <td>N795</td>\
                      <td>N595</td>\
                      <td>N95</td>\
                      <td>N21.95</td>\
                      <td>800</td>\
                    </tr>\
                  </table></div><br>\
                  What is the approximate cost in ink cartridges per page printed on the Clear Print 1?',
        options: ["2.0k", "3.5k", "4.0k", "2.5k", "3.0k"],
        correct: 4,
        explanation: "For Clear Print 1, the ink cartridge cost per page is calculated as follows: N17.95 / 900 = 0.0199 ≈ 0.02k."
    },
    {
        question: 'Refer to the table below and answer the following question:<br><br>\
                  <div class="table-container"><table class="table">\
                    <tr>\
                      <th>Sales Region</th>\
                      <th>Accepted (2013)</th>\
                      <th>Rejected (2013)</th>\
                      <th>Accepted (2014)</th>\
                      <th>Rejected (2014)</th>\
                    </tr>\
                    <tr>\
                      <td>North-West</td>\
                      <td>150</td>\
                      <td>58</td>\
                      <td>174</td>\
                      <td>132</td>\
                    </tr>\
                    <tr>\
                      <td>South-East</td>\
                      <td>210</td>\
                      <td>122</td>\
                      <td>276</td>\
                      <td>168</td>\
                    </tr>\
                  </table></div><br>\
                  What percentage of all 2013 proposals was accepted?',
        options: ["67%", "23%", "28%", "39%", "33%"],
        correct: 0,
        explanation: "To find the percentage of accepted proposals in 2013: Total proposals in 2013 = Accepted (North-West) + Rejected (North-West) + Accepted (South-East) + Rejected (South-East). Total proposals = 150 + 58 + 210 + 122 = 540. Accepted proposals = 150 + 210 = 360. Percentage accepted = (360 / 540) * 100 = 66.67% ≈ 67%."
    }
];

let currentQuestionIndex = 0;
let time = 0;
let darkMode = false;

function startTimer() {
    setInterval(() => {
        time++;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerElement.textContent = `Time: ${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function loadQuestion() {
    let question = questions[currentQuestionIndex];
    questionElement.innerHTML = question.question;
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        let button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index, button);
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selectedIndex, button) {
    let question = questions[currentQuestionIndex];
    if (selectedIndex === question.correct) {
        button.classList.add('correct');
        popupMessage.textContent = "Correct!";
    } else {
        button.classList.add('incorrect');
        popupMessage.textContent = "Incorrect!";
    }
    explanationElement.textContent = question.explanation;
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function nextQuestion() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        questionElement.textContent = "Quiz completed!";
        optionsElement.innerHTML = '';
    }
}

function toggleMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add('dark-mode');
        modeToggle.textContent = "Switch to Light Mode";
    } else {
        document.body.classList.remove('dark-mode');
        modeToggle.textContent = "Switch to Dark Mode";
    }
}

window.onload = () => {
    startTimer();
    loadQuestion();
};
