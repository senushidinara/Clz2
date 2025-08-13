// Dynamic NFT Memory Capsules & Thought Garden System
class ThoughtGarden {
    constructor() {
        this.garden = {
            plots: this.initializePlots(),
            climate: 'temperate',
            season: 'spring',
            nutrients: { focus: 100, memory: 100, creativity: 100, emotional: 100 }
        };
        this.memoryCapsules = new Map();
        this.growthHistory = [];
        this.gardenStats = {
            totalPlants: 0,
            bloomingPlants: 0,
            matureThoughts: 0,
            uniqueMemories: 0
        };
        this.init();
    }

    init() {
        this.createGardenVisualization();
        this.startGrowthCycle();
        this.setupInteractiveElements();
    }

    initializePlots() {
        const plots = [];
        const plotTypes = ['memory', 'focus', 'creativity', 'meditation', 'learning'];
        
        for (let i = 0; i < 12; i++) {
            plots.push({
                id: i,
                type: plotTypes[i % plotTypes.length],
                plant: null,
                soilQuality: 0.7 + Math.random() * 0.3,
                sunlight: 0.8,
                water: 0.6,
                position: {
                    x: (i % 4) * 25 + 12.5,
                    y: Math.floor(i / 4) * 30 + 15
                }
            });
        }
        
        return plots;
    }

    createMemoryCapsule(sessionData) {
        const capsule = {
            id: 'MC-' + Date.now().toString(36),
            type: sessionData.type || 'general',
            performance: sessionData.performance || Math.random(),
            timestamp: new Date().toISOString(),
            content: {
                title: this.generateMemoryTitle(sessionData),
                description: this.generateMemoryDescription(sessionData),
                emotions: this.extractEmotions(sessionData),
                insights: this.generateInsights(sessionData)
            },
            nftMetadata: this.generateNFTMetadata(sessionData),
            growthStage: 'seed',
            plantData: this.createPlantFromMemory(sessionData),
            evolutionTriggers: this.defineEvolutionTriggers(sessionData)
        };
        
        this.memoryCapsules.set(capsule.id, capsule);
        this.plantMemoryInGarden(capsule);
        
        return capsule;
    }

    generateMemoryTitle(sessionData) {
        const titles = {
            memory: ['Memory Palace Built', 'Recall Mastery', 'Mind Map Created'],
            focus: ['Deep Focus Achieved', 'Concentration Breakthrough', 'Mindful Moment'],
            meditation: ['Inner Peace Found', 'Mindfulness Unlocked', 'Zen State Reached'],
            learning: ['Knowledge Absorbed', 'Understanding Deepened', 'Wisdom Gained'],
            creativity: ['Creative Spark', 'Innovation Moment', 'Artistic Vision']
        };
        
        const typeTitle = titles[sessionData.type] || titles.memory;
        return typeTitle[Math.floor(Math.random() * typeTitle.length)];
    }

    generateMemoryDescription(sessionData) {
        const performance = sessionData.performance || Math.random();
        const timeSpent = sessionData.duration || Math.floor(Math.random() * 30 + 5);
        
        const descriptions = [
            `A ${performance > 0.8 ? 'remarkable' : performance > 0.6 ? 'solid' : 'challenging'} session lasting ${timeSpent} minutes.`,
            `Your mind expanded during this ${timeSpent}-minute journey of discovery.`,
            `A moment of cognitive growth that lasted ${timeSpent} minutes and left lasting impressions.`
        ];
        
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    extractEmotions(sessionData) {
        const emotions = ['joy', 'calm', 'focused', 'accomplished', 'curious', 'peaceful'];
        const sessionEmotions = [];
        
        // Extract 1-3 emotions based on session type and performance
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
            const emotion = emotions[Math.floor(Math.random() * emotions.length)];
            if (!sessionEmotions.includes(emotion)) {
                sessionEmotions.push(emotion);
            }
        }
        
        return sessionEmotions;
    }

    generateInsights(sessionData) {
        const insights = [
            'This experience strengthened neural pathways related to attention.',
            'Memory consolidation was enhanced during this session.',
            'Creative thinking patterns showed increased activity.',
            'Stress levels decreased significantly during practice.',
            'New cognitive strategies were internalized.'
        ];
        
        return [insights[Math.floor(Math.random() * insights.length)]];
    }

