import { api } from '../api.js';

export async function renderProfile(container) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    const currentLang = localStorage.getItem('lang') || 'English';

    container.innerHTML = `
    <header class="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div class="flex items-center justify-between px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">Profile</h1>
            <button class="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
                <span class="material-symbols-outlined text-slate-600">settings</span>
            </button>
        </div>
    </header>

    <main class="max-w-lg mx-auto w-full px-4 py-6 space-y-6 pb-28 page-enter">
        <!-- Avatar Card -->
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div class="relative">
                <div class="size-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary mb-3">${(user.name || 'U')[0].toUpperCase()}</div>
                <button class="absolute bottom-2 -right-2 size-8 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center text-primary hover:bg-slate-50 transition-colors">
                    <span class="material-symbols-outlined text-[16px]">edit</span>
                </button>
            </div>
            <h2 class="text-lg font-bold text-slate-800">${user.name || 'User'}</h2>
            <p class="text-sm text-slate-500">${user.email || ''}</p>
            <span class="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Patient</span>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-3">
            <button onclick="app.navigateTo('chat')" class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group">
                <span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">chat</span>
                <span class="text-sm font-semibold text-slate-700">AI Chat</span>
            </button>
            <button onclick="app.navigateTo('history')" class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:border-primary/50 transition-colors group">
                <span class="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">history</span>
                <span class="text-sm font-semibold text-slate-700">History</span>
            </button>
        </div>

        <!-- Profile Details (Editable) -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2">Medical Profile</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
                    <input type="number" id="prof-age" value="${localStorage.getItem('user_age') || '34'}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-800 transition-all">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                    <select id="prof-gender" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 outline-none">
                        <option value="M" ${localStorage.getItem('user_gender') === 'M' ? 'selected' : ''}>Male</option>
                        <option value="F" ${localStorage.getItem('user_gender') === 'F' ? 'selected' : ''}>Female</option>
                        <option value="O" ${localStorage.getItem('user_gender') === 'O' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (kg)</label>
                    <input type="number" id="prof-weight" value="${localStorage.getItem('user_weight') || '75'}" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold text-slate-800 transition-all">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Blood Group</label>
                    <select id="prof-blood" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-800 outline-none">
                        <option value="O+">O+</option><option value="O-">O-</option><option value="A+">A+</option><option value="B+">B+</option><option value="AB+">AB+</option>
                    </select>
                </div>
            </div>
            
            <div class="pt-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Chronic Conditions (Tags)</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                        Hypertension
                        <button class="material-symbols-outlined text-[14px] hover:text-rose-800">close</button>
                    </span>
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-bold">
                        Asthma
                        <button class="material-symbols-outlined text-[14px] hover:text-blue-800">close</button>
                    </span>
                    <button class="inline-flex items-center justify-center size-7 rounded-full bg-slate-100 border border-dashed border-slate-300 text-slate-500 hover:bg-slate-200 transition-colors">
                        <span class="material-symbols-outlined text-[16px]">add</span>
                    </button>
                </div>
                <p class="text-[10px] text-slate-400 leading-tight">These help your AI assign appropriate warnings and health summaries.</p>
            </div>
        </div>

        <!-- Family Accounts (Mock) -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">Family Members</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-2 flex gap-3 overflow-x-auto hide-scrollbar">
            <!-- Active Primary -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-primary/10 border border-primary/30 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-2 shadow-sm">${(user.name || 'U')[0].toUpperCase()}</div>
                <p class="text-[11px] font-bold text-primary truncate w-full" title="${user.name}">Me</p>
                <p class="text-[9px] text-primary/60 uppercase font-black">Active</p>
            </div>

            <!-- Parent Mock -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-indigo-100 text-indigo-500 border border-indigo-200 flex items-center justify-center font-bold text-lg mb-2 shadow-sm">S</div>
                <p class="text-[11px] font-bold text-slate-700 truncate w-full">Mrs. Seema</p>
                <p class="text-[9px] text-slate-400 uppercase font-bold">Mother</p>
            </div>

            <!-- Child Mock -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95">
                <div class="size-10 rounded-full bg-amber-100 text-amber-500 border border-amber-200 flex items-center justify-center font-bold text-lg mb-2 shadow-sm">Z</div>
                <p class="text-[11px] font-bold text-slate-700 truncate w-full">Zaid</p>
                <p class="text-[9px] text-slate-400 uppercase font-bold">Son</p>
            </div>

            <!-- Add New -->
            <div class="shrink-0 w-24 p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 hover:bg-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-transform active:scale-95 text-slate-400">
                <span class="material-symbols-outlined text-2xl mb-2">person_add</span>
                <p class="text-[10px] font-bold uppercase tracking-wider">Add New</p>
            </div>
        </div>

        <!-- App Preferences -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">App Preferences</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
            <!-- Language Selection -->
            <button id="lang-btn" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[20px]">language</span>
                    </div>
                    <div>
                        <span class="block text-sm font-medium text-slate-800">Language</span>
                        <span id="current-lang" class="block text-xs text-slate-500">${currentLang}</span>
                    </div>
                </div>
                <span class="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
            </button>

            <!-- Dark Mode Toggle -->
            <div class="w-full flex items-center justify-between p-4 bg-white">
                <div class="flex items-center gap-4">
                    <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <span class="material-symbols-outlined text-[20px]">dark_mode</span>
                    </div>
                    <div>
                        <span class="block text-sm font-medium text-slate-800">Dark Mode</span>
                        <span class="block text-xs text-slate-500">Preview feature</span>
                    </div>
                </div>
                <!-- Toggle Switch UI -->
                <button id="theme-toggle" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'} shadow-sm"></span>
                </button>
            </div>
        </div>
        
        <!-- Account Settings -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest pl-2 mt-6">Account</h3>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <button class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-100">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">notifications</span></div>
                <span class="flex-1 text-sm font-medium text-slate-800">Notifications</span>
                <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
            <button class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left border-b border-slate-100">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center"><span class="material-symbols-outlined text-[20px]">security</span></div>
                <span class="flex-1 text-sm font-medium text-slate-800">Privacy & Security</span>
                <span class="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
            <button id="delete-account-btn" class="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left group">
                <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 flex items-center justify-center transition-colors"><span class="material-symbols-outlined text-[20px]">delete_forever</span></div>
                <span class="flex-1 text-sm font-bold text-red-600">Delete Account</span>
                <span class="material-symbols-outlined text-red-400 text-sm">chevron_right</span>
            </button>
        </div>

        <!-- Logout -->
        <div class="pt-4">
            <button id="logout-btn" class="w-full py-3.5 text-slate-600 border border-slate-200 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                Log Out Instead
            </button>
        </div>

        <!-- Version -->
        <p class="text-center text-[11px] font-mono text-slate-400">Medi-Sum v1.3 Premium</p>
    </main>`;

    // Save profile data on change (mock local persistence)
    const inputs = ['prof-age', 'prof-gender', 'prof-weight', 'prof-blood'];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener('change', (e) => {
            localStorage.setItem('user_' + id.split('-')[1], e.target.value);
            window.app.showToast('Profile saved automatically', 'info');
        });
    });

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn?.addEventListener('click', () => {
        const isDark = localStorage.getItem('theme') === 'dark';
        if (isDark) {
            localStorage.setItem('theme', 'light');
            themeBtn.className = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-slate-200';
            themeBtn.innerHTML = '<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1 shadow-sm"></span>';
        } else {
            localStorage.setItem('theme', 'dark');
            themeBtn.className = 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary';
            themeBtn.innerHTML = '<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6 shadow-sm"></span>';
            // Mock toggle (full implementation requires CSS payload)
            window.app.showToast('Dark Mode is coming soon!', 'info');
        }
    });

    // Language Selection Mock
    const langBtn = document.getElementById('lang-btn');
    langBtn?.addEventListener('click', () => {
        const langs = ['English', 'Hindi', 'Urdu', 'Spanish'];
        const current = localStorage.getItem('lang') || 'English';
        const nextIdx = (langs.indexOf(current) + 1) % langs.length;
        localStorage.setItem('lang', langs[nextIdx]);
        document.getElementById('current-lang').textContent = langs[nextIdx];
        window.app.showToast('Language changed to ' + langs[nextIdx], 'info');
    });

    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        const confirmed = await window.app.showConfirmModal(
            'Log Out?',
            'Are you sure you want to log out of Medi-Sum?',
            'Log Out'
        );
        if (!confirmed) return;
        try { await api.logout(); } catch (e) { /* ignore */ }
        api.clearTokens();
        window.app.showToast('👋 Logged out successfully', 'success');
        setTimeout(() => location.reload(), 800);
    });

    document.getElementById('delete-account-btn')?.addEventListener('click', async () => {
        const confirmed = await window.app.showConfirmModal(
            'Delete Account?',
            'DANGER: This will permanently delete your account and all associated health records. This action cannot be undone.',
            'Delete Forever'
        );
        if (!confirmed) return;
        api.clearTokens();
        localStorage.clear();
        window.app.showToast('Account and all data successfully deleted.', 'info');
        setTimeout(() => location.reload(), 1500);
    });
}
