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
  await fetch(`/api/skip${ all ? '?skipAll=true' : '' }`, { headers: { 'Content-Type': 'text/plain' } })
    .then(res => {
      if (res.status === 401) window.location.reload();
    })
    .catch(error => console.log(error));
}, 500, true);

const volume = document.getElementById('preview-volume');

async function previewSound(soundButton) {
  try {
    const soundUrl = await fetch(`/api/preview?soundName=${ soundButton.parentElement.dataset.soundName }`, { headers: { 'Content-Type': 'text/plain' } });
    const audioRes = await fetch(await soundUrl.text());
    const resBuffer = await audioRes.arrayBuffer();
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = volume.value;
    volume.oninput = () => { gain.gain.value = volume.value; };
    await context.decodeAudioData(resBuffer, buffer => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain).connect(context.destination);
      source.start(0);
    });
  } catch (error) {
    console.log(error);
  }
}

let previewSounds = false;

document.getElementById('btn-container').addEventListener('click', e => {
  if (e.target.classList.contains('sound-btn') && previewSounds) {
    previewSound(e.target);
    return;
  }

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

document.getElementById('sound-preview-button').addEventListener('click', e => {
  previewSounds = !previewSounds;
  const buttons = Array.from(document.getElementById('btn-container').children);
  buttons.forEach(i => { i.firstChild.classList.toggle('preview-btn'); });
  document.getElementById('btn-container').classList.toggle('btn-container-preview');
  document.getElementById('preview-instructions').classList.toggle('button-instructions-hide');
  e.target.classList.toggle('filter-btn-on');
});

document.querySelector('input[type="range"]').addEventListener('input', e => {
  const { min, max } = e.target;
  e.target.style.backgroundSize = `${ ((e.target.value - min) * 100) / (max - min) }% 100%`;
});
