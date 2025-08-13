// NeuroX Advanced Features Module
class NeuroXAdvanced {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.achievements = [];
        this.socialFeatures = null;
        this.aiCoach = null;
        this.gamification = null;
        this.analytics = null;
        this.nftMarketplace = null;
        this.communityFeatures = null;
        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.initializeFeatures();
            this.startPerformanceTracking();
        } catch (error) {
            console.error('NeuroXAdvanced initialization failed:', error);
        }
    }

    initializeFeatures() {
        try {
            // Initialize features only when classes are available
            if (typeof SocialFeatures !== 'undefined') {
                this.socialFeatures = new SocialFeatures();
            }
            if (typeof AICoach !== 'undefined') {
                this.aiCoach = new AICoach();
            }
            if (typeof Gamification !== 'undefined') {
                this.gamification = new Gamification();
            }
            if (typeof AdvancedAnalytics !== 'undefined') {
                this.analytics = new AdvancedAnalytics();
            }
            if (typeof NFTMarketplace !== 'undefined') {
                this.nftMarketplace = new NFTMarketplace();
            }
            if (typeof CommunityFeatures !== 'undefined') {
                this.communityFeatures = new CommunityFeatures();
            }
        } catch (error) {
            console.error('Feature initialization failed:', error);
        }
    }

    startPerformanceTracking() {
        try {
            // Start performance tracking
            console.log('Performance tracking started');
        } catch (error) {
            console.error('Performance tracking failed:', error);
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
    }

    async onWalletConnected(walletData) {
        try {
            this.userProfile.walletAddress = walletData.address;
            this.userProfile.chainId = walletData.chainId;

            // Load user's NFTs and social profile
            await this.loadUserNFTs();
            if (this.socialFeatures && this.socialFeatures.loadProfile) {
                await this.socialFeatures.loadProfile(walletData.address);
            }

            // Initialize AI coach with user data
            if (this.aiCoach && this.aiCoach.initializeUser) {
                this.aiCoach.initializeUser(this.userProfile);
            }

            // Update UI
            this.updateProfileUI();
        } catch (error) {
            console.error('Wallet connection handling failed:', error);
        }
    }

    async onNFTVerified(nftData) {
        try {
            this.userProfile.premiumAccess = true;
            this.userProfile.nftCollection = nftData.collection;

            // Unlock premium features
            this.unlockPremiumFeatures();

            // Initialize premium analytics
            if (this.analytics && this.analytics.enablePremiumFeatures) {
                this.analytics.enablePremiumFeatures();
            }

            // Show welcome message
            this.showPremiumWelcome(nftData);
        } catch (error) {
            console.error('NFT verification handling failed:', error);
        }
    }

    loadUserProfile() {
        const saved = localStorage.getItem('neuroXProfile');
        return saved ? JSON.parse(saved) : {
            id: Date.now().toString(),
            level: 1,
            xp: 0,
            streakDays: 0,
            totalSessions: 0,
            premiumAccess: false,
            achievements: [],
            preferences: {
                notifications: true,
                darkMode: false,
                difficulty: 'medium'
            }
        };
    }

    saveUserProfile() {
        localStorage.setItem('neuroXProfile', JSON.stringify(this.userProfile));
    }

    async loadUserNFTs() {
        if (!this.userProfile.walletAddress) return;

        try {
            if (this.nftMarketplace && this.nftMarketplace.getUserNFTs) {
                const nfts = await this.nftMarketplace.getUserNFTs(this.userProfile.walletAddress);
                this.userProfile.nfts = nfts;
                this.displayUserNFTs(nfts);
            }
        } catch (error) {
            console.error('Failed to load NFTs:', error);
        }
    }

    displayUserNFTs(nfts) {
        try {
            console.log('User NFTs loaded:', nfts);
            // Update UI with NFTs if needed
        } catch (error) {
            console.error('Failed to display NFTs:', error);
        }
    }

    updateProfileUI() {
        try {
            console.log('Profile UI updated');
            // Update profile UI elements
        } catch (error) {
            console.error('Failed to update profile UI:', error);
        }
    }

    unlockPremiumFeatures() {
        // Remove locks from premium features
        document.querySelectorAll('.premium-feature.locked').forEach(element => {
            element.classList.remove('locked');
            element.classList.add('unlocked');
        });

        // Hide premium locks
        document.querySelectorAll('.premium-lock').forEach(element => {
            element.style.display = 'none';
        });

        // Enable premium navigation
        this.enablePremiumNavigation();
    }

    showPremiumWelcome(nftData) {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-content premium-welcome">
                <div class="celebration-animation">🎉✨🧠✨🎉</div>
                <h2>Welcome to NeuroX Premium! 🚀</h2>
                <p>Your ${nftData.name} has been verified!</p>
                
                <div class="nft-showcase">
                    <img src="${nftData.image}" alt="${nftData.name}" style="width: 150px; height: 150px; border-radius: 12px; object-fit: cover;">
                    <div style="margin-top: 1rem;">
                        <h3>${nftData.name}</h3>
                        <p>${nftData.description}</p>
                    </div>
                </div>

                <div class="premium-features-list">
                    <h3>🔓 Unlocked Features:</h3>
                    <div class="feature-grid">
                        <div class="feature-item">
                            <i class="fas fa-brain"></i>
                            <span>Advanced Neural Analytics</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-robot"></i>
                            <span>AI Cognitive Coach</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-users"></i>
                            <span>Premium Community</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-trophy"></i>
                            <span>Exclusive Challenges</span>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="this.closest('.onboarding-modal').remove(); neuroXAdvanced.startPremiumTour();">
                    <i class="fas fa-rocket"></i>
                    Explore Premium Features
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    startPremiumTour() {
        try {
            // Interactive tour of premium features
            const tourSteps = [
                {
                    target: '#advancedAnalytics',
                    title: 'Advanced Neural Analytics',
                    description: 'Get deep insights into your cognitive patterns and brain activity.',
                    action: () => {
                        if (this.analytics && this.analytics.showDemo) {
                            this.analytics.showDemo();
                        }
                    }
                },
                {
                    target: '#aiCoach',
                    title: 'AI Cognitive Coach',
                    description: 'Your personal AI coach adapts training to your unique needs.',
                    action: () => {
                        if (this.aiCoach && this.aiCoach.showIntro) {
                            this.aiCoach.showIntro();
                        }
                    }
                },
                {
                    target: '.premium-community',
                    title: 'Premium Community',
                    description: 'Connect with other premium members and share insights.',
                    action: () => {
                        if (this.communityFeatures && this.communityFeatures.showHub) {
                            this.communityFeatures.showHub();
                        }
                    }
                }
            ];

            if (typeof InteractiveTour !== 'undefined') {
                const tour = new InteractiveTour(tourSteps);
                tour.start();
            } else {
                console.log('Premium tour started - InteractiveTour not available');
                // Fallback: show features one by one
                tourSteps.forEach((step, index) => {
                    setTimeout(() => {
                        if (step.action) step.action();
                    }, index * 2000);
                });
            }
        } catch (error) {
            console.error('Premium tour failed:', error);
        }
    }
}

// Social Features Module
class SocialFeatures {
    constructor() {
        this.friends = [];
        this.activities = [];
        this.leaderboards = new Map();
    }

    async loadProfile(walletAddress) {
        try {
            // In a real app, this would fetch from a backend
            const profile = await this.fetchUserProfile(walletAddress);
            this.updateSocialUI(profile);
        } catch (error) {
            console.error('Failed to load social profile:', error);
        }
    }

    async fetchUserProfile(address) {
        // Mock profile data - in production, fetch from backend
        return {
            address,
            ens: await this.resolveENS(address),
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
            bio: 'Cognitive training enthusiast',
            stats: {
                sessionsCompleted: Math.floor(Math.random() * 100),
                averageScore: Math.floor(Math.random() * 100),
                friendsCount: Math.floor(Math.random() * 50)
            }
        };
    }

    async resolveENS(address) {
        try {
            if (window.neuroWeb3 && window.neuroWeb3.provider) {
                return await window.neuroWeb3.provider.lookupAddress(address);
            }
        } catch (error) {
            console.log('ENS resolution failed:', error);
        }
        return null;
    }

    shareAchievement(achievement) {
        const shareData = {
            title: `NeuroX Achievement: ${achievement.title}`,
            text: `I just unlocked "${achievement.title}" in NeuroX! 🧠💪`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            this.fallbackShare(shareData);
        }
    }

    fallbackShare(shareData) {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(url, '_blank');
    }

    createSocialPost(content, type = 'achievement') {
        const post = {
            id: Date.now().toString(),
            content,
            type,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: []
        };

        this.activities.unshift(post);
        this.updateActivityFeed();
        return post;
    }

    updateActivityFeed() {
        const feed = document.getElementById('socialFeed');
        if (!feed) return;

        feed.innerHTML = this.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-header">
                    <img src="${this.getActivityIcon(activity.type)}" alt="${activity.type}">
                    <span class="activity-time">${this.formatTime(activity.timestamp)}</span>
                </div>
                <div class="activity-content">${activity.content}</div>
                <div class="activity-actions">
                    <button onclick="neuroXAdvanced.socialFeatures.likeActivity('${activity.id}')">
                        <i class="fas fa-heart"></i> ${activity.likes}
                    </button>
                    <button onclick="neuroXAdvanced.socialFeatures.commentOnActivity('${activity.id}')">
                        <i class="fas fa-comment"></i> ${activity.comments.length}
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// AI Coach Module
class AICoach {
    constructor() {
        this.recommendations = [];
        this.insights = [];
        this.sessionHistory = [];
    }

    initializeUser(profile) {
        this.userProfile = profile;
        this.generatePersonalizedRecommendations();
    }

    generatePersonalizedRecommendations() {
        const recommendations = [
            {
                type: 'training',
                title: 'Focus on Memory Training',
                description: 'Your recent scores suggest memory exercises would benefit you most.',
                confidence: 0.85,
                action: 'memory-challenge'
            },
            {
                type: 'timing',
                title: 'Optimal Training Time',
                description: 'Your performance peaks between 10-11 AM. Schedule sessions then.',
                confidence: 0.78,
                action: 'schedule-reminder'
            },
            {
                type: 'difficulty',
                title: 'Increase Challenge Level',
                description: 'You\'re ready for harder challenges to continue improving.',
                confidence: 0.92,
                action: 'level-up'
            }
        ];

        this.recommendations = recommendations;
        this.updateCoachUI();
    }

    analyzePerformance(sessionData) {
        const insights = {
            strengths: this.identifyStrengths(sessionData),
            improvements: this.identifyImprovements(sessionData),
            trends: this.analyzeTrends(sessionData),
            nextSteps: this.suggestNextSteps(sessionData)
        };

        this.insights.push(insights);
        return insights;
    }

    showIntro() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-content ai-coach-intro">
                <div class="ai-avatar">🤖</div>
                <h2>Meet Your AI Cognitive Coach</h2>
                <p>I analyze your performance patterns and create personalized training plans.</p>
                
                <div class="coach-features">
                    <div class="coach-feature">
                        <i class="fas fa-chart-line"></i>
                        <h3>Performance Analysis</h3>
                        <p>Deep insights into your cognitive patterns</p>
                    </div>
                    <div class="coach-feature">
                        <i class="fas fa-target"></i>
                        <h3>Personalized Goals</h3>
                        <p>Custom training plans based on your needs</p>
                    </div>
                    <div class="coach-feature">
                        <i class="fas fa-clock"></i>
                        <h3>Optimal Timing</h3>
                        <p>When to train for maximum effectiveness</p>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="this.closest('.onboarding-modal').remove();">
                    <i class="fas fa-check"></i>
                    Let's Start Training!
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    updateCoachUI() {
        const coachPanel = document.getElementById('aiCoachPanel');
        if (!coachPanel) return;

        coachPanel.innerHTML = `
            <div class="coach-header">
                <div class="ai-avatar">🤖</div>
                <h3>Your AI Coach</h3>
            </div>
            <div class="recommendations">
                ${this.recommendations.map(rec => `
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-type">${rec.type}</span>
                            <span class="confidence">${Math.round(rec.confidence * 100)}%</span>
                        </div>
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        <button class="btn btn-sm" onclick="neuroXAdvanced.aiCoach.executeRecommendation('${rec.action}')">
                            Take Action
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Gamification Module
class Gamification {
    constructor() {
        this.achievements = new Map();
        this.badges = new Map();
        this.quests = [];
        this.rewards = [];
        this.initializeAchievements();
    }

    initializeAchievements() {
        const achievements = [
            {
                id: 'first_session',
                title: 'First Steps',
                description: 'Complete your first training session',
                icon: '🌟',
                xp: 100,
                unlocked: false
            },
            {
                id: 'memory_master',
                title: 'Memory Master',
                description: 'Score 90%+ on memory challenges 5 times',
                icon: '🧠',
                xp: 500,
                unlocked: false,
                progress: 0,
                target: 5
            },
            {
                id: 'speed_demon',
                title: 'Speed Demon',
                description: 'Complete a challenge in under 30 seconds',
                icon: '⚡',
                xp: 300,
                unlocked: false
            },
            {
                id: 'nft_holder',
                title: 'Premium Member',
                description: 'Own a NeuroX Premium NFT',
                icon: '💎',
                xp: 1000,
                unlocked: false
            }
        ];

        achievements.forEach(achievement => {
            this.achievements.set(achievement.id, achievement);
        });
    }

    checkAchievements(event) {
        const { type, data } = event;

        switch (type) {
            case 'session_completed':
                this.unlockAchievement('first_session');
                break;
            case 'challenge_completed':
                this.handleChallengeAchievements(data);
                break;
            case 'nft_verified':
                this.unlockAchievement('nft_holder');
                break;
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.get(achievementId);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();

        // Award XP
        if (window.neuroXAdvanced && window.neuroXAdvanced.userProfile) {
            window.neuroXAdvanced.userProfile.xp += achievement.xp;
            window.neuroXAdvanced.saveUserProfile();
        }

        // Show achievement notification
        this.showAchievementNotification(achievement);

        // Update UI
        this.updateAchievementsUI();

        return achievement;
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h3>Achievement Unlocked!</h3>
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                    <div class="xp-reward">+${achievement.xp} XP</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    createQuest(title, description, tasks, rewards) {
        const quest = {
            id: Date.now().toString(),
            title,
            description,
            tasks,
            rewards,
            progress: 0,
            completed: false,
            startedAt: new Date().toISOString()
        };

        this.quests.push(quest);
        this.updateQuestsUI();
        return quest;
    }

    updateQuestsUI() {
        const questsPanel = document.getElementById('questsPanel');
        if (!questsPanel) return;

        questsPanel.innerHTML = `
            <h3>🎯 Active Quests</h3>
            <div class="quests-list">
                ${this.quests.filter(q => !q.completed).map(quest => `
                    <div class="quest-card">
                        <h4>${quest.title}</h4>
                        <p>${quest.description}</p>
                        <div class="quest-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(quest.progress / quest.tasks.length) * 100}%"></div>
                            </div>
                            <span>${quest.progress}/${quest.tasks.length}</span>
                        </div>
                        <div class="quest-rewards">
                            ${quest.rewards.map(reward => `<span class="reward">${reward}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Advanced Analytics Module
class AdvancedAnalytics {
    constructor() {
        this.analyticsData = {
            sessions: [],
            performance: [],
            insights: [],
            predictions: []
        };
        this.premiumEnabled = false;
    }

    enablePremiumFeatures() {
        this.premiumEnabled = true;
        this.initializePremiumAnalytics();
    }

    initializePremiumAnalytics() {
        this.setupRealTimeTracking();
        this.enableAdvancedMetrics();
        this.startPredictiveAnalysis();
    }

    trackSession(sessionData) {
        const enrichedData = {
            ...sessionData,
            timestamp: new Date().toISOString(),
            browserInfo: this.getBrowserInfo(),
            performanceMetrics: this.getPerformanceMetrics()
        };

        this.analyticsData.sessions.push(enrichedData);
        this.analyzeSessionData(enrichedData);
    }

    analyzeSessionData(sessionData) {
        const insights = {
            focusLevel: this.calculateFocusLevel(sessionData),
            improvementRate: this.calculateImprovementRate(sessionData),
            optimalTiming: this.findOptimalTiming(sessionData),
            cognitiveLoad: this.assessCognitiveLoad(sessionData)
        };

        this.analyticsData.insights.push(insights);
        this.updateAnalyticsUI(insights);
    }

    showDemo() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal analytics-demo';
        modal.innerHTML = `
            <div class="onboarding-content">
                <h2>🧠 Advanced Neural Analytics</h2>
                <div class="analytics-preview">
                    <div class="metric-card">
                        <h3>Neural Efficiency</h3>
                        <div class="metric-value">87%</div>
                        <div class="metric-trend">↗ +5% this week</div>
                    </div>
                    <div class="metric-card">
                        <h3>Focus Patterns</h3>
                        <div class="mini-chart">📈</div>
                        <div class="metric-insight">Peak: 10-11 AM</div>
                    </div>
                    <div class="metric-card">
                        <h3>Memory Retention</h3>
                        <div class="metric-value">92%</div>
                        <div class="metric-trend">↗ Improving</div>
                    </div>
                </div>
                <p>Get detailed insights into your cognitive patterns and performance trends.</p>
                <button class="btn btn-primary" onclick="this.closest('.onboarding-modal').remove();">
                    <i class="fas fa-chart-line"></i>
                    Explore Analytics
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
}

// NFT Marketplace Module
class NFTMarketplace {
    constructor() {
        this.collections = new Map();
        this.listings = [];
        this.userNFTs = [];
    }

    async getUserNFTs(walletAddress) {
        try {
            // In production, this would call multiple chain APIs
            const chains = ['ethereum', 'polygon', 'bsc'];
            const allNFTs = [];

            for (const chain of chains) {
                const nfts = await this.fetchNFTsFromChain(walletAddress, chain);
                allNFTs.push(...nfts);
            }

            return allNFTs;
        } catch (error) {
            console.error('Failed to fetch NFTs:', error);
            return [];
        }
    }

    async fetchNFTsFromChain(address, chain) {
        // Mock NFT data - in production, use Moralis, Alchemy, or similar
        return [
            {
                id: `${chain}-1`,
                name: 'NeuroX Premium Pass',
                description: 'Exclusive access to premium cognitive training features',
                image: 'https://via.placeholder.com/300x300/667eea/white?text=NeuroX+Premium',
                collection: 'NeuroX Premium',
                chain,
                tokenId: '1',
                contractAddress: '0x742d35cc6634c0532925a3b8d0ed6fb9a9eb4a5e',
                metadata: {
                    attributes: [
                        { trait_type: 'Access Level', value: 'Premium' },
                        { trait_type: 'Features', value: 'All' },
                        { trait_type: 'Rarity', value: 'Elite' }
                    ]
                }
            }
        ];
    }

    async mintNFT(metadata) {
        try {
            if (!window.neuroWeb3 || !window.neuroWeb3.isConnected) {
                throw new Error('Wallet not connected');
            }

            // Show minting modal
            this.showMintingModal(metadata);

            // In production, this would interact with a minting contract
            const mockTransaction = {
                hash: '0x' + Math.random().toString(16).substr(2, 64),
                from: window.neuroWeb3.userAddress,
                to: '0x742d35cc6634c0532925a3b8d0ed6fb9a9eb4a5e',
                status: 'pending'
            };

            return mockTransaction;
        } catch (error) {
            console.error('Minting failed:', error);
            throw error;
        }
    }

    showMintingModal(metadata) {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        modal.innerHTML = `
            <div class="onboarding-content minting-modal">
                <h2>🎨 Minting Your NFT</h2>
                <div class="nft-preview">
                    <img src="${metadata.image}" alt="${metadata.name}">
                    <h3>${metadata.name}</h3>
                    <p>${metadata.description}</p>
                </div>
                <div class="minting-progress">
                    <div class="progress-step active">
                        <i class="fas fa-wallet"></i>
                        <span>Confirm Transaction</span>
                    </div>
                    <div class="progress-step">
                        <i class="fas fa-cog"></i>
                        <span>Processing</span>
                    </div>
                    <div class="progress-step">
                        <i class="fas fa-check"></i>
                        <span>Complete</span>
                    </div>
                </div>
                <p>Please confirm the transaction in your wallet...</p>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
}

// Community Features Module
class CommunityFeatures {
    constructor() {
        this.chatRooms = new Map();
        this.forums = [];
        this.events = [];
    }

    showHub() {
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal community-hub';
        modal.innerHTML = `
            <div class="onboarding-content">
                <h2>🌟 Premium Community Hub</h2>
                <div class="community-features">
                    <div class="community-section">
                        <i class="fas fa-comments"></i>
                        <h3>Chat Rooms</h3>
                        <p>Connect with other premium members</p>
                        <button class="btn btn-sm" onclick="neuroXAdvanced.communityFeatures.openChat()">Join Chat</button>
                    </div>
                    <div class="community-section">
                        <i class="fas fa-calendar"></i>
                        <h3>Exclusive Events</h3>
                        <p>VIP workshops and training sessions</p>
                        <button class="btn btn-sm" onclick="neuroXAdvanced.communityFeatures.showEvents()">View Events</button>
                    </div>
                    <div class="community-section">
                        <i class="fas fa-trophy"></i>
                        <h3>Competitions</h3>
                        <p>Premium-only challenges and tournaments</p>
                        <button class="btn btn-sm" onclick="neuroXAdvanced.communityFeatures.showCompetitions()">Compete</button>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.onboarding-modal').remove();">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    openChat() {
        try {
            // Implementation for chat functionality
            if (window.neuroWeb3 && window.neuroWeb3.showInfo) {
                window.neuroWeb3.showInfo('Premium chat rooms coming soon!');
            } else {
                console.log('Premium chat rooms coming soon!');
            }
        } catch (error) {
            console.error('Chat feature error:', error);
        }
    }

    showEvents() {
        try {
            // Implementation for events
            if (window.neuroWeb3 && window.neuroWeb3.showInfo) {
                window.neuroWeb3.showInfo('Exclusive events coming soon!');
            } else {
                console.log('Exclusive events coming soon!');
            }
        } catch (error) {
            console.error('Events feature error:', error);
        }
    }

    showCompetitions() {
        try {
            // Implementation for competitions
            if (window.neuroWeb3 && window.neuroWeb3.showInfo) {
                window.neuroWeb3.showInfo('Premium competitions coming soon!');
            } else {
                console.log('Premium competitions coming soon!');
            }
        } catch (error) {
            console.error('Competitions feature error:', error);
        }
    }
}

// Interactive Tour Module
class InteractiveTour {
    constructor(steps) {
        this.steps = steps;
        this.currentStep = 0;
    }

    start() {
        this.showStep(0);
    }

    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[stepIndex];
        const target = document.querySelector(step.target);
        
        if (!target) {
            this.nextStep();
            return;
        }

        const tooltip = this.createTooltip(step);
        this.positionTooltip(tooltip, target);
        this.highlightElement(target);

        this.currentStep = stepIndex;
    }

    createTooltip(step) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                <div class="tooltip-actions">
                    <button class="btn btn-sm" onclick="interactiveTour.skip()">Skip Tour</button>
                    <button class="btn btn-primary btn-sm" onclick="interactiveTour.nextStep()">
                        ${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    nextStep() {
        this.cleanup();
        this.showStep(this.currentStep + 1);
    }

    skip() {
        this.cleanup();
        this.complete();
    }

    complete() {
        this.cleanup();
        window.neuroWeb3.showSuccess('Tour completed! Enjoy your premium features!');
    }

    cleanup() {
        document.querySelectorAll('.tour-tooltip').forEach(el => el.remove());
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
    }
}

// Initialize advanced features
let neuroXAdvanced;

function initializeNeuroXAdvanced() {
    try {
        neuroXAdvanced = new NeuroXAdvanced();
        window.neuroXAdvanced = neuroXAdvanced;
        console.log('✅ NeuroXAdvanced initialized successfully');
    } catch (error) {
        console.error('❌ NeuroXAdvanced initialization failed:', error);
        // Create minimal fallback object
        window.neuroXAdvanced = {
            userProfile: { premiumAccess: false },
            socialFeatures: null,
            aiCoach: null,
            gamification: null,
            analytics: null,
            startPremiumTour: () => console.log('Premium tour not available'),
            onWalletConnected: () => console.log('Wallet connected'),
            onNFTVerified: () => console.log('NFT verified')
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNeuroXAdvanced);
} else {
    // DOM is already loaded
    initializeNeuroXAdvanced();
}

// Export for global access
window.NeuroXAdvanced = NeuroXAdvanced;
