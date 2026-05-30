class AudioManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    _ensure() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                this.enabled = false;
            }
        }
        // Resume if suspended (autoplay policy)
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        if (!this.enabled) return;
        try {
            this._ensure();
            if (!this.ctx) return;
            switch (type) {
                case 'shoot':    this._beep(800, 0.05, 0.08); break;
                case 'hit':      this._beep(500, 0.06, 0.1); break;
                case 'explode':  this._noise(0.25, 0.2); break;
                case 'laser':    this._beep(1200, 0.08, 0.04); break;
                case 'ice':      this._beep(300, 0.1, 0.06); break;
                case 'wave':     this._sweep(200, 600, 0.3, 0.12); break;
                case 'death':    this._beep(220, 0.15, 0.12); break;
                case 'victory':  this._sweep(400, 800, 0.4, 0.15); break;
                case 'gameover': this._sweep(500, 100, 0.4, 0.15); break;
                case 'place':    this._beep(700, 0.05, 0.08); break;
                case 'upgrade':  this._sweep(500, 800, 0.12, 0.08); break;
                case 'sell':     this._sweep(600, 300, 0.12, 0.08); break;
                case 'click':    this._beep(1000, 0.03, 0.05); break;
                case 'lifeloss': this._beep(150, 0.2, 0.15); break;
            }
        } catch (e) { /* silently ignore audio errors */ }
    }

    _beep(freq, duration, volume) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'square';
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    _sweep(from, to, duration, volume) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(from, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(to, 0.01), this.ctx.currentTime + duration);
        osc.type = 'sine';
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    _noise(duration, volume) {
        const sampleRate = this.ctx.sampleRate;
        const bufferSize = Math.floor(sampleRate * duration);
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * volume;
        }
        const source = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.start();
    }
}
