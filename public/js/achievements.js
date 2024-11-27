class Achievements {
    static ACHIEVEMENTS = {
        firstWin: {
            id: 'firstWin',
            name: 'First Victory',
            description: 'Win your first game',
            icon: '🎯'
        },
        perfectStreak: {
            id: 'perfectStreak',
            name: 'Perfect Streak',
            description: 'Get 5 correct guesses in a row',
            icon: '🔥'
        },
        speedDemon: {
            id: 'speedDemon',
            name: 'Speed Demon',
            description: 'Complete a round in under 2 seconds',
            icon: '⚡'
        },
        highScore: {
            id: 'highScore',
            name: 'High Scorer',
            description: 'Score over 1000 points',
            icon: '🏆'
        },
        expertEye: {
            id: 'expertEye',
            name: 'Expert Eye',
            description: 'Achieve 90% accuracy in a session',
            icon: '👁️'
        }
    };

    constructor() {
        this.unlockedAchievements = JSON.parse(localStorage.getItem('achievements')) || [];
    }

    checkAchievements(gameStats) {
        const newAchievements = [];

        if (gameStats.totalGames === 1 && gameStats.accuracy === 100) {
            newAchievements.push(this.unlockAchievement('firstWin'));
        }

        if (gameStats.bestStreak >= 5) {
            newAchievements.push(this.unlockAchievement('perfectStreak'));
        }

        if (gameStats.averageTime < 2) {
            newAchievements.push(this.unlockAchievement('speedDemon'));
        }

        if (gameStats.totalScore > 1000) {
            newAchievements.push(this.unlockAchievement('highScore'));
        }

        if (gameStats.accuracy >= 90) {
            newAchievements.push(this.unlockAchievement('expertEye'));
        }

        return newAchievements.filter(Boolean);
    }

    unlockAchievement(achievementId) {
        if (!this.unlockedAchievements.includes(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            localStorage.setItem('achievements', JSON.stringify(this.unlockedAchievements));
            return Achievements.ACHIEVEMENTS[achievementId];
        }
        return null;
    }

    getUnlockedAchievements() {
        return this.unlockedAchievements.map(id => Achievements.ACHIEVEMENTS[id]);
    }
} 