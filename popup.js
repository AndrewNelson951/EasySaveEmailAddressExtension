let emails = [];
let currentUrl = '';

document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');
    const content = document.getElementById('content');
    const emailList = document.getElementById('emailList');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const emailCount = document.getElementById('emailCount');

    function updateUI() {
        emailList.innerHTML = '';
        emails.forEach(email => {
            const div = document.createElement('div');
            div.textContent = email;
            div.className = 'email-item';
            emailList.appendChild(div);
        });
        emailCount.textContent = `${emails.length} email${emails.length !== 1 ? 's' : ''}`;
    }

    toggleBtn.addEventListener('click', function() {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
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
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        let csvContent = "Date,URL,Email\n"; // CSV header
        emails.forEach(email => {
            csvContent += `${currentDate},${currentUrl},${email}\n`;
        });
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
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

    // Initial email extraction
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "extractEmails"}, function(response) {
            if (response && response.emails) {
                emails = response.emails;
                currentUrl = response.url;
                updateUI();
            }
        });
    });
});