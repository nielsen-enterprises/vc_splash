// DOM elements
const plexLink = document.getElementById('plexLink');
const overseerrLink = document.getElementById('overseerrLink');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add click tracking for service links
    plexLink.addEventListener('click', () => trackServiceClick('plex'));
    overseerrLink.addEventListener('click', () => trackServiceClick('overseerr'));
});


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

// Add right-click context menu for service links
[plexLink, overseerrLink].forEach(link => {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const url = this.href;
        copyToClipboard(url);
    });
});
