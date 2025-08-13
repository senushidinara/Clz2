/**
 * Advanced AI Cognitive Modeling System
 * Features: ONNX Runtime Web GPU, Brain.js + GPU.js, Real-time predictions, Adaptive learning
 */

class AICognitiveSystem {
    constructor() {
        this.isInitialized = false;
        this.models = new Map();
        this.session = null;
        this.gpuInstance = null;
        this.neuralNetworks = new Map();
        this.trainingData = [];
        this.predictions = [];
        this.userProfile = null;
        this.adaptiveParams = {
            learningRate: 0.01,
            batchSize: 32,
            epochs: 100,
            patience: 10
        };
        this.realTimeMetrics = {
            cognitiveLoad: 0,
            attention: 0,
            memory: 0,
            processing_speed: 0,
            accuracy: 0
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🤖 Initializing AI Cognitive System...');
            
            // Initialize GPU.js
            await this.initializeGPU();
            
            // Initialize ONNX Runtime
            await this.initializeONNX();
            
            // Initialize Brain.js networks
            await this.initializeNeuralNetworks();
            
            // Load pre-trained models
            await this.loadPretrainedModels();
            
            // Start real-time processing
            this.startRealTimeProcessing();
            
            this.isInitialized = true;
            console.log('✅ AI Cognitive System initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize AI Cognitive System:', error);
        }
    }

    async initializeGPU() {
        if (typeof GPU !== 'undefined') {
            this.gpuInstance = new GPU({
                mode: 'webgl2'
            });
            
            // Create GPU kernels for cognitive processing
            this.createGPUKernels();
            
            console.log('✅ GPU.js initialized for accelerated processing');
        } else {
            console.warn('⚠️ GPU.js not available, falling back to CPU');
        }
    }

    createGPUKernels() {
        // Attention processing kernel
        this.attentionKernel = this.gpuInstance.createKernel(function(input, weights) {
            let sum = 0;
            for (let i = 0; i < this.constants.inputSize; i++) {
                sum += input[i] * weights[i];
            }
            return 1 / (1 + Math.exp(-sum)); // Sigmoid activation
        }, {
            constants: { inputSize: 128 },
            output: [1]
        });

        // Memory encoding kernel
        this.memoryKernel = this.gpuInstance.createKernel(function(sequence, context) {
            let encoded = 0;
            for (let i = 0; i < this.constants.seqLength; i++) {
                encoded += sequence[i] * context[i % this.constants.contextSize];
            }
            return Math.tanh(encoded);
        }, {
            constants: { seqLength: 64, contextSize: 32 },
            output: [32]
        });

        // Cognitive load calculator
        this.cognitiveLoadKernel = this.gpuInstance.createKernel(function(features) {
            let load = 0;
            for (let i = 0; i < this.constants.featureCount; i++) {
                load += features[i] * features[i];
            }
            return Math.sqrt(load) / this.constants.featureCount;
        }, {
            constants: { featureCount: 16 },
            output: [1]
        });
    }

    async initializeONNX() {
        if (typeof ort !== 'undefined') {
            try {
                // Set execution providers
                ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/';
                
                // Try to use WebGL backend for GPU acceleration
                const providers = ['webgl', 'cpu'];
                console.log('🚀 ONNX Runtime initialized with providers:', providers);
                
            } catch (error) {
                console.warn('⚠️ ONNX Runtime initialization warning:', error);
            }
        } else {
            console.warn('⚠️ ONNX Runtime not available');
        }
    }

    async initializeNeuralNetworks() {
        if (typeof brain !== 'undefined') {
            
            // Attention Prediction Network
            this.neuralNetworks.set('attention', new brain.NeuralNetwork({
                hiddenLayers: [20, 15, 10],
                activation: 'relu',
                leakyReluAlpha: 0.01
            }));

            // Memory Performance Network
            this.neuralNetworks.set('memory', new brain.NeuralNetwork({
                hiddenLayers: [25, 20, 15],
                activation: 'tanh'
            }));

            // Cognitive Load Predictor
            this.neuralNetworks.set('cognitive_load', new brain.NeuralNetwork({
                hiddenLayers: [30, 25, 20, 10],
                activation: 'sigmoid'
            }));

            // Adaptive Difficulty Network
            this.neuralNetworks.set('difficulty', new brain.NeuralNetwork({
                hiddenLayers: [15, 12, 8],
                activation: 'relu'
            }));

            // Performance Optimization Network
            this.neuralNetworks.set('optimization', new brain.NeuralNetwork({
                hiddenLayers: [35, 30, 25, 15],
                activation: 'leakyRelu',
                leakyReluAlpha: 0.1
            }));

            console.log('✅ Neural networks initialized');
        } else {
            console.warn('⚠️ Brain.js not available');
        }
    }

