async function createShortLink() {
  const title = document.getElementById("titleInput").value.trim();
  const link = document.getElementById("linkInput").value.trim();
  if (!title || !link) {
    alert("Please enter both title and link.");
    return;
  }

  const id = Math.random().toString(36).substring(2, 8);
  const fileUrl = "https://api.github.com/repos/Sahitya000/sub4sub/contents/links.json";
  const token = "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"; // 👈 Apna token yahan paste karein

  const fileRes = await fetch(fileUrl, {
    headers: { Authorization: `token ${token}` }
  });
  const fileData = await fileRes.json();
  const sha = fileData.sha;
  const existingLinks = JSON.parse(atob(fileData.content));

  existingLinks[id] = { title, url: link };

  await fetch(fileUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `Added shortlink: ${title}`,
      content: btoa(JSON.stringify(existingLinks, null, 2)),
      sha: sha
    })
  });

  const shortlink = `${location.origin}/redirect.html?id=${id}`;
  document.getElementById("shortResult").innerHTML =
    `Shortlink Generated:<br><a href="${shortlink}" target="_blank">${shortlink}</a>`;
}
