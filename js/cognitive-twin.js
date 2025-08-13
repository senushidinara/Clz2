// Advanced Cognitive Twin & Brain Mapping System
class CognitiveTwin {
    constructor() {
        this.brainMap = {
            memory: { strength: 0, patterns: [], improvement: 0 },
            focus: { strength: 0, patterns: [], improvement: 0 },
            processing: { strength: 0, patterns: [], improvement: 0 },
            emotional: { strength: 0, patterns: [], improvement: 0 },
            creativity: { strength: 0, patterns: [], improvement: 0 }
        };
        this.cognitiveFingerprint = null;
        this.twinPersonality = {};
        this.predictionAccuracy = 0;
        this.sessionHistory = [];
        this.neuralNetworkState = this.initializeNeuralNetwork();
    }

    initializeNeuralNetwork() {
        return {
            neurons: this.generateNeurons(100),
            connections: this.generateConnections(),
            activationPattern: new Array(100).fill(0),
            plasticity: 0.7,
            learningRate: 0.1
        };
    }

    generateNeurons(count) {
        const neurons = [];
        for (let i = 0; i < count; i++) {
            neurons.push({
                id: i,
                type: ['memory', 'focus', 'processing', 'emotional', 'creativity'][Math.floor(i / 20)],
                activation: Math.random() * 0.5,
                threshold: 0.3 + Math.random() * 0.4,
                connections: []
            });
        }
        return neurons;
    }

    generateConnections() {
        const connections = [];
        for (let i = 0; i < 300; i++) {
            connections.push({
                from: Math.floor(Math.random() * 100),
                to: Math.floor(Math.random() * 100),
                weight: (Math.random() - 0.5) * 2,
                strength: Math.random()
            });
        }
        return connections;
    }

    async performCognitiveMapping(sessionData) {
        console.log('🧠 Performing cognitive mapping...');
        
        // Analyze reaction times, accuracy, and patterns
        const analysis = this.analyzeSessionData(sessionData);
        
        // Update brain map
        this.updateBrainMap(analysis);
        
        // Generate cognitive fingerprint
        this.cognitiveFingerprint = this.generateCognitiveFingerprint();
        
        // Train the neural network
        this.trainNeuralNetwork(sessionData);
        
        // Update twin personality
        this.updateTwinPersonality();
        
        return {
            brainMap: this.brainMap,
            fingerprint: this.cognitiveFingerprint,
            twinInsights: this.generateTwinInsights(),
            predictions: this.generatePredictions()
        };
    }

    analyzeSessionData(sessionData) {
        const patterns = {
            reactionTimes: [],
            accuracy: [],
            errorPatterns: [],
            attentionSpan: 0,
            stressIndicators: []
        };

        // Simulate advanced analysis
        sessionData.forEach((session, index) => {
            patterns.reactionTimes.push(500 + Math.random() * 1000 - index * 10);
            patterns.accuracy.push(0.6 + Math.random() * 0.4 + index * 0.01);
            patterns.errorPatterns.push({
                type: ['timing', 'accuracy', 'attention'][Math.floor(Math.random() * 3)],
                frequency: Math.random()
            });
        });

        patterns.attentionSpan = this.calculateAttentionSpan(patterns);
        patterns.stressIndicators = this.detectStressPatterns(patterns);

        return patterns;
    }

    calculateAttentionSpan(patterns) {
        const avgReactionTime = patterns.reactionTimes.reduce((a, b) => a + b, 0) / patterns.reactionTimes.length;
        const variance = patterns.reactionTimes.reduce((acc, rt) => acc + Math.pow(rt - avgReactionTime, 2), 0) / patterns.reactionTimes.length;
        return Math.max(5, 30 - (variance / 1000)); // Convert to attention span in minutes
    }

    detectStressPatterns(patterns) {
        const indicators = [];
        const reactionTimeVariance = this.calculateVariance(patterns.reactionTimes);
        
        if (reactionTimeVariance > 100000) indicators.push('high_variability');
        if (patterns.accuracy.some(a => a < 0.5)) indicators.push('accuracy_drops');
        
        return indicators;
    }

    calculateVariance(array) {
        const mean = array.reduce((a, b) => a + b, 0) / array.length;
        return array.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / array.length;
    }

