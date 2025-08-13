// Neuro-Responsive UI & Cognitive Weather System
class NeuroResponsiveUI {
    constructor() {
        this.currentMentalState = 'balanced';
        this.cognitiveWeather = {
            condition: 'sunny',
            temperature: 75,
            pressure: 'normal',
            humidity: 'low',
            forecast: []
        };
        this.uiAdaptations = {
            colorScheme: 'default',
            animationSpeed: 'normal',
            complexity: 'standard',
            fontSize: 'medium'
        };
        this.stressLevel = 0.3;
        this.focusLevel = 0.7;
        this.energyLevel = 0.8;
        this.mentalFatigue = 0.2;
        this.adaptationHistory = [];
        this.init();
    }

    init() {
        this.setupBiometricMonitoring();
        this.createWeatherWidget();
        this.startAdaptiveLoop();
        this.setupUIControls();
    }

    setupBiometricMonitoring() {
        // Simulate real-time biometric monitoring
        setInterval(() => {
            this.updateBiometrics();
            this.updateCognitiveWeather();
            this.adaptInterface();
        }, 5000); // Update every 5 seconds
        
        // Monitor user interactions for stress/focus detection
        this.monitorUserInteractions();
    }

    monitorUserInteractions() {
        let clickTimes = [];
        let mouseMoveCount = 0;
        let keyPressCount = 0;
        
        document.addEventListener('click', (e) => {
            clickTimes.push(Date.now());
            if (clickTimes.length > 10) clickTimes.shift();
            
            // Rapid clicking indicates stress
            if (clickTimes.length >= 3) {
                const timeSpan = clickTimes[clickTimes.length - 1] - clickTimes[clickTimes.length - 3];
                if (timeSpan < 1000) {
                    this.stressLevel = Math.min(1, this.stressLevel + 0.1);
                }
            }
        });
        
        document.addEventListener('mousemove', () => {
            mouseMoveCount++;
        });
        
        document.addEventListener('keypress', () => {
            keyPressCount++;
        });
        
        // Analyze interaction patterns every 10 seconds
        setInterval(() => {
            this.analyzeInteractionPatterns(mouseMoveCount, keyPressCount);
            mouseMoveCount = 0;
            keyPressCount = 0;
        }, 10000);
    }

    analyzeInteractionPatterns(mouseCount, keyCount) {
        // High mouse movement = high stress or distraction
        if (mouseCount > 100) {
            this.stressLevel = Math.min(1, this.stressLevel + 0.05);
            this.focusLevel = Math.max(0, this.focusLevel - 0.1);
        }
        
        // Steady keyboard input = good focus
        if (keyCount > 20 && keyCount < 60) {
            this.focusLevel = Math.min(1, this.focusLevel + 0.05);
        }
        
        // Very low activity = fatigue
        if (mouseCount < 10 && keyCount < 5) {
            this.mentalFatigue = Math.min(1, this.mentalFatigue + 0.1);
            this.energyLevel = Math.max(0, this.energyLevel - 0.05);
        }
    }

    updateBiometrics() {
        // Simulate biometric changes based on time of day and activity
        const hour = new Date().getHours();
        const isAfternoon = hour >= 14 && hour <= 16;
        const isEvening = hour >= 18;
        
        // Circadian rhythm effects
        if (isAfternoon) {
            this.energyLevel = Math.max(0.4, this.energyLevel - 0.02);
            this.mentalFatigue = Math.min(0.8, this.mentalFatigue + 0.03);
        }
        
        if (isEvening) {
            this.stressLevel = Math.max(0.1, this.stressLevel - 0.02);
            this.focusLevel = Math.min(0.9, this.focusLevel + 0.01);
        }
        
        // Natural fluctuations
        this.stressLevel += (Math.random() - 0.5) * 0.05;
        this.focusLevel += (Math.random() - 0.5) * 0.03;
        this.energyLevel += (Math.random() - 0.5) * 0.02;
        this.mentalFatigue += (Math.random() - 0.5) * 0.02;
        
        // Clamp values
        this.stressLevel = Math.max(0, Math.min(1, this.stressLevel));
        this.focusLevel = Math.max(0, Math.min(1, this.focusLevel));
        this.energyLevel = Math.max(0, Math.min(1, this.energyLevel));
        this.mentalFatigue = Math.max(0, Math.min(1, this.mentalFatigue));
        
        // Determine overall mental state
        this.currentMentalState = this.calculateMentalState();
    }