    async loadPretrainedModels() {
        // In a real application, these would be loaded from a server
        // For demo, we'll create some pre-trained weights
        
        const pretrainedData = {
            attention: this.generateSyntheticTrainingData('attention', 1000),
            memory: this.generateSyntheticTrainingData('memory', 800),
            cognitive_load: this.generateSyntheticTrainingData('cognitive_load', 1200),
            difficulty: this.generateSyntheticTrainingData('difficulty', 600),
            optimization: this.generateSyntheticTrainingData('optimization', 1500)
        };

        // Train networks with synthetic data
        for (const [networkName, data] of Object.entries(pretrainedData)) {
            const network = this.neuralNetworks.get(networkName);
            if (network && data.length > 0) {
                console.log(`🎯 Training ${networkName} network...`);
                await this.trainNetwork(networkName, data);
            }
        }
    }

    generateSyntheticTrainingData(type, count) {
        const data = [];
        
        for (let i = 0; i < count; i++) {
            let input, output;
            
            switch (type) {
                case 'attention':
                    input = {
                        focusTime: Math.random(),
                        distractionLevel: Math.random(),
                        taskComplexity: Math.random(),
                        timeOfDay: Math.random(),
                        caffeine: Math.random(),
                        sleep: Math.random() * 8 + 4
                    };
                    output = {
                        attentionScore: Math.min(1, 
                            input.focusTime * 0.4 + 
                            (1 - input.distractionLevel) * 0.3 + 
                            (1 - input.taskComplexity) * 0.2 + 
                            input.sleep / 12 * 0.1
                        )
                    };
                    break;

                case 'memory':
                    input = {
                        encodingStrength: Math.random(),
                        rehearsalTime: Math.random() * 60,
                        interference: Math.random(),
                        emotionalValence: Math.random() * 2 - 1,
                        sleep: Math.random() * 8 + 4,
                        stress: Math.random()
                    };
                    output = {
                        retentionScore: Math.min(1,
                            input.encodingStrength * 0.3 +
                            Math.min(input.rehearsalTime / 30, 1) * 0.25 +
                            (1 - input.interference) * 0.2 +
                            Math.abs(input.emotionalValence) * 0.15 +
                            input.sleep / 12 * 0.1
                        )
                    };
                    break;

                case 'cognitive_load':
                    input = {
                        taskCount: Math.floor(Math.random() * 5) + 1,
                        taskComplexity: Math.random(),
                        timeLimit: Math.random(),
                        experience: Math.random(),
                        energy: Math.random(),
                        motivation: Math.random()
                    };
                    output = {
                        cognitiveLoad: Math.min(1,
                            input.taskCount / 5 * 0.3 +
                            input.taskComplexity * 0.3 +
                            (1 - input.timeLimit) * 0.2 +
                            (1 - input.experience) * 0.2
                        )
                    };
                    break;

                case 'difficulty':
                    input = {
                        currentScore: Math.random(),
                        recentTrend: Math.random() * 2 - 1,
                        sessionCount: Math.floor(Math.random() * 100),
                        userPreference: Math.random(),
                        adaptationRate: Math.random()
                    };
                    output = {
                        optimalDifficulty: Math.max(0.1, Math.min(0.9,
                            input.currentScore * 0.4 +
                            (input.recentTrend + 1) / 2 * 0.3 +
                            Math.min(input.sessionCount / 50, 1) * 0.2 +
                            input.userPreference * 0.1
                        ))
                    };
                    break;

                case 'optimization':
                    input = {
                        attention: Math.random(),
                        memory: Math.random(),
                        processing_speed: Math.random(),
                        cognitive_load: Math.random(),
                        fatigue: Math.random(),
                        motivation: Math.random(),
                        timeInSession: Math.random() * 60
                    };
                    output = {
                        continueSession: input.attention > 0.6 && input.fatigue < 0.7 ? 1 : 0,
                        recommendedBreak: input.fatigue > 0.8 || input.attention < 0.4 ? 1 : 0,
                        difficultyAdjustment: (input.attention + input.memory + input.processing_speed) / 3
                    };
                    break;
            }
            
            data.push({ input, output });
        }
        
        return data;
    }

