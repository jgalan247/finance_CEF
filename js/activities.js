/**
 * LIBF FIS Revision - Flip Cards & Reveal Answers
 */

class FlipCards {
    constructor(containerId, cards) {
        this.container = document.getElementById(containerId);
        this.cards = cards; // Array of { front, back }
        this.render();
    }

    render() {
        let html = '<div class="flip-cards-grid">';
        
        this.cards.forEach((card, index) => {
            html += `
                <div class="flip-card" data-index="${index}">
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            ${card.front}
                        </div>
                        <div class="flip-card-back">
                            ${card.back}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        html += '<p style="text-align: center; margin-top: 16px; color: #666;">Click a card to flip it</p>';
        
        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.container.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
}

// Reveal answer component
class RevealAnswer {
    constructor(buttonId, contentId) {
        this.button = document.getElementById(buttonId);
        this.content = document.getElementById(contentId);
        this.revealed = false;
        this.attachEventListener();
    }

    attachEventListener() {
        this.button.addEventListener('click', () => {
            this.revealed = !this.revealed;
            
            if (this.revealed) {
                this.content.classList.add('show');
                this.button.textContent = 'Hide Answer';
                this.button.classList.remove('btn-primary');
                this.button.classList.add('btn-outline');
            } else {
                this.content.classList.remove('show');
                this.button.textContent = 'Reveal Answer';
                this.button.classList.remove('btn-outline');
                this.button.classList.add('btn-primary');
            }
        });
    }
}

// Simple reveal all function
function setupRevealButtons() {
    document.querySelectorAll('.reveal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const content = document.getElementById(targetId);
            
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                btn.textContent = btn.dataset.showText || 'Reveal Answer';
            } else {
                content.classList.add('show');
                btn.textContent = btn.dataset.hideText || 'Hide Answer';
            }
        });
    });
}

// True/False quick activity
class TrueFalse {
    constructor(containerId, statements) {
        this.container = document.getElementById(containerId);
        this.statements = statements; // Array of { statement, isTrue, explanation }
        this.answers = {};
        this.render();
    }

    render() {
        let html = '<div class="true-false-activity">';
        
        this.statements.forEach((item, index) => {
            html += `
                <div class="tf-statement" data-index="${index}" style="
                    background: white;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                ">
                    <p style="margin-bottom: 12px;"><strong>${index + 1}.</strong> ${item.statement}</p>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-outline tf-btn" data-answer="true" style="flex: 1;">True</button>
                        <button class="btn btn-outline tf-btn" data-answer="false" style="flex: 1;">False</button>
                    </div>
                    <div class="tf-feedback" id="tf-feedback-${index}" style="
                        margin-top: 12px;
                        padding: 12px;
                        border-radius: 6px;
                        display: none;
                    "></div>
                </div>
            `;
        });

        html += '</div>';
        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.container.querySelectorAll('.tf-statement').forEach(statement => {
            const index = statement.dataset.index;
            const buttons = statement.querySelectorAll('.tf-btn');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (this.answers[index] !== undefined) return;
                    
                    const userAnswer = btn.dataset.answer === 'true';
                    const correctAnswer = this.statements[index].isTrue;
                    const explanation = this.statements[index].explanation;
                    
                    this.answers[index] = userAnswer;
                    
                    const feedbackEl = document.getElementById(`tf-feedback-${index}`);
                    
                    buttons.forEach(b => {
                        b.disabled = true;
                        b.style.opacity = '0.6';
                    });
                    
                    if (userAnswer === correctAnswer) {
                        btn.classList.remove('btn-outline');
                        btn.classList.add('btn-success');
                        btn.style.opacity = '1';
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#d4edda';
                        feedbackEl.style.color = '#155724';
                        feedbackEl.innerHTML = `<strong>✓ Correct!</strong> ${explanation}`;
                    } else {
                        btn.classList.remove('btn-outline');
                        btn.classList.add('btn-danger');
                        btn.style.opacity = '1';
                        
                        // Highlight correct answer
                        const correctBtn = statement.querySelector(`[data-answer="${correctAnswer}"]`);
                        correctBtn.classList.remove('btn-outline');
                        correctBtn.classList.add('btn-success');
                        correctBtn.style.opacity = '1';
                        
                        feedbackEl.style.display = 'block';
                        feedbackEl.style.background = '#f8d7da';
                        feedbackEl.style.color = '#721c24';
                        feedbackEl.innerHTML = `<strong>✗ Incorrect.</strong> ${explanation}`;
                    }
                });
            });
        });
    }
}

// Fill in the blanks
class FillBlanks {
    constructor(containerId, text, blanks) {
        this.container = document.getElementById(containerId);
        this.text = text; // Text with {0}, {1}, etc. as placeholders
        this.blanks = blanks; // Array of correct answers
        this.render();
    }

    render() {
        let processedText = this.text;
        
        this.blanks.forEach((blank, index) => {
            processedText = processedText.replace(
                `{${index}}`,
                `<input type="text" class="fill-blank" data-index="${index}" style="
                    border: none;
                    border-bottom: 2px solid #1F4E79;
                    padding: 4px 8px;
                    font-size: inherit;
                    width: 120px;
                    text-align: center;
                    background: #f8f9fa;
                ">`
            );
        });

        let html = `
            <div class="fill-blanks-text" style="line-height: 2.5; font-size: 1.1rem;">
                ${processedText}
            </div>
            <div style="margin-top: 20px;">
                <button class="btn btn-success" id="${this.container.id}-check">Check Answers</button>
                <button class="btn btn-outline" id="${this.container.id}-reset" style="margin-left: 10px;">Reset</button>
            </div>
            <div id="${this.container.id}-feedback" class="quiz-feedback" style="margin-top: 16px;"></div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById(`${this.container.id}-check`).addEventListener('click', () => {
            this.checkAnswers();
        });

        document.getElementById(`${this.container.id}-reset`).addEventListener('click', () => {
            this.render();
        });
    }

    checkAnswers() {
        const inputs = this.container.querySelectorAll('.fill-blank');
        let correct = 0;

        inputs.forEach(input => {
            const index = input.dataset.index;
            const userAnswer = input.value.trim().toLowerCase();
            const correctAnswer = this.blanks[index].toLowerCase();

            if (userAnswer === correctAnswer) {
                input.style.borderColor = '#28a745';
                input.style.background = '#d4edda';
                correct++;
            } else {
                input.style.borderColor = '#dc3545';
                input.style.background = '#f8d7da';
                input.value = this.blanks[index];
            }
        });

        const feedbackEl = document.getElementById(`${this.container.id}-feedback`);
        
        if (correct === this.blanks.length) {
            feedbackEl.className = 'quiz-feedback show correct';
            feedbackEl.innerHTML = `<strong>✓ Perfect!</strong> All blanks filled correctly!`;
        } else {
            feedbackEl.className = 'quiz-feedback show incorrect';
            feedbackEl.innerHTML = `<strong>${correct}/${this.blanks.length} correct.</strong> The correct answers are now shown in red boxes.`;
        }
    }
}

window.FlipCards = FlipCards;
window.RevealAnswer = RevealAnswer;
window.TrueFalse = TrueFalse;
window.FillBlanks = FillBlanks;
window.setupRevealButtons = setupRevealButtons;
