// Game class to encapsulate all functionality
class ColorGame {
    constructor() {
        this.currentColor = null;
        this.score = 0;
        this.attempts = 0;
        this.timeLeft = 60; // Default time for timed mode
        this.gameMode = localStorage.getItem('gameMode') || 'classic';
        this.timer = null;
        this.isGameActive = false;
        // Bind methods
        this.newGame = this.newGame.bind(this);
        this.checkGuess = this.checkGuess.bind(this);
        this.showNotification = this.showNotification.bind(this);
        this.updateTimer = this.updateTimer.bind(this);
        this.endGame = this.endGame.bind(this);
        // Initialize game
        this.newGame();
        // Display player name and game mode
        const playerName = localStorage.getItem('playerName') || 'Player';
        const gameMode = localStorage.getItem('gameMode') || 'classic';
        document.getElementById('playerName').textContent = playerName;
        document.getElementById('gameMode').textContent = gameMode;
        // Initialize timer if in timed mode
        if (this.gameMode === 'timed') {
            this.startTimer();
        }
        // Show/hide timer based on game mode
        const timerContainer = document.getElementById('timerContainer');
        timerContainer.style.display = this.gameMode === 'timed' ? 'block' : 'none';
    }
    updateTimer() {
        if (this.timeLeft > 0 && this.isGameActive) {
            this.timeLeft--;
            const timerElement = document.getElementById('timer');
            const timerContainer = document.getElementById('timerContainer');
            timerElement.textContent = this.timeLeft;
            if (this.timeLeft <= 10) {
                timerContainer.classList.add('warning');
            } else {
                timerContainer.classList.remove('warning');
            }
        } else if (this.timeLeft === 0) {
            this.endGame();
        }
    }
    endGame() {
        this.isGameActive = false;
        clearInterval(this.timer);
        
        const finalScore = this.score;
        const accuracy = Math.round((this.score / (this.attempts * 100)) * 100);
        const playerName = localStorage.getItem('playerName');
        
        // Get existing leaderboard or use initial data
        const initialLeaderboard = [
            { name: "ColorMaster", score: 1500, mode: "hard" },
            { name: "HexHero", score: 1200, mode: "timed" },
            { name: "ChromaChamp", score: 900, mode: "classic" },
            { name: "PixelPro", score: 850, mode: "hard" },
            { name: "HueHunter", score: 800, mode: "classic" }
        ];
        
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || initialLeaderboard;
        
        // Add new score
        leaderboard.push({
            name: playerName,
            score: finalScore,
            mode: this.gameMode,
            accuracy: accuracy,
            date: new Date().toISOString()
        });

        // Sort by score and keep top 100
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 100);
        
        // Save updated leaderboard
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        // Show game over modal
        document.getElementById('finalScore').textContent = finalScore;
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        document.getElementById('gameOverModal').classList.add('show');
    }
    startTimer() {
        if (this.gameMode === 'timed') {
            this.isGameActive = true;
            this.timeLeft = 60; // Reset timer
            clearInterval(this.timer); // Clear any existing timer
            this.timer = setInterval(() => {
                this.updateTimer();
            }, 1000);
        }
    }
    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    generateSimilarColors(correctColor) {
        const colors = [correctColor];
        const numOptions = this.gameMode === 'hard' ? 5 : 3; // More options in hard mode
        while (colors.length < numOptions) {
            let newColor = this.generateRandomColor();
            if (!colors.includes(newColor)) {
                colors.push(newColor);
            }
        }
        return colors.sort(() => Math.random() - 0.5);
    }
    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    newGame() {
        try {
            this.currentColor = this.generateRandomColor();
            const colorDisplay = document.getElementById('colorDisplay');
            colorDisplay.style.backgroundColor = this.currentColor;
            const colors = this.generateSimilarColors(this.currentColor);
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            colors.forEach(color => {
                const button = document.createElement('button');
                button.textContent = color;
                button.onclick = () => this.checkGuess(color);
                optionsContainer.appendChild(button);
            });
            if (this.gameMode === 'timed' && !this.timer) {
                this.startTimer();
            }
        } catch (error) {
            console.error('Error starting new game:', error);
            this.showNotification('Error starting new game', 'error');
        }
    }
    checkGuess(guessedColor) {
        try {
            if (!this.isGameActive && this.gameMode === 'timed') return;
            this.attempts++;
            const isCorrect = guessedColor.toUpperCase() === this.currentColor.toUpperCase();
            if (isCorrect) {
                const bonus = this.gameMode === 'hard' ? 150 : 100;
                this.score += bonus;
                this.showNotification(`Correct! +${bonus} points`, 'success');
            } else {
                const penalty = this.gameMode === 'hard' ? 75 : 50;
                this.score = Math.max(0, this.score - penalty);
                this.showNotification(`Wrong! -${penalty} points`, 'error');
            }
            // Update UI
            document.getElementById('score').textContent = this.score;
            document.getElementById('attempts').textContent = this.attempts;
            document.getElementById('accuracy').textContent = 
                Math.round((this.score / (this.attempts * 100)) * 100) + '%';
            // Start new round
            this.newGame();
        } catch (error) {
            console.error('Error checking guess:', error);
            this.showNotification('Error checking guess', 'error');
        }
    }
}
// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        game = new ColorGame();
    } catch (error) {
        console.error('Error initializing game:', error);
    }
}); 