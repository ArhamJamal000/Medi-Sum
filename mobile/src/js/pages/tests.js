import { api } from '../api.js';

export async function renderTests(container) {
    // Mock Test Data
    const tests = [
        { name: 'Complete Blood Count (CBC)', date: 'Oct 15, 2023', status: 'Completed', result: 'Normal', doctor: 'Dr. Smith' },
        { name: 'Lipid Profile', date: 'Sep 28, 2023', status: 'Completed', result: 'High LDL', doctor: 'Dr. Jane' },
        { name: 'Thyroid Panel (TSH)', date: 'Aug 10, 2023', status: 'Completed', result: 'Normal', doctor: 'Dr. Smith' },
        { name: 'Vitamin D3', date: 'Upcoming', status: 'Pending', result: '--', doctor: 'Dr. Adams' }
    ];

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <div class="bg-primary/10 p-1.5 rounded-lg"><span class="material-symbols-outlined text-primary text-sm">science</span></div>
            <h1 class="text-lg font-bold">Lab Results</h1>
        </div>
        <button class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700">filter_list</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-4">
        
        <div class="relative mb-6">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input type="text" placeholder="Search tests..." class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
        </div>

        <div class="flex items-center justify-between mb-2">
            <h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">All Records</h2>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">${tests.length} Total</span>
        </div>

        <div class="space-y-3">
            ${tests.map(test => {
        const isPending = test.status === 'Pending';
        const statusColor = isPending ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
        const icon = isPending ? 'pending_actions' : 'check_circle';

        // Date calc mock
        let hintText = test.date;
        if (isPending) hintText = "Follow-up due in 2 weeks";

        return `
                <div class="bg-white border ${isPending ? 'border-amber-200 shadow-md shadow-amber-500/10' : 'border-slate-200 shadow-sm'} rounded-xl p-4 transition-all hover:border-primary/30">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="size-10 rounded-lg ${isPending ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-400'} flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined">${icon}</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-800 text-sm leading-tight">${test.name}</h3>
                                <p class="text-xs text-slate-500 mt-0.5">${hintText} • ${test.doctor}</p>
                            </div>
                        </div>
                    </div>
                    
                    ${isPending ? `
                    <div class="flex gap-2 mt-4 mb-1">
                        <button class="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg shadow-sm shadow-primary/20 flex items-center justify-center gap-1 active:scale-95 transition-transform" onclick="window.app.showToast('Test marked directly as Done', 'success')">
                            <span class="material-symbols-outlined text-[14px]">task_alt</span> Mark Done
                        </button>
                        <button onclick="app.navigateTo('scan')" class="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 active:scale-95 transition-transform">
                            <span class="material-symbols-outlined text-[14px]">upload</span> Upload Result
                        </button>
                    </div>
                    ` : `
                    <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider ${statusColor} px-2 py-0.5 rounded border">${test.status}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-bold ${test.result === 'Normal' ? 'text-emerald-500' : (test.result === '--' ? 'text-slate-400' : 'text-rose-500')}">${test.result}</span>
                        </div>
                    </div>`}
                </div>`;
    }).join('')}
        </div>
        
        <!-- Nearby Labs Button -->
        <button class="w-full mt-6 bg-white border border-primary/30 text-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-primary/5 transition-colors" onclick="window.app.showToast('Opening map for nearby diagnostic labs...', 'info')">
            <span class="material-symbols-outlined">map</span>
            Find Nearby Diagnostic Labs
        </button>
    </main>

    <!-- Upload FAB -->
    <button onclick="app.navigateTo('scan')" class="fixed bottom-6 right-4 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40">
        <span class="material-symbols-outlined text-2xl">upload_file</span>
    </button>`;
}
