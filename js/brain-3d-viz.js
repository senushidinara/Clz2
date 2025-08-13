/**
 * Advanced 3D Brain Visualization with Three.js
 * Interactive brain models with neuron networks and cognitive mapping
 */

class Brain3DVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.brainMesh = null;
        this.neurons = [];
        this.connections = [];
        this.animationFrame = null;
        this.interactionMode = 'explore'; // explore, stimulate, analyze
        this.cognitiveRegions = {};
        this.particleSystem = null;
        this.audioContext = null;
        this.initializeVisualization();
    }

    async initializeVisualization() {
        try {
            await this.loadThreeJS();
            this.setupScene();
            this.createBrainModel();
            this.createNeuronNetwork();
            this.setupInteractiveControls();
            this.setupParticleSystem();
            this.animate();
            console.log('3D Brain Visualization initialized successfully');
        } catch (error) {
            console.error('Failed to initialize 3D visualization:', error);
        }
    }

    async loadThreeJS() {
        return new Promise((resolve, reject) => {
            if (window.THREE) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                // Load OrbitControls
                const controlsScript = document.createElement('script');
                controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                controlsScript.onload = resolve;
                controlsScript.onerror = reject;
                document.head.appendChild(controlsScript);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 15);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls setup
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxDistance = 30;
            this.controls.minDistance = 5;
        }

        // Lighting setup
        this.setupLighting();

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(-1, 1, 1);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const colors = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7];
        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 0.5, 20);
            const angle = (i / colors.length) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * 10,
                Math.sin(i) * 5,
                Math.sin(angle) * 10
            );
            this.scene.add(light);
        });
    }

    createBrainModel() {
        // Create main brain geometry
        const brainGeometry = new THREE.SphereGeometry(5, 64, 32);
        
        // Create material with shader for dynamic coloring
        const brainMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                activityLevel: { value: 0.5 },
                cognitiveState: { value: new THREE.Vector3(0.5, 0.5, 0.5) }
            },
            vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    pos += normal * sin(time * 2.0 + position.x * 2.0) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                uniform float time;
                uniform float activityLevel;
                uniform vec3 cognitiveState;
                
                void main() {
                    vec3 color1 = vec3(0.2, 0.3, 0.8);
                    vec3 color2 = vec3(0.8, 0.2, 0.4);
                    vec3 color3 = vec3(0.2, 0.8, 0.3);
                    
                    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    float activity = sin(time * 3.0 + vPosition.x * 5.0) * 0.5 + 0.5;
                    
                    vec3 finalColor = mix(color1, color2, activity * activityLevel);
                    finalColor = mix(finalColor, color3, cognitiveState.r);
                    finalColor += fresnel * 0.3;
                    
                    gl_FragColor = vec4(finalColor, 0.8);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });

        this.brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
        this.brainMesh.castShadow = true;
        this.brainMesh.receiveShadow = true;
        this.scene.add(this.brainMesh);

        // Create cognitive regions
        this.createCognitiveRegions();
    }

    createCognitiveRegions() {
        const regions = [
            { name: 'frontal', position: [0, 2, 3], color: 0xff6b6b, function: 'Executive' },
            { name: 'parietal', position: [-2, 1, -1], color: 0x4ecdc4, function: 'Spatial' },
            { name: 'temporal', position: [3, -1, 0], color: 0x45b7d1, function: 'Memory' },
            { name: 'occipital', position: [0, -1, -3], color: 0x96ceb4, function: 'Visual' },
            { name: 'cerebellum', position: [0, -3, -1], color: 0xffeaa7, function: 'Motor' }
        ];

        regions.forEach(region => {
            const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: region.color,
                transparent: true,
                opacity: 0.7,
                emissive: region.color,
                emissiveIntensity: 0.2
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...region.position);
            mesh.userData = {
                region: region.name,
                function: region.function,
                activity: 0.5
            };

            // Add interaction
            mesh.addEventListener = (event, callback) => {
                this.renderer.domElement.addEventListener(event, (e) => {
                    const raycaster = new THREE.Raycaster();
                    const mouse = new THREE.Vector2();
                    
                    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                    
                    raycaster.setFromCamera(mouse, this.camera);
                    const intersects = raycaster.intersectObject(mesh);
                    
                    if (intersects.length > 0) {
                        callback(region);
                    }
                });
            };

            this.cognitiveRegions[region.name] = mesh;
            this.scene.add(mesh);
        });
    }

    createNeuronNetwork() {
        const neuronCount = 100;
        const radius = 7;

        // Create neurons
        for (let i = 0; i < neuronCount; i++) {
            const neuron = this.createNeuron();
            
            // Random position in spherical distribution
            const phi = Math.acos(-1 + (2 * i) / neuronCount);
            const theta = Math.sqrt(neuronCount * Math.PI) * phi;
            
            neuron.position.set(
                radius * Math.cos(theta) * Math.sin(phi),
                radius * Math.sin(theta) * Math.sin(phi),
                radius * Math.cos(phi)
            );

            this.neurons.push(neuron);
            this.scene.add(neuron);
        }

        // Create connections
        this.createNeuronConnections();
    }

    createNeuron() {
        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0x222222,
            transparent: true,
            opacity: 0.8
        });

        const neuron = new THREE.Mesh(geometry, material);
        neuron.userData = {
            activity: Math.random(),
            connections: [],
            lastFired: 0
        };

        return neuron;
    }

    createNeuronConnections() {
        const connectionCount = 200;
        
        for (let i = 0; i < connectionCount; i++) {
            const neuron1 = this.neurons[Math.floor(Math.random() * this.neurons.length)];
            const neuron2 = this.neurons[Math.floor(Math.random() * this.neurons.length)];
            
            if (neuron1 !== neuron2) {
                const connection = this.createConnection(neuron1.position, neuron2.position);
                this.connections.push(connection);
                this.scene.add(connection);
                
                neuron1.userData.connections.push(neuron2);
                neuron2.userData.connections.push(neuron1);
            }
        }
    }

    createConnection(pos1, pos2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([pos1, pos2]);
        const material = new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.3
        });

        const line = new THREE.Line(geometry, material);
        line.userData = {
            activity: 0,
            pulse: 0
        };

        return line;
    }

    setupParticleSystem() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position around brain
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // Random color
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.7, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x) * 0.2);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - (dist * 2.0);
                    gl_FragColor = vec4(vColor, alpha * 0.6);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }

    setupInteractiveControls() {
        // Mouse interaction
        this.renderer.domElement.addEventListener('click', (event) => {
            this.handleMouseClick(event);
        });

        // Keyboard controls
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        // Touch controls for mobile
        this.renderer.domElement.addEventListener('touchstart', (event) => {
            this.handleTouchStart(event);
        });
    }

    handleMouseClick(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, this.camera);
        
        // Check for brain region intersections
        const regionIntersects = raycaster.intersectObjects(Object.values(this.cognitiveRegions));
        if (regionIntersects.length > 0) {
            this.stimulateRegion(regionIntersects[0].object.userData.region);
        }

        // Check for neuron intersections
        const neuronIntersects = raycaster.intersectObjects(this.neurons);
        if (neuronIntersects.length > 0) {
            this.fireNeuron(neuronIntersects[0].object);
        }
    }

    handleKeyDown(event) {
        switch (event.key) {
            case '1':
                this.setInteractionMode('explore');
                break;
            case '2':
                this.setInteractionMode('stimulate');
                break;
            case '3':
                this.setInteractionMode('analyze');
                break;
            case ' ':
                this.simulateThought();
                break;
            case 'r':
                this.resetVisualization();
                break;
        }
    }

    handleTouchStart(event) {
        if (event.touches.length === 1) {
            // Single touch - stimulate
            this.handleMouseClick(event.touches[0]);
        } else if (event.touches.length === 2) {
            // Double touch - simulate thought
            this.simulateThought();
        }
    }

    setInteractionMode(mode) {
        this.interactionMode = mode;
        console.log(`Interaction mode set to: ${mode}`);
        
        // Update UI indication
        if (window.showToast) {
            window.showToast(`Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, 'info');
        }
    }

    stimulateRegion(regionName) {
        const region = this.cognitiveRegions[regionName];
        if (!region) return;

        // Visual stimulation
        region.material.emissiveIntensity = 1.0;
        region.scale.setScalar(1.2);

        // Animate back to normal
        const animate = () => {
            region.material.emissiveIntensity = Math.max(0.2, region.material.emissiveIntensity - 0.02);
            region.scale.setScalar(Math.max(1.0, region.scale.x - 0.01));
            
            if (region.material.emissiveIntensity > 0.2) {
                requestAnimationFrame(animate);
            }
        };
        animate();

        // Trigger related neurons
        this.neurons.forEach(neuron => {
            const distance = neuron.position.distanceTo(region.position);
            if (distance < 3) {
                this.fireNeuron(neuron, 0.5);
            }
        });

        console.log(`Stimulated ${regionName} region`);
    }

    fireNeuron(neuron, intensity = 1.0) {
        neuron.userData.activity = intensity;
        neuron.userData.lastFired = Date.now();
        
        // Visual feedback
        neuron.material.emissive.setHex(0x00ff00);
        neuron.scale.setScalar(1.5);

        // Propagate to connected neurons
        setTimeout(() => {
            neuron.userData.connections.forEach(connectedNeuron => {
                if (Math.random() < 0.3) {
                    this.fireNeuron(connectedNeuron, intensity * 0.8);
                }
            });
        }, 100);

        // Reset visual state
        setTimeout(() => {
            neuron.material.emissive.setHex(0x222222);
            neuron.scale.setScalar(1.0);
        }, 300);
    }

    simulateThought() {
        // Simulate a thought pattern across multiple regions
        const thoughtPattern = [
            { region: 'frontal', delay: 0 },
            { region: 'parietal', delay: 200 },
            { region: 'temporal', delay: 400 },
            { region: 'occipital', delay: 600 }
        ];

        thoughtPattern.forEach(({ region, delay }) => {
            setTimeout(() => {
                this.stimulateRegion(region);
            }, delay);
        });

        // Create thought wave effect
        this.createThoughtWave();
    }

    createThoughtWave() {
        const waveGeometry = new THREE.RingGeometry(0.1, 8, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });

        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.position.copy(this.brainMesh.position);
        this.scene.add(wave);

        // Animate wave expansion
        const startTime = Date.now();
        const duration = 2000;

        const animateWave = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                wave.scale.setScalar(1 + progress * 5);
                wave.material.opacity = 0.5 * (1 - progress);
                requestAnimationFrame(animateWave);
            } else {
                this.scene.remove(wave);
            }
        };

        animateWave();
    }

    resetVisualization() {
        // Reset all neurons
        this.neurons.forEach(neuron => {
            neuron.userData.activity = 0;
            neuron.material.emissive.setHex(0x222222);
            neuron.scale.setScalar(1.0);
        });

        // Reset regions
        Object.values(this.cognitiveRegions).forEach(region => {
            region.material.emissiveIntensity = 0.2;
            region.scale.setScalar(1.0);
        });

        console.log('Visualization reset');
    }

    updateCognitiveState(state) {
        // Update brain shader uniforms
        if (this.brainMesh && this.brainMesh.material.uniforms) {
            this.brainMesh.material.uniforms.cognitiveState.value.set(
                state.focus || 0.5,
                state.creativity || 0.5,
                state.memory || 0.5
            );
            this.brainMesh.material.uniforms.activityLevel.value = state.activity || 0.5;
        }
    }

    animate() {
        this.animationFrame = requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Update brain material
        if (this.brainMesh && this.brainMesh.material.uniforms) {
            this.brainMesh.material.uniforms.time.value = time;
        }

        // Update particle system
        if (this.particleSystem && this.particleSystem.material.uniforms) {
            this.particleSystem.material.uniforms.time.value = time;
        }

        // Rotate brain slowly
        if (this.brainMesh) {
            this.brainMesh.rotation.y += 0.005;
        }

        // Update neuron activities
        this.neurons.forEach(neuron => {
            const age = Date.now() - neuron.userData.lastFired;
            if (age > 1000) {
                neuron.userData.activity *= 0.99;
            }
            
            // Spontaneous firing
            if (Math.random() < 0.001 && neuron.userData.activity < 0.1) {
                this.fireNeuron(neuron, 0.3);
            }
        });

        // Update connections
        this.connections.forEach(connection => {
            connection.userData.activity *= 0.95;
            connection.material.opacity = 0.1 + connection.userData.activity * 0.5;
        });

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    exportVisualizationData() {
        return {
            neurons: this.neurons.map(n => ({
                position: n.position.toArray(),
                activity: n.userData.activity
            })),
            regions: Object.keys(this.cognitiveRegions).map(key => ({
                name: key,
                activity: this.cognitiveRegions[key].userData.activity,
                function: this.cognitiveRegions[key].userData.function
            })),
            timestamp: Date.now()
        };
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.container && this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Global instance
window.Brain3DVisualization = Brain3DVisualization;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('brain-3d-container');
    if (container) {
        window.brain3DViz = new Brain3DVisualization('brain-3d-container');
    }
});
