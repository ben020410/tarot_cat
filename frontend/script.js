document.getElementById('send-button').addEventListener('click', sendMessage);

function appendMessage(message, sender) {
    const chatWindow = document.getElementById('chat-window');
    const messageBubble = document.createElement('div');
    messageBubble.className = `chat-bubble ${sender}`;
    messageBubble.innerText = message;
    chatWindow.appendChild(messageBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (message) {
        appendMessage(message, 'user');
        chatInput.value = '';

        // 서버에 메시지 전송 및 응답 받기
        const response = await sendTarotTellRequest([
            { role: 'user', content: message }
        ]);

        if (response && response.answer) {
            appendMessage(response.answer, 'bot');
        } else {
            appendMessage('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.', 'bot');
        }
    }
}

async function sendTarotTellRequest(messages) {
    try {
        const response = await fetch('http://localhost:3000/tarotTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages }) // 메시지 배열을 포함한 객체 전송
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}