import { api } from '../api.js';

export async function renderChat(container) {
    const chatHistory = JSON.parse(localStorage.getItem('chat_history') || '[]');

    container.innerHTML = `
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <button onclick="app.navigateTo('dashboard')" class="p-2 hover:bg-primary/10 rounded-full transition-colors -ml-2">
                <span class="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <div class="relative">
                <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                    <span class="material-symbols-outlined text-primary">smart_toy</span>
                </div>
                <div class="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
                <h1 class="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    Medi-Sum AI
                    <span class="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-primary/20 flex items-center gap-0.5"><span class="material-symbols-outlined text-[10px]">memory</span> Context Active</span>
                </h1>
                <p class="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Online Assistant</p>
            </div>
        </div>
        <div class="flex items-center gap-1 -mr-2">
            <button class="p-2 hover:bg-primary/10 rounded-full text-slate-600"><span class="material-symbols-outlined text-[20px]">history</span></button>
            <button id="clear-chat-btn" class="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-600 transition-colors"><span class="material-symbols-outlined text-[20px]">delete_sweep</span></button>
        </div>
    </header>

    <!-- Chat Area -->
    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-6" style="height:calc(100vh - 270px);-webkit-overflow-scrolling:touch;">
        <!-- Date Separator -->
        <div class="flex justify-center"><span class="text-[11px] font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span></div>

        <!-- Welcome AI Message -->
        <div class="flex items-end gap-3 max-w-[85%]">
            <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-primary text-sm">smart_toy</span></div>
            <div class="flex flex-col gap-1.5">
                <div class="bg-white p-4 rounded-xl rounded-bl-none shadow-sm border border-primary/5">
                    <p class="text-sm leading-relaxed">Hello! I'm your AI health assistant. I have access to your medical records. How can I help you today?</p>
                </div>
                <span class="text-[10px] text-slate-400 ml-1">Just now</span>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white border-t border-primary/10 pt-2 pb-6">
        <!-- Input Layer -->
        <div class="px-4 mt-2 mb-3">
            <form id="chat-form" class="flex items-end gap-2 bg-[#f5f8f8] rounded-2xl p-2 pl-4 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all duration-200">
                <button type="button" class="text-slate-400 hover:text-primary transition-colors pb-2"><span class="material-symbols-outlined text-[22px]">attach_file</span></button>
                <textarea id="chat-input" rows="1" class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2.5 placeholder:text-slate-400 resize-none max-h-32" placeholder="Ask about your health..."></textarea>
                <button type="submit" id="send-btn" disabled class="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:brightness-110 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="material-symbols-outlined text-[20px] ml-0.5">send</span>
                </button>
            </form>
            <div class="flex items-center justify-center gap-1.5 mt-3">
                <span class="material-symbols-outlined text-[14px] text-slate-400">lock</span>
                <p class="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center">End-to-End Encrypted & HIPAA Compliant</p>
            </div>
        </div>
        
        <!-- Suggestion Chips (Moved Below Input) -->
        <div id="suggestion-chips" class="flex gap-2 overflow-x-auto px-4 hide-scrollbar">
            ${window.location.hash.includes('q=') ? '' : `
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">What medicines am I taking?</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Summarize Oct 12 visit</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Pending tests?</button>
            <button class="chip shrink-0 whitespace-nowrap px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-colors">Recent lab results</button>
            `}
        </div>
    </footer>

    <!-- Chat Bottom Nav (4-tab) -->
    <nav class="bg-white border-t border-slate-100 flex justify-between items-center" style="padding-bottom: env(safe-area-inset-bottom);">
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-primary py-3" onclick="event.preventDefault();">
            <span class="material-symbols-outlined text-[24px] filled">chat_bubble</span>
            <span class="text-[10px] font-semibold">Chat</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('history');">
            <span class="material-symbols-outlined text-[24px]">folder_open</span>
            <span class="text-[10px] font-medium">Records</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('dashboard');">
            <span class="material-symbols-outlined text-[24px]">monitoring</span>
            <span class="text-[10px] font-medium">Vitals</span>
        </a>
        <a href="#" class="flex-1 flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors py-3" onclick="event.preventDefault();app.navigateTo('profile');">
            <span class="material-symbols-outlined text-[24px]">account_circle</span>
            <span class="text-[10px] font-medium">Profile</span>
        </a>
    </nav>`;

    const messages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');

    // Auto-resize textarea
    chatInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value === '') this.style.height = 'auto';
    });

    function saveHistory() {
        localStorage.setItem('chat_history', JSON.stringify(chatHistory));
    }

    function renderMessage(msg) {
        const div = document.createElement('div');
        if (msg.role === 'user') {
            div.className = 'flex flex-col items-end gap-1.5 ml-auto max-w-[85%]';
            div.innerHTML = `
                <div class="bg-primary text-white p-4 rounded-xl rounded-br-none shadow-sm">
                    <p class="text-sm leading-relaxed">${msg.text}</p>
                </div>
                <div class="flex items-center gap-1 mr-1">
                    <span class="text-[10px] text-slate-400">${msg.time}</span>
                    <span class="material-symbols-outlined text-[12px] text-primary">done_all</span>
                </div>`;
        } else {
            div.className = 'flex items-end gap-3 max-w-[85%] animate-fade-in-up';
            div.innerHTML = `
                <div class="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"><span class="material-symbols-outlined text-primary text-sm">smart_toy</span></div>
                <div class="flex flex-col gap-1.5">
                    <div class="bg-white p-4 rounded-xl rounded-bl-none shadow-sm border border-primary/5">
                        <p class="text-sm leading-relaxed">${msg.text}</p>
                    </div>
                    <span class="text-[10px] text-slate-400 ml-1">${msg.time}</span>
                </div>`;
        }
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Load history
    chatHistory.forEach(renderMessage);
    if (chatHistory.length > 0) {
        document.getElementById('suggestion-chips')?.classList.add('hidden');
    }

    // Handle initial query from another page
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const initialQuery = urlParams.get('q');
    if (initialQuery) {
        setTimeout(() => sendMessage(initialQuery), 300);
        // Clear param from URL so refresh doesn't resend
        window.history.replaceState(null, '', '#chat');
    }

    function showTyping() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex items-center gap-2 px-1 my-2';
        div.innerHTML = `<div class="flex gap-1"><span class="size-1.5 bg-primary/40 rounded-full animate-pulse"></span><span class="size-1.5 bg-primary/40 rounded-full animate-pulse" style="animation-delay:.2s"></span><span class="size-1.5 bg-primary/40 rounded-full animate-pulse" style="animation-delay:.4s"></span></div><span class="text-[11px] text-slate-400 italic">Medi-Sum AI is thinking...</span>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() { document.getElementById('typing-indicator')?.remove(); }

    async function sendMessage(text) {
        if (!text.trim()) return;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMsg = { role: 'user', text, time: now };
        chatHistory.push(userMsg);
        renderMessage(userMsg);
        saveHistory();

        chatInput.value = '';
        chatInput.style.height = 'auto';
        chatInput.dispatchEvent(new Event('input')); // re-disable send btn
        document.getElementById('suggestion-chips')?.classList.add('hidden');
        showTyping();

        try {
            const result = await api.sendChatMessage(text);
            hideTyping();

            const botMsg = { role: 'bot', text: result.response || result.message || 'I couldn\'t process that request.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            chatHistory.push(botMsg);
            renderMessage(botMsg);
            saveHistory();
        } catch (e) {
            hideTyping();
            const errorMsg = { role: 'bot', text: 'Sorry, something went wrong. Please try again.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            chatHistory.push(errorMsg);
            renderMessage(errorMsg);
            saveHistory();
        }
    }

    const sendBtn = document.getElementById('send-btn');

    // Toggle send button disabled state based on input content
    function updateSendBtn() {
        const empty = !chatInput.value.trim();
        sendBtn.disabled = empty;
    }
    chatInput.addEventListener('input', updateSendBtn);
    updateSendBtn();

    chatForm.addEventListener('submit', e => { e.preventDefault(); if (chatInput.value.trim()) sendMessage(chatInput.value); });

    // Handle Enter key for textarea
    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    container.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => sendMessage(chip.textContent));
    });

    document.getElementById('clear-chat-btn')?.addEventListener('click', async () => {
        const confirmed = await window.app.showConfirmModal(
            'Clear Chat?',
            'Clear all chat history? This cannot be undone.',
            'Clear'
        );
        if (!confirmed) return;
        localStorage.removeItem('chat_history');
        chatHistory.length = 0;
        messages.innerHTML = '';
        document.getElementById('suggestion-chips')?.classList.remove('hidden');
        window.app.showToast('Chat history cleared', 'info');
    });
}
