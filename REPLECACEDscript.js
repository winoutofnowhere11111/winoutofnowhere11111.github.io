// ============================================
// script.js - Main Application Logic
// ============================================
// INVENTOR: JavaScript MVC pattern
// FUNCTIONALITY: Handles search, results display, and navigation
// REPLACEMENT: Use React or Vue.js
// MODIFICATION: Change search algorithm or UI behavior
// ============================================

// -------- Constants --------
// INVENTOR: JavaScript best practices
// FUNCTIONALITY: Defines DOM selectors and configuration
// REPLACEMENT: Use environment variables
// MODIFICATION: Change selector names or configuration

const DOM = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    alphabetNav: document.querySelector('.alphabet-nav'),
    resultsPage: document.getElementById('resultsPage'),
    resultsList: document.getElementById('resultsList'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsCount: document.getElementById('resultsCount'),
    backBtn: document.getElementById('backBtn'),
    totalProblems: document.getElementById('totalProblems')
};

// -------- State Management --------
// INVENTOR: State management pattern
// FUNCTIONALITY: Stores application state
// REPLACEMENT: Use Redux or Vuex
// MODIFICATION: Add more state properties

const state = {
    currentLetter: null,
    currentResults: [],
    currentPage: 1,
    itemsPerPage: 50,
    totalResults: 0
};

// -------- Initialization --------
// INVENTOR: DOMContentLoaded event
// FUNCTIONALITY: Sets up the application when page loads
// REPLACEMENT: Use window.onload
// MODIFICATION: Add initialization order

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // INVENTOR: Initialization function
    // FUNCTIONALITY: Sets up event listeners and UI
    // MODIFICATION: Change initialization steps
    
    // Build alphabet navigation
    // INVENTOR: DOM manipulation
    // FUNCTIONALITY: Creates alphabet buttons
    // REPLACEMENT: Use template literals
    // MODIFICATION: Change button generation
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nav = DOM.alphabetNav;
    
    // Clear existing content
    // INVENTOR: HTML DOM
    // FUNCTIONALITY: Removes children from nav
    // REPLACEMENT: Use innerHTML
    // MODIFICATION: Change clearing method
    
    while (nav.firstChild) {
        nav.removeChild(nav.firstChild);
    }
    
    // Create buttons for each letter
    // INVENTOR: For...of loop
    // FUNCTIONALITY: Creates clickable alphabet buttons
    // REPLACEMENT: Use for loop
    // MODIFICATION: Change button appearance
    
    for (let letter of alphabet) {
        const btn = document.createElement('button');
        btn.className = 'alphabet-btn';
        btn.textContent = letter;
        btn.setAttribute('data-letter', letter);
        
        // Add click event listener
        // INVENTOR: Event handling
        // FUNCTIONALITY: Triggers search when letter clicked
        // REPLACEMENT: Use onclick attribute
        // MODIFICATION: Change event handler
        
        btn.addEventListener('click', function() {
            const letter = this.getAttribute('data-letter');
            handleSearch(letter);
        });
        
        nav.appendChild(btn);
    }
    
    // Set up search button
    // INVENTOR: Event listener
    // FUNCTIONALITY: Handles search button click
    // REPLACEMENT: Use onclick
    // MODIFICATION: Change search behavior
    
    DOM.searchBtn.addEventListener('click', function() {
        const input = DOM.searchInput.value.trim();
        if (input.length === 1 && input.match(/[a-zA-Z]/)) {
            handleSearch(input.toUpperCase());
        } else {
            showNotification('Please enter a single letter (A-Z)', 'warning');
        }
    });
    
    // Set up enter key on search input
    // INVENTOR: Keyboard events
    // FUNCTIONALITY: Triggers search on Enter key
    // REPLACEMENT: Use keyup event
    // MODIFICATION: Change key handling
    
    DOM.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            DOM.searchBtn.click();
        }
    });
    
    // Set up back button
    // INVENTOR: Navigation
    // FUNCTIONALITY: Returns to main page
    // REPLACEMENT: Use history.back()
    // MODIFICATION: Change navigation behavior
    
    DOM.backBtn.addEventListener('click', function() {
        goBack();
    });
    
    // Update total problems count
    // INVENTOR: DOM manipulation
    // FUNCTIONALITY: Shows total problems count
    // REPLACEMENT: Use textContent
    // MODIFICATION: Change formatting
    
    if (window.businessProblems) {
        DOM.totalProblems.textContent = window.businessProblems.length.toLocaleString();
    }
    
    // Create results page structure if not exists
    // INVENTOR: Dynamic DOM creation
    // FUNCTIONALITY: Creates results page elements
    // REPLACEMENT: Use HTML templates
    // MODIFICATION: Change structure
    
    createResultsPage();
}

// -------- Results Page Creation --------
// INVENTOR: DOM creation
// FUNCTIONALITY: Creates results page structure
// REPLACEMENT: Use HTML templates
// MODIFICATION: Change layout

function createResultsPage() {
    // Check if results page already exists
    // INVENTOR: DOM query
    // FUNCTIONALITY: Checks for existing results page
    // REPLACEMENT: Use ID check
    // MODIFICATION: Change existence check
    
    if (document.getElementById('resultsPage')) {
        return;
    }
    
    // Create results page container
    // INVENTOR: Document.createElement
    // FUNCTIONALITY: Creates new elements
    // REPLACEMENT: Use innerHTML
    // MODIFICATION: Change element structure
    
    const resultsPage = document.createElement('div');
    resultsPage.id = 'resultsPage';
    resultsPage.className = 'results-page';
    
    // Create header
    // INVENTOR: HTML structure
    // FUNCTIONALITY: Creates results header
    // REPLACEMENT: Use template literals
    // MODIFICATION: Change header layout
    
    const header = document.createElement('div');
    header.className = 'results-header';
    
    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
    
    const title = document.createElement('div');
    title.className = 'results-title';
    title.innerHTML = 'Results for letter: <span id="resultsLetter">A</span>';
    
    const count = document.createElement('div');
    count.className = 'results-count';
    count.innerHTML = 'Found <span id="resultsCount">0</span> problems';
    
    header.appendChild(backBtn);
    header.appendChild(title);
    header.appendChild(count);
    
    // Create results list container
    // INVENTOR: Scrollable container
    // FUNCTIONALITY: Displays results with scroll
    // REPLACEMENT: Use table
    // MODIFICATION: Change list type
    
    const resultsList = document.createElement('div');
    resultsList.id = 'resultsList';
    resultsList.className = 'results-list';
    
    // Append to page
    // INVENTOR: DOM appending
    // FUNCTIONALITY: Adds elements to page
    // REPLACEMENT: Use appendChild or insertBefore
    // MODIFICATION: Change append position
    
    resultsPage.appendChild(header);
    resultsPage.appendChild(resultsList);
    
    // Add to container
    // INVENTOR: Container selection
    // FUNCTIONALITY: Adds results page to main container
    // REPLACEMENT: Use different container
    // MODIFICATION: Change insertion point
    
    const container = document.querySelector('.container');
    container.appendChild(resultsPage);
    
    // Update back button reference
    // INVENTOR: DOM reference
    // FUNCTIONALITY: Updates back button reference
    // REPLACEMENT: Use querySelector
    // MODIFICATION: Change reference method
    
    DOM.backBtn = document.getElementById('backBtn');
    DOM.resultsPage = resultsPage;
    DOM.resultsList = resultsList;
    DOM.resultsTitle = document.getElementById('resultsLetter');
    DOM.resultsCount = document.getElementById('resultsCount');
    
    // Add back button event listener
    // INVENTOR: Event handling
    // FUNCTIONALITY: Adds click handler to back button
    // REPLACEMENT: Use onclick
    // MODIFICATION: Change handler
    
    DOM.backBtn.addEventListener('click', function() {
        goBack();
    });
}

