/**
 * Advanced Audio Processing System
 * Features: WebAudio Worklet DSP, Binaural Beats, Real-time Analysis, Spatial Audio
 */

class AdvancedAudioSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;
        this.isInitialized = false;
        this.workletNode = null;
        this.spatialPanner = null;
        this.convolver = null;
        this.compressor = null;
        this.binauralBeats = {
            leftOsc: null,
            rightOsc: null,
            isPlaying: false
        };
        this.realTimeData = {
            frequencies: new Float32Array(256),
            waveform: new Float32Array(1024),
            volume: 0,
            pitch: 0
        };
        this.sessions = new Map();
        this.currentSession = null;
        this.recordingData = [];
        this.isRecording = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🎵 Initializing Advanced Audio System...');
            
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Setup master chain
            await this.setupMasterChain();
            
            // Load audio worklet
            await this.loadAudioWorklet();
            
            // Setup spatial audio
            this.setupSpatialAudio();
            
            // Initialize built-in sessions
            this.initializeBuiltInSessions();
            
            this.isInitialized = true;
            console.log('✅ Advanced Audio System initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize audio system:', error);
        }
    }

    async setupMasterChain() {
        // Master gain control
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.7;
        
        // Analyser for real-time visualization
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;
        
        // Compressor for dynamic range control
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -24;
        this.compressor.knee.value = 30;
        this.compressor.ratio.value = 12;
        this.compressor.attack.value = 0.003;
        this.compressor.release.value = 0.25;
        
        // Setup convolution reverb
        await this.setupConvolutionReverb();
        
        // Connect master chain
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.convolver);
        this.convolver.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    async setupConvolutionReverb() {
        this.convolver = this.audioContext.createConvolver();
        
        // Create impulse response for reverb
        const impulseResponse = this.createImpulseResponse(2, 2, false);
        this.convolver.buffer = impulseResponse;
    }

    createImpulseResponse(duration, sampleRate, reverse) {
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const n = reverse ? length - i : i;
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, 2);
            }
        }
        
        return impulse;
    }

    async loadAudioWorklet() {
        try {
            // Create worklet code inline
            const workletCode = `
                class NeuralAudioProcessor extends AudioWorkletProcessor {
                    constructor() {
                        super();
                        this.phase = 0;
                        this.brainwaveFreq = 10; // Alpha waves
                        this.modulation = 0;
                        
                        this.port.onmessage = (e) => {
                            if (e.data.type === 'setBrainwaveFreq') {
                                this.brainwaveFreq = e.data.frequency;
                            }
                        };
                    }
                    
                    process(inputs, outputs, parameters) {
                        const output = outputs[0];
                        const bufferSize = output[0].length;
                        
                        for (let i = 0; i < bufferSize; i++) {
                            // Generate brainwave-synchronized carrier
                            this.phase += (2 * Math.PI * this.brainwaveFreq) / sampleRate;
                            this.modulation = Math.sin(this.phase) * 0.1;
                            
                            // Apply to all channels
                            for (let channel = 0; channel < output.length; channel++) {
                                output[channel][i] = this.modulation;
                            }
                        }
                        
                        return true;
                    }
                }
                
                registerProcessor('neural-audio-processor', NeuralAudioProcessor);
            `;
            
            // Create blob URL for worklet
            const blob = new Blob([workletCode], { type: 'application/javascript' });
            const workletUrl = URL.createObjectURL(blob);
            
            await this.audioContext.audioWorklet.addModule(workletUrl);
            
            this.workletNode = new AudioWorkletNode(this.audioContext, 'neural-audio-processor');
            this.workletNode.connect(this.masterGain);
            
            URL.revokeObjectURL(workletUrl);
            
        } catch (error) {
            console.warn('AudioWorklet not supported, falling back to ScriptProcessor');
            this.setupFallbackProcessor();
        }
    }

    setupFallbackProcessor() {
        const bufferSize = 4096;
        const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
        
        let phase = 0;
        const brainwaveFreq = 10;
        
        processor.onaudioprocess = (e) => {
            const output = e.outputBuffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                phase += (2 * Math.PI * brainwaveFreq) / this.audioContext.sampleRate;
                output[i] = Math.sin(phase) * 0.1;
            }
        };
        
        processor.connect(this.masterGain);
        this.workletNode = processor;
    }

    setupSpatialAudio() {
        this.spatialPanner = this.audioContext.createPanner();
        this.spatialPanner.panningModel = 'HRTF';
        this.spatialPanner.distanceModel = 'inverse';
        this.spatialPanner.refDistance = 1;
        this.spatialPanner.maxDistance = 10000;
        this.spatialPanner.rolloffFactor = 1;
        this.spatialPanner.coneInnerAngle = 360;
        this.spatialPanner.coneOuterAngle = 0;
        this.spatialPanner.coneOuterGain = 0;
        
        // Set listener position
        if (this.audioContext.listener.positionX) {
            this.audioContext.listener.positionX.value = 0;
            this.audioContext.listener.positionY.value = 0;
            this.audioContext.listener.positionZ.value = 1;
        }
    }

    initializeBuiltInSessions() {
        // Focus Enhancement Session
        this.sessions.set('focus', {
            name: 'Focus Enhancement',
            duration: 900, // 15 minutes
            brainwaveTarget: 'beta', // 13-30 Hz
            baseFrequency: 20,
            binauralBeat: 15,
            ambientSounds: ['rain', 'whitenoise'],
            progressiveLayers: true
        });

        // Deep Relaxation Session
        this.sessions.set('relaxation', {
            name: 'Deep Relaxation',
            duration: 1200, // 20 minutes
            brainwaveTarget: 'alpha', // 8-13 Hz
            baseFrequency: 40,
            binauralBeat: 10,
            ambientSounds: ['ocean', 'forest'],
            progressiveLayers: true
        });

        // Creative Flow Session
        this.sessions.set('creativity', {
            name: 'Creative Flow',
            duration: 1800, // 30 minutes
            brainwaveTarget: 'theta', // 4-8 Hz
            baseFrequency: 60,
            binauralBeat: 6,
            ambientSounds: ['cosmic', 'tibetan'],
            progressiveLayers: true
        });

        // Meditation Session
        this.sessions.set('meditation', {
            name: 'Deep Meditation',
            duration: 2400, // 40 minutes
            brainwaveTarget: 'theta-delta', // 2-8 Hz
            baseFrequency: 80,
            binauralBeat: 4,
            ambientSounds: ['silence', 'bowls'],
            progressiveLayers: false
        });
    }

    async startSession(sessionId, customSettings = {}) {
        if (!this.isInitialized) {
            await this.init();
        }

        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }

        // Merge custom settings
        this.currentSession = { ...session, ...customSettings };
        
        console.log(`🎵 Starting session: ${this.currentSession.name}`);
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Start binaural beats
        await this.startBinauralBeats(
            this.currentSession.baseFrequency,
            this.currentSession.binauralBeat
        );

        // Start ambient sounds
        this.startAmbientSounds(this.currentSession.ambientSounds);

        // Start real-time analysis
        this.startRealTimeAnalysis();

        // Schedule progressive changes if enabled
        if (this.currentSession.progressiveLayers) {
            this.scheduleProgressiveChanges();
        }

        return this.currentSession;
    }

    async startBinauralBeats(baseFreq, beatFreq) {
        this.stopBinauralBeats();

        // Left ear frequency
        this.binauralBeats.leftOsc = this.audioContext.createOscillator();
        this.binauralBeats.leftOsc.frequency.value = baseFreq;
        this.binauralBeats.leftOsc.type = 'sine';

        // Right ear frequency (with beat difference)
        this.binauralBeats.rightOsc = this.audioContext.createOscillator();
        this.binauralBeats.rightOsc.frequency.value = baseFreq + beatFreq;
        this.binauralBeats.rightOsc.type = 'sine';

        // Create stereo panning
        const leftPanner = this.audioContext.createStereoPanner();
        leftPanner.pan.value = -1; // Full left
        
        const rightPanner = this.audioContext.createStereoPanner();
        rightPanner.pan.value = 1; // Full right

        // Create gain nodes for volume control
        const leftGain = this.audioContext.createGain();
        leftGain.gain.value = 0.1;
        
        const rightGain = this.audioContext.createGain();
        rightGain.gain.value = 0.1;

        // Connect the chain
        this.binauralBeats.leftOsc.connect(leftGain);
        leftGain.connect(leftPanner);
        leftPanner.connect(this.masterGain);

        this.binauralBeats.rightOsc.connect(rightGain);
        rightGain.connect(rightPanner);
        rightPanner.connect(this.masterGain);

        // Start oscillators
        this.binauralBeats.leftOsc.start();
        this.binauralBeats.rightOsc.start();

        this.binauralBeats.isPlaying = true;

        // Fade in
        leftGain.gain.exponentialRampToValueAtTime(0.15, this.audioContext.currentTime + 3);
        rightGain.gain.exponentialRampToValueAtTime(0.15, this.audioContext.currentTime + 3);
    }

    stopBinauralBeats() {
        if (this.binauralBeats.leftOsc) {
            this.binauralBeats.leftOsc.stop();
            this.binauralBeats.leftOsc = null;
        }
        if (this.binauralBeats.rightOsc) {
            this.binauralBeats.rightOsc.stop();
            this.binauralBeats.rightOsc = null;
        }
        this.binauralBeats.isPlaying = false;
    }

    startAmbientSounds(soundTypes) {
        soundTypes.forEach(soundType => {
            this.loadAndPlayAmbientSound(soundType);
        });
    }

    async loadAndPlayAmbientSound(soundType) {
        try {
            // Generate procedural ambient sounds
            const buffer = this.generateAmbientSound(soundType);
            
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.05;
            
            source.connect(gainNode);
            gainNode.connect(this.spatialPanner);
            this.spatialPanner.connect(this.masterGain);
            
            source.start();
            
            // Store reference for cleanup
            if (!this.currentAmbientSources) {
                this.currentAmbientSources = [];
            }
            this.currentAmbientSources.push(source);
            
        } catch (error) {
            console.warn(`Failed to load ambient sound: ${soundType}`, error);
        }
    }

    generateAmbientSound(type) {
        const duration = 10; // 10 seconds loop
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = buffer.getChannelData(channel);
            
            switch (type) {
                case 'rain':
                    this.generateRainSound(channelData, sampleRate);
                    break;
                case 'ocean':
                    this.generateOceanSound(channelData, sampleRate);
                    break;
                case 'forest':
                    this.generateForestSound(channelData, sampleRate);
                    break;
                case 'whitenoise':
                    this.generateWhiteNoise(channelData);
                    break;
                case 'cosmic':
                    this.generateCosmicSound(channelData, sampleRate);
                    break;
                case 'tibetan':
                    this.generateTibetanBowls(channelData, sampleRate);
                    break;
                default:
                    this.generateWhiteNoise(channelData);
            }
        }

        return buffer;
    }

    generateRainSound(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            // High-frequency noise for rain drops
            let rain = (Math.random() * 2 - 1) * 0.1;
            
            // Apply filtering to simulate distance
            if (i > 0) {
                rain = rain * 0.8 + channelData[i - 1] * 0.2;
            }
            
            channelData[i] = rain;
        }
    }

    generateOceanSound(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Low frequency waves
            const wave1 = Math.sin(2 * Math.PI * 0.1 * time) * 0.3;
            const wave2 = Math.sin(2 * Math.PI * 0.05 * time) * 0.2;
            
            // High frequency foam/bubbles
            const foam = (Math.random() * 2 - 1) * 0.05;
            
            channelData[i] = wave1 + wave2 + foam;
        }
    }

    generateForestSound(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Wind through leaves
            const wind = Math.sin(2 * Math.PI * 0.3 * time) * 0.1;
            
            // Random bird chirps
            let birds = 0;
            if (Math.random() < 0.001) {
                birds = Math.sin(2 * Math.PI * 1000 * time) * 0.05;
            }
            
            // Rustling leaves
            const rustle = (Math.random() * 2 - 1) * 0.02;
            
            channelData[i] = wind + birds + rustle;
        }
    }

    generateWhiteNoise(channelData) {
        for (let i = 0; i < channelData.length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.05;
        }
    }

    generateCosmicSound(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Deep space drones
            const drone1 = Math.sin(2 * Math.PI * 40 * time) * 0.1;
            const drone2 = Math.sin(2 * Math.PI * 60 * time) * 0.08;
            
            // Cosmic modulation
            const modulation = Math.sin(2 * Math.PI * 0.01 * time);
            
            channelData[i] = (drone1 + drone2) * (1 + modulation * 0.5);
        }
    }

    generateTibetanBowls(channelData, sampleRate) {
        for (let i = 0; i < channelData.length; i++) {
            const time = i / sampleRate;
            
            // Fundamental frequencies of singing bowls
            const bowl1 = Math.sin(2 * Math.PI * 220 * time) * 0.1;
            const bowl2 = Math.sin(2 * Math.PI * 330 * time) * 0.08;
            const bowl3 = Math.sin(2 * Math.PI * 440 * time) * 0.06;
            
            // Decay envelope
            const decay = Math.exp(-time * 0.1);
            
            channelData[i] = (bowl1 + bowl2 + bowl3) * decay;
        }
    }

    startRealTimeAnalysis() {
        const updateAnalysis = () => {
            if (!this.currentSession) return;
            
            // Get frequency data
            this.analyser.getFloatFrequencyData(this.realTimeData.frequencies);
            this.analyser.getFloatTimeDomainData(this.realTimeData.waveform);
            
            // Calculate volume (RMS)
            let sum = 0;
            for (let i = 0; i < this.realTimeData.waveform.length; i++) {
                sum += this.realTimeData.waveform[i] * this.realTimeData.waveform[i];
            }
            this.realTimeData.volume = Math.sqrt(sum / this.realTimeData.waveform.length);
            
            // Estimate dominant frequency
            let maxValue = -Infinity;
            let maxIndex = 0;
            for (let i = 0; i < this.realTimeData.frequencies.length; i++) {
                if (this.realTimeData.frequencies[i] > maxValue) {
                    maxValue = this.realTimeData.frequencies[i];
                    maxIndex = i;
                }
            }
            this.realTimeData.pitch = maxIndex * this.audioContext.sampleRate / (2 * this.analyser.fftSize);
            
            // Continue analysis
            if (this.currentSession) {
                requestAnimationFrame(updateAnalysis);
            }
        };
        
        updateAnalysis();
    }

    scheduleProgressiveChanges() {
        const duration = this.currentSession.duration;
        const phases = 4; // Divide session into phases
        const phaseLength = duration / phases;
        
        for (let phase = 1; phase <= phases; phase++) {
            setTimeout(() => {
                this.applyPhaseChanges(phase, phases);
            }, phase * phaseLength * 1000);
        }
    }

    applyPhaseChanges(phase, totalPhases) {
        console.log(`🎵 Entering phase ${phase}/${totalPhases}`);
        
        // Gradually change binaural beat frequency
        if (this.binauralBeats.leftOsc && this.binauralBeats.rightOsc) {
            const targetBeat = this.currentSession.binauralBeat * (0.5 + phase / totalPhases / 2);
            const currentTime = this.audioContext.currentTime;
            
            this.binauralBeats.rightOsc.frequency.exponentialRampToValueAtTime(
                this.currentSession.baseFrequency + targetBeat,
                currentTime + 30 // 30 second transition
            );
        }
        
        // Update worklet if available
        if (this.workletNode && this.workletNode.port) {
            this.workletNode.port.postMessage({
                type: 'setBrainwaveFreq',
                frequency: this.currentSession.binauralBeat * (phase / totalPhases)
            });
        }
    }

    startRecording() {
        if (this.isRecording) return;
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                this.recordingData = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    this.recordingData.push(event.data);
                };
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(this.recordingData, { type: 'audio/wav' });
                    this.processRecordedAudio(blob);
                };
                
                mediaRecorder.start();
                this.isRecording = true;
                this.mediaRecorder = mediaRecorder;
                
                console.log('🎤 Started recording');
            })
            .catch(error => {
                console.error('Failed to start recording:', error);
            });
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;
        
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        console.log('🎤 Stopped recording');
    }

    async processRecordedAudio(blob) {
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // Analyze recorded audio for biofeedback
            const analysis = this.analyzeAudioBuffer(audioBuffer);
            
            console.log('🎵 Audio analysis:', analysis);
            
            // Adapt session based on analysis
            this.adaptSessionToFeedback(analysis);
            
        } catch (error) {
            console.error('Failed to process recorded audio:', error);
        }
    }

    analyzeAudioBuffer(buffer) {
        const channelData = buffer.getChannelData(0);
        
        // Calculate metrics
        let rms = 0;
        let spectralCentroid = 0;
        let zeroCrossings = 0;
        
        // RMS calculation
        for (let i = 0; i < channelData.length; i++) {
            rms += channelData[i] * channelData[i];
        }
        rms = Math.sqrt(rms / channelData.length);
        
        // Zero crossings (rough pitch estimate)
        for (let i = 1; i < channelData.length; i++) {
            if ((channelData[i] >= 0) !== (channelData[i - 1] >= 0)) {
                zeroCrossings++;
            }
        }
        
        return {
            rms: rms,
            zeroCrossings: zeroCrossings,
            estimatedPitch: zeroCrossings * buffer.sampleRate / (2 * channelData.length),
            duration: buffer.duration
        };
    }

    adaptSessionToFeedback(analysis) {
        if (!this.currentSession) return;
        
        // Adjust session parameters based on biofeedback
        if (analysis.rms > 0.1) {
            // High activity detected, increase relaxation elements
            this.adjustMasterGain(0.8);
        } else {
            // Low activity, maintain current levels
            this.adjustMasterGain(1.0);
        }
        
        console.log('🧠 Adapted session based on biofeedback');
    }

    adjustMasterGain(targetGain) {
        if (this.masterGain) {
            this.masterGain.gain.exponentialRampToValueAtTime(
                targetGain,
                this.audioContext.currentTime + 2
            );
        }
    }

    stopSession() {
        if (!this.currentSession) return;
        
        console.log(`🎵 Stopping session: ${this.currentSession.name}`);
        
        // Stop binaural beats
        this.stopBinauralBeats();
        
        // Stop ambient sounds
        if (this.currentAmbientSources) {
            this.currentAmbientSources.forEach(source => {
                try {
                    source.stop();
                } catch (e) {
                    // Source may already be stopped
                }
            });
            this.currentAmbientSources = [];
        }
        
        // Stop recording if active
        if (this.isRecording) {
            this.stopRecording();
        }
        
        this.currentSession = null;
    }

    getAvailableSessions() {
        return Array.from(this.sessions.entries()).map(([id, session]) => ({
            id: id,
            name: session.name,
            duration: session.duration,
            target: session.brainwaveTarget
        }));
    }

    getRealTimeData() {
        return { ...this.realTimeData };
    }

    getCurrentSession() {
        return this.currentSession;
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    setSpatialPosition(x, y, z) {
        if (this.spatialPanner) {
            if (this.spatialPanner.positionX) {
                this.spatialPanner.positionX.value = x;
                this.spatialPanner.positionY.value = y;
                this.spatialPanner.positionZ.value = z;
            } else {
                this.spatialPanner.setPosition(x, y, z);
            }
        }
    }

    destroy() {
        this.stopSession();
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        this.isInitialized = false;
    }
}

// Export for global use
window.AdvancedAudioSystem = AdvancedAudioSystem;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.advancedAudioSystem) {
        window.advancedAudioSystem = new AdvancedAudioSystem();
    }
});
