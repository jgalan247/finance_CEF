/**
 * LIBF FIS Test Engine
 * Handles timed tests with PDF result generation
 */

class FISTest {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.config = config; // { topicNumber, topicName, questions, caseStudies }
        this.answers = {};
        this.submitted = false;
        this.studentName = '';
        this.render();
    }

    render() {
        let html = `
            <div class="test-container">
                <div class="test-header">
                    <h2>Topic ${this.config.topicNumber}: ${this.config.topicName}</h2>
                    <p class="test-info">This test contains ${this.config.questions.length} standalone questions and ${this.config.caseStudies.length} case studies.</p>
                </div>

                <div class="student-info" id="student-info">
                    <label for="student-name"><strong>Enter your name:</strong></label>
                    <input type="text" id="student-name" placeholder="Your full name" required>
                </div>

                <div class="test-questions">
                    <h3>Section A: Multiple Choice Questions</h3>
        `;

        // Standalone questions
        this.config.questions.forEach((q, index) => {
            html += this.renderQuestion(q, index, index + 1);
        });

        // Case studies
        let questionNumber = this.config.questions.length + 1;
        this.config.caseStudies.forEach((cs, csIndex) => {
            html += `
                <div class="case-study-section">
                    <h3>Case Study ${csIndex + 1}: ${cs.title}</h3>
                    <div class="case-study-scenario">
                        ${cs.scenario}
                    </div>
            `;

            cs.questions.forEach((q, qIndex) => {
                const globalIndex = this.config.questions.length + (csIndex * cs.questions.length) + qIndex;
                html += this.renderQuestion(q, globalIndex, questionNumber);
                questionNumber++;
            });

            html += `</div>`;
        });

        html += `
                </div>

                <div class="test-controls">
                    <button class="btn btn-primary btn-large" id="submit-test">Submit Test</button>
                </div>

                <div id="test-results" class="test-results" style="display: none;"></div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    renderQuestion(q, index, displayNumber) {
        return `
            <div class="test-question" data-question="${index}">
                <p class="question-text"><strong>Q${displayNumber}.</strong> ${q.question}</p>
                <div class="test-options">
                    ${q.options.map((opt, optIndex) => `
                        <label class="test-option" data-option="${optIndex}">
                            <input type="radio" name="q${index}" value="${optIndex}">
                            <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                            <span class="option-text">${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Option selection
        this.container.querySelectorAll('.test-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (this.submitted) return;

                const questionEl = option.closest('.test-question');
                const questionIndex = questionEl.dataset.question;

                questionEl.querySelectorAll('.test-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                option.classList.add('selected');
                option.querySelector('input').checked = true;
                this.answers[questionIndex] = parseInt(option.dataset.option);
            });
        });

        // Submit button
        this.container.querySelector('#submit-test').addEventListener('click', () => {
            this.submitTest();
        });
    }

    getAllQuestions() {
        let allQuestions = [...this.config.questions];
        this.config.caseStudies.forEach(cs => {
            allQuestions = allQuestions.concat(cs.questions);
        });
        return allQuestions;
    }

    submitTest() {
        if (this.submitted) return;

        // Get student name
        const nameInput = document.getElementById('student-name');
        this.studentName = nameInput.value.trim();

        if (!this.studentName) {
            alert('Please enter your name before submitting.');
            nameInput.focus();
            return;
        }

        const allQuestions = this.getAllQuestions();
        const totalQuestions = allQuestions.length;
        const answeredCount = Object.keys(this.answers).length;

        if (answeredCount < totalQuestions) {
            const unanswered = totalQuestions - answeredCount;
            if (!confirm(`You have ${unanswered} unanswered question(s). Do you want to submit anyway?`)) {
                return;
            }
        }

        this.submitted = true;
        this.calculateResults();
    }

    calculateResults() {
        const allQuestions = this.getAllQuestions();
        let score = 0;
        const results = [];

        allQuestions.forEach((q, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === q.correct;
            if (isCorrect) score++;

            results.push({
                questionNumber: index + 1,
                question: q.question,
                userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'Not answered',
                correctAnswer: q.options[q.correct],
                isCorrect: isCorrect,
                explanation: q.explanation || ''
            });

            // Update UI
            const questionEl = this.container.querySelector(`[data-question="${index}"]`);
            if (questionEl) {
                questionEl.querySelectorAll('.test-option').forEach(opt => {
                    const optIndex = parseInt(opt.dataset.option);
                    if (optIndex === q.correct) {
                        opt.classList.add('correct');
                    } else if (optIndex === userAnswer && !isCorrect) {
                        opt.classList.add('incorrect');
                    }
                });
            }
        });

        const percentage = Math.round((score / allQuestions.length) * 100);
        const passed = percentage >= 50;

        // Disable submit button
        this.container.querySelector('#submit-test').disabled = true;
        this.container.querySelector('#submit-test').textContent = 'Test Submitted';

        // Disable name input
        document.getElementById('student-name').disabled = true;

        // Show results
        this.showResults(score, allQuestions.length, percentage, passed, results);

        // Generate PDF
        this.generatePDF(score, allQuestions.length, percentage, passed, results);
    }

    showResults(score, total, percentage, passed, results) {
        const resultsDiv = document.getElementById('test-results');

        let html = `
            <div class="results-summary ${passed ? 'passed' : 'failed'}">
                <h2>${passed ? 'Well Done!' : 'Keep Practicing!'}</h2>
                <div class="score-display">
                    <span class="score-number">${score}/${total}</span>
                    <span class="score-percentage">${percentage}%</span>
                </div>
                <p class="pass-status">${passed ? 'You have passed this test!' : 'You need 50% to pass. Review the topics and try again.'}</p>
            </div>
            <div class="results-detail">
                <h3>Question Review</h3>
        `;

        results.forEach((r, i) => {
            html += `
                <div class="result-item ${r.isCorrect ? 'correct' : 'incorrect'}">
                    <p><strong>Q${r.questionNumber}.</strong> ${r.question}</p>
                    <p>Your answer: <span class="${r.isCorrect ? 'answer-correct' : 'answer-wrong'}">${r.userAnswer}</span></p>
                    ${!r.isCorrect ? `<p>Correct answer: <span class="answer-correct">${r.correctAnswer}</span></p>` : ''}
                    ${r.explanation ? `<p class="explanation">${r.explanation}</p>` : ''}
                </div>
            `;
        });

        html += `
            </div>
            <p class="pdf-notice">A PDF of your results has been downloaded automatically.</p>
        `;

        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }

    generatePDF(score, total, percentage, passed, results) {
        // Generate 6-digit random number
        const randomId = Math.floor(100000 + Math.random() * 900000);
        const dateStr = new Date().toLocaleDateString('en-GB');
        const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(31, 78, 121);
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('LIBF FIS Test Results', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Topic ${this.config.topicNumber}: ${this.config.topicName}`, 105, 25, { align: 'center' });

        // Student info box
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(248, 249, 250);
        doc.rect(15, 45, 180, 35, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, 45, 180, 35, 'S');

        doc.setFontSize(11);
        doc.text(`Student Name: ${this.studentName}`, 20, 55);
        doc.text(`Date: ${dateStr}`, 20, 63);
        doc.text(`Time: ${timeStr}`, 20, 71);
        doc.text(`Reference: ${randomId}`, 140, 55);

        // Results box
        const resultColor = passed ? [40, 167, 69] : [220, 53, 69];
        doc.setFillColor(...resultColor);
        doc.rect(15, 90, 180, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(`${score} / ${total}`, 105, 108, { align: 'center' });

        doc.setFontSize(18);
        doc.text(`${percentage}%`, 105, 120, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const statusText = passed ? 'PASSED' : 'NOT PASSED (50% required)';
        doc.text(statusText, 105, 128, { align: 'center' });

        // Question breakdown header
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Question Breakdown', 15, 145);

        // Questions table
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        let yPos = 155;
        const pageHeight = 280;

        results.forEach((r, i) => {
            if (yPos > pageHeight) {
                doc.addPage();
                yPos = 20;
            }

            const icon = r.isCorrect ? '✓' : '✗';
            const bgColor = r.isCorrect ? [212, 237, 218] : [248, 215, 218];

            doc.setFillColor(...bgColor);
            doc.rect(15, yPos - 4, 180, 8, 'F');

            doc.setTextColor(0, 0, 0);
            doc.text(`Q${r.questionNumber}. ${icon} ${r.isCorrect ? 'Correct' : 'Incorrect'}`, 18, yPos);

            if (!r.isCorrect) {
                doc.setTextColor(100, 100, 100);
                doc.text(`Your answer: ${r.userAnswer.substring(0, 40)}...`, 18, yPos + 5);
                doc.text(`Correct: ${r.correctAnswer.substring(0, 40)}`, 18, yPos + 10);
                yPos += 18;
            } else {
                yPos += 10;
            }
        });

        // Footer
        if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('LIBF Level 2 Certificate in Financial Education - FIS Unit 1', 105, 290, { align: 'center' });

        // Save PDF
        const fileName = `Topic_${this.config.topicNumber}_${this.config.topicName.replace(/\s+/g, '_')}_${randomId}.pdf`;
        doc.save(fileName);
    }
}

// Export
window.FISTest = FISTest;
