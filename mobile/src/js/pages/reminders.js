import { api } from '../api.js';
import { getReminders, saveReminder, deleteReminder, toggleReminder } from '../localdb.js';

let LocalNotifications = null;

async function loadNotifications() {
    if (!LocalNotifications) {
        try {
            const mod = await import('@capacitor/local-notifications');
            LocalNotifications = mod.LocalNotifications;
            // Request permission
            const perm = await LocalNotifications.requestPermissions();
            if (perm.display !== 'granted') {
                console.warn('Notification permission not granted');
            }
        } catch (e) {
            console.warn('Local notifications not available (browser mode)');
        }
    }
}

async function scheduleNotification(reminder) {
    await loadNotifications();
    if (!LocalNotifications) return;

    try {
        // Cancel existing notifications for this reminder
        await cancelNotification(reminder.id);

        const notifications = [];
        (reminder.times || []).forEach((time, idx) => {
            const [hours, minutes] = time.split(':').map(Number);
            const now = new Date();
            const scheduleDate = new Date();
            scheduleDate.setHours(hours, minutes, 0, 0);

            // If time has passed today, schedule for tomorrow
            if (scheduleDate <= now) {
                scheduleDate.setDate(scheduleDate.getDate() + 1);
            }

            notifications.push({
                title: '💊 Medicine Reminder',
                body: `Time to take ${reminder.medicineName}${reminder.dosage ? ' (' + reminder.dosage + ')' : ''}`,
                id: reminder.id * 10 + idx,
                schedule: {
                    at: scheduleDate,
                    repeats: true,
                    every: 'day',
                    on: { hour: hours, minute: minutes }
                },
                smallIcon: 'ic_stat_icon_config_sample',
                iconColor: '#00e5ff',
                sound: 'default',
                extra: { reminderId: reminder.id, medicineName: reminder.medicineName }
            });
        });

        if (notifications.length > 0) {
            await LocalNotifications.schedule({ notifications });
        }
    } catch (e) {
        console.error('Failed to schedule notification:', e);
    }
}

async function cancelNotification(reminderId) {
    if (!LocalNotifications) return;
    try {
        // Cancel all time-slot notifications for this reminder (up to 5 slots)
        const ids = [0, 1, 2, 3, 4].map(i => ({ id: reminderId * 10 + i }));
        await LocalNotifications.cancel({ notifications: ids });
    } catch (e) { /* ignore */ }
}

