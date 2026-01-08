/**
 * LIBF FIS Revision - Card Sort Activity
 * Drag and drop matching exercise
 */

class CardSort {
    constructor(containerId, terms, zones) {
        this.container = document.getElementById(containerId);
        this.terms = terms; // Array of { id, text }
        this.zones = zones; // Array of { id, title, correctTerms: [] }
        this.placements = {};
        this.render();
    }

    render() {
        let html = `
            <div class="card-sort-container">
                <div class="card-sort-terms" id="${this.container.id}-terms">
                    <p style="width: 100%; margin-bottom: 10px; color: #666; font-size: 0.9rem;">
                        <strong>Drag the items below to the correct category:</strong>
                    </p>
                    ${this.terms.map(term => `
                        <div class="sort-term" draggable="true" data-term-id="${term.id}">
                            ${term.text}
                        </div>
                    `).join('')}
                </div>
                <div class="card-sort-zones">
                    ${this.zones.map(zone => `
                        <div class="drop-zone" data-zone-id="${zone.id}">
                            <h4>${zone.title}</h4>
                            <div class="dropped-items"></div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button class="btn btn-success" id="${this.container.id}-check">Check Answers</button>
                    <button class="btn btn-outline" id="${this.container.id}-reset">Reset</button>
                </div>
                <div id="${this.container.id}-feedback" class="quiz-feedback" style="margin-top: 16px;"></div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const termsContainer = document.getElementById(`${this.container.id}-terms`);
        const terms = this.container.querySelectorAll('.sort-term');
        const dropZones = this.container.querySelectorAll('.drop-zone');

        // Drag start
        terms.forEach(term => {
            term.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', term.dataset.termId);
                term.classList.add('dragging');
            });

            term.addEventListener('dragend', () => {
                term.classList.remove('dragging');
            });
        });

        // Drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const termId = e.dataTransfer.getData('text/plain');
                const termEl = this.container.querySelector(`[data-term-id="${termId}"]`);
                
                if (termEl) {
                    const droppedItems = zone.querySelector('.dropped-items');
                    droppedItems.appendChild(termEl);
                    termEl.classList.add('placed');
                    this.placements[termId] = zone.dataset.zoneId;
                }
            });
        });

        // Allow dropping back to terms area
        termsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        termsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const termId = e.dataTransfer.getData('text/plain');
            const termEl = this.container.querySelector(`[data-term-id="${termId}"]`);
            
            if (termEl) {
                termsContainer.appendChild(termEl);
                termEl.classList.remove('placed');
                delete this.placements[termId];
            }
        });

        // Check button
        document.getElementById(`${this.container.id}-check`).addEventListener('click', () => {
            this.checkAnswers();
        });

        // Reset button
        document.getElementById(`${this.container.id}-reset`).addEventListener('click', () => {
            this.reset();
        });
    }

    checkAnswers() {
        let correct = 0;
        let total = this.terms.length;
        
        // Reset styling
        this.container.querySelectorAll('.sort-term').forEach(term => {
            term.style.background = '';
        });

        // Check each placement
        this.zones.forEach(zone => {
            const zoneEl = this.container.querySelector(`[data-zone-id="${zone.id}"]`);
            const placedTerms = zoneEl.querySelectorAll('.sort-term');
            
            placedTerms.forEach(termEl => {
                const termId = termEl.dataset.termId;
                if (zone.correctTerms.includes(termId)) {
                    termEl.style.background = '#28a745';
                    correct++;
                } else {
                    termEl.style.background = '#dc3545';
                }
            });
        });

        // Count unplaced terms as incorrect
        const unplaced = this.container.querySelectorAll(`#${this.container.id}-terms .sort-term`);
        unplaced.forEach(term => {
            term.style.background = '#dc3545';
        });

        // Show feedback
        const feedbackEl = document.getElementById(`${this.container.id}-feedback`);
        const percentage = Math.round((correct / total) * 100);
        
        if (percentage === 100) {
            feedbackEl.className = 'quiz-feedback show correct';
            feedbackEl.innerHTML = `<strong>✓ Perfect!</strong> You got all ${total} correct!`;
        } else if (percentage >= 70) {
            feedbackEl.className = 'quiz-feedback show correct';
            feedbackEl.innerHTML = `<strong>Good job!</strong> You got ${correct} out of ${total} correct (${percentage}%). Check the red items and try again.`;
        } else {
            feedbackEl.className = 'quiz-feedback show incorrect';
            feedbackEl.innerHTML = `<strong>Keep trying!</strong> You got ${correct} out of ${total} correct (${percentage}%). Review the items in red.`;
        }
    }

    reset() {
        this.placements = {};
        this.render();
    }
}

