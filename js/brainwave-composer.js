// Brainwave Music Composer & Synesthesia Simulator
class BrainwaveComposer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentComposition = null;
        this.brainwaveFrequencies = {
            delta: { min: 0.5, max: 4, color: '#8B0000', emotion: 'deep sleep' },
            theta: { min: 4, max: 8, color: '#4B0082', emotion: 'meditation' },
            alpha: { min: 8, max: 13, color: '#0000FF', emotion: 'relaxed focus' },
            beta: { min: 13, max: 30, color: '#008000', emotion: 'active thinking' },
            gamma: { min: 30, max: 100, color: '#FF0000', emotion: 'peak awareness' }
        };
        this.currentBrainState = {
            focus: 0.7,
            stress: 0.3,
            creativity: 0.8,
            energy: 0.6,
            emotional: 0.7
        };
        this.compositions = [];
        this.synesthesiaCanvas = null;
        this.visualizer = null;
        this.init();
    }

    async init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createComposerInterface();
            this.setupSynesthesiaVisualizer();
            this.startBrainwaveMonitoring();
        } catch (error) {
            console.error('Audio context initialization failed:', error);
        }
    }

    createComposerInterface() {
        const composer = document.createElement('div');
        composer.id = 'brainwaveComposer';
        composer.className = 'brainwave-composer';
        composer.innerHTML = `
            <div class="composer-header">
                <h4>🎵 Brainwave Music Composer</h4>
                <button onclick="brainwaveComposer.toggleComposer()" class="composer-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="composer-content" id="composerContent" style="display: none;">
                <!-- Brainwave State Display -->
                <div class="brainwave-display">
                    <h5>Current Brain State</h5>
                    <div class="brainwave-meters">
                        <div class="brainwave-meter">
                            <span>Focus</span>
                            <div class="meter-bar">
                                <div class="meter-fill focus-meter" id="focusMeter"></div>
                            </div>
                        </div>
                        <div class="brainwave-meter">
                            <span>Creativity</span>
                            <div class="meter-bar">
                                <div class="meter-fill creativity-meter" id="creativityMeter"></div>
                            </div>
                        </div>
                        <div class="brainwave-meter">
                            <span>Energy</span>
                            <div class="meter-bar">
                                <div class="meter-fill energy-meter" id="energyMeter"></div>
                            </div>
                        </div>
                        <div class="brainwave-meter">
                            <span>Calm</span>
                            <div class="meter-bar">
                                <div class="meter-fill calm-meter" id="calmMeter"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Synesthesia Visualizer -->
                <div class="synesthesia-container">
                    <canvas id="synesthesiaCanvas" width="300" height="150"></canvas>
                    <div class="visualizer-info">
                        <small>Your thoughts translated into colors and shapes</small>
                    </div>
                </div>

                <!-- Music Generation Controls -->
                <div class="composer-controls">
                    <button onclick="brainwaveComposer.generateComposition()" class="btn btn-primary">
                        <i class="fas fa-magic"></i> Generate Music
                    </button>
                    <button onclick="brainwaveComposer.playComposition()" class="btn btn-focus" id="playBtn">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button onclick="brainwaveComposer.saveComposition()" class="btn btn-dashboard">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button onclick="brainwaveComposer.exportAudio()" class="btn btn-challenges">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>

                <!-- Composition History -->
                <div class="composition-history">
                    <h5>Recent Compositions</h5>
                    <div id="compositionList" class="composition-list">
                        <div class="composition-item">
                            <span>🎵 No compositions yet</span>
                        </div>
                    </div>
                </div>

                <!-- Music Style Controls -->
                <div class="style-controls">
                    <h5>Musical Style</h5>
                    <div class="style-buttons">
                        <button onclick="brainwaveComposer.setStyle('ambient')" class="style-btn active" data-style="ambient">
                            🌊 Ambient
                        </button>
                        <button onclick="brainwaveComposer.setStyle('classical')" class="style-btn" data-style="classical">
                            🎼 Classical
                        </button>
                        <button onclick="brainwaveComposer.setStyle('electronic')" class="style-btn" data-style="electronic">
                            🔮 Electronic
                        </button>
                        <button onclick="brainwaveComposer.setStyle('nature')" class="style-btn" data-style="nature">
                            🌿 Nature
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styling
        composer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 320px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 160;
            max-height: 80vh;
            overflow-y: auto;
        `;

        document.body.appendChild(composer);
        this.addComposerStyles();
    }

    addComposerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .composer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .composer-toggle {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }

            .composer-toggle:hover {
                background: rgba(0,0,0,0.1);
            }

            .brainwave-meters {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .brainwave-meter {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .brainwave-meter span {
                min-width: 70px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .meter-bar {
                flex: 1;
                height: 8px;
                background: rgba(0,0,0,0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .meter-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .focus-meter { background: linear-gradient(90deg, #4CAF50, #8BC34A); }
            .creativity-meter { background: linear-gradient(90deg, #FF9800, #FFC107); }
            .energy-meter { background: linear-gradient(90deg, #F44336, #FF5722); }
            .calm-meter { background: linear-gradient(90deg, #2196F3, #03A9F4); }

            .synesthesia-container {
                margin: 1rem 0;
                text-align: center;
            }

            #synesthesiaCanvas {
                border: 2px solid rgba(0,0,0,0.1);
                border-radius: 8px;
                background: linear-gradient(135deg, #000428, #004e92);
            }

            .visualizer-info {
                margin-top: 0.5rem;
                color: var(--gray-medium);
            }

            .composer-controls {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
                margin: 1rem 0;
            }

            .composer-controls .btn {
                padding: 0.5rem;
                font-size: 0.8rem;
            }

            .composition-list {
                max-height: 100px;
                overflow-y: auto;
                background: rgba(0,0,0,0.05);
                border-radius: 8px;
                padding: 0.5rem;
            }

            .composition-item {
                padding: 0.5rem;
                margin-bottom: 0.5rem;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .composition-item:hover {
                background: var(--focus-color);
            }

            .style-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.5rem;
                margin-top: 0.5rem;
            }

            .style-btn {
                padding: 0.5rem;
                border: 2px solid rgba(0,0,0,0.1);
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 0.8rem;
            }

            .style-btn.active {
                border-color: var(--home-color);
                background: var(--home-color);
                color: white;
            }

            .style-btn:hover {
                border-color: var(--home-color);
            }

            @media (max-width: 768px) {
                #brainwaveComposer {
                    width: 90vw;
                    left: 5vw;
                    top: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupSynesthesiaVisualizer() {
        this.synesthesiaCanvas = document.getElementById('synesthesiaCanvas');
        if (this.synesthesiaCanvas) {
            this.visualizer = this.synesthesiaCanvas.getContext('2d');
            this.startVisualization();
        }
    }

    startVisualization() {
        const animate = () => {
            this.updateSynesthesiaVisualization();
            requestAnimationFrame(animate);
        };
        animate();
    }

    updateSynesthesiaVisualization() {
        if (!this.visualizer || !this.synesthesiaCanvas) return;

        const ctx = this.visualizer;
        const canvas = this.synesthesiaCanvas;
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas with gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#000428');
        gradient.addColorStop(1, '#004e92');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Generate synesthetic representations based on brain state
        this.drawBrainwaveVisualization(ctx, width, height);
        this.drawEmotionalParticles(ctx, width, height);
        this.drawCognitiveWaves(ctx, width, height);
    }

    drawBrainwaveVisualization(ctx, width, height) {
        const time = Date.now() * 0.002;
        
        // Draw brainwave patterns as flowing lines
        Object.entries(this.brainwaveFrequencies).forEach(([ type, data ], index) => {
            const intensity = this.getBrainwaveIntensity(type);
            const y = (height / 5) * (index + 0.5);
            
            ctx.strokeStyle = data.color;
            ctx.lineWidth = 2 + intensity * 3;
            ctx.globalAlpha = 0.7 + intensity * 0.3;
            
            ctx.beginPath();
            for (let x = 0; x < width; x += 2) {
                const frequency = data.min + (data.max - data.min) * intensity;
                const amplitude = intensity * 20;
                const wave = Math.sin((x * frequency * 0.01) + (time * frequency)) * amplitude;
                const y_pos = y + wave;
                
                if (x === 0) {
                    ctx.moveTo(x, y_pos);
                } else {
                    ctx.lineTo(x, y_pos);
                }
            }
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
    }

    drawEmotionalParticles(ctx, width, height) {
        const time = Date.now() * 0.001;
        const particleCount = Math.floor(this.currentBrainState.emotional * 20) + 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time;
            const radius = 30 + this.currentBrainState.creativity * 40;
            const x = (width / 2) + Math.cos(angle) * radius;
            const y = (height / 2) + Math.sin(angle) * radius;
            
            const size = 2 + this.currentBrainState.energy * 4;
            const hue = (time * 50 + i * 30) % 360;
            
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawCognitiveWaves(ctx, width, height) {
        const time = Date.now() * 0.003;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Ripple effects based on focus level
        const ripples = Math.floor(this.currentBrainState.focus * 5) + 1;
        
        for (let i = 0; i < ripples; i++) {
            const radius = (time * 50 + i * 30) % 100;
            const alpha = 1 - (radius / 100);
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    getBrainwaveIntensity(type) {
        // Map brain state to brainwave intensities
        const mapping = {
            delta: 1 - this.currentBrainState.energy,
            theta: this.currentBrainState.emotional,
            alpha: (this.currentBrainState.focus + (1 - this.currentBrainState.stress)) / 2,
            beta: this.currentBrainState.focus,
            gamma: this.currentBrainState.creativity
        };
        
        return Math.max(0, Math.min(1, mapping[type] || 0.5));
    }

    startBrainwaveMonitoring() {
        // Simulate real-time brainwave monitoring
        setInterval(() => {
            this.updateBrainState();
            this.updateBrainwaveMeters();
        }, 1000);
    }

    updateBrainState() {
        // Simulate natural brainwave fluctuations
        const fluctuation = 0.05;
        
        Object.keys(this.currentBrainState).forEach(key => {
            this.currentBrainState[key] += (Math.random() - 0.5) * fluctuation;
            this.currentBrainState[key] = Math.max(0, Math.min(1, this.currentBrainState[key]));
        });

        // Influence from neuro-responsive UI if available
        if (window.neuroUI) {
            this.currentBrainState.focus = window.neuroUI.focusLevel;
            this.currentBrainState.stress = window.neuroUI.stressLevel;
            this.currentBrainState.energy = window.neuroUI.energyLevel;
            this.currentBrainState.emotional = 1 - window.neuroUI.stressLevel;
        }
    }

    updateBrainwaveMeters() {
        const meters = {
            focusMeter: this.currentBrainState.focus,
            creativityMeter: this.currentBrainState.creativity,
            energyMeter: this.currentBrainState.energy,
            calmMeter: 1 - this.currentBrainState.stress
        };

        Object.entries(meters).forEach(([id, value]) => {
            const meter = document.getElementById(id);
            if (meter) {
                meter.style.width = `${value * 100}%`;
            }
        });
    }

    generateComposition() {
        const style = this.getCurrentStyle();
        const composition = this.createMusicFromBrainwaves(style);
        
        this.currentComposition = composition;
        this.compositions.unshift(composition);
        
        // Limit to last 10 compositions
        if (this.compositions.length > 10) {
            this.compositions.pop();
        }
        
        this.updateCompositionList();
        this.showToast(`🎵 Generated "${composition.title}" in ${style} style`);
    }

    createMusicFromBrainwaves(style) {
        const timestamp = new Date().toISOString();
        const brainSnapshot = { ...this.currentBrainState };
        
        // Generate musical parameters based on brain state
        const tempo = 60 + (brainSnapshot.energy * 80); // 60-140 BPM
        const key = this.selectMusicalKey(brainSnapshot);
        const scale = this.selectScale(brainSnapshot);
        const instruments = this.selectInstruments(style, brainSnapshot);
        
        const composition = {
            id: Date.now().toString(),
            title: this.generateCompositionTitle(style, brainSnapshot),
            style: style,
            timestamp: timestamp,
            brainState: brainSnapshot,
            musicData: {
                tempo: Math.round(tempo),
                key: key,
                scale: scale,
                instruments: instruments,
                structure: this.generateMusicalStructure(brainSnapshot),
                melody: this.generateMelody(brainSnapshot, scale),
                harmony: this.generateHarmony(brainSnapshot, key, scale),
                rhythm: this.generateRhythm(brainSnapshot, tempo)
            },
            duration: this.calculateDuration(brainSnapshot),
            audioBuffer: null // Would contain actual audio data
        };
        
        return composition;
    }

    getCurrentStyle() {
        const activeStyle = document.querySelector('.style-btn.active');
        return activeStyle ? activeStyle.dataset.style : 'ambient';
    }

    selectMusicalKey(brainState) {
        const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const emotional = brainState.emotional;
        
        // Happy/energetic states -> major keys (starting positions)
        // Calm/reflective states -> minor keys (offset by 3)
        const isMinor = emotional < 0.5;
        const baseIndex = Math.floor(brainState.creativity * keys.length);
        const keyIndex = isMinor ? (baseIndex + 3) % keys.length : baseIndex;
        
        return keys[keyIndex] + (isMinor ? 'm' : '');
    }

    selectScale(brainState) {
        const scales = {
            major: [0, 2, 4, 5, 7, 9, 11],
            minor: [0, 2, 3, 5, 7, 8, 10],
            pentatonic: [0, 2, 4, 7, 9],
            blues: [0, 3, 5, 6, 7, 10],
            dorian: [0, 2, 3, 5, 7, 9, 10]
        };
        
        if (brainState.creativity > 0.8) return scales.blues;
        if (brainState.focus > 0.7) return scales.pentatonic;
        if (brainState.emotional > 0.6) return scales.major;
        if (brainState.energy < 0.4) return scales.dorian;
        return scales.minor;
    }

    selectInstruments(style, brainState) {
        const instrumentSets = {
            ambient: ['synth_pad', 'reverb_piano', 'atmospheric_strings'],
            classical: ['piano', 'violin', 'cello', 'flute'],
            electronic: ['synthesizer', 'drum_machine', 'bass_synth'],
            nature: ['flute', 'water_sounds', 'bird_calls', 'wind_chimes']
        };
        
        const baseInstruments = instrumentSets[style] || instrumentSets.ambient;
        const instrumentCount = Math.floor(brainState.energy * baseInstruments.length) + 1;
        
        return baseInstruments.slice(0, instrumentCount);
    }

    generateCompositionTitle(style, brainState) {
        const adjectives = {
            high_focus: ['Focused', 'Sharp', 'Clear', 'Precise'],
            high_creativity: ['Creative', 'Flowing', 'Inspired', 'Imaginative'],
            high_energy: ['Energetic', 'Dynamic', 'Powerful', 'Vibrant'],
            low_stress: ['Peaceful', 'Calm', 'Serene', 'Tranquil']
        };
        
        const nouns = {
            ambient: ['Meditation', 'Journey', 'Space', 'Dream'],
            classical: ['Sonata', 'Prelude', 'Movement', 'Etude'],
            electronic: ['Pulse', 'Wave', 'Signal', 'Flow'],
            nature: ['Forest', 'River', 'Breeze', 'Dawn']
        };
        
        // Determine dominant brain state
        let dominantState = 'low_stress';
        if (brainState.focus > 0.7) dominantState = 'high_focus';
        else if (brainState.creativity > 0.7) dominantState = 'high_creativity';
        else if (brainState.energy > 0.7) dominantState = 'high_energy';
        
        const adjective = adjectives[dominantState][Math.floor(Math.random() * adjectives[dominantState].length)];
        const noun = nouns[style][Math.floor(Math.random() * nouns[style].length)];
        
        return `${adjective} ${noun}`;
    }

    generateMusicalStructure(brainState) {
        // Structure based on attention span and energy
        const sections = [];
        const totalDuration = this.calculateDuration(brainState);
        const sectionCount = Math.floor(brainState.focus * 4) + 2; // 2-6 sections
        
        for (let i = 0; i < sectionCount; i++) {
            sections.push({
                name: ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro'][Math.min(i, 4)],
                duration: totalDuration / sectionCount,
                intensity: Math.sin((i / sectionCount) * Math.PI) * brainState.energy
            });
        }
        
        return sections;
    }

    generateMelody(brainState, scale) {
        const notes = [];
        const noteCount = Math.floor(brainState.creativity * 32) + 16; // 16-48 notes
        
        for (let i = 0; i < noteCount; i++) {
            const scaleIndex = Math.floor(Math.random() * scale.length);
            const octave = 4 + Math.floor(brainState.energy * 2); // Octave 4-6
            const duration = Math.random() > 0.7 ? 0.5 : 0.25; // Quarter or eighth notes mostly
            
            notes.push({
                pitch: scale[scaleIndex] + (octave * 12),
                duration: duration,
                velocity: 0.5 + (brainState.energy * 0.5)
            });
        }
        
        return notes;
    }

    generateHarmony(brainState, key, scale) {
        const chords = [];
        const chordCount = Math.floor(brainState.focus * 8) + 4; // 4-12 chords
        
        for (let i = 0; i < chordCount; i++) {
            const rootIndex = Math.floor(Math.random() * scale.length);
            const chord = [
                scale[rootIndex],
                scale[(rootIndex + 2) % scale.length],
                scale[(rootIndex + 4) % scale.length]
            ];
            
            chords.push({
                notes: chord,
                duration: 1, // Whole note
                inversion: Math.floor(Math.random() * 3)
            });
        }
        
        return chords;
    }

    generateRhythm(brainState, tempo) {
        const beats = [];
        const complexity = brainState.energy;
        const patternLength = 16; // 16th notes in a measure
        
        for (let i = 0; i < patternLength; i++) {
            const isDownbeat = i % 4 === 0;
            const probability = isDownbeat ? 0.9 : complexity * 0.6;
            
            beats.push({
                hit: Math.random() < probability,
                velocity: isDownbeat ? 1.0 : 0.3 + (complexity * 0.4),
                instrument: isDownbeat ? 'kick' : 'snare'
            });
        }
        
        return { tempo, pattern: beats };
    }

    calculateDuration(brainState) {
        // Duration based on attention span and energy
        const baseDuration = 60; // 1 minute base
        const focusMultiplier = 1 + (brainState.focus * 2); // 1-3x multiplier
        const energyBonus = brainState.energy * 30; // Up to 30 seconds bonus
        
        return Math.min(180, baseDuration * focusMultiplier + energyBonus); // Max 3 minutes
    }

    async playComposition() {
        if (!this.currentComposition) {
            this.showToast('❌ No composition to play. Generate one first!');
            return;
        }

        if (this.isPlaying) {
            this.stopComposition();
            return;
        }

        try {
            await this.audioContext.resume();
            this.isPlaying = true;
            this.updatePlayButton(true);
            
            // Simulate playback with visual feedback
            this.simulatePlayback();
            
            this.showToast(`🎵 Playing "${this.currentComposition.title}"`);
        } catch (error) {
            console.error('Playback failed:', error);
            this.showToast('❌ Playback failed');
        }
    }

    simulatePlayback() {
        const duration = this.currentComposition.duration * 1000; // Convert to milliseconds
        
        // Simulate playback progression
        let progress = 0;
        const interval = setInterval(() => {
            progress += 100;
            const percentage = (progress / duration) * 100;
            
            // Update visual feedback
            this.updatePlaybackVisualization(percentage);
            
            if (progress >= duration) {
                clearInterval(interval);
                this.stopComposition();
            }
        }, 100);
        
        this.playbackInterval = interval;
    }

    stopComposition() {
        this.isPlaying = false;
        this.updatePlayButton(false);
        
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        
        this.updatePlaybackVisualization(0);
        this.showToast('⏹️ Playback stopped');
    }

    updatePlayButton(isPlaying) {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.innerHTML = isPlaying ? 
                '<i class="fas fa-stop"></i> Stop' : 
                '<i class="fas fa-play"></i> Play';
        }
    }

    updatePlaybackVisualization(percentage) {
        // Update synesthesia visualization during playback
        if (this.isPlaying) {
            this.currentBrainState.energy = Math.min(1, this.currentBrainState.energy + 0.1);
            this.currentBrainState.creativity = Math.min(1, this.currentBrainState.creativity + 0.05);
        }
    }

    saveComposition() {
        if (!this.currentComposition) {
            this.showToast('❌ No composition to save');
            return;
        }

        // Save to localStorage
        const saved = JSON.parse(localStorage.getItem('brainwaveCompositions') || '[]');
        saved.unshift(this.currentComposition);
        
        // Keep last 20 compositions
        if (saved.length > 20) {
            saved.splice(20);
        }
        
        localStorage.setItem('brainwaveCompositions', JSON.stringify(saved));
        this.showToast(`💾 Saved "${this.currentComposition.title}"`);
    }

    exportAudio() {
        if (!this.currentComposition) {
            this.showToast('❌ No composition to export');
            return;
        }

        // Create MIDI-like data export
        const exportData = {
            title: this.currentComposition.title,
            composer: 'NeuroX Brainwave Composer',
            timestamp: this.currentComposition.timestamp,
            brainwaveData: this.currentComposition.brainState,
            musicData: this.currentComposition.musicData,
            exportFormat: 'NeuroX-BWC-1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${this.currentComposition.title.replace(/\s+/g, '_')}.neurox`;
        link.click();
        
        this.showToast(`📥 Exported "${this.currentComposition.title}"`);
    }

    setStyle(style) {
        // Update active style button
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === style) {
                btn.classList.add('active');
            }
        });
        
        this.showToast(`🎨 Style changed to ${style}`);
    }

    updateCompositionList() {
        const listContainer = document.getElementById('compositionList');
        if (!listContainer || this.compositions.length === 0) return;

        listContainer.innerHTML = this.compositions.map(composition => `
            <div class="composition-item" onclick="brainwaveComposer.loadComposition('${composition.id}')">
                <span>🎵 ${composition.title}</span>
                <small>${composition.style}</small>
            </div>
        `).join('');
    }

    loadComposition(id) {
        const composition = this.compositions.find(c => c.id === id);
        if (composition) {
            this.currentComposition = composition;
            this.showToast(`📂 Loaded "${composition.title}"`);
        }
    }

    toggleComposer() {
        const content = document.getElementById('composerContent');
        const toggle = document.querySelector('.composer-toggle i');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.className = 'fas fa-chevron-up';
        } else {
            content.style.display = 'none';
            toggle.className = 'fas fa-chevron-down';
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'composer-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            left: 350px;
            background: var(--dashboard-color);
            color: var(--black);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            z-index: 1500;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(-100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods for integration
    updateFromNeuroState(neuroState) {
        this.currentBrainState = {
            focus: neuroState.focusLevel || 0.7,
            stress: neuroState.stressLevel || 0.3,
            creativity: neuroState.creativityLevel || 0.8,
            energy: neuroState.energyLevel || 0.6,
            emotional: 1 - (neuroState.stressLevel || 0.3)
        };
    }

    getComposerSummary() {
        return {
            isActive: this.isPlaying,
            currentComposition: this.currentComposition?.title || 'None',
            totalCompositions: this.compositions.length,
            currentBrainState: this.currentBrainState
        };
    }
}

// Initialize and export
window.brainwaveComposer = new BrainwaveComposer();
window.BrainwaveComposer = BrainwaveComposer;