export async function renderReminders(container) {
    await loadNotifications();
    const reminders = await getReminders();

    // Get medicines from API for "add" dropdown
    let medicines = [];
    try {
        const data = await api.getPharmaAssist();
        medicines = data.medicines || [];
    } catch (e) { /* ignore */ }

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">alarm</span>
                <h1 class="text-lg font-bold">Medicine Reminders</h1>
            </div>
        </div>
        <button id="add-reminder-btn" class="bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform">
            <span class="material-symbols-outlined">add</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6">

        <!-- Active Reminders -->
        <section>
            <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Active Reminders (${reminders.filter(r => r.enabled).length})</h2>
            ${reminders.length > 0 ? `
            <div class="space-y-3" id="reminders-list">
                ${reminders.map(r => `
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm ${!r.enabled ? 'opacity-50' : ''}" data-id="${r.id}">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-lg ${r.enabled ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'} flex items-center justify-center">
                                <span class="material-symbols-outlined">medication</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800">${r.medicineName}</h3>
                                ${r.dosage ? `<p class="text-xs text-slate-500">${r.dosage}</p>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer toggle-reminder" data-id="${r.id}" ${r.enabled ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                            </label>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-wrap gap-2">
                            ${(r.times || []).map(t => `
                            <span class="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">schedule</span>
                                ${t}
                            </span>`).join('')}
                        </div>
                        <button class="delete-reminder-btn p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" data-id="${r.id}">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                </div>`).join('')}
            </div>` : `
            <div class="bg-white border border-slate-100 border-dashed rounded-xl p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-slate-300 mb-3">notifications_off</span>
                <p class="text-sm font-bold text-slate-700 mb-1">No Reminders Set</p>
                <p class="text-xs text-slate-500 mb-4">Tap the + button to add your first medicine reminder.</p>
            </div>`}
        </section>

        <!-- Tips -->
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-primary shrink-0 mt-0.5">lightbulb</span>
                <div>
                    <p class="text-xs font-bold text-primary mb-1">Pro Tip</p>
                    <p class="text-xs text-slate-600 leading-relaxed">You can also set reminders directly from your prescription details page by tapping the bell icon on each medicine.</p>
                </div>
            </div>
        </section>
    </main>

    <!-- Add Reminder Modal -->
    <div id="add-reminder-modal" class="fixed inset-0 z-[100] hidden">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" id="modal-backdrop"></div>
        <div class="absolute bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[32px] p-6 shadow-2xl animate-fade-in-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h2 class="text-xl font-bold mb-6">Add Reminder</h2>

            <form id="reminder-form" class="space-y-5">
                <!-- Medicine Name -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Medicine Name</label>
                    ${medicines.length > 0 ? `
                    <select id="rem-medicine" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                        <option value="">Select a medicine...</option>
                        ${medicines.map(m => `<option value="${m.name}" data-dosage="${m.dosage || ''}">${m.name}${m.dosage ? ' — ' + m.dosage : ''}</option>`).join('')}
                        <option value="custom">✏️ Enter manually...</option>
                    </select>
                    <input id="rem-medicine-custom" type="text" placeholder="Enter medicine name" class="hidden w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">` : `
                    <input id="rem-medicine-custom" type="text" placeholder="Enter medicine name" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>`}
                </div>

                <!-- Dosage -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Dosage (optional)</label>
                    <input id="rem-dosage" type="text" placeholder="e.g. 500mg" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- Time Selection -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Reminder Times</label>
                    <div class="grid grid-cols-3 gap-2 mb-3">
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="08:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                🌅 Morning
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="14:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                ☀️ Afternoon
                            </div>
                        </label>
                        <label class="cursor-pointer">
                            <input type="checkbox" class="sr-only peer time-preset" value="21:00">
                            <div class="text-center py-2.5 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">
                                🌙 Night
                            </div>
                        </label>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="time" id="rem-custom-time" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none">
                        <button type="button" id="add-custom-time" class="bg-slate-100 text-slate-600 px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">+ Add</button>
                    </div>
                    <div id="selected-times" class="flex flex-wrap gap-2 mt-3"></div>
                </div>

                <button type="submit" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
                    Save Reminder
                </button>
            </form>
        </div>
    </div>`;

    // ── Event Handlers ──

    // Toggle reminder
    container.querySelectorAll('.toggle-reminder').forEach(toggle => {
        toggle.addEventListener('change', async (e) => {
            const id = parseInt(e.target.dataset.id);
            const enabled = e.target.checked;
            const reminder = await toggleReminder(id, enabled);
            if (reminder) {
                if (enabled) {
                    await scheduleNotification(reminder);
                    window.app.showToast('🔔 Reminder enabled', 'success');
                } else {
                    await cancelNotification(id);
                    window.app.showToast('🔕 Reminder paused', 'info');
                }
            }
            window.app.navigateTo('reminders');
        });
    });

    // Delete reminder
    container.querySelectorAll('.delete-reminder-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            const confirmed = await window.app.showConfirmModal(
                'Delete Reminder?',
                'This will stop all notifications for this medicine.',
                'Delete'
            );
            if (!confirmed) return;
            await cancelNotification(id);
            await deleteReminder(id);
            window.app.showToast('🗑️ Reminder deleted', 'success');
            window.app.navigateTo('reminders');
        });
    });

    // Open add modal
    document.getElementById('add-reminder-btn')?.addEventListener('click', () => {
        document.getElementById('add-reminder-modal').classList.remove('hidden');
    });

    // Close modal
    document.getElementById('modal-backdrop')?.addEventListener('click', () => {
        document.getElementById('add-reminder-modal').classList.add('hidden');
    });

    // Medicine select → show custom input
    const medSelect = document.getElementById('rem-medicine');
    const medCustom = document.getElementById('rem-medicine-custom');
    if (medSelect) {
        medSelect.addEventListener('change', () => {
            if (medSelect.value === 'custom') {
                medCustom.classList.remove('hidden');
                medCustom.required = true;
                medCustom.focus();
            } else {
                medCustom.classList.add('hidden');
                medCustom.required = false;
                // Auto-fill dosage
                const opt = medSelect.selectedOptions[0];
                if (opt?.dataset.dosage) {
                    document.getElementById('rem-dosage').value = opt.dataset.dosage;
                }
            }
        });
    }

    // Custom time management
    const selectedTimes = new Set();
    const timesContainer = document.getElementById('selected-times');

    function renderSelectedTimes() {
        timesContainer.innerHTML = Array.from(selectedTimes).map(t => `
            <span class="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                ${t}
                <button type="button" class="remove-time hover:text-red-500" data-time="${t}">✕</button>
            </span>
        `).join('');
        timesContainer.querySelectorAll('.remove-time').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedTimes.delete(btn.dataset.time);
                // Uncheck preset if matches
                document.querySelectorAll('.time-preset').forEach(cb => {
                    if (cb.value === btn.dataset.time) cb.checked = false;
                });
                renderSelectedTimes();
            });
        });
    }

    // Preset time checkboxes
    document.querySelectorAll('.time-preset').forEach(cb => {
        cb.addEventListener('change', () => {
            if (cb.checked) selectedTimes.add(cb.value);
            else selectedTimes.delete(cb.value);
            renderSelectedTimes();
        });
    });

    // Add custom time
    document.getElementById('add-custom-time')?.addEventListener('click', () => {
        const timeInput = document.getElementById('rem-custom-time');
        if (timeInput.value) {
            selectedTimes.add(timeInput.value);
            timeInput.value = '';
            renderSelectedTimes();
        }
    });

    // Submit reminder form
    document.getElementById('reminder-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();

        let medicineName = '';
        if (medSelect && medSelect.value && medSelect.value !== 'custom') {
            medicineName = medSelect.value;
        } else if (medCustom) {
            medicineName = medCustom.value.trim();
        }

        if (!medicineName) {
            window.app.showToast('Please enter a medicine name', 'error');
            return;
        }

        if (selectedTimes.size === 0) {
            window.app.showToast('Please select at least one reminder time', 'error');
            return;
        }

        const reminder = {
            medicineName,
            dosage: document.getElementById('rem-dosage').value.trim(),
            times: Array.from(selectedTimes).sort(),
            enabled: true,
            createdAt: Date.now()
        };

        const saved = await saveReminder(reminder);
        await scheduleNotification(saved);

        window.app.showToast('🔔 Reminder set!', 'success');
        document.getElementById('add-reminder-modal').classList.add('hidden');
        window.app.navigateTo('reminders');
    });
}

// Quick add from prescription detail page
export async function quickAddReminder(medicineName, dosage, times = ['08:00', '20:00']) {
    const reminder = {
        medicineName,
        dosage: dosage || '',
        times,
        enabled: true,
        createdAt: Date.now()
    };
    const saved = await saveReminder(reminder);
    await scheduleNotification(saved);
    return saved;
}