// Simpler matching activity (click to match)
class MatchingActivity {
    constructor(containerId, pairs) {
        this.container = document.getElementById(containerId);
        this.pairs = pairs; // Array of { term, definition }
        this.selectedTerm = null;
        this.matches = {};
        this.render();
    }

    render() {
        // Shuffle definitions
        const shuffledDefs = [...this.pairs].sort(() => Math.random() - 0.5);
        
        let html = `
            <div class="matching-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="matching-terms">
                    <h4 style="margin-bottom: 12px;">Terms</h4>
                    ${this.pairs.map((pair, i) => `
                        <div class="match-item term" data-index="${i}" style="
                            padding: 12px 16px;
                            margin-bottom: 8px;
                            background: #1F4E79;
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">${pair.term}</div>
                    `).join('')}
                </div>
                <div class="matching-definitions">
                    <h4 style="margin-bottom: 12px;">Definitions</h4>
                    ${shuffledDefs.map((pair, i) => `
                        <div class="match-item definition" data-def="${pair.term}" style="
                            padding: 12px 16px;
                            margin-bottom: 8px;
                            background: #f8f9fa;
                            border: 2px solid #dee2e6;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">${pair.definition}</div>
                    `).join('')}
                </div>
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
        const terms = this.container.querySelectorAll('.term');
        const definitions = this.container.querySelectorAll('.definition');

        terms.forEach(term => {
            term.addEventListener('click', () => {
                terms.forEach(t => t.style.outline = '');
                term.style.outline = '3px solid #ffc107';
                this.selectedTerm = term;
            });
        });

        definitions.forEach(def => {
            def.addEventListener('click', () => {
                if (this.selectedTerm) {
                    const termIndex = this.selectedTerm.dataset.index;
                    const defKey = def.dataset.def;
                    
                    this.matches[termIndex] = defKey;
                    
                    this.selectedTerm.style.opacity = '0.6';
                    def.style.opacity = '0.6';
                    
                    this.selectedTerm.style.outline = '';
                    this.selectedTerm = null;
                }
            });
        });

        document.getElementById(`${this.container.id}-check`).addEventListener('click', () => {
            this.checkAnswers();
        });

        document.getElementById(`${this.container.id}-reset`).addEventListener('click', () => {
            this.matches = {};
            this.selectedTerm = null;
            this.render();
        });
    }

    checkAnswers() {
        let correct = 0;
        const terms = this.container.querySelectorAll('.term');
        
        terms.forEach((term, index) => {
            const expectedDef = this.pairs[index].term;
            const actualDef = this.matches[index];
            
            if (actualDef === expectedDef) {
                term.style.background = '#28a745';
                correct++;
            } else {
                term.style.background = '#dc3545';
            }
        });

        const feedbackEl = document.getElementById(`${this.container.id}-feedback`);
        const percentage = Math.round((correct / this.pairs.length) * 100);
        
        if (percentage === 100) {
            feedbackEl.className = 'quiz-feedback show correct';
            feedbackEl.innerHTML = `<strong>✓ Perfect!</strong> All matches correct!`;
        } else {
            feedbackEl.className = 'quiz-feedback show incorrect';
            feedbackEl.innerHTML = `<strong>${correct}/${this.pairs.length} correct.</strong> Red items need another look.`;
        }
    }
}

window.CardSort = CardSort;
window.MatchingActivity = MatchingActivity;
