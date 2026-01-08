/**
 * LIBF FIS Revision - Quiz Engine
 * Handles MCQ quizzes with instant feedback
 */

class Quiz {
    constructor(containerId, questions) {
        this.container = document.getElementById(containerId);
        this.questions = questions;
        this.answers = {};
        this.submitted = false;
        this.render();
    }

    render() {
        let html = '<div class="quiz-questions">';
        
        this.questions.forEach((q, index) => {
            html += `
                <div class="quiz-question" data-question="${index}">
                    <h4>
                        <span class="question-number">Q${index + 1}</span>
                        ${q.question}
                    </h4>
                    <div class="quiz-options">
                        ${q.options.map((opt, optIndex) => `
                            <label class="quiz-option" data-option="${optIndex}">
                                <input type="radio" name="q${index}" value="${optIndex}">
                                ${opt}
                            </label>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback" id="feedback-${index}"></div>
                </div>
            `;
        });

        html += '</div>';
        html += `
            <div class="quiz-controls">
                <button class="btn btn-primary" id="check-answers">Check Answers</button>
                <button class="btn btn-outline" id="reset-quiz" style="margin-left: 10px;">Try Again</button>
            </div>
            <div class="quiz-score" id="quiz-score" style="display: none;"></div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Option selection
        this.container.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (this.submitted) return;
                
                const questionEl = option.closest('.quiz-question');
                const questionIndex = questionEl.dataset.question;
                
                // Remove selected class from siblings
                questionEl.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Add selected class
                option.classList.add('selected');
                option.querySelector('input').checked = true;
                
                // Store answer
                this.answers[questionIndex] = parseInt(option.dataset.option);
            });
        });

        // Check answers button
        this.container.querySelector('#check-answers').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Reset button
        this.container.querySelector('#reset-quiz').addEventListener('click', () => {
            this.reset();
        });
    }

    checkAnswers() {
        if (this.submitted) return;
        
        let score = 0;
        
        this.questions.forEach((q, index) => {
            const questionEl = this.container.querySelector(`[data-question="${index}"]`);
            const feedbackEl = document.getElementById(`feedback-${index}`);
            const userAnswer = this.answers[index];
            const correctAnswer = q.correct;

            // Clear previous styling
            questionEl.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });

            if (userAnswer !== undefined) {
                const selectedOption = questionEl.querySelector(`[data-option="${userAnswer}"]`);
                
                if (userAnswer === correctAnswer) {
                    selectedOption.classList.add('correct');
                    feedbackEl.className = 'quiz-feedback show correct';
                    feedbackEl.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation || ''}`;
                    score++;
                } else {
                    selectedOption.classList.add('incorrect');
                    const correctOption = questionEl.querySelector(`[data-option="${correctAnswer}"]`);
                    correctOption.classList.add('correct');
                    feedbackEl.className = 'quiz-feedback show incorrect';
                    feedbackEl.innerHTML = `<strong>✗ Incorrect.</strong> The correct answer is: <strong>${q.options[correctAnswer]}</strong><br>${q.explanation || ''}`;
                }
            } else {
                feedbackEl.className = 'quiz-feedback show incorrect';
                feedbackEl.innerHTML = `<strong>Not answered.</strong> The correct answer is: <strong>${q.options[correctAnswer]}</strong>`;
                const correctOption = questionEl.querySelector(`[data-option="${correctAnswer}"]`);
                correctOption.classList.add('correct');
            }
        });

        // Show score
        const scoreEl = document.getElementById('quiz-score');
        const percentage = Math.round((score / this.questions.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = 'Excellent work! 🌟';
        } else if (percentage >= 60) {
            message = 'Good effort! Keep practising.';
        } else if (percentage >= 40) {
            message = 'You\'re getting there. Review the explanations above.';
        } else {
            message = 'Keep studying! Review the knowledge organiser and try again.';
        }

        scoreEl.innerHTML = `
            <h3>${score} / ${this.questions.length}</h3>
            <p>${percentage}%</p>
            <p>${message}</p>
        `;
        scoreEl.style.display = 'block';

        this.submitted = true;
        this.container.querySelector('#check-answers').disabled = true;
    }

    reset() {
        this.answers = {};
        this.submitted = false;
        this.render();
        window.scrollTo({ top: this.container.offsetTop - 100, behavior: 'smooth' });
    }
}

// Quick check - single question with instant feedback
class QuickCheck {
    constructor(containerId, question, options, correctIndex, explanation) {
        this.container = document.getElementById(containerId);
        this.question = question;
        this.options = options;
        this.correctIndex = correctIndex;
        this.explanation = explanation;
        this.answered = false;
        this.render();
    }

    render() {
        let html = `
            <div class="quiz-question">
                <h4>${this.question}</h4>
                <div class="quiz-options">
                    ${this.options.map((opt, index) => `
                        <label class="quiz-option" data-option="${index}">
                            <input type="radio" name="quick-${this.container.id}" value="${index}">
                            ${opt}
                        </label>
                    `).join('')}
                </div>
                <div class="quiz-feedback" id="${this.container.id}-feedback"></div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.container.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                if (this.answered) return;
                
                const selectedIndex = parseInt(option.dataset.option);
                const feedbackEl = document.getElementById(`${this.container.id}-feedback`);
                
                this.container.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect');
                });

                option.classList.add('selected');
                option.querySelector('input').checked = true;

                if (selectedIndex === this.correctIndex) {
                    option.classList.add('correct');
                    feedbackEl.className = 'quiz-feedback show correct';
                    feedbackEl.innerHTML = `<strong>✓ Correct!</strong> ${this.explanation}`;
                } else {
                    option.classList.add('incorrect');
                    const correctOption = this.container.querySelector(`[data-option="${this.correctIndex}"]`);
                    correctOption.classList.add('correct');
                    feedbackEl.className = 'quiz-feedback show incorrect';
                    feedbackEl.innerHTML = `<strong>✗ Not quite.</strong> ${this.explanation}`;
                }

                this.answered = true;
            });
        });
    }
}

// Export for use
window.Quiz = Quiz;
window.QuickCheck = QuickCheck;