// -------- Search Handler --------
// INVENTOR: Search algorithm
// FUNCTIONALITY: Processes search request and displays results
// REPLACEMENT: Use different search algorithm
// MODIFICATION: Change search behavior

function handleSearch(letter) {
    // Validate input
    // INVENTOR: Input validation
    // FUNCTIONALITY: Ensures valid letter input
    // REPLACEMENT: Use different validation
    // MODIFICATION: Change validation rules
    
    if (!letter || !letter.match(/^[A-Z]$/i)) {
        showNotification('Please enter a valid letter (A-Z)', 'error');
        return;
    }
    
    const upperLetter = letter.toUpperCase();
    state.currentLetter = upperLetter;
    
    // Get problems starting with this letter
    // INVENTOR: Data filtering
    // FUNCTIONALITY: Filters problems by first letter
    // REPLACEMENT: Use different filtering method
    // MODIFICATION: Change filter criteria
    
    let results = [];
    if (window.businessProblems) {
        // Search in the global problems array
        // INVENTOR: Array methods
        // FUNCTIONALITY: Filters problems starting with letter
        // REPLACEMENT: Use for loop
        // MODIFICATION: Change search method
        
        results = window.businessProblems.filter(problem => {
            const text = problem.text || problem;
            const firstChar = text.toString().charAt(0).toUpperCase();
            return firstChar === upperLetter;
        });
        
        // If no results, try alternative matching
        // INVENTOR: Alternative search
        // FUNCTIONALITY: Tries different matching strategies
        // REPLACEMENT: Use different algorithm
        // MODIFICATION: Change fallback logic
        
        if (results.length === 0) {
            // Try matching anywhere in the text
            // INVENTOR: Contains search
            // FUNCTIONALITY: Searches for letter anywhere
            // REPLACEMENT: Use includes or indexOf
            // MODIFICATION: Change search strategy
            
            results = window.businessProblems.filter(problem => {
                const text = problem.text || problem;
                return text.toString().toUpperCase().includes(upperLetter);
            });
        }
    }
    
    // Update state
    // INVENTOR: State management
    // FUNCTIONALITY: Updates current state with results
    // REPLACEMENT: Use different state container
    // MODIFICATION: Change state update method
    
    state.currentResults = results;
    state.totalResults = results.length;
    state.currentPage = 1;
    
    // Display results
    // INVENTOR: UI update
    // FUNCTIONALITY: Renders results to page
    // REPLACEMENT: Use different rendering method
    // MODIFICATION: Change display format
    
    displayResults(results, upperLetter);
}

// -------- Display Results --------
// INVENTOR: UI rendering
// FUNCTIONALITY: Renders results to the page
// REPLACEMENT: Use template literals
// MODIFICATION: Change display format

