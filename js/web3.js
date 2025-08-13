// Web3 Wallet Connection and NFT Verification Module
class NeuroWeb3 {
    constructor() {
        this.web3Modal = null;
        this.provider = null;
        this.signer = null;
        this.userAddress = null;
        this.isConnected = false;
        this.supportedChains = {
            ethereum: { id: 1, name: 'Ethereum', rpc: 'https://eth.llamarpc.com' },
            polygon: { id: 137, name: 'Polygon', rpc: 'https://polygon.llamarpc.com' },
            bsc: { id: 56, name: 'BSC', rpc: 'https://bsc-dataseed.binance.org' }
        };
        this.nftContracts = {
            neuroPass: {
                ethereum: '0x742d35cc6634c0532925a3b8d0ed6fb9a9eb4a5e',
                polygon: '0x742d35cc6634c0532925a3b8d0ed6fb9a9eb4a5e',
                bsc: '0x742d35cc6634c0532925a3b8d0ed6fb9a9eb4a5e'
            }
        };
        this.init();
    }

    async init() {
        try {
            // Initialize Web3Modal
            this.web3Modal = new Web3Modal.default({
                cacheProvider: true,
                providerOptions: {
                    walletconnect: {
                        package: WalletConnectProvider.default,
                        options: {
                            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
                            rpc: {
                                1: this.supportedChains.ethereum.rpc,
                                137: this.supportedChains.polygon.rpc,
                                56: this.supportedChains.bsc.rpc
                            }
                        }
                    },
                    coinbasewallet: {
                        package: CoinbaseWalletSDK,
                        options: {
                            appName: "NeuroX",
                            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
                            chainId: 1,
                            darkMode: false
                        }
                    }
                },
                theme: {
                    background: "rgba(255, 255, 255, 0.95)",
                    main: "#2d2d2d",
                    secondary: "#6c757d",
                    border: "rgba(0, 0, 0, 0.1)",
                    hover: "#f8f9fa"
                }
            });

            // Check if user was previously connected
            if (this.web3Modal.cachedProvider) {
                await this.connect();
            }

            this.setupEventListeners();
        } catch (error) {
            console.error('Web3 initialization failed:', error);
            this.showError('Failed to initialize Web3. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.userAddress = accounts[0];
                    this.updateUI();
                    this.verifyNFTOwnership();
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
        }
    }

    async connect() {
        try {
            this.showLoading('Connecting wallet...');
            
            const provider = await this.web3Modal.connect();
            this.provider = new ethers.providers.Web3Provider(provider);
            this.signer = this.provider.getSigner();
            this.userAddress = await this.signer.getAddress();
            this.isConnected = true;

            this.hideLoading();
            this.updateUI();
            await this.verifyNFTOwnership();
            this.showSuccess(`Connected to ${this.userAddress.slice(0, 6)}...${this.userAddress.slice(-4)}`);
            
            return true;
        } catch (error) {
            this.hideLoading();
            console.error('Connection failed:', error);
            this.showError('Failed to connect wallet. Please try again.');
            return false;
        }
    }

    async disconnect() {
        try {
            if (this.web3Modal) {
                await this.web3Modal.clearCachedProvider();
            }
            
            this.provider = null;
            this.signer = null;
            this.userAddress = null;
            this.isConnected = false;
            
            this.updateUI();
            this.showInfo('Wallet disconnected');
        } catch (error) {
            console.error('Disconnect failed:', error);
        }
    }

    async verifyNFTOwnership() {
        if (!this.isConnected || !this.userAddress) return false;

        try {
            this.showLoading('Verifying NFT ownership...');
            
            const network = await this.provider.getNetwork();
            const chainName = this.getChainName(network.chainId);
            
            if (!chainName || !this.nftContracts.neuroPass[chainName]) {
                this.hideLoading();
                this.updateNFTStatus(false, 'Unsupported network');
                return false;
            }

            const contractAddress = this.nftContracts.neuroPass[chainName];
            const contract = new ethers.Contract(
                contractAddress,
                [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
                    "function tokenURI(uint256 tokenId) view returns (string)"
                ],
                this.provider
            );

            const balance = await contract.balanceOf(this.userAddress);
            const hasNFT = balance.gt(0);

            if (hasNFT) {
                const tokenId = await contract.tokenOfOwnerByIndex(this.userAddress, 0);
                const tokenURI = await contract.tokenURI(tokenId);
                const metadata = await this.fetchNFTMetadata(tokenURI);
                
                this.updateNFTStatus(true, 'NFT Verified', metadata, tokenId.toString());
                this.unlockPremiumFeatures();
            } else {
                this.updateNFTStatus(false, 'No NFT found');
                this.lockPremiumFeatures();
            }

            this.hideLoading();
            return hasNFT;
        } catch (error) {
            this.hideLoading();
            console.error('NFT verification failed:', error);
            this.updateNFTStatus(false, 'Verification failed');
            return false;
        }
    }

    async fetchNFTMetadata(tokenURI) {
        try {
            let url = tokenURI;
            
            // Handle IPFS URLs
            if (tokenURI.startsWith('ipfs://')) {
                url = `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch metadata');
            
            return await response.json();
        } catch (error) {
            console.error('Metadata fetch failed:', error);
            return {
                name: 'NeuroX Premium Pass',
                description: 'Access to premium cognitive training features',
                image: 'https://via.placeholder.com/300x300/A7C7E7/2d2d2d?text=NeuroX+NFT'
            };
        }
    }

    getChainName(chainId) {
        switch (chainId) {
            case 1: return 'ethereum';
            case 137: return 'polygon';
            case 56: return 'bsc';
            default: return null;
        }
    }

    updateUI() {
        const connectBtn = document.getElementById('connectWalletBtn');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');
        
        if (this.isConnected && this.userAddress) {
            connectBtn.style.display = 'none';
            walletInfo.style.display = 'flex';
            walletAddress.textContent = `${this.userAddress.slice(0, 6)}...${this.userAddress.slice(-4)}`;
        } else {
            connectBtn.style.display = 'flex';
            walletInfo.style.display = 'none';
        }
    }

    updateNFTStatus(hasNFT, message, metadata = null, tokenId = null) {
        const nftStatus = document.getElementById('nftStatus');
        const nftBadge = document.getElementById('nftBadge');
        const nftImage = document.getElementById('nftImage');
        const nftName = document.getElementById('nftName');
        const nftDescription = document.getElementById('nftDescription');
        
        if (hasNFT) {
            nftStatus.className = 'nft-status verified';
            nftBadge.innerHTML = '<i class="fas fa-check-circle"></i> Premium Access';
            
            if (metadata) {
                nftImage.src = metadata.image || 'https://via.placeholder.com/100x100/A7C7E7/2d2d2d?text=NFT';
                nftName.textContent = metadata.name || 'NeuroX Premium Pass';
                nftDescription.textContent = metadata.description || 'Access to premium features';
            }
        } else {
            nftStatus.className = 'nft-status unverified';
            nftBadge.innerHTML = '<i class="fas fa-times-circle"></i> No Access';
            nftImage.src = 'https://via.placeholder.com/100x100/FBC4AB/2d2d2d?text=No+NFT';
            nftName.textContent = 'Premium Access Required';
            nftDescription.textContent = message;
        }
    }

    unlockPremiumFeatures() {
        document.querySelectorAll('.premium-feature').forEach(element => {
            element.classList.remove('locked');
            element.classList.add('unlocked');
        });
        
        document.querySelectorAll('.premium-lock').forEach(element => {
            element.style.display = 'none';
        });
        
        this.showSuccess('Premium features unlocked!');
    }

    lockPremiumFeatures() {
        document.querySelectorAll('.premium-feature').forEach(element => {
            element.classList.remove('unlocked');
            element.classList.add('locked');
        });
        
        document.querySelectorAll('.premium-lock').forEach(element => {
            element.style.display = 'block';
        });
    }

    showLoading(message) {
        const loadingModal = document.getElementById('loadingModal');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = message;
        loadingModal.style.display = 'flex';
    }

    hideLoading() {
        const loadingModal = document.getElementById('loadingModal');
        loadingModal.style.display = 'none';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showInfo(message) {
        this.showToast(message, 'info');
    }

    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.web3-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `web3-toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    async switchNetwork(chainId) {
        if (!window.ethereum) return;
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
        } catch (error) {
            console.error('Network switch failed:', error);
            this.showError('Failed to switch network');
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Address copied to clipboard!');
        }).catch(() => {
            this.showError('Failed to copy address');
        });
    }
}

// Initialize Web3 when DOM is loaded
let neuroWeb3;
document.addEventListener('DOMContentLoaded', () => {
    neuroWeb3 = new NeuroWeb3();
});

// Export for global access
window.neuroWeb3 = neuroWeb3;
