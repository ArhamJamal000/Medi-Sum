document.addEventListener('DOMContentLoaded', function () {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatContainer = document.getElementById('chat-container');

    if (!chatForm) return;

    chatForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const message = chatInput.value.trim();
        if (!message) return;

        // 1. Display user message
        appendMessage(message, 'user');
        chatInput.value = '';

        // 2. Show loading state
        const loadingId = appendLoadingMessage();

        // 3. Send to API
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken() // Need to handle CSRF if active or ensure route is excluded/handled
            },
            body: JSON.stringify({ message: message })
        })
            .then(response => response.json())
            .then(data => {
                // Remove loading message
                removeMessage(loadingId);

                if (data.error) {
                    appendMessage("Error: " + data.error, 'ai-error');
                } else {
                    appendMessage(data.response, 'ai');
                }
            })
            .catch(error => {
                removeMessage(loadingId);
                appendMessage("Sorry, something went wrong. Please try again.", 'ai-error');
                console.error('Chat error:', error);
            });
    });

    function appendMessage(text, type) {
        const div = document.createElement('div');
        div.classList.add('chat-message');

        // Styles based on type
        if (type === 'user') {
            div.style.alignSelf = 'flex-end';
            div.style.background = '#2563eb';
            div.style.color = 'white';
            div.style.padding = '0.5rem 1rem';
            div.style.borderRadius = '8px';
            div.style.maxWidth = '80%';
        } else if (type === 'ai') {
            div.style.alignSelf = 'flex-start';
            div.style.background = '#e0f2fe';
            div.style.color = '#0369a1';
            div.style.padding = '0.5rem 1rem';
            div.style.borderRadius = '8px';
            div.style.maxWidth = '80%';
        } else if (type === 'ai-error') {
            div.style.alignSelf = 'flex-start';
            div.style.background = '#fee2e2';
            div.style.color = '#b91c1c';
            div.style.padding = '0.5rem 1rem';
            div.style.borderRadius = '8px';
            div.style.maxWidth = '80%';
        }

        // Convert newlines to breaks for AI responses
        div.innerHTML = text.replace(/\n/g, '<br>');

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function appendLoadingMessage() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.style.alignSelf = 'flex-start';
        div.style.color = '#6b7280';
        div.style.fontStyle = 'italic';
        div.style.fontSize = '0.9rem';
        div.style.padding = '0.5rem';
        div.textContent = 'Thinking...';

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Helper to get CSRF token from DOM if present
    function getCsrfToken() {
        const tokenInput = document.querySelector('input[name="csrf_token"]');
        return tokenInput ? tokenInput.value : '';
    }
});