function displayResults(results, letter) {
    // Update results header
    // INVENTOR: DOM manipulation
    // FUNCTIONALITY: Updates title and count
    // REPLACEMENT: Use innerHTML
    // MODIFICATION: Change text format
    
    if (DOM.resultsTitle) {
        DOM.resultsTitle.textContent = letter;
    }
    
    if (DOM.resultsCount) {
        DOM.resultsCount.textContent = results.length;
    }
    
    // Clear results list
    // INVENTOR: DOM clearing
    // FUNCTIONALITY: Removes previous results
    // REPLACEMENT: Use innerHTML
    // MODIFICATION: Change clearing method
    
    const list = DOM.resultsList;
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    
    // Show results page
    // INVENTOR: CSS classes
    // FUNCTIONALITY: Makes results page visible
    // REPLACEMENT: Use display style
    // MODIFICATION: Change visibility method
    
    if (DOM.resultsPage) {
        DOM.resultsPage.classList.add('active');
    }
    
    // Hide main content
    // INVENTOR: CSS classes
    // FUNCTIONALITY: Hides main page content
    // REPLACEMENT: Use display style
    // MODIFICATION: Change hiding method
    
    const mainContent = document.querySelector('.search-section, .alphabet-nav, .stats');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // If no results, show message
    // INVENTOR: Empty state
    // FUNCTIONALITY: Shows no results message
    // REPLACEMENT: Use different message
    // MODIFICATION: Change message content
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No problems found starting with "${letter}"</h3>
            <p>Try searching with a different letter</p>
        `;
        list.appendChild(noResults);
        return;
    }
    
    // Create result items
    // INVENTOR: Dynamic list creation
    // FUNCTIONALITY: Creates clickable problem items
    // REPLACEMENT: Use template literals
    // MODIFICATION: Change item layout
    
    const fragment = document.createDocumentFragment();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = Math.min(startIndex + state.itemsPerPage, results.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const result = results[i];
        const problemText = typeof result === 'string' ? result : (result.text || '');
        const problemId = result.id || i + 1;
        
        const item = document.createElement('div');
        item.className = 'result-item';
        item.setAttribute('data-id', problemId);
        
        const textSpan = document.createElement('span');
        textSpan.className = 'problem-text';
        textSpan.textContent = problemText;
        
        const idSpan = document.createElement('span');
        idSpan.className = 'problem-id';
        idSpan.textContent = `#${problemId}`;
        
        item.appendChild(textSpan);
        item.appendChild(idSpan);
        
        // Add click handler for problem detail
        // INVENTOR: Event handling
        // FUNCTIONALITY: Opens problem detail when clicked
        // REPLACEMENT: Use onclick
        // MODIFICATION: Change navigation method
        
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showProblemDetail(id);
        });
        
        fragment.appendChild(item);
    }
    
    list.appendChild(fragment);
    
    // Add pagination controls if needed
    // INVENTOR: Pagination
    // FUNCTIONALITY: Adds pagination controls
    // REPLACEMENT: Use different pagination
    // MODIFICATION: Change pagination style
    
    if (results.length > state.itemsPerPage) {
        addPaginationControls(list, results.length);
    }
    
    // Scroll to top of results
    // INVENTOR: Scrolling
    // FUNCTIONALITY: Scrolls to top of results list
    // REPLACEMENT: Use scrollIntoView
    // MODIFICATION: Change scroll behavior
    
    if (DOM.resultsPage) {
        DOM.resultsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// -------- Pagination Controls --------
// INVENTOR: Pagination pattern
// FUNCTIONALITY: Adds page navigation controls
// REPLACEMENT: Use infinite scroll
// MODIFICATION: Change pagination style

function addPaginationControls(container, totalItems) {
    const totalPages = Math.ceil(totalItems / state.itemsPerPage);
    const currentPage = state.currentPage;
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-controls';
    paginationDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        padding: 20px;
        margin-top: 20px;
        border-top: 2px solid #e2e8f0;
    `;
    
    // Previous button
    // INVENTOR: Navigation
    // FUNCTIONALITY: Goes to previous page
    // REPLACEMENT: Use arrow functions
    // MODIFICATION: Change navigation behavior
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', function() {
        if (state.currentPage > 1) {
            state.currentPage--;
            displayResults(state.currentResults, state.currentLetter);
        }
    });
    paginationDiv.appendChild(prevBtn);
    
    // Page info
    // INVENTOR: Page indicator
    // FUNCTIONALITY: Shows current page
    // REPLACEMENT: Use different format
    // MODIFICATION: Change info display
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationDiv.appendChild(pageInfo);
    
    // Next button
    // INVENTOR: Navigation
    // FUNCTIONALITY: Goes to next page
    // REPLACEMENT: Use arrow functions
    // MODIFICATION: Change navigation behavior
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', function() {
        if (state.currentPage < totalPages) {
            state.currentPage++;
            displayResults(state.currentResults, state.currentLetter);
        }
    });
    paginationDiv.appendChild(nextBtn);
    
    container.appendChild(paginationDiv);
}

// -------- Problem Detail View --------
// INVENTOR: Detail view pattern
// FUNCTIONALITY: Shows detailed problem information
// REPLACEMENT: Use modal or new page
// MODIFICATION: Change detail layout

function showProblemDetail(id) {
    // Find the problem
    // INVENTOR: Array find
    // FUNCTIONALITY: Finds problem by ID
    // REPLACEMENT: Use for loop
    // MODIFICATION: Change search method
    
    let problem = null;
    if (window.businessProblems) {
        problem = window.businessProblems.find(p => {
            const pid = p.id || 0;
            return pid == id;
        });
    }
    
    if (!problem) {
        showNotification('Problem not found', 'error');
        return;
    }
    
    // Create detail page
    // INVENTOR: Dynamic page creation
    // FUNCTIONALITY: Creates problem detail view
    // REPLACEMENT: Use separate HTML page
    // MODIFICATION: Change layout
    
    const detailPage = document.createElement('div');
    detailPage.className = 'detail-page';
    detailPage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create detail content
    // INVENTOR: Content creation
    // FUNCTIONALITY: Creates detail content
    // REPLACEMENT: Use template literals
    // MODIFICATION: Change content
    
    const content = document.createElement('div');
    content.className = 'detail-content';
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    // Close button
    // INVENTOR: UI controls
    // FUNCTIONALITY: Closes detail view
    // REPLACEMENT: Use X button
    // MODIFICATION: Change close behavior
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-detail';
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: sticky;
        top: 0;
        float: right;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #718096;
        z-index: 10;
    `;
    closeBtn.addEventListener('click', function() {
        detailPage.remove();
    });
    content.appendChild(closeBtn);
    
    // Problem title
    // INVENTOR: Title display
    // FUNCTIONALITY: Shows problem title
    // REPLACEMENT: Use different heading
    // MODIFICATION: Change title style
    
    const title = document.createElement('h2');
    title.style.cssText = `
        color: #2d3748;
        margin-bottom: 20px;
        font-size: 1.5rem;
    `;
    title.textContent = problem.text || `Problem #${id}`;
    content.appendChild(title);
    
    // Problem ID
    // INVENTOR: ID display
    // FUNCTIONALITY: Shows problem ID
    // REPLACEMENT: Use different format
    // MODIFICATION: Change ID display
    
    const pid = document.createElement('p');
    pid.style.cssText = `
        color: #718096;
        margin-bottom: 20px;
        font-size: 0.9rem;
    `;
    pid.textContent = `Problem ID: ${problem.id || id}`;
    content.appendChild(pid);
    
    // Solution section (AI-generated)
    // INVENTOR: Content generation
    // FUNCTIONALITY: Shows AI-generated solution
    // REPLACEMENT: Use different content
    // MODIFICATION: Change solution format
    
    const solutionSection = document.createElement('div');
    solutionSection.className = 'solution-section';
    solutionSection.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        background: #f7fafc;
        border-radius: 10px;
    `;
    
    const solutionTitle = document.createElement('h3');
    solutionTitle.textContent = '🤖 AI-Powered Solution';
    solutionTitle.style.cssText = `
        color: #4a5568;
        margin-bottom: 15px;
        font-size: 1.2rem;
    `;
    solutionSection.appendChild(solutionTitle);
    
    // Generate AI solution
    // INVENTOR: AI content generation
    // FUNCTIONALITY: Creates AI solution based on problem
    // REPLACEMENT: Use different generation
    // MODIFICATION: Change solution content
    
    const solutionContent = document.createElement('div');
    solutionContent.style.cssText = `
        color: #2d3748;
        line-height: 1.8;
    `;
    solutionContent.innerHTML = generateAISolution(problem);
    solutionSection.appendChild(solutionContent);
    content.appendChild(solutionSection);
    
    // Code section
    // INVENTOR: Code display
    // FUNCTIONALITY: Shows implementation code
    // REPLACEMENT: Use different code format
    // MODIFICATION: Change code examples
    
    const codeSection = document.createElement('div');
    codeSection.className = 'code-section';
    codeSection.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        background: #2d3748;
        border-radius: 10px;
        color: #f7fafc;
        overflow-x: auto;
    `;
    
    const codeTitle = document.createElement('h3');
    codeTitle.textContent = '💻 Implementation Code';
    codeTitle.style.cssText = `
        color: #f7fafc;
        margin-bottom: 15px;
        font-size: 1.2rem;
    `;
    codeSection.appendChild(codeTitle);
    
    const codeContent = document.createElement('pre');
    codeContent.style.cssText = `
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
    `;
    codeContent.textContent = generateImplementationCode(problem);
    codeSection.appendChild(codeContent);
    content.appendChild(codeSection);
    
    // Hindi solution section
    // INVENTOR: Multilingual support
    // FUNCTIONALITY: Shows solution in Hindi
    // REPLACEMENT: Use different language
    // MODIFICATION: Change translation
    
    const hindiSection = document.createElement('div');
    hindiSection.className = 'hindi-solution';
    hindiSection.style.cssText = `
        margin: 20px 0;
        padding: 20px;
        background: #fef9e7;
        border-radius: 10px;
        border-left: 4px solid #f39c12;
    `;
    
    const hindiTitle = document.createElement('h3');
    hindiTitle.textContent = '🇮🇳 हिंदी में समाधान (Hindi Solution)';
    hindiTitle.style.cssText = `
        color: #2d3748;
        margin-bottom: 15px;
        font-size: 1.2rem;
    `;
    hindiSection.appendChild(hindiTitle);
    
    const hindiContent = document.createElement('div');
    hindiContent.style.cssText = `
        color: #2d3748;
        line-height: 2;
        font-size: 1rem;
    `;
    hindiContent.innerHTML = generateHindiSolution(problem);
    hindiSection.appendChild(hindiContent);
    content.appendChild(hindiSection);
    
    // Music player (copyright free)
    // INVENTOR: Audio playback
    // FUNCTIONALITY: Plays copyright-free music
    // REPLACEMENT: Use different audio source
    // MODIFICATION: Change music file
    
    const musicSection = document.createElement('div');
    musicSection.style.cssText = `
        margin: 20px 0;
        padding: 15px;
        background: #e8f5e9;
        border-radius: 10px;
        text-align: center;
    `;
    
    const musicTitle = document.createElement('p');
    musicTitle.innerHTML = '🎵 <strong>Copyright-free Relaxing Music</strong>';
    musicTitle.style.cssText = `
        color: #2d3748;
        margin-bottom: 10px;
    `;
    musicSection.appendChild(musicTitle);
    
    // Audio player
    // INVENTOR: HTML5 Audio
    // FUNCTIONALITY: Plays audio
    // REPLACEMENT: Use Web Audio API
    // MODIFICATION: Change audio source
    
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.autoplay = true;
    audio.loop = true;
    audio.style.cssText = `
        width: 100%;
        max-width: 300px;
    `;
    
    // Use an online copyright-free music source
    // INVENTOR: Audio source
    // FUNCTIONALITY: Provides music
    // REPLACEMENT: Use different source
    // MODIFICATION: Change music URL
    
    const source = document.createElement('source');
    source.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    source.type = 'audio/mpeg';
    audio.appendChild(source);
    musicSection.appendChild(audio);
    content.appendChild(musicSection);
    
    // Back button
    // INVENTOR: Navigation
    // FUNCTIONALITY: Returns to results
    // REPLACEMENT: Use different navigation
    // MODIFICATION: Change button style
    
    const backToResults = document.createElement('button');
    backToResults.textContent = '← Back to Results';
    backToResults.style.cssText = `
        padding: 12px 24px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
    `;
    backToResults.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(-3px)';
        this.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)';
    });
    backToResults.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
    });
    backToResults.addEventListener('click', function() {
        detailPage.remove();
        // Scroll to results
        if (DOM.resultsPage) {
            DOM.resultsPage.scrollIntoView({ behavior: 'smooth' });
        }
    });
    content.appendChild(backToResults);
    
    detailPage.appendChild(content);
    document.body.appendChild(detailPage);
}

