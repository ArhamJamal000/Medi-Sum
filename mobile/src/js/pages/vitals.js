import { api } from '../api.js';

export async function renderVitals(container) {
    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">close</span>
        </button>
        <h1 class="text-lg font-bold">Add Health Vitals</h1>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter">
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 class="text-xl font-bold mb-6 text-slate-800">Record New Vitals</h2>
            
            <form id="vitals-form" class="space-y-5">
                <!-- Blood Pressure -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-rose-500 text-[18px]">favorite</span>
                            Blood Pressure (mmHg)
                        </span>
                        <span id="bp-hint" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400">Enter Value</span>
                    </label>
                    <div class="flex items-center gap-3">
                        <input type="number" id="bp-sys" placeholder="Systolic (120)" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>
                        <span class="text-slate-400 font-bold text-xl">/</span>
                        <input type="number" id="bp-dia" placeholder="Diastolic (80)" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none" required>
                    </div>
                </div>

                <!-- Blood Sugar -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <span class="material-symbols-outlined text-blue-500 text-[18px]">water_drop</span>
                            Blood Sugar (mg/dL)
                        </span>
                        <span id="sugar-hint" class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400">Enter Value</span>
                    </label>
                    <input type="number" id="sugar" placeholder="e.g. 95" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                    
                    <div class="flex gap-2 mt-3">
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Fasting" class="peer sr-only" checked>
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Fasting</div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Post-Prandial" class="peer sr-only">
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Post-Meal</div>
                        </label>
                        <label class="flex-1 cursor-pointer">
                            <input type="radio" name="sugar_type" value="Random" class="peer sr-only">
                            <div class="text-center py-2 px-3 border border-slate-200 rounded-lg peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary text-sm font-bold text-slate-500 transition-colors">Random</div>
                        </label>
                    </div>
                </div>

                <!-- Heart Rate -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-orange-500 text-[18px]">monitor_heart</span>
                        Heart Rate (bpm)
                    </label>
                    <input type="number" id="heart-rate" placeholder="e.g. 72" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- Weight -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-purple-500 text-[18px]">weight</span>
                        Body Weight (kg)
                    </label>
                    <input type="number" step="0.1" id="weight" placeholder="e.g. 70.5" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <!-- SpO2 (Oxygen) -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span class="material-symbols-outlined text-teal-500 text-[18px]">air</span>
                        Blood Oxygen (SpO2 %)
                    </label>
                    <input type="number" id="spo2" placeholder="e.g. 98" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                </div>

                <div class="pt-6">
                    <button type="submit" id="save-vitals" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">Save Vitals</button>
                </div>
            </form>
        </div>
    </main>`;

    document.getElementById('vitals-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('save-vitals');
        btn.disabled = true;
        btn.textContent = 'Saving...';

        try {
            const vitalsData = {
                bp_systolic: parseInt(document.getElementById('bp-sys').value) || null,
                bp_diastolic: parseInt(document.getElementById('bp-dia').value) || null,
                sugar_level: parseInt(document.getElementById('sugar').value) || null,
                sugar_type: document.querySelector('input[name="sugar_type"]:checked')?.value || 'fasting',
                notes: `HR: ${document.getElementById('heart-rate').value || '-'}, Weight: ${document.getElementById('weight').value || '-'}kg, SpO2: ${document.getElementById('spo2').value || '-'}%`
            };

            await api.addHealthReading(vitalsData);
            window.app.showToast('✅ Vitals saved successfully!', 'success');
            window.app.navigateTo('dashboard');

        } catch (err) {
            window.app.showToast(err.message || 'Failed to save', 'error');
            btn.disabled = false;
            btn.textContent = 'Save Vitals';
        }
    });

    // Dynamic Range Indicators Logic
    const bpSys = document.getElementById('bp-sys');
    const bpDia = document.getElementById('bp-dia');
    const bpHint = document.getElementById('bp-hint');

    function updateBPHint() {
        const sys = parseInt(bpSys.value);
        const dia = parseInt(bpDia.value);
        if (!sys || !dia) { bpHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400"; bpHint.textContent = "Enter Value"; return; }

        if (sys < 120 && dia < 80) { bpHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-600"; bpHint.textContent = "Normal"; }
        else if (sys >= 140 || dia >= 90) { bpHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 animate-pulse"; bpHint.innerHTML = "<span class='material-symbols-outlined text-[12px] align-middle mr-1'>warning</span>High (Stage 2)"; }
        else if (sys >= 130 || dia >= 80) { bpHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-600"; bpHint.textContent = "High (Stage 1)"; }
        else { bpHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600"; bpHint.textContent = "Elevated"; }
    }
    bpSys?.addEventListener('input', updateBPHint);
    bpDia?.addEventListener('input', updateBPHint);

    const sugar = document.getElementById('sugar');
    const sugarHint = document.getElementById('sugar-hint');
    sugar?.addEventListener('input', () => {
        const val = parseInt(sugar.value);
        if (!val) { sugarHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-400"; sugarHint.textContent = "Enter Value"; return; }
        if (val < 100) { sugarHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-600"; sugarHint.textContent = "Normal"; }
        else if (val < 126) { sugarHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600"; sugarHint.textContent = "Pre-diabetic"; }
        else { sugarHint.className = "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-600 animate-pulse"; sugarHint.innerHTML = "<span class='material-symbols-outlined text-[12px] align-middle mr-1'>warning</span>High"; }
    });
}
