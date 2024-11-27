class GameModes {
    static MODES = {
        classic: {
            name: 'Classic',
            time: null,
            options: 3,
            points: 100,
            penalty: 50,
            description: 'Classic mode with 3 color options'
        },
        timed: {
            name: 'Timed',
            time: 60,
            options: 3,
            points: 100,
            penalty: 50,
            description: 'Complete as many rounds as possible in 60 seconds'
        },
        hard: {
            name: 'Hard',
            time: null,
            options: 5,
            points: 150,
            penalty: 75,
            description: 'More options, higher stakes'
        },
        blitz: {
            name: 'Blitz',
            time: 30,
            options: 4,
            points: 200,
            penalty: 100,
            description: 'Fast-paced mode with 30 seconds'
        },
        zen: {
            name: 'Zen',
            time: null,
            options: 2,
            points: 50,
            penalty: 25,
            description: 'Relaxed mode with fewer options'
        },
        expert: {
            name: 'Expert',
            time: 45,
            options: 6,
            points: 300,
            penalty: 150,
            description: 'For color masters only'
        }
    };

    static getMode(modeName) {
        return this.MODES[modeName] || this.MODES.classic;
    }

    static getModeDescription(modeName) {
        const mode = this.getMode(modeName);
        return {
            ...mode,
            timeText: mode.time ? `${mode.time} seconds` : 'No time limit',
            difficultyStars: this.getDifficultyStars(modeName)
        };
    }

    static getDifficultyStars(modeName) {
        const difficulties = {
            zen: 1,
            classic: 2,
            timed: 3,
            blitz: 4,
            hard: 4,
            expert: 5
        };
        return "⭐".repeat(difficulties[modeName] || 2);
    }
} 