// -------- AI Solution Generator --------
// INVENTOR: AI content generation
// FUNCTIONALITY: Generates AI-powered solutions
// REPLACEMENT: Use OpenAI API
// MODIFICATION: Change generation algorithm

function generateAISolution(problem) {
    const problemText = typeof problem === 'string' ? problem : (problem.text || '');
    const category = problem.category || 'General';
    
    // Generate solution based on problem type
    // INVENTOR: Pattern matching
    // FUNCTIONALITY: Creates relevant solution
    // REPLACEMENT: Use different algorithm
    // MODIFICATION: Change solution generation
    
    const solutions = {
        sales: `
            <h4>📊 Sales Transformation Strategy</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Implement an AI-powered sales intelligence platform that analyzes customer behavior and predicts buying patterns. Use the following steps:</p>
            <ol>
                <li><strong>Data Integration:</strong> Combine CRM data with external signals (social media, economic indicators, competitor analysis)</li>
                <li><strong>Predictive Analytics:</strong> Train ML models on historical sales data to identify patterns and predict future sales</li>
                <li><strong>Personalized Outreach:</strong> Use LLM-powered personalization to craft custom communications for each prospect</li>
                <li><strong>Performance Optimization:</strong> Continuously refine strategies based on AI-generated insights</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 30-50% improvement in sales conversion rates within 90 days</p>
        `,
        finance: `
            <h4>💰 Financial Optimization System</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Deploy a financial intelligence system using machine learning and neural networks:</p>
            <ol>
                <li><strong>Anomaly Detection:</strong> Use autoencoders to identify financial irregularities and fraud patterns</li>
                <li><strong>Predictive Forecasting:</strong> Implement LSTM networks for accurate financial projections</li>
                <li><strong>Cost Optimization:</strong> Apply reinforcement learning for dynamic resource allocation</li>
                <li><strong>Risk Assessment:</strong> Use ensemble methods for comprehensive risk scoring</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 25-40% reduction in financial losses, 20% improvement in profit margins</p>
        `,
        marketing: `
            <h4>🎯 Zero-Cost Marketing Intelligence</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Leverage organic marketing strategies augmented by AI:</p>
            <ol>
                <li><strong>Content Intelligence:</strong> Use NLP to identify trending topics and create viral content</li>
                <li><strong>Social Listening:</strong> Deploy sentiment analysis to understand audience perception</li>
                <li><strong>Community Building:</strong> Implement automated engagement strategies for social platforms</li>
                <li><strong>SEO Optimization:</strong> Use AI-driven keyword analysis for organic search growth</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 200-500% increase in organic traffic, 50% reduction in customer acquisition cost</p>
        `,
        operations: `
            <h4>⚙️ Process Optimization Engine</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Implement a digital twin-based operations management system:</p>
            <ol>
                <li><strong>Process Mapping:</strong> Use computer vision and IoT sensors for real-time process monitoring</li>
                <li><strong>Bottleneck Detection:</strong> Apply queuing theory and ML to identify and resolve bottlenecks</li>
                <li><strong>Resource Optimization:</strong> Use genetic algorithms for optimal resource allocation</li>
                <li><strong>Predictive Maintenance:</strong> Implement deep learning for equipment failure prediction</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 40-60% improvement in operational efficiency, 30% reduction in costs</p>
        `,
        hr: `
            <h4>👥 Talent Intelligence Platform</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Deploy an AI-powered human resource management system:</p>
            <ol>
                <li><strong>Employee Sentiment Analysis:</strong> Use NLP to analyze feedback and engagement levels</li>
                <li><strong>Skills Gap Analysis:</strong> Implement ML to identify and address skill gaps</li>
                <li><strong>Retention Prediction:</strong> Use survival analysis to predict employee turnover</li>
                <li><strong>Personalized Learning:</strong> Deploy recommendation systems for skill development</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 40% reduction in turnover, 30% increase in employee satisfaction</p>
        `,
        technology: `
            <h4>💻 Digital Transformation Suite</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Implement a comprehensive technology modernization strategy:</p>
            <ol>
                <li><strong>Legacy Modernization:</strong> Use microservices and API-first architecture</li>
                <li><strong>Data Pipeline:</strong> Implement real-time data processing with Apache Kafka and Spark</li>
                <li><strong>AI Integration:</strong> Deploy LLM-powered chatbots and assistants</li>
                <li><strong>Security Posture:</strong> Implement zero-trust architecture with AI-driven threat detection</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 60% improvement in system performance, 80% reduction in downtime</p>
        `,
        strategy: `
            <h4>🎯 Strategic Intelligence System</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Deploy an AI-driven strategic planning platform:</p>
            <ol>
                <li><strong>Market Intelligence:</strong> Use web scraping and NLP for market trend analysis</li>
                <li><strong>Scenario Planning:</strong> Implement Monte Carlo simulations for strategy evaluation</li>
                <li><strong>Competitive Analysis:</strong> Use ML for real-time competitive monitoring</li>
                <li><strong>Execution Tracking:</strong> Implement OKR tracking with predictive analytics</li>
            </ol>
            <p><strong>Expected Outcome:</strong> 35% better strategic decisions, 45% faster execution</p>
        `
    };
    
    // Get solution for category or return general
    // INVENTOR: Fallback handling
    // FUNCTIONALITY: Provides solution based on category
    // REPLACEMENT: Use different mapping
    // MODIFICATION: Change category matching
    
    const categoryKey = category.toLowerCase();
    let solution = solutions[categoryKey];
    
    if (!solution) {
        // Generate general solution
        // INVENTOR: Generic solution
        // FUNCTIONALITY: Creates general business solution
        // REPLACEMENT: Use different template
        // MODIFICATION: Change solution content
        
        solution = `
            <h4>🏢 Business Intelligence Solution</h4>
            <p><strong>Problem Analysis:</strong> ${problemText}</p>
            <p><strong>Solution Framework:</strong> Implement a comprehensive business intelligence system:</p>
            <ol>
                <li><strong>Data Collection:</strong> Gather relevant data from all business systems</li>
                <li><strong>Analytics Engine:</strong> Use ML algorithms for pattern recognition and insights</li>
                <li><strong>Decision Support:</strong> Deploy LLM-powered advisory system</li>
                <li><strong>Continuous Improvement:</strong> Implement feedback loops for optimization</li>
            </ol>
            <p><strong>Expected Outcome:</strong> Significant improvement in business performance metrics</p>
        `;
    }
    
    return solution;
}