    calculateMentalState() {
        const states = [
            { name: 'focused', score: this.focusLevel * (1 - this.stressLevel) },
            { name: 'stressed', score: this.stressLevel * (1 - this.focusLevel) },
            { name: 'energized', score: this.energyLevel * (1 - this.mentalFatigue) },
            { name: 'tired', score: this.mentalFatigue * (1 - this.energyLevel) },
            { name: 'balanced', score: 1 - Math.abs(0.5 - (this.focusLevel + this.energyLevel) / 2) }
        ];
        
        return states.reduce((best, current) => 
            current.score > best.score ? current : best
        ).name;
    }

    updateCognitiveWeather() {
        // Map mental state to weather conditions
        const weatherMap = {
            focused: { condition: 'sunny', temp: 75, pressure: 'high', humidity: 'low' },
            stressed: { condition: 'stormy', temp: 85, pressure: 'low', humidity: 'high' },
            energized: { condition: 'clear', temp: 80, pressure: 'high', humidity: 'low' },
            tired: { condition: 'cloudy', temp: 65, pressure: 'low', humidity: 'medium' },
            balanced: { condition: 'partly-cloudy', temp: 72, pressure: 'normal', humidity: 'medium' }
        };
        
        const weather = weatherMap[this.currentMentalState];
        this.cognitiveWeather = {
            condition: weather.condition,
            temperature: weather.temp + Math.round((Math.random() - 0.5) * 10),
            pressure: weather.pressure,
            humidity: weather.humidity,
            mentalState: this.currentMentalState,
            forecast: this.generateForecast()
        };
    }

    generateForecast() {
        const forecast = [];
        const hours = ['Next Hour', '2 Hours', '4 Hours', 'Tomorrow'];
        
        hours.forEach((hour, index) => {
            const futureState = this.predictFutureMentalState(index + 1);
            forecast.push({
                time: hour,
                condition: this.getWeatherCondition(futureState),
                probability: Math.round(70 + Math.random() * 25),
                recommendation: this.getRecommendation(futureState)
            });
        });
        
        return forecast;
    }

    predictFutureMentalState(hoursAhead) {
        const currentHour = new Date().getHours();
        const futureHour = (currentHour + hoursAhead) % 24;
        
        // Predict based on circadian rhythms and current state
        let predictedFocus = this.focusLevel;
        let predictedEnergy = this.energyLevel;
        let predictedStress = this.stressLevel;
        
        // Morning boost
        if (futureHour >= 9 && futureHour <= 11) {
            predictedFocus += 0.2;
            predictedEnergy += 0.1;
        }
        
        // Afternoon dip
        if (futureHour >= 14 && futureHour <= 16) {
            predictedFocus -= 0.2;
            predictedEnergy -= 0.3;
        }
        
        // Evening stress reduction
        if (futureHour >= 18) {
            predictedStress -= 0.2;
        }
        
        // Determine state from predicted values
        if (predictedFocus > 0.7 && predictedStress < 0.4) return 'focused';
        if (predictedStress > 0.6) return 'stressed';
        if (predictedEnergy > 0.7) return 'energized';
        if (predictedEnergy < 0.4) return 'tired';
        return 'balanced';
    }

    getWeatherCondition(state) {
        const conditions = {
            focused: 'sunny',
            stressed: 'stormy',
            energized: 'clear',
            tired: 'cloudy',
            balanced: 'partly-cloudy'
        };
        return conditions[state] || 'partly-cloudy';
    }

    getRecommendation(state) {
        const recommendations = {
            focused: 'Perfect time for challenging tasks',
            stressed: 'Take a break and try breathing exercises',
            energized: 'Great time for creative work',
            tired: 'Consider a short power nap',
            balanced: 'Good time for routine activities'
        };
        return recommendations[state] || 'Continue your current activity';
    }

    adaptInterface() {
        const adaptation = this.calculateUIAdaptation();
        this.applyUIChanges(adaptation);
        this.logAdaptation(adaptation);
    }