    updateBrainMap(analysis) {
        const avgAccuracy = analysis.accuracy.reduce((a, b) => a + b, 0) / analysis.accuracy.length;
        const avgReactionTime = analysis.reactionTimes.reduce((a, b) => a + b, 0) / analysis.reactionTimes.length;
        
        // Update cognitive areas based on performance
        this.brainMap.focus.strength = Math.min(1, analysis.attentionSpan / 30);
        this.brainMap.processing.strength = Math.min(1, (2000 - avgReactionTime) / 1500);
        this.brainMap.memory.strength = avgAccuracy;
        this.brainMap.emotional.strength = Math.max(0, 1 - (analysis.stressIndicators.length * 0.2));
        
        // Track improvement over time
        this.brainMap.focus.improvement = this.calculateImprovement('focus');
        this.brainMap.memory.improvement = this.calculateImprovement('memory');
        this.brainMap.processing.improvement = this.calculateImprovement('processing');
    }

    calculateImprovement(area) {
        const history = this.sessionHistory.filter(s => s.area === area);
        if (history.length < 2) return 0;
        
        const recent = history.slice(-5);
        const older = history.slice(-10, -5);
        
        const recentAvg = recent.reduce((acc, s) => acc + s.score, 0) / recent.length;
        const olderAvg = older.reduce((acc, s) => acc + s.score, 0) / older.length;
        
        return (recentAvg - olderAvg) / olderAvg;
    }

    generateCognitiveFingerprint() {
        const fingerprint = {
            id: 'CF-' + Date.now().toString(36),
            timestamp: new Date().toISOString(),
            dominantAreas: this.getDominantCognitiveAreas(),
            weakAreas: this.getWeakCognitiveAreas(),
            learningStyle: this.determineLearningStyle(),
            cognitiveType: this.determineCognitiveType(),
            uniquePatterns: this.extractUniquePatterns(),
            svg: this.generateFingerprintSVG()
        };
        
        return fingerprint;
    }

    getDominantCognitiveAreas() {
        return Object.entries(this.brainMap)
            .sort(([,a], [,b]) => b.strength - a.strength)
            .slice(0, 2)
            .map(([area, data]) => ({ area, strength: data.strength }));
    }

    getWeakCognitiveAreas() {
        return Object.entries(this.brainMap)
            .sort(([,a], [,b]) => a.strength - b.strength)
            .slice(0, 2)
            .map(([area, data]) => ({ area, strength: data.strength }));
    }

    determineLearningStyle() {
        const styles = ['visual', 'auditory', 'kinesthetic', 'analytical'];
        const weights = [
            this.brainMap.memory.strength,
            this.brainMap.focus.strength,
            this.brainMap.processing.strength,
            this.brainMap.emotional.strength
        ];
        
        const maxIndex = weights.indexOf(Math.max(...weights));
        return styles[maxIndex];
    }

    determineCognitiveType() {
        const memoryScore = this.brainMap.memory.strength;
        const focusScore = this.brainMap.focus.strength;
        const creativityScore = this.brainMap.creativity.strength;
        
        if (memoryScore > 0.8 && focusScore > 0.7) return 'analytical';
        if (creativityScore > 0.8) return 'creative';
        if (focusScore > 0.8) return 'focused';
        if (this.brainMap.processing.strength > 0.8) return 'quick-processor';
        return 'balanced';
    }

    extractUniquePatterns() {
        return {
            peakPerformanceTime: this.findPeakPerformanceTime(),
            fatiguePeriod: this.findFatiguePeriod(),
            optimalSessionLength: this.calculateOptimalSessionLength(),
            preferredChallengeType: this.getPreferredChallengeType()
        };
    }

    findPeakPerformanceTime() {
        // Simulate finding peak performance time based on session data
        const hours = [8, 10, 14, 16, 20];
        const performance = hours.map(h => Math.random() + (h === 10 ? 0.3 : 0));
        const peakIndex = performance.indexOf(Math.max(...performance));
        return hours[peakIndex] + ':00';
    }

    findFatiguePeriod() {
        return '15:00-16:00'; // Typical afternoon dip
    }