// -------- Implementation Code Generator --------
// INVENTOR: Code generation
// FUNCTIONALITY: Generates implementation code
// REPLACEMENT: Use different code templates
// MODIFICATION: Change code examples

function generateImplementationCode(problem) {
    const problemText = typeof problem === 'string' ? problem : (problem.text || '');
    const category = problem.category || 'General';
    
    // Generate code based on category
    // INVENTOR: Code templates
    // FUNCTIONALITY: Creates implementation code
    // REPLACEMENT: Use different languages
    // MODIFICATION: Change code examples
    
    const codeTemplates = {
        sales: `
# Python code for Sales Prediction and Optimization
# INVENTOR: Machine Learning engineers
# FUNCTIONALITY: Predicts sales and optimizes conversion
# MODIFICATION: Change model parameters or algorithms

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

class SalesOptimizer:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.features = None
    
    def prepare_data(self, data):
        """Prepare and engineer features from raw sales data"""
        df = pd.DataFrame(data)
        
        # Feature engineering
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['quarter'] = pd.to_datetime(df['date']).dt.quarter
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        
        # Rolling statistics
        df['sales_ma_7'] = df['sales'].rolling(window=7).mean()
        df['sales_ma_30'] = df['sales'].rolling(window=30).mean()
        
        # Drop nulls
        df = df.dropna()
        
        return df
    
    def train(self, X, y):
        """Train the sales prediction model"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model Performance:")
        print(f"RMSE: {rmse:.2f}")
        print(f"R² Score: {r2:.2f}")
        
        return self.model
    
    def predict(self, X):
        """Make sales predictions"""
        return self.model.predict(X)
    
    def optimize_conversion(self, data):
        """Optimize sales conversion rates"""
        # Identify high-conversion patterns
        patterns = []
        # Implementation of optimization logic
        return patterns
    
    def save_model(self, path):
        """Save trained model to file"""
        joblib.dump(self.model, path)
    
    def load_model(self, path):
        """Load trained model from file"""
        self.model = joblib.load(path)

# Usage Example
# optimizer = SalesOptimizer()
# data = pd.read_csv('sales_data.csv')
# prepared_data = optimizer.prepare_data(data)
# X = prepared_data.drop(['sales'], axis=1)
# y = prepared_data['sales']
# optimizer.train(X, y)
# predictions = optimizer.predict(X)
        `,
        finance: `
# Python code for Financial Analysis and Optimization
# INVENTOR: Financial data scientists
# FUNCTIONALITY: Analyzes financial data and optimizes performance
# MODIFICATION: Change financial models or metrics

import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import plotly.graph_objects as go

class FinancialIntelligence:
    def __init__(self):
        self.anomaly_detector = None
        self.forecaster = None
        self.scaler = StandardScaler()
    
    def detect_anomalies(self, data):
        """Detect financial anomalies using Isolation Forest"""
        self.anomaly_detector = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        
        # Prepare data
        features = data.select_dtypes(include=[np.number])
        scaled = self.scaler.fit_transform(features)
        
        # Detect anomalies
        predictions = self.anomaly_detector.fit_predict(scaled)
        data['anomaly'] = predictions
        
        return data
    
    def forecast(self, data, sequence_length=60):
        """Forecast financial metrics using LSTM"""
        # Prepare data for LSTM
        values = data['value'].values
        X, y = [], []
        
        for i in range(sequence_length, len(values)):
            X.append(values[i-sequence_length:i])
            y.append(values[i])
        
        X = np.array(X)
        y = np.array(y)
        
        # Reshape for LSTM
        X = X.reshape((X.shape[0], X.shape[1], 1))
        
        # Build LSTM model
        self.forecaster = Sequential([
            LSTM(50, activation='relu', input_shape=(sequence_length, 1)),
            Dropout(0.2),
            Dense(1)
        ])
        
        self.forecaster.compile(optimizer='adam', loss='mse')
        
        # Train model
        self.forecaster.fit(X, y, epochs=50, batch_size=32, verbose=0)
        
        return self.forecaster
    
    def optimize_portfolio(self, data):
        """Optimize investment portfolio using Markowitz"""
        # Implementation of portfolio optimization
        returns = data.pct_change()
        mean_returns = returns.mean()
        cov_matrix = returns.cov()
        
        # Calculate optimal weights
        # Using efficient frontier
        import cvxopt as opt
        # Portfolio optimization logic
        
        return optimal_weights
    
    def generate_financial_report(self, data):
        """Generate comprehensive financial report"""
        # Report generation logic
        report = {
            'total_revenue': data['revenue'].sum(),
            'total_expenses': data['expenses'].sum(),
            'profit_margin': (data['revenue'].sum() - data['expenses'].sum()) / data['revenue'].sum(),
            'growth_rate': data['revenue'].pct_change().mean()
        }
        return report

# Usage Example
# fin = FinancialIntelligence()
# data = pd.read_csv('financial_data.csv')
# anomalies = fin.detect_anomalies(data)
# forecast = fin.forecast(data)
# report = fin.generate_financial_report(data)
        `,
        marketing: `
# Python code for Marketing Intelligence
# INVENTOR: Marketing data scientists
# FUNCTIONALITY: Optimizes marketing strategies
# MODIFICATION: Change marketing models

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import NMF
from transformers import pipeline
import re

class MarketingIntelligence:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.clusterer = KMeans(n_clusters=5, random_state=42)
        self.nlp = pipeline('sentiment-analysis')
    
    def analyze_sentiment(self, text_data):
        """Analyze customer sentiment"""
        sentiments = []
        for text in text_data:
            result = self.nlp(text)[0]
            sentiments.append({
                'text': text,
                'sentiment': result['label'],
                'score': result['score']
            })
        return sentiments
    
    def cluster_customers(self, customer_data):
        """Cluster customers based on behavior"""
        # Prepare features
        features = customer_data.select_dtypes(include=[np.number])
        scaled = StandardScaler().fit_transform(features)
        
        # Cluster
        self.clusterer.fit(scaled)
        customer_data['cluster'] = self.clusterer.labels_
        
        return customer_data
    
    def generate_content(self, topic, style='professional'):
        """Generate marketing content using LLM"""
        generator = pipeline('text-generation', model='gpt2')
        
        prompt = f"Generate {style} marketing content about {topic}:"
        content = generator(prompt, max_length=200, num_return_sequences=1)
        
        return content[0]['generated_text']
    
    def optimize_seo(self, content):
        """Optimize content for SEO"""
        # Extract keywords
        self.vectorizer.fit([content])
        keywords = self.vectorizer.get_feature_names_out()
        
        # Analyze keyword density
        words = re.findall(r'\\w+', content.lower())
        keyword_density = {}
        
        for keyword in keywords[:10]:
            count = words.count(keyword.lower())
            density = count / len(words)
            keyword_density[keyword] = density
        
        return {
            'keywords': keywords[:10],
            'density': keyword_density,
            'word_count': len(words)
        }
    
    def calculate_roi(self, campaign_data):
        """Calculate marketing ROI"""
        # ROI calculation
        cost = campaign_data['cost'].sum()
        revenue = campaign_data['revenue'].sum()
        roi = ((revenue - cost) / cost) * 100
        
        return roi

# Usage Example
# marketing = MarketingIntelligence()
# sentiments = marketing.analyze_sentiment(customer_feedback)
# clusters = marketing.cluster_customers(customer_data)
# content = marketing.generate_content('digital transformation')
# roi = marketing.calculate_roi(campaign_data)
        `,
        operations: `
# Python code for Operations Optimization
# INVENTOR: Operations research
# FUNCTIONALITY: Optimizes operations processes
# MODIFICATION: Change optimization algorithms

import pandas as pd
import numpy as np
from scipy.optimize import linprog
from sklearn.ensemble import RandomForestClassifier
import networkx as nx
from datetime import datetime, timedelta

class OperationsOptimizer:
    def __init__(self):
        self.process_model = None
        self.optimizer = None
    
    def analyze_process(self, process_data):
        """Analyze business process efficiency"""
        # Calculate process metrics
        metrics = {
            'cycle_time': process_data['end_time'] - process_data['start_time'],
            'waiting_time': process_data['wait_time'].mean(),
            'bottlenecks': self.identify_bottlenecks(process_data)
        }
        return metrics
    
    def identify_bottlenecks(self, process_data):
        """Identify process bottlenecks using network analysis"""
        # Create process graph
        G = nx.DiGraph()
        
        for _, row in process_data.iterrows():
            G.add_edge(row['from_step'], row['to_step'], 
                      weight=row['duration'])
        
        # Find critical path
        critical_path = nx.dag_longest_path(G)
        
        return {
            'critical_path': critical_path,
            'bottleneck_steps': critical_path[:3]
        }
    
    def optimize_schedule(self, resources, demands, time_horizon=30):
        """Optimize resource scheduling"""
        # Linear programming for scheduling
        # Variables: x_ij = amount of resource i allocated to task j
        # Objective: Minimize total cost
        
        c = resources['cost']  # Cost coefficients
        A = []  # Constraint matrix
        b = []  # Constraint bounds
        
        # Resource constraints
        for i in range(len(resources)):
            constraint = [0] * len(demands)
            for j in range(len(demands)):
                constraint[j] = 1 if resources.iloc[i]['resource_type'] == demands.iloc[j]['required_type'] else 0
            A.append(constraint)
            b.append(resources.iloc[i]['capacity'])
        
        # Demand constraints
        for j in range(len(demands)):
            constraint = [0] * len(resources)
            for i in range(len(resources)):
                constraint[i] = 1 if demands.iloc[j]['required_type'] == resources.iloc[i]['resource_type'] else 0
            A.append(constraint)
            b.append(demands.iloc[j]['demand'])
        
        # Solve linear program
        result = linprog(c, A_ub=A, b_ub=b, method='highs')
        
        return result.x
    
    def predict_maintenance(self, equipment_data):
        """Predict equipment maintenance needs"""
        # Prepare features
        features = equipment_data[['temperature', 'vibration', 'pressure']]
        X = pd.get_dummies(features)
        
        # Train classifier
        self.classifier = RandomForestClassifier(n_estimators=100)
        self.classifier.fit(X, equipment_data['failure'])
        
        # Predict maintenance
        predictions = self.classifier.predict(X)
        equipment_data['maintenance_needed'] = predictions
        
        return equipment_data
    
    def optimize_inventory(self, inventory_data):
        """Optimize inventory levels using EOQ model"""
        # Economic Order Quantity
        D = inventory_data['annual_demand']
        S = inventory_data['ordering_cost']
        H = inventory_data['holding_cost']
        
        EOQ = np.sqrt((2 * D * S) / H)
        
        return {
            'eog': EOQ,
            'reorder_point': D / 365 * inventory_data['lead_time']
        }

# Usage Example
# ops = OperationsOptimizer()
# bottlenecks = ops.identify_bottlenecks(process_data)
# schedule = ops.optimize_schedule(resources, demands)
# maintenance = ops.predict_maintenance(equipment_data)
# inventory = ops.optimize_inventory(inventory_data)
        `
    };
    
    // Get code for category or return general
    // INVENTOR: Code selection
    // FUNCTIONALITY: Provides code based on category
    // REPLACEMENT: Use different mapping
    // MODIFICATION: Change category matching
    
    const categoryKey = category.toLowerCase();
    let code = codeTemplates[categoryKey];
    
    if (!code) {
        // Generate general code
        // INVENTOR: Generic code
        // FUNCTIONALITY: Creates general implementation
        // REPLACEMENT: Use different template
        // MODIFICATION: Change code content
        
        code = `
# Python code for Business Problem Solution
# INVENTOR: Business data scientists
# FUNCTIONALITY: Solves business problems using AI/ML
# MODIFICATION: Customize based on specific problem

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

class BusinessSolution:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
    
    def prepare_data(self, data):
        """Prepare data for analysis"""
        # Data cleaning
        data = data.dropna()
        
        # Feature engineering
        for col in data.columns:
            if data[col].dtype == 'object':
                data[col] = data[col].astype('category')
        
        return data
    
    def analyze_problem(self, data, target_col):
        """Analyze business problem"""
        # Descriptive statistics
        stats = data.describe()
        
        # Correlation analysis
        correlations = data.corr()[target_col].sort_values(ascending=False)
        
        return {
            'statistics': stats,
            'correlations': correlations
        }
    
    def solve(self, X, y):
        """Solve business problem"""
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        return {
            'predictions': y_pred,
            'accuracy': r2_score(y_test, y_pred)
        }
    
    def optimize_solution(self, data):
        """Optimize solution parameters"""
        # Parameter optimization
        from sklearn.model_selection import GridSearchCV
        
        param_grid = {
            'n_estimators': [50, 100, 200],
            'max_depth': [5, 10, None],
            'min_samples_split': [2, 5, 10]
        }
        
        grid = GridSearchCV(
            self.model,
            param_grid,
            cv=5,
            scoring='r2'
        )
        
        grid.fit(data['X'], data['y'])
        
        return grid.best_params_

# Usage Example
# solution = BusinessSolution()
# data = pd.read_csv('business_data.csv')
# analysis = solution.analyze_problem(data, 'target_variable')
# results = solution.solve(data['X'], data['y'])
# optimized = solution.optimize_solution({'X': X, 'y': y})
        `;
    }
    
    return code;
}

