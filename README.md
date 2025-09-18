# Media Server Portal

A modern, responsive static website for accessing your Plex Media Server and Overseerr portal. This site is designed to be hosted on GitHub Pages and provides easy access to your media services.

## Features

- 🎨 **Modern Design**: Clean, responsive interface with gradient backgrounds and glassmorphism effects
- 🔗 **Dynamic Links**: Automatically generates links to your Plex server (port 32400) and Overseerr portal (port 5055)
- 💾 **Persistent Storage**: Remembers your server URL using localStorage
- 📱 **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: 
  - `Enter` in URL field to update links
  - `Ctrl/Cmd + Enter` to update links
  - `Escape` to clear the URL field
- 🖱️ **Right-click to Copy**: Right-click on service links to copy URLs to clipboard

## How to Use

1. **Enter Server URL**: Input your server's base URL (e.g., `https://yourdomain.com` or `192.168.1.100`)
2. **Update Links**: Click the "Update Links" button or press Enter
3. **Access Services**: Click on the Plex or Overseerr cards to open the respective services

## GitHub Pages Setup

1. **Fork or Clone**: Fork this repository or clone it to your GitHub account
2. **Enable Pages**: Go to your repository settings → Pages
3. **Select Source**: Choose "Deploy from a branch" and select `main` branch
4. **Access**: Your site will be available at `https://yourusername.github.io/repository-name`

## Customization

### Changing Ports
To modify the default ports, edit the constants in `script.js`:
```javascript
const PLEX_PORT = 32400;      // Change to your Plex port
const OVERSEERR_PORT = 5055;  // Change to your Overseerr port
```

### Styling
The CSS is modular and easy to customize. Key sections:
- **Colors**: Modify the CSS custom properties at the top of `styles.css`
- **Layout**: Adjust grid layouts and spacing in the respective sections
- **Typography**: Change fonts by updating the Google Fonts import in `index.html`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- This is a client-side only application
- No server-side processing or data storage
- URLs are stored locally in the browser's localStorage
- All links open in new tabs for security

## Future Enhancements

- [ ] NGINX configuration for direct routing
- [ ] Service status checking
- [ ] Multiple server support
- [ ] Custom service additions
- [ ] Dark/light theme toggle
- [ ] Analytics integration

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
