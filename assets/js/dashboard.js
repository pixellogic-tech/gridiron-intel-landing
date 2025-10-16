// ========================================
// GRIDIRON INTEL - Dashboard System
// ========================================

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('gridiron_token');
    const userStr = localStorage.getItem('gridiron_user');
    
    if (!token || !userStr) {
        // Not logged in, redirect to landing page
        window.location.href = 'index.html';
        return null;
    }
    
    return JSON.parse(userStr);
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user) return;
    
    // Set user information
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = user.role === 'master_admin' ? 'Master Admin' : 'Head Coach';
    document.getElementById('coachName').textContent = user.name.split(' ')[0];
    
    // Initialize data
    initializeDashboard();
    loadPlayers();
    loadFilms();
    loadSchedule();
    createCharts();
    loadRecentActivity();
});

// Initialize Dashboard Data
function initializeDashboard() {
    // Load saved data or create defaults
    const dashboardData = localStorage.getItem('gridiron_dashboard');
    if (!dashboardData) {
        const defaultData = {
            players: [],
            films: [],
            schedule: [],
            settings: {
                schoolName: 'Demo High School',
                teamName: 'Eagles',
                season: '2024'
            }
        };
        localStorage.setItem('gridiron_dashboard', JSON.stringify(defaultData));
    }
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    // Update title
    const titles = {
        'overview': 'Dashboard Overview',
        'players': 'Team Roster',
        'films': 'Film Room',
        'predictions': 'AI Predictions',
        'tendencies': 'Opponent Tendencies',
        'schedule': 'Season Schedule',
        'settings': 'Settings'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionName] || 'Dashboard';
}

// ========================================
// PLAYERS MANAGEMENT
// ========================================

function loadPlayers() {
    const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
    const players = data.players || [];
    
    // Update player count
    document.getElementById('playerCount').textContent = players.length;
    document.getElementById('totalPlayers').textContent = players.length;
    
    // Display players
    const grid = document.getElementById('playersGrid');
    if (grid) {
        grid.innerHTML = players.map(player => `
            <div class="player-card">
                <div class="player-number">#${player.jerseyNumber}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
                ${player.email ? `<div class="player-email">${player.email}</div>` : ''}
            </div>
        `).join('');
    }
}

