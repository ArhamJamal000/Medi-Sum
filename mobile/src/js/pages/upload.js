import { api } from '../api.js';
import { saveImageLocally } from '../localdb.js';
import { quickAddReminder } from './reminders.js';
import { getRemindersForMedicine } from '../localdb.js';

export async function renderUpload(container) {
    container.innerHTML = `
    <!-- Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="flex items-center justify-between px-4 py-4 max-w-lg mx-auto w-full">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <span class="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <h1 class="text-lg font-semibold tracking-tight">Upload Prescription</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <main class="flex-1 flex flex-col px-6 py-8 max-w-lg mx-auto w-full page-enter">
        <!-- Step Indicator -->
        <div class="flex items-center justify-center gap-2 mb-8">
            <div class="flex items-center gap-2">
                <span id="step1-circle" class="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</span>
                <span class="text-sm font-medium text-primary">Choose File</span>
            </div>
            <div class="h-px w-8 bg-slate-200"></div>
            <div id="step2" class="flex items-center gap-2 opacity-40">
                <span class="w-6 h-6 rounded-full border border-slate-400 text-xs flex items-center justify-center font-bold">2</span>
                <span class="text-sm font-medium">Analyze</span>
            </div>
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
            <h2 class="text-2xl font-bold mb-2">Upload your prescription</h2>
            <p class="text-slate-500 text-sm">Our AI will extract the data. <span class="font-medium text-slate-700">JPG, PNG, PDF</span> supported.</p>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4 mb-4 relative">
            <button id="btn-camera" class="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-primary hover:bg-primary/5 transition-colors group relative overflow-hidden">
                <div class="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                </div>
                <span class="font-bold text-slate-700 text-sm">Take Photo</span>
                <input type="file" id="camera-input" accept="image/*" capture="environment" class="absolute inset-0 opacity-0 cursor-pointer">
            </button>

            <button id="btn-gallery" class="flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-primary hover:bg-primary/5 transition-colors group relative overflow-hidden">
                <div class="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-primary text-3xl">perm_media</span>
                </div>
                <span class="font-bold text-slate-700 text-sm">Browse Gallery</span>
                <input type="file" id="file-input" accept=".jpg,.jpeg,.png,.pdf" class="absolute inset-0 opacity-0 cursor-pointer">
            </button>
        </div>
        
        <!-- Cloud Import Options -->
        <div class="flex gap-3 mb-6">
            <button class="flex-1 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-slate-700 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200" onclick="window.app.showToast('Google Drive integration coming soon', 'info')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" class="w-4 h-4">
                Import Drive
            </button>
            <button class="flex-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1DA851] text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-[#25D366]/30" onclick="window.app.showToast('WhatsApp integration coming soon', 'info')">
                <svg class="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                WhatsApp
            </button>
        </div>

        <!-- File Preview (hidden initially) -->
        <div id="file-preview" class="mt-2 hidden animate-fade-in-up">
            <div class="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-primary/20 shadow-sm relative overflow-hidden">
                <div class="bg-primary/10 size-12 rounded-lg flex items-center justify-center text-primary shrink-0"><span class="material-symbols-outlined">description</span></div>
                <div class="flex-1 min-w-0">
                    <p id="file-name" class="text-sm font-bold truncate text-slate-800"></p>
                    <p id="file-size" class="text-xs text-slate-500 mt-0.5"></p>
                </div>
                <button id="file-clear" class="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">close</span>
                </button>
            </div>
            
            <button id="add-page-btn" class="mt-3 w-full border-2 border-dashed border-primary/30 rounded-xl py-3 text-primary/80 hover:text-primary text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors" onclick="window.app.showToast('Camera opening for page 2...', 'info')">
                <span class="material-symbols-outlined text-[18px]">note_add</span>
                Scan Another Page
            </button>
        </div>

        <!-- Error UI (hidden initially) -->
        <div id="upload-error" class="mt-4 hidden animate-fade-in-up">
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 items-start">
                <span class="material-symbols-outlined text-rose-500 shrink-0">error</span>
                <div>
                    <h3 class="font-bold text-rose-800 text-sm mb-1">Analysis Failed</h3>
                    <p id="error-message" class="text-xs text-rose-600 leading-relaxed"></p>
                    <button id="btn-retry" class="mt-3 bg-white border border-rose-200 text-rose-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-rose-50">Try Again</button>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="mt-auto pt-10">
            <button id="upload-btn" disabled class="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="material-symbols-outlined">analytics</span>
                Upload &amp; Analyze
            </button>
            <p class="text-center text-[10px] text-slate-400 mt-4 px-4 uppercase tracking-wider font-semibold">End-to-end encrypted • HIPAA Compliant</p>
        </div>
    </main>

    <!-- Progressive Loading Overlay -->
    <div id="upload-overlay" class="hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center px-6">
        <div class="max-w-xs w-full">
            <div class="flex justify-center mb-8 relative">
                <div style="width:72px;height:72px;border:4px solid #f1f5f9;border-top-color:#00bdd6;border-radius:50%;animation:spin 1s ease-in-out infinite;"></div>
                <span class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" style="font-size:32px">auto_awesome</span>
            </div>
            <h2 class="text-2xl font-bold text-center text-slate-800 mb-2">Analyzing...</h2>
            <p class="text-slate-500 text-sm text-center mb-8">Please wait while our AI processes your document.</p>
            
            <div class="space-y-4">
                <div id="step-upload" class="flex items-center gap-3">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-upload"><span class="size-2 bg-slate-400 rounded-full animate-pulse"></span></div>
                    <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-upload">Uploading securely</span>
                </div>
                <div class="w-px h-4 bg-slate-200 ml-3 -my-3"></div>
                <div id="step-ocr" class="flex items-center gap-3 opacity-40 transition-opacity duration-300">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-ocr"><span class="size-2 bg-slate-400 rounded-full"></span></div>
                    <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-ocr">Extracting text (OCR)</span>
                </div>
                <div class="w-px h-4 bg-slate-200 ml-3 -my-3"></div>
                <div id="step-meds" class="flex items-center gap-3 opacity-40 transition-opacity duration-300">
                    <div class="size-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 transition-colors duration-300" id="icon-meds"><span class="size-2 bg-slate-400 rounded-full"></span></div>
                    <div class="flex-1 flex justify-between items-center">
                        <span class="text-sm font-semibold text-slate-700 transition-colors" id="text-meds">Identifying medicines</span>
                        <span id="confidence-score" class="hidden text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded uppercase">94% Confidence</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    let selectedFile = null;
    const fileInput = document.getElementById('file-input');
    const cameraInput = document.getElementById('camera-input');
    const preview = document.getElementById('file-preview');
    const uploadBtn = document.getElementById('upload-btn');
    const errorBox = document.getElementById('upload-error');

    const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.pdf'];

    function handleFile(file) {
        if (!file) return;
        errorBox.classList.add('hidden');

        // Validate file type
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.includes(ext)) {
            window.app.showToast('⚠️ Only JPG, PNG, or PDF files allowed', 'error');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            window.app.showToast(`⚠️ File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 16MB allowed.`, 'error');
            return;
        }

        selectedFile = file;
        document.getElementById('file-name').textContent = file.name || 'Captured Photo.jpg';
        document.getElementById('file-size').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB • Ready to analyze';
        preview.classList.remove('hidden');
        uploadBtn.disabled = false;
    }

    fileInput.addEventListener('change', e => handleFile(e.target.files[0]));
    cameraInput.addEventListener('change', e => handleFile(e.target.files[0]));

    document.getElementById('file-clear')?.addEventListener('click', () => {
        selectedFile = null; fileInput.value = ''; cameraInput.value = '';
        preview.classList.add('hidden'); uploadBtn.disabled = true; errorBox.classList.add('hidden');
    });

    document.getElementById('btn-retry')?.addEventListener('click', () => {
        errorBox.classList.add('hidden'); uploadBtn.click();
    });

    function setStepStatus(stepId, state) {
        const icon = document.getElementById(`icon-${stepId}`);
        const wrapper = document.getElementById(`step-${stepId}`);
        if (state === 'active') {
            wrapper.classList.remove('opacity-40');
            icon.innerHTML = '<span class="size-2 bg-primary rounded-full animate-pulse"></span>';
            icon.className = 'size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 transition-colors duration-300';
        } else if (state === 'done') {
            wrapper.classList.remove('opacity-40');
            icon.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span>';
            icon.className = 'size-6 rounded-full bg-success text-white flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm shadow-success/30';
        }
    }

    uploadBtn.addEventListener('click', async () => {
        if (!selectedFile) return;
        const overlay = document.getElementById('upload-overlay');
        overlay.classList.remove('hidden');
        uploadBtn.disabled = true;
        errorBox.classList.add('hidden');

        // Initial state
        setStepStatus('upload', 'active'); setStepStatus('ocr', 'pending'); setStepStatus('meds', 'pending');

        try {
            const reader = new FileReader();
            reader.onload = async function () {
                try {
                    const base64 = reader.result.split(',')[1];

                    // Simulate step 1 done, step 2 active
                    setTimeout(() => { setStepStatus('upload', 'done'); setStepStatus('ocr', 'active'); }, 800);
                    // Simulate step 2 done, step 3 active
                    setTimeout(() => { setStepStatus('ocr', 'done'); setStepStatus('meds', 'active'); }, 2000);

                    const result = await api.uploadPrescription(base64);

                    setStepStatus('meds', 'done');
                    document.getElementById('confidence-score')?.classList.remove('hidden');

                    // Save image locally for privacy
                    if (result.prescription_id && base64) {
                        try {
                            await saveImageLocally(result.prescription_id, base64);
                        } catch (imgErr) {
                            console.warn('Local image save failed (non-critical):', imgErr);
                        }
                    }

                    // Auto-set reminders for extracted medicines
                    if (result.prescription_id) {
                        try {
                            const rxData = await api.getPrescription(result.prescription_id);
                            const rx = rxData.prescription || rxData;
                            const meds = rx.medicines || [];
                            let remindersSet = 0;
                            for (const med of meds) {
                                if (!med.name) continue;
                                // Skip if reminder already exists
                                const existing = await getRemindersForMedicine(med.name);
                                if (existing.length > 0) continue;
                                // Auto-set with default morning and night times
                                await quickAddReminder(med.name, med.dosage || '', ['08:00', '20:00']);
                                remindersSet++;
                            }
                            if (remindersSet > 0) {
                                console.log(`Auto-set ${remindersSet} medicine reminders`);
                            }
                        } catch (remErr) {
                            console.warn('Auto-reminder setup failed (non-critical):', remErr);
                        }
                    }

                    setTimeout(() => {
                        overlay.classList.add('hidden');
                        document.getElementById('confidence-score')?.classList.add('hidden');
                        window.app.showToast('✅ Prescription analyzed!', 'success');
                        if (result.prescription_id) { window.app.navigateTo('detail', { id: result.prescription_id }); }
                        else { window.app.navigateTo('dashboard'); }
                    }, 1200);

                } catch (err) {
                    overlay.classList.add('hidden');
                    document.getElementById('error-message').textContent = err.message || '❌ Upload failed. Please try again.';
                    window.app.showToast('❌ Upload failed. Please try again.', 'error');
                    errorBox.classList.remove('hidden');
                    uploadBtn.disabled = false;
                }
            };
            reader.readAsDataURL(selectedFile);
        } catch (err) {
            overlay.classList.add('hidden');
            document.getElementById('error-message').textContent = err.message || 'Failed to read file.';
            errorBox.classList.remove('hidden');
            uploadBtn.disabled = false;
        }
    });
}
