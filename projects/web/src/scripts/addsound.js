const addSoundButton = document.getElementById('add-sound-button');
const addSoundDialog = document.getElementById('add-sound-dialog');
const fileInput = document.getElementById('file-upload');
const confirmButton = document.getElementById('addsound-confirm-btn');
const nameInput = document.getElementById('sound-name-input');
const dialogMessage = document.getElementById('add-sound-text');
const defaultMessage = 'Upload a new sound file';

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
  const extension = path[path.length - 1].toLowerCase();

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

document.getElementById('addsound-confirm-btn').addEventListener('click', () => addSound());
