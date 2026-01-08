# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static educational website for LIBF Level 2 Certificate/Award in Financial Education - Unit 1: Finance, the Individual and Society (FIS). It provides interactive revision resources with no backend required.

## Development

**Local Preview:** Open `index.html` in a browser - no build step required.

**Deployment:** Static files hosted on GitHub Pages.

## Architecture

### Core JavaScript Classes (in `js/`)

All classes are exposed on `window` for use in inline `<script>` tags within topic pages:

- **Quiz** (`quiz.js`) - MCQ quizzes with scoring. Constructor: `new Quiz(containerId, [{question, options, correct, explanation}])`
- **QuickCheck** (`quiz.js`) - Single question with instant feedback
- **CardSort** (`card-sort.js`) - Drag-and-drop categorization. Constructor: `new CardSort(containerId, [{id, text}], [{id, title, correctTerms}])`
- **MatchingActivity** (`card-sort.js`) - Click-to-match pairs
- **FlipCards** (`activities.js`) - Term/definition cards. Constructor: `new FlipCards(containerId, [{front, back}])`
- **TrueFalse** (`activities.js`) - Statement verification with explanations
- **FillBlanks** (`activities.js`) - Fill-in-the-blank exercises
- **RevealAnswer** (`activities.js`) - Show/hide answer toggle

### File Structure

```
index.html              # Homepage with topic grid
css/styles.css          # Main stylesheet with CSS variables for theming
js/                     # Activity engine classes
topics/topic-N-*/       # Each topic has its own index.html
```

### Creating New Topic Pages

1. Copy an existing `topics/topic-N-*/index.html`
2. Update `<title>`, `<h1>`, and content tables
3. Configure activities in the inline `<script>` section at the bottom
4. Link CSS as `../../css/styles.css` and JS files as `../../js/*.js`

### Styling Conventions

- CSS variables in `:root` control theming (--primary, --secondary, --accent, etc.)
- Each topic has a unique color via `--topic-N` variables
- Topic cards use `data-topic="N"` attribute for color association
- Responsive breakpoint at 768px

### Activity Data Format Examples

**Quiz questions:**
```javascript
{ question: 'Text?', options: ['A', 'B', 'C', 'D'], correct: 1, explanation: 'Why B is correct' }
```

**Card sort:**
```javascript
terms: [{ id: 'a', text: 'Term A' }]
zones: [{ id: 'zone1', title: 'Category', correctTerms: ['a'] }]
```

**True/False:**
```javascript
{ statement: 'Claim text', isTrue: false, explanation: 'Why false' }
```
