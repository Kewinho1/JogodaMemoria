var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Enum para os estados das cartas
var CardState;
(function (CardState) {
    CardState[CardState["Hidden"] = 0] = "Hidden";
    CardState[CardState["Flipped"] = 1] = "Flipped";
    CardState[CardState["Matched"] = 2] = "Matched";
})(CardState || (CardState = {}));
// Função utilitária para embaralhar o array
function shuffleArray(array) {
    return array.sort(function () { return Math.random() - 0.5; });
}
var MemoryGameImpl = /** @class */ (function () {
    function MemoryGameImpl() {
        this.cards = [];
        this.firstCard = undefined;
        this.secondCard = undefined;
        this.moves = 0;
        this.isRunning = false;
        this.timer = 0;
        this.initializeGame();
    }
    MemoryGameImpl.prototype.initializeGame = function () {
        var values = Array.from({ length: 8 }, function (_, i) { return i + 1; }); // Cria pares de 1 a 8
        var allValues = __spreadArray(__spreadArray([], values, true), values, true); // Duplicar os valores
        var shuffledValues = shuffleArray(allValues);
        // Cria as cartas embaralhadas
        this.cards = shuffledValues.map(function (value, index) { return ({
            value: value,
            state: CardState.Hidden,
            id: index
        }); });
        this.render();
    };
    MemoryGameImpl.prototype.startTimer = function () {
        var timerElement = document.getElementById('timer');
        var seconds = 0;
        this.timerInterval = setInterval(function () {
            seconds++;
            var minutes = Math.floor(seconds / 60);
            var displaySeconds = seconds % 60;
            timerElement.textContent = "".concat(String(minutes).padStart(2, '0'), ":").concat(String(displaySeconds).padStart(2, '0'));
        }, 1000);
    };
    MemoryGameImpl.prototype.stopTimer = function () {
        clearInterval(this.timerInterval);
    };
    MemoryGameImpl.prototype.flipCard = function (card) {
        if (card.state !== CardState.Hidden || this.firstCard && this.secondCard)
            return;
        card.state = CardState.Flipped;
        if (!this.firstCard) {
            this.firstCard = card;
        }
        else {
            this.secondCard = card;
            this.moves++;
            document.getElementById('moves').textContent = this.moves.toString();
            this.checkForMatch();
        }
        this.render();
    };
    MemoryGameImpl.prototype.checkForMatch = function () {
        var _this = this;
        if (!this.firstCard || !this.secondCard)
            return;
        if (this.firstCard.value === this.secondCard.value) {
            this.firstCard.state = CardState.Matched;
            this.secondCard.state = CardState.Matched;
            this.resetSelectedCards();
        }
        else {
            setTimeout(function () {
                _this.firstCard.state = CardState.Hidden;
                _this.secondCard.state = CardState.Hidden;
                _this.resetSelectedCards();
                _this.render();
            }, 1000);
        }
    };
    MemoryGameImpl.prototype.resetSelectedCards = function () {
        this.firstCard = undefined;
        this.secondCard = undefined;
    };
    MemoryGameImpl.prototype.render = function () {
        var _this = this;
        var gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        this.cards.forEach(function (card) {
            var cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-id', card.id.toString());
            if (card.state === CardState.Flipped || card.state === CardState.Matched) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.value.toString();
            }
            if (card.state === CardState.Matched) {
                cardElement.classList.add('matched');
            }
            cardElement.addEventListener('click', function () { return _this.flipCard(card); });
            gameBoard.appendChild(cardElement);
        });
    };
    MemoryGameImpl.prototype.restartGame = function () {
        this.stopTimer();
        this.moves = 0;
        document.getElementById('moves').textContent = '0';
        document.getElementById('timer').textContent = '00:00';
        this.initializeGame();
        this.startTimer();
    };
    return MemoryGameImpl;
}());
// Inicializando o jogo
var game = new MemoryGameImpl();
document.getElementById('restart').addEventListener('click', function () { return game.restartGame(); });
// Iniciar o cronômetro quando o jogo começa
game.startTimer();
