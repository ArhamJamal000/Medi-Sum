import { api } from '../api.js';

export async function renderSummary(container) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Show loading spinner while Gemini generates the summary
    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">AI Health Summary</h1>
    </header>
    
    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6 text-center pt-16">
        <div class="flex justify-center mb-6">
            <div class="relative">
                <div style="width:72px;height:72px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:28px">auto_awesome</span>
            </div>
        </div>
        <h2 class="text-xl font-bold text-slate-800">Generating your report...</h2>
        <p class="text-slate-500 text-sm font-medium">
            Analyzing all prescriptions, lab reports, and vitals with Gemini AI
        </p>
        <div class="space-y-3 pt-4 max-w-xs mx-auto">
            <div id="step-fetch" class="flex items-center gap-3">
                <div class="size-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span class="size-2 bg-primary rounded-full animate-pulse"></span>
                </div>
                <span class="text-sm text-slate-600 font-medium">Fetching medical records</span>
            </div>
            <div id="step-ai" class="flex items-center gap-3 opacity-40">
                <div class="size-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <span class="size-2 bg-slate-400 rounded-full"></span>
                </div>
                <span class="text-sm text-slate-500 font-medium">Generating AI summary</span>
            </div>
        </div>
    </main>`;

    // Fetch all prescriptions for local context
    let prescriptions = [];
    let stats = {};
    try {
        const dashData = await api.getDashboard();
        stats = dashData.stats || {};
    } catch (e) { /* ignore */ }

    try {
        const rxData = await api.getPrescriptions(1, 100);
        prescriptions = rxData.prescriptions || [];
    } catch (e) { /* ignore */ }

    // Animate step 1 done
    const stepFetch = document.getElementById('step-fetch');
    const stepAi = document.getElementById('step-ai');
    if (stepFetch) {
        stepFetch.querySelector('div').innerHTML = '<span class="material-symbols-outlined text-[12px] text-white">check</span>';
        stepFetch.querySelector('div').className = 'size-5 rounded-full bg-emerald-500 text-white flex items-center justify-center';
    }
    if (stepAi) {
        stepAi.classList.remove('opacity-40');
        stepAi.querySelector('div').innerHTML = '<span class="size-2 bg-primary rounded-full animate-pulse"></span>';
        stepAi.querySelector('div').className = 'size-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20';
    }

    // Call Gemini-powered health summary API
    let summaryText = '';
    let timestamp = '';
    let error = false;

    try {
        const result = await api.generateHealthSummary();
        summaryText = result.summary || 'No summary data available.';
        timestamp = result.timestamp || new Date().toISOString();
    } catch (e) {
        error = true;
        summaryText = e.message || 'Failed to generate summary. Please try again.';
    }

    // Build medicine and test lists from prescriptions
    const allMedicines = [];
    const allTests = [];
    const seenMeds = new Set();

    prescriptions.forEach(rx => {
        (rx.medicines || []).forEach(m => {
            if (m.name && !seenMeds.has(m.name.toLowerCase())) {
                seenMeds.add(m.name.toLowerCase());
                allMedicines.push(m);
            }
        });
        (rx.medical_tests || []).forEach(t => {
            if (t.test_name) allTests.push(t);
        });
    });

    // Format timestamp
    const reportDate = timestamp ? new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) : 'Just now';

    // Render the full summary page
    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">AI Health Summary</h1>
        <button class="ml-auto p-2 hover:bg-primary/10 rounded-full transition-colors" id="regenerate-btn" title="Regenerate">
            <span class="material-symbols-outlined text-primary">refresh</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6">
        <!-- Patient Profile Snapshot -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-center gap-4 mb-4">
                <div class="size-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/20">${(user.name || 'U')[0].toUpperCase()}</div>
                <div>
                    <h2 class="text-xl font-bold">${user.name || 'Patient'}</h2>
                    <span class="text-xs bg-white/20 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">AI Health Report</span>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Prescriptions</p>
                    <p class="font-bold text-lg">${stats.prescriptions ?? prescriptions.length}</p>
                </div>
                <div class="border-x border-white/10">
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Medicines</p>
                    <p class="font-bold text-lg">${stats.medicines ?? allMedicines.length}</p>
                </div>
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-wider">Generated</p>
                    <p class="font-bold text-sm mt-0.5">${reportDate.split(',')[0] || 'Today'}</p>
                </div>
            </div>
        </div>

        <!-- AI Executive Summary (Real Gemini Response) -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[16px]">auto_awesome</span>
                AI Summary — Powered by Gemini
            </h3>
            <div class="${error ? 'bg-red-50 border-red-200' : 'bg-primary/5 border-primary/15'} border p-5 rounded-2xl relative">
                ${error ? '<span class="material-symbols-outlined absolute top-4 right-4 text-red-300 text-3xl">error</span>' :
            '<span class="material-symbols-outlined absolute top-4 right-4 text-primary/20 text-3xl">auto_awesome</span>'}
                <p class="text-sm ${error ? 'text-red-700' : 'text-slate-700'} leading-relaxed font-medium relative z-10 whitespace-pre-wrap" id="summary-text">
                    ${summaryText}
                </p>
                <p class="text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-semibold">
                    ${error ? '⚠️ AI service error' : `✅ Generated at ${reportDate}`}
                </p>
            </div>
        </section>

        ${allMedicines.length ? `
        <!-- Active Medicines from Prescriptions -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Current Medicines (${allMedicines.length})</h3>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                ${allMedicines.slice(0, 8).map(m => `
                <div class="p-4 flex items-center justify-between">
                    <div class="min-w-0 flex-1">
                        <p class="font-bold text-slate-800 truncate">${m.name}</p>
                        <p class="text-xs text-slate-500 mt-0.5 truncate">${m.dosage || ''} ${m.frequency ? '• ' + m.frequency : ''}</p>
                    </div>
                    <span class="bg-teal-50 text-teal-600 text-[10px] px-2 py-1 rounded font-bold uppercase shrink-0 ml-2">Active</span>
                </div>`).join('')}
            </div>
        </section>` : ''}

        ${allTests.length ? `
        <!-- Tests from Prescriptions -->
        <section class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Medical Tests (${allTests.length})</h3>
            <div class="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                ${allTests.slice(0, 6).map(t => `
                <div class="p-4 flex items-center justify-between">
                    <div>
                        <p class="font-bold text-slate-800">${t.test_name}</p>
                        ${t.instructions ? `<p class="text-xs text-slate-500 mt-0.5">${t.instructions}</p>` : ''}
                    </div>
                    <span class="bg-${t.status === 'completed' ? 'emerald' : 'amber'}-50 text-${t.status === 'completed' ? 'emerald' : 'amber'}-600 text-[10px] px-2 py-1 rounded font-bold uppercase">${t.status || 'Pending'}</span>
                </div>`).join('')}
            </div>
        </section>` : ''}

        <!-- Disclaimer -->
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <span class="material-symbols-outlined text-amber-500 shrink-0 text-xl">info</span>
            <p class="text-xs text-amber-700 leading-relaxed">
                This summary is AI-generated for informational purposes only. It is not a substitute for professional medical advice. Always consult your doctor.
            </p>
        </div>
    </main>`;

    // Regenerate button
    document.getElementById('regenerate-btn')?.addEventListener('click', () => {
        renderSummary(container);
    });
}
