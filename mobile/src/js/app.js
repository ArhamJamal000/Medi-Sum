/**
 * Medi-Sum Mobile App - Main Application
 */

import { api } from './api.js';

// Capacitor imports (will be available when running in native context)
let Camera, CameraResultType, CameraSource;
let PushNotifications;
let Preferences;

// Try to load Capacitor plugins
async function loadCapacitorPlugins() {
    try {
        const cameraModule = await import('@capacitor/camera');
        Camera = cameraModule.Camera;
        CameraResultType = cameraModule.CameraResultType;
        CameraSource = cameraModule.CameraSource;
    } catch (e) {
        console.log('Camera plugin not available (running in browser)');
    }

    try {
        const pushModule = await import('@capacitor/push-notifications');
        PushNotifications = pushModule.PushNotifications;
    } catch (e) {
        console.log('Push plugin not available');
    }

    try {
        const prefsModule = await import('@capacitor/preferences');
        Preferences = prefsModule.Preferences;
    } catch (e) {
        console.log('Preferences plugin not available');
    }
}

// App State
const state = {
    currentPage: 'dashboard',
    user: null,
    dashboardData: null,
    prescriptions: [],
    timelineEvents: [],
    isLoading: false
};

// DOM Elements
// DOM Elements - Initialized in initApp
const elements = {
    app: null,
    loading: null,
    authContainer: null,
    mainContainer: null,
    mainContent: null,
    loginView: null,
    registerView: null,
    loginForm: null,
    registerForm: null,
    bottomNav: null,
    toastContainer: null
};

// Initialize Elements
function initElements() {
    elements.app = document.getElementById('app');
    elements.loading = document.getElementById('loading');
    elements.authContainer = document.getElementById('auth-container');
    elements.mainContainer = document.getElementById('main-container');
    elements.mainContent = document.getElementById('main-content');
    elements.loginView = document.getElementById('login-view');
    elements.registerView = document.getElementById('register-view');
    elements.loginForm = document.getElementById('login-form');
    elements.registerForm = document.getElementById('register-form');
    elements.bottomNav = document.querySelector('.bottom-nav');
    elements.toastContainer = document.getElementById('toast-container');

    // Safety check
    Object.entries(elements).forEach(([key, el]) => {
        if (!el && key !== 'bottomNav') console.error(`Element not found: ${key}`);
    });
}

// ============== Toast Notifications ==============
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============== Navigation ==============
function navigate(page) {
    state.currentPage = page;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Render page content
    renderPage(page);
}

