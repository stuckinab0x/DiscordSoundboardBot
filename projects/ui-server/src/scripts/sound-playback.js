import { debounce } from './utils';

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

document.getElementById('btn-container').addEventListener('click', e => {
  if (e.target.classList.contains('sound-btn')) {
    e.target.classList.add('btn-red');
    postSound(e.target);
    setTimeout(() => e.target.classList.remove('btn-red'), 1);
  }
});

document.getElementById('skip-container').addEventListener('click', e => {
  if (e.target === document.getElementById('skip-one')) skipRequest();
  if (e.target === document.getElementById('skip-all')) skipRequest(true);
});
