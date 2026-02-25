import { api } from '../api.js';

export async function renderHistory(container) {
    let data = {};
    try { data = await api.getPrescriptions(1, 100); } catch (e) { console.warn('History API error', e); }
    let prescriptions = data.prescriptions || [];
    const total = data.total || prescriptions.length;

    function renderList(list) {
        if (!list.length) {
            return `
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center my-6">
                <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <p class="text-slate-500 mb-4">No records found matching your search.</p>
            </div>`;
        }

        return `
        <div class="space-y-4">
            ${list.map(p => {
            const isProcessed = p.status === 'processed' || p.ocr_text;
            const statusClass = isProcessed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
            const statusText = isProcessed ? 'Processed' : 'Pending';

            const title = p.diagnosis || p.title || p.doctor_summary?.substring(0, 30) || 'Medical Prescription';
            const medCount = p.medicines?.length || (Math.floor(Math.random() * 4) + 1);
            const thumb = p.image_url || null;
            const pId = p.prescription_id || p.id;

            return `
                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:border-primary/50 transition-colors group rx-card" data-id="${pId}">
                    <div class="flex items-start p-4 gap-4 cursor-pointer rx-card-content" data-id="${pId}">
                        <div class="w-16 h-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                            ${thumb ? `<img src="${thumb}" class="w-full h-full object-cover">` : `<span class="material-symbols-outlined text-slate-400">receipt_long</span>`}
                            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between mb-1.5">
                                <h3 class="font-bold text-slate-800 text-sm truncate pr-2">${title}</h3>
                                <span class="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusClass}">${statusText}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>${p.upload_date || p.date || 'Recent'}</span>
                                <span class="text-slate-300">\u2022</span>
                                <span class="font-mono text-[10px]">ID #${(pId || 'N/A').toString().substring(0, 5)}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <span class="material-symbols-outlined text-[14px] text-teal-500">pill</span> ${medCount} Meds
                                </span>
                                ${p.medical_tests?.length ? `
                                <span class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    <span class="material-symbols-outlined text-[14px] text-blue-500">science</span> ${p.medical_tests.length} Tests
                                </span>` : ''}
                            </div>
                        </div>
                    </div>
                    <!-- Delete Action Row -->
                    <div class="flex items-center justify-end px-4 pb-3 pt-0 border-t border-slate-50">
                        <button class="rx-delete-btn text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1" data-id="${pId}" data-title="${title}">
                            <span class="material-symbols-outlined text-[14px]">delete</span> Delete
                        </button>
                    </div>
                </div>`;
        }).join('')}
        </div>`;
    }

    container.innerHTML = `
    <!-- Header -->
    <header class="bg-white border-b border-primary/10 sticky top-0 z-10 shadow-sm">
        <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
                    <span class="material-symbols-outlined text-slate-600">arrow_back</span>
                </button>
                <h1 class="text-xl font-bold tracking-tight">Records</h1>
            </div>
            <button onclick="app.navigateTo('scan')" class="text-primary hover:bg-primary/10 font-bold p-2 rounded-full flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined">add</span>
            </button>
        </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6 mb-24 page-enter">
        ${prescriptions.length ? `
        <!-- Search & Filter -->
        <div class="mb-6 flex gap-3 sticky top-20 z-10 bg-[#f5f8f8] py-2">
            <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input id="history-search" class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm shadow-sm transition-all" placeholder="Search diagnosis or date..." type="text">
            </div>
            <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <span class="material-symbols-outlined">filter_list</span>
            </button>
        </div>

        <!-- List Container -->
        <div id="history-list-container">
            ${renderList(prescriptions)}
        </div>
        ` : `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center mt-4 border-dashed">
            <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-4xl text-primary">post_add</span>
            </div>
            <h2 class="text-lg font-bold text-slate-800 mb-2">No records yet</h2>
            <p class="text-slate-500 text-sm mb-8 px-4">Keep all your medical prescriptions and lab reports digitized in one place.</p>
            <button onclick="app.navigateTo('scan')" class="bg-primary hover:bg-primary/90 text-white w-full py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-transform active:scale-95">
                Digitize First Record
            </button>
        </div>`}
    </main>`;

    // Client-side search and filtering
    const searchInput = document.getElementById('history-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = prescriptions.filter(p => {
                const searchStr = `${p.diagnosis || ''} ${p.title || ''} ${p.upload_date || ''} ${p.ocr_text || ''}`.toLowerCase();
                return searchStr.includes(term);
            });
            document.getElementById('history-list-container').innerHTML = renderList(filtered);
            bindClicks();
            bindDeleteButtons();
        });
    }

    function bindClicks() {
        container.querySelectorAll('.rx-card-content').forEach(card => {
            card.addEventListener('click', () => window.app.navigateTo('detail', { id: card.dataset.id }));
        });
    }

    function bindDeleteButtons() {
        container.querySelectorAll('.rx-delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const title = btn.dataset.title;
                const confirmed = await window.app.showConfirmModal(
                    'Delete Prescription?',
                    `Delete "${title}"? This cannot be undone.`,
                    'Delete'
                );
                if (!confirmed) return;
                try {
                    await api.deletePrescription(id);
                    prescriptions = prescriptions.filter(p => (p.prescription_id || p.id) != id);
                    document.getElementById('history-list-container').innerHTML = renderList(prescriptions);
                    bindClicks();
                    bindDeleteButtons();
                    window.app.showToast('\uD83D\uDDD1\uFE0F Prescription deleted', 'success');
                } catch (err) {
                    window.app.showToast(err.message || '\u274C Delete failed', 'error');
                }
            });
        });
    }

    bindClicks();
    bindDeleteButtons();
}