// -------- Hindi Solution Generator --------
// INVENTOR: Translation and content generation
// FUNCTIONALITY: Generates Hindi solutions
// REPLACEMENT: Use Google Translate API
// MODIFICATION: Change translation method

function generateHindiSolution(problem) {
    const problemText = typeof problem === 'string' ? problem : (problem.text || '');
    const category = problem.category || 'General';
    
    // Hindi solutions based on category
    // INVENTOR: Hindi content creation
    // FUNCTIONALITY: Creates Hindi solutions
    // REPLACEMENT: Use different translations
    // MODIFICATION: Change content
    
    const hindiSolutions = {
        sales: `
<h3>📊 बिक्री परिवर्तन रणनीति</h3>

<p><strong>समस्या विश्लेषण:</strong> ${problemText}</p>

<p><strong>समाधान ढांचा:</strong> AI-संचालित बिक्री खुफिया प्लेटफॉर्म लागू करें जो ग्राहक व्यवहार का विश्लेषण करता है और खरीद पैटर्न की भविष्यवाणी करता है।</p>

<h4>चरण-दर-चरण कार्यान्वयन:</h4>

<ol>
<li><strong>डेटा एकीकरण:</strong> CRM डेटा को बाहरी संकेतों (सोशल मीडिया, आर्थिक संकेतक, प्रतियोगी विश्लेषण) के साथ संयोजित करें</li>
<li><strong>पूर्वानुमानित विश्लेषण:</strong> ऐतिहासिक बिक्री डेटा पर ML मॉडल प्रशिक्षित करें और भविष्य की बिक्री की भविष्यवाणी करें</li>
<li><strong>व्यक्तिगत संपर्क:</strong> प्रत्येक संभावित ग्राहक के लिए व्यक्तिगत संचार बनाने के लिए LLM-संचालित वैयक्तिकरण का उपयोग करें</li>
<li><strong>प्रदर्शन अनुकूलन:</strong> AI-जनित अंतर्दृष्टि के आधार पर रणनीतियों को लगातार परिष्कृत करें</li>
</ol>

<h4>उदाहरण:</h4>
<p>मान लीजिए एक कंपनी की बिक्री पिछले 6 महीनों से गिर रही है। AI सिस्टम ग्राहक डेटा का विश्लेषण करके पाता है कि 30-40 आयु वर्ग के ग्राहकों की बिक्री 40% कम हो गई है। सिस्टम सुझाव देता है कि इस आयु वर्ग के लिए विशेष ऑफर और व्यक्तिगत संदेश भेजे जाएं। 3 महीने में बिक्री में 35% की वृद्धि होती है।</p>

<h4>अपेक्षित परिणाम:</h4>
<p>90 दिनों के भीतर बिक्री रूपांतरण दरों में 30-50% सुधार</p>

<h4>अतिरिक्त सुझाव:</h4>
<ul>
<li>ग्राहक फीडबैक का नियमित विश्लेषण करें</li>
<li>प्रतियोगियों की रणनीतियों पर नज़र रखें</li>
<li>बिक्री टीम को नियमित प्रशिक्षण दें</li>
<li>नए बाजारों में विस्तार की संभावना तलाशें</li>
</ul>
        `,
        finance: `
<h3>💰 वित्तीय अनुकूलन प्रणाली</h3>

<p><strong>समस्या विश्लेषण:</strong> ${problemText}</p>

<p><strong>समाधान ढांचा:</strong> मशीन लर्निंग और न्यूरल नेटवर्क का उपयोग करके वित्तीय खुफिया प्रणाली तैनात करें:</p>

<ol>
<li><strong>असंगति का पता लगाना:</strong> वित्तीय अनियमितताओं और धोखाधड़ी पैटर्न की पहचान के लिए ऑटोएन्कोडर का उपयोग करें</li>
<li><strong>पूर्वानुमानित पूर्वानुमान:</strong> सटीक वित्तीय प्रक्षेपणों के लिए LSTM नेटवर्क लागू करें</li>
<li><strong>लागत अनुकूलन:</strong> गतिशील संसाधन आवंटन के लिए सुदृढीकरण सीखने का उपयोग करें</li>
<li><strong>जोखिम मूल्यांकन:</strong> व्यापक जोखिम स्कोरिंग के लिए एन्सेम्बल विधियों का उपयोग करें</li>
</ol>

<h4>उदाहरण:</h4>
<p>एक मिड-साइज कंपनी को हर महीने 2 लाख रुपये का नुकसान हो रहा है। AI सिस्टम विश्लेषण करता है और पाता है कि 60% खर्च अनावश्यक सप्लायर कॉन्ट्रैक्ट्स में जा रहा है। सिस्टम बेहतर सप्लायर की सिफारिश करता है और 6 महीने में कंपनी को 1.5 लाख रुपये मासिक बचत होती है।</p>

<h4>अपेक्षित परिणाम:</h4>
<p>वित्तीय नुकसान में 25-40% की कमी, लाभ मार्जिन में 20% सुधार</p>

<h4>कार्यान्वयन सुझाव:</h4>
<ul>
<li>सभी वित्तीय डेटा को डिजिटल फॉर्मेट में रखें</li>
<li>नियमित ऑडिट करें</li>
<li>कर्मचारियों को वित्तीय साक्षरता प्रशिक्षण दें</li>
<li>बजट बनाने में AI का उपयोग करें</li>
<li>कैश फ्लो का रोजाना ट्रैक रखें</li>
</ul>
        `,
        marketing: `
<h3>🎯 शून्य-लागत विपणन खुफिया</h3>

<p><strong>समस्या विश्लेषण:</strong> ${problemText}</p>

<p><strong>समाधान ढांचा:</strong> AI द्वारा संवर्धित जैविक विपणन रणनीतियों का लाभ उठाएं:</p>

<ol>
<li><strong>सामग्री खुफिया:</strong> ट्रेंडिंग विषयों की पहचान करने और वायरल सामग्री बनाने के लिए NLP का उपयोग करें</li>
<li><strong>सोशल लिसनिंग:</strong> दर्शकों की धारणा को समझने के लिए भावना विश्लेषण तैनात करें</li>
<li><strong>समुदाय निर्माण:</strong> सामाजिक प्लेटफार्मों के लिए स्वचालित जुड़ाव रणनीतियों को लागू करें</li>
<li><strong>SEO अनुकूलन:</strong> जैविक खोज वृद्धि के लिए AI-संचालित कीवर्ड विश्लेषण का उपयोग करें</li>
</ol>

<h4>उदाहरण:</h4>
<p>एक स्टार्टअप के पास विपणन के लिए बजट नहीं है। वे AI टूल का उपयोग करके विश्लेषण करते हैं कि उनके इंडस्ट्री में कौन से टॉपिक्स ट्रेंड कर रहे हैं। वे उन टॉपिक्स पर ब्लॉग पोस्ट और सोशल मीडिया कंटेंट बनाते हैं। 3 महीने में उनकी वेबसाइट ट्रैफिक 500% बढ़ जाता है और ऑर्गेनिक लीड्स में 200% की वृद्धि होती है।</p>

<h4>अपेक्षित परिणाम:</h4>
<p>जैविक ट्रैफिक में 200-500% की वृद्धि, ग्राहक अधिग्रहण लागत में 50% की कमी</p>

<h4>कार्यान्वयन सुझाव:</h4>
<ul>
<li>सोशल मीडिया पर सक्रिय रहें</li>
<li>ग्राहकों से बातचीत करें और उनकी समस्याएं समझें</li>
<li>मुफ्त टूल्स का उपयोग करें (Canva, Google Analytics, etc.)</li>
<li>यूजर जनरेटेड कंटेंट को प्रोत्साहित करें</li>
<li>ईमेल मार्केटिंग का उपयोग करें</li>
</ul>
        `
    };
    
    // Get solution for category or return general
    // INVENTOR: Hindi content selection
    // FUNCTIONALITY: Provides Hindi solution based on category
    // REPLACEMENT: Use different mapping
    // MODIFICATION: Change category matching
    
    const categoryKey = category.toLowerCase();
    let solution = hindiSolutions[categoryKey];
    
    if (!solution) {
        // Generate general Hindi solution
        // INVENTOR: Generic Hindi content
        // FUNCTIONALITY: Creates general business solution in Hindi
        // REPLACEMENT: Use different template
        // MODIFICATION: Change content
        
        solution = `
<h3>🏢 व्यापार बुद्धिमत्ता समाधान</h3>

<p><strong>समस्या विश्लेषण:</strong> ${problemText}</p>

<p><strong>समाधान ढांचा:</strong> एक व्यापक व्यापार बुद्धिमत्ता प्रणाली लागू करें:</p>

<ol>
<li><strong>डेटा संग्रह:</strong> सभी व्यावसायिक प्रणालियों से प्रासंगिक डेटा एकत्र करें</li>
<li><strong>विश्लेषण इंजन:</strong> पैटर्न पहचान और अंतर्दृष्टि के लिए ML एल्गोरिदम का उपयोग करें</li>
<li><strong>निर्णय समर्थन:</strong> LLM-संचालित सलाहकार प्रणाली तैनात करें</li>
<li><strong>निरंतर सुधार:</strong> अनुकूलन के लिए फीडबैक लूप लागू करें</li>
</ol>

<h4>उदाहरण:</h4>
<p>एक कंपनी को कई समस्याएं हैं - बिक्री कम है, लागत ज्यादा है, कर्मचारी खुश नहीं हैं। AI सिस्टम सभी डेटा का विश्लेषण करता है और पाता है कि सबसे बड़ी समस्या कर्मचारियों का मनोबल है। सिस्टम सुझाव देता है कि कर्मचारियों को अधिक स्वायत्तता और मान्यता दी जाए। 6 महीने में कर्मचारी संतुष्टि 40% बढ़ जाती है, जिससे बिक्री में 25% की वृद्धि होती है।</p>

<h4>अपेक्षित परिणाम:</h4>
<p>व्यावसायिक प्रदर्शन मेट्रिक्स में महत्वपूर्ण सुधार</p>

<h4>कार्यान्वयन सुझाव:</h4>
<ul>
<li>छोटे बदलावों से शुरू करें</li>
<li>कर्मचारियों को नई तकनीकों का प्रशिक्षण दें</li>
<li>ग्राहकों की प्रतिक्रिया को गंभीरता से लें</li>
<li>नियमित रूप से प्रगति की समीक्षा करें</li>
<li>बड़ी सोचें, लेकिन छोटे कदमों से आगे बढ़ें</li>
</ul>
        `;
    }
    
    return solution;
}

