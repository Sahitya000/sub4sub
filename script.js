const repoOwner = "YOUR_GITHUB_USERNAME";
const repoName = "YOUR_REPO_NAME";
const filePath = "data.json";
const token = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN";
const apiBase = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

// Fetch JSON from GitHub
async function fetchLinksFromGitHub() {
    const res = await fetch(apiBase, {
        headers: { Authorization: `token ${token}` }
    });
    const data = await res.json();
    const content = atob(data.content);
    return {
        sha: data.sha,
        json: JSON.parse(content)
    };
}

// Update JSON on GitHub
async function updateGitHubLinks(newLinks, sha) {
    const content = btoa(JSON.stringify({ links: newLinks }, null, 2));

    const res = await fetch(apiBase, {
        method: "PUT",
        headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update short links",
            content: content,
            sha: sha
        })
    });

    return res.ok;
}