// ============== Page Rendering ==============
async function renderPage(page) {
    // Trigger snappy animation by re-adding the element
    elements.mainContent.style.animation = 'none';
    elements.mainContent.offsetHeight; // Force reflow
    elements.mainContent.style.animation = 'pageSlideIn 0.2s ease-out';

    elements.mainContent.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';

    try {
        switch (page) {
            case 'dashboard':
                await renderDashboard();
                break;
            case 'scan':
                renderScan();
                break;
            case 'pharma':
                await renderPharmaAssist();
                break;
            case 'timeline':
                await renderTimeline();
                break;
            case 'profile':
                renderProfile();
                break;
            default:
                await renderDashboard();
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function renderDashboard() {
    app.currentPage = 'dashboard';

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector('.nav-item[data-page="dashboard"]');
    if (navItem) navItem.classList.add('active');

    // Safety check for API
    let data;
    try {
        data = await api.getDashboard();
    } catch (e) {
        console.error("Dashboard API Error:", e);
        data = { stats: { medicines: 0, tests: 0, prescriptions: 0, reports: 0 }, recent: [], todays_medication: [] };
    }
    state.dashboardData = data;

    // Process Meds for Timeline
    const meds = data.todays_medication || [];
    const timeline = {
        morning: meds.filter(m => (m.timing || '').toLowerCase().match(/morning|breakfast|am/) || !m.timing),
        afternoon: meds.filter(m => (m.timing || '').toLowerCase().match(/afternoon|lunch|day/)),
        night: meds.filter(m => (m.timing || '').toLowerCase().match(/night|dinner|bed|evening|pm/))
    };

    // Helper to render dots
    const renderDots = (list) => {
        if (!list || list.length === 0) return '<div class="med-dot" style="opacity: 0.3;"></div>';
        return list.map(m => `<div class="med-dot ${m.status === 'taken' ? 'active' : 'active'}" style="background: ${m.status === 'taken' ? 'var(--color-neon-mint)' : 'var(--color-electric-cyan)'}"></div>`).join('');
    };

    // Basic layout
    elements.mainContent.innerHTML = `
        <header class="dashboard-header animate-fade-in">
            <div>
                <h1 class="greeting">Hello, ${state.user ? state.user.name.split(' ')[0] : 'User'} 👋</h1>
            </div>
            <div style="display: flex; gap: 12px;">
                <button class="icon-btn" style="background: white; border: none; padding: 8px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); color: var(--color-text-primary);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </button>
                <div class="user-avatar" onclick="navigate('profile')" style="margin: 0;">
                    ${state.user && state.user.photo_url ? `<img src="${state.user.photo_url}" />` : (state.user ? state.user.name.charAt(0) : 'U')}
                </div>
            </div>
        </header>

        <!-- Stats Row (v1.3 Premium) -->
        <div class="dashboard-stats animate-fade-in stagger-1">
            <div class="stat-card-white" onclick="navigate('timeline', 'medicine')">
                <div style="font-size: 24px; margin-bottom: 4px;">💊</div>
                <div class="stat-value">${data.stats.medicines}</div>
                <div class="stat-label">Meds</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'test')">
                <div style="font-size: 24px; margin-bottom: 4px;">🧪</div>
                <div class="stat-value">${data.stats.tests}</div>
                <div class="stat-label">Tests</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'prescription')">
                <div style="font-size: 24px; margin-bottom: 4px;">📝</div>
                <div class="stat-value">${data.stats.prescriptions}</div>
                <div class="stat-label">Rx</div>
            </div>
            <div class="stat-card-white" onclick="navigate('timeline', 'report')">
                <div style="font-size: 24px; margin-bottom: 4px;">📄</div>
                <div class="stat-value">${data.stats.reports}</div>
                <div class="stat-label">Reports</div>
            </div>
        </div>

        <!-- Scan Banner -->
        <div class="scan-banner animate-fade-in stagger-2" onclick="app.setScanMode('prescription'); navigate('upload')">
            <div class="scan-banner-content">
                <div class="scan-banner-title">Scan Prescription</div>
                <div class="scan-banner-subtitle">Take a photo or upload from gallery</div>
            </div>
            <div class="scan-banner-icon">
                ➜
            </div>
        </div>

        <!-- Today's Medication Section -->
        <div class="card animate-fade-in-up stagger-3" style="margin-bottom: var(--space-lg);">
            <div class="card-header">
                <h2 class="card-title">Today's Medications</h2>
            </div>
            
            <div class="meds-timeline">
                <div class="med-time-col">
                    <div class="med-time-label">Morning</div>
                    <div class="med-dots">${renderDots(timeline.morning)}</div>
                </div>
                <div class="med-time-col">
                    <div class="med-time-label">Afternoon</div>
                    <div class="med-dots">${renderDots(timeline.afternoon)}</div>
                </div>
                <div class="med-time-col">
                    <div class="med-time-label">Night</div>
                    <div class="med-dots">${renderDots(timeline.night)}</div>
                </div>
            </div>
            
             <div style="padding: 12px; border-top: 1px solid var(--color-bg-elevated);">
                <button class="btn-primary" onclick="app.showChat('What medicines should I take today?')" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                     Ask AI Assistant 🤖
                </button>
            </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="card animate-fade-in-up stagger-4">
             <div class="card-header" style="justify-content: space-between; display: flex;">
                <h2 class="card-title">Recent Activity</h2>
                <button onclick="navigate('timeline')" style="border: none; background: none; color: var(--color-primary); font-size: 13px; font-weight: 600;">View All</button>
            </div>
            ${data.recent.length > 0 ? data.recent.map(p => `
                <div class="list-item" onclick="app.viewPrescription(${p.id})">
                    <div class="list-icon" style="background: ${p.type === 'report' ? 'rgba(79, 172, 254, 0.1)' : 'rgba(0, 242, 254, 0.1)'}; color: var(--color-primary);">
                        ${p.type === 'report' ? '📄' : '🏥'}
                    </div>
                    <div class="list-content">
                        <div class="list-title">${p.title}</div>
                        <div class="list-subtitle">${p.date || p.upload_date?.split('T')[0] || 'No date'}</div>
                    </div>
                </div>
            `).join('') : '<div class="empty-state"><p>No recent activity</p></div>'}
        </div>
    `;

    // Call Vitals Chart Render
    if (window.Chart) {
        setTimeout(() => { if (typeof renderVitalsPreview === 'function') renderVitalsPreview(); }, 100);
    }
}





function renderScan() {
    // Current mode state
    app.scanMode = app.scanMode || 'prescription';

    // Feather Icons
    const icons = {
        camera: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>',
        image: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
        clipboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        fileText: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
    };

    elements.mainContent.innerHTML = `
            < div class= "scan-container" >
            <h1 class="scan-title">${app.scanMode === 'prescription' ? 'Scan Prescription' : 'Scan Lab Report'}</h1>
            
            <!--Tab Selector-- >
            <div class="tab-selector">
                <button class="tab-item ${app.scanMode === 'prescription' ? 'active' : ''}" onclick="app.setScanMode('prescription')">
                    ${icons.clipboard} Prescription
                </button>
                <button class="tab-item ${app.scanMode === 'report' ? 'active' : ''}" onclick="app.setScanMode('report')">
                    ${icons.fileText} Lab Report
                </button>
            </div>
            
            <p class="scan-instructions">
                ${app.scanMode === 'prescription'
            ? 'Take a clear photo of your prescription to extract medicines and dosages.'
            : 'Capture your lab report to analyze test results.'}
            </p>
            
            <!--Main Scan Button-- >
            <button class="scan-button" id="camera-btn">
                ${icons.camera}
            </button>

            <!--Action Buttons-- >
            <div style="display: flex; gap: var(--space-md); width: 100%; max-width: 320px;">
                <button class="btn-primary" id="take-photo-btn" style="flex: 1;">
                    ${icons.camera} Take Photo
                </button>
                <button class="btn-secondary" id="pick-photo-btn" style="flex: 1;">
                    ${icons.image || icons.camera} Gallery
                </button>
            </div>
            
            <!--Tips Section-- >
            <div class="scan-tips">
                <div class="scan-tips-title">💡 Tips for best results</div>
                <div class="scan-tips-list">
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${icons.sun}</span>
                        <span>Good lighting, avoid shadows</span>
                    </div>
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${icons.fileText}</span>
                        <span>Place on flat surface</span>
                    </div>
                    <div class="scan-tip">
                        <span class="scan-tip-icon">${icons.eye}</span>
                        <span>All text should be visible</span>
                    </div>
                </div>
            </div>
            
            <!--Fallback file input for web-- >
            <input type="file" id="file-input" accept="image/*,.pdf" style="display: none;">
            </div>
    `;

    // Camera button handlers
    document.getElementById('camera-btn').addEventListener('click', () => capturePhoto('camera'));
    document.getElementById('take-photo-btn').addEventListener('click', () => capturePhoto('camera'));
    document.getElementById('pick-photo-btn').addEventListener('click', () => capturePhoto('gallery'));

    // File input fallback
    document.getElementById('file-input').addEventListener('change', handleFileSelect);
}



async function capturePhoto(source) {
    if (Camera) {
        // Native camera via Capacitor
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: true,
                resultType: CameraResultType.Base64,
                source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos
            });

            if (app.scanMode === 'report') {
                await uploadReport(image.base64String);
            } else {
                await uploadPrescription(image.base64String);
            }
        } catch (error) {
            if (error.message !== 'User cancelled photos app') {
                showToast('Camera error: ' + error.message, 'error');
            }
        }
    } else {
        // Web fallback - use file input
        document.getElementById('file-input').click();
    }
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1];
        if (app.scanMode === 'report') {
            await uploadReport(base64);
        } else {
            await uploadPrescription(base64);
        }
    };
    reader.readAsDataURL(file);
}

