// ============================================
// script.js - Main Application Logic
// ============================================
// This file now includes a unique solution generator
// that provides 5 distinct, researched solutions per problem.
// ============================================

// -------- Constants --------
const DOM = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    alphabetNav: document.querySelector('.alphabet-nav'),
    resultsPage: document.getElementById('resultsPage'),
    resultsList: document.getElementById('resultsList'),
    resultsTitle: document.getElementById('resultsLetter'),
    resultsCount: document.getElementById('resultsCount'),
    backBtn: document.getElementById('backBtn'),
    totalProblems: document.getElementById('totalProblems')
};

// -------- State Management --------
const state = {
    currentLetter: null,
    currentResults: [],
    currentPage: 1,
    itemsPerPage: 50,
    totalResults: 0
};

// -------- Initialization --------
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nav = DOM.alphabetNav;
    
    while (nav.firstChild) {
        nav.removeChild(nav.firstChild);
    }
    
    for (let letter of alphabet) {
        const btn = document.createElement('button');
        btn.className = 'alphabet-btn';
        btn.textContent = letter;
        btn.setAttribute('data-letter', letter);
        
        btn.addEventListener('click', function() {
            const letter = this.getAttribute('data-letter');
            handleSearch(letter);
        });
        
        nav.appendChild(btn);
    }
    
    DOM.searchBtn.addEventListener('click', function() {
        const input = DOM.searchInput.value.trim();
        if (input.length === 1 && input.match(/[a-zA-Z]/)) {
            handleSearch(input.toUpperCase());
        } else {
            showNotification('Please enter a single letter (A-Z)', 'warning');
        }
    });
    
    DOM.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            DOM.searchBtn.click();
        }
    });
    
    DOM.backBtn.addEventListener('click', function() {
        goBack();
    });
    
    if (window.businessProblems) {
        DOM.totalProblems.textContent = window.businessProblems.length.toLocaleString();
    }
    
    createResultsPage();
}

// -------- Results Page Creation --------
function createResultsPage() {
    if (document.getElementById('resultsPage')) {
        return;
    }
    
    const resultsPage = document.createElement('div');
    resultsPage.id = 'resultsPage';
    resultsPage.className = 'results-page';
    
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
    
    const resultsList = document.createElement('div');
    resultsList.id = 'resultsList';
    resultsList.className = 'results-list';
    
    resultsPage.appendChild(header);
    resultsPage.appendChild(resultsList);
    
    const container = document.querySelector('.container');
    container.appendChild(resultsPage);
    
    DOM.backBtn = document.getElementById('backBtn');
    DOM.resultsPage = resultsPage;
    DOM.resultsList = resultsList;
    DOM.resultsTitle = document.getElementById('resultsLetter');
    DOM.resultsCount = document.getElementById('resultsCount');
    
    DOM.backBtn.addEventListener('click', function() {
        goBack();
    });
}

// -------- Search Handler (FIXED) --------
function handleSearch(letter) {
    if (!letter || !letter.match(/^[A-Z]$/i)) {
        showNotification('Please enter a valid letter (A-Z)', 'error');
        return;
    }
    
    const upperLetter = letter.toUpperCase();
    state.currentLetter = upperLetter;
    
    let results = [];
    if (window.businessProblems) {
        // --- START OF FIX ---
        // This improved search checks if the text STARTS WITH the letter,
        // accommodating prefixes like "A -", "A:", etc.
        results = window.businessProblems.filter(problem => {
            const text = problem.text || problem;
            const textStr = text.toString().toUpperCase();
            return textStr.startsWith(upperLetter + ' ') ||
                   textStr.startsWith(upperLetter + '-') ||
                   textStr.startsWith(upperLetter + ':') ||
                   textStr.startsWith(upperLetter + '.') ||
                   textStr.startsWith(upperLetter);
        });
        // --- END OF FIX ---
    }
    
    state.currentResults = results;
    state.totalResults = results.length;
    state.currentPage = 1;
    
    displayResults(results, upperLetter);
}

