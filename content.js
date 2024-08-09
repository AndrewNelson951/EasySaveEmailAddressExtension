function extractEmails() {
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
    const pageContent = document.body.innerText;
    const emails = pageContent.match(emailRegex) || [];
    return [...new Set(emails)]; // Remove duplicates
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractEmails") {
      sendResponse({ emails: extractEmails() });
    }
  });