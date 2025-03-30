export class AudioEngine {
    constructor() {
        this.initialized = false;
        this.sounds = new Map();
        this.sources = new Map();
    }

    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.initialized = true;

            // Load essential sounds
            this.loadEssentialSounds();
        } catch (error) {
            console.error("Web Audio API not supported:", error);
        }
    }

    async loadEssentialSounds() {
        if (!this.initialized) return;

        // Load essential sound effects
        try {
            await Promise.all([
                this.loadSound('engine', 'assets/sounds/engine.mp3'),
                this.loadSound('wind', 'assets/sounds/wind.mp3'),
                this.loadSound('stall', 'assets/sounds/stall.mp3')
            ]);
        } catch (error) {
            console.error('Failed to load sounds:', error);
        }
    }

    async loadSound(name, url) {
        if (!this.initialized) return;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Sound file ${url} not found, using empty buffer`);
                const emptyBuffer = this.context.createBuffer(2, 44100, 44100);
                this.sounds.set(name, emptyBuffer);
                return;
            }
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);

            // Create an empty buffer as fallback
            const emptyBuffer = this.context.createBuffer(2, 44100, 44100);
            this.sounds.set(name, emptyBuffer);
        }
    }

    play(name, options = {}) {
        if (!this.initialized || !this.sounds.get(name)) return;

        const sound = this.sounds.get(name);
        const source = this.context.createBufferSource();
        source.buffer = sound;

        const gainNode = this.context.createGain();
        gainNode.gain.value = options.volume || 1;

        source.connect(gainNode);
        gainNode.connect(this.masterGain);

        source.loop = options.loop || false;
        source.start(0);

        this.sources.set(name, source);
        return source;
    }

    stop(name) {
        if (!this.initialized) return;

        const source = this.sources.get(name);
        if (source) {
            try {
                source.stop();
            } catch (e) {
                console.warn(`Error stopping sound ${name}:`, e);
            }
            this.sources.delete(name);
        }
    }

    setVolume(volume) {
        if (!this.initialized) return;

        this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }

    update(deltaTime) {
        // Update audio effects based on aircraft state
    }
}
