const settingsView = document.getElementById('settingsView');
const linksList = document.getElementById('linksList');
const searchBar = document.getElementById('searchBar');


document.getElementById('openSettings').onclick = () => settingsView.classList.add('active');
document.getElementById('closeSettings').onclick = () => settingsView.classList.remove('active');


document.getElementById('saveBtn').onclick = () => {
  const name = document.getElementById('newName').value;
  const url = document.getElementById('newUrl').value;
  const info = document.getElementById('newInfo').value;

  if (name && url) {
    chrome.storage.local.get({ myLinks: [] }, (data) => {
      const newList = [...data.myLinks, { name, url, info }];
      chrome.storage.local.set({ myLinks: newList }, () => {
        settingsView.classList.remove('active');
        document.querySelectorAll('.form-input').forEach(i => i.value = '');
        renderLinks();
      });
    });
  }
};


function renderLinks(term = "") {
  chrome.storage.local.get({ myLinks: [] }, (data) => {
    linksList.innerHTML = '';
    const filtered = data.myLinks.filter(l => l.name.toLowerCase().includes(term.toLowerCase()));
    
    filtered.forEach(link => {
      const div = document.createElement('div');
      div.className = 'link-item';
      div.innerHTML = `<strong>${link.name}</strong><br><small style="color:#70757a">${link.info}</small>`;
      div.onclick = () => chrome.tabs.create({ url: link.url.includes('://') ? link.url : 'https://' + link.url });
      linksList.appendChild(div);
    });
  });
}

searchBar.oninput = (e) => renderLinks(e.target.value);
renderLinks();
