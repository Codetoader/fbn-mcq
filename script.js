class MCQRenderer {
    constructor(jsonPath) {
        this.jsonPath = jsonPath;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.timer = null;
        this.timerDuration = 30; // seconds
        this.progressColors = ['#FF6347', '#FFA500', '#FFFF00', '#ADFF2F', '#7FFF00']; // Colors for each second
    }
  
    fetchQuestions() {
        return fetch(this.jsonPath)
            .then(response => response.json())
            .then(data => {
                this.questions = data.questions;
                this.renderQuestion();
            })
            .catch(error => console.error('Error fetching the questions:', error));
    }
  
    renderQuestion() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = ''; // Clear previous content
  
        const question = this.questions[this.currentQuestionIndex];
  
        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        questionContainer.appendChild(questionText);
  
        if (question.type === 'table') {
            const table = this.createTable(question.tableData.headers, question.tableData.rows);
            questionContainer.appendChild(table);
        }
  
        this.renderOptions(question.options);
        this.startTimer();
    }
  
    createTable(headers, rows) {
        const table = document.createElement('table');
        table.classList.add('generated-table');
  
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
  
        const tbody = document.createElement('tbody');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
  
        return table;
    }
  
    renderOptions(options) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = ''; // Clear previous options
  
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => this.checkAnswer(option));
            optionsContainer.appendChild(button);
        });
    }
  
    checkAnswer(selectedOption) {
        clearInterval(this.timer);
        const question = this.questions[this.currentQuestionIndex];
        const feedback = document.getElementById('feedback');
        if (selectedOption === question.answer) {
            this.score++;
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
        } else {
            feedback.textContent = 'Wrong!';
            feedback.style.color = 'red';
        }
        this.updateScore();
        this.showFeedback();
        setTimeout(() => this.nextQuestion(), 2000);
    }
  
    nextQuestion() {
        const feedback = document.getElementById('feedback');
        feedback.textContent = '';
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.showFinalScore();
        }
    }
  
    updateScore() {
        const scoreContainer = document.getElementById('score');
        scoreContainer.textContent = `Score: ${this.score}`;
  
        const floatingScore = document.getElementById('floating-score');
        floatingScore.textContent = this.score;
        floatingScore.classList.remove('fade-float');
        void floatingScore.offsetWidth; // Reflow to restart the animation
        floatingScore.classList.add('fade-float');
    }
  
    showFinalScore() {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = `<p>Quiz Complete! Your final score is ${this.score} out of ${this.questions.length}</p>`;
        document.getElementById('options-container').innerHTML = '';
        document.getElementById('timer').style.display = 'none';
    }
  
    showFeedback() {
        const feedback = document.getElementById('feedback');
        feedback.classList.remove('fade-float');
        void feedback.offsetWidth; // Reflow to restart the animation
        feedback.classList.add('fade-float');
    }
  
    startTimer() {
        const timerLine = document.getElementById('timer-line');
        let remainingTime = this.timerDuration;
        timerLine.style.width = '100%';
        timerLine.style.backgroundColor = this.progressColors[remainingTime - 1];
    
        const timerNumber = document.getElementById('timer-number');
        const progressCircle = document.querySelector('.radial-timer .progress');
        const radialTimer = document.querySelector('.radial-timer');
        const totalLength = 176; // Circumference of the circle (2 * π * r where r is 28)
    
        timerNumber.textContent = remainingTime;
        progressCircle.style.strokeDashoffset = totalLength;
    
        const vibrationThreshold = this.timerDuration * 0.25;
    
        this.timer = setInterval(() => {
            remainingTime--;
            if (remainingTime >= 0) {
                timerLine.style.width = `${(remainingTime / this.timerDuration) * 100}%`;
                timerLine.style.backgroundColor = this.progressColors[remainingTime];
                timerNumber.textContent = remainingTime;
                progressCircle.style.strokeDashoffset = totalLength - (totalLength * (remainingTime / this.timerDuration));
                if (remainingTime <= vibrationThreshold) {
                    radialTimer.classList.add('vibrate');
                } else {
                    radialTimer.classList.remove('vibrate');
                }
            } else {
                clearInterval(this.timer);
                this.nextQuestion();
            }
        }, 1000);
    }
  
    randomizeQuestions() {
        this.questions = this.questions.sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.updateScore();
        this.renderQuestion();
    }
  
    toggleGirlMode() {
        document.body.classList.toggle('girl-mode');
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const mcqRenderer = new MCQRenderer('questions.json');
    mcqRenderer.fetchQuestions();
  
    const randomizeButton = document.getElementById('randomize-button');
    randomizeButton.addEventListener('click', () => mcqRenderer.randomizeQuestions());
  
    const girlModeButton = document.getElementById('girl-mode-button');
    const chocolateModeButton = document.getElementById('chocolate-mode-button');
    const container = document.querySelector('.container');
  
    girlModeButton.addEventListener('click', () => {
        container.classList.toggle('girl-mode');
        container.classList.remove('chocolate-mode'); // Ensure Chocolate Mode is turned off
        removeChocolateLogo();
    });
  
    chocolateModeButton.addEventListener('click', () => {
        container.classList.toggle('chocolate-mode');
        container.classList.remove('girl-mode'); // Ensure Girl Mode is turned off
        if (container.classList.contains('chocolate-mode')) {
            addChocolateLogo();
        } else {
            removeChocolateLogo();
        }
    });
  
    function addChocolateLogo() {
        const logo = document.createElement('img');
        logo.src = 'images/chocolate-logo.png'; // Path to your chocolate logo image
        logo.classList.add('chocolate-logo');
        logo.id = 'chocolate-logo';
        document.body.appendChild(logo);
    }
  
    function removeChocolateLogo() {
        const logo = document.getElementById('chocolate-logo');
        if (logo) {
            logo.remove();
        }
    }
  });