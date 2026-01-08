# LIBF FIS Revision Website

Interactive revision resources for the LIBF Level 2 Certificate/Award in Financial Education - Unit 1: Finance, the Individual and Society (FIS).

## 🚀 Quick Start

### Option 1: Local Preview
Simply open `index.html` in your web browser.

### Option 2: Deploy to GitHub Pages (Free Hosting)

1. **Create a GitHub repository**
   - Go to [github.com](https://github.com) and sign in
   - Click the "+" icon → "New repository"
   - Name it `libf-fis-revision` (or any name you prefer)
   - Make it **Public**
   - Click "Create repository"

2. **Upload the files**
   - On your new repository page, click "uploading an existing file"
   - Drag and drop ALL files and folders from this project
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to your repository's **Settings** tab
   - Scroll down to **Pages** in the left sidebar
   - Under "Source", select **main** branch
   - Click **Save**
   - Wait 1-2 minutes, then your site will be live at:
     ```
     https://YOUR-USERNAME.github.io/libf-fis-revision/
     ```

## 📁 Project Structure

```
libf-fis-revision/
├── index.html                  # Homepage with topic selection
├── css/
│   └── styles.css             # All styling
├── js/
│   ├── quiz.js                # MCQ quiz engine
│   ├── card-sort.js           # Drag-and-drop activities
│   └── activities.js          # Flip cards, true/false, fill blanks
├── topics/
│   ├── topic-1-citizenship/
│   │   └── index.html
│   ├── topic-2-government/
│   │   └── index.html
│   ├── ...
│   └── topic-11-life-cycle/
│       └── index.html
└── assets/
    └── images/
```

## ✨ Features

### Interactive Activities (AFL)
- **MCQ Quizzes** - Instant feedback with explanations
- **Card Sort** - Drag and drop matching exercises
- **True/False** - Quick comprehension checks
- **Fill in the Blanks** - Complete the sentence activities
- **Flip Cards** - Click to reveal definitions
- **Reveal Answers** - Model answers for case studies

### No Backend Required
- Everything runs in the browser
- No student tracking (designed for formative assessment)
- Works offline once loaded

## 🛠️ How to Create New Topic Pages

1. Copy an existing topic folder (e.g., `topic-9-economic-cycles`)
2. Rename it (e.g., `topic-5-tax`)
3. Edit the `index.html` inside:
   - Update the `<title>` and `<h1>`
   - Modify the knowledge organiser tables
   - Update activity data in the `<script>` section

### Example: Adding a Quiz

```javascript
new Quiz('my-quiz-container', [
    {
        question: 'What does PAYE stand for?',
        options: [
            'Pay As You Go',
            'Pay As You Earn',
            'Pay As You Exit',
            'Pay And Yearly Estimate'
        ],
        correct: 1,  // Index of correct answer (0-based)
        explanation: 'PAYE stands for Pay As You Earn - the system where employers deduct tax from wages.'
    },
    // Add more questions...
]);
```

### Example: Adding a Card Sort

```javascript
new CardSort('my-card-sort', 
    // Terms to sort
    [
        { id: 'a', text: 'Income Tax' },
        { id: 'b', text: 'VAT' },
        { id: 'c', text: 'Council Tax' }
    ],
    // Categories with correct answers
    [
        { id: 'direct', title: 'Direct Tax', correctTerms: ['a'] },
        { id: 'indirect', title: 'Indirect Tax', correctTerms: ['b'] },
        { id: 'local', title: 'Local Tax', correctTerms: ['c'] }
    ]
);
```

### Example: Adding True/False

```javascript
new TrueFalse('my-tf-activity', [
    {
        statement: 'VAT is a direct tax.',
        isTrue: false,
        explanation: 'VAT is an INDIRECT tax - it\'s added to the price of goods and services.'
    },
    // Add more statements...
]);
```

### Example: Adding Flip Cards

```javascript
new FlipCards('my-flip-cards', [
    { front: 'PAYE', back: 'Pay As You Earn - system where employers deduct tax from wages' },
    { front: 'VAT', back: 'Value Added Tax - added to the price of most goods and services' },
    // Add more cards...
]);
```

## 📱 Responsive Design

The site works on:
- Desktop computers
- Tablets
- Mobile phones

All activities are touch-friendly for tablet use in classrooms.

## 🎨 Customisation

### Changing Colours
Edit the CSS variables at the top of `css/styles.css`:

```css
:root {
    --primary: #1F4E79;      /* Main brand colour */
    --secondary: #385723;    /* Secondary colour */
    --accent: #ED7D31;       /* Accent colour */
    --danger: #C00000;       /* Error/warning colour */
    --success: #28a745;      /* Success colour */
}
```

### Adding Your School Logo
Place your logo in `assets/images/` and add to the header in each HTML file:

```html
<header>
    <div class="container">
        <img src="../../assets/images/logo.png" alt="School Logo" style="height: 50px;">
        <h1>Topic 9: Economic Cycles</h1>
    </div>
</header>
```

## 📝 Content Checklist

| Topic | Status |
|-------|--------|
| Topic 1: Citizenship | ⬜ To do |
| Topic 2: Government | ⬜ To do |
| Topic 3: Money | ⬜ To do |
| Topic 4: Income | ⬜ To do |
| Topic 5: Tax | ⬜ To do |
| Topic 6: Economy | ⬜ To do |
| Topic 7: Financial Choices | ⬜ To do |
| Topic 8: Inflation & Interest | ⬜ To do |
| Topic 9: Economic Cycles | ✅ Complete |
| Topic 10: Foreign Exchange | ⬜ To do |
| Topic 11: Life Cycle | ⬜ To do |

## 📄 License

Created for educational purposes. Feel free to adapt for your own teaching.

## 🤝 Contributing

To add new topics or fix issues:
1. Fork this repository
2. Make your changes
3. Submit a pull request

---

**Questions?** This project was created to support LIBF FIS teaching and revision.