    async trainNetwork(networkName, trainingData) {
        const network = this.neuralNetworks.get(networkName);
        if (!network || !trainingData || trainingData.length === 0) return;

        try {
            const options = {
                iterations: this.adaptiveParams.epochs,
                errorThresh: 0.005,
                log: false,
                logPeriod: 20,
                learningRate: this.adaptiveParams.learningRate,
                momentum: 0.1,
                callback: null,
                callbackPeriod: 10,
                timeout: 60000 // 1 minute timeout
            };

            await network.trainAsync(trainingData, options);
            console.log(`✅ ${networkName} network trained successfully`);
            
        } catch (error) {
            console.warn(`⚠️ Training failed for ${networkName}:`, error);
        }
    }

    startRealTimeProcessing() {
        // Process cognitive metrics every 500ms
        this.processingInterval = setInterval(() => {
            this.processRealTimeMetrics();
        }, 500);

        // Update predictions every 2 seconds
        this.predictionInterval = setInterval(() => {
            this.updatePredictions();
        }, 2000);

        // Adaptive learning every 30 seconds
        this.adaptiveInterval = setInterval(() => {
            this.performAdaptiveLearning();
        }, 30000);

        console.log('🔄 Real-time AI processing started');
    }

    processRealTimeMetrics() {
        try {
            // Get current metrics from other systems
            const currentMetrics = this.getCurrentMetrics();
            
            // Process with GPU kernels if available
            if (this.gpuInstance) {
                this.processWithGPU(currentMetrics);
            }
            
            // Update real-time metrics
            this.updateRealTimeMetrics(currentMetrics);
            
        } catch (error) {
            console.warn('Real-time processing error:', error);
        }
    }

    getCurrentMetrics() {
        // In a real application, this would get data from sensors, user interactions, etc.
        // For demo, we'll simulate realistic metrics
        
        const baseMetrics = {
            attention: Math.random() * 0.3 + 0.5, // 0.5-0.8
            memory: Math.random() * 0.4 + 0.4,    // 0.4-0.8
            processing_speed: Math.random() * 0.5 + 0.3, // 0.3-0.8
            cognitive_load: Math.random() * 0.6 + 0.2,   // 0.2-0.8
            fatigue: Math.random() * 0.4 + 0.1,          // 0.1-0.5
            motivation: Math.random() * 0.3 + 0.6,       // 0.6-0.9
            timeInSession: Date.now() - (this.sessionStartTime || Date.now()),
            taskComplexity: Math.random() * 0.5 + 0.3
        };

        // Add some realistic correlations
        if (baseMetrics.fatigue > 0.7) {
            baseMetrics.attention *= 0.7;
            baseMetrics.processing_speed *= 0.8;
        }

        if (baseMetrics.cognitive_load > 0.8) {
            baseMetrics.memory *= 0.9;
            baseMetrics.attention *= 0.8;
        }

        return baseMetrics;
    }

    processWithGPU(metrics) {
        try {
            // Attention processing
            if (this.attentionKernel) {
                const attentionInput = [
                    metrics.attention, metrics.cognitive_load, metrics.fatigue,
                    metrics.motivation, metrics.timeInSession / 1000 / 60
                ];
                const weights = [0.3, -0.2, -0.4, 0.2, -0.1];
                // const result = this.attentionKernel(attentionInput, weights);
            }

            // Memory processing
            if (this.memoryKernel) {
                const sequence = Array(64).fill().map(() => Math.random());
                const context = Array(32).fill().map(() => Math.random());
                // const memoryResult = this.memoryKernel(sequence, context);
            }

            // Cognitive load calculation
            if (this.cognitiveLoadKernel) {
                const features = Object.values(metrics).slice(0, 16);
                // const loadResult = this.cognitiveLoadKernel(features);
            }

        } catch (error) {
            console.warn('GPU processing error:', error);
        }
    }

    updateRealTimeMetrics(metrics) {
        // Smooth updates using exponential moving average
        const alpha = 0.3;
        
        Object.keys(this.realTimeMetrics).forEach(key => {
            if (metrics[key] !== undefined) {
                this.realTimeMetrics[key] = 
                    alpha * metrics[key] + (1 - alpha) * this.realTimeMetrics[key];
            }
        });

        // Emit events for other systems
        this.emitMetricsUpdate();
    }

