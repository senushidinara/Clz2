/**
 * Advanced Data Visualization System
 * Features: Observable Plot, Deck.gl GPU Instancing, Real-time EEG, 3D Brain Maps
 */

class AdvancedDataVisualization {
    constructor() {
        this.isInitialized = false;
        this.charts = new Map();
        this.deckInstance = null;
        this.realTimeData = {
            eeg: [],
            cognitive: [],
            performance: [],
            brainwaves: {
                delta: [],
                theta: [],
                alpha: [],
                beta: [],
                gamma: []
            }
        };
        this.animationFrames = new Map();
        this.dataStreams = new Map();
        
        this.init();
    }

    async init() {
        try {
            console.log('📊 Initializing Advanced Data Visualization...');
            
            // Initialize data streams
            this.initializeDataStreams();
            
            // Setup real-time data generation
            this.startDataGeneration();
            
            this.isInitialized = true;
            console.log('✅ Advanced Data Visualization initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize data visualization:', error);
        }
    }

    initializeDataStreams() {
        // EEG Data Stream
        this.dataStreams.set('eeg', {
            frequency: 256, // 256 Hz sampling rate
            channels: 8,
            bufferSize: 1024,
            data: Array(8).fill().map(() => [])
        });

        // Cognitive Performance Stream
        this.dataStreams.set('cognitive', {
            frequency: 1, // 1 Hz update rate
            metrics: ['attention', 'memory', 'processing_speed', 'flexibility'],
            data: []
        });

        // Brainwave Bands Stream
        this.dataStreams.set('brainwaves', {
            frequency: 10, // 10 Hz update rate
            bands: ['delta', 'theta', 'alpha', 'beta', 'gamma'],
            data: {
                delta: [],
                theta: [],
                alpha: [],
                beta: [],
                gamma: []
            }
        });
    }

    startDataGeneration() {
        // Generate realistic EEG data
        setInterval(() => {
            this.generateEEGData();
        }, 1000 / 256); // 256 Hz

        // Generate cognitive performance data
        setInterval(() => {
            this.generateCognitiveData();
        }, 1000); // 1 Hz

        // Generate brainwave band data
        setInterval(() => {
            this.generateBrainwaveData();
        }, 100); // 10 Hz
    }

    generateEEGData() {
        const timestamp = Date.now();
        const eegStream = this.dataStreams.get('eeg');
        
        for (let channel = 0; channel < eegStream.channels; channel++) {
            // Generate realistic EEG signal
            const baseFreq = 10 + channel * 2; // Different base frequencies per channel
            const amplitude = 50 + Math.random() * 25;
            const noise = (Math.random() - 0.5) * 10;
            
            const value = amplitude * Math.sin(2 * Math.PI * baseFreq * timestamp / 1000) + noise;
            
            eegStream.data[channel].push({
                timestamp: timestamp,
                value: value,
                channel: channel
            });
            
            // Keep buffer size manageable
            if (eegStream.data[channel].length > eegStream.bufferSize) {
                eegStream.data[channel].shift();
            }
        }
    }

    generateCognitiveData() {
        const timestamp = Date.now();
        const cognitiveStream = this.dataStreams.get('cognitive');
        
        const data = {
            timestamp: timestamp,
            attention: 70 + Math.sin(timestamp / 10000) * 15 + Math.random() * 10,
            memory: 80 + Math.cos(timestamp / 8000) * 12 + Math.random() * 8,
            processing_speed: 75 + Math.sin(timestamp / 12000) * 20 + Math.random() * 12,
            flexibility: 85 + Math.cos(timestamp / 15000) * 10 + Math.random() * 6
        };
        
        cognitiveStream.data.push(data);
        
        // Keep last 100 data points
        if (cognitiveStream.data.length > 100) {
            cognitiveStream.data.shift();
        }
    }

