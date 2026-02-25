import { api } from '../api.js';

export async function renderPharmaResult(container, params = {}) {
    const medName = params.name || 'Medicine';
    const medDosage = params.dosage || '';
    const currentPrice = params.price || '';

    // Show loading while Gemini processes
    container.innerHTML = `
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center gap-3">
        <button onclick="app.navigateTo('pharma')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
            <span class="material-symbols-outlined text-slate-700">arrow_back</span>
        </button>
        <h1 class="text-lg font-bold">Comparing ${medName}</h1>
    </header>
    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-6 text-center pt-16">
        <div class="flex justify-center mb-4">
            <div class="relative">
                <div style="width:64px;height:64px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:24px">medication</span>
            </div>
        </div>
        <h2 class="text-lg font-bold text-slate-800">Analyzing ${medName}...</h2>
        <p class="text-sm text-slate-500">Finding generic alternatives, prices, and pharmacy links</p>
        <div class="space-y-2.5 pt-4 max-w-xs mx-auto text-left">
            <div class="flex items-center gap-3"><span class="size-2 bg-primary rounded-full animate-pulse"></span><span class="text-sm text-slate-600">Identifying active ingredients</span></div>
            <div class="flex items-center gap-3 opacity-40"><span class="size-2 bg-slate-400 rounded-full"></span><span class="text-sm text-slate-500">Finding alternatives</span></div>
            <div class="flex items-center gap-3 opacity-40"><span class="size-2 bg-slate-400 rounded-full"></span><span class="text-sm text-slate-500">Comparing prices</span></div>
        </div>
    </main>`;

    // Call the real Gemini-powered API
    let data = {};
    let error = false;
    try {
        data = await api.compareMedicine(medName, medDosage);
    } catch (e) {
        error = true;
        data = {
            original: { name: medName, generic_name: 'Error', description: e.message, uses: [], side_effects: [], estimated_price: currentPrice || 'N/A' },
            alternatives: [],
            buy_links: {},
            note: 'Failed to fetch data. Please try again.'
        };
    }

    const orig = data.original || {};
    const alts = data.alternatives || [];
    const links = data.buy_links || {};
    const note = data.note || '';
    const precautions = data.precautions || '';
    const uses = orig.uses || [];
    const sideEffects = orig.side_effects || [];

    // Calculate best savings
    const origPrice = parseInt((orig.estimated_price || '0').replace(/[^0-9]/g, '')) || 0;
    let bestSaving = 0;
    let bestAlt = alts[0] || {};
    alts.forEach(a => {
        const s = parseInt((a.savings || '0').replace(/[^0-9]/g, '')) || 0;
        if (s > bestSaving) { bestSaving = s; bestAlt = a; }
    });
    const bestAltPrice = parseInt((bestAlt.estimated_price || '0').replace(/[^0-9]/g, '')) || 0;
    const savedAmount = origPrice - bestAltPrice;

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('pharma')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold">Medicine Details</h1>
        </div>
        <button id="share-compare" class="p-2 hover:bg-primary/10 rounded-full transition-colors">
            <span class="material-symbols-outlined text-slate-700">share</span>
        </button>
    </header>

    <main class="max-w-lg mx-auto p-4 pb-24 page-enter space-y-5">

        <!-- ═══ Original Medicine Card ═══ -->
        <section class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-start justify-between mb-3">
                <div>
                    <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Your Prescription</p>
                    <h2 class="text-xl font-bold">${orig.name || medName}</h2>
                    ${medDosage ? `<p class="text-sm text-white/60 mt-0.5">${medDosage}</p>` : ''}
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold">Price</p>
                    <p class="text-2xl font-bold text-white">${orig.estimated_price || currentPrice || 'N/A'}</p>
                </div>
            </div>
            <div class="bg-white/10 rounded-lg p-3 mt-3">
                <p class="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Active Ingredient</p>
                <p class="font-semibold text-white/90">${orig.generic_name || '—'}</p>
            </div>
            ${orig.manufacturer ? `<p class="text-xs text-white/40 mt-3">By ${orig.manufacturer}</p>` : ''}
        </section>

        <!-- ═══ Description ═══ -->
        ${orig.description ? `
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-primary text-lg">info</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-primary">About This Medicine</h3>
            </div>
            <p class="text-sm text-slate-700 leading-relaxed">${orig.description}</p>
        </section>` : ''}

        <!-- ═══ Uses ═══ -->
        ${uses.length ? `
        <section class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">medical_information</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Common Uses</h3>
            </div>
            <div class="flex flex-wrap gap-2">
                ${uses.map(u => `<span class="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">${u}</span>`).join('')}
            </div>
        </section>` : ''}

        <!-- ═══ Savings Hero ═══ -->
        ${alts.length && bestSaving > 0 ? `
        <section class="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-emerald-500/20">
            <span class="material-symbols-outlined text-4xl opacity-80 mb-1">savings</span>
            <p class="text-xs font-semibold text-emerald-100 uppercase tracking-widest mb-1">Potential Savings</p>
            <h2 class="text-4xl font-bold mb-1">${savedAmount > 0 ? '₹' + savedAmount : bestSaving + '%'}</h2>
            <p class="text-sm text-emerald-50">Save up to <span class="font-bold">${bestSaving}%</span> with generic alternatives</p>
        </section>` : ''}

        <!-- ═══ Alternatives ═══ -->
        ${alts.length ? `
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-emerald-500 text-lg">swap_horiz</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Generic Alternatives (${alts.length})</h3>
            </div>
            <div class="space-y-3">
                ${alts.map((alt, i) => `
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="size-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-sm font-bold">${i + 1}</div>
                            <div>
                                <h4 class="font-bold text-slate-800 flex items-center gap-1.5">
                                    ${alt.name}
                                    ${i === 0 ? '<span class="material-symbols-outlined text-emerald-500 text-[14px]">verified</span>' : ''}
                                </h4>
                                <p class="text-xs text-slate-500">${alt.manufacturer || ''}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-emerald-600 text-lg">${alt.estimated_price || '—'}</p>
                            ${alt.savings ? `<span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">Save ${alt.savings}</span>` : ''}
                        </div>
                    </div>
                    ${alt.buy_link ? `
                    <a href="${alt.buy_link}" target="_blank" rel="noopener" class="mt-3 w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <span class="material-symbols-outlined text-[16px]">shopping_cart</span> Buy Online
                    </a>` : ''}
                </div>`).join('')}
            </div>
        </section>` : `
        <section class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
            <p class="text-sm text-slate-500 font-medium">No alternatives found for this medicine.</p>
        </section>`}

        <!-- ═══ Buy Links ═══ -->
        ${Object.keys(links).length ? `
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">shopping_bag</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Buy ${orig.name || medName} Online</h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
                ${links['1mg'] ? `
                <a href="${links['1mg']}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">local_pharmacy</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">1mg</p>
                </a>` : ''}
                ${links['pharmeasy'] ? `
                <a href="${links['pharmeasy']}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">storefront</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">PharmEasy</p>
                </a>` : ''}
                ${links['netmeds'] ? `
                <a href="${links['netmeds']}" target="_blank" rel="noopener" class="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div class="size-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                        <span class="material-symbols-outlined text-lg">medication</span>
                    </div>
                    <p class="text-xs font-bold text-slate-700">Netmeds</p>
                </a>` : ''}
            </div>
        </section>` : ''}

        <!-- ═══ Side Effects ═══ -->
        ${sideEffects.length ? `
        <section class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">warning</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Common Side Effects</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
                ${sideEffects.map(se => `
                <div class="flex items-center gap-2 bg-amber-50/50 px-3 py-2 rounded-lg">
                    <span class="size-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span class="text-xs text-amber-800 font-medium">${se}</span>
                </div>`).join('')}
            </div>
        </section>` : ''}

        <!-- ═══ Precautions ═══ -->
        ${precautions ? `
        <section class="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-red-500 text-xl shrink-0 mt-0.5">health_and_safety</span>
            <div>
                <h3 class="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Precaution</h3>
                <p class="text-sm text-red-800 leading-relaxed">${precautions}</p>
            </div>
        </section>` : ''}

        <!-- ═══ Note ═══ -->
        ${note ? `
        <section class="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
            <span class="material-symbols-outlined text-slate-400 text-lg shrink-0 mt-0.5">lightbulb</span>
            <p class="text-xs text-slate-600 leading-relaxed">${note}</p>
        </section>` : ''}

        <!-- ═══ AI Disclaimer ═══ -->
        <section class="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <span class="material-symbols-outlined text-amber-500 shrink-0 text-lg">info</span>
            <p class="text-[11px] text-amber-700 leading-relaxed">
                Prices are approximate and may vary. Generic medicines contain the same active ingredients. <strong>Always consult your doctor</strong> before switching medications. Powered by Gemini AI.
            </p>
        </section>

        <!-- ═══ Ask AI Button ═══ -->
        <button onclick="app.navigateTo('chat', {q: 'Tell me everything about ${orig.name || medName}: uses, side effects, interactions, and precautions'})" class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined">auto_awesome</span>
            Ask AI More About This Medicine
        </button>
    </main>`;

    // Share button
    document.getElementById('share-compare')?.addEventListener('click', async () => {
        const text = `💊 ${orig.name || medName}\nGeneric: ${orig.generic_name || '—'}\nPrice: ${orig.estimated_price || '—'}\n\nAlternatives:\n${alts.map(a => `• ${a.name} - ${a.estimated_price} (Save ${a.savings})`).join('\n')}\n\nCompared via Medi-Sum`;
        try {
            if (navigator.share) {
                await navigator.share({ title: `Medicine Comparison: ${medName}`, text });
            } else {
                navigator.clipboard.writeText(text);
                window.app.showToast('📋 Copied to clipboard', 'info');
            }
        } catch (err) { console.warn('Share error', err); }
    });
}
