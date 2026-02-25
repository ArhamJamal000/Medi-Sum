import { api } from '../api.js';
import { getReminders } from '../localdb.js';

export async function renderDashboard(container) {
    let data = {};
    try { data = await api.getDashboard(); } catch (e) { console.warn('Dashboard API error', e); }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const stats = data.stats || {};
    const medicines = data.active_medicines || [];
    const pendingTests = data.pending_tests || [];
    const recentActivity = data.recent_activity || [];
    // Fetch REAL vitals from DB
    let vitalsHistory = [];
    try {
        const vitalsData = await api.getHealthReadings();
        vitalsHistory = (vitalsData.readings || []).slice(0, 5);
    } catch (e) { console.warn('Vitals fetch error', e); }

    // Fetch REAL reminders from local DB
    let activeReminders = [];
    try {
        const allReminders = await getReminders();
        activeReminders = allReminders.filter(r => r.enabled);
    } catch (e) { console.warn('Reminders fetch error', e); }

    // Find next upcoming reminder time
    function getNextReminderInfo(reminder) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        let nextTime = null;
        let minDiff = Infinity;
        for (const t of (reminder.times || [])) {
            const [h, m] = t.split(':').map(Number);
            const timeMinutes = h * 60 + m;
            let diff = timeMinutes - currentMinutes;
            if (diff < 0) diff += 24 * 60; // next day
            if (diff < minDiff) { minDiff = diff; nextTime = t; }
        }
        const hours = Math.floor(minDiff / 60);
        const mins = minDiff % 60;
        const label = hours > 0 ? `In ${hours}h ${mins}m` : `In ${mins} min`;
        return { time: nextTime, label, diff: minDiff };
    }

    // Sort reminders by next upcoming time
    const sortedReminders = activeReminders.map(r => ({
        ...r,
        next: getNextReminderInfo(r)
    })).sort((a, b) => a.next.diff - b.next.diff);

    // Determine if new user (zero state)
    const isNewUser = (!stats.prescription_count && !medicines.length);

    container.innerHTML = `
    <!-- Header -->
    <header class="bg-white border-b border-primary/10 px-4 pt-6 pb-4 sticky top-0 z-50">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="relative cursor-pointer" onclick="app.navigateTo('profile')">
                    <div class="size-12 rounded-full bg-primary/20 border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-primary">${(user.name || 'U')[0].toUpperCase()}</div>
                    <span class="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                    <h1 class="text-xl font-bold tracking-tight">Welcome back</h1>
                    <p class="text-slate-500 text-sm">${user.name || 'User'}</p>
                </div>
            </div>
            <div class="flex gap-1 relative">
                <button class="p-2 rounded-full hover:bg-slate-100 transition-colors relative">
                    <span class="material-symbols-outlined text-slate-600">notifications</span>
                    ${medicines.length > 0 ? '<span class="absolute top-1 right-2 size-2.5 bg-red-500 border-2 border-white rounded-full"></span>' : ''}
                </button>
                <button id="dashboard-logout-btn" class="p-2 rounded-full hover:bg-red-50 transition-colors" title="Log Out">
                    <span class="material-symbols-outlined text-slate-500">logout</span>
                </button>
            </div>
        </div>
    </header>

    <div class="max-w-md mx-auto px-4 py-6 space-y-6 page-enter">
        ${isNewUser ? `
        <!-- Onboarding Flow -->
        <div class="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg shadow-primary/30 relative overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-2xl font-bold mb-2">Welcome to Medi-Sum! 👋</h2>
                <p class="text-sm text-white/90 mb-6 max-w-[85%]">Your digital health co-pilot is ready. Upload your first prescription or medical lab report to automatically build your health dashboard.</p>
                <button onclick="app.navigateTo('scan')" class="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm hover:scale-105 transition-transform w-max">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span>
                    Digitize My First Record
                </button>
            </div>
            <span class="material-symbols-outlined absolute -right-6 -bottom-6 text-[120px] text-white/10 rotate-12 pointer-events-none">medical_information</span>
        </div>` : ''}

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('history')">
                <span class="material-symbols-outlined text-primary mb-1">description</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Prescriptions</p>
                <p class="text-2xl font-bold">${stats.prescription_count ?? 0}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('pharma')">
                <span class="material-symbols-outlined text-teal-500 mb-1">medication</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Medicines</p>
                <p class="text-2xl font-bold">${stats.medicine_count ?? medicines.length}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('tests')">
                <span class="material-symbols-outlined text-blue-500 mb-1">lab_profile</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Medical Tests</p>
                <p class="text-2xl font-bold">${stats.test_count ?? 0}</p>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-1 cursor-pointer active:scale-[0.97] transition-transform" onclick="app.navigateTo('tests')">
                <span class="material-symbols-outlined text-amber-500 mb-1">pending_actions</span>
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Tests</p>
                <p class="text-2xl font-bold">${stats.pending_count ?? pendingTests.length}</p>
            </div>
        </div>

        <!-- Upload Button -->
        <button onclick="app.navigateTo('scan')" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined">upload_file</span>
            Upload Prescription
        </button>

        <!-- Reminders / Up Next -->
        ${sortedReminders.length > 0 ? `
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold flex items-center gap-2"><span class="material-symbols-outlined text-amber-500 text-xl">alarm</span> Up Next</h2>
                <button onclick="app.navigateTo('reminders')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">Manage <span class="material-symbols-outlined text-[14px]">arrow_forward</span></button>
            </div>
            <div class="space-y-3">
                ${sortedReminders.slice(0, 3).map(r => `
                <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="size-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-amber-100 text-amber-500 shrink-0">
                            <span class="material-symbols-outlined">pill</span>
                        </div>
                        <div>
                            <p class="text-xs text-amber-600 font-bold uppercase tracking-wider mb-0.5">${r.next.label} • ${r.next.time}</p>
                            <p class="font-bold text-slate-800">${r.medicineName}</p>
                            <p class="text-xs text-slate-600">${r.dosage || 'No dosage set'}</p>
                        </div>
                    </div>
                    <button class="taken-btn bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-amber-600 transition-colors active:scale-95" data-name="${r.medicineName}">Taken</button>
                </div>`).join('')}
            </div>
        </section>` : medicines.length > 0 ? `
        <section class="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-amber-400">notifications_none</span>
                <div>
                    <p class="text-sm font-bold text-slate-700">No reminders set</p>
                    <p class="text-xs text-slate-500">Set reminders for your ${medicines.length} active medicines</p>
                </div>
            </div>
            <button onclick="app.navigateTo('reminders')" class="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-amber-600 transition-colors active:scale-95">Set Up</button>
        </section>` : ''}

        <!-- Vitals Section - Real DB Data -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Health Vitals</h2>
                <button onclick="app.navigateTo('vitals')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">Add New <span class="material-symbols-outlined text-[14px]">add</span></button>
            </div>
            
            <div class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
                ${vitalsHistory.length > 0 ? vitalsHistory.map((vital, i) => `
                <div class="min-w-[240px] snap-center bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col gap-4 relative group">
                    <button class="delete-vital-btn absolute top-2 right-2 p-1 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all" data-id="${vital.id}" title="Delete reading">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-semibold text-slate-400 uppercase">${vital.date || 'Recent'}</span>
                        <span class="size-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-slate-200'}"></span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-500 text-lg">favorite</span>
                            <span class="text-xs font-medium text-slate-500">BP</span>
                        </div>
                        <p class="font-bold text-slate-800">${vital.bp_systolic || '--'}/${vital.bp_diastolic || '--'} <span class="text-[10px] text-slate-400 font-normal">mmHg</span></p>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-blue-500 text-lg">water_drop</span>
                            <span class="text-xs font-medium text-slate-500">Sugar</span>
                        </div>
                        <p class="font-bold text-slate-800">${vital.sugar_level || '--'} <span class="text-[10px] text-slate-400 font-normal">mg/dL ${vital.sugar_type ? '(' + vital.sugar_type + ')' : ''}</span></p>
                    </div>
                    ${vital.notes ? `<p class="text-[10px] text-slate-400 border-t border-slate-50 pt-2">${vital.notes}</p>` : ''}
                </div>`).join('') : `
                <div class="w-full bg-slate-50 rounded-xl border border-slate-100 border-dashed p-6 text-center text-slate-400 text-sm">
                    No vitals recorded yet. Tap "Add New" to start tracking.
                </div>`}
            </div>

            <button onclick="app.navigateTo('vitals')" class="w-full bg-emerald-50 text-emerald-700 font-bold py-3 rounded-xl border border-emerald-200 transition-colors hover:bg-emerald-100 flex items-center justify-center gap-2 active:scale-[0.98]">
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                Record New Vitals
            </button>

            <button id="health-summary-btn" onclick="app.navigateTo('summary')" class="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl border border-primary/20 transition-colors hover:bg-primary/20 flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">summarize</span>
                Generate AI Health Summary
            </button>
        </section>

        <!-- Medicines -->
        <section class="space-y-4">
            <h2 class="text-lg font-bold">Your Medicines</h2>
            ${medicines.length ? `<div class="space-y-3">${medicines.map((med, idx) => {
        const isActive = idx % 2 === 0;
        const statusColor = isActive ? 'border-teal-500' : 'border-slate-300 opacity-75';
        const badge = isActive ? '<span class="bg-teal-50 text-teal-600 text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Active</span>' : '<span class="bg-slate-100 text-slate-500 text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">Completed</span>';

        return `
                <div class="flex items-center p-4 bg-white rounded-xl border-l-4 ${statusColor} shadow-sm relative overflow-hidden transition-all">
                    
                    ${isActive ? `
                    <button class="shrink-0 mr-3 size-6 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 text-transparent hover:text-teal-500 transition-colors" onclick="this.classList.add('bg-teal-500', 'border-teal-500', 'text-white'); window.app.showToast('Marked as taken!', 'success')">
                        <span class="material-symbols-outlined text-[14px]">check</span>
                    </button>` : `
                    <div class="shrink-0 mr-3 size-6"></div>
                    `}

                    <div class="flex-1 min-w-0 pr-2">
                        <div class="flex justify-between items-start mb-0.5">
                            <p class="text-sm font-bold text-slate-800 truncate ${!isActive && 'line-through decoration-slate-300'}">${med.name || ''}</p>
                            ${badge}
                        </div>
                        <p class="text-[11px] text-slate-500 truncate">${med.dosage || ''} • ${med.frequency || ''}</p>
                        ${isActive ? `<p class="text-[9px] text-amber-500 font-bold uppercase mt-1">Refill in 12 days</p>` : `<p class="text-[9px] text-slate-400 font-bold uppercase mt-1">Course Finished Oct 2022</p>`}
                    </div>
                    
                    <button class="shrink-0 p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors" onclick="document.getElementById('med-modal-name').textContent='${med.name || 'Medicine'}'; document.getElementById('med-modal-dose').textContent='${med.dosage || ''} • ${med.frequency || ''}'; document.getElementById('med-modal').classList.remove('hidden');">
                        <span class="material-symbols-outlined text-lg">info</span>
                    </button>
                </div>`}).join('')}</div>` : `
                <div class="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                    <div class="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                        <span class="material-symbols-outlined text-4xl">prescriptions</span>
                    </div>
                    <p class="text-sm font-bold text-slate-700 mb-1">No Active Medicines</p>
                    <p class="text-xs text-slate-500">You're all caught up! No active course found.</p>
                </div>
                `}
        </section>

        <!-- Pending Tests -->
        ${pendingTests.length ? `
        <section class="space-y-4">
            <h2 class="text-lg font-bold">Pending Tests</h2>
            <div class="space-y-3">${pendingTests.map((test, i) => {
            let dueText = "Due in 3 days";
            let dueColor = "text-amber-600 bg-amber-100";
            if (i === 0) { dueText = "Overdue by 1 day"; dueColor = "text-red-600 bg-red-100"; }

            return `
                <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <div class="flex items-start gap-3">
                        <div class="size-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <span class="material-symbols-outlined">science</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold text-slate-800 truncate">${test.test_name || test.name || ''}</p>
                            <p class="text-xs text-slate-500 mt-1">${test.instructions || 'Review with doctor'}</p>
                            <div class="flex items-center gap-2 mt-3">
                                <span class="text-[10px] font-bold px-2 py-1 rounded uppercase ${dueColor}">${dueText}</span>
                                <button class="text-[10px] font-bold text-primary ml-auto flex items-center gap-1 hover:underline" onclick="app.navigateTo('scan')">
                                    <span class="material-symbols-outlined text-[14px]">upload</span> Upload Results
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`}).join('')}</div>
        </section>` : ''}

        <!-- Recent Activity -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold">Recent Activity</h2>
                <button onclick="app.navigateTo('history')" class="text-primary text-xs font-bold flex items-center gap-1 hover:underline">View all prescriptions <span class="material-symbols-outlined text-[14px]">arrow_forward</span></button>
            </div>
            ${recentActivity.length ? `
            <div class="space-y-4 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                ${recentActivity.slice(0, 5).map((a, i) => {
                const colors = ['bg-primary', 'bg-teal-500', 'bg-blue-500'];
                const icons = ['upload', 'auto_awesome', 'calendar_today'];
                const rxId = a.prescription_id || a.id || '';
                return `<div class="flex gap-4 relative cursor-pointer group" ${rxId ? `onclick="app.navigateTo('detail', {id:'${rxId}'})"` : ''}>
                        <div class="${colors[i % 3]} size-10 rounded-full flex items-center justify-center z-10 border-4 border-[#f5f8f8]">
                            <span class="material-symbols-outlined text-white text-sm">${icons[i % 3]}</span>
                        </div>
                        <div class="flex-1 pt-1 bg-white p-3 rounded-xl border border-slate-100 shadow-sm ml-2 group-hover:border-primary/30 transition-colors">
                            <div class="flex justify-between items-start">
                                <p class="text-sm font-bold text-slate-800">${a.title || 'Activity'}</p>
                                <p class="text-[10px] text-slate-400 uppercase font-semibold">${a.timestamp || ''}</p>
                            </div>
                            <p class="text-xs text-slate-500 mt-1">${a.subtitle || ''}</p>
                            <p class="text-primary text-xs font-bold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">View <span class="material-symbols-outlined text-[14px]">arrow_forward</span></p>
                        </div>
                    </div>`;
            }).join('')}
            </div>` : `
                <div class="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                    <div class="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 text-slate-300">
                        <span class="material-symbols-outlined text-4xl">history_toggle_off</span>
                    </div>
                    <p class="text-sm font-bold text-slate-700 mb-1">No Recent Activity</p>
                    <p class="text-xs text-slate-500">Your health events will appear here.</p>
                </div>
            `}
        </section>
    </div>

    <!-- Medicine Info Modal (Hidden by default) -->
    <div id="med-modal" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onclick="document.getElementById('med-modal').classList.add('hidden')"></div>
        <div class="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 shadow-2xl animate-fade-in-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            
            <div class="flex items-center gap-4 mb-6">
                <div class="size-16 rounded-2xl bg-teal-50 text-teal-500 flex items-center justify-center border border-teal-100 shadow-sm">
                    <span class="material-symbols-outlined text-3xl">pill</span>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-1" id="med-modal-name">Medicine Name</h2>
                    <p class="text-sm font-medium text-slate-500" id="med-modal-dose">10mg • After Meal</p>
                </div>
            </div>

            <div class="space-y-4 mb-8">
                <div class="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                    <span class="material-symbols-outlined text-amber-500 shrink-0">warning</span>
                    <div>
                        <p class="text-xs text-amber-800 font-bold uppercase tracking-wider mb-0.5">Allergy Warning</p>
                        <p class="text-[13px] text-amber-700">Contains penicillin interactions. Proceed with caution based on your profile.</p>
                    </div>
                </div>
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions</h3>
                    <p class="text-sm text-slate-700">Take one tablet daily after dinner with a full glass of water. Do not crush or chew.</p>
                </div>
            </div>

            <button class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all" onclick="document.getElementById('med-modal').classList.add('hidden')">
                Close Details
            </button>
        </div>
    </div>`;

    // ── Dashboard Logout ──
    document.getElementById('dashboard-logout-btn')?.addEventListener('click', async () => {
        const confirmed = await window.app.showConfirmModal(
            'Log Out?',
            'Are you sure you want to log out of Medi-Sum?',
            'Log Out'
        );
        if (!confirmed) return;
        try { await api.logout(); } catch (e) { /* ignore */ }
        api.clearTokens();
        window.app.showToast('\uD83D\uDC4B Logged out successfully', 'success');
        setTimeout(() => location.reload(), 800);
    });

    // ── Delete Vital Readings ──
    container.querySelectorAll('.delete-vital-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            if (!id) return;
            const confirmed = await window.app.showConfirmModal(
                'Delete Reading?',
                'Are you sure you want to delete this health reading?',
                'Delete'
            );
            if (!confirmed) return;
            try {
                await api.deleteHealthReading(id);
                window.app.showToast('🗑️ Reading deleted', 'success');
                window.app.navigateTo('dashboard');
            } catch (err) {
                window.app.showToast(err.message || 'Failed to delete', 'error');
            }
        });
    });

    // ── Taken Button for Reminders ──
    container.querySelectorAll('.taken-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            btn.textContent = '✓ Done';
            btn.classList.remove('bg-amber-500', 'hover:bg-amber-600');
            btn.classList.add('bg-emerald-500');
            btn.disabled = true;
            window.app.showToast(`💊 ${name} marked as taken`, 'success');
        });
    });
}