    generateBrainwaveData() {
        const timestamp = Date.now();
        const brainwaveStream = this.dataStreams.get('brainwaves');
        
        // Generate band powers with realistic relationships
        const attention = Math.max(0, 50 + Math.sin(timestamp / 5000) * 25);
        const relaxation = Math.max(0, 100 - attention + Math.random() * 20);
        
        const bandData = {
            timestamp: timestamp,
            delta: Math.max(0, 20 + relaxation * 0.3 + Math.random() * 10),
            theta: Math.max(0, 25 + relaxation * 0.2 + Math.random() * 8),
            alpha: Math.max(0, 30 + relaxation * 0.4 + Math.random() * 12),
            beta: Math.max(0, 35 + attention * 0.5 + Math.random() * 15),
            gamma: Math.max(0, 15 + attention * 0.3 + Math.random() * 8)
        };
        
        Object.keys(bandData).forEach(band => {
            if (band !== 'timestamp') {
                brainwaveStream.data[band].push({
                    timestamp: timestamp,
                    value: bandData[band]
                });
                
                // Keep buffer size manageable
                if (brainwaveStream.data[band].length > 200) {
                    brainwaveStream.data[band].shift();
                }
            }
        });
    }

    createEEGChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof Plot === 'undefined') return;

        const eegData = this.dataStreams.get('eeg');
        const flatData = [];
        
        // Flatten multi-channel data for plotting
        eegData.data.forEach((channelData, channelIndex) => {
            channelData.forEach(point => {
                flatData.push({
                    time: new Date(point.timestamp),
                    value: point.value + channelIndex * 100, // Offset channels
                    channel: `Ch${channelIndex + 1}`
                });
            });
        });

        const chart = Plot.plot({
            title: "Real-time EEG Signal",
            width: container.clientWidth,
            height: 400,
            marginLeft: 60,
            x: {
                type: "time",
                label: "Time"
            },
            y: {
                label: "Amplitude (μV)",
                grid: true
            },
            color: {
                legend: true,
                scheme: "category10"
            },
            marks: [
                Plot.line(flatData, {
                    x: "time",
                    y: "value",
                    stroke: "channel",
                    strokeWidth: 1.5
                })
            ]
        });

        container.innerHTML = '';
        container.appendChild(chart);
        
        this.charts.set(containerId, {
            type: 'eeg',
            element: chart,
            lastUpdate: Date.now()
        });
    }

    createBrainwaveChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof Plot === 'undefined') return;

        const brainwaveData = this.dataStreams.get('brainwaves');
        const flatData = [];
        
        // Get latest values for each band
        Object.keys(brainwaveData.data).forEach(band => {
            if (brainwaveData.data[band].length > 0) {
                const latest = brainwaveData.data[band].slice(-1)[0];
                flatData.push({
                    band: band.charAt(0).toUpperCase() + band.slice(1),
                    value: latest.value,
                    color: this.getBandColor(band)
                });
            }
        });

        const chart = Plot.plot({
            title: "Brainwave Bands Distribution",
            width: container.clientWidth,
            height: 300,
            marginLeft: 80,
            x: {
                label: "Power (μV²)",
                domain: [0, 100]
            },
            y: {
                label: "Frequency Band"
            },
            marks: [
                Plot.barX(flatData, {
                    x: "value",
                    y: "band",
                    fill: "color",
                    tip: true
                }),
                Plot.text(flatData, {
                    x: d => d.value + 2,
                    y: "band",
                    text: d => `${d.value.toFixed(1)}`,
                    textAnchor: "start",
                    fontSize: 12
                })
            ]
        });

        container.innerHTML = '';
        container.appendChild(chart);
        
        this.charts.set(containerId, {
            type: 'brainwave',
            element: chart,
            lastUpdate: Date.now()
        });
    }

    createCognitivePerformanceChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof Plot === 'undefined') return;

        const cognitiveData = this.dataStreams.get('cognitive');
        const flatData = [];
        
        // Flatten cognitive metrics over time
        cognitiveData.data.forEach(point => {
            ['attention', 'memory', 'processing_speed', 'flexibility'].forEach(metric => {
                flatData.push({
                    time: new Date(point.timestamp),
                    value: point[metric],
                    metric: metric.replace('_', ' ').toUpperCase()
                });
            });
        });

        const chart = Plot.plot({
            title: "Cognitive Performance Metrics",
            width: container.clientWidth,
            height: 350,
            marginLeft: 60,
            x: {
                type: "time",
                label: "Time"
            },
            y: {
                label: "Performance Score",
                domain: [0, 100],
                grid: true
            },
            color: {
                legend: true,
                scheme: "observable10"
            },
            marks: [
                Plot.line(flatData, {
                    x: "time",
                    y: "value",
                    stroke: "metric",
                    strokeWidth: 2,
                    curve: "catmull-rom"
                }),
                Plot.dot(flatData.filter((d, i) => i % 10 === 0), {
                    x: "time",
                    y: "value",
                    fill: "metric",
                    r: 3
                })
            ]
        });

        container.innerHTML = '';
        container.appendChild(chart);
        
        this.charts.set(containerId, {
            type: 'cognitive',
            element: chart,
            lastUpdate: Date.now()
        });
    }

    create3DBrainActivity(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof deck === 'undefined') return;

        // Generate 3D brain activity data
        const brainRegions = this.generate3DBrainData();
        
        // Create Deck.gl instance
        this.deckInstance = new deck.DeckGL({
            container: container,
            initialViewState: {
                longitude: 0,
                latitude: 0,
                zoom: 5,
                pitch: 45,
                bearing: 0
            },
            controller: true,
            layers: [
                new deck.ScatterplotLayer({
                    id: 'brain-regions',
                    data: brainRegions,
                    getPosition: d => [d.x, d.y, d.z],
                    getRadius: d => d.activity * 50,
                    getFillColor: d => this.getActivityColor(d.activity),
                    radiusScale: 1,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 50,
                    pickable: true,
                    onHover: this.onBrainRegionHover.bind(this)
                }),
                new deck.LineLayer({
                    id: 'neural-connections',
                    data: this.generateNeuralConnections(brainRegions),
                    getSourcePosition: d => d.source,
                    getTargetPosition: d => d.target,
                    getColor: d => [100 + d.strength * 155, 150, 255, 128],
                    getWidth: d => d.strength * 5,
                    pickable: true
                })
            ]
        });

        this.charts.set(containerId, {
            type: '3d-brain',
            element: this.deckInstance,
            lastUpdate: Date.now()
        });
    }

    generate3DBrainData() {
        const regions = [
            { name: 'Frontal Cortex', x: 0, y: 50, z: 0, baseActivity: 0.7 },
            { name: 'Parietal Cortex', x: -30, y: 0, z: -20, baseActivity: 0.6 },
            { name: 'Temporal Cortex', x: 40, y: -10, z: 0, baseActivity: 0.8 },
            { name: 'Occipital Cortex', x: 0, y: -40, z: -30, baseActivity: 0.5 },
            { name: 'Cerebellum', x: 0, y: -30, z: -50, baseActivity: 0.9 },
            { name: 'Hippocampus', x: 25, y: -5, z: -10, baseActivity: 0.8 },
            { name: 'Amygdala', x: 20, y: 0, z: -5, baseActivity: 0.4 },
            { name: 'Thalamus', x: 0, y: 0, z: 0, baseActivity: 0.7 }
        ];

        return regions.map(region => ({
            ...region,
            activity: Math.max(0.1, region.baseActivity + (Math.random() - 0.5) * 0.4),
            id: region.name.toLowerCase().replace(' ', '_')
        }));
    }

    generateNeuralConnections(regions) {
        const connections = [];
        
        for (let i = 0; i < regions.length; i++) {
            for (let j = i + 1; j < regions.length; j++) {
                if (Math.random() < 0.3) { // 30% chance of connection
                    connections.push({
                        source: [regions[i].x, regions[i].y, regions[i].z],
                        target: [regions[j].x, regions[j].y, regions[j].z],
                        strength: Math.random() * 0.8 + 0.2
                    });
                }
            }
        }
        
        return connections;
    }

    getActivityColor(activity) {
        // Color based on activity level
        const intensity = Math.floor(activity * 255);
        return [intensity, 100, 255 - intensity, 180];
    }

    getBandColor(band) {
        const colors = {
            delta: '#FF6B6B',
            theta: '#4ECDC4',
            alpha: '#45B7D1',
            beta: '#96CEB4',
            gamma: '#FFEAA7'
        };
        return colors[band] || '#CCCCCC';
    }

    onBrainRegionHover(info) {
        if (info.object) {
            const tooltip = document.getElementById('deck-tooltip') || this.createTooltip();
            tooltip.style.display = 'block';
            tooltip.style.left = info.x + 'px';
            tooltip.style.top = info.y + 'px';
            tooltip.innerHTML = `
                <strong>${info.object.name}</strong><br>
                Activity: ${(info.object.activity * 100).toFixed(1)}%
            `;
        } else {
            const tooltip = document.getElementById('deck-tooltip');
            if (tooltip) tooltip.style.display = 'none';
        }
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'deck-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    createComplexHeatmap(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container || typeof Plot === 'undefined') return;

        // Generate correlation matrix data
        const correlationData = this.generateCorrelationMatrix();
        
        const chart = Plot.plot({
            title: "Cognitive Metrics Correlation Heatmap",
            width: container.clientWidth,
            height: 400,
            padding: 60,
            x: {
                label: "Metric",
                tickRotate: -45
            },
            y: {
                label: "Metric"
            },
            color: {
                scheme: "RdBu",
                domain: [-1, 1],
                legend: true
            },
            marks: [
                Plot.cell(correlationData, {
                    x: "metric1",
                    y: "metric2",
                    fill: "correlation",
                    tip: true
                }),
                Plot.text(correlationData, {
                    x: "metric1",
                    y: "metric2",
                    text: d => d.correlation.toFixed(2),
                    fontSize: 10
                })
            ]
        });

        container.innerHTML = '';
        container.appendChild(chart);
        
        this.charts.set(containerId, {
            type: 'heatmap',
            element: chart,
            lastUpdate: Date.now()
        });
    }

    generateCorrelationMatrix() {
        const metrics = ['Attention', 'Memory', 'Speed', 'Flexibility', 'Creativity'];
        const correlationData = [];
        
        metrics.forEach(metric1 => {
            metrics.forEach(metric2 => {
                correlationData.push({
                    metric1: metric1,
                    metric2: metric2,
                    correlation: metric1 === metric2 ? 1 : (Math.random() - 0.5) * 2
                });
            });
        });
        
        return correlationData;
    }

    createTimeSeriesAnalysis(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof Plot === 'undefined') return;

        // Generate time series with trend and seasonality
        const timeSeriesData = this.generateTimeSeriesData();
        
        const chart = Plot.plot({
            title: "Cognitive Performance Trend Analysis",
            width: container.clientWidth,
            height: 400,
            marginLeft: 60,
            x: {
                type: "time",
                label: "Date"
            },
            y: {
                label: "Performance Score",
                grid: true
            },
            marks: [
                // Raw data
                Plot.line(timeSeriesData.raw, {
                    x: "date",
                    y: "value",
                    stroke: "#ccc",
                    strokeOpacity: 0.5
                }),
                // Trend line
                Plot.line(timeSeriesData.trend, {
                    x: "date",
                    y: "value",
                    stroke: "#007bff",
                    strokeWidth: 3
                }),
                // Confidence interval
                Plot.area(timeSeriesData.confidence, {
                    x: "date",
                    y1: "lower",
                    y2: "upper",
                    fill: "#007bff",
                    fillOpacity: 0.2
                })
            ]
        });

        container.innerHTML = '';
        container.appendChild(chart);
        
        this.charts.set(containerId, {
            type: 'timeseries',
            element: chart,
            lastUpdate: Date.now()
        });
    }

    generateTimeSeriesData() {
        const days = 30;
        const data = {
            raw: [],
            trend: [],
            confidence: []
        };
        
        for (let i = 0; i < days; i++) {
            const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
            const trend = 70 + i * 0.5; // Slight upward trend
            const seasonal = 10 * Math.sin(2 * Math.PI * i / 7); // Weekly pattern
            const noise = (Math.random() - 0.5) * 15;
            const value = trend + seasonal + noise;
            
            data.raw.push({ date, value });
            data.trend.push({ date, value: trend });
            data.confidence.push({
                date,
                lower: trend - 10,
                upper: trend + 10
            });
        }
        
        return data;
    }

    updateChart(chartId) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const timeSinceUpdate = Date.now() - chart.lastUpdate;
        
        // Update only if enough time has passed (throttling)
        if (timeSinceUpdate < 100) return;

        switch (chart.type) {
            case 'eeg':
                this.createEEGChart(chartId);
                break;
            case 'brainwave':
                this.createBrainwaveChart(chartId);
                break;
            case 'cognitive':
                this.createCognitivePerformanceChart(chartId);
                break;
            case '3d-brain':
                this.update3DBrainActivity(chartId);
                break;
        }
    }

    update3DBrainActivity(chartId) {
        if (!this.deckInstance) return;

        // Update brain activity data
        const brainRegions = this.generate3DBrainData();
        
        this.deckInstance.setProps({
            layers: [
                new deck.ScatterplotLayer({
                    id: 'brain-regions',
                    data: brainRegions,
                    getPosition: d => [d.x, d.y, d.z],
                    getRadius: d => d.activity * 50,
                    getFillColor: d => this.getActivityColor(d.activity),
                    radiusScale: 1,
                    radiusMinPixels: 5,
                    radiusMaxPixels: 50,
                    pickable: true,
                    onHover: this.onBrainRegionHover.bind(this)
                }),
                new deck.LineLayer({
                    id: 'neural-connections',
                    data: this.generateNeuralConnections(brainRegions),
                    getSourcePosition: d => d.source,
                    getTargetPosition: d => d.target,
                    getColor: d => [100 + d.strength * 155, 150, 255, 128],
                    getWidth: d => d.strength * 5,
                    pickable: true
                })
            ]
        });

        this.charts.get(chartId).lastUpdate = Date.now();
    }

    startRealTimeUpdates() {
        // Update charts periodically
        const updateInterval = setInterval(() => {
            this.charts.forEach((chart, chartId) => {
                this.updateChart(chartId);
            });
        }, 1000); // Update every second

        // Store interval for cleanup
        this.updateInterval = updateInterval;
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    exportChartData(chartId, format = 'json') {
        const chart = this.charts.get(chartId);
        if (!chart) return null;

        let data;
        
        switch (chart.type) {
            case 'eeg':
                data = this.dataStreams.get('eeg').data;
                break;
            case 'brainwave':
                data = this.dataStreams.get('brainwaves').data;
                break;
            case 'cognitive':
                data = this.dataStreams.get('cognitive').data;
                break;
            default:
                return null;
        }

        if (format === 'csv') {
            return this.convertToCSV(data);
        }
        
        return JSON.stringify(data, null, 2);
    }

    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                return typeof value === 'string' ? `"${value}"` : value;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    }

    getDataStream(streamId) {
        return this.dataStreams.get(streamId);
    }

    destroy() {
        this.stopRealTimeUpdates();
        
        if (this.deckInstance) {
            this.deckInstance.finalize();
        }
        
        this.charts.clear();
        this.dataStreams.clear();
        
        // Clear animation frames
        this.animationFrames.forEach(frame => {
            cancelAnimationFrame(frame);
        });
        this.animationFrames.clear();
    }
}

// Export for global use
window.AdvancedDataVisualization = AdvancedDataVisualization;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!window.advancedDataViz) {
        window.advancedDataViz = new AdvancedDataVisualization();
    }
});
