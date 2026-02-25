import { api } from '../api.js';

export async function renderPharma(container) {
    let data = {};
    try { data = await api.getPharmaAssist(); } catch (e) { console.warn('Pharma API error', e); }
    const medicines = data.medicines || [];

    const iconColors = ['bg-blue-50 text-blue-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600', 'bg-teal-50 text-teal-600'];
    const iconNames = ['medication', 'vaccines', 'pill', 'healing'];

    function stripHtml(html) {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-4">
        <div class="flex items-center justify-between max-w-lg mx-auto w-full">
            <div class="flex items-center gap-3">
                <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                    <span class="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <div class="bg-primary/10 p-2 rounded-lg"><span class="material-symbols-outlined text-primary">pill</span></div>
                <h1 class="text-xl font-bold tracking-tight">Pharma Assist</h1>
            </div>
            <button class="p-2 hover:bg-primary/5 rounded-full transition-colors">
                <span class="material-symbols-outlined text-slate-600">notifications</span>
            </button>
        </div>
    </header>

    <main class="flex-1 max-w-lg mx-auto w-full px-4 pb-24 page-enter">
        <!-- Hero -->
        <section class="py-6">
            <h2 class="text-2xl font-bold leading-tight mb-2">Find affordable alternatives</h2>
            <p class="text-slate-500 text-sm mb-6">Compare your current prescriptions with generic options and save up to 60%.</p>
            <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input id="pharma-search" class="block w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-primary shadow-sm text-base placeholder:text-slate-400 transition-all" placeholder="Search for a medicine..." type="text">
            </div>
        </section>

        <!-- Medicines List -->
        <section class="space-y-4">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold">Your Medicines</h3>
                <button class="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            ${medicines.length ? medicines.map((med, i) => {
        const hasSavings = med.savings || med.cheaper_found;
        const ic = iconColors[i % iconColors.length];
        const iName = iconNames[i % iconNames.length];
        const name = stripHtml(med.name || '');
        const dosage = stripHtml(med.dosage || '');

        return `
                <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 ${!hasSavings ? 'opacity-80' : ''}">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex gap-3">
                            <div class="size-10 rounded-lg ${ic} flex items-center justify-center"><span class="material-symbols-outlined">${iName}</span></div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-base leading-tight">${name}</h4>
                                <p class="text-xs text-slate-500 mt-0.5">${stripHtml(med.dosage || '')} • ${stripHtml(med.frequency || '')}</p>
                            </div>
                        </div>
                        ${hasSavings ? `<span class="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">${stripHtml(med.savings || '') || 'Cheaper Found'}</span>` : ''}
                    </div>
                    
                    <!-- Compare Logic Container -->
                    <div class="compare-container">
                        <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                            <button class="compare-btn ${hasSavings ? 'bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20' : 'border border-primary text-primary hover:bg-primary/5'} px-5 py-2 rounded-lg text-sm font-semibold transition-all w-full" data-name="${name}" data-dosage="${dosage}">
                                ${med.compare_label || 'Compare & View Details'}
                            </button>
                        </div>
                        
                        <!-- Hidden Results UI -->
                        <div class="compare-result hidden mt-4 pt-4 border-t border-dashed border-slate-200 animate-fade-in-up">
                            <div class="bg-emerald-50 border border-emerald-100 rounded-lg p-3 relative">
                                <span class="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">RECOMMENDED</span>
                                <p class="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Generic Alternative</p>
                                <div class="flex justify-between items-end">
                                    <div>
                                        <p class="font-bold text-slate-800 result-name">Loading...</p>
                                        <p class="text-[10px] text-slate-500">Same active ingredients</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-lg text-emerald-600 result-price">--</p>
                                        <p class="text-[10px] font-bold text-emerald-500 result-saving">Save --</p>
                                    </div>
                                </div>
                                <button class="w-full mt-3 bg-white border border-emerald-200 text-emerald-700 py-1.5 rounded-md text-xs font-bold hover:bg-emerald-100 transition-colors">Find Nearby Pharmacy</button>
                            </div>
                        </div>
                    </div>
                </div>`;
    }).join('') : `
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                <span class="material-symbols-outlined text-4xl text-slate-300 mb-3">pill</span>
                <p class="text-sm text-slate-500">No medicines found. Upload a prescription to get started.</p>
            </div>`}
        </section>

        <!-- Intelligence Tip -->
        <section class="mt-8">
            <div class="bg-primary/10 rounded-2xl p-6 relative overflow-hidden">
                <div class="relative z-10">
                    <h4 class="text-primary font-bold text-lg mb-1">Prescription Intelligence</h4>
                    <p class="text-slate-600 text-sm leading-relaxed mb-4">Upload a photo of your prescription to automatically find generic equivalents at local pharmacies.</p>
                    <button onclick="app.navigateTo('scan')" class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">upload</span>
                        Upload Recipe
                    </button>
                </div>
                <div class="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
                    <span class="material-symbols-outlined text-primary text-[120px]">science</span>
                </div>
            </div>
        </section>
    </main>`;

    // Compare buttons → navigate to full comparison page
    container.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const dosage = btn.dataset.dosage;
            if (!name) return;
            window.app.navigateTo('pharma-result', { name, dosage });
        });
    });

    // Search functionality — real-time client-side filtering
    const searchInput = document.getElementById('pharma-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            const cards = container.querySelectorAll('.compare-container');
            cards.forEach(card => {
                const cardRoot = card.closest('.bg-white.p-4');
                if (!cardRoot) return;
                const name = cardRoot.querySelector('h4')?.textContent?.toLowerCase() || '';
                cardRoot.style.display = name.includes(query) || !query ? '' : 'none';
            });
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.app.showToast(`Showing results for "${query}"`, 'info');
                }
            }
        });
    }
}