// -------- Navigation --------
// INVENTOR: Navigation function
// FUNCTIONALITY: Returns to main page
// REPLACEMENT: Use history.back()
// MODIFICATION: Change navigation behavior

function goBack() {
    // Hide results page
    if (DOM.resultsPage) {
        DOM.resultsPage.classList.remove('active');
    }
    
    // Show main content
    const mainContent = document.querySelector('.search-section, .alphabet-nav, .stats');
    if (mainContent) {
        mainContent.style.display = '';
    }
    
    // Clear search input
    // INVENTOR: DOM manipulation
    // FUNCTIONALITY: Clears search input
    // REPLACEMENT: Use value property
    // MODIFICATION: Change clearing method
    
    if (DOM.searchInput) {
        DOM.searchInput.value = '';
        DOM.searchInput.focus();
    }
    
    // Reset state
    // INVENTOR: State reset
    // FUNCTIONALITY: Resets application state
    // REPLACEMENT: Use different reset method
    // MODIFICATION: Change state reset
    
    state.currentLetter = null;
    state.currentResults = [];
    state.currentPage = 1;
}

// -------- Notification System --------
// INVENTOR: User feedback
// FUNCTIONALITY: Shows notifications to user
// REPLACEMENT: Use toast system
// MODIFICATION: Change notification style

