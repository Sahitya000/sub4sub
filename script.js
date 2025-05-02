const GITHUB_REPO = "Sahitya000/sub4sub"; // Replace with your GitHub repo

// Check if this is a short link visit
if (window.location.hash.startsWith('#/s/')) {
    handleShortLinkRedirect();
} else {
    showMainForm();
}

function handleShortLinkRedirect() {
    document.getElementById('main-form').style.display = 'none';
    document.getElementById('redirect-section').style.display = 'block';

    const shortCode = window.location.hash.split('/s/')[1];

    fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`)
        .then(res => res.json())
        .then(issues => {
            const issue = issues.find(i => i.title === `[ShortLink] ${shortCode}`);
            if (issue) {
                const linkLine = issue.body.split('\n').find(l => l.startsWith('Link:'));
                const originalLink = linkLine ? linkLine.replace('Link: ', '').trim() : null;
                if (originalLink) {
                    const redirectLink = document.getElementById('redirect-link');
                    redirectLink.href = originalLink;

                    // Auto redirect after 2 seconds
                    setTimeout(() => redirectLink.click(), 2000);

                    // Redirect button behavior
                    redirectLink.onclick = function (e) {
                        e.preventDefault();
                        alert("You will be redirected shortly.");
                        window.location.href = originalLink;
                    };

                } else {
                    showError("Link not found in GitHub issue.");
                }
            } else {
                showError("Invalid or expired short link.");
            }
        })
        .catch(err => {
            console.error(err);
            showError("Error fetching data from GitHub.");
        });
}

function createShortLink() {
    const inputLink = document.getElementById('link-input').value.trim();  // Generalized input for any link
    const resultDiv = document.getElementById('result');

    if (!isValidLink(inputLink)) {
        resultDiv.innerHTML = '<p class="error">Please enter a valid URL.</p>';
        return;
    }

    const shortCode = generateShortCode();
    const issueTitle = `[ShortLink] ${shortCode}`;
    const issueBody = `ShortCode: ${shortCode}\nLink: ${inputLink}`;
    const issueUrl = `https://github.com/${GITHUB_REPO}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
    const currentUrl = window.location.href.split('#')[0];
    const shortUrl = `${currentUrl}#/s/${shortCode}`;

    resultDiv.innerHTML = `
        <h3>Your Short Link:</h3>
        <div class="short-link">${shortUrl}</div>
        <button id="copyButton">Copy Link</button>
        <p><a href="${issueUrl}" target="_blank" id="githubIssueLink">Click here to submit to GitHub (one-time)</a></p>
        <div class="note">Note: This will work globally once submitted.</div>
    `;

    // Make the copy button work
    const copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', function () {
        copyToClipboard(shortUrl);
    });
}

// Helpers
function showMainForm() {
    document.getElementById('main-form').style.display = 'block';
    document.getElementById('redirect-section').style.display = 'none';
}

function showError(msg) {
    document.getElementById('redirect-section').innerHTML = `<p class="error">${msg}</p>`;
}

function isValidLink(link) {
    // This function checks for the most common URL formats
    const urlPattern = /^(https?:\/\/|www\.)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlPattern.test(link);  // Checks if it's a valid URL (YouTube, Telegram, etc.)
}

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
}