    calculateUIAdaptation() {
        const adaptation = {
            colorScheme: this.getOptimalColorScheme(),
            animationSpeed: this.getOptimalAnimationSpeed(),
            complexity: this.getOptimalComplexity(),
            fontSize: this.getOptimalFontSize(),
            notifications: this.getNotificationSettings(),
            breathing: this.shouldShowBreathingPrompt()
        };
        
        return adaptation;
    }

    getOptimalColorScheme() {
        if (this.stressLevel > 0.7) return 'calming-blue';
        if (this.mentalFatigue > 0.6) return 'warm-amber';
        if (this.focusLevel > 0.8) return 'sharp-contrast';
        if (this.energyLevel < 0.4) return 'low-contrast';
        return 'default';
    }

    getOptimalAnimationSpeed() {
        if (this.stressLevel > 0.6) return 'slow';
        if (this.mentalFatigue > 0.7) return 'minimal';
        if (this.focusLevel > 0.8) return 'fast';
        return 'normal';
    }

    getOptimalComplexity() {
        if (this.stressLevel > 0.6 || this.mentalFatigue > 0.6) return 'simple';
        if (this.focusLevel > 0.7 && this.energyLevel > 0.6) return 'detailed';
        return 'standard';
    }

    getOptimalFontSize() {
        if (this.mentalFatigue > 0.7) return 'large';
        if (this.stressLevel > 0.6) return 'medium-large';
        return 'medium';
    }

    getNotificationSettings() {
        return {
            enabled: this.stressLevel < 0.7,
            frequency: this.stressLevel > 0.5 ? 'low' : 'normal',
            type: this.mentalFatigue > 0.6 ? 'gentle' : 'standard'
        };
    }

    shouldShowBreathingPrompt() {
        return this.stressLevel > 0.6 || (this.focusLevel < 0.4 && this.mentalFatigue < 0.7);
    }

    applyUIChanges(adaptation) {
        // Apply color scheme
        this.applyColorScheme(adaptation.colorScheme);
        
        // Apply animation changes
        this.applyAnimationChanges(adaptation.animationSpeed);
        
        // Apply complexity changes
        this.applyComplexityChanges(adaptation.complexity);
        
        // Apply font size changes
        this.applyFontSizeChanges(adaptation.fontSize);
        
        // Show breathing prompt if needed
        if (adaptation.breathing) {
            this.showBreathingPrompt();
        }
        
        this.uiAdaptations = adaptation;
    }

    applyColorScheme(scheme) {
        const root = document.documentElement;
        
        const schemes = {
            'calming-blue': {
                '--home-color': '#87CEEB',
                '--dashboard-color': '#B0E0E6',
                '--challenges-color': '#ADD8E6',
                '--sleep-color': '#E0F6FF',
                '--focus-color': '#F0F8FF'
            },
            'warm-amber': {
                '--home-color': '#FFE4B5',
                '--dashboard-color': '#FFEFD5',
                '--challenges-color': '#FFEBCD',
                '--sleep-color': '#FFF8DC',
                '--focus-color': '#FFFACD'
            },
            'sharp-contrast': {
                '--home-color': '#4169E1',
                '--dashboard-color': '#1E90FF',
                '--challenges-color': '#FF6347',
                '--sleep-color': '#8A2BE2',
                '--focus-color': '#32CD32'
            },
            'low-contrast': {
                '--home-color': '#D3D3D3',
                '--dashboard-color': '#DCDCDC',
                '--challenges-color': '#E6E6FA',
                '--sleep-color': '#F5F5F5',
                '--focus-color': '#F0F0F0'
            }
        };
        
        if (schemes[scheme]) {
            Object.entries(schemes[scheme]).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        }
    }

    applyAnimationChanges(speed) {
        const speedMap = {
            'minimal': '0.1s',
            'slow': '0.8s',
            'normal': '0.3s',
            'fast': '0.15s'
        };
        
        const duration = speedMap[speed] || '0.3s';
        document.documentElement.style.setProperty('--animation-duration', duration);
        
        // Update existing animations
        const animations = document.querySelectorAll('[style*="animation"]');
        animations.forEach(el => {
            if (speed === 'minimal') {
                el.style.animationPlayState = 'paused';
            } else {
                el.style.animationPlayState = 'running';
                el.style.animationDuration = duration;
            }
        });
    }