    generateNFTMetadata(sessionData) {
        const capsuleId = 'MC-' + Date.now().toString(36);
        
        return {
            name: `Memory Capsule #${capsuleId}`,
            description: `A dynamic NFT representing cognitive growth and memory formation`,
            image: this.generateCapsuleImage(sessionData),
            attributes: [
                { trait_type: 'Session Type', value: sessionData.type || 'General' },
                { trait_type: 'Performance Level', value: this.getPerformanceLevel(sessionData.performance) },
                { trait_type: 'Growth Stage', value: 'Seed' },
                { trait_type: 'Rarity', value: this.calculateRarity(sessionData) },
                { trait_type: 'Cognitive Domain', value: sessionData.type || 'Mixed' },
                { trait_type: 'Session Date', value: new Date().toDateString() }
            ],
            properties: {
                dynamic: true,
                evolves: true,
                interactive: true,
                category: 'Cognitive Memory'
            }
        };
    }

    generateCapsuleImage(sessionData) {
        // Generate SVG for memory capsule
        const colors = this.getTypeColors(sessionData.type);
        const performance = sessionData.performance || Math.random();
        const intensity = Math.floor(performance * 100);
        
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="capsuleGrad" cx="50%" cy="30%">
                        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.8" />
                        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.4" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Background -->
                <rect width="300" height="300" fill="linear-gradient(135deg, #f0f4f8, #d1ecf1)"/>
                
                <!-- Capsule Core -->
                <circle cx="150" cy="150" r="80" fill="url(#capsuleGrad)" filter="url(#glow)"/>
                
                <!-- Memory Particles -->
                ${this.generateMemoryParticles(performance, colors)}
                
                <!-- Performance Indicator -->
                <circle cx="150" cy="150" r="60" fill="none" stroke="${colors.accent}" stroke-width="4" 
                        stroke-dasharray="${intensity * 3.77} 377" transform="rotate(-90 150 150)"/>
                
                <!-- Center Symbol -->
                <text x="150" y="160" text-anchor="middle" font-size="40" fill="white">🧠</text>
                
                <!-- Type Indicator -->
                <text x="150" y="250" text-anchor="middle" font-size="16" fill="${colors.primary}">
                    ${(sessionData.type || 'memory').toUpperCase()}
                </text>
            </svg>
        `)}`;
    }

    generateMemoryParticles(performance, colors) {
        let particles = '';
        const count = Math.floor(performance * 20) + 5;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * 2 * Math.PI;
            const radius = 30 + Math.random() * 40;
            const x = 150 + radius * Math.cos(angle);
            const y = 150 + radius * Math.sin(angle);
            const size = 2 + Math.random() * 4;
            
            particles += `<circle cx="${x}" cy="${y}" r="${size}" fill="${colors.accent}" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="${2 + Math.random() * 2}s" repeatCount="indefinite"/>
            </circle>`;
        }
        
