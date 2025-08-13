/**
 * NeuroX Advanced Features Integration
 * Orchestrates all advanced cognitive training features with latest technologies
 */

class NeuroXAdvanced {
    constructor() {
        this.systems = {
            web3: null,
            brain3D: null,
            cognitiveTwin: null,
            neuroResponsive: null,
            memoryGarden: null,
            brainwaveComposer: null,
            advancedAudio: null,
            dataVisualization: null
        };
        this.isInitialized = false;
        this.currentUser = null;
        this.sessionData = {};
        this.achievements = [];
        this.socialConnections = [];
        this.realTimeMetrics = {
            attention: 0,
            focus: 0,
            relaxation: 0,
            cognitive_load: 0,
            brainwaves: {
                delta: 0,
                theta: 0,
                alpha: 0,
                beta: 0,
                gamma: 0
            }
        };
        
        this.initializeAdvancedFeatures();
    }

    async initializeAdvancedFeatures() {
        try {
            console.log('🧠 Initializing NeuroX Advanced Features...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupSystems();
                });
            } else {
                await this.setupSystems();
            }
            
        } catch (error) {
            console.error('Failed to initialize NeuroX Advanced:', error);
        }
    }

    async setupSystems() {
        console.log('🔧 Setting up advanced systems...');
        
        // Initialize Web3 system
        if (window.NeuroWeb3) {
            try {
                this.systems.web3 = new window.NeuroWeb3();
                console.log('✅ Web3 system initialized');
            } catch (error) {
                console.warn('⚠️ Web3 system failed to initialize:', error);
            }
        }

        // Initialize Advanced Audio System
        if (window.AdvancedAudioSystem) {
            try {
                this.systems.advancedAudio = new window.AdvancedAudioSystem();
                console.log('✅ Advanced Audio System initialized');
            } catch (error) {
                console.warn('⚠️ Advanced Audio System failed to initialize:', error);
            }
        }

        // Initialize Advanced Data Visualization
        if (window.AdvancedDataVisualization) {
            try {
                this.systems.dataVisualization = new window.AdvancedDataVisualization();
                console.log('✅ Advanced Data Visualization initialized');
            } catch (error) {
                console.warn('⚠️ Advanced Data Visualization failed to initialize:', error);
            }
        }

        // Initialize 3D Brain Visualization
        if (window.Brain3DVisualization) {
            try {
                this.systems.brain3D = new window.Brain3DVisualization('brain3DContainer');
                console.log('✅ 3D Brain Visualization initialized');
            } catch (error) {
                console.warn('⚠️ 3D Brain Visualization failed to initialize:', error);
            }
        }

        // Initialize Cognitive Twin
        if (window.CognitiveTwin) {
            try {
                this.systems.cognitiveTwin = new window.CognitiveTwin();
                console.log('✅ Cognitive Twin initialized');
            } catch (error) {
                console.warn('⚠️ Cognitive Twin failed to initialize:', error);
            }
        }

        // Initialize other systems...
        await this.initializeOtherSystems();
        
        // Start real-time data collection
        this.startRealTimeDataCollection();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('🎉 NeuroX Advanced Systems Initialized Successfully!');
    }

    async initializeOtherSystems() {
        // Initialize Neuro-Responsive UI
        if (window.NeuroResponsiveUI) {
            try {
                this.systems.neuroResponsive = new window.NeuroResponsiveUI();
                console.log('✅ Neuro-Responsive UI initialized');
            } catch (error) {
                console.warn('⚠️ Neuro-Responsive UI failed to initialize:', error);
            }
        }

        // Initialize Memory Garden
        if (window.ThoughtGarden) {
            try {
                this.systems.memoryGarden = new window.ThoughtGarden();
                console.log('✅ Memory Garden initialized');
            } catch (error) {
                console.warn('⚠️ Memory Garden failed to initialize:', error);
            }
        }

        // Initialize Brainwave Composer
        if (window.BrainwaveComposer) {
            try {
                this.systems.brainwaveComposer = new window.BrainwaveComposer();
                console.log('✅ Brainwave Composer initialized');
            } catch (error) {
                console.warn('⚠️ Brainwave Composer failed to initialize:', error);
            }
        }
    }

    setupEventListeners() {
        // Listen for wallet connection changes
        document.addEventListener('walletConnected', (event) => {
            this.onWalletConnected(event.detail);
        });

        document.addEventListener('nftVerified', (event) => {
            this.onNFTVerified(event.detail);
        });

        // Performance tracking
        document.addEventListener('challengeCompleted', (event) => {
            this.trackPerformance(event.detail);
        });

        // Audio session events
        document.addEventListener('audioSessionStarted', (event) => {
            this.onAudioSessionStarted(event.detail);
        });

        // Visualization events
        document.addEventListener('brainActivityChanged', (event) => {
            this.onBrainActivityChanged(event.detail);
        });
    }

    startRealTimeDataCollection() {
        // Collect data from all systems every second
        this.dataCollectionInterval = setInterval(() => {
            this.collectRealTimeMetrics();
        }, 1000);

        // Sync data between systems every 5 seconds
        this.syncInterval = setInterval(() => {
            this.syncSystemData();
        }, 5000);

        console.log('📊 Real-time data collection started');
    }

    collectRealTimeMetrics() {
        try {
            // Collect from audio system
            if (this.systems.advancedAudio && this.systems.advancedAudio.getRealTimeData) {
                const audioData = this.systems.advancedAudio.getRealTimeData();
                this.realTimeMetrics.volume = audioData.volume;
                this.realTimeMetrics.pitch = audioData.pitch;
            }

            // Collect from brain visualization
            if (this.systems.brain3D && this.systems.brain3D.exportVisualizationData) {
                const brainData = this.systems.brain3D.exportVisualizationData();
                this.updateBrainMetrics(brainData);
            }

            // Collect from data visualization
            if (this.systems.dataVisualization && this.systems.dataVisualization.getDataStream) {
                const brainwaveData = this.systems.dataVisualization.getDataStream('brainwaves');
                if (brainwaveData && brainwaveData.data) {
                    this.updateBrainwaveMetrics(brainwaveData.data);
                }
            }

            // Update UI with collected metrics
            this.updateMetricsUI();

        } catch (error) {
            console.warn('Data collection error:', error);
        }
    }

    updateBrainMetrics(brainData) {
        if (!brainData || !brainData.regions) return;

        // Calculate average activity across regions
        let totalActivity = 0;
        let regionCount = 0;

        brainData.regions.forEach(region => {
            totalActivity += region.activity;
            regionCount++;
        });

        if (regionCount > 0) {
            this.realTimeMetrics.cognitive_load = totalActivity / regionCount;
        }
    }

    updateBrainwaveMetrics(brainwaveData) {
        Object.keys(brainwaveData).forEach(band => {
            if (brainwaveData[band].length > 0) {
                const latest = brainwaveData[band].slice(-1)[0];
                this.realTimeMetrics.brainwaves[band] = latest.value;
            }
        });

        // Calculate derived metrics
        this.realTimeMetrics.attention = this.realTimeMetrics.brainwaves.beta * 0.7 + 
                                         this.realTimeMetrics.brainwaves.gamma * 0.3;
        this.realTimeMetrics.relaxation = this.realTimeMetrics.brainwaves.alpha * 0.6 + 
                                          this.realTimeMetrics.brainwaves.theta * 0.4;
        this.realTimeMetrics.focus = (this.realTimeMetrics.attention + (100 - this.realTimeMetrics.relaxation)) / 2;
    }

    syncSystemData() {
        // Sync cognitive state between systems
        const cognitiveState = {
            attention: this.realTimeMetrics.attention / 100,
            focus: this.realTimeMetrics.focus / 100,
            relaxation: this.realTimeMetrics.relaxation / 100,
            activity: this.realTimeMetrics.cognitive_load
        };

        // Update brain visualization
        if (this.systems.brain3D && this.systems.brain3D.updateCognitiveState) {
            this.systems.brain3D.updateCognitiveState(cognitiveState);
        }

        // Update neuro-responsive UI
        if (this.systems.neuroResponsive && this.systems.neuroResponsive.updateState) {
            this.systems.neuroResponsive.updateState(cognitiveState);
        }

        // Update cognitive twin
        if (this.systems.cognitiveTwin && this.systems.cognitiveTwin.updateBrainState) {
            this.systems.cognitiveTwin.updateBrainState(this.realTimeMetrics);
        }
    }

    updateMetricsUI() {
        // Update dashboard metrics if visible
        const metricsPanel = document.getElementById('realTimeMetrics');
        if (metricsPanel) {
            metricsPanel.innerHTML = `
                <div class="metric-item">
                    <span class="metric-label">Attention:</span>
                    <span class="metric-value">${Math.round(this.realTimeMetrics.attention)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Focus:</span>
                    <span class="metric-value">${Math.round(this.realTimeMetrics.focus)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Relaxation:</span>
                    <span class="metric-value">${Math.round(this.realTimeMetrics.relaxation)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Cognitive Load:</span>
                    <span class="metric-value">${Math.round(this.realTimeMetrics.cognitive_load * 100)}%</span>
                </div>
            `;
        }
    }

    // Advanced Training Session Management
    async startAdvancedTrainingSession(type, options = {}) {
        try {
            console.log(`🎯 Starting advanced ${type} training session`);

            const sessionConfig = {
                type: type,
                duration: options.duration || 900, // 15 minutes default
                difficulty: options.difficulty || 'adaptive',
                modalities: options.modalities || ['visual', 'audio'],
                biofeedback: options.biofeedback || true,
                ...options
            };

            // Initialize audio session if requested
            if (sessionConfig.modalities.includes('audio') && this.systems.advancedAudio) {
                const audioSession = await this.systems.advancedAudio.startSession(type, {
                    duration: sessionConfig.duration,
                    customSettings: options.audioSettings
                });
                sessionConfig.audioSessionId = audioSession.id;
            }

            // Start brain visualization recording
            if (this.systems.brain3D) {
                this.systems.brain3D.setInteractionMode('analyze');
            }

            // Start data visualization recording
            if (this.systems.dataVisualization) {
                this.systems.dataVisualization.startRealTimeUpdates();
            }

            // Create session tracking
            this.currentSession = {
                id: Date.now().toString(),
                ...sessionConfig,
                startTime: Date.now(),
                metrics: [],
                events: []
            };

            // Store session data
            this.sessionData[this.currentSession.id] = this.currentSession;

            return this.currentSession;

        } catch (error) {
            console.error('Failed to start advanced training session:', error);
            throw error;
        }
    }

    async endTrainingSession() {
        if (!this.currentSession) return null;

        try {
            const session = this.currentSession;
            session.endTime = Date.now();
            session.duration = session.endTime - session.startTime;

            // Stop audio session
            if (session.audioSessionId && this.systems.advancedAudio) {
                this.systems.advancedAudio.stopSession();
            }

            // Export brain data
            if (this.systems.brain3D) {
                session.brainData = this.systems.brain3D.exportVisualizationData();
            }

            // Export visualization data
            if (this.systems.dataVisualization) {
                session.vizData = {
                    eeg: this.systems.dataVisualization.exportChartData('eegChart'),
                    brainwaves: this.systems.dataVisualization.exportChartData('brainwaveChart'),
                    cognitive: this.systems.dataVisualization.exportChartData('cognitiveChart')
                };
            }

            // Analyze session performance
            session.analysis = await this.analyzeSessionPerformance(session);

            // Update user profile
            if (this.currentUser) {
                this.updateUserProfileFromSession(session);
            }

            // Generate insights
            session.insights = this.generateSessionInsights(session);

            this.currentSession = null;
            return session;

        } catch (error) {
            console.error('Failed to end training session:', error);
            return null;
        }
    }

    async analyzeSessionPerformance(session) {
        const analysis = {
            overallScore: 0,
            improvementAreas: [],
            strengths: [],
            recommendations: []
        };

        try {
            // Analyze attention patterns
            const avgAttention = this.calculateAverageMetric(session.metrics, 'attention');
            analysis.attention = {
                average: avgAttention,
                trend: this.calculateTrend(session.metrics, 'attention'),
                stability: this.calculateStability(session.metrics, 'attention')
            };

            // Analyze focus patterns
            const avgFocus = this.calculateAverageMetric(session.metrics, 'focus');
            analysis.focus = {
                average: avgFocus,
                trend: this.calculateTrend(session.metrics, 'focus'),
                peak: this.findPeakMetric(session.metrics, 'focus')
            };

            // Calculate overall score
            analysis.overallScore = (avgAttention + avgFocus) / 2;

            // Generate recommendations
            if (avgAttention < 70) {
                analysis.improvementAreas.push('attention');
                analysis.recommendations.push('Try attention-focused meditation sessions');
            }

            if (avgFocus < 70) {
                analysis.improvementAreas.push('focus');
                analysis.recommendations.push('Practice concentration exercises');
            }

            if (avgAttention > 80) {
                analysis.strengths.push('attention');
            }

            if (avgFocus > 80) {
                analysis.strengths.push('focus');
            }

        } catch (error) {
            console.error('Session analysis failed:', error);
        }

        return analysis;
    }

    calculateAverageMetric(metrics, metricName) {
        if (!metrics || metrics.length === 0) return 0;
        
        const values = metrics.map(m => m[metricName]).filter(v => v !== undefined);
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }

    calculateTrend(metrics, metricName) {
        if (!metrics || metrics.length < 2) return 'stable';
        
        const values = metrics.map(m => m[metricName]).filter(v => v !== undefined);
        if (values.length < 2) return 'stable';
        
        const first = values.slice(0, Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
        const last = values.slice(-Math.floor(values.length / 3)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 3);
        
        const diff = last - first;
        if (diff > 5) return 'improving';
        if (diff < -5) return 'declining';
        return 'stable';
    }

    calculateStability(metrics, metricName) {
        if (!metrics || metrics.length === 0) return 0;
        
        const values = metrics.map(m => m[metricName]).filter(v => v !== undefined);
        if (values.length === 0) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    findPeakMetric(metrics, metricName) {
        if (!metrics || metrics.length === 0) return 0;
        
        const values = metrics.map(m => m[metricName]).filter(v => v !== undefined);
        return values.length > 0 ? Math.max(...values) : 0;
    }

    generateSessionInsights(session) {
        const insights = [];

        if (session.analysis) {
            const { attention, focus } = session.analysis;

            if (attention && attention.trend === 'improving') {
                insights.push({
                    type: 'positive',
                    title: 'Attention Improvement',
                    description: 'Your attention levels improved throughout the session!',
                    icon: '📈'
                });
            }

            if (focus && focus.average > 85) {
                insights.push({
                    type: 'achievement',
                    title: 'Excellent Focus',
                    description: 'You maintained exceptional focus during this session.',
                    icon: '🎯'
                });
            }

            if (attention && attention.stability < 10) {
                insights.push({
                    type: 'skill',
                    title: 'Stable Attention',
                    description: 'Your attention remained consistently stable.',
                    icon: '⚖️'
                });
            }
        }

        return insights;
    }

    updateUserProfileFromSession(session) {
        if (!this.currentUser || !session.analysis) return;

        // Update experience points
        const xpGained = Math.floor(session.analysis.overallScore);
        this.currentUser.experience = (this.currentUser.experience || 0) + xpGained;

        // Update session count
        this.currentUser.totalSessions = (this.currentUser.totalSessions || 0) + 1;

        // Update best scores
        if (!this.currentUser.bestScores) {
            this.currentUser.bestScores = {};
        }

        const sessionType = session.type;
        if (!this.currentUser.bestScores[sessionType] || 
            session.analysis.overallScore > this.currentUser.bestScores[sessionType]) {
            this.currentUser.bestScores[sessionType] = session.analysis.overallScore;
        }

        // Update streak
        const today = new Date().toDateString();
        if (this.currentUser.lastSessionDate !== today) {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
            if (this.currentUser.lastSessionDate === yesterday) {
                this.currentUser.streak = (this.currentUser.streak || 0) + 1;
            } else {
                this.currentUser.streak = 1;
            }
            this.currentUser.lastSessionDate = today;
        }

        this.saveUserProfile();
    }

    // Audio Session Integration
    async startAudioSession(sessionType, options = {}) {
        if (!this.systems.advancedAudio) {
            throw new Error('Advanced Audio System not available');
        }

        return await this.systems.advancedAudio.startSession(sessionType, options);
    }

    stopAudioSession() {
        if (this.systems.advancedAudio) {
            this.systems.advancedAudio.stopSession();
        }
    }

    // Data Visualization Integration
    createAdvancedChart(containerId, chartType, options = {}) {
        if (!this.systems.dataVisualization) {
            console.warn('Advanced Data Visualization not available');
            return;
        }

        switch (chartType) {
            case 'eeg':
                this.systems.dataVisualization.createEEGChart(containerId);
                break;
            case 'brainwave':
                this.systems.dataVisualization.createBrainwaveChart(containerId);
                break;
            case 'cognitive':
                this.systems.dataVisualization.createCognitivePerformanceChart(containerId);
                break;
            case '3d-brain':
                this.systems.dataVisualization.create3DBrainActivity(containerId);
                break;
            case 'heatmap':
                this.systems.dataVisualization.createComplexHeatmap(containerId, options.data);
                break;
            case 'timeseries':
                this.systems.dataVisualization.createTimeSeriesAnalysis(containerId);
                break;
        }
    }

    // User Management
    async createUser(userData) {
        this.currentUser = {
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date(),
            cognitiveProfile: await this.generateCognitiveProfile(),
            preferences: {
                difficulty: 'adaptive',
                sessionLength: 15,
                preferredModalities: ['visual', 'auditory'],
                audioPreferences: {
                    binauralBeats: true,
                    ambientSounds: ['rain', 'ocean'],
                    volume: 0.7
                },
                visualPreferences: {
                    colorScheme: 'adaptive',
                    animationSpeed: 'normal',
                    particles: true
                }
            }
        };
        
        localStorage.setItem('neuroXUser', JSON.stringify(this.currentUser));
        return this.currentUser;
    }

    async generateCognitiveProfile() {
        // Generate a basic cognitive profile
        return {
            cognitiveType: this.determineCognitiveType(),
            strengths: this.identifyInitialStrengths(),
            areas_for_improvement: this.identifyInitialImprovements(),
            learningStyle: this.determineLearningStyle(),
            optimalTimeOfDay: this.determineOptimalTime()
        };
    }

    determineCognitiveType() {
        const types = ['analytical', 'creative', 'practical', 'experimental'];
        return types[Math.floor(Math.random() * types.length)];
    }

    identifyInitialStrengths() {
        const allStrengths = ['memory', 'attention', 'processing_speed', 'cognitive_flexibility', 'working_memory'];
        return allStrengths.slice(0, 2 + Math.floor(Math.random() * 2));
    }

    identifyInitialImprovements() {
        const allAreas = ['focus', 'sustained_attention', 'task_switching', 'inhibitory_control'];
        return allAreas.slice(0, 1 + Math.floor(Math.random() * 2));
    }

    determineLearningStyle() {
        const styles = ['visual', 'auditory', 'kinesthetic', 'multimodal'];
        return styles[Math.floor(Math.random() * styles.length)];
    }

    determineOptimalTime() {
        const times = ['morning', 'afternoon', 'evening', 'variable'];
        return times[Math.floor(Math.random() * times.length)];
    }

    saveUserProfile() {
        if (this.currentUser) {
            localStorage.setItem('neuroXUser', JSON.stringify(this.currentUser));
        }
    }

    loadUserProfile() {
        const saved = localStorage.getItem('neuroXUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            return this.currentUser;
        }
        return null;
    }

    // Event Handlers
    async onWalletConnected(walletData) {
        console.log('🔗 Wallet connected:', walletData);
        // Handle wallet connection
    }

    async onNFTVerified(nftData) {
        console.log('🎨 NFT verified:', nftData);
        // Handle NFT verification
    }

    onAudioSessionStarted(sessionData) {
        console.log('🎵 Audio session started:', sessionData);
        // Update UI to show audio session is active
    }

    onBrainActivityChanged(activityData) {
        console.log('🧠 Brain activity changed:', activityData);
        // React to brain activity changes
    }

    trackPerformance(performanceData) {
        if (this.currentSession) {
            this.currentSession.events.push({
                timestamp: Date.now(),
                type: 'performance',
                data: performanceData
            });
        }
    }

    // Cleanup
    destroy() {
        // Stop data collection
        if (this.dataCollectionInterval) {
            clearInterval(this.dataCollectionInterval);
        }
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        // Destroy all systems
        Object.values(this.systems).forEach(system => {
            if (system && system.destroy) {
                system.destroy();
            }
        });

        console.log('🧠 NeuroX Advanced systems destroyed');
    }

    // Utility Methods
    getRealTimeMetrics() {
        return { ...this.realTimeMetrics };
    }

    getCurrentSession() {
        return this.currentSession;
    }

    getSystemStatus() {
        const status = {};
        Object.keys(this.systems).forEach(key => {
            status[key] = this.systems[key] ? 'initialized' : 'not available';
        });
        return status;
    }
}

// Export for global use
window.NeuroXAdvanced = NeuroXAdvanced;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.neuroXAdvanced) {
        window.neuroXAdvanced = new NeuroXAdvanced();
    }
});