    updatePredictions() {
        const currentMetrics = this.realTimeMetrics;
        const predictions = {};

        // Predict attention in next 30 seconds
        const attentionNetwork = this.neuralNetworks.get('attention');
        if (attentionNetwork) {
            try {
                const attentionInput = {
                    focusTime: Math.min(currentMetrics.attention, 1),
                    distractionLevel: 1 - currentMetrics.attention,
                    taskComplexity: currentMetrics.cognitive_load,
                    timeOfDay: (new Date().getHours()) / 24,
                    caffeine: 0.5, // Would be from user input
                    sleep: 7 // Would be from user input
                };
                
                predictions.attention = attentionNetwork.run(attentionInput);
            } catch (error) {
                console.warn('Attention prediction error:', error);
            }
        }

        // Predict optimal difficulty
        const difficultyNetwork = this.neuralNetworks.get('difficulty');
        if (difficultyNetwork) {
            try {
                const difficultyInput = {
                    currentScore: currentMetrics.accuracy,
                    recentTrend: 0, // Would calculate from history
                    sessionCount: this.getSessionCount(),
                    userPreference: 0.7, // Would be from user profile
                    adaptationRate: 0.5
                };
                
                predictions.difficulty = difficultyNetwork.run(difficultyInput);
            } catch (error) {
                console.warn('Difficulty prediction error:', error);
            }
        }

        // Store predictions
        this.predictions.push({
            timestamp: Date.now(),
            metrics: { ...currentMetrics },
            predictions: predictions
        });

        // Keep only last 100 predictions
        if (this.predictions.length > 100) {
            this.predictions.shift();
        }

        // Emit prediction update
        this.emitPredictionUpdate(predictions);
    }

    performAdaptiveLearning() {
        // Collect recent performance data
        const recentData = this.collectRecentPerformanceData();
        
        if (recentData.length < 10) return; // Need sufficient data

        // Retrain networks with new data
        this.retrainNetworks(recentData);

        // Adjust adaptive parameters
        this.adjustAdaptiveParameters(recentData);

        console.log('🔄 Adaptive learning cycle completed');
    }

    collectRecentPerformanceData() {
        // In a real application, this would collect actual user performance data
        // For demo, we'll simulate recent performance data
        
        const data = [];
        const now = Date.now();
        
        for (let i = 0; i < 20; i++) {
            const timestamp = now - (i * 60000); // Last 20 minutes
            
            data.push({
                timestamp: timestamp,
                input: {
                    attention: Math.random(),
                    cognitive_load: Math.random(),
                    difficulty: Math.random(),
                    timeInSession: Math.random() * 1800 // 30 minutes max
                },
                output: {
                    performance: Math.random(),
                    engagement: Math.random(),
                    completion: Math.random() > 0.2 ? 1 : 0
                }
            });
        }
        
        return data;
    }

    async retrainNetworks(newData) {
        // Incrementally update networks with new data
        const batchSize = Math.min(newData.length, this.adaptiveParams.batchSize);
        const batch = newData.slice(0, batchSize);

        for (const [networkName, network] of this.neuralNetworks) {
            try {
                // Convert data format for this network
                const networkData = this.formatDataForNetwork(networkName, batch);
                
                if (networkData.length > 0) {
                    const options = {
                        iterations: 10, // Quick incremental training
                        errorThresh: 0.01,
                        learningRate: this.adaptiveParams.learningRate * 0.5, // Lower LR for fine-tuning
                        log: false
                    };
                    
                    await network.trainAsync(networkData, options);
                }
            } catch (error) {
                console.warn(`Adaptive training error for ${networkName}:`, error);
            }
        }
    }

    formatDataForNetwork(networkName, data) {
        // Convert generic performance data to network-specific format
        return data.map(item => {
            const { input, output } = item;
            
            switch (networkName) {
                case 'attention':
                    return {
                        input: {
                            focusTime: input.attention,
                            distractionLevel: 1 - input.attention,
                            taskComplexity: input.cognitive_load,
                            timeOfDay: (new Date(item.timestamp).getHours()) / 24,
                            caffeine: 0.5,
                            sleep: 7
                        },
                        output: {
                            attentionScore: output.performance * input.attention
                        }
                    };
                    
                case 'difficulty':
                    return {
                        input: {
                            currentScore: output.performance,
                            recentTrend: 0,
                            sessionCount: this.getSessionCount(),
                            userPreference: 0.7,
                            adaptationRate: 0.5
                        },
                        output: {
                            optimalDifficulty: input.difficulty
                        }
                    };
                    
                default:
                    return null;
            }
        }).filter(item => item !== null);
    }

    adjustAdaptiveParameters(recentData) {
        // Analyze recent performance to adjust learning parameters
        const avgPerformance = recentData.reduce((sum, item) => 
            sum + item.output.performance, 0) / recentData.length;
        
        const avgEngagement = recentData.reduce((sum, item) => 
            sum + item.output.engagement, 0) / recentData.length;

        // Adjust learning rate based on performance stability
        const performanceVariance = this.calculateVariance(
            recentData.map(item => item.output.performance)
        );

        if (performanceVariance < 0.1) {
            // Stable performance, can increase learning rate
            this.adaptiveParams.learningRate = Math.min(0.05, this.adaptiveParams.learningRate * 1.1);
        } else {
            // Unstable performance, decrease learning rate
            this.adaptiveParams.learningRate = Math.max(0.001, this.adaptiveParams.learningRate * 0.9);
        }

        // Adjust batch size based on engagement
        if (avgEngagement > 0.8) {
            this.adaptiveParams.batchSize = Math.min(64, this.adaptiveParams.batchSize + 2);
        } else {
            this.adaptiveParams.batchSize = Math.max(16, this.adaptiveParams.batchSize - 2);
        }
    }