function showAddPlayerModal() {
    document.getElementById('addPlayerModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function addPlayer(event) {
    event.preventDefault();
    
    const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
    const players = data.players || [];
    
    const newPlayer = {
        id: Date.now(),
        name: document.getElementById('playerName').value,
        jerseyNumber: document.getElementById('jerseyNumber').value,
        position: document.getElementById('playerPosition').value,
        email: document.getElementById('playerEmail').value,
        inviteCode: generateInviteCode(),
        status: 'pending'
    };
    
    players.push(newPlayer);
    data.players = players;
    localStorage.setItem('gridiron_dashboard', JSON.stringify(data));
    
    // Clear form
    event.target.reset();
    closeModal('addPlayerModal');
    
    // Reload players
    loadPlayers();
    
    // Show success message
    showNotification(`Player ${newPlayer.name} added successfully! Invite code: ${newPlayer.inviteCode}`);
}

function generateInviteCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ========================================
// FILMS MANAGEMENT
// ========================================

function loadFilms() {
    const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
    const films = data.films || [];
    
    document.getElementById('totalFilms').textContent = films.length;
    
    const filmsList = document.getElementById('filmsList');
    if (filmsList) {
        if (films.length === 0) {
            filmsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fas fa-film" style="font-size: 3rem; margin-bottom: 20px;"></i>
                    <p>No films uploaded yet</p>
                    <button class="btn-primary" onclick="showUploadModal()" style="margin-top: 20px;">
                        Upload Your First Film
                    </button>
                </div>
            `;
        } else {
            filmsList.innerHTML = films.map(film => `
                <div class="film-item">
                    <div class="film-info">
                        <h4>${film.opponent}</h4>
                        <p>Uploaded: ${new Date(film.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <button class="btn-analyze">Analyze</button>
                </div>
            `).join('');
        }
    }
}

function showUploadModal() {
    // Simulate film upload
    const opponent = prompt('Enter opponent team name:');
    if (opponent) {
        const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
        const films = data.films || [];
        
        films.push({
            id: Date.now(),
            opponent: opponent,
            uploadDate: new Date().toISOString(),
            status: 'processing'
        });
        
        data.films = films;
        localStorage.setItem('gridiron_dashboard', JSON.stringify(data));
        
        loadFilms();
        showNotification(`Film for ${opponent} uploaded successfully!`);
    }
}

// ========================================
// AI PREDICTIONS
// ========================================

function generatePrediction() {
    const down = document.getElementById('predDown').value;
    const distance = document.getElementById('predDistance').value;
    const fieldPos = document.getElementById('predFieldPos').value;
    
    // Simulate AI prediction
    const plays = ['Run Left', 'Run Right', 'Pass Short', 'Pass Deep', 'Screen Pass', 'Play Action'];
    const formations = ['I-Formation', 'Shotgun', 'Pistol', 'Spread'];
    
    const prediction = {
        play: plays[Math.floor(Math.random() * plays.length)],
        formation: formations[Math.floor(Math.random() * formations.length)],
        confidence: Math.floor(Math.random() * 30) + 70
    };
    
    const resultDiv = document.getElementById('predictionResult');
    resultDiv.innerHTML = `
        <h3>🎯 AI Prediction</h3>
        <div class="prediction-card">
            <div class="prediction-main">
                <div class="prediction-play">${prediction.play}</div>
                <div class="prediction-formation">Formation: ${prediction.formation}</div>
                <div class="prediction-confidence">
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${prediction.confidence}%"></div>
                    </div>
                    <span>${prediction.confidence}% Confidence</span>
                </div>
            </div>
            <div class="prediction-details">
                <h4>Key Indicators:</h4>
                <ul>
                    <li>Down & Distance tendency: 73% similar plays</li>
                    <li>Formation recognition: ${prediction.formation} used 65% in this situation</li>
                    <li>Personnel grouping suggests ${prediction.play.includes('Run') ? 'run' : 'pass'}</li>
                </ul>
            </div>
        </div>
    `;
    resultDiv.style.display = 'block';
}

// ========================================
// SCHEDULE
// ========================================

function loadSchedule() {
    const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
    const schedule = data.schedule || [];
    
    const scheduleList = document.getElementById('scheduleList');
    if (scheduleList) {
        if (schedule.length === 0) {
            scheduleList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8;">
                    <p>No games scheduled</p>
                    <button class="btn-primary" onclick="addGame()" style="margin-top: 20px;">
                        Add First Game
                    </button>
                </div>
            `;
        } else {
            scheduleList.innerHTML = schedule.map(game => `
                <div class="schedule-item">
                    <div class="game-date">${new Date(game.date).toLocaleDateString()}</div>
                    <div class="game-info">
                        <h4>${game.homeAway === 'home' ? 'vs' : '@'} ${game.opponent}</h4>
                        <p>${game.time}</p>
                    </div>
                </div>
            `).join('');
        }
    }
}

function addGame() {
    const opponent = prompt('Enter opponent team name:');
    if (opponent) {
        const date = prompt('Enter game date (MM/DD/YYYY):');
        const time = prompt('Enter game time:');
        const homeAway = confirm('Is this a home game?') ? 'home' : 'away';
        
        const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
        const schedule = data.schedule || [];
        
        schedule.push({
            id: Date.now(),
            opponent: opponent,
            date: date,
            time: time,
            homeAway: homeAway
        });
        
        data.schedule = schedule;
        localStorage.setItem('gridiron_dashboard', JSON.stringify(data));
        
        loadSchedule();
        showNotification(`Game vs ${opponent} added to schedule!`);
    }
}

// ========================================
// CHARTS
// ========================================

function createCharts() {
    // Tendency Chart
    const tendencyCtx = document.getElementById('tendencyChart');
    if (tendencyCtx) {
        new Chart(tendencyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Run', 'Pass', 'Play Action', 'Screen'],
                datasets: [{
                    data: [35, 45, 15, 5],
                    backgroundColor: [
                        'rgba(74, 222, 128, 0.8)',
                        'rgba(96, 165, 250, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Film Hours',
                    data: [2, 3, 1, 4, 2, 5, 3],
                    borderColor: 'rgba(74, 222, 128, 1)',
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// ========================================
// RECENT ACTIVITY
// ========================================

function loadRecentActivity() {
    const activities = [
        {
            icon: 'fa-user-plus',
            title: 'New player added',
            time: '2 hours ago',
            color: '#4ade80'
        },
        {
            icon: 'fa-film',
            title: 'Film uploaded: vs Lincoln High',
            time: '5 hours ago',
            color: '#60a5fa'
        },
        {
            icon: 'fa-chart-line',
            title: 'Tendency report generated',
            time: '1 day ago',
            color: '#f59e0b'
        }
    ];
    
    const activityList = document.getElementById('activityList');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${activity.color};">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-details">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
}

// ========================================
// SETTINGS
// ========================================

function saveSettings() {
    const data = JSON.parse(localStorage.getItem('gridiron_dashboard') || '{}');
    
    data.settings = {
        schoolName: document.getElementById('schoolName').value,
        teamName: document.getElementById('teamName').value,
        coachName: document.getElementById('coachNameSetting').value,
        email: document.getElementById('coachEmail').value
    };
    
    localStorage.setItem('gridiron_dashboard', JSON.stringify(data));
    showNotification('Settings saved successfully!');
}

// ========================================
// UTILITIES
// ========================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #16a34a, #10b981);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s;
        z-index: 10000;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('gridiron_token');
        localStorage.removeItem('gridiron_user');
        window.location.href = 'index.html';
    }
}

// Window click handler for modals
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .prediction-card {
        background: rgba(30, 41, 59, 0.5);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 25px;
        margin-top: 20px;
    }
    
    .prediction-play {
        font-size: 2rem;
        font-weight: bold;
        color: #4ade80;
        margin-bottom: 10px;
    }
    
    .prediction-formation {
        font-size: 1.2rem;
        color: #60a5fa;
        margin-bottom: 20px;
    }
    
    .confidence-bar {
        width: 100%;
        height: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .confidence-fill {
        height: 100%;
        background: linear-gradient(90deg, #16a34a, #4ade80);
        transition: width 0.5s;
    }
    
    .prediction-details {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .prediction-details ul {
        list-style: none;
        padding: 0;
        margin-top: 10px;
    }
    
    .prediction-details li {
        padding: 8px 0;
        color: #94a3b8;
    }
`;
document.head.appendChild(style);
