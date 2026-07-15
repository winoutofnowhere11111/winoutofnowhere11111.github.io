// ============================================
// AI SEARCH FUNCTIONALITY
// ============================================

// Add event listener for AI search
document.addEventListener('DOMContentLoaded', function() {
    const aiSearchBtn = document.getElementById('aiSearchBtn');
    const aiSearchInput = document.getElementById('aiSearchInput');
    
    if (aiSearchBtn) {
        aiSearchBtn.addEventListener('click', performAISearch);
    }
    
    if (aiSearchInput) {
        aiSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performAISearch();
            }
        });
    }
});

function performAISearch() {
    const input = document.getElementById('aiSearchInput');
    const query = input.value.trim();
    
    if (!query) {
        showNotification('Please describe your business problem', 'warning');
        return;
    }
    
    // Show loading state
    const resultsDiv = document.getElementById('aiResults');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #667eea;"></i>
            <p style="margin-top: 20px; color: #4a5568;">Searching the web and generating AI solution...</p>
        </div>
    `;
    
    // Call the backend API
    const apiUrl = 'https://ai-business-solution-backend-1.onrender.com'; // Replace with your backend URL
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayAIResults(data.data);
        } else {
            showNotification('Error: ' + data.error, 'error');
            resultsDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #fc8181;">
                    <i class="fas fa-exclamation-circle" style="font-size: 3rem;"></i>
                    <p>Error: ${data.error || 'Failed to get solution'}</p>
                </div>
            `;
        }
    })
    .catch(error => {
        showNotification('Network error: ' + error.message, 'error');
        resultsDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #fc8181;">
                <i class="fas fa-wifi" style="font-size: 3rem;"></i>
                <p>Failed to connect to AI service. Please check your connection.</p>
            </div>
        `;
    });
}

function displayAIResults(data) {
    const resultsDiv = document.getElementById('aiResults');
    
    // Create tabs for different languages
    let html = `
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                <button class="tab-btn active" data-lang="english" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">English</button>
                <button class="tab-btn" data-lang="hindi" style="padding: 10px 20px; background: #e2e8f0; color: #4a5568; border: none; border-radius: 8px; cursor: pointer;">हिंदी</button>
                <button class="tab-btn" data-lang="german" style="padding: 10px 20px; background: #e2e8f0; color: #4a5568; border: none; border-radius: 8px; cursor: pointer;">Deutsch</button>
                <button id="aiBackBtn" style="margin-left: auto; padding: 10px 20px; background: #edf2f7; border: none; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i> Back
                </button>
            </div>
            
            <div id="aiContent" style="max-height: 600px; overflow-y: auto; padding: 10px;">
                <!-- Content will be shown here -->
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f7fafc; border-radius: 8px;">
                <h4>📚 Sources</h4>
                <ul style="list-style: none; padding: 0;">
                    ${data.sources.map(s => `
                        <li style="padding: 5px 0;">
                            <a href="${s.link}" target="_blank" style="color: #667eea; text-decoration: none;">
                                ${s.title} - ${s.source}
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <p style="color: #718096; font-size: 0.8rem; margin-top: 10px;">
                    Generated: ${new Date(data.timestamp).toLocaleString()}
                </p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
    
    // Show English content by default
    showLanguageContent('english', data);
    
    // Add event listeners to tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            if (lang) {
                // Update active tab styling
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.style.background = '#e2e8f0';
                    b.style.color = '#4a5568';
                });
                this.style.background = '#667eea';
                this.style.color = 'white';
                showLanguageContent(lang, data);
            }
        });
    });
    
    // Add back button functionality
    document.getElementById('aiBackBtn').addEventListener('click', function() {
        document.getElementById('aiResults').style.display = 'none';
        document.getElementById('aiResults').innerHTML = '';
    });
}

function showLanguageContent(lang, data) {
    const contentDiv = document.getElementById('aiContent');
    const content = data[lang] || 'Content not available';
    
    // Format the content with markdown-like styling
    let formattedContent = content
        .split('\n')
        .map(line => {
            if (line.startsWith('# ')) {
                return `<h2 style="color: #2d3748; margin: 20px 0 10px 0;">${line.substring(2)}</h2>`;
            } else if (line.startsWith('## ')) {
                return `<h3 style="color: #2d3748; margin: 15px 0 10px 0;">${line.substring(3)}</h3>`;
            } else if (line.startsWith('### ')) {
                return `<h4 style="color: #4a5568; margin: 10px 0 5px 0;">${line.substring(4)}</h4>`;
            } else if (line.match(/^[0-9]+\./)) {
                return `<div style="padding-left: 20px; margin: 5px 0;">${line}</div>`;
            } else if (line.match(/^[-*]\s/)) {
                return `<div style="padding-left: 20px; margin: 5px 0;">${line}</div>`;
            } else if (line.trim() === '') {
                return '<br>';
            } else {
                return `<p style="color: #4a5568; line-height: 1.6; margin: 5px 0;">${line}</p>`;
            }
        })
        .join('\n');
    
    contentDiv.innerHTML = formattedContent;
}
