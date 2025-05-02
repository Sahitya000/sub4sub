fetch('channels.json')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('channelList');
    data.forEach(c => {
      const div = document.createElement('div');
      div.innerHTML = `<p><strong>${c.name}</strong></p>
                       <a href="${c.link}" target="_blank"><button>Subscribe</button></a><hr>`;
      list.appendChild(div);
    });
  });

function addChannel() {
  alert("Static page hai! Channel manually JSON file me add karna padega.");
}
