{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 (function() \{\
    'use strict';\
    \
    // DOM elements\
    const statusDot = document.getElementById('statusDot');\
    const statusText = document.getElementById('statusText');\
    const currentPage = document.getElementById('currentPage');\
    const scrollBtn = document.getElementById('scrollBtn');\
    const progressSection = document.getElementById('progressSection');\
    const progressFill = document.getElementById('progressFill');\
    const progressText = document.getElementById('progressText');\
    const maxAttemptsSelect = document.getElementById('maxAttempts');\
    const scrollDelaySelect = document.getElementById('scrollDelay');\
    \
    // Check current tab and update UI\
    async function checkCurrentTab() \{\
        try \{\
            const [tab] = await chrome.tabs.query(\{ active: true, currentWindow: true \});\
            \
            if (tab && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) \{\
                const path = new URL(tab.url).pathname;\
                const isProfile = path.match(/^\\\\/[a-zA-Z0-9_]+\\\\/?$/) || \
                                  path.match(/^\\\\/[a-zA-Z0-9_]+\\\\/(with_replies|media|likes)\\\\/?$/);\
                \
                if (isProfile) \{\
                    setStatus('ready', 'Ready to scroll');\
                    const username = path.split('/')[1];\
                    currentPage.innerHTML = `\
                        <span class="page-icon">\uc0\u55357 \u56358 </span>\
                        <span class="page-text">@$\{username\} profile</span>\
                    `;\
                    scrollBtn.disabled = false;\
                \} else \{\
                    setStatus('warning', 'Not on profile page');\
                    currentPage.innerHTML = `\
                        <span class="page-icon">\uc0\u9888 \u65039 </span>\
                        <span class="page-text">Navigate to a Twitter profile</span>\
                    `;\
                    scrollBtn.disabled = true;\
                \}\
            \} else \{\
                setStatus('inactive', 'Not on Twitter');\
                currentPage.innerHTML = `\
                    <span class="page-icon">\uc0\u10060 </span>\
                    <span class="page-text">Visit twitter.com or x.com</span>\
                `;\
                scrollBtn.disabled = true;\
            \}\
        \} catch (error) \{\
            console.error('Error checking current tab:', error);\
            setStatus('error', 'Error checking page');\
            scrollBtn.disabled = true;\
        \}\
    \}\
    \
    // Set status indicator\
    function setStatus(type, text) \{\
        statusDot.className = `status-dot status-$\{type\}`;\
        statusText.textContent = text;\
    \}\
    \
    // Handle scroll button click\
    async function handleScrollClick() \{\
        try \{\
            setStatus('active', 'Scrolling...');\
            scrollBtn.disabled = true;\
            showProgress();\
            \
            // Get current settings\
            const maxAttempts = parseInt(maxAttemptsSelect.value);\
            const scrollDelay = parseInt(scrollDelaySelect.value);\
            \
            // Get current tab\
            const [tab] = await chrome.tabs.query(\{ active: true, currentWindow: true \});\
            \
            // Execute scroll script in content script\
            await chrome.scripting.executeScript(\{\
                target: \{ tabId: tab.id \},\
                function: initiateScrolling,\
                args: [maxAttempts, scrollDelay]\
            \});\
            \
        \} catch (error) \{\
            console.error('Error initiating scroll:', error);\
            setStatus('error', 'Failed to scroll');\
            hideProgress();\
            scrollBtn.disabled = false;\
        \}\
    \}\
    \
    // Function to be injected into the page\
    function initiateScrolling(maxAttempts, scrollDelay) \{\
        // Check if content script is loaded\
        if (typeof window.firstTweetFinderLoaded === 'undefined') \{\
            alert('Extension not fully loaded. Please refresh the page and try again.');\
            return;\
        \}\
        \
        // Trigger the scroll function from content script\
        const event = new CustomEvent('firstTweetFinder:scroll', \{\
            detail: \{ maxAttempts, scrollDelay \}\
        \});\
        document.dispatchEvent(event);\
    \}\
    \
    // Show progress indicator\
    function showProgress() \{\
        progressSection.classList.remove('hidden');\
        animateProgress();\
    \}\
    \
    // Hide progress indicator\
    function hideProgress() \{\
        progressSection.classList.add('hidden');\
        progressFill.style.width = '0%';\
    \}\
    \
    // Animate progress bar\
    function animateProgress() \{\
        let progress = 0;\
        const interval = setInterval(() => \{\
            progress += 2;\
            progressFill.style.width = progress + '%';\
            \
            if (progress >= 100) \{\
                clearInterval(interval);\
                setTimeout(() => \{\
                    hideProgress();\
                    setStatus('ready', 'Scroll complete');\
                    scrollBtn.disabled = false;\
                \}, 1000);\
            \}\
        \}, 200);\
    \}\
    \
    // Load saved settings\
    function loadSettings() \{\
        chrome.storage.sync.get(['maxAttempts', 'scrollDelay'], (result) => \{\
            if (result.maxAttempts) \{\
                maxAttemptsSelect.value = result.maxAttempts;\
            \}\
            if (result.scrollDelay) \{\
                scrollDelaySelect.value = result.scrollDelay;\
            \}\
        \});\
    \}\
    \
    // Save settings\
    function saveSettings() \{\
        const settings = \{\
            maxAttempts: maxAttemptsSelect.value,\
            scrollDelay: scrollDelaySelect.value\
        \};\
        chrome.storage.sync.set(settings);\
    \}\
    \
    // Event listeners\
    scrollBtn.addEventListener('click', handleScrollClick);\
    maxAttemptsSelect.addEventListener('change', saveSettings);\
    scrollDelaySelect.addEventListener('change', saveSettings);\
    \
    // Help and about links\
    document.getElementById('helpLink').addEventListener('click', (e) => \{\
        e.preventDefault();\
        alert('Help:\\n\\n1. Navigate to any Twitter profile\\n2. Click the floating button or use this popup\\n3. Wait for the extension to scroll to the first tweet\\n4. The oldest tweet will be highlighted\\n\\nTip: Use slower settings for older accounts with many tweets.');\
    \});\
    \
    document.getElementById('aboutLink').addEventListener('click', (e) => \{\
        e.preventDefault();\
        alert('First Tweet Finder v1.0\\n\\nA Chrome extension to automatically find and scroll to the first tweet on any Twitter profile.\\n\\nMade with \uc0\u10084 \u65039  for Twitter archaeology!');\
    \});\
    \
    // Initialize popup\
    function initialize() \{\
        console.log('First Tweet Finder: Popup initialized');\
        loadSettings();\
        checkCurrentTab();\
        \
        // Update status every few seconds\
        setInterval(checkCurrentTab, 3000);\
    \}\
    \
    // Start when DOM is ready\
    if (document.readyState === 'loading') \{\
        document.addEventListener('DOMContentLoaded', initialize);\
    \} else \{\
        initialize();\
    \}\
    \
\})();\
}