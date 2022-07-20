export default class Favorites {
  constructor() {
    this.addListeners();
    this.load();
  }
  list = [];
  addListeners() {
    document.getElementById('favorites-btn').addEventListener('click', e => {
      const buttons = Array.from(document.getElementById('btn-container').children);
      if (e.target.classList.contains('filter-btn-on')) buttons.forEach(i => i.classList.remove('btn-filter-fav'));
      else buttons.forEach(i => { if (!i.classList.contains('fav')) i.classList.add('btn-filter-fav'); });
      e.target.classList.toggle('filter-btn-on');
    });
    document.getElementById('btn-container').addEventListener('click', e => { if (e.target.classList.contains('favStar')) this.toggleBtnAsFav(e.target); });
  }
  save() {
    window.localStorage.setItem('favorites', JSON.stringify(this.list));
  }
  load() {
    const stored = JSON.parse(window.localStorage.getItem('favorites'));
    if (stored) this.list = stored;
  }
  remove(soundName) {
    this.list = this.list.filter(i => i !== soundName);
  }
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
  }
}
