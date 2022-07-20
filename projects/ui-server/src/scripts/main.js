import { makeSoundButtons, searchFilter } from './utils';
import Favorites from './favorites';
import './sound-playback';
import './addsound';

async function fetchUser() {
  try {
    const userResponse = await fetch('/api/user');
    const userData = await userResponse.json();
    document.getElementById('username').innerHTML = userData.name;
    document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${ userData.userID }/${ userData.avatar }.png`;
    return userData;
  } catch (error) {
    console.error(error);
    document.getElementById('body').classList.add('body-error');
    document.getElementById('error-container').classList.add('message-container-show');
    document.getElementById('search-container').classList.add('search-hide');
  }
  return null;
}

const favorites = new Favorites();

document.addEventListener('DOMContentLoaded', async () => {
  const userData = await fetchUser();
  makeSoundButtons(userData.soundList, favorites);
});

document.addEventListener('click', e => {
  const logOutMenu = document.getElementById('log-out-menu');
  const avatar = document.getElementById('avatar');
  if (e.target === avatar) logOutMenu.classList.toggle('log-out-menu-hide');
  if (e.target !== avatar) logOutMenu.classList.add('log-out-menu-hide');
  if (e.target === document.getElementById('search-cancel')) searchFilter(true);
});

document.getElementById('search').addEventListener('keyup', () => searchFilter());
