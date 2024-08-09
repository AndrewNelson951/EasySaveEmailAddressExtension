document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "extractEmails"}, function(response) {
        const emailList = document.getElementById('emailList');
        const emails = response.emails;
        
        if (emails.length > 0) {
          emails.forEach(email => {
            const div = document.createElement('div');
            div.textContent = email;
            emailList.appendChild(div);
          });
        } else {
          emailList.textContent = "No emails found on this page.";
        }
      });
    });
  
    document.getElementById('copyButton').addEventListener('click', function() {
      const emails = Array.from(document.querySelectorAll('#emailList div')).map(div => div.textContent).join('\n');
      navigator.clipboard.writeText(emails).then(function() {
        alert('Emails copied to clipboard!');
      });
    });
  });