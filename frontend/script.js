document.getElementById('submit-button').addEventListener('click', showTarotResult);

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

async function showTarotResult() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) {
        alert("고민거리를 입력해주세요.");
        return;
    }

    try {
        const response = await sendTarotTellRequest([{ role: 'user', content: userInput }]);
        displayTarotCards(response.cards);
        displayOverallAdvice(response.overallAdvice);
        scrollToResult(); // 응답이 생성되면 스크롤을 조정
    } catch (error) {
        console.error('Error:', error);
        alert('서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
    }
}

async function sendTarotTellRequest(messages) {
    try {
        const response = await fetch('http://localhost:3000/tarotTell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
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

function displayTarotCards(cards) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = ''; 

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="arcana/${card.image}" alt="${card.name}" class="card-image">
            <p><strong>${card.name}</strong></p>
            <p>${card.advice}</p>`; // "advice"로 변경
        cardsContainer.appendChild(cardElement);
    });

    document.getElementById('tarot-result').style.display = 'block';
}

function displayOverallAdvice(advice) {
    const adviceContainer = document.getElementById('overall-advice');
    adviceContainer.innerText = advice;
}

function scrollToResult() {
    const resultSection = document.getElementById('tarot-result');
    window.scrollTo({
        top: resultSection.offsetTop - 150,
        behavior: 'smooth'
    });
}