// Check if this is a short link visit
if(window.location.hash.startsWith('#/s/')) {
    handleShortLinkRedirect();
} else {
    showMainForm();
}

function handleShortLinkRedirect() {
    document.getElementById('main-form').style.display = 'none';
    document.getElementById('redirect-section').style.display = 'block';
    
    const shortCode = window.location.hash.split('/s/')[1];
    const originalLink = localStorage.getItem(`short_${shortCode}`);
    
    if(originalLink) {
        document.getElementById('redirect-link').href = originalLink;
        
        // Show "You must subscribe first" message
        const redirectLink = document.getElementById('redirect-link');
        redirectLink.onclick = function(e) {
            e.preventDefault();
            alert("Please subscribe to my channel first!\n\nAfter subscribing, you'll be redirected.");
            window.open("YOUR_YOUTUBE_LINK", "_blank");
            setTimeout(() => {
                window.location.href = originalLink;
            }, 5000); // Redirect after 5 seconds
        };
        
        // Auto redirect after showing message
        setTimeout(() => {
            redirectLink.click();
        }, 2000);
    } else {
        document.getElementById('redirect-section').innerHTML = 
            '<p class="error">Invalid or expired link</p>';
    }
}

function createShortLink() {
    const youtubeLink = document.getElementById('youtube-link').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!isValidYouTubeLink(youtubeLink)) {
        resultDiv.innerHTML = '<p class="error">Please enter a valid YouTube channel link</p>';
        return;
    }
    
    // Generate short code
    const shortCode = generateShortCode();
    
    // Store in localStorage (works per device/browser)
    localStorage.setItem(`short_${shortCode}`, youtubeLink);
    
    // Create short URL
    const currentUrl = window.location.href.split('#')[0];
    const shortUrl = `${currentUrl}#/s/${shortCode}`;
    
    resultDiv.innerHTML = `
        <h3>Your Sub4Sub Short Link:</h3>
        <div class="short-link">${shortUrl}</div>
        <button onclick="copyToClipboard('${shortUrl}')">Copy Link</button>
        <p>Share this link with others!</p>
        <div class="note">Note: Links work only in this browser</div>
    `;
}

// Helper functions
function isValidYouTubeLink(link) {
    return link.includes("youtube.com") || link.includes("youtu.be");
}

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
}

function showMainForm() {
    document.getElementById('main-form').style.display = 'block';
    document.getElementById('redirect-section').style.display = 'none';
}
