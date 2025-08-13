/**
 * Advanced Motion and Animation System
 * Features: Framer Motion-like animations, Physics-based interactions, Gesture controls, Micro-interactions
 */

class AdvancedMotionSystem {
    constructor() {
        this.isInitialized = false;
        this.animations = new Map();
        this.gestures = new Map();
        this.springs = new Map();
        this.parallaxElements = [];
        this.motionValues = new Map();
        this.animationFrames = new Set();
        this.easingFunctions = this.createEasingFunctions();
        this.microInteractions = new Map();
        
        this.init();
    }

    init() {
        try {
            console.log('🎭 Initializing Advanced Motion System...');
            
            // Initialize gesture recognition
            this.initializeGestures();
            
            // Initialize physics engine
            this.initializePhysics();
            
            // Setup micro-interactions
            this.setupMicroInteractions();
            
            // Initialize parallax system
            this.initializeParallax();
            
            // Setup resize observer
            this.setupResizeObserver();
            
            this.isInitialized = true;
            console.log('✅ Advanced Motion System initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize Advanced Motion System:', error);
        }
    }

    createEasingFunctions() {
        return {
            // Cubic Bezier curves for smooth animations
            ease: t => 0.25 * (1 - t) ** 3 + 0.75 * t,
            easeIn: t => t * t * t,
            easeOut: t => 1 - Math.pow(1 - t, 3),
            easeInOut: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            
            // Elastic easing for bouncy effects
            easeInElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
            },
            easeOutElastic: t => {
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            },
            
            // Back easing for overshoot effects
            easeInBack: t => 2.70158 * t * t * t - 1.70158 * t * t,
            easeOutBack: t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
            
            // Bounce easing
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            }
        };
    }

    initializeGestures() {
        // Touch and mouse gesture recognition
        this.gestureRecognizer = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            startTime: 0,
            isTracking: false,
            velocity: { x: 0, y: 0 },
            distance: 0,
            direction: null
        };

        // Bind gesture events
        document.addEventListener('mousedown', this.handleGestureStart.bind(this));
        document.addEventListener('mousemove', this.handleGestureMove.bind(this));
        document.addEventListener('mouseup', this.handleGestureEnd.bind(this));
        
        document.addEventListener('touchstart', this.handleGestureStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleGestureMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleGestureEnd.bind(this));

        // Multi-touch gestures
        this.multiTouchState = {
            touches: [],
            scale: 1,
            rotation: 0,
            center: { x: 0, y: 0 }
        };
    }

    handleGestureStart(event) {
        const point = this.getEventPoint(event);
        
        this.gestureRecognizer.startX = point.x;
        this.gestureRecognizer.startY = point.y;
        this.gestureRecognizer.currentX = point.x;
        this.gestureRecognizer.currentY = point.y;
        this.gestureRecognizer.startTime = Date.now();
        this.gestureRecognizer.isTracking = true;
        
        // Check for multi-touch
        if (event.type === 'touchstart' && event.touches.length > 1) {
            this.handleMultiTouchStart(event);
        }
    }

    handleGestureMove(event) {
        if (!this.gestureRecognizer.isTracking) return;
        
        const point = this.getEventPoint(event);
        const deltaX = point.x - this.gestureRecognizer.currentX;
        const deltaY = point.y - this.gestureRecognizer.currentY;
        
        this.gestureRecognizer.velocity.x = deltaX;
        this.gestureRecognizer.velocity.y = deltaY;
        this.gestureRecognizer.currentX = point.x;
        this.gestureRecognizer.currentY = point.y;
        
        const totalDeltaX = point.x - this.gestureRecognizer.startX;
        const totalDeltaY = point.y - this.gestureRecognizer.startY;
        this.gestureRecognizer.distance = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
        
        // Determine swipe direction
        if (Math.abs(totalDeltaX) > Math.abs(totalDeltaY)) {
            this.gestureRecognizer.direction = totalDeltaX > 0 ? 'right' : 'left';
        } else {
            this.gestureRecognizer.direction = totalDeltaY > 0 ? 'down' : 'up';
        }
        
        // Multi-touch handling
        if (event.type === 'touchmove' && event.touches.length > 1) {
            this.handleMultiTouchMove(event);
        }
        
        // Emit gesture events
        this.emitGestureEvent('drag', {
            delta: { x: deltaX, y: deltaY },
            velocity: this.gestureRecognizer.velocity,
            distance: this.gestureRecognizer.distance,
            direction: this.gestureRecognizer.direction
        });
    }

    handleGestureEnd(event) {
        if (!this.gestureRecognizer.isTracking) return;
        
        const duration = Date.now() - this.gestureRecognizer.startTime;
        const distance = this.gestureRecognizer.distance;
        
        // Detect swipe
        if (distance > 50 && duration < 300) {
            this.emitGestureEvent('swipe', {
                direction: this.gestureRecognizer.direction,
                distance: distance,
                velocity: this.gestureRecognizer.velocity
            });
        }
        
        // Detect tap
        if (distance < 10 && duration < 200) {
            this.emitGestureEvent('tap', {
                x: this.gestureRecognizer.currentX,
                y: this.gestureRecognizer.currentY
            });
        }
        
        this.gestureRecognizer.isTracking = false;
    }

    handleMultiTouchStart(event) {
        this.multiTouchState.touches = Array.from(event.touches);
        if (this.multiTouchState.touches.length === 2) {
            const touch1 = this.multiTouchState.touches[0];
            const touch2 = this.multiTouchState.touches[1];
            
            this.multiTouchState.initialDistance = this.getDistance(touch1, touch2);
            this.multiTouchState.initialAngle = this.getAngle(touch1, touch2);
            this.multiTouchState.center = this.getCenter(touch1, touch2);
        }
    }

    handleMultiTouchMove(event) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];
            
            const currentDistance = this.getDistance(touch1, touch2);
            const currentAngle = this.getAngle(touch1, touch2);
            const currentCenter = this.getCenter(touch1, touch2);
            
            // Calculate scale
            if (this.multiTouchState.initialDistance) {
                this.multiTouchState.scale = currentDistance / this.multiTouchState.initialDistance;
            }
            
            // Calculate rotation
            if (this.multiTouchState.initialAngle !== undefined) {
                this.multiTouchState.rotation = currentAngle - this.multiTouchState.initialAngle;
            }
            
            this.multiTouchState.center = currentCenter;
            
            this.emitGestureEvent('pinch', {
                scale: this.multiTouchState.scale,
                rotation: this.multiTouchState.rotation,
                center: this.multiTouchState.center
            });
        }
    }

    getEventPoint(event) {
        if (event.type.startsWith('touch')) {
            const touch = event.touches[0] || event.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
        return { x: event.clientX, y: event.clientY };
    }

    getDistance(touch1, touch2) {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getAngle(touch1, touch2) {
        return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
    }

    getCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }

    emitGestureEvent(type, detail) {
        const event = new CustomEvent(`motion:${type}`, { detail });
        document.dispatchEvent(event);
    }

    initializePhysics() {
        // Simple physics simulation for springs and momentum
        this.physics = {
            gravity: 980, // pixels per second squared
            friction: 0.98,
            springConstant: 200,
            dampening: 0.9
        };
    }

    // Animation Methods
    animate(element, properties, options = {}) {
        const animationId = Date.now() + Math.random();
        
        const config = {
            duration: options.duration || 300,
            easing: options.easing || 'easeOut',
            delay: options.delay || 0,
            onComplete: options.onComplete || null,
            onUpdate: options.onUpdate || null
        };

        const initialStyles = this.getCurrentStyles(element, Object.keys(properties));
        const targetStyles = properties;
        
        const animation = {
            id: animationId,
            element: element,
            startTime: Date.now() + config.delay,
            duration: config.duration,
            easing: config.easing,
            initialStyles: initialStyles,
            targetStyles: targetStyles,
            onComplete: config.onComplete,
            onUpdate: config.onUpdate,
            isComplete: false
        };

        this.animations.set(animationId, animation);
        
        if (config.delay > 0) {
            setTimeout(() => {
                this.startAnimation(animationId);
            }, config.delay);
        } else {
            this.startAnimation(animationId);
        }

        return animationId;
    }

    startAnimation(animationId) {
        const animation = this.animations.get(animationId);
        if (!animation || animation.isComplete) return;

        const updateAnimation = () => {
            const now = Date.now();
            const elapsed = now - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            const easingFunction = this.easingFunctions[animation.easing] || this.easingFunctions.easeOut;
            const easedProgress = easingFunction(progress);
            
            // Update styles
            for (const [property, targetValue] of Object.entries(animation.targetStyles)) {
                const initialValue = animation.initialStyles[property];
                const currentValue = this.interpolateValue(initialValue, targetValue, easedProgress);
                this.setElementProperty(animation.element, property, currentValue);
            }
            
            // Call update callback
            if (animation.onUpdate) {
                animation.onUpdate(easedProgress, animation.element);
            }
            
            if (progress < 1) {
                const frameId = requestAnimationFrame(updateAnimation);
                this.animationFrames.add(frameId);
            } else {
                animation.isComplete = true;
                if (animation.onComplete) {
                    animation.onComplete(animation.element);
                }
                this.animations.delete(animationId);
            }
        };

        updateAnimation();
    }

    spring(element, properties, config = {}) {
        const springConfig = {
            stiffness: config.stiffness || 100,
            damping: config.damping || 10,
            mass: config.mass || 1,
            precision: config.precision || 0.01,
            ...config
        };

        const springId = Date.now() + Math.random();
        const initialStyles = this.getCurrentStyles(element, Object.keys(properties));
        
        const springs = {};
        for (const [property, targetValue] of Object.entries(properties)) {
            springs[property] = {
                current: initialStyles[property],
                target: targetValue,
                velocity: 0
            };
        }

        const springAnimation = {
            id: springId,
            element: element,
            springs: springs,
            config: springConfig,
            isActive: true
        };

        this.springs.set(springId, springAnimation);
        this.animateSpring(springId);
        
        return springId;
    }

    animateSpring(springId) {
        const spring = this.springs.get(springId);
        if (!spring || !spring.isActive) return;

        const dt = 1 / 60; // 60 FPS
        let isSettled = true;

        const updateSpring = () => {
            for (const [property, springState] of Object.entries(spring.springs)) {
                const displacement = springState.current - springState.target;
                const force = -spring.config.stiffness * displacement - spring.config.damping * springState.velocity;
                const acceleration = force / spring.config.mass;
                
                springState.velocity += acceleration * dt;
                springState.current += springState.velocity * dt;
                
                // Check if settled
                if (Math.abs(displacement) > spring.config.precision || Math.abs(springState.velocity) > spring.config.precision) {
                    isSettled = false;
                }
                
                this.setElementProperty(spring.element, property, springState.current);
            }
            
            if (!isSettled) {
                const frameId = requestAnimationFrame(updateSpring);
                this.animationFrames.add(frameId);
            } else {
                spring.isActive = false;
                this.springs.delete(springId);
            }
        };

        updateSpring();
    }

    // Parallax System
    initializeParallax() {
        this.parallaxElements = [];
        this.lastScrollY = window.scrollY;
        
        // Find elements with parallax attributes
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const direction = element.dataset.parallaxDirection || 'vertical';
            
            this.parallaxElements.push({
                element: element,
                speed: speed,
                direction: direction,
                initialOffset: element.offsetTop
            });
        });

        // Throttled scroll handler
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
    }

    updateParallax() {
        const scrollY = window.scrollY;
        const deltaY = scrollY - this.lastScrollY;
        
        this.parallaxElements.forEach(item => {
            const { element, speed, direction } = item;
            const rect = element.getBoundingClientRect();
            
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const offset = scrollY * speed;
                
                if (direction === 'vertical') {
                    element.style.transform = `translateY(${offset}px)`;
                } else if (direction === 'horizontal') {
                    element.style.transform = `translateX(${offset}px)`;
                }
            }
        });
        
        this.lastScrollY = scrollY;
    }

    // Micro-interactions
    setupMicroInteractions() {
        // Button hover effects
        this.setupButtonInteractions();
        
        // Card interactions
        this.setupCardInteractions();
        
        // Input focus effects
        this.setupInputInteractions();
        
        // Loading animations
        this.setupLoadingAnimations();
    }

    setupButtonInteractions() {
        document.querySelectorAll('button, .btn').forEach(button => {
            let isPressed = false;
            
            button.addEventListener('mouseenter', () => {
                this.animate(button, {
                    scale: 1.05,
                    brightness: 1.1
                }, {
                    duration: 200,
                    easing: 'easeOut'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                if (!isPressed) {
                    this.animate(button, {
                        scale: 1,
                        brightness: 1
                    }, {
                        duration: 200,
                        easing: 'easeOut'
                    });
                }
            });
            
            button.addEventListener('mousedown', () => {
                isPressed = true;
                this.animate(button, {
                    scale: 0.95
                }, {
                    duration: 100,
                    easing: 'easeOut'
                });
            });
            
            button.addEventListener('mouseup', () => {
                isPressed = false;
                this.animate(button, {
                    scale: 1.05
                }, {
                    duration: 150,
                    easing: 'easeOutBack'
                });
            });
        });
    }

    setupCardInteractions() {
        document.querySelectorAll('.card, .glass-card, .training-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animate(card, {
                    translateY: -8,
                    scale: 1.02,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }, {
                    duration: 300,
                    easing: 'easeOut'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                this.animate(card, {
                    translateY: 0,
                    scale: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }, {
                    duration: 300,
                    easing: 'easeOut'
                });
            });
        });
    }

    setupInputInteractions() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                this.animate(input, {
                    scale: 1.02,
                    borderColor: '#00D9FF'
                }, {
                    duration: 200,
                    easing: 'easeOut'
                });
            });
            
            input.addEventListener('blur', () => {
                this.animate(input, {
                    scale: 1,
                    borderColor: 'rgba(255,255,255,0.1)'
                }, {
                    duration: 200,
                    easing: 'easeOut'
                });
            });
        });
    }

    setupLoadingAnimations() {
        // Pulse animation for loading elements
        document.querySelectorAll('.loading-spinner, .pulse-animation').forEach(element => {
            this.startPulseAnimation(element);
        });
    }

    startPulseAnimation(element) {
        const pulseAnimation = () => {
            this.animate(element, {
                scale: 1.1,
                opacity: 0.8
            }, {
                duration: 1000,
                easing: 'easeInOut',
                onComplete: () => {
                    this.animate(element, {
                        scale: 1,
                        opacity: 1
                    }, {
                        duration: 1000,
                        easing: 'easeInOut',
                        onComplete: pulseAnimation
                    });
                }
            });
        };
        
        pulseAnimation();
    }

    // Utility Methods
    getCurrentStyles(element, properties) {
        const styles = {};
        const computedStyle = window.getComputedStyle(element);
        
        properties.forEach(property => {
            switch (property) {
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    styles[property] = this.getTransformValue(element, property);
                    break;
                case 'scale':
                    styles[property] = this.getTransformValue(element, 'scaleX') || 1;
                    break;
                case 'rotate':
                    styles[property] = this.getTransformValue(element, 'rotate') || 0;
                    break;
                case 'opacity':
                    styles[property] = parseFloat(computedStyle.opacity) || 1;
                    break;
                case 'brightness':
                    styles[property] = this.getFilterValue(element, 'brightness') || 1;
                    break;
                default:
                    styles[property] = parseFloat(computedStyle[property]) || 0;
            }
        });
        
        return styles;
    }

    getTransformValue(element, property) {
        const transform = element.style.transform || '';
        const match = transform.match(new RegExp(`${property}\\(([^)]+)\\)`));
        return match ? parseFloat(match[1]) : 0;
    }

    getFilterValue(element, property) {
        const filter = element.style.filter || '';
        const match = filter.match(new RegExp(`${property}\\(([^)]+)\\)`));
        return match ? parseFloat(match[1]) : 1;
    }

    setElementProperty(element, property, value) {
        switch (property) {
            case 'translateX':
                this.setTransform(element, 'translateX', `${value}px`);
                break;
            case 'translateY':
                this.setTransform(element, 'translateY', `${value}px`);
                break;
            case 'translateZ':
                this.setTransform(element, 'translateZ', `${value}px`);
                break;
            case 'scale':
                this.setTransform(element, 'scale', value);
                break;
            case 'rotate':
                this.setTransform(element, 'rotate', `${value}deg`);
                break;
            case 'opacity':
                element.style.opacity = value;
                break;
            case 'brightness':
                this.setFilter(element, 'brightness', `${value}`);
                break;
            case 'boxShadow':
                element.style.boxShadow = value;
                break;
            case 'borderColor':
                element.style.borderColor = value;
                break;
            default:
                element.style[property] = typeof value === 'number' ? `${value}px` : value;
        }
    }

    setTransform(element, property, value) {
        const currentTransform = element.style.transform || '';
        const regex = new RegExp(`${property}\\([^)]*\\)`, 'g');
        const newTransform = `${property}(${value})`;
        
        if (regex.test(currentTransform)) {
            element.style.transform = currentTransform.replace(regex, newTransform);
        } else {
            element.style.transform = `${currentTransform} ${newTransform}`.trim();
        }
    }

    setFilter(element, property, value) {
        const currentFilter = element.style.filter || '';
        const regex = new RegExp(`${property}\\([^)]*\\)`, 'g');
        const newFilter = `${property}(${value})`;
        
        if (regex.test(currentFilter)) {
            element.style.filter = currentFilter.replace(regex, newFilter);
        } else {
            element.style.filter = `${currentFilter} ${newFilter}`.trim();
        }
    }

    interpolateValue(start, end, progress) {
        if (typeof start === 'number' && typeof end === 'number') {
            return start + (end - start) * progress;
        }
        return progress < 0.5 ? start : end;
    }

    setupResizeObserver() {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const element = entry.target;
                    if (element.dataset.responsiveAnimation) {
                        this.handleResponsiveAnimation(element);
                    }
                });
            });
        }
    }

    handleResponsiveAnimation(element) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !element.dataset.animated) {
            this.animate(element, {
                opacity: 1,
                translateY: 0
            }, {
                duration: 600,
                easing: 'easeOut'
            });
            element.dataset.animated = 'true';
        }
    }

    // Public API
    createTimeline() {
        return new AnimationTimeline(this);
    }

    addGestureListener(element, gestureType, callback) {
        const listener = (event) => {
            if (event.target === element || element.contains(event.target)) {
                callback(event.detail);
            }
        };
        
        document.addEventListener(`motion:${gestureType}`, listener);
        
        if (!this.gestures.has(element)) {
            this.gestures.set(element, new Map());
        }
        this.gestures.get(element).set(gestureType, listener);
    }

    removeGestureListener(element, gestureType) {
        const elementGestures = this.gestures.get(element);
        if (elementGestures && elementGestures.has(gestureType)) {
            const listener = elementGestures.get(gestureType);
            document.removeEventListener(`motion:${gestureType}`, listener);
            elementGestures.delete(gestureType);
        }
    }

    // Cleanup
    destroy() {
        // Cancel all animations
        this.animationFrames.forEach(frameId => {
            cancelAnimationFrame(frameId);
        });
        this.animationFrames.clear();
        
        // Clear all data structures
        this.animations.clear();
        this.springs.clear();
        this.gestures.clear();
        this.parallaxElements = [];
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        console.log('🎭 Advanced Motion System destroyed');
    }
}

