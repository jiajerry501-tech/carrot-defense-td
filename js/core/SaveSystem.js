const SAVE_KEY = 'carrot_defense_save';

const SaveSystem = {
    /** Save level result */
    save(levelIndex, stars, won) {
        const data = this.load();
        const prev = data.levels[levelIndex];
        if (!prev || stars > prev.stars) {
            data.levels[levelIndex] = { stars, won, completed: true };
        }
        // Unlock next level on win (only if this is the current highest)
        if (won && levelIndex >= data.unlocked) {
            data.unlocked = Math.min(levelIndex + 1, LEVELS.length - 1);
        }
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    },

    /** Load save data */
    load() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                return {
                    levels: data.levels || {},
                    unlocked: data.unlocked || 0,
                };
            }
        } catch (e) {
            // corrupted data
        }
        return { levels: {}, unlocked: 0 };
    },

    /** Get stars for a level (0-3) */
    getStars(levelIndex) {
        const data = this.load();
        return data.levels[levelIndex]?.stars || 0;
    },

    /** Check if level is unlocked */
    isUnlocked(levelIndex) {
        const data = this.load();
        return levelIndex <= data.unlocked;
    },

    /** Reset all save data */
    reset() {
        localStorage.removeItem(SAVE_KEY);
    },
};
