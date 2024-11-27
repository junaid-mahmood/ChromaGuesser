class SpeedRound {
    constructor() {
        this.timeLimit = 2000; // 2 seconds in milliseconds
        this.startTime = null;
        this.color = null;
        this.isActive = false;
        this.score = 0;
        this.attempts = 0;
        this.bestTime = localStorage.getItem('bestSpeedTime') || null;
        
        this.setupUI();
        this.bindEvents();
    }

    setupUI() {
        // Create speed round container
        const container = document.createElement('div');
        container.className = 'speed-round-container';
        container.innerHTML = `
            <div class="speed-round-header">
                <div class="timer-display">
                    <span class="time">2.00</span>s
                </div>
                <div class="speed-stats">
                    <div class="best-time">Best: ${this.bestTime ? `${(this.bestTime/1000).toFixed(2)}s` : '--'}</div>
                    <div class="score">Score: ${this.score}</div>
                </div>
            </div>
            <div class="color-target"></div>
            <div class="speed-options"></div>
            <div class="speed-controls">
                <button class="start-speed-btn">Start Speed Round</button>
            </div>
        `;
        document.body.appendChild(container);

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .speed-round-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                padding: 2rem;
                border-radius: 20px;
                border: 2px solid var(--text-accent);
                box-shadow: 0 0 50px rgba(0, 206, 201, 0.3);
                min-width: 400px;
                z-index: 1000;
            }

            .speed-round-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }

            .timer-display {
                font-size: 3rem;
                font-weight: bold;
                color: var(--text-accent);
                text-shadow: 0 0 10px rgba(0, 206, 201, 0.5);
            }

            .timer-display.warning {
                color: #ff4757;
                animation: pulse 0.5s infinite;
            }

            .color-target {
                width: 100%;
                height: 200px;
                border-radius: 15px;
                margin-bottom: 1.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
            }

            .speed-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .speed-option {
                padding: 1rem;
                border: none;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .speed-option:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .start-speed-btn {
                width: 100%;
                padding: 1rem;
                border: none;
                border-radius: 10px;
                background: var(--primary-gradient);
                color: #fff;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .start-speed-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 206, 201, 0.4);
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    bindEvents() {
        const startBtn = document.querySelector('.start-speed-btn');
        startBtn.addEventListener('click', () => this.startRound());
    }

    startRound() {
        this.isActive = true;
        this.startTime = Date.now();
        this.color = this.generateRandomColor();
        
        // Update UI
        const colorTarget = document.querySelector('.color-target');
        colorTarget.style.backgroundColor = this.color;
        
        // Generate options
        const options = this.generateOptions();
        const optionsContainer = document.querySelector('.speed-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'speed-option';
            button.textContent = option;
            button.onclick = () => this.checkGuess(option);
            optionsContainer.appendChild(button);
        });

        // Start timer
        this.updateTimer();
    }

    updateTimer() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.timeLimit - elapsed);
        const timerDisplay = document.querySelector('.timer-display');
        
        timerDisplay.innerHTML = `<span class="time">${(remaining/1000).toFixed(2)}</span>s`;
        
        if (remaining < 500) {
            timerDisplay.classList.add('warning');
        }

        if (remaining > 0 && this.isActive) {
            requestAnimationFrame(() => this.updateTimer());
        } else {
            this.endRound(false);
        }
    }

    checkGuess(guess) {
        if (!this.isActive) return;
        
        const elapsed = Date.now() - this.startTime;
        const correct = guess.toUpperCase() === this.color.toUpperCase();
        
        if (correct && elapsed <= this.timeLimit) {
            this.score += 100;
            if (!this.bestTime || elapsed < this.bestTime) {
                this.bestTime = elapsed;
                localStorage.setItem('bestSpeedTime', elapsed);
            }
            this.showResult('Correct!', true);
        } else {
            this.showResult('Too slow!', false);
        }
        
        this.endRound(correct);
    }

    endRound(success) {
        this.isActive = false;
        document.querySelector('.speed-stats .score').textContent = `Score: ${this.score}`;
        document.querySelector('.best-time').textContent = 
            `Best: ${this.bestTime ? `${(this.bestTime/1000).toFixed(2)}s` : '--'}`;
    }

    showResult(message, success) {
        const result = document.createElement('div');
        result.className = `speed-result ${success ? 'success' : 'failure'}`;
        result.textContent = message;
        document.querySelector('.speed-round-container').appendChild(result);
        
        setTimeout(() => result.remove(), 1500);
    }

    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateOptions() {
        const options = [this.color];
        while (options.length < 2) {
            const newColor = this.generateRandomColor();
            if (!options.includes(newColor)) {
                options.push(newColor);
            }
        }
        return options.sort(() => Math.random() - 0.5);
    }
}

// Initialize speed round when needed