async function uploadPrescription(base64Image) {
    // Show upload animation with new design
    elements.mainContent.innerHTML = `
            < div class= "processing-container" >
            <div class="processing-ring">
                <svg viewBox="0 0 100 100">
                    <circle class="bg" cx="50" cy="50" r="45"></circle>
                    <circle class="progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px;">📤</div>
            </div>
            <h2 class="processing-text">Analyzing Prescription...</h2>
            <p class="processing-subtext">AI is extracting medicines and dosages</p>
        </div >
            `;

    try {
        const result = await api.uploadPrescription(base64Image);

        // Show success animation
        elements.mainContent.innerHTML = `
            < div class="success-container" >
                <div class="success-icon">✅</div>
                <h2 class="success-title">Upload Successful!</h2>
                <p class="success-subtitle">Opening your prescription...</p>
            </div >
            `;

        // Wait a moment then navigate to the prescription
        setTimeout(() => {
            if (result.id) {
                app.viewPrescription(result.id);
            } else {
                navigate('dashboard');
            }
        }, 1500);

    } catch (error) {
        // Show error animation
        elements.mainContent.innerHTML = `
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px;">❌</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-soft-crimson);">Upload Failed</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">${error.message}</p>
                <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-lg);">Try Again</button>
            </div >
            `;
    }
}

async function uploadReport(base64Image) {
    // Show upload animation with extraction hint
    elements.mainContent.innerHTML = `
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
            <div class="upload-animation">
                <svg viewBox="0 0 100 100" width="100" height="100">
                    <circle cx="50" cy="50" r="40" stroke="var(--color-neon-mint)" stroke-width="4" fill="none" stroke-dasharray="251" stroke-dashoffset="251">
                        <animate attributeName="stroke-dashoffset" values="251;0" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <text x="50" y="55" text-anchor="middle" fill="var(--color-neon-mint)" font-size="24">🧪</text>
                </svg>
            </div>
            <h2 style="margin-top: var(--space-lg); animation: pulse 1.5s infinite;">Analyzing Report...</h2>
            <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">Extracting test results</p>
        </div >
            <style>
                @keyframes pulse {0 %, 100 % { opacity: 1; } 50% {opacity: 0.5; } }
            </style>
        `;

    try {
        const result = await api.uploadReport(base64Image);

        // Show success animation
        elements.mainContent.innerHTML = `
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px; animation: bounceIn 0.5s;">✨</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-neon-mint);">Analysis Complete!</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">Report saved</p>
            </div >
            <style>
                @keyframes bounceIn {0 % { transform: scale(0); } 50% {transform: scale(1.2); } 100% {transform: scale(1); } }
            </style>
        `;

        // Wait a moment then navigate to vitals or dashboard
        setTimeout(() => {
            // navigate('vitals'); // Or navigate to report view if created
            navigate('dashboard'); // For now back to dashboard
            showToast('Report uploaded: ' + result.summary.substring(0, 30) + '...', 'success');
        }, 1500);

    } catch (error) {
        // Show error animation
        elements.mainContent.innerHTML = `
            < div style = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;" >
                <div style="font-size: 80px;">❌</div>
                <h2 style="margin-top: var(--space-lg); color: var(--color-soft-crimson);">Analysis Failed</h2>
                <p style="color: var(--color-text-muted); margin-top: var(--space-sm);">${error.message}</p>
                <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-lg);">Try Again</button>
            </div >
            `;
    }
}

