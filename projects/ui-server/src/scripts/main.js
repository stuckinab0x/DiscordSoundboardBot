import Cookies from 'js-cookies';
import { loadSounds, searchFilter } from './utils';
import Favorites from './favorites';
import './sound-playback';
import './addsound';

const favorites = new Favorites();

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('username').innerHTML = Cookies.getItem('username');
  document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${ Cookies.getItem('userid') }/${ Cookies.getItem('avatar') }.png`;
  loadSounds(favorites);
});

document.addEventListener('click', e => {
  const logOutMenu = document.getElementById('log-out-menu');
  const avatar = document.getElementById('avatar');
  if (e.target === avatar) logOutMenu.classList.toggle('log-out-menu-hide');
  if (e.target !== avatar) logOutMenu.classList.add('log-out-menu-hide');
  if (e.target === document.getElementById('search-cancel')) searchFilter(true);
});

document.getElementById('search').addEventListener('keyup', () => searchFilter());
