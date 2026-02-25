/**
 * Medi-Sum Mobile App — Main Router & Controller
 */
import { api } from './api.js';
import { App as CapApp } from '@capacitor/app';
import { renderDashboard } from './pages/dashboard.js';
import { renderUpload } from './pages/upload.js';
import { renderHistory } from './pages/history.js';
import { renderTimeline } from './pages/timeline.js';
import { renderDetail } from './pages/detail.js';
import { renderPharma } from './pages/pharma.js';
import { renderPharmaResult } from './pages/pharma-result.js';
import { renderChat } from './pages/chat.js';
import { renderProfile } from './pages/profile.js';
import { renderVitals } from './pages/vitals.js';
import { renderSummary } from './pages/summary.js';
import { renderTests } from './pages/tests.js';
import { renderReminders } from './pages/reminders.js';

let currentPage = 'dashboard';
let isOnAuthScreen = false;  // Track if we're on login/register

// ── Toast helper ──
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ── Exit Confirmation Modal ──
export function showExitModal() {
    const modal = document.getElementById('exit-modal');
    modal.classList.remove('hidden');
    // Animate sheet in
    requestAnimationFrame(() => {
        const sheet = modal.querySelector('.exit-modal-sheet');
        sheet.style.transform = 'translateY(0)';
    });
}

function hideExitModal() {
    const modal = document.getElementById('exit-modal');
    const sheet = modal.querySelector('.exit-modal-sheet');
    sheet.style.transform = 'translateY(100%)';
    setTimeout(() => modal.classList.add('hidden'), 300);
}

// ── Reusable Confirmation Modal ──
let _confirmResolve = null;

export function showConfirmModal(title, message, confirmText = 'Confirm', confirmClass = '') {
    return new Promise((resolve) => {
        _confirmResolve = resolve;
        const modal = document.getElementById('confirm-modal');
        document.getElementById('confirm-modal-title').textContent = title;
        document.getElementById('confirm-modal-message').textContent = message;
        const okBtn = document.getElementById('confirm-modal-ok');
        okBtn.textContent = confirmText;
        // Allow custom styling (e.g. red for delete)
        if (confirmClass) {
            okBtn.className = `flex-1 py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all shadow-lg ${confirmClass}`;
        } else {
            okBtn.className = 'flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-[0.98] transition-all shadow-lg shadow-red-500/20';
        }
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            const content = modal.querySelector('.confirm-modal-content');
            content.style.transform = 'scale(1)';
            content.style.opacity = '1';
        });
    });
}

function hideConfirmModal(result) {
    const modal = document.getElementById('confirm-modal');
    const content = modal.querySelector('.confirm-modal-content');
    content.style.transform = 'scale(0.9)';
    content.style.opacity = '0';
    setTimeout(() => modal.classList.add('hidden'), 250);
    if (_confirmResolve) { _confirmResolve(result); _confirmResolve = null; }
}

// ── Navigation ──
function setActiveTab(page) {
    const mainNav = document.getElementById('bottom-nav');
    if (!mainNav) return;
    mainNav.querySelectorAll('.nav-tab').forEach(tab => {
        const icon = tab.querySelector('.material-symbols-outlined');
        if (tab.dataset.page === page) {
            tab.className = 'nav-tab flex flex-col items-center gap-1 text-primary';
            icon.classList.add('filled');
            tab.querySelector('span:last-child').className = 'text-[10px] font-bold';
        } else {
            tab.className = 'nav-tab flex flex-col items-center gap-1 text-slate-400';
            icon.classList.remove('filled');
            tab.querySelector('span:last-child').className = 'text-[10px] font-medium';
        }
    });
}