        return particles;
    }

    getTypeColors(type) {
        const colorMap = {
            memory: { primary: '#4169E1', secondary: '#87CEEB', accent: '#FFD700' },
            focus: { primary: '#32CD32', secondary: '#98FB98', accent: '#FF6347' },
            meditation: { primary: '#9370DB', secondary: '#DDA0DD', accent: '#F0E68C' },
            creativity: { primary: '#FF69B4', secondary: '#FFB6C1', accent: '#00CED1' },
            learning: { primary: '#FF8C00', secondary: '#FFA500', accent: '#32CD32' }
        };
        
        return colorMap[type] || colorMap.memory;
    }

    getPerformanceLevel(performance) {
        if (performance > 0.9) return 'Master';
        if (performance > 0.8) return 'Expert';
        if (performance > 0.7) return 'Advanced';
        if (performance > 0.6) return 'Intermediate';
        if (performance > 0.4) return 'Beginner';
        return 'Novice';
    }

    calculateRarity(sessionData) {
        const performance = sessionData.performance || Math.random();
        const duration = sessionData.duration || 15;
        
        if (performance > 0.95 && duration > 30) return 'Legendary';
        if (performance > 0.9) return 'Epic';
        if (performance > 0.8) return 'Rare';
        if (performance > 0.6) return 'Uncommon';
        return 'Common';
    }

    createPlantFromMemory(capsule) {
        const plantTypes = {
            memory: { name: 'Memory Tree', symbol: '🌳', growthRate: 0.1 },
            focus: { name: 'Focus Flower', symbol: '🌻', growthRate: 0.15 },
            meditation: { name: 'Peace Lotus', symbol: '🪷', growthRate: 0.08 },
            creativity: { name: 'Idea Vine', symbol: '🌿', growthRate: 0.12 },
            learning: { name: 'Wisdom Oak', symbol: '🌲', growthRate: 0.07 }
        };
        
        const plantType = plantTypes[capsule.type] || plantTypes.memory;
        
        return {
            type: plantType.name,
            symbol: plantType.symbol,
            growthRate: plantType.growthRate,
            size: 0.1, // Start as seed
            health: 0.8,
            age: 0,
            bloomLevel: 0,
            traits: this.generatePlantTraits(capsule),
            nutrients: { focus: 50, memory: 50, creativity: 50, emotional: 50 },
            lastWatered: new Date().toISOString(),
            evolutionStage: 0
        };
    }

    generatePlantTraits(capsule) {
        const traits = [];
        const performance = capsule.nftMetadata.attributes.find(attr => attr.trait_type === 'Performance Level')?.value;
        
        if (performance === 'Master' || performance === 'Expert') {
            traits.push('Fast Growing');
        }
        
        if (capsule.content.emotions.includes('calm')) {
            traits.push('Peaceful Aura');
        }
        
        if (capsule.content.emotions.includes('joy')) {
            traits.push('Vibrant Colors');
        }
        
        traits.push('Memory Enhanced');
        
        return traits;
    }

    defineEvolutionTriggers(capsule) {
        return {
            stage1: { sessions: 5, type: 'any', description: 'Sprout emerges' },
            stage2: { sessions: 15, type: capsule.type, description: 'First leaves appear' },
            stage3: { sessions: 30, performance: 0.7, description: 'Strong growth' },
            stage4: { sessions: 50, streak: 7, description: 'First bloom' },
            stage5: { sessions: 100, achievement: 'master', description: 'Full maturity' }
        };
    }

    plantMemoryInGarden(capsule) {
        // Find suitable plot
        const availablePlots = this.garden.plots.filter(plot => 
            plot.plant === null && plot.type === capsule.type
        );
        
        let selectedPlot;
        if (availablePlots.length > 0) {
            selectedPlot = availablePlots[0];
        } else {
            // Use any available plot
            const anyAvailable = this.garden.plots.find(plot => plot.plant === null);
            selectedPlot = anyAvailable;
        }
        
        if (selectedPlot) {
            selectedPlot.plant = {
                capsuleId: capsule.id,
                plantedAt: new Date().toISOString(),
                plant: capsule.plantData
            };
            
            this.gardenStats.totalPlants++;
            this.updateGardenVisualization();
        }
    }

    createGardenVisualization() {
        const gardenContainer = document.createElement('div');
        gardenContainer.id = 'thoughtGarden';
        gardenContainer.className = 'thought-garden-container';
        gardenContainer.innerHTML = `
            <div class="garden-header">
                <h3>🌱 Your Thought Garden</h3>
                <div class="garden-stats">
                    <span class="stat">🌱 <span id="totalPlants">0</span></span>
                    <span class="stat">🌸 <span id="bloomingPlants">0</span></span>
                    <span class="stat">🧠 <span id="matureThoughts">0</span></span>
                </div>
            </div>
            <div class="garden-view" id="gardenView">
                <svg width="100%" height="400" viewBox="0 0 400 300" id="gardenSVG">
                    <!-- Garden background -->
                    <defs>
                        <pattern id="grass" patternUnits="userSpaceOnUse" width="20" height="20">
                            <rect width="20" height="20" fill="#90EE90"/>
                            <circle cx="5" cy="5" r="1" fill="#228B22"/>
                            <circle cx="15" cy="15" r="1" fill="#228B22"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grass)"/>
                    
                    <!-- Garden plots will be added here -->
                </svg>
            </div>
            <div class="garden-controls">
                <button onclick="thoughtGarden.waterGarden()" class="btn btn-focus">
                    <i class="fas fa-tint"></i> Water Garden
                </button>
                <button onclick="thoughtGarden.addNutrients()" class="btn btn-dashboard">
                    <i class="fas fa-seedling"></i> Add Nutrients
                </button>
                <button onclick="thoughtGarden.viewMemoryCapsules()" class="btn btn-primary">
                    <i class="fas fa-eye"></i> View Capsules
                </button>
                <button onclick="thoughtGarden.exportGarden()" class="btn btn-challenges">
                    <i class="fas fa-download"></i> Export NFTs
                </button>
            </div>
        `;
        
        // Add styling
        gardenContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 400px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 130;
            max-height: 500px;
            overflow-y: auto;
        `;
        
        document.body.appendChild(gardenContainer);
        this.renderGardenPlots();
    }

    renderGardenPlots() {
        const svg = document.getElementById('gardenSVG');
        if (!svg) return;
        
        // Clear existing plots
        const existingPlots = svg.querySelectorAll('.garden-plot');
        existingPlots.forEach(plot => plot.remove());
        
        // Render each plot
        this.garden.plots.forEach(plot => {
            const plotElement = this.createPlotElement(plot);
            svg.appendChild(plotElement);
        });
    }

    createPlotElement(plot) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'garden-plot');
        g.setAttribute('transform', `translate(${plot.position.x}, ${plot.position.y})`);
        
        // Plot background
        const plotBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        plotBg.setAttribute('width', '20');
        plotBg.setAttribute('height', '25');
        plotBg.setAttribute('fill', plot.plant ? '#8B4513' : '#D2B48C');
        plotBg.setAttribute('stroke', '#654321');
        plotBg.setAttribute('stroke-width', '0.5');
        plotBg.setAttribute('rx', '2');
        g.appendChild(plotBg);
        
        // Plant if exists
        if (plot.plant) {
            const plant = this.createPlantElement(plot.plant.plant);
            g.appendChild(plant);
        }
        
        // Plot type indicator
        const typeIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeIndicator.setAttribute('x', '10');
        typeIndicator.setAttribute('y', '30');
        typeIndicator.setAttribute('text-anchor', 'middle');
        typeIndicator.setAttribute('font-size', '8');
        typeIndicator.setAttribute('fill', '#333');
        typeIndicator.textContent = plot.type.charAt(0).toUpperCase();
        g.appendChild(typeIndicator);
        
        return g;
    }

    createPlantElement(plantData) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Scale based on growth
        const scale = 0.3 + (plantData.size * 0.7);
        g.setAttribute('transform', `translate(10, 20) scale(${scale})`);
        
        // Plant symbol
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '0');
        text.setAttribute('y', '0');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '16');
        text.textContent = plantData.symbol;
        
        // Add glow effect for healthy plants
        if (plantData.health > 0.8) {
            text.setAttribute('filter', 'url(#plantGlow)');
        }
        
        g.appendChild(text);
        
        // Growth animation for actively growing plants
        if (plantData.size < 1.0) {
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animate.setAttribute('attributeName', 'transform');
            animate.setAttribute('type', 'scale');
            animate.setAttribute('values', `${scale};${scale * 1.1};${scale}`);
            animate.setAttribute('dur', '3s');
            animate.setAttribute('repeatCount', 'indefinite');
            g.appendChild(animate);
        }
        
        return g;
    }

    updateGardenVisualization() {
        this.renderGardenPlots();
        this.updateGardenStats();
    }

    updateGardenStats() {
        document.getElementById('totalPlants').textContent = this.gardenStats.totalPlants;
        document.getElementById('bloomingPlants').textContent = this.gardenStats.bloomingPlants;
        document.getElementById('matureThoughts').textContent = this.gardenStats.matureThoughts;
    }

    startGrowthCycle() {
        // Growth cycle runs every 30 seconds
        setInterval(() => {
            this.processGrowth();
        }, 30000);
    }

    processGrowth() {
        this.garden.plots.forEach(plot => {
            if (plot.plant) {
                const plant = plot.plant.plant;
                const capsule = this.memoryCapsules.get(plot.plant.capsuleId);
                
                // Calculate growth
                const growthAmount = plant.growthRate * plot.soilQuality * plot.sunlight * plot.water;
                plant.size = Math.min(1.0, plant.size + growthAmount);
                plant.age += 1;
                
                // Check for evolution triggers
                this.checkEvolution(capsule, plant);
                
                // Update health based on care
                const timeSinceWatered = Date.now() - new Date(plant.lastWatered).getTime();
                const hoursWithoutWater = timeSinceWatered / (1000 * 60 * 60);
                
                if (hoursWithoutWater > 24) {
                    plant.health = Math.max(0.1, plant.health - 0.05);
                }
                
                // Update bloom level
                if (plant.size > 0.8 && plant.health > 0.7) {
                    plant.bloomLevel = Math.min(1.0, plant.bloomLevel + 0.1);
                    if (plant.bloomLevel > 0.5) {
                        this.gardenStats.bloomingPlants++;
                    }
                }
                
                // Check for maturity
                if (plant.size >= 1.0 && plant.bloomLevel >= 0.8) {
                    this.gardenStats.matureThoughts++;
                    this.evolveCapsuleNFT(capsule);
                }
            }
        });
        
        this.updateGardenVisualization();
    }

    checkEvolution(capsule, plant) {
        const triggers = capsule.evolutionTriggers;
        const userStats = this.getUserStats();
        
        Object.entries(triggers).forEach(([stage, trigger]) => {
            if (plant.evolutionStage < parseInt(stage.slice(-1))) {
                let canEvolve = true;
                
                if (trigger.sessions && userStats.totalSessions < trigger.sessions) canEvolve = false;
                if (trigger.performance && userStats.avgPerformance < trigger.performance) canEvolve = false;
                if (trigger.streak && userStats.currentStreak < trigger.streak) canEvolve = false;
                
                if (canEvolve) {
                    this.evolveMemoryCapsule(capsule, parseInt(stage.slice(-1)));
                    plant.evolutionStage = parseInt(stage.slice(-1));
                }
            }
        });
    }

    getUserStats() {
        // Mock user statistics - in real app, get from user profile
        return {
            totalSessions: 25,
            avgPerformance: 0.75,
            currentStreak: 5
        };
    }

    evolveMemoryCapsule(capsule, stage) {
        // Update NFT metadata for evolution
        const stages = ['Seed', 'Sprout', 'Growing', 'Blooming', 'Mature'];
        capsule.growthStage = stages[stage] || 'Mature';
        
        // Update attributes
        const stageAttr = capsule.nftMetadata.attributes.find(attr => attr.trait_type === 'Growth Stage');
        if (stageAttr) {
            stageAttr.value = capsule.growthStage;
        }
        
        // Add evolution timestamp
        capsule.nftMetadata.attributes.push({
            trait_type: `Evolution ${stage}`,
            value: new Date().toISOString()
        });
        
        // Regenerate image with new stage
        capsule.nftMetadata.image = this.generateEvolvedImage(capsule, stage);
        
        // Log evolution
        this.growthHistory.push({
            capsuleId: capsule.id,
            stage: stage,
            timestamp: new Date().toISOString(),
            description: `Evolved to ${capsule.growthStage}`
        });
        
        // Show notification
        this.showEvolutionNotification(capsule, stage);
    }

    generateEvolvedImage(capsule, stage) {
        // Generate evolved SVG based on stage
        const colors = this.getTypeColors(capsule.type);
        const stageIntensity = stage * 0.2;
        
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="evolvedGrad" cx="50%" cy="30%">
                        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:${0.8 + stageIntensity}" />
                        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:${0.4 + stageIntensity}" />
                    </radialGradient>
                </defs>
                
                <rect width="300" height="300" fill="linear-gradient(135deg, #f0f4f8, #d1ecf1)"/>
                
                <!-- Evolved capsule with more complex patterns -->
                <circle cx="150" cy="150" r="${80 + stage * 5}" fill="url(#evolvedGrad)"/>
                
                <!-- Stage-specific elements -->
                ${this.generateStageElements(stage, colors)}
                
                <!-- Evolution indicator -->
                <text x="150" y="160" text-anchor="middle" font-size="${40 + stage * 2}" fill="white">
                    ${capsule.plantData.symbol}
                </text>
                
                <text x="150" y="280" text-anchor="middle" font-size="12" fill="${colors.primary}">
                    STAGE ${stage} - ${capsule.growthStage.toUpperCase()}
                </text>
            </svg>
        `)}`;
    }

    generateStageElements(stage, colors) {
        let elements = '';
        
        // Add complexity based on evolution stage
        for (let i = 0; i < stage; i++) {
            const radius = 100 + i * 15;
            elements += `<circle cx="150" cy="150" r="${radius}" fill="none" stroke="${colors.accent}" 
                        stroke-width="2" opacity="0.3" stroke-dasharray="5,5">
                        <animateTransform attributeName="transform" type="rotate" 
                        values="0 150 150;360 150 150" dur="${5 + i}s" repeatCount="indefinite"/>
                        </circle>`;
        }
        
        return elements;
    }

    showEvolutionNotification(capsule, stage) {
        const notification = document.createElement('div');
        notification.className = 'evolution-notification';
        notification.innerHTML = `
            <div class="evolution-content">
                <div class="evolution-icon">${capsule.plantData.symbol}</div>
                <h3>Memory Capsule Evolved!</h3>
                <p><strong>${capsule.content.title}</strong> has reached Stage ${stage}</p>
                <p>${capsule.evolutionTriggers[`stage${stage}`]?.description}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                    <i class="fas fa-check"></i> Amazing!
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.4);
            z-index: 2000;
            text-align: center;
            max-width: 400px;
            animation: bounceIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
    }

    waterGarden() {
        this.garden.plots.forEach(plot => {
            if (plot.plant) {
                plot.water = Math.min(1.0, plot.water + 0.3);
                plot.plant.plant.lastWatered = new Date().toISOString();
                plot.plant.plant.health = Math.min(1.0, plot.plant.plant.health + 0.1);
            }
        });
        
        this.updateGardenVisualization();
        this.showToast('💧 Garden watered! Your thoughts are refreshed.');
    }

    addNutrients() {
        Object.keys(this.garden.nutrients).forEach(nutrient => {
            this.garden.nutrients[nutrient] = Math.min(100, this.garden.nutrients[nutrient] + 25);
        });
        
        this.garden.plots.forEach(plot => {
            if (plot.plant) {
                plot.soilQuality = Math.min(1.0, plot.soilQuality + 0.1);
                plot.plant.plant.growthRate *= 1.2;
            }
        });
        
        this.updateGardenVisualization();
        this.showToast('🌱 Nutrients added! Your garden will grow faster.');
    }

    viewMemoryCapsules() {
        const modal = document.createElement('div');
        modal.className = 'memory-capsules-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🧠 Memory Capsules Collection</h2>
                    <button onclick="this.closest('.memory-capsules-modal').remove()">×</button>
                </div>
                <div class="capsules-grid">
                    ${Array.from(this.memoryCapsules.values()).map(capsule => this.renderCapsuleCard(capsule)).join('')}
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
    }

    renderCapsuleCard(capsule) {
        return `
            <div class="capsule-card">
                <img src="${capsule.nftMetadata.image}" alt="${capsule.nftMetadata.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                <h4>${capsule.content.title}</h4>
                <p>${capsule.content.description}</p>
                <div class="capsule-stage">Stage: ${capsule.growthStage}</div>
                <div class="capsule-emotions">
                    ${capsule.content.emotions.map(emotion => `<span class="emotion-tag">${emotion}</span>`).join('')}
                </div>
            </div>
        `;
    }

    exportGarden() {
        const gardenData = {
            garden: this.garden,
            memoryCapsules: Array.from(this.memoryCapsules.entries()),
            stats: this.gardenStats,
            growthHistory: this.growthHistory,
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(gardenData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'neurox_thought_garden.json';
        link.click();
        
        this.showToast('🌱 Garden exported! Your memory capsules are saved.');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'garden-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--focus-color);
            color: var(--black);
            padding: 1rem;
            border-radius: 8px;
            z-index: 1500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    setupInteractiveElements() {
        // Add garden interaction handlers
        console.log('🌱 Thought Garden interactive elements ready');
    }

    // Public methods for integration
    processSession(sessionData) {
        const capsule = this.createMemoryCapsule(sessionData);
        return capsule;
    }

    getGardenSummary() {
        return {
            totalCapsules: this.memoryCapsules.size,
            gardenStats: this.gardenStats,
            recentGrowth: this.growthHistory.slice(-5)
        };
    }
}

// Initialize and export
window.thoughtGarden = new ThoughtGarden();
window.ThoughtGarden = ThoughtGarden;
