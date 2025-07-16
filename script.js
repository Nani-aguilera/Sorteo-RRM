document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const minRifaInput = document.getElementById('minRifa');
    const maxRifaInput = document.getElementById('maxRifa');
    const generateRifaBtn = document.getElementById('generateRifa');
    const resultRifaSpan = document.getElementById('resultRifa');

    const minNumeroInput = document.getElementById('minNumero');
    const maxNumeroInput = document.getElementById('maxNumero');
    const generateNumeroBtn = document.getElementById('generateNumero');
    const resultNumeroSpan = document.getElementById('resultNumero');

    const markWinnerBtn = document.getElementById('markWinner');
    const markLoserBtn = document.getElementById('markLoser');
    const selectionMessage = document.getElementById('selectionMessage');

    const lotteryHistoryList = document.getElementById('lotteryHistory');
    const clearHistoryBtn = document.getElementById('clearHistory');

    let currentRifa = '--';
    let currentNumero = '--';

    // Función para cargar el historial desde localStorage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('lotteryHistory')) || [];
        history.forEach(item => addHistoryItemToDOM(item, false)); // No guardar de nuevo
    }

    // Función para añadir un ítem al historial en el DOM y en localStorage
    function addHistoryItem(rifa, numero, status) {
        const timestamp = new Date().toLocaleString('es-CL', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        const item = { rifa, numero, status, timestamp };

        // Añadir al DOM
        addHistoryItemToDOM(item, true);

        // Guardar en localStorage
        const history = JSON.parse(localStorage.getItem('lotteryHistory')) || [];
        history.push(item);
        localStorage.setItem('lotteryHistory', JSON.stringify(history));
    }

    // Función auxiliar para agregar un item al DOM
    function addHistoryItemToDOM(item, prepend = true) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>Rifa: ${item.rifa} | Número: ${item.numero}</span>
            <span class="${item.status === 'Ganador' ? 'status-winner' : 'status-loser'}">${item.status}</span>
            <span style="font-size: 0.8em; opacity: 0.8;">(${item.timestamp})</span>
        `;
        if (prepend) {
            lotteryHistoryList.prepend(listItem); // Agrega al principio
        } else {
            lotteryHistoryList.appendChild(listItem); // Agrega al final (para cargar)
        }
    }

    // Limpiar el historial
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres limpiar todo el historial de sorteos?')) {
            localStorage.removeItem('lotteryHistory');
            lotteryHistoryList.innerHTML = ''; // Limpiar el DOM
        }
    });

    // Generador de Rifa Ganadora
    generateRifaBtn.addEventListener('click', () => {
        const min = parseInt(minRifaInput.value);
        const max = parseInt(maxRifaInput.value);

        if (isNaN(min) || isNaN(max) || min > max) {
            alert('Por favor, ingresa un rango de números válido para la Rifa.');
            return;
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        resultRifaSpan.textContent = randomNumber;
        currentRifa = randomNumber; // Actualizar la rifa actual
        resetSelectionMessage();
    });

    // Generador de Número Ganador
    generateNumeroBtn.addEventListener('click', () => {
        const min = parseInt(minNumeroInput.value);
        const max = parseInt(maxNumeroInput.value);

        if (isNaN(min) || isNaN(max) || min > max) {
            alert('Por favor, ingresa un rango de números válido para el Número.');
            return;
        }

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        resultNumeroSpan.textContent = randomNumber;
        currentNumero = randomNumber; // Actualizar el número actual
        resetSelectionMessage();
    });

    // Selección de Ganador/Al agua
    markWinnerBtn.addEventListener('click', () => {
        if (currentRifa === '--' || currentNumero === '--') {
            selectionMessage.textContent = 'Por favor, genera una Rifa y un Número primero.';
            selectionMessage.style.color = 'orange';
            return;
        }
        selectionMessage.textContent = `¡Felicidades! La Rifa ${currentRifa} con el Número ${currentNumero} es el GANADOR.`;
        selectionMessage.style.color = 'var(--green-winner)';
        addHistoryItem(currentRifa, currentNumero, 'Ganador');
        resetCurrentNumbers();
    });

    markLoserBtn.addEventListener('click', () => {
        if (currentRifa === '--' || currentNumero === '--') {
            selectionMessage.textContent = 'Por favor, genera una Rifa y un Número primero.';
            selectionMessage.style.color = 'orange';
            return;
        }
        selectionMessage.textContent = `Lo sentimos, la Rifa ${currentRifa} con el Número ${currentNumero} fue "Al agua".`;
        selectionMessage.style.color = 'var(--red-loser)';
        addHistoryItem(currentRifa, currentNumero, 'Al agua');
        resetCurrentNumbers();
    });

    function resetSelectionMessage() {
        selectionMessage.textContent = '';
        selectionMessage.style.color = '';
    }

    function resetCurrentNumbers() {
        currentRifa = '--';
        currentNumero = '--';
        resultRifaSpan.textContent = '--';
        resultNumeroSpan.textContent = '--';
    }

    // Cargar historial al cargar la página
    loadHistory();
});