export async function navigateTo(page, params = {}) {
    currentPage = page;
    const content = document.getElementById('main-content');
    const nav = document.getElementById('bottom-nav');

    // Show/hide standard bottom nav (chat has its own)
    if (nav) nav.classList.toggle('hidden', page === 'chat');

    content.innerHTML = '<div class="flex items-center justify-center py-20"><div class="spinner" style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s linear infinite;"></div></div>';
    content.scrollTop = 0;

    try {
        switch (page) {
            case 'dashboard': await renderDashboard(content); break;
            case 'scan': await renderUpload(content); break;
            case 'history': await renderHistory(content); break;
            case 'timeline': await renderTimeline(content); break;
            case 'detail': await renderDetail(content, params.id); break;
            case 'pharma': await renderPharma(content); break;
            case 'pharma-result': await renderPharmaResult(content, params); break;
            case 'vitals': await renderVitals(content); break;
            case 'summary': await renderSummary(content); break;
            case 'tests': await renderTests(content); break;
            case 'chat': await renderChat(content); break;
            case 'profile': await renderProfile(content); break;
            case 'reminders': await renderReminders(content); break;
            default: await renderDashboard(content);
        }
    } catch (err) {
        console.error('Page error:', err);
        content.innerHTML = `<div class="flex flex-col items-center justify-center py-20 text-center px-6">
            <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">error</span>
            <p class="text-lg font-bold text-slate-700 mb-2">Something went wrong</p>
            <p class="text-sm text-slate-500 mb-6">${err.message || 'Failed to load page'}</p>
            <button onclick="window.app.navigateTo('dashboard')" class="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm">Back to Dashboard</button>
        </div>`;
    }

    // Set active tab for pages that map to nav tabs
    const tabMap = { dashboard: 'dashboard', scan: 'scan', timeline: 'timeline', pharma: 'pharma', profile: 'profile', history: 'dashboard', detail: 'dashboard', reminders: 'dashboard' };
    setActiveTab(tabMap[page] || 'dashboard');
}

// ── Back Button Logic ──
// Maps each page to where its back button should go (null = show exit modal)
const backMap = {
    dashboard: null,        // Show exit popup
    scan: 'dashboard',
    history: 'dashboard',
    detail: 'history',
    timeline: 'dashboard',
    chat: 'dashboard',
    pharma: 'dashboard',
    'pharma-result': 'pharma',
    profile: 'dashboard',
    vitals: 'dashboard',
    summary: 'dashboard',
    tests: 'dashboard',
};

function handleBackButton() {
    // If any modal is visible, close it first
    const exitModal = document.getElementById('exit-modal');
    const confirmModal = document.getElementById('confirm-modal');
    if (exitModal && !exitModal.classList.contains('hidden')) {
        hideExitModal();
        return;
    }
    if (confirmModal && !confirmModal.classList.contains('hidden')) {
        hideConfirmModal(false);
        return;
    }

    // If on auth screen
    if (isOnAuthScreen) {
        const registerView = document.getElementById('register-view');
        if (registerView && !registerView.classList.contains('hidden')) {
            // Register → go to Login
            registerView.classList.add('hidden');
            document.getElementById('login-view').classList.remove('hidden');
            return;
        }
        // Login → show exit popup
        showExitModal();
        return;
    }

    // Main app pages
    const destination = backMap[currentPage];
    if (destination === null || destination === undefined) {
        showExitModal();
    } else {
        navigateTo(destination);
    }
}

