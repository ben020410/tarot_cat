document.getElementById('send-button').addEventListener('click', sendMessage);

// JavaScript에서 콘솔 로그 추가
function appendMessage(message, sender) {
    console.log(`Appending message from ${sender}: ${message}`);
    const chatWindow = document.getElementById('chat-window');
    const messageBubble = document.createElement('div');
    messageBubble.className = `chat-bubble ${sender}`;
    messageBubble.innerText = message;
    chatWindow.appendChild(messageBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤을 최신 메시지로 이동

    console.log(chatWindow.innerHTML); // 여기서 UI 상태를 확인
}

// 페이지가 새로고침되는 경우를 감지
window.onbeforeunload = function() {
    console.log("페이지가 새로고침되려 합니다.");
    return "정말 새로고침하시겠습니까?";
};

window.addEventListener('beforeunload', function (event) {
    console.log('beforeunload event detected:', event);
    event.preventDefault();
    event.returnValue = '';
});

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (message) {
        appendMessage(message, 'user');
        chatInput.value = '';

        try {
            // 서버에 메시지 전송 및 응답 받기
            const response = await sendTarotTellRequest([
                { role: 'user', content: message }
            ]);

            if (response && response.answer) {
                appendMessage(response.answer, 'bot');
            } else {
                appendMessage('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.', 'bot');
            }
        } catch (error) {
            console.error('Network error:', error); // 네트워크 오류를 콘솔에 출력
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
            body: JSON.stringify({ messages }) // 클라이언트 메시지를 포함한 객체 전송
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response data:', responseData); // 응답 데이터를 콘솔에 출력
        return responseData;

    } catch (error) {
        console.error('Error:', error); // 에러를 콘솔에 출력
        return null;
    }
}