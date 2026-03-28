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
  if (document.getElementById('qj-slide-result')) return;
  const div = document.createElement('div');
  div.id = 'qj-slide-result';
  div.innerHTML = `
    <div style="font-size:12px; color:#1a73e8; font-weight:bold; pointer-events:none;">QUICKJUMP MATCH 🔍</div>
    <div style="font-size:18px; color:#1a0dab; margin:5px 0; pointer-events:none;">${link.name}</div>
    <div style="font-size:13px; color:#4d5156; pointer-events:none;">${link.info} — Go to: ${link.url}</div>
  `;
  div.onclick = () => {
    window.location.href = link.url.includes('://') ? link.url : 'https://' + link.url;
  };
  const main = document.getElementById('rcnt') || document.body;
  main.prepend(div);
  setTimeout(() => div.classList.add('visible'), 50);
}

function removeResult() {
  const el = document.getElementById('qj-slide-result');
  if (el) el.remove();
}

setTimeout(initGoogleObserver, 1000);