async function renderTimeline(filter = 'all') {
    // Store current filter
    app.timelineFilter = filter;

    // Feather Icons
    const icons = {
        clipboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        fileText: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        thermometer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>',
        calendar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    };

    const data = await api.getTimeline(1, 50, filter);
    state.timelineEvents = data.events;

    // Tab selector HTML
    const tabsHtml = `
            < div class="tab-selector" >
            <button class="tab-btn ${filter === 'all' ? 'active' : ''}" onclick="app.filterTimeline('all')">
                ${icons.calendar} All
            </button>
            <button class="tab-btn ${filter === 'prescription' ? 'active' : ''}" onclick="app.filterTimeline('prescription')">
                ${icons.clipboard} Rx
            </button>
            <button class="tab-btn ${filter === 'report' ? 'active' : ''}" onclick="app.filterTimeline('report')">
                ${icons.fileText} Reports
            </button>
            <button class="tab-btn ${filter === 'test' ? 'active' : ''}" onclick="app.filterTimeline('test')">
                ${icons.thermometer} Tests
            </button>
        </div >
            `;

    if (data.events.length === 0) {
        elements.mainContent.innerHTML = `
            < h1 style = "margin-bottom: var(--space-md);" > Timeline</h1 >
                ${tabsHtml}
        <div class="empty-state">
            <div style="margin-bottom: 16px; color: var(--color-text-muted); display: flex; justify-content: center;">
                <div style="width: 48px; height: 48px;">${filter === 'report' ? icons.fileText.replace('width="20"', 'width="100%"').replace('height="20"', 'height="100%"') : filter === 'test' ? icons.thermometer.replace('width="20"', 'width="100%"').replace('height="20"', 'height="100%"') : icons.clipboard.replace('width="20"', 'width="100%"').replace('height="20"', 'height="100%"')}</div>
            </div>
            <p>No ${filter === 'all' ? 'records' : filter + 's'} yet</p>
            <p style="font-size: var(--font-size-sm); margin-top: 8px;">Upload prescriptions or reports to see them here</p>
        </div>
        `;
        return;
    }

    // Group events by month
    const grouped = {};
    data.events.forEach(event => {
        const date = event.date ? new Date(event.date) : new Date();
        const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!grouped[monthKey]) grouped[monthKey] = [];
        grouped[monthKey].push(event);
    });

    let html = `< h1 style = "margin-bottom: var(--space-md);" > Timeline</h1 > ${tabsHtml} `;

    for (const [month, events] of Object.entries(grouped)) {
        html += `
            < div class="timeline-section" >
                <div class="timeline-header">${month}</div>
                ${events.map(event => `
                    <div class="timeline-item" onclick="app.${event.type === 'report' ? 'viewReport' : 'viewPrescription'}(${event.id})">
                        <div class="timeline-dot ${event.type}"></div>
                        <div class="card timeline-card">
                            <div class="timeline-card-header">
                                <span class="list-title">${event.title}</span>
                                <span class="badge ${event.type}">${event.type === 'report' ? icons.fileText : icons.clipboard} <span style="position: relative; top: -2px;">${event.type === 'report' ? 'Report' : 'Rx'}</span></span>
                            </div>
                            <div class="list-subtitle">${event.summary || 'No summary'}</div>
                            ${event.type === 'prescription' ? `
                                <div class="timeline-stats">
                                    <span style="display: inline-flex; align-items: center; gap: 4px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> ${event.medicine_count || 0} meds</span>
                                    <span style="display: inline-flex; align-items: center; gap: 4px; margin-left: 12px;">${icons.thermometer.replace('width="20"', 'width="14"').replace('height="20"', 'height="14"')} ${event.test_count || 0} tests</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')
            }
            </div >
            `;
    }

    elements.mainContent.innerHTML = html;
}

async function renderPharmaAssist() {
    try {
        const data = await api.getPharmaAssist();

        let html = `
            < div style = "margin-bottom: var(--space-lg);" >
                <h1 style="margin-bottom: 2px;">Pharma Assist 💊</h1>
                <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Find affordable alternatives</p>
            </div >
            `;

        if (data.medicines && data.medicines.length > 0) {
            html += `
            < div class="card" style = "margin-bottom: var(--space-lg);" >
                    <h2 class="card-title" style="margin-bottom: var(--space-md);">Your Medicines</h2>
                    <p style="margin-bottom: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Select a medicine to compare prices and find generic alternatives.</p>
                    
                    ${data.medicines.map(m => `
                        <div class="list-item" onclick="app.compareMedicine('${m.name}')">
                            <div class="list-icon" style="background: rgba(0, 255, 163, 0.1); color: var(--color-neon-mint);">💊</div>
                            <div class="list-content">
                                <div class="list-title">${m.name}</div>
                                <div class="list-subtitle">${m.dosage || ''} ${m.frequency || ''}</div>
                            </div>
                            <div style="color: var(--color-electric-cyan);">Compare →</div>
                        </div>
                    `).join('')
                }
                </div >
            `;
        } else {
            html += `
            < div class="empty-state" >
                    <p>No medicines found in your prescriptions.</p>
                    <p>Upload a prescription to get started.</p>
                    <button class="btn-primary" onclick="navigate('scan')" style="margin-top: var(--space-md);">Scan Prescription</button>
                </div >
            `;
        }

        html += `
            < div class="card" >
                <h2 class="card-title" style="margin-bottom: var(--space-md);">Search Medicine</h2>
                <form id="pharma-search-form" style="display: flex; gap: var(--space-sm);">
                    <input type="text" id="pharma-search-input" placeholder="e.g. Paracetamol" required style="flex: 1;">
                    <button type="submit" class="btn-primary" style="width: auto; padding: 0 var(--space-lg);">🔍</button>
                </form>
            </div >
            `;

        elements.mainContent.innerHTML = html;

        document.getElementById('pharma-search-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('pharma-search-input').value.trim();
            if (query) app.compareMedicine(query);
        });

    } catch (error) {
        showToast('Failed to load medicines: ' + error.message, 'error');
        navigate('dashboard');
    }
}

function renderProfile() {
    const user = state.user || JSON.parse(localStorage.getItem('user') || '{}');
    const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

    elements.mainContent.innerHTML = `
            < div class="profile-header" >
            <div class="avatar">${initials}</div>
            <div class="profile-name">${user.name || 'User'}</div>
            <div class="profile-email">${user.email || ''}</div>
        </div >

            <div class="card">
                <div class="menu-item" onclick="app.navigateTo('vitals')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <span>Health Vitals</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item" onclick="app.navigateTo('chat')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>AI Assistant</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item" onclick="app.openSettings()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Settings</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                <div class="menu-item logout-btn" onclick="app.logout()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log Out</span>
                </div>
            </div>
        `;
}

// ============== Auth Handlers ==============
function setupAuthHandlers() {
    // Toggle between login/register
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        elements.loginView.classList.add('hidden');
        elements.registerView.classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        elements.registerView.classList.add('hidden');
        elements.loginView.classList.remove('hidden');
    });

    // Login form
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const btn = elements.loginForm.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Logging in...';

            const data = await api.login(email, password);
            state.user = data.user;
            showMainApp();
            showToast(`Welcome back, ${data.user.name} !`, 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            const btn = elements.loginForm.querySelector('button');
            btn.disabled = false;
            btn.textContent = 'Log In';
        }
    });

    // Register form
    elements.registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const btn = elements.registerForm.querySelector('button');
            btn.disabled = true;
            btn.textContent = 'Creating account...';

            const data = await api.register(name, email, password);
            state.user = data.user;
            showMainApp();
            showToast('Account created successfully!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            const btn = elements.registerForm.querySelector('button');
            btn.disabled = false;
            btn.textContent = 'Create Account';
        }
    });
}

