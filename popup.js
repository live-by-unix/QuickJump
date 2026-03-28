document.addEventListener('DOMContentLoaded', () => {
  renderLinks();
});

document.getElementById('openSettings').onclick = () => {
  document.getElementById('settingsView').classList.add('active');
};

document.getElementById('closeSettings').onclick = () => {
  document.getElementById('settingsView').classList.remove('active');
};

document.getElementById('saveBtn').onclick = () => {
  const name = document.getElementById('newName').value;
  const url = document.getElementById('newUrl').value;
  const info = document.getElementById('newInfo').value;

  if (name && url) {
    chrome.storage.local.get({ myLinks: [] }, (data) => {
      const myLinks = data.myLinks;
      myLinks.push({ id: Date.now(), name, url, info });
      chrome.storage.local.set({ myLinks }, () => {
        renderLinks();
        document.getElementById('settingsView').classList.remove('active');
        document.getElementById('newName').value = '';
        document.getElementById('newUrl').value = '';
        document.getElementById('newInfo').value = '';
      });
    });
  }
};

document.getElementById('searchBar').oninput = (e) => {
  renderLinks(e.target.value.toLowerCase());
};

function renderLinks(filter = '') {
  chrome.storage.local.get({ myLinks: [] }, (data) => {
    const list = document.getElementById('linksList');
    list.innerHTML = '';
    const filtered = data.myLinks.filter(l => l.name.toLowerCase().includes(filter));
    
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'link-item';
      div.innerText = item.name;
      div.onclick = () => window.open(item.url.includes('://') ? item.url : 'https://' + item.url, '_blank');
      div.oncontextmenu = (e) => {
        e.preventDefault();
        if (confirm(`Delete "${item.name}"?`)) {
          deleteLink(item.id);
        }
      };
      list.appendChild(div);
    });
  });
}

function deleteLink(id) {
  chrome.storage.local.get({ myLinks: [] }, (data) => {
    const myLinks = data.myLinks.filter(l => l.id !== id);
    chrome.storage.local.set({ myLinks }, () => renderLinks());
  });
}