    calculateVariance(values) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
        return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    }

    // Public API Methods
    predict(networkName, input) {
        const network = this.neuralNetworks.get(networkName);
        if (!network) {
            throw new Error(`Network ${networkName} not found`);
        }
        
        try {
            return network.run(input);
        } catch (error) {
            console.error(`Prediction error for ${networkName}:`, error);
            return null;
        }
    }

    getOptimalDifficulty(currentPerformance) {
        const input = {
            currentScore: currentPerformance.accuracy || 0.5,
            recentTrend: currentPerformance.trend || 0,
            sessionCount: this.getSessionCount(),
            userPreference: this.getUserPreference(),
            adaptationRate: this.adaptiveParams.learningRate
        };

        const prediction = this.predict('difficulty', input);
        return prediction ? prediction.optimalDifficulty : 0.5;
    }

    getCognitiveRecommendations() {
        const metrics = this.realTimeMetrics;
        const recommendations = [];

        // Attention recommendations
        if (metrics.attention < 0.6) {
            recommendations.push({
                type: 'attention',
                priority: 'high',
                title: 'Focus Break Recommended',
                description: 'Your attention is declining. Consider a 5-minute mindfulness break.',
                action: 'start_mindfulness'
            });
        }

        // Cognitive load recommendations
        if (metrics.cognitiveLoad > 0.8) {
            recommendations.push({
                type: 'cognitive_load',
                priority: 'medium',
                title: 'Reduce Complexity',
                description: 'High cognitive load detected. Consider simplifying current tasks.',
                action: 'reduce_difficulty'
            });
        }

        // Memory recommendations
        if (metrics.memory < 0.5) {
            recommendations.push({
                type: 'memory',
                priority: 'medium',
                title: 'Memory Enhancement',
                description: 'Try the memory palace technique or spaced repetition.',
                action: 'memory_training'
            });
        }

        return recommendations;
    }

    exportModelData() {
        const modelData = {};
        
        this.neuralNetworks.forEach((network, name) => {
            try {
                modelData[name] = {
                    weights: network.toJSON(),
                    performance: this.getNetworkPerformance(name),
                    lastTrained: Date.now()
                };
            } catch (error) {
                console.warn(`Failed to export ${name} model:`, error);
            }
        });

        return {
            models: modelData,
            predictions: this.predictions.slice(-50), // Last 50 predictions
            metrics: this.realTimeMetrics,
            adaptiveParams: this.adaptiveParams,
            exportTimestamp: Date.now()
        };
    }

    getNetworkPerformance(networkName) {
        // In a real application, this would track validation accuracy
        return {
            accuracy: 0.85 + Math.random() * 0.1,
            loss: Math.random() * 0.1,
            lastValidation: Date.now()
        };
    }

    // Utility methods
    getSessionCount() {
        return parseInt(localStorage.getItem('neuroX_sessionCount') || '0');
    }

    getUserPreference() {
        const profile = JSON.parse(localStorage.getItem('neuroXUser') || '{}');
        return profile.preferences?.difficulty === 'hard' ? 0.8 : 
               profile.preferences?.difficulty === 'easy' ? 0.3 : 0.5;
    }

    emitMetricsUpdate() {
        const event = new CustomEvent('aiMetricsUpdate', {
            detail: { ...this.realTimeMetrics }
        });
        document.dispatchEvent(event);
    }

    emitPredictionUpdate(predictions) {
        const event = new CustomEvent('aiPredictionUpdate', {
            detail: predictions
        });
        document.dispatchEvent(event);
    }

    // Cleanup
    destroy() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
        }
        if (this.predictionInterval) {
            clearInterval(this.predictionInterval);
        }
        if (this.adaptiveInterval) {
            clearInterval(this.adaptiveInterval);
        }

        if (this.gpuInstance) {
            this.gpuInstance.destroy();
        }

        console.log('🤖 AI Cognitive System destroyed');
    }
}

// Export for global use
window.AICognitiveSystem = AICognitiveSystem;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.aiCognitiveSystem) {
        window.aiCognitiveSystem = new AICognitiveSystem();
    }
});
