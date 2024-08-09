let emails = [];

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');
    const content = document.getElementById('content');
    const summary = document.getElementById('summary');
    const emailList = document.getElementById('emailList');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');

    function updateUI() {
        emailList.innerHTML = '';
        emails.forEach(email => {
            const div = document.createElement('div');
            div.textContent = email;
            div.className = 'email-item';
            emailList.appendChild(div);
        });
        summary.textContent = `${emails.length} emails found`;
    }

    toggleBtn.addEventListener('click', function() {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        summary.style.display = content.style.display === 'none' ? 'block' : 'none';
        toggleBtn.innerHTML = content.style.display === 'none' 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    });

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(emails.join('\n')).then(function() {
            alert('Emails copied to clipboard!');
        });
    });

    exportBtn.addEventListener('click', function() {
        const blob = new Blob([emails.join('\n')], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_emails.csv';
        a.click();
        URL.revokeObjectURL(url);
    });

    clearBtn.addEventListener('click', function() {
        emails = [];
        updateUI();
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "extractEmails"}, function(response) {
            if (response && response.emails) {
                emails = response.emails;
                updateUI();
            }
        });
    });
});