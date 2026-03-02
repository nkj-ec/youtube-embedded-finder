async function displayEmbeds() {
  const resultsDiv = document.getElementById('results');
  const statusDiv = document.getElementById('status');

  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    // If we're on a browser page like about:debugging, stop
    if (!tabs[0].url.startsWith('http')) {
      statusDiv.textContent = "Cannot scan this page.";
      return;
    }

    const response = await browser.tabs.sendMessage(tabs[0].id, { action: "getEmbeds" });

    statusDiv.style.display = 'none';
    resultsDiv.innerHTML = '';

    if (!response || !response.ids || response.ids.length === 0) {
      resultsDiv.innerHTML = '<div style="text-align:center;color:#666;padding:20px;">No videos found.</div>';
      return;
    }

    response.ids.forEach(id => {
      // Use standard string addition to avoid backtick/template literal issues
      const cleanId = id.trim();
      const watchUrl = "https://www.youtube.com/watch?v=" + cleanId;
      
      const item = document.createElement('div');
      item.style = "background:white; padding:12px; margin-bottom:10px; border-radius:8px; border:1px solid #eee; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
      
      const link = document.createElement('a');
      link.href = "#";
      link.textContent = "Watch Video (" + cleanId + ")";
      link.style = "color:#cc0000; font-weight:bold; text-decoration:none; display:block; margin-bottom:4px; font-size:14px;";
      
      // Force the browser to open a real new tab
      link.onclick = (e) => {
        e.preventDefault();
        browser.tabs.create({ url: watchUrl });
      };

      const urlDisplay = document.createElement('div');
      urlDisplay.textContent = watchUrl;
      urlDisplay.style = "font-size:11px; color:#999; word-break:break-all;";

      item.appendChild(link);
      item.appendChild(urlDisplay);
      resultsDiv.appendChild(item);
    });
  } catch (err) {
    statusDiv.textContent = "Error: Refresh the webpage and try again.";
    console.error("Extension Error:", err);
  }
}

displayEmbeds();
