function scanForVideos() {
  const videoIds = new Set();

  // 1. Scan Iframes for IDs
  document.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src || "";
    const match = src.match(/(?:embed\/|v\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
    if (match && match[1]) videoIds.add(match[1]);
  });

  // 2. Scan Page Source (Next.js data) for IDs
  const htmlContent = document.body.innerHTML;
  const regex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/g;
  
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    if (match[1]) videoIds.add(match[1]);
  }

  return Array.from(videoIds);
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getEmbeds") {
    sendResponse({ ids: scanForVideos() });
  }
  return true;
});
