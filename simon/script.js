const colors = ['green', 'red', 'yellow', 'blue'];
let sequence = [];
let playerSequence = [];
let level = 0;
let gameStarted = false;
let playerName = '';
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// Função para iniciar o jogo
function startGame() {
    const nameInput = document.getElementById('player-name');
    playerName = nameInput.value.trim();

    if (playerName === "") {
        alert("Por favor, insira seu nome para jogar!");
        return;
    }

    sequence = [];
    playerSequence = [];
    level = 0;
    gameStarted = true;
    document.getElementById('message').textContent = "Observe a sequência...";
    document.getElementById('game-board').style.display = 'grid';
    nextLevel();
}

// Função para iniciar o próximo nível
function nextLevel() {
    level++;
    playerSequence = [];
    document.getElementById('message').textContent = `Nível ${level}`;
    
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    playSequence();
}

// Função para tocar a sequência de cores
function playSequence() {
    let delay = 500;
    sequence.forEach((color, index) => {
        setTimeout(() => {
            activateColor(color);
        }, delay * (index + 1));
    });
}

// Função para ativar a cor
function activateColor(color) {
    const element = document.getElementById(color);
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 500);
}

// Função para verificar a sequência do jogador
function checkPlayerMove(color) {
    if (!gameStarted) return;

    playerSequence.push(color);
    const currentMoveIndex = playerSequence.length - 1;

    if (playerSequence[currentMoveIndex] === sequence[currentMoveIndex]) {
        if (playerSequence.length === sequence.length) {
            setTimeout(nextLevel, 1000);
        }
    } else {
        endGame();
    }
}

// Função para terminar o jogo
function endGame() {
    document.getElementById('message').textContent = `Game Over! ${playerName}, você chegou até o nível ${level}.`;
    gameStarted = false;
    updateRanking();
}

// Função para atualizar o ranking
function updateRanking() {
    ranking.push({ name: playerName, score: level });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    displayRanking();
}

// Função para exibir o ranking
function displayRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';
    ranking.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.name} - Nível ${entry.score}`;
        rankingList.appendChild(listItem);
    });
}

// Inicializa o ranking na página
document.addEventListener('DOMContentLoaded', displayRanking);

// Evento de clique para iniciar o jogo
document.getElementById('player-form').addEventListener('submit', function(e) {
    e.preventDefault();
    startGame();
});

// Eventos de clique para as cores
colors.forEach(color => {
    document.getElementById(color).addEventListener('click', () => {
        activateColor(color);
        checkPlayerMove(color);
    });
});
