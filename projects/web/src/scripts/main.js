import Cookies from 'js-cookies';
import { loadSoundData, searchFilter } from './utils';
import './favorites';
import './sound-playback';
import './addsound';

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('username').innerHTML = Cookies.getItem('username');
  document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${ Cookies.getItem('userid') }/${ Cookies.getItem('avatar') }.png`;
  try {
    const soundsRes = await fetch('/api/soundlist');
    const data = await soundsRes.json();
    loadSoundData(data);
  } catch (error) {
    console.error(error);
    document.body.classList.add('body-error');
    document.getElementById('error-container').classList.add('message-container-show');
    document.getElementById('search-container').classList.add('search-hide');
  }
});

document.addEventListener('click', e => {
  const logOutMenu = document.getElementById('log-out-menu');
  const avatar = document.getElementById('avatar');
  if (e.target === avatar) logOutMenu.classList.toggle('log-out-menu-hide');
  if (e.target !== avatar) logOutMenu.classList.add('log-out-menu-hide');
  if (e.target === document.getElementById('search-cancel')) searchFilter(true);
});

document.getElementById('search').addEventListener('keyup', () => searchFilter());
