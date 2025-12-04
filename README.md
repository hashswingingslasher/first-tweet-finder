# first-tweet-finder
Chrome extension to find the first tweet on any Twitter/X profile
# First Tweet Finder - Chrome Extension

Find the first tweet on any Twitter/X profile automatically without using the API.

## Features

- 📍 One-click scrolling to first tweet
- 🎯 Visual highlighting of oldest tweet  
- ⚙️ Configurable scroll speed and attempts
- ⏱️ Real-time progress indicator
- 📱 Works on both Twitter.com and X.com

## Installation

### For Users
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `first-tweet-finder` folder
6. Navigate to any Twitter profile and click the floating button

### Prerequisites

- Google Chrome 88+ or any Chromium-based browser (Edge, Brave, etc.)
- Active internet connection

## Usage

1. Navigate to any Twitter/X profile (e.g., twitter.com/elonmusk)
2. Look for the floating "📍 First Tweet" button on the right side
3. Click the button to start automatic scrolling
4. Wait for the process to complete (progress shown in overlay)
5. The oldest tweet will be highlighted with a blue border

## How It Works

This extension uses browser automation to:
- Detect Twitter profile pages automatically
- Progressively scroll through the timeline
- Identify the oldest available tweet
- Highlight it for easy viewing

No Twitter API required - pure DOM manipulation.

## Tech Stack

- Vanilla JavaScript (ES6+)
- Chrome Extension Manifest V3
- CSS3 for styling
- MutationObserver API for page change detection

## Acknowledgments

Built upon the scrolling methodology from:
- [eyqs/twitter-scroller](https://github.com/eyqs/twitter-scroller) - Chrome DevTools Protocol scrolling implementation  
- [aniketpatidar/TweetHub](https://github.com/aniketpatidar/TweetHub) - Alternative Twitter functionality concepts

## Known Limitations

- Twitter's anti-bot measures may limit scrolling on some accounts
- Very old accounts with 10,000+ tweets may take several minutes
- Rate limiting may occur if used excessively

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
