import { api } from '../api.js';
import { getLocalImage, hasLocalImage } from '../localdb.js';
import { quickAddReminder } from './reminders.js';

export async function renderDetail(container, prescriptionId) {
    if (!prescriptionId) { window.app.navigateTo('history'); return; }
    let p = {};
    try { const data = await api.getPrescription(prescriptionId); p = data.prescription || data; } catch (e) { throw e; }

    const medicines = p.medicines || [];
    const tests = p.medical_tests || p.tests || [];
    const imgUrl = p.image_url || '';
    const d = p.prescription_date || p.upload_date || p.date || '';
    const uploadDate = p.upload_date || '';

    // Check for locally stored image first (privacy)
    let localImg = null;
    let isStoredLocally = false;
    try {
        localImg = await getLocalImage(prescriptionId);
        isStoredLocally = await hasLocalImage(prescriptionId);
    } catch (e) { /* ignore */ }
    const displayImgSrc = localImg ? `data:image/jpeg;base64,${localImg.data}` : imgUrl;

    // Use STRUCTURED data from API (Gemini-extracted), fallback to OCR parsing for old prescriptions
    const ocr = p.ocr_text || '';
    const apiPatient = p.patient_info || {};
    const apiDoctor = p.doctor_info || {};

    // Patient info: prefer API-extracted data, fallback to OCR regex
    const ocrPatient = parsePatientInfo(ocr);
    const patientInfo = {
        name: apiPatient.name || ocrPatient.name || '',
        id: apiPatient.patient_id || ocrPatient.id || '',
        age: apiPatient.age || ocrPatient.age || '',
        gender: apiPatient.gender || ocrPatient.gender || '',
        mobile: apiPatient.mobile || ocrPatient.mobile || '',
        address: apiPatient.address || ocrPatient.address || '',
        visitType: apiPatient.visit_type || ocrPatient.visitType || '',
        referredBy: ocrPatient.referredBy || ''
    };

    // Doctor info: prefer API-extracted data, fallback to OCR regex
    const ocrDoctor = parseDoctorInfo(ocr);
    const doctorInfo = {
        name: apiDoctor.name || ocrDoctor.name || 'Doctor name not found',
        qualifications: [apiDoctor.qualifications, apiDoctor.specialty].filter(Boolean).join(' • ') || ocrDoctor.qualifications || '',
        hospital: apiDoctor.hospital || ocrDoctor.hospital || ''
    };

    const vitalsInfo = parseVitals(ocr);
    const diagnosisInfo = parseDiagnosis(ocr, p.key_insights);
    const specialInstructions = parseInstructions(ocr, medicines);

    // Format dates
    const formattedDate = d ? formatDate(d) : 'Not available';
    const formattedUploadDate = uploadDate ? formatDate(uploadDate) : '';

    container.innerHTML = `
    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2" title="Back to Dashboard">
                <span class="material-symbols-outlined text-slate-700">arrow_back</span>
            </button>
            <h1 class="text-sm font-bold mono-heading text-primary">PRESCRIPTION_REPORT</h1>
        </div>
        <div class="flex gap-1 -mr-2">
            <button onclick="app.navigateTo('history')" class="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View All Prescriptions">All Records</button>
            <button id="share-btn" class="p-2 hover:bg-primary/10 rounded-full transition-colors text-slate-600"><span class="material-symbols-outlined">share</span></button>
        </div>
    </nav>

    <main class="max-w-2xl mx-auto p-4 space-y-5 pb-28 page-enter">

        <!-- ═══════════ PATIENT INFORMATION ═══════════ -->
        <section class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
            <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary text-lg">person</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-white/60">Patient Information</h3>
            </div>
            <div class="flex items-center gap-4 mb-4">
                <div class="size-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold border border-white/20">
                    ${(patientInfo.name || 'P')[0].toUpperCase()}
                </div>
                <div>
                    <h2 class="text-xl font-bold">${patientInfo.name || 'Patient Name Not Found'}</h2>
                    ${patientInfo.id ? `<span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">ID: ${patientInfo.id}</span>` : ''}
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Age</p><p class="font-semibold text-sm">${patientInfo.age || '-'}</p></div>
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Gender</p><p class="font-semibold text-sm">${patientInfo.gender || '-'}</p></div>
                ${patientInfo.mobile ? `<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Mobile</p><p class="font-semibold text-sm">${patientInfo.mobile}</p></div>` : ''}
                ${patientInfo.address ? `<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Address</p><p class="font-semibold text-sm">${patientInfo.address}</p></div>` : ''}
                ${patientInfo.visitType ? `<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Visit Type</p><p class="font-semibold text-sm">${patientInfo.visitType}</p></div>` : ''}
                ${patientInfo.referredBy ? `<div><p class="text-[10px] text-white/40 uppercase tracking-wider">Referred By</p><p class="font-semibold text-sm">${patientInfo.referredBy}</p></div>` : ''}
                <div><p class="text-[10px] text-white/40 uppercase tracking-wider">Visit Date</p><p class="font-semibold text-sm">${formattedDate}</p></div>
            </div>
        </section>

        <!-- ═══════════ DOCTOR INFORMATION ═══════════ -->
        <section class="bg-blue-50/70 border border-blue-100 rounded-xl p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">stethoscope</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-blue-400">Doctor Information</h3>
            </div>
            <div class="flex items-center gap-3">
                <div class="size-12 rounded-full bg-white border border-blue-200 text-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                    <span class="material-symbols-outlined text-[24px]">stethoscope</span>
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 text-base">${doctorInfo.name}</h3>
                    ${doctorInfo.qualifications ? `<p class="text-xs text-slate-500 mt-1 leading-relaxed">${doctorInfo.qualifications}</p>` : ''}
                    ${doctorInfo.hospital ? `<p class="text-[10px] text-blue-500 font-semibold mt-1">${doctorInfo.hospital}</p>` : ''}
                </div>
            </div>
        </section>



        <!-- ═══════════ VITAL SIGNS ═══════════ -->
        ${vitalsInfo.length ? `
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-rose-500 text-lg">monitor_heart</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Vital Signs</h3>
            </div>
            <div class="grid grid-cols-3 gap-3">
                ${vitalsInfo.map(v => `
                <div class="bg-white border border-slate-100 rounded-xl p-3 shadow-sm text-center">
                    <span class="material-symbols-outlined text-${v.color} text-lg mb-1">${v.icon}</span>
                    <p class="text-lg font-bold text-slate-800">${v.value}</p>
                    <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">${v.label}</p>
                </div>`).join('')}
            </div>
        </section>` : ''}

        <!-- ═══════════ IMAGE PREVIEW ═══════════ -->
        ${displayImgSrc ? `
        <section class="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-white">
            ${isStoredLocally ? '<div class="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md"><span class="material-symbols-outlined text-[12px]">lock</span> Stored Locally</div>' : ''}
            <div class="aspect-[16/9] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style="background-image:url('${displayImgSrc}');background-color:#f1f5f9;"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-4">
                <button id="view-scan-btn" class="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors border border-white/20">
                    <span class="material-symbols-outlined text-sm">fullscreen</span>View Original Scan
                </button>
            </div>
        </section>` : ''}

        <!-- ═══════════ PATIENT SUMMARY ═══════════ -->
        ${p.patient_summary ? `
        <section class="bg-primary/5 border border-primary/15 rounded-xl p-5 relative overflow-hidden">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-primary text-lg">summarize</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-primary">Patient Summary</h3>
            </div>
            <p class="text-slate-800 leading-relaxed font-medium">${p.patient_summary}</p>
        </section>` : ''}

        <!-- ═══════════ CLINICAL SUMMARY ═══════════ -->
        ${p.doctor_summary ? `
        <section class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-slate-500 text-lg">clinical_notes</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Clinical Summary</h3>
            </div>
            <p class="text-sm text-slate-700 italic leading-relaxed">${p.doctor_summary}</p>
        </section>` : ''}

        <!-- ═══════════ MEDICINES ═══════════ -->
        ${medicines.length ? `
        <section>
            <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-teal-500 text-lg">medication</span>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Medicines (${medicines.length})</h3>
                </div>
            </div>
            <div class="space-y-3">
                ${medicines.map((m, i) => `
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="size-8 rounded-lg bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 text-sm font-bold">${i + 1}</div>
                            <div>
                                <h4 class="font-bold text-slate-800 text-base">${m.name || ''}</h4>
                                ${m.dosage ? `<span class="text-xs text-slate-500">${m.dosage}</span>` : ''}
                            </div>
                        </div>
                        <button onclick="app.navigateTo('chat', {q: 'Explain what ${m.name} is used for, side effects, and precautions'})" class="text-[10px] text-primary font-bold flex items-center gap-0.5 bg-primary/5 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors shrink-0">
                            <span class="material-symbols-outlined text-[12px]">auto_awesome</span> AI Info
                        </button>
                        <button class="set-reminder-btn text-[10px] text-amber-600 font-bold flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg hover:bg-amber-100 transition-colors shrink-0" data-name="${m.name}" data-dosage="${m.dosage || ''}">
                            <span class="material-symbols-outlined text-[12px]">alarm_add</span> Remind
                        </button>
                    </div>
                    <div class="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-50">
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Frequency</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${m.frequency || '—'}</p>
                        </div>
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Duration</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${m.duration || '—'}</p>
                        </div>
                        <div>
                            <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Timing</p>
                            <p class="text-xs font-semibold text-slate-700 mt-0.5">${m.timing || '—'}</p>
                        </div>
                    </div>
                    ${m.instructions ? `
                    <div class="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-2.5 flex items-start gap-2">
                        <span class="material-symbols-outlined text-amber-500 text-[14px] mt-0.5 shrink-0">info</span>
                        <p class="text-xs text-amber-700 leading-relaxed">${m.instructions}</p>
                    </div>` : ''}
                </div>`).join('')}
            </div>
        </section>` : ''}

        <!-- ═══════════ MEDICAL TESTS ═══════════ -->
        ${tests.length ? `
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-blue-500 text-lg">science</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Medical Tests (${tests.length})</h3>
            </div>
            <div class="space-y-3">
                ${tests.map(t => {
        const isAction = (t.status || '').toLowerCase().includes('action') || (t.status || '').toLowerCase().includes('urgent');
        const badgeClass = isAction ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600';
        const iconBg = isAction ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-500';
        return `
                    <div class="flex items-center justify-between p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center"><span class="material-symbols-outlined">science</span></div>
                            <div>
                                <p class="font-bold text-sm">${t.test_name || t.name || ''}</p>
                                ${t.instructions ? `<p class="text-xs text-slate-500 mt-0.5">${t.instructions}</p>` : ''}
                            </div>
                        </div>
                        <span class="px-2.5 py-1 ${badgeClass} rounded-full text-[10px] font-bold uppercase shrink-0">${t.status || 'Pending'}</span>
                    </div>`;
    }).join('')}
            </div>
        </section>` : ''}

        <!-- ═══════════ SPECIAL INSTRUCTIONS ═══════════ -->
        ${specialInstructions.length ? `
        <section>
            <div class="flex items-center gap-2 px-1 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">warning</span>
                <h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Special Instructions</h3>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                ${specialInstructions.map(instr => `
                <div class="flex items-start gap-2">
                    <span class="material-symbols-outlined text-amber-500 text-[16px] mt-0.5 shrink-0">check_circle</span>
                    <p class="text-sm text-amber-800 leading-relaxed">${instr}</p>
                </div>`).join('')}
            </div>
        </section>` : ''}

        <!-- ═══════════ RAW OCR ═══════════ -->
        ${p.ocr_text ? `
        <section class="border-t border-slate-200 pt-5">
            <details class="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <summary class="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-slate-100 transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">terminal</span>
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-primary transition-colors">Raw OCR Data</span>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div class="font-mono text-[11px] text-slate-500 overflow-x-auto whitespace-pre-wrap px-4 pb-4 leading-relaxed border-t border-slate-200 bg-slate-100/50">${p.ocr_text}</div>
            </details>
        </section>` : ''}

        <!-- ═══════════ METADATA ═══════════ -->
        <section class="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div class="grid grid-cols-2 gap-3 text-center">
                <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Prescription Date</p>
                    <p class="text-sm font-bold text-slate-700 mt-0.5">${formattedDate}</p>
                </div>
                <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Uploaded</p>
                    <p class="text-sm font-bold text-slate-700 mt-0.5">${formattedUploadDate || 'N/A'}</p>
                </div>
            </div>
        </section>

        <!-- Delete -->
        <div class="pt-4 pb-4 text-center">
            <button id="delete-rx" class="text-xs font-bold text-red-400 hover:text-red-500 hover:underline transition-colors py-2 px-4 rounded-lg hover:bg-red-50 inline-flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">delete</span> Delete Record permanently
            </button>
        </div>
    </main>

    <!-- FAB -->
    <button onclick="app.navigateTo('pharma')" class="fixed right-6 bottom-8 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
        <span class="material-symbols-outlined text-3xl text-white">local_pharmacy</span>
    </button>`;

    // ── Share ──
    document.getElementById('share-btn')?.addEventListener('click', async () => {
        const shareData = {
            title: `Medi-Sum: ${patientInfo.name || 'Prescription'}`,
            text: `Medical Record (${medicines.length} medicines, ${tests.length} tests). ${p.patient_summary || ''}`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.text);
                window.app.showToast('📋 Copied to clipboard', 'info');
            }
        } catch (err) { console.warn('Share error', err); }
    });

    // ── View Original Scan Modal ──
    const viewScanBtn = document.getElementById('view-scan-btn');
    if (viewScanBtn) {
        viewScanBtn.addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 z-[100] bg-black/90 flex flex-col backdrop-blur-sm animate-fade-in animate-fast';
            modal.innerHTML = `
                <div class="flex justify-between items-center p-4">
                    <span class="text-white/60 text-sm font-medium tracking-wide">Original Scan</span>
                    <button id="close-scan-btn" class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="flex-1 overflow-auto flex items-center justify-center p-2 pb-10">
                    <img src="${displayImgSrc}" class="max-w-full max-h-full object-contain rounded border-4 border-white/10" alt="Prescription Scan">
                </div>
             `;
            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('#close-scan-btn');
            const cleanup = () => {
                modal.classList.add('animate-fade-out');
                setTimeout(() => modal.remove(), 200);
            };
            closeBtn.addEventListener('click', cleanup);
            // Allow closing when clicking the background
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('flex-1')) cleanup();
            });
        });
    }

    // ── Delete ──
    document.getElementById('delete-rx')?.addEventListener('click', async () => {
        const confirmed = await window.app.showConfirmModal(
            'Delete Prescription?',
            'Delete this prescription? This cannot be undone.',
            'Delete'
        );
        if (!confirmed) return;
        try {
            await api.deletePrescription(prescriptionId);
            window.app.showToast('🗑️ Prescription deleted', 'success');
            window.app.navigateTo('history');
        } catch (e) { window.app.showToast(e.message || '❌ Delete failed', 'error'); }
    });

    // ── Set Reminder from medicine card ──
    container.querySelectorAll('.set-reminder-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const name = btn.dataset.name;
            const dosage = btn.dataset.dosage;
            if (!name) return;
            try {
                await quickAddReminder(name, dosage);
                btn.innerHTML = '<span class="material-symbols-outlined text-[12px]">check</span> Set!';
                btn.classList.remove('text-amber-600', 'bg-amber-50', 'hover:bg-amber-100');
                btn.classList.add('text-emerald-600', 'bg-emerald-50');
                btn.disabled = true;
                window.app.showToast(`🔔 Reminder set for ${name}`, 'success');
            } catch (e) {
                window.app.showToast('Failed to set reminder', 'error');
            }
        });
    });
}


// ─────────────── HELPER PARSERS ───────────────

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
}

function parsePatientInfo(ocr) {
    const info = { name: '', id: '', age: '', gender: '', mobile: '', address: '', visitType: '', referredBy: '' };
    if (!ocr) return info;

    // Patient name patterns
    const nameMatch = ocr.match(/(?:Patient\s*(?:Name)?|Mrs?\.|Miss)\s*[:\.]?\s*([A-Z][A-Za-z\s.]+?)(?:\n|$|Patient)/i);
    if (nameMatch) info.name = nameMatch[1].trim();

    // Patient ID
    const idMatch = ocr.match(/(?:Patient\s*ID|UHID|MRN|Reg(?:istration)?\s*No)\s*[:\.]?\s*(\S+)/i);
    if (idMatch) info.id = idMatch[1].trim();

    // Age
    const ageMatch = ocr.match(/(?:Age)\s*[:\.]?\s*(\d+\s*(?:years?|yrs?|Y)?)/i);
    if (ageMatch) info.age = ageMatch[1].trim();

    // Gender / Sex
    const genderMatch = ocr.match(/(?:Sex|Gender)\s*[:\.]?\s*(Male|Female|M|F|Other)/i);
    if (genderMatch) {
        const g = genderMatch[1].trim().toUpperCase();
        info.gender = g === 'M' ? 'Male' : g === 'F' ? 'Female' : genderMatch[1].trim();
    }
    // Also try Age/Sex combined format
    if (!info.gender || !info.age) {
        const combinedMatch = ocr.match(/(?:Age\s*\/\s*Sex|Age\/Sex)\s*[:\.]?\s*(\d+)\s*(?:years?|yrs?|Y)?[\s\/]*(Male|Female|M|F)?/i);
        if (combinedMatch) {
            if (!info.age && combinedMatch[1]) info.age = combinedMatch[1].trim();
            if (!info.gender && combinedMatch[2]) {
                const g = combinedMatch[2].trim().toUpperCase();
                info.gender = g === 'M' ? 'Male' : g === 'F' ? 'Female' : combinedMatch[2].trim();
            }
        }
    }

    // Mobile
    const mobileMatch = ocr.match(/(?:Mobile|Phone|Contact|Tel)\s*[:\.]?\s*(\d[\d\s-]{8,})/i);
    if (mobileMatch) info.mobile = mobileMatch[1].trim();

    // Address
    const addrMatch = ocr.match(/(?:Address)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (addrMatch) info.address = addrMatch[1].trim();

    // Visit Type
    const visitMatch = ocr.match(/(?:Visit\s*Type|Consultation\s*Type)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (visitMatch) info.visitType = visitMatch[1].trim();

    // Referred By
    const refMatch = ocr.match(/(?:Referred?\s*By|Ref(?:erral)?)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (refMatch) info.referredBy = refMatch[1].trim();

    return info;
}

function parseDoctorInfo(ocr, doctorSummary) {
    const info = { name: '', qualifications: '', hospital: '' };

    // Try extracting from doctorSummary first (API-provided data is more reliable)
    if (doctorSummary) {
        const drFromSummary = doctorSummary.match(/(?:Dr\.?\s+)([A-Z][A-Za-z\s.]+?)(?:[,\n]|MBBS|MD|MS|$)/i);
        if (drFromSummary) info.name = 'Dr. ' + drFromSummary[1].trim().replace(/^Dr\.?\s*/i, '');
    }

    if (!ocr) return { ...info, name: info.name || 'Doctor name not found' };

    // Doctor name from OCR
    if (!info.name) {
        const drMatch = ocr.match(/(?:Dr\.?\s+)([A-Z][A-Za-z\s.]+?)(?:\n|MBBS|MD|MS|Consultant|$)/i);
        if (drMatch) info.name = 'Dr. ' + drMatch[1].trim().replace(/^Dr\.?\s*/i, '');
    }

    // Final fallback
    if (!info.name) info.name = 'Doctor name not found';

    // Qualifications: look for MBBS, MD, MS, etc.
    const qualMatch = ocr.match(/((?:MBBS|MD|MS|DNB|DM|MCh|FRCS|MRCP|DCH|DGO|DA)[A-Za-z\s,.\(\)]*)/i);
    if (qualMatch) info.qualifications = qualMatch[1].trim();

    // Specialty
    const specMatch = ocr.match(/(?:Consultant|Specialist|Speciality|Department)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (specMatch && !info.qualifications.includes(specMatch[1].trim())) {
        info.qualifications = info.qualifications ? info.qualifications + ' • ' + specMatch[1].trim() : specMatch[1].trim();
    }

    // Hospital
    const hospMatch = ocr.match(/(?:Hospital|Clinic|Medical\s*Centre|Health\s*Center)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (hospMatch) info.hospital = hospMatch[1].trim();

    return info;
}

function parseVitals(ocr) {
    const vitals = [];
    if (!ocr) return vitals;

    // Blood Pressure
    const bpMatch = ocr.match(/(?:BP|Blood\s*Pressure)\s*[:\.]?\s*(\d{2,3}\s*\/\s*\d{2,3})\s*(?:mmHg)?/i);
    if (bpMatch) vitals.push({ label: 'BP', value: bpMatch[1].trim() + ' mmHg', icon: 'favorite', color: 'rose-500' });

    // SpO2
    const spo2Match = ocr.match(/(?:SpO2|Oxygen\s*Saturation|O2\s*Sat)\s*[:\.]?\s*(\d{2,3})\s*%?/i);
    if (spo2Match) vitals.push({ label: 'SpO2', value: spo2Match[1].trim() + '%', icon: 'pulmonology', color: 'blue-500' });

    // Pulse Rate / Heart Rate
    const prMatch = ocr.match(/(?:PR|Pulse\s*Rate|Heart\s*Rate|HR)\s*[:\.]?\s*(\d{2,3})\s*(?:bpm|\/min)?/i);
    if (prMatch) vitals.push({ label: 'Pulse', value: prMatch[1].trim() + ' bpm', icon: 'ecg_heart', color: 'amber-500' });

    // Temperature
    const tempMatch = ocr.match(/(?:Temp(?:erature)?)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:°?[FC])?/i);
    if (tempMatch) vitals.push({ label: 'Temp', value: tempMatch[1].trim() + '°F', icon: 'thermostat', color: 'orange-500' });

    // Weight
    const wtMatch = ocr.match(/(?:Weight|Wt)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:kg|lbs?)?/i);
    if (wtMatch) vitals.push({ label: 'Weight', value: wtMatch[1].trim() + ' kg', icon: 'monitor_weight', color: 'teal-500' });

    // Height
    const htMatch = ocr.match(/(?:Height|Ht)\s*[:\.]?\s*(\d{2,3}(?:\.\d)?)\s*(?:cm|ft|inches)?/i);
    if (htMatch) vitals.push({ label: 'Height', value: htMatch[1].trim() + ' cm', icon: 'height', color: 'purple-500' });

    return vitals;
}

function parseDiagnosis(ocr, keyInsights) {
    const info = { diagnosis: '' };
    if (!ocr) return info;

    // Look for diagnosis/condition
    const diagMatch = ocr.match(/(?:Diagnosis|Dx|Chief\s*Complaint|Impression|Initial\s*Diagnosis)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (diagMatch) info.diagnosis = diagMatch[1].trim();

    // Also check complaint
    if (!info.diagnosis) {
        const compMatch = ocr.match(/(?:Complaint|C\/O|Presenting)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
        if (compMatch) info.diagnosis = compMatch[1].trim();
    }

    return info;
}

function parseInstructions(ocr, medicines) {
    const instructions = [];
    if (!ocr) return instructions;

    // Look for follow-up, validity, special notes
    const followUp = ocr.match(/(?:Follow\s*Up|Review\s*(?:after|in|on)|Next\s*visit|Come\s*back)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (followUp) instructions.push(followUp[0].trim());

    const validity = ocr.match(/(?:This\s*Card\s*is\s*valid|Valid\s*(?:up\s*to|until|till))\s*(.+?)(?:\n|$)/i);
    if (validity) instructions.push(validity[0].trim());

    const rptMatch = ocr.match(/(?:Rpt|Repeat)\s+(.+?)(?:\n|$)/i);
    if (rptMatch) instructions.push('Repeat: ' + rptMatch[1].trim());

    // Diet/lifestyle instructions
    const dietMatch = ocr.match(/(?:Diet|Lifestyle|Advice|Exercise)\s*[:\.]?\s*(.+?)(?:\n|$)/i);
    if (dietMatch) instructions.push(dietMatch[0].trim());

    // Collect unique medicine instructions
    medicines.forEach(m => {
        if (m.instructions && !instructions.includes(m.instructions)) {
            instructions.push(`${m.name}: ${m.instructions}`);
        }
    });

    return instructions;
}