    applyComplexityChanges(complexity) {
        const complexElements = document.querySelectorAll('.enhanced-focus-card, .meditation-card, .video-card');
        
        if (complexity === 'simple') {
            complexElements.forEach(el => {
                el.style.filter = 'none';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });
            
            // Hide non-essential elements
            document.querySelectorAll('.chart-placeholder, .video-controls').forEach(el => {
                el.style.opacity = '0.5';
            });
        } else {
            complexElements.forEach(el => {
                el.style.filter = '';
                el.style.boxShadow = '';
            });
            
            document.querySelectorAll('.chart-placeholder, .video-controls').forEach(el => {
                el.style.opacity = '1';
            });
        }
    }

    applyFontSizeChanges(fontSize) {
        const sizeMap = {
            'large': '1.2em',
            'medium-large': '1.1em',
            'medium': '1em'
        };
        
        const scale = sizeMap[fontSize] || '1em';
        document.documentElement.style.setProperty('--font-scale', scale);
        
        // Apply to text elements
        document.querySelectorAll('body, .card, .btn').forEach(el => {
            el.style.fontSize = `calc(${el.style.fontSize || '1rem'} * ${scale.replace('em', '')})`;
        });
    }

    showBreathingPrompt() {
        // Don't show if already visible
        if (document.getElementById('breathingPrompt')) return;
        
        const prompt = document.createElement('div');
        prompt.id = 'breathingPrompt';
        prompt.className = 'breathing-prompt';
        prompt.innerHTML = `
            <div class="breathing-content">
                <div class="breathing-circle">
                    <div class="breathing-text">Breathe</div>
                </div>
                <p>Your stress levels are elevated. Take a moment to breathe deeply.</p>
                <div class="breathing-controls">
                    <button onclick="startBreathingExercise()" class="btn btn-focus">
                        <i class="fas fa-wind"></i> Start Exercise
                    </button>
                    <button onclick="dismissBreathingPrompt()" class="btn">
                        <i class="fas fa-times"></i> Dismiss
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (document.getElementById('breathingPrompt')) {
                this.dismissBreathingPrompt();
            }
        }, 30000);
    }

    dismissBreathingPrompt() {
        const prompt = document.getElementById('breathingPrompt');
        if (prompt) {
            prompt.remove();
        }
    }

    createWeatherWidget() {
        const widget = document.createElement('div');
        widget.id = 'cognitiveWeatherWidget';
        widget.className = 'cognitive-weather-widget';
        widget.innerHTML = `
            <div class="weather-header">
                <h4>🧠 Mental Weather</h4>
                <button onclick="toggleWeatherDetails()" class="weather-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="weather-current">
                <div class="weather-icon" id="weatherIcon">☀️</div>
                <div class="weather-info">
                    <div class="weather-condition" id="weatherCondition">Sunny</div>
                    <div class="weather-temp" id="weatherTemp">75°</div>
                </div>
                <div class="weather-metrics">
                    <div class="metric">
                        <span>Focus</span>
                        <div class="metric-bar">
                            <div class="metric-fill focus-bar" id="focusBar"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <span>Energy</span>
                        <div class="metric-bar">
                            <div class="metric-fill energy-bar" id="energyBar"></div>
                        </div>
                    </div>
                    <div class="metric">
                        <span>Stress</span>
                        <div class="metric-bar">
                            <div class="metric-fill stress-bar" id="stressBar"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="weather-details" id="weatherDetails" style="display: none;">
                <div class="weather-forecast" id="weatherForecast"></div>
                <div class="weather-recommendations" id="weatherRecommendations"></div>
            </div>
        `;
        
        // Position the widget
        widget.style.cssText = `
            position: fixed;
            top: 160px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 150;
            min-width: 250px;
            max-width: 300px;
        `;
        
        document.body.appendChild(widget);
        this.updateWeatherWidget();
    }

    updateWeatherWidget() {
        const widget = document.getElementById('cognitiveWeatherWidget');
        if (!widget) return;
        
        // Update weather icon and condition
        const icons = {
            'sunny': '☀️',
            'clear': '🌤️',
            'partly-cloudy': '⛅',
            'cloudy': '☁️',
            'stormy': '⛈️'
        };
        
        document.getElementById('weatherIcon').textContent = icons[this.cognitiveWeather.condition] || '☀️';
        document.getElementById('weatherCondition').textContent = this.currentMentalState.charAt(0).toUpperCase() + this.currentMentalState.slice(1);
        document.getElementById('weatherTemp').textContent = `${this.cognitiveWeather.temperature}°`;
        
        // Update metric bars
        document.getElementById('focusBar').style.width = `${this.focusLevel * 100}%`;
        document.getElementById('energyBar').style.width = `${this.energyLevel * 100}%`;
        document.getElementById('stressBar').style.width = `${this.stressLevel * 100}%`;
        
        // Update forecast
        this.updateWeatherForecast();
    }

    updateWeatherForecast() {
        const forecastContainer = document.getElementById('weatherForecast');
        if (!forecastContainer) return;
        
        forecastContainer.innerHTML = '<h5>Forecast</h5>';
        
        this.cognitiveWeather.forecast.forEach(forecast => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-time">${forecast.time}</div>
                <div class="forecast-condition">${forecast.condition}</div>
                <div class="forecast-recommendation">${forecast.recommendation}</div>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    }

    logAdaptation(adaptation) {
        this.adaptationHistory.push({
            timestamp: new Date().toISOString(),
            mentalState: this.currentMentalState,
            biometrics: {
                stress: this.stressLevel,
                focus: this.focusLevel,
                energy: this.energyLevel,
                fatigue: this.mentalFatigue
            },
            adaptation: adaptation
        });
        
        // Keep only last 50 adaptations
        if (this.adaptationHistory.length > 50) {
            this.adaptationHistory.shift();
        }
    }

    setupUIControls() {
        // Add manual override controls
        const controls = document.createElement('div');
        controls.id = 'neuroUIControls';
        controls.innerHTML = `
            <div class="neuro-controls">
                <button onclick="neuroUI.toggleAutoAdaptation()" class="control-btn" id="autoAdaptBtn">
                    <i class="fas fa-magic"></i> Auto-Adapt: ON
                </button>
                <button onclick="neuroUI.showDetailedMetrics()" class="control-btn">
                    <i class="fas fa-chart-line"></i> Metrics
                </button>
                <button onclick="neuroUI.resetToDefault()" class="control-btn">
                    <i class="fas fa-undo"></i> Reset UI
                </button>
            </div>
        `;
        
        controls.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 20px;
            z-index: 140;
        `;
        
        document.body.appendChild(controls);
    }