// Animation Timeline for complex sequences
class AnimationTimeline {
    constructor(motionSystem) {
        this.motionSystem = motionSystem;
        this.sequence = [];
        this.currentIndex = 0;
        this.isPlaying = false;
    }

    to(element, properties, options = {}) {
        this.sequence.push({
            type: 'to',
            element: element,
            properties: properties,
            options: options
        });
        return this;
    }

    from(element, properties, options = {}) {
        this.sequence.push({
            type: 'from',
            element: element,
            properties: properties,
            options: options
        });
        return this;
    }

    wait(duration) {
        this.sequence.push({
            type: 'wait',
            duration: duration
        });
        return this;
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentIndex = 0;
        this.playNext();
        return this;
    }

    playNext() {
        if (this.currentIndex >= this.sequence.length) {
            this.isPlaying = false;
            return;
        }

        const step = this.sequence[this.currentIndex];
        this.currentIndex++;

        switch (step.type) {
            case 'to':
                this.motionSystem.animate(step.element, step.properties, {
                    ...step.options,
                    onComplete: () => {
                        if (step.options.onComplete) step.options.onComplete();
                        this.playNext();
                    }
                });
                break;

            case 'from':
                // Set initial values then animate to current values
                const currentStyles = this.motionSystem.getCurrentStyles(step.element, Object.keys(step.properties));
                
                // Set from values
                Object.entries(step.properties).forEach(([prop, value]) => {
                    this.motionSystem.setElementProperty(step.element, prop, value);
                });
                
                // Animate to current values
                this.motionSystem.animate(step.element, currentStyles, {
                    ...step.options,
                    onComplete: () => {
                        if (step.options.onComplete) step.options.onComplete();
                        this.playNext();
                    }
                });
                break;

            case 'wait':
                setTimeout(() => {
                    this.playNext();
                }, step.duration);
                break;
        }
    }
}

// Export for global use
window.AdvancedMotionSystem = AdvancedMotionSystem;
window.AnimationTimeline = AnimationTimeline;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.advancedMotionSystem) {
        window.advancedMotionSystem = new AdvancedMotionSystem();
    }
});