    calculateOptimalSessionLength() {
        return Math.floor(this.brainMap.focus.strength * 30 + 15); // 15-45 minutes
    }

    getPreferredChallengeType() {
        const types = ['memory', 'logic', 'speed', 'creativity'];
        const scores = [
            this.brainMap.memory.strength,
            this.brainMap.processing.strength,
            this.brainMap.focus.strength,
            this.brainMap.creativity.strength
        ];
        return types[scores.indexOf(Math.max(...scores))];
    }

    generateFingerprintSVG() {
        const areas = Object.keys(this.brainMap);
        const values = areas.map(area => this.brainMap[area].strength);
        
        let svg = '<svg width="200" height="200" viewBox="0 0 200 200">';
        
        // Create radar chart for cognitive fingerprint
        const centerX = 100, centerY = 100, radius = 80;
        const angleStep = (2 * Math.PI) / areas.length;
        
        // Background circles
        for (let i = 1; i <= 5; i++) {
            const r = (radius * i) / 5;
            svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>`;
        }
        
        // Area lines
        for (let i = 0; i < areas.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>`;
        }
        
        // Cognitive profile polygon
        let pathData = 'M ';
        for (let i = 0; i < areas.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const value = values[i];
            const x = centerX + radius * value * Math.cos(angle);
            const y = centerY + radius * value * Math.sin(angle);
            pathData += `${x} ${y} `;
            if (i === 0) pathData += 'L ';
        }
        pathData += 'Z';
        
        svg += `<path d="${pathData}" fill="rgba(167,199,231,0.3)" stroke="rgba(167,199,231,0.8)" stroke-width="2"/>`;
        
        // Area labels
        const areaLabels = ['Mem', 'Foc', 'Proc', 'Emo', 'Crea'];
        for (let i = 0; i < areas.length; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = radius + 15;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="rgba(0,0,0,0.7)">${areaLabels[i]}</text>`;
        }
        
        svg += '</svg>';
        return svg;
    }

    trainNeuralNetwork(sessionData) {
        sessionData.forEach(session => {
            // Simulate neural network training
            this.neuralNetworkState.neurons.forEach((neuron, index) => {
                neuron.activation += (Math.random() - 0.5) * this.neuralNetworkState.learningRate;
                neuron.activation = Math.max(0, Math.min(1, neuron.activation));
            });
            
            // Update connection strengths
            this.neuralNetworkState.connections.forEach(connection => {
                const learningSignal = this.calculateLearningSignal(session);
                connection.strength += learningSignal * this.neuralNetworkState.learningRate;
                connection.strength = Math.max(0, Math.min(1, connection.strength));
            });
        });
        
        // Increase plasticity with training
        this.neuralNetworkState.plasticity = Math.min(0.95, this.neuralNetworkState.plasticity + 0.01);
    }

    calculateLearningSignal(session) {
        // Simulate learning based on session performance
        const accuracy = session.accuracy || Math.random();
        const speed = 1 - ((session.reactionTime || 1000) / 2000);
        return (accuracy + speed) / 2 - 0.5;
    }

    updateTwinPersonality() {
        this.twinPersonality = {
            confidence: this.brainMap.focus.strength * 0.8 + this.brainMap.processing.strength * 0.2,
            risktaking: this.brainMap.creativity.strength * 0.7 + this.brainMap.emotional.strength * 0.3,
            patience: this.brainMap.focus.strength * 0.6 + (1 - this.brainMap.processing.strength) * 0.4,
            competitiveness: (this.brainMap.memory.strength + this.brainMap.processing.strength) / 2,
            adaptability: this.neuralNetworkState.plasticity,
            consistency: 1 - this.calculateVariance(Object.values(this.brainMap).map(area => area.strength))
        };
    }

    generateTwinInsights() {
        return {
            strengths: this.getDominantCognitiveAreas().map(area => 
                `Your cognitive twin excels at ${area.area} with ${Math.round(area.strength * 100)}% efficiency`
            ),
            weaknesses: this.getWeakCognitiveAreas().map(area => 
                `Your twin struggles with ${area.area}, currently at ${Math.round(area.strength * 100)}% capacity`
            ),
            personality: `Your cognitive twin is ${this.describeTwinPersonality()}`,
            recommendations: this.generateTwinRecommendations()
        };
    }

    describeTwinPersonality() {
        const traits = [];
        if (this.twinPersonality.confidence > 0.7) traits.push('confident');
        if (this.twinPersonality.risktaking > 0.6) traits.push('adventurous');
        if (this.twinPersonality.patience > 0.7) traits.push('patient');
        if (this.twinPersonality.competitiveness > 0.8) traits.push('highly competitive');
        if (this.twinPersonality.adaptability > 0.8) traits.push('highly adaptable');
        
        return traits.length > 0 ? traits.join(', ') : 'balanced and steady';
    }

    generateTwinRecommendations() {
        const recommendations = [];
        
        if (this.brainMap.focus.strength < 0.6) {
            recommendations.push('Practice meditation to improve focus and beat your twin');
        }
        if (this.brainMap.memory.strength < 0.7) {
            recommendations.push('Try memory palace techniques to outperform your cognitive twin');
        }
        if (this.brainMap.processing.strength < 0.6) {
            recommendations.push('Speed training exercises will help you surpass your twin\'s processing power');
        }
        
        return recommendations;
    }

    generatePredictions() {
        return {
            nextSessionPerformance: this.predictNextSession(),
            weeklyImprovement: this.predictWeeklyImprovement(),
            optimalChallenges: this.predictOptimalChallenges(),
            burnoutRisk: this.predictBurnoutRisk()
        };
    }

    predictNextSession() {
        const currentTime = new Date().getHours();
        const peakTime = parseInt(this.cognitiveFingerprint.uniquePatterns.peakPerformanceTime.split(':')[0]);
        const timeDiff = Math.abs(currentTime - peakTime);
        
        const basePerformance = (this.brainMap.focus.strength + this.brainMap.memory.strength) / 2;
        const timeAdjustment = Math.max(0.7, 1 - (timeDiff * 0.05));
        
        return Math.min(1, basePerformance * timeAdjustment);
    }

    predictWeeklyImprovement() {
        const currentTrend = Object.values(this.brainMap).reduce((acc, area) => acc + area.improvement, 0) / 5;
        return Math.max(0, currentTrend * 1.2); // Predict 20% better improvement
    }

    predictOptimalChallenges() {
        const challengeTypes = ['memory', 'focus', 'speed', 'logic'];
        return challengeTypes
            .map(type => ({
                type,
                difficulty: this.calculateOptimalDifficulty(type),
                expectedPerformance: this.predictChallengePerformance(type)
            }))
            .sort((a, b) => b.expectedPerformance - a.expectedPerformance);
    }

    calculateOptimalDifficulty(challengeType) {
        const areaMap = {
            memory: this.brainMap.memory.strength,
            focus: this.brainMap.focus.strength,
            speed: this.brainMap.processing.strength,
            logic: (this.brainMap.memory.strength + this.brainMap.processing.strength) / 2
        };
        
        const baseStrength = areaMap[challengeType] || 0.5;
        return Math.max(0.3, Math.min(0.9, baseStrength + 0.1)); // Slightly above current level
    }

    predictChallengePerformance(challengeType) {
        const strength = this.calculateOptimalDifficulty(challengeType) - 0.1;
        const consistency = this.twinPersonality.consistency;
        const confidence = this.twinPersonality.confidence;
        
        return (strength * 0.6 + consistency * 0.2 + confidence * 0.2);
    }

    predictBurnoutRisk() {
        const sessionFrequency = this.sessionHistory.length / 7; // Sessions per day average
        const improvementRate = this.predictWeeklyImprovement();
        const stressLevel = 1 - this.brainMap.emotional.strength;
        
        const riskFactors = {
            overtraining: sessionFrequency > 3 ? 0.3 : 0,
            plateau: improvementRate < 0.02 ? 0.4 : 0,
            stress: stressLevel * 0.3
        };
        
        const totalRisk = Object.values(riskFactors).reduce((a, b) => a + b, 0);
        return Math.min(1, totalRisk);
    }

    async competeTwin(challengeType, userScore, userTime) {
        // Simulate twin's performance based on personality and cognitive map
        const twinPersonality = this.twinPersonality;
        const cognitiveStrength = this.brainMap[challengeType]?.strength || 0.5;
        
        // Twin's base performance
        let twinScore = cognitiveStrength * 0.9; // Twin is slightly below peak human performance
        let twinTime = 1000 * (1.1 - cognitiveStrength); // Better cognition = faster time
        
        // Personality adjustments
        if (twinPersonality.competitiveness > 0.8 && userScore > twinScore) {
            twinScore *= 1.1; // Twin tries harder when losing
            twinTime *= 0.95;
        }
        
        if (twinPersonality.confidence > 0.7) {
            twinScore *= 1.05;
        }
        
        // Add some randomness for realism
        twinScore += (Math.random() - 0.5) * 0.2;
        twinTime += (Math.random() - 0.5) * 200;
        
        const twinWon = twinScore > userScore || (twinScore === userScore && twinTime < userTime);
        
        // Update prediction accuracy
        const predictedPerformance = this.predictChallengePerformance(challengeType);
        const actualPerformance = userScore;
        const predictionError = Math.abs(predictedPerformance - actualPerformance);
        this.predictionAccuracy = 0.9 * this.predictionAccuracy + 0.1 * (1 - predictionError);
        
        // Learn from the competition
        this.sessionHistory.push({
            area: challengeType,
            score: userScore,
            time: userTime,
            twinScore: twinScore,
            twinWon: twinWon,
            timestamp: new Date().toISOString()
        });
        
        return {
            twinScore: Math.round(twinScore * 100) / 100,
            twinTime: Math.round(twinTime),
            twinWon: twinWon,
            twinComment: this.generateTwinComment(twinWon, challengeType),
            userImprovement: this.calculateUserImprovement(challengeType),
            nextChallenge: this.suggestNextChallenge(twinWon, challengeType)
        };
    }

    generateTwinComment(twinWon, challengeType) {
        const comments = {
            won: [
                "I've been training while you were away! 🤖",
                "My neural networks are optimized today! ⚡",
                "Better luck next time, human! 😏",
                `My ${challengeType} algorithms are superior! 🧠`
            ],
            lost: [
                "You're getting better than my predictions! 🎯",
                "Impressive human performance! 👏",
                "I need to update my training data! 📊",
                `Your ${challengeType} skills exceeded my calculations! 🚀`
            ]
        };
        
        const commentList = twinWon ? comments.won : comments.lost;
        return commentList[Math.floor(Math.random() * commentList.length)];
    }

    calculateUserImprovement(challengeType) {
        const recentSessions = this.sessionHistory
            .filter(s => s.area === challengeType)
            .slice(-5);
        
        if (recentSessions.length < 2) return 0;
        
        const latest = recentSessions[recentSessions.length - 1].score;
        const previous = recentSessions[recentSessions.length - 2].score;
        
        return ((latest - previous) / previous) * 100;
    }

    suggestNextChallenge(twinWon, challengeType) {
        if (twinWon) {
            // User lost, suggest easier or different challenge
            const weakAreas = this.getWeakCognitiveAreas();
            return {
                type: weakAreas[0].area,
                difficulty: 'medium',
                reason: `Let's work on your ${weakAreas[0].area} to prepare for the rematch!`
            };
        } else {
            // User won, suggest harder challenge
            return {
                type: challengeType,
                difficulty: 'hard',
                reason: `You beat me! Try a harder ${challengeType} challenge to stay ahead!`
            };
        }
    }

    exportCognitiveProfile() {
        return {
            brainMap: this.brainMap,
            cognitiveFingerprint: this.cognitiveFingerprint,
            twinPersonality: this.twinPersonality,
            neuralNetworkState: {
                plasticity: this.neuralNetworkState.plasticity,
                learningRate: this.neuralNetworkState.learningRate,
                neuronCount: this.neuralNetworkState.neurons.length,
                connectionCount: this.neuralNetworkState.connections.length
            },
            sessionHistory: this.sessionHistory.slice(-20), // Last 20 sessions
            predictionAccuracy: this.predictionAccuracy,
            exportedAt: new Date().toISOString()
        };
    }
}

// Export for global access
window.CognitiveTwin = CognitiveTwin;
