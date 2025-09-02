// Epic Interview Preparation App - Procedural JavaScript

// Global State Variables
let currentRole = null;
let currentSection = 'dashboard';
let studyTimer = {
    minutes: 0,
    seconds: 0,
    isRunning: false,
    interval: null
};

let progressData = {
    'software-engineer': {
        phase1: 15,
        phase2: 0,
        studyHours: 24,
        completedTasks: 8,
        totalTasks: 25
    },
    'project-manager': {
        phase1: 20,
        phase2: 0,
        studyHours: 18,
        completedTasks: 6,
        totalTasks: 22
    }
};

let achievements = [
    { id: 'first-study', title: 'First Study Session', description: 'Complete your first study session', unlocked: true },
    { id: 'week-complete', title: 'Week Warrior', description: 'Complete a full week of studying', unlocked: false },
    { id: 'cast-freedom', title: 'Cast Freedom', description: 'Cast removal milestone reached', unlocked: false },
    { id: 'phase-master', title: 'Phase Master', description: 'Complete Phase 1', unlocked: false }
];

// Chart instances for cleanup
let weeklyChartInstance = null;
let overallChartInstance = null;

// Initialize the application
function initApp() {
    setupInitialState();
    bindAllEvents();
    showRoleModal();
    updateDashboard();
    populateResources();
}

// Setup initial state of sections
function setupInitialState() {
    const sections = ['dashboard', 'timeline', 'daily', 'practice', 'resources', 'progress'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            if (section === 'dashboard') {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

// Bind all event listeners
function bindAllEvents() {
    bindRoleSelectionEvents();
    bindNavigationEvents();
    bindTimerEvents();
    bindModalEvents();
}

// Role selection events
function bindRoleSelectionEvents() {
    const roleToggle = document.getElementById('roleToggle');
    if (roleToggle) {
        roleToggle.addEventListener('click', (e) => {
            e.preventDefault();
            showRoleModal();
        });
    }

    const partnerMode = document.getElementById('partnerMode');
    if (partnerMode) {
        partnerMode.addEventListener('click', (e) => {
            e.preventDefault();
            setPartnerMode();
        });
    }
    
    // Role cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const role = card.dataset.role;
            selectRole(role);
        });
    });
}

// Navigation events
function bindNavigationEvents() {
    // Action cards navigation
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const section = card.dataset.section;
            if (section) {
                showSection(section);
            }
        });
    });

    // Back buttons
    document.querySelectorAll('button[data-section]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const section = btn.dataset.section;
            if (section) {
                showSection(section);
            }
        });
    });
}

// Timer events
function bindTimerEvents() {
    const startTimer = document.getElementById('startTimer');
    const pauseTimer = document.getElementById('pauseTimer');
    const resetTimer = document.getElementById('resetTimer');
    
    if (startTimer) startTimer.addEventListener('click', startStudyTimer);
    if (pauseTimer) pauseTimer.addEventListener('click', pauseStudyTimer);
    if (resetTimer) resetTimer.addEventListener('click', resetStudyTimer);
    
    // Timer presets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.dataset.minutes || '0');
            setTimerPreset(minutes);
        });
    });
}

// Modal events
function bindModalEvents() {
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideRoleModal();
        });
    }

    const modalBackdrop = document.querySelector('.modal__backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', hideRoleModal);
    }
}