function showNotification(message, type = 'info') {
    // INVENTOR: Notification creation
    // FUNCTIONALITY: Creates and shows notification
    // REPLACEMENT: Use alert or modal
    // MODIFICATION: Change notification design
    
    // Remove existing notifications
    // INVENTOR: DOM cleanup
    // FUNCTIONALITY: Removes old notifications
    // REPLACEMENT: Use different removal
    // MODIFICATION: Change cleanup method
    
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    // INVENTOR: DOM creation
    // FUNCTIONALITY: Creates notification element
    // REPLACEMENT: Use template literal
    // MODIFICATION: Change notification design
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#fc8181' : type === 'warning' ? '#f6ad55' : '#68d391'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        font-size: 1rem;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    // INVENTOR: Timer
    // FUNCTIONALITY: Removes notification after delay
    // REPLACEMENT: Use setTimeout
    // MODIFICATION: Change duration
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// -------- Add CSS Animations --------
// INVENTOR: CSS animations
// FUNCTIONALITY: Adds animation styles
// REPLACEMENT: Use JavaScript animations
// MODIFICATION: Change animation keyframes

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(30px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .pagination-btn {
        padding: 8px 16px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }
    
    .pagination-btn:hover:not(:disabled) {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }
    
    .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .page-info {
        padding: 8px 16px;
        font-weight: 600;
        color: #2d3748;
    }
`;
document.head.appendChild(styleSheet);

// ============================================
// OPTIMIZATION NOTES:
// ============================================
// 1. Implement lazy loading for problem data
// 2. Use Web Workers for search operations
// 3. Implement caching for search results
// 4. Use debouncing for input events
// 5. Implement infinite scroll
// 6. Use service workers for offline support
// 7. Implement progressive web app features
// 8. Optimize DOM updates
// 9. Use virtual scrolling for large lists
// 10. Implement analytics tracking
// ============================================

console.log('✅ Infinite Possibilities loaded successfully!');
console.log(`📊 Ready to search through ${window.businessProblems ? window.businessProblems.length : 0} business problems`);