// ============== Navigation Handlers ==============
function setupNavigation() {
    elements.bottomNav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(item.dataset.page);
        });
    });
}

// ============== App Display ==============
function showAuthScreen() {
    if (elements.loading) elements.loading.classList.add('hidden');
    if (elements.mainContainer) elements.mainContainer.classList.add('hidden');
    if (elements.authContainer) elements.authContainer.classList.remove('hidden');
}

function showMainApp() {
    if (elements.loading) elements.loading.classList.add('hidden');
    if (elements.authContainer) elements.authContainer.classList.add('hidden');
    if (elements.mainContainer) elements.mainContainer.classList.remove('hidden');
    navigate('dashboard');
}

// ============== Global App Object for onclick handlers ==============
window.app = {
    viewPrescription: async (id) => {
        elements.mainContent.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';

        try {
            const p = await api.getPrescription(id);

            let html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >

            <h1 style="margin-bottom: var(--space-lg);">Prescription #${p.id}</h1>
        `;

            // AI Summaries
            if (p.patient_summary || p.doctor_summary) {
                html += `
            < div class="card" style = "border-left: 4px solid var(--color-neon-mint);" >
                <h2 style="margin-bottom: var(--space-md);">📋 AI Summary</h2>
                        ${p.patient_summary ? `
                            <div style="padding: var(--space-md); background: rgba(0, 255, 163, 0.1); border-radius: var(--radius-md); margin-bottom: var(--space-sm);">
                                <strong style="color: var(--color-neon-mint);">For Patient:</strong>
                                <p style="margin-top: var(--space-xs); color: var(--color-text-secondary);">${p.patient_summary}</p>
                            </div>
                        ` : ''
                    }
                        ${p.doctor_summary ? `
                            <div style="padding: var(--space-md); background: rgba(0, 229, 255, 0.1); border-radius: var(--radius-md);">
                                <strong style="color: var(--color-electric-cyan);">Clinical Summary:</strong>
                                <p style="margin-top: var(--space-xs); color: var(--color-text-secondary);">${p.doctor_summary}</p>
                            </div>
                        ` : ''
                    }
                    </div >
            `;
            }

            // Medicines Table
            if (p.medicines && p.medicines.length > 0) {
                html += `
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">💊 Medicines (${p.medicines.length})</h2>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
                                <thead>
                                    <tr style="background: var(--color-bg-elevated);">
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Medicine</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Dosage</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Frequency</th>
                                        <th style="padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--color-border);">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${p.medicines.map(med => `
                                        <tr>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border); font-weight: 600; color: var(--color-electric-cyan);">${med.name}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${med.dosage || '-'}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${med.frequency || '-'}</td>
                                            <td style="padding: var(--space-sm); border-bottom: 1px solid var(--color-border);">${med.duration || '-'}</td>
                                        </tr>
                                        ${med.timing ? `
                                            <tr>
                                                <td colspan="4" style="padding: var(--space-xs) var(--space-sm); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                                    ⏰ ${med.timing}
                                                </td>
                                            </tr>
                                        ` : ''}
                                        ${med.instructions ? `
                                            <tr>
                                                <td colspan="4" style="padding: var(--space-xs) var(--space-sm); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                                                    📝 ${med.instructions}
                                                </td>
                                            </tr>
                                        ` : ''}
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div >
            `;
            }

            // Medical Tests
            if (p.tests && p.tests.length > 0) {
                html += `
            < div class="card" >
                <h2 style="margin-bottom: var(--space-md);">🔬 Medical Tests (${p.tests.length})</h2>
                        ${p.tests.map(test => `
                            <div class="list-item" style="cursor: default;">
                                <div class="list-icon">🧪</div>
                                <div class="list-content">
                                    <div class="list-title">${test.test_name}</div>
                                    ${test.instructions ? `<div class="list-subtitle">${test.instructions}</div>` : ''}
                                </div>
                                <div style="background: ${test.status === 'Completed' ? 'var(--color-neon-mint)' : '#fef3c7'}; 
                                            color: ${test.status === 'Completed' ? 'var(--color-bg-dark)' : '#92400e'}; 
                                            padding: 4px 12px; border-radius: 4px; font-size: var(--font-size-sm);">
                                    ${test.status || 'Pending'}
                                </div>
                            </div>
                        `).join('')
                    }
                    </div >
            `;
            }

            // Key Insights
            if (p.key_insights) {
                html += `
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">💡 Key Insights</h2>
                        <p style="color: var(--color-text-secondary);">${p.key_insights}</p>
                    </div >
            `;
            }

            // Prescription Image
            if (p.image_url) {
                const API_BASE = localStorage.getItem('api_url') || 'https://snobbily-civilisatory-denis.ngrok-free.dev';
                const imageUrl = p.image_url.startsWith('http') ? p.image_url : API_BASE + p.image_url;

                html += `
            < div class="card" >
                        <h2 style="margin-bottom: var(--space-md);">🖼️ Prescription Image</h2>
                        <div style="text-align: center;">
                            <img src="${imageUrl}" alt="Prescription" 
                                 style="max-width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <p style="display: none; padding: var(--space-lg); background: var(--color-bg-elevated); border-radius: var(--radius-md);">
                                📄 Image not available
                            </p>
                        </div>
                    </div >
            `;
            }

            // Details
            html += `
            < div class="card" >
                    <h2 style="margin-bottom: var(--space-md);">ℹ️ Details</h2>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Visit Reason</span>
                        <span style="font-weight: 600;">${p.visit_reason || 'Not specified'}</span>
                    </div>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Prescription Date</span>
                        <span style="font-weight: 600;">${p.prescription_date || 'N/A'}</span>
                    </div>
                    <div class="list-item" style="cursor: default;">
                        <span style="color: var(--color-text-muted);">Upload Date</span>
                        <span style="font-weight: 600;">${p.upload_date?.split('T')[0] || 'N/A'}</span>
                    </div>
                </div >
            `;

            // Delete button
            html += `
            < div style = "margin-top: var(--space-lg); margin-bottom: var(--space-xxl);" >
                <button class="btn-secondary" style="background: var(--color-soft-crimson); border-color: var(--color-soft-crimson); color: white;"
                    onclick="app.deletePrescription(${p.id})">
                    🗑️ Delete Prescription
                </button>
                </div >
            `;

            elements.mainContent.innerHTML = html;

        } catch (error) {
            showToast('Failed to load prescription: ' + error.message, 'error');
            navigate('dashboard');
        }
    },
    deletePrescription: async (id) => {
        if (!confirm('Are you sure you want to delete this prescription? This cannot be undone.')) {
            return;
        }
        try {
            await api.deletePrescription(id);
            showToast('Prescription deleted', 'success');
            navigate('dashboard');
        } catch (error) {
            showToast('Delete failed: ' + error.message, 'error');
        }
    },
    navigateTo: (page) => {
        switch (page) {
            case 'vitals':
                app.showVitals();
                break;
            case 'chat':
                app.showChat();
                break;
            default:
                showToast(`${page} feature coming soon!`, 'info');
        }
    },
    goBack: () => {
        navigate('dashboard');
    },
    filterTimeline: (filter) => {
        renderTimeline(filter);
    },
    toggleHealthSummary: () => {
        const content = document.getElementById('health-summary-content');
        const btn = document.getElementById('health-summary-btn');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg> Hide Summary';
        } else {
            content.style.display = 'none';
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg> View Summary';
        }
    },
    showVitals: async () => {
        elements.mainContent.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';

        try {
            const data = await api.getHealthReadings();

            let html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-lg);">Health Vitals</h1>
                
                <button class="btn-primary" onclick="app.addVital()" style="margin-bottom: var(--space-lg);">
                    + Add Reading
                </button>
        `;

            if (data.readings && data.readings.length > 0) {
                html += data.readings.map(r => `
            < div class="card" style = "margin-bottom: var(--space-md);" >
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div class="list-title" style="margin-bottom: 8px;">${r.date}</div>

                        ${r.bp_systolic ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--color-bg-elevated); padding-bottom: 8px;">
                                    <span style="color: var(--color-text-muted);">Blood Pressure</span>
                                    <span style="color: var(--color-electric-cyan); font-weight: 700;">${r.bp_systolic}/${r.bp_diastolic} <span style="font-size: 0.8em; color: var(--color-text-secondary);">mmHg</span></span>
                                </div>` : ''}

                        ${r.sugar_level ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: var(--color-text-muted);">Blood Sugar <span style="font-size: 0.8em;">(${r.sugar_type})</span></span>
                                    <span style="color: var(--color-electric-cyan); font-weight: 700;">${r.sugar_level} <span style="font-size: 0.8em; color: var(--color-text-secondary);">mg/dL</span></span>
                                </div>` : ''}

                        ${r.notes ? `<div class="list-subtitle" style="margin-top: 4px; font-style: italic;">📝 ${r.notes}</div>` : ''}
                    </div>
                    <button onclick="app.deleteVital(${r.id})" style="background: none; border: none; color: var(--color-soft-crimson); font-size: 20px; cursor: pointer; margin-left: 12px;">🗑️</button>
                </div>
    </div >
            `).join('');
            } else {
                html += `
            < div class="empty-state" >
                        <p>No health readings yet</p>
                        <p>Track your blood pressure, weight, glucose, etc.</p>
                    </div >
            `;
            }

            elements.mainContent.innerHTML = html;

        } catch (error) {
            showToast('Failed to load vitals: ' + error.message, 'error');
            navigate('dashboard');
        }
    },
    addVital: () => {
        const html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.showVitals()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Add Health Reading</h1>
            
            <form id="vital-form" class="card">
                <div class="input-group">
                    <label>Reading Type</label>
                    <select id="vital-type" required style="padding: var(--space-md); background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: var(--color-text-primary);">
                        <option value="Blood Pressure">Blood Pressure</option>
                        <option value="Heart Rate">Heart Rate</option>
                        <option value="Weight">Weight</option>
                        <option value="Blood Sugar">Blood Sugar</option>
                        <option value="Temperature">Temperature</option>
                        <option value="Oxygen Level">Oxygen Level</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Value</label>
                    <input type="text" id="vital-value" required placeholder="e.g., 120/80">
                </div>
                <div class="input-group">
                    <label>Unit (optional)</label>
                    <input type="text" id="vital-unit" placeholder="e.g., mmHg, kg, mg/dL">
                </div>
                <div class="input-group">
                    <label>Notes (optional)</label>
                    <input type="text" id="vital-notes" placeholder="Any additional notes">
                </div>
                <button type="submit" class="btn-primary">Save Reading</button>
            </form>
        `;

        elements.mainContent.innerHTML = html;

        document.getElementById('vital-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await api.addHealthReading({
                    reading_type: document.getElementById('vital-type').value,
                    value: document.getElementById('vital-value').value,
                    unit: document.getElementById('vital-unit').value,
                    notes: document.getElementById('vital-notes').value
                });
                showToast('Reading saved!', 'success');
                app.showVitals();
            } catch (error) {
                showToast('Failed to save: ' + error.message, 'error');
            }
        });
    },
    deleteVital: async (id) => {
        if (!confirm('Delete this reading?')) return;
        try {
            await api.deleteHealthReading(id);
            showToast('Reading deleted', 'success');
            app.showVitals();
        } catch (error) {
            showToast('Delete failed: ' + error.message, 'error');
        }
    },
    showChat: () => {
        let chatHistory = [];

        const renderChat = () => {
            let html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-lg);">AI Assistant</h1>
                
                <div id="chat-messages" style="min-height: 300px; max-height: 50vh; overflow-y: auto; margin-bottom: var(--space-md);">
                    ${chatHistory.length === 0 ? `
                        <div class="card" style="text-align: center;">
                            <p style="font-size: 40px; margin-bottom: var(--space-md);">🤖</p>
                            <p>Hello! I'm your AI health assistant.</p>
                            <p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-top: var(--space-sm);">Ask me about your prescriptions, medicines, or health questions.</p>
                        </div>
                    ` : chatHistory.map(msg => `
                        <div class="card" style="margin-bottom: var(--space-sm); ${msg.role === 'user' ? 'background: var(--color-electric-cyan-10); margin-left: 20%;' : 'margin-right: 20%;'}">
                            <div style="font-weight: 600; margin-bottom: 4px; color: ${msg.role === 'user' ? 'var(--color-electric-cyan)' : 'var(--color-neon-mint)'};">
                                ${msg.role === 'user' ? '👤 You' : '🤖 AI'}
                            </div>
                            <div style="white-space: pre-wrap;">${msg.content}</div>
                        </div>
                    `).join('')}
                </div>
                
                <form id="chat-form" style="display: flex; gap: var(--space-sm);">
                    <input type="text" id="chat-input" placeholder="Ask a question..." required style="flex: 1;">
                    <button type="submit" class="btn-primary" style="padding: var(--space-md) var(--space-lg);">Send</button>
                </form>
        `;

            elements.mainContent.innerHTML = html;

            document.getElementById('chat-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = document.getElementById('chat-input');
                const message = input.value.trim();
                if (!message) return;

                chatHistory.push({ role: 'user', content: message });
                input.value = '';
                renderChat();

                // Show loading
                const msgContainer = document.getElementById('chat-messages');
                msgContainer.innerHTML += '<div class="card" style="margin-right: 20%;"><div class="spinner" style="width: 24px; height: 24px;"></div></div>';
                msgContainer.scrollTop = msgContainer.scrollHeight;

                try {
                    const response = await api.sendChatMessage(message);
                    chatHistory.push({ role: 'assistant', content: response.response });
                } catch (error) {
                    chatHistory.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
                }

                renderChat();
                document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
            });
        };

        renderChat();
    },
    openSettings: () => {
        const notificationsEnabled = localStorage.getItem('notifications_enabled') === 'true';

        const html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.goBack()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Settings</h1>
            
            <div class="card">
                <div class="menu-item" style="justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: var(--space-md);">
                        <span style="font-size: 24px;">🔔</span>
                        <span>Notifications</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="notification-toggle" ${notificationsEnabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="menu-item" onclick="app.showServerConfig()">
                    <span style="font-size: 24px;">🌐</span>
                    <span style="flex: 1;">Server URL</span>
                    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 24px; height: 24px; color: var(--color-text-muted);">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>
                
                <div class="menu-item" style="cursor: default;">
                    <span style="font-size: 24px;">ℹ️</span>
                    <span style="flex: 1;">Version</span>
                    <span style="color: var(--color-text-muted);">1.0.0</span>
                </div>
            </div>
            
            <style>
                .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--color-border); transition: .3s; border-radius: 28px; }
                .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .3s; border-radius: 50%; }
                input:checked + .slider { background-color: var(--color-electric-cyan); }
                input:checked + .slider:before { transform: translateX(22px); }
            </style>
        `;

        elements.mainContent.innerHTML = html;

        document.getElementById('notification-toggle').addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            localStorage.setItem('notifications_enabled', enabled);

            if (enabled && 'Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    showToast('Notifications enabled!', 'success');
                } else {
                    e.target.checked = false;
                    localStorage.setItem('notifications_enabled', 'false');
                    showToast('Notification permission denied', 'error');
                }
            } else if (!enabled) {
                showToast('Notifications disabled', 'info');
            }
        });
    },
    showServerConfig: () => {
        const currentUrl = localStorage.getItem('api_url') || 'https://snobbily-civilisatory-denis.ngrok-free.dev';

        const html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="app.openSettings()" style="padding: 8px 16px;">
                    ← Back
                </button>
            </div >
            
            <h1 style="margin-bottom: var(--space-lg);">Server Configuration</h1>
            
            <div class="card">
                <div class="input-group">
                    <label>API Server URL</label>
                    <input type="url" id="server-url" value="${currentUrl}" placeholder="https://your-server.com">
                </div>
                <button class="btn-primary" onclick="app.saveServerUrl()">Save</button>
            </div>
            
            <div class="card" style="margin-top: var(--space-md);">
                <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
                    ⚠️ Only change this if you're connecting to a different server.
                    The app will reload after saving.
                </p>
            </div>
        `;

        elements.mainContent.innerHTML = html;
    },
    saveServerUrl: () => {
        const url = document.getElementById('server-url').value.trim();
        if (url) {
            localStorage.setItem('api_url', url);
            showToast('Server URL saved. Reloading...', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    },
    compareMedicine: async (name) => {
        elements.mainContent.innerHTML = '<div class="loading-screen"><div class="spinner"></div><p style="margin-top: 16px;">Finding alternatives...</p></div>';

        try {
            const data = await api.compareMedicine(name);

            let html = `
            < div style = "margin-bottom: var(--space-md);" >
                <button class="btn-secondary" onclick="navigate('pharma')" style="padding: 8px 16px;">
                    ← Back
                </button>
                </div >
                
                <h1 style="margin-bottom: var(--space-sm);">Comparison Results</h1>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg);">Alternatives for <strong>${name}</strong></p>
                
                <div class="card" style="border-left: 4px solid var(--color-electric-cyan);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 4px;">GENERIC NAME</div>
                    <div style="font-size: var(--font-size-lg); font-weight: 700;">${data.original?.generic_name || 'Generic'}</div>
                    <div style="margin-top: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-muted);">
                        ${data.note || 'These alternatives contain the same active ingredients.'}
                    </div>
                </div>
        `;

            if (data.alternatives && data.alternatives.length > 0) {
                html += `
            < div class="card" >
                <h2 class="card-title" style="margin-bottom: var(--space-md);">Alternatives</h2>
                        ${data.alternatives.map(alt => `
                            <div class="list-item" style="cursor: default; display: block;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <div style="font-weight: 700; font-size: var(--font-size-lg);">${alt.name}</div>
                                    <div style="background: var(--color-neon-mint); color: var(--color-bg-dark); padding: 4px 8px; border-radius: 4px; font-weight: 700;">
                                        ${alt.savings || 'Save money'}
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: end;">
                                    <div>
                                        <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${alt.manufacturer}</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--font-size-xl); font-weight: 700; color: var(--color-electric-cyan);">${alt.estimated_price}</div>
                                        <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Est. Price</div>
                                    </div>
                                </div>
                                <div style="margin-top: var(--space-md);">
                                    <button class="btn-primary" onclick="app.buyMedicine('${alt.name}')" style="background: var(--color-electric-cyan-10); color: var(--color-electric-cyan); border: 1px solid var(--color-electric-cyan);">
                                        🛒 Buy Now via 1mg
                                    </button>
                                </div>
                            </div>
                        `).join('')
                    }
                    </div >
            `;
            }

            html += `
            < div class="card" style = "background: var(--color-bg-elevated);" >
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center;">
                    ⚠️ Prices are approximate estimates only. Always consult your doctor or pharmacist before switching brands.
                </p>
                </div >
            `;

            elements.mainContent.innerHTML = html;

        } catch (error) {
            showToast('Comparison failed: ' + error.message, 'error');
            navigate('pharma');
        }
    },
    buyMedicine: (name) => {
        const url = `https://www.1mg.com/search/all?name=${encodeURIComponent(name)}`;
        window.open(url, '_system');
    },
    setScanMode: (mode) => {
        app.scanMode = mode;
        renderScan();
    },
    logout: async () => {
        try {
            await api.logout();
            showToast('Logged out successfully', 'info');
            showAuthScreen();
        } catch (error) {
            // Even if logout API fails, clear local state
            api.clearTokens();
            showAuthScreen();
        }
    }
};

