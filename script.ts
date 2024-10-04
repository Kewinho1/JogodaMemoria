// Enum para os estados das cartas
enum CardState {
    Hidden,
    Flipped,
    Matched
}

// Interface para representar uma carta
interface Card {
    value: number;
    state: CardState;
    id: number;
}

// Interface para o jogo
interface MemoryGame {
    cards: Card[];
    firstCard?: Card;
    secondCard?: Card;
    moves: number;
    isRunning: boolean;
}

// Função utilitária para embaralhar o array
function shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
}

class MemoryGameImpl implements MemoryGame {
    cards: Card[] = [];
    firstCard?: Card = undefined;
    secondCard?: Card = undefined;
    moves: number = 0;
    isRunning: boolean = false;
    timer: number = 0;
    timerInterval: any;
    
    constructor() {
        this.initializeGame();
    }

    initializeGame() {
        console.log("initializeGame")
        const values = Array.from({ length: 8 }, (_, i) => i + 1); // Cria pares de 1 a 8
        const allValues = [...values, ...values]; // Duplicar os valores
        const shuffledValues = shuffleArray(allValues);

        // Cria as cartas embaralhadas
        this.cards = shuffledValues.map((value, index) => ({
            value,
            state: CardState.Hidden,
            id: index
        }));

        this.render();
    }

    startTimer() {
        console.log("startTimer")
        const timerElement = document.getElementById('timer')!;
        let seconds = 0;
        this.timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const displaySeconds = seconds % 60;
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        console.log("stopTimer")
        clearInterval(this.timerInterval);
    }

    flipCard(card: Card) {
        console.log("flipCard")
        if (card.state !== CardState.Hidden || this.firstCard && this.secondCard) return;

        card.state = CardState.Flipped;

        if (!this.firstCard) {
            this.firstCard = card;
        } else {
            this.secondCard = card;
            this.moves++;
            document.getElementById('moves')!.textContent = this.moves.toString();
            this.checkForMatch();
        }

        this.render();
    }

    checkForMatch() {
        console.log("checkForMatch")
        if (!this.firstCard || !this.secondCard) return;

        if (this.firstCard.value === this.secondCard.value) {
            this.firstCard.state = CardState.Matched;
            this.secondCard.state = CardState.Matched;
            this.resetSelectedCards();
        } else {
            setTimeout(() => {
                this.firstCard!.state = CardState.Hidden;
                this.secondCard!.state = CardState.Hidden;
                this.resetSelectedCards();
                this.render();
            }, 1000);
        }
    }

    resetSelectedCards() {
        console.log("resetSelectedCards")
        this.firstCard = undefined;
        this.secondCard = undefined;
    }

    render() {
        console.log("render")
        const gameBoard = document.getElementById('game-board')!;
        gameBoard.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', card.id.toString());

            if (card.state === CardState.Flipped || card.state === CardState.Matched) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.value.toString();
            }

            if (card.state === CardState.Matched) {
                cardElement.classList.add('matched');
            }

            cardElement.addEventListener('click', () => this.flipCard(card));

            gameBoard.appendChild(cardElement);
        });
    }

    restartGame() {
        console.log("restartGame")
        this.stopTimer();
        this.moves = 0;
        document.getElementById('moves')!.textContent = '0';
        document.getElementById('timer')!.textContent = '00:00';
        this.initializeGame();
        this.startTimer();
    }
}

// Inicializando o jogo
const game = new MemoryGameImpl();
document.getElementById('restart')!.addEventListener('click', () => game.restartGame());

// Iniciar o cronômetro quando o jogo começa
game.startTimer();

console.log("Cheguei aqui")