// Show role selection modal
function showRoleModal() {
    const modal = document.getElementById('roleModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Hide role selection modal
function hideRoleModal() {
    const modal = document.getElementById('roleModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Select a role
function selectRole(role) {
    currentRole = role;
    hideRoleModal();
    updateDashboard();
    updateTimeline();
    updatePracticeSection();
    updateTodayTasks();
    updateProgressCharts();
    
    // Update welcome title
    const roleNames = {
        'software-engineer': 'Software Engineer',
        'project-manager': 'Project Manager'
    };
    
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (welcomeTitle && role && roleNames[role]) {
        welcomeTitle.textContent = `Welcome, Future Epic ${roleNames[role]}!`;
    }
}

// Set partner mode
function setPartnerMode() {
    currentRole = 'partner';
    hideRoleModal();
    updateDashboard();
    const welcomeTitle = document.getElementById('welcomeTitle');
    if (welcomeTitle) {
        welcomeTitle.textContent = 'Partner Preparation Dashboard';
    }
}

// Show a specific section
function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    // Hide all sections
    const sections = ['dashboard', 'timeline', 'daily', 'practice', 'resources', 'progress'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        currentSection = sectionName;
        
        // Update section-specific content
        if (sectionName === 'daily') {
            setTimeout(() => updateWeeklyChart(), 150);
        } else if (sectionName === 'progress') {
            setTimeout(() => updateOverallProgressChart(), 150);
        } else if (sectionName === 'timeline') {
            updateTimeline();
        } else if (sectionName === 'practice') {
            updatePracticeSection();
        }
    }
}

// Update dashboard content
function updateDashboard() {
    // Calculate days until milestones
    const currentDate = new Date('2025-09-01');
    const castRemovalDate = new Date('2025-09-29');
    const applicationDate = new Date('2025-12-22');
    
    const daysUntilCast = Math.ceil((castRemovalDate - currentDate) / (1000 * 60 * 60 * 24));
    const daysUntilApplication = Math.ceil((applicationDate - currentDate) / (1000 * 60 * 60 * 24));
    
    const castElement = document.getElementById('daysUntilCast');
    const appElement = document.getElementById('daysUntilApplication');
    
    if (castElement) castElement.textContent = daysUntilCast;
    if (appElement) appElement.textContent = daysUntilApplication;

    // Update phase progress
    const currentPhaseProgress = getCurrentPhaseProgress();
    const progressBar = document.getElementById('phaseProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) progressBar.style.width = `${currentPhaseProgress}%`;
    if (progressText) progressText.textContent = `${currentPhaseProgress}% Complete`;
}

// Get current phase progress percentage
function getCurrentPhaseProgress() {
    const currentDate = new Date('2025-09-01');
    const phase1Start = new Date('2025-09-15');
    const phase1End = new Date('2025-11-10');
    
    if (currentDate < phase1Start) {
        return 0;
    } else if (currentDate <= phase1End) {
        const totalDays = (phase1End - phase1Start) / (1000 * 60 * 60 * 24);
        const elapsedDays = (currentDate - phase1Start) / (1000 * 60 * 60 * 24);
        return Math.max(0, Math.min(100, Math.round((elapsedDays / totalDays) * 100)));
    } else {
        return 100;
    }
}

// Update timeline content based on current role
function updateTimeline() {
    if (!currentRole || currentRole === 'partner') return;
    
    const phases = [
        {
            id: 'phase1Details',
            softwareEngineer: [
                'Software Engineering Fundamentals',
                'Data structures and algorithms theory',
                'Epic company research',
                'Healthcare IT basics',
                'Light coding practice when comfortable'
            ],
            projectManager: [
                'Project Management Concepts',
                'Agile and Scrum methodology',
                'Stakeholder management',
                'Healthcare industry knowledge',
                'Behavioral interview prep'
            ]
        },
        {
            id: 'phase2Details',
            softwareEngineer: [
                'LeetCode Practice (Easy/Medium problems)',
                'Epic-specific coding (4 problems similar to medium difficulty)',
                'System design basics',
                'Mock assessments (3-4 hour timed sessions)',
                'Healthcare application architecture'
            ],
            projectManager: [
                'Case study practice',
                'Healthcare project scenarios',
                'Behavioral interviews',
                'Presentation skills',
                'Epic PM-specific questions'
            ]
        },
        {
            id: 'phase3Details',
            activities: [
                'Submit applications',
                'Complete skills assessments',
                'Prepare for final interviews',
                'Practice mock interviews',
                'Final preparation review'
            ]
        }
    ];

    phases.forEach(phase => {
        const element = document.getElementById(phase.id);
        if (element) {
            let content = '<ul>';
            
            if (phase.id === 'phase3Details') {
                phase.activities.forEach(activity => {
                    content += `<li>${activity}</li>`;
                });
            } else {
                const items = currentRole === 'software-engineer' ? phase.softwareEngineer : phase.projectManager;
                if (items) {
                    items.forEach(item => {
                        content += `<li>${item}</li>`;
                    });
                }
            }
            
            content += '</ul>';
            element.innerHTML = content;
        }
    });
}

// Update practice section based on current role
function updatePracticeSection() {
    if (!currentRole) return;
    
    const practiceContent = document.getElementById('practiceContent');
    if (!practiceContent) return;
    
    if (currentRole === 'software-engineer') {
        practiceContent.innerHTML = getSoftwareEngineerPracticeHTML();
    } else if (currentRole === 'project-manager') {
        practiceContent.innerHTML = getProjectManagerPracticeHTML();
    }
}

// Get practice HTML for software engineers
function getSoftwareEngineerPracticeHTML() {
    return `
        <div class="practice-card">
            <h3>Coding Practice</h3>
            <p>Practice coding problems similar to Epic's assessment</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">12</div>
                    <div class="label">Problems Solved</div>
                </div>
                <div class="practice-stat">
                    <div class="value">3.2</div>
                    <div class="label">Avg Time (min)</div>
                </div>
                <div class="practice-stat">
                    <div class="value">75%</div>
                    <div class="label">Success Rate</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Start Practice Session</button>
        </div>
        
        <div class="practice-card">
            <h3>System Design</h3>
            <p>Study system design concepts for Epic's architecture</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">5</div>
                    <div class="label">Topics Covered</div>
                </div>
                <div class="practice-stat">
                    <div class="value">8</div>
                    <div class="label">Study Hours</div>
                </div>
                <div class="practice-stat">
                    <div class="value">60%</div>
                    <div class="label">Progress</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Study System Design</button>
        </div>
        
        <div class="practice-card">
            <h3>Mock Assessment</h3>
            <p>Simulate Epic's 3-4 hour timed assessment</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">2</div>
                    <div class="label">Completed</div>
                </div>
                <div class="practice-stat">
                    <div class="value">82%</div>
                    <div class="label">Best Score</div>
                </div>
                <div class="practice-stat">
                    <div class="value">3.5h</div>
                    <div class="label">Avg Duration</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Take Mock Assessment</button>
        </div>
    `;
}

// Get practice HTML for project managers
function getProjectManagerPracticeHTML() {
    return `
        <div class="practice-card">
            <h3>Case Studies</h3>
            <p>Practice healthcare project management scenarios</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">4</div>
                    <div class="label">Cases Completed</div>
                </div>
                <div class="practice-stat">
                    <div class="value">15</div>
                    <div class="label">Study Hours</div>
                </div>
                <div class="practice-stat">
                    <div class="value">85%</div>
                    <div class="label">Quality Score</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Start Case Study</button>
        </div>
        
        <div class="practice-card">
            <h3>Behavioral Interviews</h3>
            <p>Practice STAR method and Epic-specific questions</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">18</div>
                    <div class="label">Questions Practiced</div>
                </div>
                <div class="practice-stat">
                    <div class="value">12</div>
                    <div class="label">STAR Examples</div>
                </div>
                <div class="practice-stat">
                    <div class="value">90%</div>
                    <div class="label">Confidence</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Practice Interviews</button>
        </div>
        
        <div class="practice-card">
            <h3>Presentations</h3>
            <p>Develop presentation skills for Epic interviews</p>
            <div class="practice-stats">
                <div class="practice-stat">
                    <div class="value">3</div>
                    <div class="label">Presentations</div>
                </div>
                <div class="practice-stat">
                    <div class="value">6</div>
                    <div class="label">Study Hours</div>
                </div>
                <div class="practice-stat">
                    <div class="value">70%</div>
                    <div class="label">Progress</div>
                </div>
            </div>
            <button class="btn btn--primary btn--full-width">Practice Presentation</button>
        </div>
    `;
}

// Update today's tasks based on current role
function updateTodayTasks() {
    if (!currentRole) return;
    
    const tasksContainer = document.getElementById('todayTasks');
    if (!tasksContainer) return;
    
    const tasks = currentRole === 'software-engineer' ? [
        { id: 1, text: 'Review data structures (Arrays, LinkedLists)', completed: true },
        { id: 2, text: 'Solve 2 LeetCode Easy problems', completed: true },
        { id: 3, text: 'Read Epic company culture page', completed: false },
        { id: 4, text: 'Study healthcare IT basics (30 min)', completed: false },
        { id: 5, text: 'Practice typing exercises', completed: false }
    ] : [
        { id: 1, text: 'Review Agile methodology principles', completed: true },
        { id: 2, text: 'Practice STAR method examples', completed: false },
        { id: 3, text: 'Read healthcare industry trends', completed: false },
        { id: 4, text: 'Prepare stakeholder management case study', completed: false },
        { id: 5, text: 'Review Epic PM job requirements', completed: false }
    ];

    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}"></div>
            <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
        </div>
    `).join('');

    // Add click handlers for checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            const taskId = parseInt(e.target.dataset.taskId);
            toggleTask(taskId);
        });
    });
}

// Toggle task completion
function toggleTask(taskId) {
    const checkbox = document.querySelector(`[data-task-id="${taskId}"]`);
    if (checkbox) {
        const taskText = checkbox.nextElementSibling;
        checkbox.classList.toggle('checked');
        if (taskText) {
            taskText.classList.toggle('completed');
        }
    }
}

// Populate resources sections
function populateResources() {
    const resources = {
        technical: [
            { name: 'LeetCode', url: 'https://leetcode.com', description: 'Coding practice platform', category: 'Coding Practice' },
            { name: 'NeetCode 150', url: 'https://neetcode.io', description: 'Systematic approach to coding patterns', category: 'Coding Practice' },
            { name: 'HackerRank', url: 'https://hackerrank.com', description: 'Additional coding practice', category: 'Coding Practice' }
        ],
        epic: [
            { name: 'Epic Assessment Practice', url: 'https://www.howtoanalyzedata.net/epic-systems-online-assessment-test-questions-and-answers/', description: 'Epic-specific preparation materials', category: 'Assessment Prep' },
            { name: 'Epic Careers', url: 'https://careers.epic.com', description: 'Official Epic careers information', category: 'Company Research' }
        ],
        behavioral: [
            { name: 'STAR Method Guide', description: 'Situation, Task, Action, Result framework', category: 'Interview Prep' },
            { name: 'Epic Values Research', description: 'Innovation, collaboration, customer focus', category: 'Company Culture' }
        ]
    };

    populateResourceSection('technicalResources', resources.technical);
    populateResourceSection('epicResources', resources.epic);
    populateResourceSection('behavioralResources', resources.behavioral);
}

// Populate a specific resource section
function populateResourceSection(containerId, resources) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = resources.map(resource => `
            <div class="resource-item">
                <h3>${resource.name}</h3>
                <p>${resource.description}</p>
                <span class="resource-category-tag">${resource.category}</span>
                ${resource.url ? `<div class="mt-16"><a href="${resource.url}" target="_blank" class="btn btn--outline btn--sm">Visit Resource</a></div>` : ''}
            </div>
        `).join('');
    }
}

// Timer Functions
function startStudyTimer() {
    if (!studyTimer.isRunning) {
        studyTimer.isRunning = true;
        studyTimer.interval = setInterval(() => {
            studyTimer.seconds++;
            if (studyTimer.seconds >= 60) {
                studyTimer.seconds = 0;
                studyTimer.minutes++;
            }
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseStudyTimer() {
    studyTimer.isRunning = false;
    if (studyTimer.interval) {
        clearInterval(studyTimer.interval);
        studyTimer.interval = null;
    }
}

function resetStudyTimer() {
    pauseStudyTimer();
    studyTimer.minutes = 0;
    studyTimer.seconds = 0;
    updateTimerDisplay();
}

function setTimerPreset(minutes) {
    resetStudyTimer();
    studyTimer.minutes = minutes;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutesElement = document.getElementById('timerMinutes');
    const secondsElement = document.getElementById('timerSeconds');
    
    if (minutesElement && secondsElement) {
        const minutesStr = studyTimer.minutes.toString().padStart(2, '0');
        const secondsStr = studyTimer.seconds.toString().padStart(2, '0');
        
        minutesElement.textContent = minutesStr;
        secondsElement.textContent = secondsStr;
    }
}

// Chart Functions
function updateWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
    }

    weeklyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Study Hours',
                data: [1.5, 2, 1, 2, 1.5, 3, 2.5],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4
                }
            }
        }
    });
}

function updateOverallProgressChart() {
    const ctx = document.getElementById('overallProgressChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (overallChartInstance) {
        overallChartInstance.destroy();
    }

    const roleProgress = progressData[currentRole] || progressData['software-engineer'];

    overallChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [roleProgress.completedTasks, roleProgress.totalTasks - roleProgress.completedTasks],
                backgroundColor: ['#1FB8CD', '#ECEBD5'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Update achievements
    updateAchievements();
}

function updateAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    if (achievementsContainer) {
        achievementsContainer.innerHTML = achievements.map(achievement => `
            <div class="achievement-item">
                <div class="achievement-icon ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    ${achievement.unlocked ? '🏆' : '🔒'}
                </div>
                <div class="achievement-text">
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function updateProgressCharts() {
    // Update achievements when called from role selection
    updateAchievements();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);