// ============== Initialize App ==============
async function initApp() {
    // 1. Initialize DOM elements first
    initElements();

    await loadCapacitorPlugins();
    setupAuthHandlers();
    setupNavigation();

    // Check if user is already logged in
    if (api.isAuthenticated()) {
        try {
            const user = await api.getMe();
            state.user = user;
            showMainApp();
        } catch (error) {
            // Token invalid, show login
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
}

// Start the app
initApp();

// ================== Restored Functions ==================

app.generateHealthSummary = async function (btnElement) {
    const container = document.getElementById('health-summary-content');

    // improved loading state
    container.innerHTML = "<div class=\"processing-container\">Generating summary...</div>";

    try {
        const response = await api.generateHealthSummary();

        container.innerHTML = "<div class=\"summary-text\">" + response.summary + "</div><div style=\"font-size:10px; color:#888; text-align:right\">Generated just now</div>";
    } catch (error) {
        container.innerHTML = "<div style=\"text-align:center; color:red; padding:10px\">Failed to generate summary. <button class=\"btn-secondary\" onclick=\"app.generateHealthSummary(this)\">Try Again</button></div>";
        showToast(error.message, 'error');
    }
};

async function renderVitalsPreview() {
    // Check if we can add a charts section
    const existing = document.getElementById('vitals-preview-card');
    if (existing) existing.remove();

    // Insert after summary card (if it exists) or after stats row
    const summaryCard = document.querySelector('.summary-card');
    const target = summaryCard || document.querySelector('.stats-row');

    if (!target) return;

    // Apple Health style card (Simplified for build)
    const vitalsHtml = "<div id=\"vitals-preview-card\" class=\"card\"><div class=\"card-header\"><h2>Vitals Trends</h2><span class=\"card-action\" onclick=\"navigate('vitals')\">Add Data</span></div><div class=\"chart-container\"><canvas id=\"bpChart\"></canvas></div><div class=\"chart-container\"><canvas id=\"sugarChart\"></canvas></div></div>";

    target.insertAdjacentHTML('afterend', vitalsHtml);

    // Fetch data and render charts
    try {
        let data = [];
        try {
            data = await api.getHealthReadings();
        } catch (e) { console.log('API e', e); }

        if (data && data.length > 0) {
            const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
            const labels = sorted.map(d => {
                const date = new Date(d.date);
                return `${date.getDate()}/${date.getMonth() + 1}`;
            });

            // BP Chart
            new Chart(document.getElementById('bpChart'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Systolic',
                            data: sorted.map(d => d.bp_systolic),
                            borderColor: '#FF2D55',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Diastolic',
                            data: sorted.map(d => d.bp_diastolic),
                            borderColor: '#FF9500',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });

            // Sugar Chart
            new Chart(document.getElementById('sugarChart'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Sugar',
                        data: sorted.map(d => d.sugar_level),
                        borderColor: '#34C759',
                        borderWidth: 2,
                        fill: true,
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        } else {
            const card = document.getElementById('vitals-preview-card');
            if (card) {
                // Empty states simplified
                const charts = card.querySelectorAll('.chart-container');
                if (charts[0]) charts[0].innerHTML = "<div class=\"empty-state\">No blood pressure data</div>";
                if (charts[1]) charts[1].innerHTML = "<div class=\"empty-state\">No sugar level data</div>";
            }
        }
    } catch (e) {
        console.error('Error loading charts:', e);
    }
}
