class Tutorial {
    constructor() {
        this.steps = [
            {
                element: '#colorDisplay',
                title: 'The Color Display',
                content: 'This is the color you need to match. Try to remember its hex code!',
                position: 'bottom'
            },
            {
                element: '#options',
                title: 'Color Options',
                content: 'Choose the correct hex code from these options',
                position: 'top'
            },
            {
                element: '#score',
                title: 'Your Score',
                content: 'Earn points for correct guesses, but be careful - wrong guesses cost points!',
                position: 'left'
            },
            {
                element: '#timer',
                title: 'Timer',
                content: 'In timed modes, complete as many rounds as you can before time runs out',
                position: 'right'
            }
        ];
        this.currentStep = 0;
    }

    start() {
        if (this.hasCompletedTutorial()) return;
        this.showStep(0);
        this.addEventListeners();
    }

    showStep(index) {
        const step = this.steps[index];
        const element = document.querySelector(step.element);
        if (!element) return;

        const tooltip = this.createTooltip(step);
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, element, step.position);
    }

    createTooltip(step) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tutorial-buttons">
                ${this.currentStep > 0 ? '<button class="prev-btn">Previous</button>' : ''}
                ${this.currentStep < this.steps.length - 1 ? 
                    '<button class="next-btn">Next</button>' : 
                    '<button class="finish-btn">Finish</button>'}
            </div>
        `;
        return tooltip;
    }

    positionTooltip(tooltip, element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const positions = {
            top: { top: rect.top - tooltipRect.height - 10, left: rect.left },
            bottom: { top: rect.bottom + 10, left: rect.left },
            left: { top: rect.top, left: rect.left - tooltipRect.width - 10 },
            right: { top: rect.top, left: rect.right + 10 }
        };

        const pos = positions[position];
        tooltip.style.top = `${pos.top}px`;
        tooltip.style.left = `${pos.left}px`;
    }

    addEventListeners() {
        document.addEventListener('click', e => {
            if (e.target.classList.contains('next-btn')) {
                this.nextStep();
            } else if (e.target.classList.contains('prev-btn')) {
                this.previousStep();
            } else if (e.target.classList.contains('finish-btn')) {
                this.finish();
            }
        });
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.removeCurrentTooltip();
            this.showStep(this.currentStep);
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.removeCurrentTooltip();
            this.showStep(this.currentStep);
        }
    }

    finish() {
        this.removeCurrentTooltip();
        localStorage.setItem('tutorialCompleted', 'true');
    }

    removeCurrentTooltip() {
        const tooltip = document.querySelector('.tutorial-tooltip');
        if (tooltip) tooltip.remove();
    }

    hasCompletedTutorial() {
        return localStorage.getItem('tutorialCompleted') === 'true';
    }
} 