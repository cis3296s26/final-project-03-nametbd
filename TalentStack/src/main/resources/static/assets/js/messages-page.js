(function () {
    const conversations = {
        'Maria Rodriguez': [
            { sender: 'them', text: 'Hi, I saw your profile.' },
            { sender: 'me', text: 'Thanks! Nice to meet you.' },
            { sender: 'them', text: 'Your experience looks interesting.' }
        ],
        'James Kim': [
            { sender: 'them', text: 'Are you applying for the same internship?' },
            { sender: 'me', text: 'Yes, I am interested in it.' }
        ],
        'Sarah Lee': [
            { sender: 'me', text: 'Good luck with your interview!' },
            { sender: 'them', text: 'Thank you so much!' }
        ],
        'Alex Park': [
            { sender: 'them', text: 'Let me know if you want to connect.' }
        ]
    };

    let currentChat = 'Maria Rodriguez';

    function renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messages = conversations[currentChat] || [];
        chatMessages.innerHTML = messages.map((message) => `
            <div class="message-row ${message.sender === 'me' ? 'mine' : 'theirs'}">
                <div class="message-bubble">${message.text}</div>
            </div>
        `).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function findChatCard(name) {
        return Array.from(document.querySelectorAll('.chat-user'))
            .find((user) => user.dataset.chat === name) || null;
    }

    function updatePreview(name, text) {
        const preview = findChatCard(name)?.querySelector('.chat-preview');
        if (preview) {
            preview.textContent = text;
        }
    }

    function updateTime(name, timeText) {
        const time = findChatCard(name)?.querySelector('.chat-time');
        if (time) {
            time.textContent = timeText;
        }
    }

    function selectChat(name) {
        currentChat = name;

        const chatHeader = document.getElementById('chatHeader');
        if (chatHeader) {
            chatHeader.textContent = name;
        }

        document.querySelectorAll('.chat-user').forEach((user) => {
            user.classList.toggle('active', user.dataset.chat === name);
        });

        renderMessages();
    }

    function sendMessage() {
        const input = document.getElementById('messageInput');
        const text = input?.value.trim();
        if (!input || !text) return;

        if (!conversations[currentChat]) {
            conversations[currentChat] = [];
        }

        conversations[currentChat].push({
            sender: 'me',
            text
        });

        updatePreview(currentChat, text);
        updateTime(currentChat, 'now');
        input.value = '';
        renderMessages();
        input.focus();
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('chatMessages')) return;

        document.querySelectorAll('.chat-user').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.dataset.chat) {
                    selectChat(button.dataset.chat);
                }
            });
        });

        document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
        document.getElementById('messageInput')?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });

        renderMessages();
    });
}());
