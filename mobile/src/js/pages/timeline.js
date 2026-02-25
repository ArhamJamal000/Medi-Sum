import { api } from '../api.js';

export async function renderTimeline(container) {
    // Show Skeleton Loader initially
    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 shadow-sm">
        <div class="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
            <button onclick="app.navigateTo('dashboard')" class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold tracking-tight">Health Timeline</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <div class="px-4 py-4 max-w-2xl mx-auto sticky top-16 z-40 bg-[#f5f8f8]">
        <div class="h-12 bg-slate-200 rounded-xl animate-pulse mb-4"></div>
        <div class="flex gap-2">
            <div class="h-8 w-20 bg-slate-200 rounded-full animate-pulse"></div>
            <div class="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
            <div class="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
    </div>

    <main class="max-w-2xl mx-auto px-4 space-y-8 pb-24 mt-6">
        <div class="space-y-6 relative pl-6">
            <div class="absolute left-[19px] top-4 bottom-0 w-0.5 bg-slate-200"></div>
            <!-- Skeleton Items -->
            ${[1, 2, 3].map(() => `
            <div class="relative pl-8">
                <div class="absolute left-[-23px] top-1 size-10 rounded-full bg-slate-200 animate-pulse border-4 border-white"></div>
                <div class="bg-white rounded-xl p-5 border border-slate-100 h-32 animate-pulse">
                    <div class="h-3 w-20 bg-slate-200 rounded mb-4"></div>
                    <div class="h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                    <div class="h-3 w-full bg-slate-200 rounded mb-2"></div>
                    <div class="h-3 w-5/6 bg-slate-200 rounded"></div>
                </div>
            </div>`).join('')}
        </div>
    </main>`;

    let data = {};
    try {
        // Simulate network delay for skeleton view
        await new Promise(r => setTimeout(r, 600));
        data = await api.getTimeline(1, 100);
    } catch (e) { console.warn('Timeline API error', e); }
    const allEvents = data.events || [];

    // Helper to get color and icon based on title/type
    function getCategoryStyles(title) {
        const t = (title || '').toLowerCase();
        if (t.includes('dental') || t.includes('tooth')) return { color: 'text-indigo-500', bg: 'bg-indigo-100', ring: 'ring-indigo-100', icon: 'dentistry' };
        if (t.includes('cardio') || t.includes('heart')) return { color: 'text-rose-500', bg: 'bg-rose-100', ring: 'ring-rose-100', icon: 'cardiology' };
        if (t.includes('eye') || t.includes('vision')) return { color: 'text-sky-500', bg: 'bg-sky-100', ring: 'ring-sky-100', icon: 'visibility' };
        if (t.includes('lab') || t.includes('blood')) return { color: 'text-purple-500', bg: 'bg-purple-100', ring: 'ring-purple-100', icon: 'water_drop' };
        return { color: 'text-primary', bg: 'bg-primary/20', ring: 'ring-primary/10', icon: 'stethoscope' };
    }

    function renderEvents(events) {
        if (!events.length) {
            return `
            <div class="text-center py-20">
                <span class="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
                <h3 class="text-lg font-bold text-slate-700 mb-2">No timeline events found</h3>
                <p class="text-sm text-slate-500 mb-6">Try adjusting your search filters.</p>
            </div>`;
        }

        const grouped = {};
        events.forEach(ev => {
            const d = new Date(ev.date || ev.upload_date);
            const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ev);
        });
        const months = Object.keys(grouped);

        return months.map((month, mi) => `
        <section class="relative">
            <div class="sticky top-16 z-30 py-2 bg-[#f5f8f8]">
                <h2 class="font-mono text-sm font-bold ${mi === 0 ? 'text-primary' : 'text-slate-500'} tracking-widest uppercase flex items-center gap-2">
                    ${mi === 0 ? '<span class="size-2 rounded-full bg-primary animate-pulse"></span>' : ''}
                    ${month}
                </h2>
            </div>
            <div class="mt-4 space-y-6 relative">
                <div class="timeline-line absolute left-[19px] top-4 bottom-0 w-0.5 bg-slate-200" style="z-index: 0;"></div>
                ${grouped[month].map((ev, ei) => {
            const isFirst = mi === 0 && ei === 0;
            const style = getCategoryStyles(ev.title || ev.diagnosis);

            // The node itself
            const nodeClass = isFirst
                ? `size-10 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center relative z-10 ${style.color} ${style.bg} ring-4 ${style.ring}`
                : `size-10 rounded-full bg-slate-50 border-4 border-white flex items-center justify-center relative z-10 text-slate-400`;

            const iconToUse = isFirst ? style.icon : 'radio_button_checked';

            const d = new Date(ev.date || ev.upload_date);
            const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            return `
                    <article class="relative pl-14 cursor-pointer group" data-id="${ev.prescription_id || ev.id || ''}">
                        <div class="absolute left-0 top-1">
                            <div class="${nodeClass}">
                                <span class="material-symbols-outlined text-[18px]">${iconToUse}</span>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-primary/30 transition-all">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono font-bold text-slate-500">${dateStr}</span>
                                <span class="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
                                    <span class="material-symbols-outlined text-[12px] ${style.color}">medical_services</span> Visit
                                </span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-800 mb-2 leading-tight">${ev.title || ev.diagnosis || 'Medical Visit'}</h3>
                            <p class="text-sm text-slate-600 leading-relaxed mb-4">${ev.description || ev.clinical_summary || ev.patient_summary || ''}</p>
                            ${(ev.ai_summary || ev.details) ? `
                            <div class="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
                                <div class="flex items-center gap-2 mb-1">
                                    <span class="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                                    <span class="text-[10px] font-bold uppercase tracking-tighter text-primary">AI Insight</span>
                                </div>
                                <p class="text-xs italic text-slate-700">${ev.ai_summary || ev.details || ''}</p>
                            </div>` : ''}
                            
                            <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>View Details</span>
                                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </div>
                        </div>
                    </article>`;
        }).join('')}
            </div>
        </section>`).join('');
    }

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 shadow-sm animate-fade-in-up">
        <div class="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
            <button onclick="app.navigateTo('dashboard')" class="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-lg font-bold tracking-tight">Health Timeline</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <!-- Search and Filters -->
    <div class="px-4 py-4 max-w-2xl mx-auto sticky top-16 z-40 bg-[#f5f8f8] animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="flex items-center gap-3 mb-4">
            <div class="relative group flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                <input id="timeline-search" class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" placeholder="Search diagnoses or dates..." type="text">
            </div>
            
            <div class="flex items-center bg-slate-200/60 p-1 rounded-xl shrink-0">
                <button class="size-10 rounded-lg bg-white shadow-sm text-primary flex items-center justify-center transition-all" title="List View">
                    <span class="material-symbols-outlined text-[20px]">format_list_bulleted</span>
                </button>
                <button class="size-10 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all" title="Calendar View" onclick="window.app.showToast('Calendar view coming soon', 'info')">
                    <span class="material-symbols-outlined text-[20px]">calendar_month</span>
                </button>
            </div>
        </div>
        
        <!-- Filter Chips -->
        <div class="flex gap-2 overflow-x-auto hide-scrollbar mt-3 pb-1">
            <button class="filter-chip active px-3 py-1.5 rounded-full bg-slate-800 text-white text-[11px] font-bold whitespace-nowrap" data-filter="">All History</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="dental">Dental</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="cardio">Cardiology</button>
            <button class="filter-chip px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap hover:bg-slate-50" data-filter="lab">Lab Results</button>
        </div>
    </div>

    <main class="max-w-2xl mx-auto px-4 space-y-8 pb-24 page-enter">
        <div id="timeline-list">
            ${renderEvents(allEvents)}
        </div>
    </main>

    <!-- FAB -->
    <button onclick="app.navigateTo('scan')" class="fixed bottom-24 right-4 size-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 animate-fade-in-up" style="animation-delay: 0.3s;">
        <span class="material-symbols-outlined text-3xl">add</span>
    </button>`;

    // ── Calendar View Logic ──
    let isCalendarView = false;
    let currentDateDisplay = new Date();

    function renderCalendar() {
        if (!allEvents.length) return renderEvents([]);

        const year = currentDateDisplay.getFullYear();
        const month = currentDateDisplay.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let html = `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div class="flex items-center justify-between mb-4">
                <button id="prev-month" class="p-2 hover:bg-slate-100 rounded-lg transition-colors"><span class="material-symbols-outlined text-slate-600">chevron_left</span></button>
                <h2 class="text-lg font-bold text-slate-800">${monthNames[month]} ${year}</h2>
                <button id="next-month" class="p-2 hover:bg-slate-100 rounded-lg transition-colors"><span class="material-symbols-outlined text-slate-600">chevron_right</span></button>
            </div>
            <div class="grid grid-cols-7 gap-1 text-center mb-2">
                ${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => `<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${d}</div>`).join('')}
            </div>
            <div class="grid grid-cols-7 gap-1 text-center">
        `;

        let day = 1;
        for (let i = 0; i < 42; i++) {
            if (i < startingDay || day > monthLength) {
                html += `<div class="p-2 h-10"></div>`;
            } else {
                // Check if this date has events
                const checkDate = new Date(year, month, day).toDateString();
                const eventsOnDay = allEvents.filter(ev => {
                    return new Date(ev.date || ev.upload_date).toDateString() === checkDate;
                });

                const hasEventsClass = eventsOnDay.length > 0 ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-slate-600 hover:bg-slate-50';
                const todayClass = new Date().toDateString() === checkDate ? 'ring-2 ring-primary ring-offset-1' : '';

                html += `
                <button data-date="${year}-${month + 1}-${day}" class="calendar-day p-0 w-full aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors ${hasEventsClass} ${todayClass}">
                    <span>${day}</span>
                    ${eventsOnDay.length > 0 ? `<div class="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>` : ''}
                </button>`;
                day++;
            }
        }

        html += `</div></div>`;

        // Show events for the current month below
        const monthEvents = allEvents.filter(ev => {
            const d = new Date(ev.date || ev.upload_date);
            return d.getMonth() === month && d.getFullYear() === year;
        });

        html += `<div id="calendar-events-list">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Events in ${monthNames[month]}</h3>
            ${renderEvents(monthEvents)}
        </div>`;

        return html;
    }

    // Toggle views
    const listBtn = container.querySelector('button[title="List View"]');
    const calBtn = container.querySelector('button[title="Calendar View"]');
    const timelineList = document.getElementById('timeline-list');

    function updateView() {
        if (isCalendarView) {
            listBtn.classList.replace('bg-white', 'text-slate-400');
            listBtn.classList.replace('text-primary', 'hover:text-slate-600');
            listBtn.classList.replace('shadow-sm', 'bg-transparent');

            calBtn.classList.replace('text-slate-400', 'text-primary');
            calBtn.classList.replace('hover:text-slate-600', 'bg-white');
            calBtn.classList.add('shadow-sm');

            timelineList.innerHTML = renderCalendar();

            // Calendar event listeners
            document.getElementById('prev-month')?.addEventListener('click', () => {
                currentDateDisplay.setMonth(currentDateDisplay.getMonth() - 1);
                updateView();
            });
            document.getElementById('next-month')?.addEventListener('click', () => {
                currentDateDisplay.setMonth(currentDateDisplay.getMonth() + 1);
                updateView();
            });
            container.querySelectorAll('.calendar-day').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!btn.dataset.date) return;
                    const dateObj = new Date(btn.dataset.date);
                    const selectedEvents = allEvents.filter(ev => new Date(ev.date || ev.upload_date).toDateString() === dateObj.toDateString());
                    if (selectedEvents.length) {
                        document.getElementById('calendar-events-list').innerHTML = `
                            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Events on ${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                            ${renderEvents(selectedEvents)}
                        `;
                        bindClicks();
                    } else {
                        window.app.showToast('No events on this date', 'info');
                    }
                });
            });

        } else {
            calBtn.classList.replace('bg-white', 'text-slate-400');
            calBtn.classList.replace('text-primary', 'hover:text-slate-600');
            calBtn.classList.remove('shadow-sm');

            listBtn.classList.replace('text-slate-400', 'text-primary');
            listBtn.classList.replace('hover:text-slate-600', 'bg-white');
            listBtn.classList.add('shadow-sm');

            applyFilters();
        }
        bindClicks();
    }

    listBtn.addEventListener('click', () => { isCalendarView = false; updateView(); });
    // Remove the toast onclick from calendar button and add real listener
    calBtn.removeAttribute('onclick');
    calBtn.addEventListener('click', () => { isCalendarView = true; updateView(); });

    // Client-side filtering logic
    const searchInput = document.getElementById('timeline-search');
    let currentFilter = '';

    function applyFilters() {
        if (isCalendarView) return; // Search/filter disabled in calendar view for simplicity, or re-render
        const term = searchInput.value.toLowerCase();
        const filtered = allEvents.filter(ev => {
            const str = `${ev.diagnosis || ''} ${ev.title || ''} ${ev.upload_date || ''} ${ev.description || ''}`.toLowerCase();
            const matchesSearch = str.includes(term);
            const matchesChip = currentFilter ? str.includes(currentFilter) : true;
            return matchesSearch && matchesChip;
        });
        timelineList.innerHTML = renderEvents(filtered);
        bindClicks();
    }

    searchInput?.addEventListener('input', applyFilters);

    container.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            if (isCalendarView) return; // Disabled in calendar view
            container.querySelectorAll('.filter-chip').forEach(b => {
                b.classList.remove('bg-slate-800', 'text-white');
                b.classList.add('bg-white', 'border-slate-200', 'text-slate-600');
            });
            btn.classList.remove('bg-white', 'border-slate-200', 'text-slate-600');
            btn.classList.add('bg-slate-800', 'text-white');
            currentFilter = btn.dataset.filter;
            applyFilters();
        });
    });

    function bindClicks() {
        container.querySelectorAll('article[data-id]').forEach(el => {
            el.addEventListener('click', () => { if (el.dataset.id) window.app.navigateTo('detail', { id: el.dataset.id }); });
        });
    }
    bindClicks();
}
