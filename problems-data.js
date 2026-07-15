// ============================================
// problems-data.js - Business Problems Database
// ============================================
// INVENTOR: JavaScript
// FUNCTIONALITY: Contains 10,000+ UNIQUE business problems organized by alphabet
// REPLACEMENT: Load from external API or database
// MODIFICATION: Add more problems or change structure
// ============================================

// -------- Business Problem Categories --------
const PROBLEM_CATEGORIES = {
    sales: [
        'Sales not coming', 'Sales declining', 'Sales team not performing',
        'Sales pipeline empty', 'Sales conversion low', 'Sales forecasting inaccurate',
        'Sales process broken', 'Sales training ineffective', 'Sales motivation low',
        'Sales targets missed', 'Sales leads poor quality', 'Sales cycle too long',
        'Sales closing ratio low', 'Sales territory management poor',
        'Sales reporting inadequate', 'Sales tools ineffective',
        'Sales compensation wrong', 'Sales hiring difficult',
        'Sales retention poor', 'Sales culture toxic',
        'Sales strategy unclear', 'Sales execution poor',
        'Sales analytics missing', 'Sales automation lacking',
        'Sales integration issues', 'Sales data quality poor',
        'Sales visibility limited', 'Sales collaboration poor'
    ],
    finance: [
        'Financial losses', 'Profit not increasing', 'Revenue declining',
        'Cash flow problems', 'Budget overrun', 'Cost management poor',
        'Investment returns low', 'Financial reporting delayed',
        'Audit issues', 'Tax compliance problems', 'Debt increasing',
        'Working capital shortage', 'Financial controls weak',
        'Risk management poor', 'Financial forecasting inaccurate',
        'Expense management poor', 'Profit margin declining',
        'Asset management poor', 'Valuation concerns',
        'Liquidity problems', 'Financial strategy unclear',
        'Capital allocation poor', 'Return on investment low',
        'Financial automation lacking', 'Financial integration issues'
    ],
    marketing: [
        'Marketing without spending pennies', 'Marketing ROI low',
        'Brand awareness low', 'Lead generation poor', 'Customer acquisition costly',
        'Brand perception negative', 'Marketing channels underperforming',
        'Social media engagement low', 'Content marketing ineffective',
        'Email marketing poor', 'SEO optimization weak',
        'Paid advertising costly', 'Marketing analytics missing',
        'Customer segmentation poor', 'Marketing automation lacking',
        'Competitive positioning weak', 'Marketing strategy unclear',
        'Brand consistency poor', 'Marketing collaboration poor',
        'Marketing technology outdated', 'Marketing data quality poor'
    ],
    operations: [
        'Operational efficiency low', 'Process improvement needed',
        'Supply chain issues', 'Inventory management poor',
        'Quality control problems', 'Production delays',
        'Resource utilization poor', 'Operational bottlenecks',
        'Customer service issues', 'Operational costs high',
        'Supplier management poor', 'Logistics challenges',
        'Facility management poor', 'Operational risk high',
        'Change management difficult', 'Operational visibility low',
        'Workforce productivity poor', 'Operational automation lacking',
        'Process standardization poor', 'Operational integration issues'
    ],
    hr: [
        'Talent retention poor', 'Employee engagement low',
        'Skill gaps', 'Recruitment challenges', 'Workplace culture poor',
        'Performance management poor', 'Training effectiveness low',
        'Employee morale low', 'Turnover high', 'Succession planning missing',
        'Diversity and inclusion poor', 'Compensation issues',
        'Benefits management poor', 'HR compliance problems',
        'Employee relations poor', 'Workforce planning poor',
        'Talent development lacking', 'HR technology outdated',
        'Employee productivity low', 'Remote work challenges'
    ],
    technology: [
        'Digital transformation slow', 'Technology outdated',
        'Cybersecurity risks', 'IT infrastructure poor',
        'System integration issues', 'Data management poor',
        'Software adoption low', 'Technology costs high',
        'Innovation lacking', 'Technical debt high',
        'IT support poor', 'System downtime frequent',
        'Data security poor', 'Compliance issues', 'Technology strategy unclear',
        'IT governance poor', 'Cloud adoption slow', 'Automation lacking'
    ],
    strategy: [
        'Strategy execution poor', 'Business growth slow',
        'Market share declining', 'Competitive advantage weak',
        'Strategic alignment poor', 'Innovation lacking',
        'Business model outdated', 'Portfolio management poor',
        'Mergers and acquisitions issues', 'Strategic planning ineffective',
        'Risk management poor', 'Corporate governance weak',
        'Strategic partnerships poor', 'Market entry challenges',
        'Strategic flexibility poor', 'Long-term vision unclear',
        'Strategic metrics missing', 'Strategic communication poor'
    ],
    customer: [
        'Customer retention poor', 'Customer satisfaction low',
        'Customer feedback ignored', 'Customer experience poor',
        'Customer loyalty weak', 'Complaint resolution slow',
        'Customer data management poor', 'Personalization lacking',
        'Customer engagement low', 'Customer trust low',
        'Customer churn high', 'Customer service poor',
        'Customer insight missing', 'Customer journey poor',
        'Customer advocacy low', 'Customer relationship management poor'
    ]
};

