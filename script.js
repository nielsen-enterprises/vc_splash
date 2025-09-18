// DOM elements
const serverStatus = document.getElementById('serverStatus');
const plexLink = document.getElementById('plexLink');
const overseerrLink = document.getElementById('overseerrLink');

// Server configuration
const SERVER_IP = '71.73.2.228';
const PLEX_PORT = 32400;
const OVERSEERR_PORT = 5055;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check server status on load
    checkServerStatus();
    
    // Set up periodic status checking (every 30 seconds)
    setInterval(checkServerStatus, 30000);
    
    // Add click tracking for service links
    plexLink.addEventListener('click', () => trackServiceClick('plex'));
    overseerrLink.addEventListener('click', () => trackServiceClick('overseerr'));
});

/**
 * Check server status by attempting to connect to the server
 */
async function checkServerStatus() {
    try {
        // Update status to checking
        updateStatusIndicator('checking', 'Checking server status...');
        
        // Try to fetch from Plex server (this will work if server is up)
        const plexUrl = `http://${SERVER_IP}:${PLEX_PORT}/web/index.html`;
        const response = await fetch(plexUrl, { 
            method: 'HEAD',
            mode: 'no-cors', // This allows cross-origin requests
            cache: 'no-cache'
        });
        
        // If we get here without an error, server is likely up
        updateStatusIndicator('online', 'Server is online');
        
    } catch (error) {
        // Try alternative method - ping the server IP
        try {
            await pingServer();
            updateStatusIndicator('online', 'Server is online');
        } catch (pingError) {
            updateStatusIndicator('offline', 'Server is offline');
        }
    }
}

/**
 * Alternative server check using a simple ping-like approach
 */
async function pingServer() {
    return new Promise((resolve, reject) => {
        // Create an image element to test connectivity
        const img = new Image();
        const timeout = setTimeout(() => {
            reject(new Error('Timeout'));
        }, 5000);
        
        img.onload = () => {
            clearTimeout(timeout);
            resolve();
        };
        
        img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Connection failed'));
        };
        
        // Try to load a small image from the server
        img.src = `http://${SERVER_IP}:${PLEX_PORT}/favicon.ico?t=${Date.now()}`;
    });
}

/**
 * Update the status indicator with new status and message
 * @param {string} status - The status type (online, offline, checking)
 * @param {string} message - The status message
 */
function updateStatusIndicator(status, message) {
    serverStatus.className = `status-indicator status-${status}`;
    serverStatus.innerHTML = `
        <div class="status-dot"></div>
        <span>${message}</span>
    `;
}

/**
 * Manual server status check (can be triggered by user)
 */
function manualStatusCheck() {
    checkServerStatus();
    showNotification('Checking server status...', 'info');
}

/**
 * Show a notification to the user
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

/**
 * Track service clicks for analytics (placeholder for future implementation)
 * @param {string} service - The service name (plex, overseerr)
 */
function trackServiceClick(service) {
    // TODO: Implement analytics tracking
    console.log(`Service clicked: ${service}`);
    
    // For now, just log to console
    // In the future, this could send data to analytics services
}

/**
 * Utility function to copy URL to clipboard
 * @param {string} url - The URL to copy
 */
function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('URL copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy URL', 'error');
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R to refresh server status
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        manualStatusCheck();
    }
    
    // F5 to refresh server status
    if (e.key === 'F5') {
        e.preventDefault();
        manualStatusCheck();
    }
});

// Add right-click context menu for service links
[plexLink, overseerrLink].forEach(link => {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const url = this.href;
        copyToClipboard(url);
    });
});

// Add click handler to status indicator for manual refresh
serverStatus.addEventListener('click', manualStatusCheck);