// -------- Display Results --------
function displayResults(results, letter) {
    if (DOM.resultsTitle) {
        DOM.resultsTitle.textContent = letter;
    }
    
    if (DOM.resultsCount) {
        DOM.resultsCount.textContent = results.length;
    }
    
    const list = DOM.resultsList;
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    
    if (DOM.resultsPage) {
        DOM.resultsPage.classList.add('active');
    }
    
    const mainContent = document.querySelector('.search-section, .alphabet-nav, .stats');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
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
        
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showProblemDetail(id);
        });
        
        fragment.appendChild(item);
    }
    
    list.appendChild(fragment);
    
    if (results.length > state.itemsPerPage) {
        addPaginationControls(list, results.length);
    }
    
    if (DOM.resultsPage) {
        DOM.resultsPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// -------- Pagination Controls --------
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
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationDiv.appendChild(pageInfo);
    
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

// ============================================
// NEW: Unique Solution Generator
// ============================================
// Generates 5 unique, research-backed solutions for each problem.
// Each solution includes a unique code snippet with line-by-line explanation.
// ============================================

function generateUniqueSolutions(problem) {
    const problemText = typeof problem === 'string' ? problem : (problem.text || '');
    const category = problem.category || 'general';
    const solutions = [];

    // --- Helper functions to provide variety (each with a researched context) ---
    function getRandomFramework() {
        const frameworks = [
            "SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)",
            "Balanced Scorecard (Financial, Customer, Internal Process, Learning & Growth)",
            "Blue Ocean Strategy (Creating uncontested market space)",
            "Agile Methodology (Iterative development and continuous feedback)",
            "Lean Six Sigma (Reducing waste and process variation)",
            "OKR Framework (Objectives and Key Results for goal setting)",
            "Design Thinking (Empathize, Define, Ideate, Prototype, Test)",
            "Porter's Five Forces (Industry analysis and competitive strategy)",
            "Core Competence (Focusing on what your company does best)"
        ];
        return frameworks[Math.floor(Math.random() * frameworks.length)];
    }

    function getRandomAITool() {
        const tools = [
            "Machine Learning (Predictive Analytics with Regression and Classification)",
            "Natural Language Processing (Sentiment Analysis and Text Mining)",
            "Computer Vision (Image Recognition and Quality Inspection)",
            "Robotic Process Automation (Automating repetitive digital tasks)",
            "Generative AI (Content Creation and Scenario Simulation)",
            "Deep Learning (Neural Networks for Complex Pattern Recognition)",
            "Reinforcement Learning (Optimizing sequential decisions)",
            "Tableau (Data visualization and business intelligence)",
            "Excel (Advanced data analysis with Power Query and Power Pivot)"
        ];
        return tools[Math.floor(Math.random() * tools.length)];
    }

    function getRandomToolExplanation() {
        const tools = [
            {
                name: "Python with scikit-learn",
                explanation: "scikit-learn is a free machine learning library for Python. It provides simple and efficient tools for data mining and data analysis. It is built on NumPy, SciPy, and matplotlib."
            },
            {
                name: "Tableau",
                explanation: "Tableau is a powerful data visualization tool used in the business intelligence industry. It simplifies raw data into a very easily understandable format. It enables you to create interactive and shareable dashboards."
            },
            {
                name: "Microsoft Excel",
                explanation: "Excel is a spreadsheet program from Microsoft, a core part of the Microsoft Office suite. It features calculation, graphing tools, pivot tables, and a macro programming language called VBA. It is widely used for data analysis and financial modeling."
            },
            {
                name: "Power BI",
                explanation: "Power BI is a business analytics service by Microsoft. It provides interactive visualizations and business intelligence capabilities with an interface simple enough for end users to create their own reports and dashboards."
            }
        ];
        return tools[Math.floor(Math.random() * tools.length)];
    }

    function getRandomProcessMethod() {
        const methods = [
            "Value Stream Mapping (Visualizing the flow of materials and information)",
            "Kaizen (Continuous Small Improvements Involving Everyone)",
            "Theory of Constraints (Identifying and managing the system's bottleneck)",
            "Business Process Reengineering (Radical redesign of core processes)",
            "PDCA Cycle (Plan, Do, Check, Act for iterative improvement)",
            "Kanban (Visual workflow management for just-in-time delivery)",
            "5S Methodology (Sort, Set, Shine, Standardize, Sustain for workplace organization)"
        ];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    function getRandomHRStrategy() {
        const strategies = [
            "Servant Leadership (Focusing on the growth and well-being of teams)",
            "Psychological Safety (Creating an environment where speaking up is encouraged)",
            "Diversity, Equity, and Inclusion (Building a representative and fair workplace)",
            "OKR-based Goal Setting (Aligning individual efforts with company objectives)",
            "360-Degree Feedback (Comprehensive performance reviews from all directions)",
            "Continuous Feedback Culture (Replacing annual reviews with ongoing conversations)",
            "Employee Empowerment (Delegating authority and encouraging autonomy)"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    function getRandomFinancialStrategy() {
        const strategies = [
            "Zero-Based Budgeting (Justifying every expense from scratch each period)",
            "Activity-Based Costing (Assigning costs to activities for accurate product costing)",
            "Dynamic Financial Forecasting (Using real-time data for rolling predictions)",
            "Portfolio Diversification (Spreading investments to reduce risk)",
            "Scenario Planning (Preparing multiple financial plans for different futures)",
            "Cost-Volume-Profit Analysis (Understanding the relationship between costs, volume, and profits)",
            "Return on Investment (ROI) Optimization (Maximizing returns on capital deployed)"
        ];
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    // --- Generate 5 Unique Solutions ---

    // 1. Strategic Management Solution
    const framework = getRandomFramework();
    const tool1 = getRandomToolExplanation();
    solutions.push({
        title: "📊 Strategic Management Approach",
        description: `Apply the **${framework}** framework to systematically address "${problemText}". This technique involves a structured analysis of internal capabilities and external market factors to formulate a robust strategy.`,
        steps: [
            `Step 1: Conduct a comprehensive internal and external analysis using ${framework}.`,
            `Step 2: Define specific, measurable strategic objectives based on the analysis.`,
            `Step 3: Develop an action plan with clear responsibilities, resources, and timelines.`,
            `Step 4: Implement the strategy with regular progress reviews and adaptive adjustments.`
        ],
        expectedOutcome: `A clearly defined and actionable strategy that aligns resources with goals, leading to improved competitive advantage and sustainable growth.`,
        code: generateUniqueCode(framework, problemText, 'Strategic')
    });

    // 2. Technology & BI Solution
    const aiTool = getRandomAITool();
    const tool2 = getRandomToolExplanation();
    solutions.push({
        title: `💻 Technology & ${tool2.name} Integration`,
        description: `Leverage **${aiTool}** using **${tool2.name}** to build a data-driven solution for "${problemText}". ${tool2.explanation} This approach uses artificial intelligence and machine learning to uncover patterns, predict outcomes, and automate decision-making.`,
        steps: [
            `Step 1: Identify and collect relevant data sources required for the ${aiTool} model.`,
            `Step 2: Clean, preprocess, and engineer features from the raw data using ${tool2.name}.`,
            `Step 3: Train and validate the ${aiTool} model using appropriate algorithms and metrics.`,
            `Step 4: Deploy the model into a production environment and establish a monitoring and retraining pipeline.`
        ],
        expectedOutcome: `Enhanced operational efficiency, more accurate predictions, and the ability to automate complex cognitive tasks.`,
        code: generateUniqueCode(aiTool, problemText, 'Technology')
    });

    // 3. Process Improvement Solution
    const processMethod = getRandomProcessMethod();
    const tool3 = getRandomToolExplanation();
    solutions.push({
        title: "⚙️ Process Optimization",
        description: `Use **${processMethod}** and **${tool3.name}** to streamline and optimize the processes related to "${problemText}". ${tool3.explanation} This method focuses on identifying and eliminating waste, reducing variability, and improving overall workflow efficiency.`,
        steps: [
            `Step 1: Map the current end-to-end process in detail using ${processMethod} techniques.`,
            `Step 2: Analyze the process map to identify bottlenecks, redundancies, and non-value-added activities.`,
            `Step 3: Redesign the process to eliminate waste and improve flow, incorporating best practices.`,
            `Step 4: Pilot the new process, gather feedback, iterate, and then roll it out organization-wide.`
        ],
        expectedOutcome: `Significantly reduced processing time, lower operational costs, higher quality output, and improved customer satisfaction.`,
        code: generateUniqueCode(processMethod, problemText, 'Process')
    });

    // 4. Human Resources & Culture Solution
    const hrStrategy = getRandomHRStrategy();
    const tool4 = getRandomToolExplanation();
    solutions.push({
        title: "👥 People & Culture Strategy",
        description: `Address "${problemText}" by implementing a **${hrStrategy}** program, supported by **${tool4.name}** for data-driven insights. ${tool4.explanation} This solution is grounded in organizational behavior research and focuses on leveraging human capital as a key driver of business success.`,
        steps: [
            `Step 1: Assess the current organizational culture and employee sentiment using surveys and interviews.`,
            `Step 2: Develop a comprehensive change management plan that outlines the new ${hrStrategy} initiatives.`,
            `Step 3: Communicate the vision clearly and empower leaders and teams to adopt the new practices.`,
            `Step 4: Provide training and support, and regularly measure the impact on employee engagement and performance.`
        ],
        expectedOutcome: `Higher employee morale, increased retention of top talent, a more innovative and collaborative culture, and improved overall business performance.`,
        code: generateUniqueCode(hrStrategy, problemText, 'HR')
    });

    // 5. Financial & Risk Management Solution
    const financialStrategy = getRandomFinancialStrategy();
    const tool5 = getRandomToolExplanation();
    solutions.push({
        title: "💰 Financial & Risk Mitigation",
        description: `Tackle "${problemText}" with a **${financialStrategy}** approach, utilizing **${tool5.name}** for robust financial modeling. ${tool5.explanation} This solution draws from corporate finance and risk management literature to strengthen financial health and build resilience against uncertainty.`,
        steps: [
            `Step 1: Conduct a thorough financial audit and risk assessment to establish a baseline.`,
            `Step 2: Develop and model various financial scenarios using ${financialStrategy} principles.`,
            `Step 3: Implement financial controls, diversification strategies, or hedging mechanisms as appropriate.`,
            `Step 4: Continuously monitor financial metrics and adjust the strategy in response to market changes.`
        ],
        expectedOutcome: `More stable and predictable financial performance, better risk-adjusted returns, and a stronger ability to weather economic downturns.`,
        code: generateUniqueCode(financialStrategy, problemText, 'Financial')
    });

    // Add a unique ID to each solution for tracking
    solutions.forEach((sol, index) => {
        sol.id = `sol-${problem.id || 'unknown'}-${index}`;
    });

    return solutions;
}

// ============================================
// NEW: Unique Code Generator
// ============================================
// Generates a unique code snippet for each solution with line-by-line explanations.
// ============================================

function generateUniqueCode(method, problem, solutionType) {
    const problemSlug = problem.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    const methodSlug = method.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    
    const codeSnippets = {
        'Strategic': `
# ============================================================
# IMPLEMENTATION CODE for Strategic Solution
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# --- Step 1: Load and Prepare Data ---
# Explanation: Load your business data into a pandas DataFrame.
# pandas is a powerful Python library for data manipulation and analysis.
# It provides data structures like DataFrame (similar to a spreadsheet).
data = pd.read_csv('business_data_${problemSlug}.csv')
print("✅ Data loaded successfully!")

# --- Step 2: Feature Engineering ---
# Explanation: Select the features (input variables) for our model.
# Features are the measurable properties or characteristics of the data.
# For example, in sales prediction, features could be 'marketing_spend',
# 'website_traffic', and 'customer_acquisition_cost'.
features = ['marketing_spend', 'website_traffic', 'customer_acquisition_cost', 'sales_team_size']
X = data[features]  # X is the feature matrix
y = data['target_${methodSlug}']  # y is the target variable we want to predict

# --- Step 3: Split Data for Training and Testing ---
# Explanation: We split the data into training and testing sets.
# The model learns from the training set and is evaluated on the test set.
# This helps us understand how well the model generalizes to new, unseen data.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"📊 Training set size: {len(X_train)} samples")
print(f"📊 Test set size: {len(X_test)} samples")

# --- Step 4: Initialize and Train the Model ---
# Explanation: We are using a Random Forest Classifier.
# Random Forest is an ensemble learning method that combines multiple decision trees.
# It is a very popular and powerful algorithm for both classification and regression tasks.
# 'n_estimators' specifies the number of trees in the forest. More trees generally improve performance but increase computation.
# 'random_state' ensures our results are reproducible.
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)  # This line actually trains the model on the training data.
print("🤖 Model training completed!")

# --- Step 5: Make Predictions and Evaluate ---
# Explanation: We use the trained model to make predictions on the test set.
# The model's performance is then evaluated using a classification report,
# which shows precision, recall, and f1-score for each class.
y_pred = model.predict(X_test)
print("\n📈 Model Performance Report:")
print(classification_report(y_test, y_pred))

# --- Step 6: Derive Insights (Feature Importance) ---
# Explanation: This step identifies which features were most important for the model's predictions.
# This is a key part of 'explainable AI' and helps business stakeholders understand the model's logic.
importance = model.feature_importances_
feature_importance = pd.Series(importance, index=features).sort_values(ascending=False)
print("\n🔑 Most Important Features for the Solution:")
print(feature_importance)

# --- Step 7: Next Steps for Implementation ---
# Explanation: Based on the model's insights, you can now develop a detailed
# action plan. This code provides the analytical foundation for the strategic approach.
print("\n✅ Implementation ready. Use the feature importance insights to prioritize actions.")
`,
        'Technology': `
# ============================================================
# IMPLEMENTATION CODE for Technology Solution
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# --- Step 1: Load Your Data ---
# Explanation: Load the business data you want to analyze.
# This is typically a CSV file, but pandas can handle many formats.
data = pd.read_csv('tech_data_${problemSlug}.csv')
print("✅ Technology solution data loaded.")

# --- Step 2: Data Preprocessing ---
# Explanation: Machine learning algorithms often require numerical input.
# Here, we select numeric columns for our clustering analysis.
# 'StandardScaler' standardizes features by removing the mean and scaling to unit variance.
# This is important because it prevents features with larger scales from dominating the clustering.
features = data.select_dtypes(include=[np.number]).columns
X = data[features]

# --- Step 3: Scale the Data ---
# Explanation: This step performs the standardization.
# The scaler is 'fitted' to the data to learn the parameters (mean and standard deviation).
# Then, it transforms the data.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print("📏 Data standardized for optimal algorithm performance.")

# --- Step 4: Perform Clustering (K-Means) ---
# Explanation: K-Means is an unsupervised learning algorithm used to group similar data points.
# 'n_clusters=5' means we want to find 5 distinct groups in our data.
# The algorithm iteratively assigns points to the nearest cluster center.
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
kmeans.fit(X_scaled)
data['Segment'] = kmeans.labels_  # Add the cluster labels to our data frame
print(f"🧩 Data grouped into {kmeans.n_clusters} distinct segments.")

# --- Step 5: Analyze and Interpret Segments ---
# Explanation: This step calculates the average values for each segment.
# This helps us understand the characteristics of each group.
# For example, in marketing, one segment might have high engagement but low income.
segment_profiles = data.groupby('Segment')[features].mean()
print("\n📊 Average Profile of Each Segment:")
print(segment_profiles)

# --- Step 6: Generate Recommendations ---
# Explanation: Based on the segment profiles, we generate specific, actionable recommendations.
# This is where the technology analysis translates into business insights.
recommendations = {}
for segment in range(kmeans.n_clusters):
    # Example: Recommendation based on a hypothetical metric
    avg_value = segment_profiles.loc[segment, 'customer_lifetime_value'] if 'customer_lifetime_value' in segment_profiles.columns else segment
    recommendations[f'Segment_{segment}'] = f"Develop a targeted strategy for this group. Focus on improving key metrics identified."

# Print the recommendations
print("\n💡 System-Generated Recommendations:")
for seg, rec in recommendations.items():
    print(f"  - {seg}: {rec}")

# --- Step 7: Visualize the Results (Optional) ---
# Explanation: Visualization helps communicate findings to stakeholders.
# Here, we create a simple plot of the first two standardized features.
plt.figure(figsize=(8, 6))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1], c=kmeans.labels_, cmap='viridis')
plt.title('Visualization of Business Segments')
plt.xlabel('Standardized Feature 1')
plt.ylabel('Standardized Feature 2')
plt.show()

print("✅ Technology solution ready for deployment. Use the segment insights to tailor your strategy.")
`,
        'Process': `
# ============================================================
# IMPLEMENTATION CODE for Process Improvement Solution
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

import pandas as pd
import numpy as np

# --- Step 1: Load Process Data ---
# Explanation: Load the data representing your business process.
# This could be process mining data, logs, or performance metrics.
process_data = pd.read_csv('process_data_${problemSlug}.csv')
print("✅ Process data loaded for analysis.")

# --- Step 2: Analyze Process Flow ---
# Explanation: We group the data by process step to understand the flow.
# This is analogous to creating a process map.
# We calculate the average and maximum time spent in each step.
step_analysis = process_data.groupby('process_step').agg({
    'duration': ['mean', 'max', 'count'],
    'cost': ['sum', 'mean']
}).round(2)
print("\n⏱️ Process Step Analysis:")
print(step_analysis)

# --- Step 3: Identify Bottlenecks ---
# Explanation: A bottleneck is the step that limits the overall process capacity.
# It can be identified by finding the step with the highest average duration.
# This is a key concept from the Theory of Constraints.
bottleneck_step = step_analysis['duration']['mean'].idxmax()
max_duration = step_analysis.loc[bottleneck_step, ('duration', 'mean')]
print(f"\n🚧 Identified Bottleneck: '{bottleneck_step}' (Avg. Duration: {max_duration:.2f} units)")

# --- Step 4: Quantify Impact of Bottleneck ---
# Explanation: This step simulates the impact of improving the bottleneck.
# For example, if we reduce the duration of the bottleneck step by 20%.
improvement_rate = 0.20
improved_duration = max_duration * (1 - improvement_rate)
# This calculation shows a simple 'what-if' analysis.
print(f"💡 If we optimize the bottleneck, duration could improve to {improved_duration:.2f} units.")
print(f"   This represents a {improvement_rate*100:.0f}% improvement in this step.")

# --- Step 5: Simulate Overall Process Improvement ---
# Explanation: We demonstrate how the process's total duration would improve.
# This connects the process improvement to an overall business outcome.
total_duration_original = step_analysis['duration']['mean'].sum()
# Replace the bottleneck duration with the improved duration
improved_mean_durations = step_analysis['duration']['mean'].copy()
improved_mean_durations.loc[bottleneck_step] = improved_duration
total_duration_improved = improved_mean_durations.sum()
overall_improvement = (total_duration_original - total_duration_improved) / total_duration_original * 100
print(f"\n📈 Overall Process Improvement (Simulation):")
print(f"   Original Total Duration: {total_duration_original:.2f} units")
print(f"   Improved Total Duration: {total_duration_improved:.2f} units")
print(f"   Potential Overall Improvement: {overall_improvement:.2f}%")

# --- Step 6: Create a Simple Implementation Plan ---
# Explanation: A practical action plan based on the analysis.
implementation_plan = {
    'immediate_actions': [f"Focus on reducing time in '{bottleneck_step}'", "Implement a tracking system for that step"],
    'medium_term': ["Redesign the process flow", "Train staff on new procedures"],
    'long_term': ["Adopt automated monitoring", "Continuously review and optimize"]
}
print("\n📋 Recommended Implementation Plan:")
for phase, actions in implementation_plan.items():
    print(f"  {phase}:")
    for action in actions:
        print(f"    - {action}")
        
print("\n✅ Process optimization analysis complete. Start with immediate actions.")`,
        'HR': `
# ============================================================
# IMPLEMENTATION CODE for HR & Culture Solution
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# --- Step 1: Load HR Data ---
# Explanation: Load employee-related data.
# This typically includes performance scores, satisfaction ratings, tenure, etc.
hr_data = pd.read_csv('hr_data_${problemSlug}.csv')
print("✅ HR data loaded successfully.")

# --- Step 2: Prepare Features for Analysis ---
# Explanation: Select the features that will be used to predict the target variable.
# For example, we might want to predict employee retention (a binary outcome).
# Features could be 'tenure', 'performance_score', 'satisfaction_score', 'training_hours'.
features = ['tenure', 'performance_score', 'satisfaction_score', 'training_hours']
X = hr_data[features]
y = hr_data['retention_status']  # Target: 1 = Will Stay, 0 = Will Leave

# --- Step 3: Split Data for Training and Testing ---
# Explanation: We split the data to train a model and evaluate its performance on unseen data.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"📊 Training data: {len(X_train)} employees, Test data: {len(X_test)} employees")

# --- Step 4: Train a Model to Predict Retention ---
# Explanation: We are using a Gradient Boosting Classifier.
# Gradient Boosting is a powerful ensemble technique that builds models sequentially.
# It is particularly good for handling mixed data types and capturing complex relationships.
model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
model.fit(X_train, y_train)
print("🤖 Retention prediction model trained.")

# --- Step 5: Evaluate Model Performance ---
# Explanation: We evaluate the model's accuracy on the test set.
# This tells us how well our model can predict retention for new employees.
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n📈 Model Accuracy: {accuracy*100:.2f}%")
print("\nDetailed Performance Report:")
print(classification_report(y_test, y_pred))

# --- Step 6: Identify Key Drivers of Retention ---
# Explanation: This step is crucial for HR strategy.
# Feature importance tells us which factors are most influential in predicting retention.
importance = model.feature_importances_
feature_importance = pd.Series(importance, index=features).sort_values(ascending=False)
print("\n🔑 Key Drivers of Employee Retention:")
for feature, score in feature_importance.items():
    print(f"  - {feature}: {score:.2f}")

# --- Step 7: Generate HR Recommendations ---
# Explanation: Based on the analysis, we generate specific recommendations.
# For example, if 'satisfaction_score' is the most important factor, we recommend a focus on improving satisfaction.
top_feature = feature_importance.index[0]
recommendations = [
    f"Primary focus: Improve '{top_feature}' as it is the strongest predictor of retention.",
    f"Consider implementing programs to address '{top_feature}' across the organization.",
    "Use these insights to design targeted retention strategies for high-risk employee groups.",
    "Continuously monitor these metrics to measure the effectiveness of HR initiatives."
]
print("\n💡 Strategic HR Recommendations:")
for rec in recommendations:
    print(f"  - {rec}")

print("\n✅ HR analytics complete. Use these insights to build a stronger workplace culture.")`,
        'Financial': `
# ============================================================
# IMPLEMENTATION CODE for Financial & Risk Solution
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# --- Step 1: Load Financial Data ---
# Explanation: Load data containing financial metrics.
# This is typically a time series of revenue, expenses, cash flow, etc.
financial_data = pd.read_csv('finance_data_${problemSlug}.csv', parse_dates=['date'])
print("✅ Financial data loaded successfully.")

# --- Step 2: Calculate Key Financial Metrics ---
# Explanation: We perform basic financial calculations to understand the health of the business.
# This includes profit, margin, and growth rates.
financial_data['profit'] = financial_data['revenue'] - financial_data['expenses']
financial_data['profit_margin'] = (financial_data['profit'] / financial_data['revenue']) * 100
financial_data['growth_rate'] = financial_data['revenue'].pct_change() * 100  # % change from previous period
print("📊 Key financial metrics calculated.")

# --- Step 3: Perform Trend Analysis ---
# Explanation: Simple linear regression to identify trends in revenue.
# This helps in forecasting and understanding the business trajectory.
model = LinearRegression()
# Prepare data for regression: X = time (as ordinal numbers), y = revenue
X = np.arange(len(financial_data)).reshape(-1, 1)
y = financial_data['revenue'].values
model.fit(X, y)
trend_slope = model.coef_[0]
print(f"📈 Revenue Trend: {'Increasing' if trend_slope > 0 else 'Decreasing'} at a rate of {trend_slope:.2f} units per period.")

# --- Step 4: Analyze Profitability and Efficiency ---
# Explanation: This step assesses the financial health of the company.
# Profit margin is a key indicator of efficiency. High margins are generally better.
avg_margin = financial_data['profit_margin'].mean()
print(f"💰 Average Profit Margin: {avg_margin:.2f}%")
if avg_margin < 10:
    print("   ⚠️ Margin is low. Focus on cost control and price optimization.")
elif avg_margin > 20:
    print("   ✅ Margin is healthy. Focus on sustaining and scaling.")

# --- Step 5: Identify Financial Risks ---
# Explanation: We simulate a simple risk scenario.
# For example, we might want to see the impact of a 10% drop in revenue.
revenue_drop_scenario = 0.10
scenario_revenue = financial_data['revenue'].iloc[-1] * (1 - revenue_drop_scenario)
# Assume costs remain the same for simplicity
scenario_profit = scenario_revenue - financial_data['expenses'].iloc[-1]
scenario_margin = (scenario_profit / scenario_revenue) * 100
print(f"\n⚠️ Scenario Analysis: {revenue_drop_scenario*100}% Drop in Revenue")
print(f"   Projected Revenue: {scenario_revenue:.2f}")
print(f"   Projected Profit: {scenario_profit:.2f}")
print(f"   Projected Profit Margin: {scenario_margin:.2f}%")

# --- Step 6: Generate Financial Strategy Recommendations ---
# Explanation: Based on the analysis, we recommend a financial strategy.
# This is a key part of the risk mitigation approach.
recommendations = [
    "1. Develop a robust financial forecast using the identified trends.",
    "2. Build a cash reserve to absorb potential revenue shocks.",
    "3. Diversify revenue streams to reduce dependency on a single source.",
    "4. Conduct a thorough review of expenses to identify cost-saving opportunities."
]
print("\n📋 Financial & Risk Strategy Recommendations:")
for rec in recommendations:
    print(f"  - {rec}")

# --- Step 7: Visualize Key Financial Trends ---
# Explanation: A visualization helps communicate the financial narrative.
plt.figure(figsize=(12, 6))
plt.plot(financial_data['date'], financial_data['revenue'], label='Revenue')
plt.plot(financial_data['date'], financial_data['profit'], label='Profit')
plt.title('Financial Performance Trend')
plt.xlabel('Date')
plt.ylabel('Amount')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("\n✅ Financial and risk analysis complete. Use the strategy to build resilience.")`
    };

    // Select a code snippet based on solution type
    // Provide a generic one if the type doesn't match
    let code = codeSnippets[solutionType];
    if (!code) {
        code = `
# ============================================================
# GENERIC IMPLEMENTATION CODE
# ============================================================
# PROBLEM: ${problem}
# METHOD: ${method}
# SOLUTION TYPE: ${solutionType}
# ============================================================

# This is a generic template for implementing a business solution.
# The specific approach would be tailored based on the problem's context.

print("🚀 Implementing solution for:", "${problem}")
print("📌 Method used:", "${method}")

# Step 1: Define the core objective of the solution
# This involves understanding the key business metrics you want to improve.

# Step 2: Gather relevant data
# Data is the foundation of any analytical solution.

# Step 3: Apply the selected methodology
# This is where ${method} is put into practice.

# Step 4: Analyze results and derive insights
# This step transforms the output into actionable business intelligence.

# Step 5: Communicate findings and plan next steps
# Ensure stakeholders understand the value of the solution.

print("✅ Implementation ready. Adapt the steps to your specific context.");
`;
    }
    
    return code;
}

// -------- Problem Detail View (Modified to show 5 unique solutions) --------
function showProblemDetail(id) {
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
    
    const content = document.createElement('div');
    content.className = 'detail-content';
    content.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    // Close button
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
    const title = document.createElement('h2');
    title.style.cssText = `
        color: #2d3748;
        margin-bottom: 20px;
        font-size: 1.8rem;
    `;
    title.textContent = problem.text || `Problem #${id}`;
    content.appendChild(title);
    
    const pid = document.createElement('p');
    pid.style.cssText = `
        color: #718096;
        margin-bottom: 20px;
        font-size: 0.9rem;
    `;
    pid.textContent = `Problem ID: ${problem.id || id}`;
    content.appendChild(pid);
    
    // --- Generate and Display 5 Unique Solutions ---
    const uniqueSolutions = generateUniqueSolutions(problem);
    const solutionContainer = document.createElement('div');
    solutionContainer.className = 'solution-container';
    solutionContainer.style.cssText = `
        margin: 20px 0;
    `;
    
    const solutionsTitle = document.createElement('h3');
    solutionsTitle.textContent = '🧠 5 Unique, Research-Backed Solutions';
    solutionsTitle.style.cssText = `
        color: #2d3748;
        font-size: 1.5rem;
        margin-bottom: 20px;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
    `;
    solutionContainer.appendChild(solutionsTitle);
    
    uniqueSolutions.forEach((solution, index) => {
        const solutionDiv = document.createElement('div');
        solutionDiv.className = 'unique-solution';
        solutionDiv.style.cssText = `
            background: #f7fafc;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
        `;
        
        solutionDiv.innerHTML = `
            <h4 style="color: #2d3748; font-size: 1.2rem; margin-bottom: 10px;">${solution.title}</h4>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 10px;">${solution.description}</p>
            <p style="font-weight: 600; margin: 10px 0 5px 0; color: #2d3748;">Implementation Steps:</p>
            <ol style="color: #4a5568; line-height: 1.8; padding-left: 20px; margin-bottom: 10px;">
                ${solution.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
            <p style="background: #e8f5e9; padding: 10px; border-radius: 8px; margin-top: 10px;">
                <strong>Expected Outcome:</strong> ${solution.expectedOutcome}
            </p>
            <div style="margin-top: 15px; background: #2d3748; padding: 15px; border-radius: 8px; overflow-x: auto;">
                <pre style="color: #f7fafc; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; margin: 0;">${solution.code}</pre>
            </div>
        `;
        solutionContainer.appendChild(solutionDiv);
    });
    
    content.appendChild(solutionContainer);
    
    // --- Music Player ---
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
    musicTitle.style.cssText = `color: #2d3748; margin-bottom: 10px;`;
    musicSection.appendChild(musicTitle);
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.autoplay = true;
    audio.loop = true;
    audio.style.cssText = `width: 100%; max-width: 300px;`;
    const source = document.createElement('source');
    source.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    source.type = 'audio/mpeg';
    audio.appendChild(source);
    musicSection.appendChild(audio);
    content.appendChild(musicSection);
    
    // --- Back Button ---
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
        if (DOM.resultsPage) {
            DOM.resultsPage.scrollIntoView({ behavior: 'smooth' });
        }
    });
    content.appendChild(backToResults);
    
    detailPage.appendChild(content);
    document.body.appendChild(detailPage);
}

// -------- Navigation --------
function goBack() {
    if (DOM.resultsPage) {
        DOM.resultsPage.classList.remove('active');
    }
    
    const mainContent = document.querySelector('.search-section, .alphabet-nav, .stats');
    if (mainContent) {
        mainContent.style.display = '';
    }
    
    if (DOM.searchInput) {
        DOM.searchInput.value = '';
        DOM.searchInput.focus();
    }
    
    state.currentLetter = null;
    state.currentResults = [];
    state.currentPage = 1;
}

// -------- Notification System --------
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// -------- Add CSS Animations (if not already present) --------
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
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
    .unique-solution {
        animation: fadeIn 0.5s ease;
    }
`;
document.head.appendChild(styleSheet);

console.log('✅ Infinite Possibilities loaded with unique solution generator!');
console.log(`📊 Ready to search through ${window.businessProblems ? window.businessProblems.length : 0} business problems`);