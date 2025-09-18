// DOM elements
const serverUrlInput = document.getElementById('serverUrl');
const updateLinksBtn = document.getElementById('updateLinks');
const plexLink = document.getElementById('plexLink');
const overseerrLink = document.getElementById('overseerrLink');

// Port configurations
const PLEX_PORT = 32400;
const OVERSEERR_PORT = 5055;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved URL from localStorage if available
    const savedUrl = localStorage.getItem('serverUrl');
    if (savedUrl) {
        serverUrlInput.value = savedUrl;
        updateServiceLinks(savedUrl);
    }
    
    // Add event listeners
    updateLinksBtn.addEventListener('click', handleUpdateLinks);
    serverUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUpdateLinks();
        }
    });
    
    // Auto-update links when URL changes (with debounce)
    let debounceTimer;
    serverUrlInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (serverUrlInput.value.trim()) {
                updateServiceLinks(serverUrlInput.value.trim());
            } else {
                disableServiceLinks();
            }
        }, 500);
    });
});

/**
 * Handle the update links button click
 */
function handleUpdateLinks() {
    const url = serverUrlInput.value.trim();
    
    if (!url) {
        showNotification('Please enter a server URL', 'error');
        return;
    }
    
    if (!isValidUrl(url)) {
        showNotification('Please enter a valid URL (e.g., https://yourdomain.com)', 'error');
        return;
    }
    
    // Save URL to localStorage
    localStorage.setItem('serverUrl', url);
    
    // Update the service links
    updateServiceLinks(url);
    
    showNotification('Links updated successfully!', 'success');
}

/**
 * Update the service links with the provided base URL
 * @param {string} baseUrl - The base server URL
 */
function updateServiceLinks(baseUrl) {
    // Clean and normalize the URL
    const cleanUrl = normalizeUrl(baseUrl);
    
    // Generate service URLs
    const plexUrl = `${cleanUrl}:${PLEX_PORT}`;
    const overseerrUrl = `${cleanUrl}:${OVERSEERR_PORT}`;
    
    // Update link hrefs
    plexLink.href = plexUrl;
    overseerrLink.href = overseerrUrl;
    
    // Enable the links
    plexLink.classList.add('active');
    overseerrLink.classList.add('active');
    
    // Update link text to show URLs
    plexLink.innerHTML = `<i class="fas fa-external-link-alt"></i> Open Plex (${PLEX_PORT})`;
    overseerrLink.innerHTML = `<i class="fas fa-external-link-alt"></i> Open Overseerr (${OVERSEERR_PORT})`;
    
    // Add click tracking
    plexLink.addEventListener('click', () => trackServiceClick('plex'));
    overseerrLink.addEventListener('click', () => trackServiceClick('overseerr'));
}

/**
 * Disable service links when no URL is provided
 */
function disableServiceLinks() {
    plexLink.classList.remove('active');
    overseerrLink.classList.remove('active');
    plexLink.href = '#';
    overseerrLink.href = '#';
    plexLink.innerHTML = `<i class="fas fa-external-link-alt"></i> Open Plex`;
    overseerrLink.innerHTML = `<i class="fas fa-external-link-alt"></i> Open Overseerr`;
}

/**
 * Normalize URL to ensure proper format
 * @param {string} url - The URL to normalize
 * @returns {string} - The normalized URL
 */
function normalizeUrl(url) {
    // Remove trailing slash
    url = url.replace(/\/$/, '');
    
    // Add protocol if missing
    if (!url.match(/^https?:\/\//)) {
        url = 'http://' + url;
    }
    
    return url;
}

/**
 * Validate if the provided string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
    try {
        // Add protocol if missing for validation
        const testUrl = url.match(/^https?:\/\//) ? url : 'http://' + url;
        new URL(testUrl);
        return true;
    } catch (e) {
        return false;
    }
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
    // Ctrl/Cmd + Enter to update links
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleUpdateLinks();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        serverUrlInput.value = '';
        disableServiceLinks();
        localStorage.removeItem('serverUrl');
    }
});

// Add right-click context menu for service links
[plexLink, overseerrLink].forEach(link => {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        if (this.classList.contains('active')) {
            const url = this.href;
            copyToClipboard(url);
        }
    });
});