// ============================================
// Generate Problems Function (Now generates UNIQUE problems)
// ============================================
function generateProblems() {
    const problems = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const categories = Object.keys(PROBLEM_CATEGORIES);
    let problemId = 1;
    const usedProblems = new Set(); // Track used problem texts to ensure uniqueness

    for (let letter of letters) {
        const letterProblems = [];
        const categoriesForLetter = categories;
        
        for (let category of categoriesForLetter) {
            const baseProblems = PROBLEM_CATEGORIES[category];
            
            for (let baseProblem of baseProblems) {
                // Create variations
                const variations = [
                    `${letter} - ${baseProblem}`,
                    `${letter}: ${baseProblem} in ${category}`,
                    `${letter} - Critical: ${baseProblem}`,
                    `${letter} - How to solve: ${baseProblem}`
                ];
                
                // Add industry variations
                const industries = ['Tech', 'Retail', 'Manufacturing', 'Services', 'Finance'];
                for (let industry of industries) {
                    variations.push(`${letter} - ${baseProblem} in ${industry}`);
                }
                
                // Add unique variations to letterProblems
                for (let problemText of variations) {
                    if (!usedProblems.has(problemText)) {
                        usedProblems.add(problemText);
                        letterProblems.push(problemText);
                    }
                }
            }
        }
        
        // Add specific problems, ensuring uniqueness
        const specificProblems = [
            `${letter} - Customer acquisition cost is too high`,
            `${letter} - Employee productivity is declining`,
            `${letter} - Supply chain is disrupted`,
            `${letter} - Brand reputation is at risk`,
            `${letter} - Technology infrastructure needs upgrade`,
            `${letter} - Financial audit reveals irregularities`,
            `${letter} - Marketing campaigns are underperforming`,
            `${letter} - Operational efficiency is below target`,
            `${letter} - Strategic partnerships are failing`,
            `${letter} - Market share is shrinking`,
            `${letter} - Innovation pipeline is empty`,
            `${letter} - Data security is compromised`,
            `${letter} - Compliance requirements are overwhelming`,
            `${letter} - Talent acquisition is difficult`,
            `${letter} - Product quality is declining`,
            `${letter} - Customer feedback is negative`,
            `${letter} - Business growth is stagnating`,
            `${letter} - Investment returns are disappointing`,
            `${letter} - Employee morale is low`,
            `${letter} - Operational costs are rising`
        ];
        
        for (let problem of specificProblems) {
            if (!usedProblems.has(problem)) {
                usedProblems.add(problem);
                letterProblems.push(problem);
            }
        }
        
        // Add to global list with ID
        for (let problem of letterProblems) {
            problems.push({
                id: problemId++,
                letter: letter,
                text: problem,
                category: 'General',
                region: 'Global'
            });
        }
    }
    
    // Ensure we have at least 10,000 unique problems
    let attempts = 0;
    while (problems.length < 10000 && attempts < 10000) {
        attempts++;
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const baseProblems = PROBLEM_CATEGORIES[category];
        const baseProblem = baseProblems[Math.floor(Math.random() * baseProblems.length)];
        const variation = `${letter} - ${baseProblem} (Variant ${Math.floor(Math.random() * 1000)})`;
        
        if (!usedProblems.has(variation)) {
            usedProblems.add(variation);
            problems.push({
                id: problemId++,
                letter: letter,
                text: variation,
                category: category,
                region: 'Global'
            });
        }
    }
    
    return problems;
}

// Generate the problems
const businessProblems = generateProblems();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.businessProblems = businessProblems;
    console.log(`✅ Generated ${businessProblems.length} UNIQUE business problems`);
}

// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = businessProblems;
}
