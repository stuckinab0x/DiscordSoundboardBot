const favorites = {
  addListeners() {
    document.getElementById('favorites-btn').addEventListener('click', e => {
      const buttons = Array.from(document.getElementById('btn-container').children);
      if (e.target.classList.contains('filter-btn-on')) buttons.forEach(i => i.classList.remove('btn-filter-fav'));
      else buttons.forEach(i => { if (!i.classList.contains('fav')) i.classList.add('btn-filter-fav'); });
      e.target.classList.toggle('filter-btn-on');
    });
    document.getElementById('btn-container').addEventListener('click', e => { if (e.target.classList.contains('favStar')) this.toggleBtnAsFav(e.target); });
  },
  async toggleBtnAsFav(favStar) {
    const soundData = favStar.parentElement.dataset;
    let method = 'PUT';
    if (favStar.classList.contains('fav-set')) {
      favStar.innerHTML = 'star_outline';
      method = 'DELETE';
    } else {
      favStar.innerHTML = 'star';
    }
    favStar.classList.toggle('fav-set');
    favStar.parentElement.classList.toggle('fav');
    await fetch(`/api/favorites/${ soundData.id }`, { method });
  },
};

favorites.addListeners();

export default favorites;
