function initGoogleObserver() {
  const googleInput = document.querySelector('textarea[name="q"]') || document.querySelector('input[name="q"]');
  
  if (googleInput) {
    googleInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase();
      
      if (!val) { removeResult(); return; }

      chrome.storage.local.get({ myLinks: [] }, (data) => {
        const match = data.myLinks.find(link => link.name.toLowerCase().startsWith(val));
        
        if (match) {
          showResult(match);
        } else {
          removeResult();
        }
      });
    });
  }
}

function showResult(link) {
  removeResult();
  const div = document.createElement('div');
  div.id = 'qj-slide-result';
  div.innerHTML = `
    <div style="font-size:12px; color:#1a73e8; font-weight:bold;">QUICKJUMP MATCH 🔍</div>
    <div style="font-size:18px; color:#1a0dab; margin:5px 0;">${link.name}</div>
    <div style="font-size:13px; color:#4d5156;">${link.info} — Go to: ${link.url}</div>
  `;
  
  div.onclick = () => window.location.href = link.url.includes('://') ? link.url : 'https://' + link.url;

 
  const main = document.getElementById('rcnt') || document.body;
  main.prepend(div);
  

  setTimeout(() => div.classList.add('visible'), 50);
}

function removeResult() {
  const el = document.getElementById('qj-slide-result');
  if (el) el.remove();
}

// Wait for Google to load the search bar
setTimeout(initGoogleObserver, 1000);
