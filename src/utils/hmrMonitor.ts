// HMR Monitor utility to track and handle Vite HMR issues
export class HMRMonitor {
  private static instance: HMRMonitor;
  private restartCount = 0;
  private lastRestartTime = 0;
  private readonly maxRestarts = 5;
  private readonly restartWindow = 60000; // 1 minute

  static getInstance(): HMRMonitor {
    if (!HMRMonitor.instance) {
      HMRMonitor.instance = new HMRMonitor();
    }
    return HMRMonitor.instance;
  }

  constructor() {
    this.setupHMRListeners();
  }

  private setupHMRListeners() {
    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeUpdate', () => {
        // HMR update received (commented out for production)
      });

      import.meta.hot.on('vite:error', (err) => {
        console.error('HMR Error:', err);
        this.handleHMRError(err);
      });

      import.meta.hot.on('vite:invalidate', () => {
        // HMR page invalidated (commented out for production)
      });
    }
  }

  private handleHMRError(error: any) {
    const now = Date.now();
    
    // Reset restart count if enough time has passed
    if (now - this.lastRestartTime > this.restartWindow) {
      this.restartCount = 0;
    }

    this.restartCount++;
    this.lastRestartTime = now;

    console.warn(`HMR Error #${this.restartCount}:`, error);

    if (this.restartCount >= this.maxRestarts) {
      console.error('Too many HMR errors detected. Consider refreshing the page.');
      // Optionally show a user notification
      this.showUserNotification();
    }
  }

  private showUserNotification() {
    // Create a simple notification for the user
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b35;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: system-ui, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = 'Development server experiencing issues. Consider refreshing the page.';
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  public getStats() {
    return {
      restartCount: this.restartCount,
      lastRestartTime: this.lastRestartTime,
      timeSinceLastRestart: Date.now() - this.lastRestartTime
    };
  }
}

// Initialize the monitor
export const hmrMonitor = HMRMonitor.getInstance();