// ── Init ──
async function init() {
    const loading = document.getElementById('loading');
    const authContainer = document.getElementById('auth-container');
    const mainContainer = document.getElementById('main-container');

    // ── Exit modal buttons ──
    document.getElementById('exit-cancel-btn')?.addEventListener('click', hideExitModal);
    document.getElementById('exit-confirm-btn')?.addEventListener('click', () => {
        CapApp.exitApp();
    });

    // ── Confirm modal buttons ──
    document.getElementById('confirm-modal-cancel')?.addEventListener('click', () => hideConfirmModal(false));
    document.getElementById('confirm-modal-ok')?.addEventListener('click', () => hideConfirmModal(true));

    // ── Capacitor back button ──
    CapApp.addListener('backButton', ({ canGoBack }) => {
        handleBackButton();
    });

    // ── Browser back button fallback ──
    window.addEventListener('popstate', (e) => {
        e.preventDefault();
        handleBackButton();
        // Push state back so we can capture again
        window.history.pushState(null, '', window.location.href);
    });
    // Seed initial history state
    window.history.pushState(null, '', window.location.href);

    // ── Auth toggle ──
    document.getElementById('show-register')?.addEventListener('click', e => { e.preventDefault(); document.getElementById('login-view').classList.add('hidden'); document.getElementById('register-view').classList.remove('hidden'); });
    document.getElementById('show-login')?.addEventListener('click', e => { e.preventDefault(); document.getElementById('register-view').classList.add('hidden'); document.getElementById('login-view').classList.remove('hidden'); });

    // ── Login form validation (disable until filled) ──
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginBtn = document.querySelector('#login-form button[type="submit"]');
    if (loginBtn) loginBtn.disabled = true;

    function validateLoginForm() {
        if (loginBtn) {
            const filled = loginEmail?.value.trim() && loginPassword?.value.trim();
            loginBtn.disabled = !filled;
            loginBtn.classList.toggle('opacity-50', !filled);
            loginBtn.classList.toggle('cursor-not-allowed', !filled);
        }
    }
    loginEmail?.addEventListener('input', validateLoginForm);
    loginPassword?.addEventListener('input', validateLoginForm);

    // ── Register form validation (disable until filled) ──
    const regName = document.getElementById('register-name');
    const regEmail = document.getElementById('register-email');
    const regPassword = document.getElementById('register-password');
    const regBtn = document.querySelector('#register-form button[type="submit"]');
    if (regBtn) regBtn.disabled = true;

    function validateRegisterForm() {
        if (regBtn) {
            const filled = regName?.value.trim() && regEmail?.value.trim() && regPassword?.value.trim();
            regBtn.disabled = !filled;
            regBtn.classList.toggle('opacity-50', !filled);
            regBtn.classList.toggle('cursor-not-allowed', !filled);
        }
    }
    regName?.addEventListener('input', validateRegisterForm);
    regEmail?.addEventListener('input', validateRegisterForm);
    regPassword?.addEventListener('input', validateRegisterForm);

    // ── Login submit ──
    document.getElementById('login-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite;"></div> Logging in...';

        // Clear previous errors
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.classList.add('hidden');

        try {
            await api.login(loginEmail.value, loginPassword.value);
            isOnAuthScreen = false;
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            navigateTo('dashboard');
        } catch (err) {
            // Show inline error
            let errorEl = document.getElementById('login-error');
            if (!errorEl) {
                errorEl = document.createElement('p');
                errorEl.id = 'login-error';
                errorEl.className = 'text-sm text-red-500 font-medium text-center mt-3 flex items-center justify-center gap-1';
                e.target.appendChild(errorEl);
            }
            errorEl.innerHTML = `<span class="material-symbols-outlined text-[16px]">error</span> ${err.message || 'Invalid email or password'}`;
            errorEl.classList.remove('hidden');
        }
        btn.disabled = false;
        btn.innerHTML = origText;
        validateLoginForm();
    });

    // ── Register submit ──
    document.getElementById('register-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite;"></div> Creating...';
        try {
            await api.register(regName.value, regEmail.value, regPassword.value);
            isOnAuthScreen = false;
            authContainer.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            navigateTo('dashboard');
        } catch (err) { showToast(err.message || 'Registration failed', 'error'); }
        btn.disabled = false;
        btn.innerHTML = origText;
        validateRegisterForm();
    });

    // ── Bottom nav clicks ──
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', e => { e.preventDefault(); navigateTo(tab.dataset.page); });
    });

    // ── Check auth ──
    if (api.isAuthenticated()) {
        loading.classList.add('hidden');
        mainContainer.classList.remove('hidden');
        isOnAuthScreen = false;
        navigateTo('dashboard');
    } else {
        loading.classList.add('hidden');
        authContainer.classList.remove('hidden');
        isOnAuthScreen = true;
    }
}

// Expose for inline handlers
window.app = { navigateTo, showToast, showConfirmModal, showExitModal };
document.addEventListener('DOMContentLoaded', init);
