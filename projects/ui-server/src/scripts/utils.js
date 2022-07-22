export async function loadSounds(userFavorites) {
  try {
    const soundsResponse = await fetch('/api/soundlist');
    const soundList = await soundsResponse.json();
    soundList.forEach(i => {
      const div = document.createElement('div');
      const btn = document.createElement('button');
      const fav = document.createElement('span');
      fav.classList.add('material-icons', 'favStar', 'icon-btn');
      if (userFavorites.list.find(x => x === i)) {
        div.classList.add('fav');
        fav.innerHTML = 'star';
        fav.classList.add('fav-set');
      } else {
        fav.innerHTML = 'star_outline';
      }
      btn.innerHTML = i;
      btn.classList.add('btn', 'sound-btn');
      div.dataset.soundName = i;
      div.classList.add('sound-tile');
      div.appendChild(btn);
      div.appendChild(fav);
      document.getElementById('btn-container').appendChild(div);
    });
  } catch (error) {
    console.error(error);
    document.getElementById('body').classList.add('body-error');
    document.getElementById('error-container').classList.add('message-container-show');
    document.getElementById('search-container').classList.add('search-hide');
  }
}

export function searchFilter(cancelButton = false) {
  const search = document.getElementById('search');
  if (cancelButton) search.value = '';
  search.focus();

  const searchX = document.getElementById('search-cancel');
  if (search.value) searchX.classList.add('search-cancel-show');
  else searchX.classList.remove('search-cancel-show');

  const searchMessage = document.getElementById('empty-search-container');
  searchMessage.classList.remove('message-container-show');
  const buttons = Array.from(document.getElementById('btn-container').children);
  buttons.forEach(i => i.classList.add('btn-hide'));
  buttons.forEach(i => {
    const btnName = i.dataset.soundName.toUpperCase();
    if (btnName.includes(search.value.toUpperCase())) i.classList.remove('btn-hide');
  });
  if (buttons.every(i => i.classList.contains('btn-hide'))) searchMessage.classList.add('message-container-show');
}

export function debounce(func, wait, immediate) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}
