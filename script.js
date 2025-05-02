document.getElementById("generateBtn").addEventListener("click", createShortLink);

async function createShortLink() {
  // Getting input values
  const title = document.getElementById("titleInput").value.trim();
  const link = document.getElementById("linkInput").value.trim();

  // Check if both fields are filled
  if (!title || !link) {
    alert("Please enter both title and link.");
    return;
  }

  try {
    const id = Math.random().toString(36).substring(2, 8); // Generate random ID
    const fileUrl = "https://api.github.com/repos/Sahitya000/sub4sub/contents/links.json";  // Replace YOUR_USERNAME and YOUR_REPO
    const token = "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"; // Add your GitHub token here

    // Fetch the current links from GitHub
    const fileRes = await fetch(fileUrl, {
      headers: { Authorization: `token ${token}` }
    });
    
    // Check if the request was successful
    if (!fileRes.ok) {
      throw new Error('Failed to fetch file from GitHub');
    }

    const fileData = await fileRes.json();
    const sha = fileData.sha;
    const existingLinks = JSON.parse(atob(fileData.content));  // Decode the base64 content

    // Add the new link to the existing ones
    existingLinks[id] = { title, url: link };

    // Update the file on GitHub with new links
    await fetch(fileUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Added shortlink: ${title}`,
        content: btoa(JSON.stringify(existingLinks, null, 2)),  // Encode content back to base64
        sha: sha
      })
    });

    // Generate the short link
    const shortlink = `${location.origin}/redirect.html?id=${id}`;
    document.getElementById("shortResult").innerHTML =
      `Shortlink Generated:<br><a href="${shortlink}" target="_blank">${shortlink}</a>`;
    
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}
