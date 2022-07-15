// TODO: add state to oAuth2?

const buttonContainer = document.getElementById('btn-container');
const searchCancel = document.getElementById('search-cancel');
const favorites = {
  list: [],
  save() {
    window.localStorage.setItem('favorites', JSON.stringify(this.list));
  },
  load() {
    const stored = JSON.parse(window.localStorage.getItem('favorites'));
    if (stored) this.list = stored;
  },
  remove(soundName) {
    this.list = this.list.filter(i => i !== soundName);
  },
  toggleBtnAsFav(favStar) {
    const star = favStar;
    if (star.classList.contains('fav-set')) {
      star.innerHTML = 'star_outline';
      this.remove(star.parentElement.dataset.soundName);
    } else {
      star.innerHTML = 'star';
      this.list.push(star.parentElement.dataset.soundName);
    }
    star.classList.toggle('fav-set');
    star.parentElement.classList.toggle('fav');
    this.save();
  },
};

function makeButtons(data) {
  data.forEach(i => {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    const fav = document.createElement('span');
    fav.classList.add('material-icons', 'favStar', 'icon-btn');
    favorites.load();
    if (favorites.list.find(x => x === i)) {
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
    buttonContainer.appendChild(div);
  });
}

function fetchUser() {
  fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      document.getElementById('username').innerHTML = data.name;
      document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${ data.userID }/${ data.avatar }.png`;
      makeButtons(data.soundList);
    })
    .catch(error => {
      console.error(error);
      document.getElementById('body').classList.add('body-error');
      document.getElementById('error-container').classList.add('message-container-show');
      document.getElementById('search-container').classList.add('search-hide');
    });
}

function searchFilter(cancelButton = false) {
  const search = document.getElementById('search');
  if (cancelButton) search.value = '';
  search.focus();

  if (search.value) searchCancel.classList.add('search-cancel-show');
  else searchCancel.classList.remove('search-cancel-show');

  const searchMessage = document.getElementById('empty-search-container');
  searchMessage.classList.remove('message-container-show');
  const buttons = Array.from(buttonContainer.children);
  buttons.forEach(i => i.classList.add('btn-hide'));
  buttons.forEach(i => {
    const btnName = i.dataset.soundName.toUpperCase();
    if (btnName.includes(search.value.toUpperCase())) i.classList.remove('btn-hide');
  });
  if (buttons.every(i => i.classList.contains('btn-hide'))) searchMessage.classList.add('message-container-show');
}

// Addsound
// //////////////

const addSoundButton = document.getElementById('add-sound-button');
const addSoundDialog = document.getElementById('add-sound-dialog');
const fileInput = document.getElementById('file-upload');
const confirmButton = document.getElementById('addsound-confirm-btn');
const nameInput = document.getElementById('sound-name-input');
const dialogMessage = document.getElementById('add-sound-text');
const defaultMessage = 'Upload a new sound file';

addSoundButton.addEventListener('click', () => {
  if (addSoundDialog.classList.contains('btn-hide')) {
    addSoundDialog.classList.remove('btn-hide');
    return;
  }
  fileInput.value = null;
  nameInput.value = null;
  confirmButton.classList.add('btn-hide');
  addSoundDialog.classList.add('btn-hide');
});

fileInput.addEventListener('change', () => {
  const supportedFileTypes = ['wav', 'mp3', 'webm', 'ogg'];
  const path = fileInput.value.split('.');
  const extension = path[path.length - 1];

  if (!supportedFileTypes.includes(extension) && fileInput.value) {
    fileInput.value = null;
    addSoundDialog.classList.add('btn-red', 'add-sound-shake');
    dialogMessage.innerHTML = 'WRONG FILE TYPE (try: wav mp3 webm ogg)';
    setTimeout(() => {
      addSoundDialog.classList.remove('btn-red', 'add-sound-shake');
      dialogMessage.innerHTML = defaultMessage;
    }, 3500);
    return;
  }

  if (fileInput.value && nameInput.value) confirmButton.classList.remove('btn-hide');
  else confirmButton.classList.add('btn-hide');
});

nameInput.onkeydown = e => { if (e.key === 'Enter') e.target.blur(); };

nameInput.addEventListener('keyup', () => {
  if (!fileInput.value || !nameInput.value) {
    confirmButton.classList.add('btn-hide');
    return;
  }
  if (fileInput.value && nameInput.value) confirmButton.classList.remove('btn-hide');
});

function randomSuccessMessage() {
  const messages = ['The cloud awaits...', 'sv_gravity -800', 'Maybe you\'re actually falling tho.', 'ZOOM', 'TO THE SKY REALM',
    'SOUNDS FOR THE SOUND GOD', 'NOOOOO THIS FILE IS FULL OF HELIUM'];
  return messages[Math.floor(Math.random() * messages.length)];
}

async function addSound() {
  if (!fileInput.value) return;
  const formData = new FormData();
  if (nameInput.value) formData.append('custom-name', nameInput.value);
  formData.append('sound-file', fileInput.files[0]);

  try {
    confirmButton.classList.add('btn-hide');
    const addSoundRes = await fetch('/api/addsound', {
      method: 'POST',
      body: formData,
    });
    if (addSoundRes.status === 409) throw new Error('Sound already exists', { cause: 409 });
    addSoundButton.disabled = true;
    addSoundButton.classList.add('btn-green');
    addSoundButton.classList.remove('btn');
    dialogMessage.innerHTML = randomSuccessMessage();
    addSoundDialog.classList.add('add-sound-displace', 'btn-green');
    fileInput.disabled = true;
    nameInput.disabled = true;
    setTimeout(() => {
      addSoundButton.classList.remove('btn-green');
      addSoundButton.classList.add('btn');
      fileInput.value = null;
      nameInput.value = null;
      fileInput.disabled = false;
      nameInput.disabled = false;
      dialogMessage.innerHTML = defaultMessage;
      addSoundDialog.classList.add('btn-hide');
      addSoundDialog.classList.remove('add-sound-displace', 'btn-green');
      addSoundButton.disabled = false;
    }, 2100);
  } catch (error) {
    console.log(error);
    addSoundDialog.classList.add('btn-red', 'add-sound-shake');
    if (error.cause === 409) dialogMessage.innerHTML = 'Whoops, a sound already has that name';
    else dialogMessage.innerHTML = 'Yikes! Something went wrong';
    setTimeout(() => {
      addSoundDialog.classList.remove('btn-red', 'add-sound-shake');
      dialogMessage.innerHTML = defaultMessage;
      confirmButton.classList.remove('btn-hide');
    }, 3500);
  }
}

document.getElementById('addsound-confirm-btn').addEventListener('click', () => addSound());

// Soundrequest/skip
// /////////////////////

function debounce(func, wait, immediate) {
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

const postSound = debounce(soundButton => {
  fetch('/api/sound', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: soundButton.parentElement.dataset.soundName,
  })
    .then(res => {
      if (res.status === 401) window.location.reload();
    })
    .catch(error => console.log(error));
  soundButton.classList.remove('btn-red');
  soundButton.classList.add('btn-green');
  setTimeout(() => soundButton.classList.remove('btn-green'), 1);
}, 2000, true);

const skipRequest = debounce(async (all = false) => {
  await fetch(`/api/skip?skipAll=${ all }`, { headers: { 'Content-Type': 'text/plain' } })
    .then(res => {
      if (res.status === 401) window.location.reload();
    })
    .catch(error => console.log(error));
}, 500, true);

// //////////////////////////

document.addEventListener('DOMContentLoaded', () => fetchUser());

document.addEventListener('click', e => {
  const logOutMenu = document.getElementById('log-out-menu');
  const avatar = document.getElementById('avatar');
  if (e.target === document.getElementById('skip-one')) skipRequest();
  if (e.target === document.getElementById('skip-all')) skipRequest(true);
  if (e.target === avatar) logOutMenu.classList.toggle('log-out-menu-hide');
  if (e.target !== avatar) logOutMenu.classList.add('log-out-menu-hide');
  if (e.target === searchCancel) searchFilter(true);
});

buttonContainer.addEventListener('click', e => {
  if (e.target.classList.contains('sound-btn')) {
    e.target.classList.add('btn-red');
    postSound(e.target);
    setTimeout(() => e.target.classList.remove('btn-red'), 1);
  }
  if (e.target.classList.contains('favStar')) favorites.toggleBtnAsFav(e.target);
});

document.getElementById('favorites-btn')
  .addEventListener('click', e => {
    const buttons = Array.from(buttonContainer.children);
    if (e.target.classList.contains('filter-btn-on'))
      buttons.forEach(i => i.classList.remove('btn-filter-fav'));
    else
      buttons.forEach(i => {
        if (!i.classList.contains('fav')) i.classList.add('btn-filter-fav');
      });
    e.target.classList.toggle('filter-btn-on');
  });