    startAdaptiveLoop() {
        // Main adaptation loop
        setInterval(() => {
            this.updateWeatherWidget();
        }, 2000);
    }

    toggleAutoAdaptation() {
        // Implementation for toggling auto-adaptation
        console.log('Auto-adaptation toggled');
    }

    showDetailedMetrics() {
        // Implementation for showing detailed metrics
        console.log('Showing detailed biometric metrics');
    }

    resetToDefault() {
        // Reset UI to default state
        this.applyColorScheme('default');
        this.applyAnimationChanges('normal');
        this.applyComplexityChanges('standard');
        this.applyFontSizeChanges('medium');
        console.log('UI reset to default');
    }

    getAdaptationSummary() {
        return {
            currentState: this.currentMentalState,
            cognitiveWeather: this.cognitiveWeather,
            uiAdaptations: this.uiAdaptations,
            biometrics: {
                stress: this.stressLevel,
                focus: this.focusLevel,
                energy: this.energyLevel,
                fatigue: this.mentalFatigue
            },
            adaptationCount: this.adaptationHistory.length
        };
    }
}

// Global functions for UI interactions
window.toggleWeatherDetails = function() {
    const details = document.getElementById('weatherDetails');
    const toggle = document.querySelector('.weather-toggle i');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggle.className = 'fas fa-chevron-up';
    } else {
        details.style.display = 'none';
        toggle.className = 'fas fa-chevron-down';
    }
};

window.startBreathingExercise = function() {
    // Implementation for breathing exercise
    console.log('Starting breathing exercise');
    window.neuroUI.dismissBreathingPrompt();
};

window.dismissBreathingPrompt = function() {
    window.neuroUI.dismissBreathingPrompt();
};

// Initialize and export
window.neuroUI = new NeuroResponsiveUI();
window.NeuroResponsiveUI = NeuroResponsiveUI;
