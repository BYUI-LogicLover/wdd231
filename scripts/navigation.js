document.addEventListener('DOMContentLoaded', () => {
  const trigram = document.querySelector('.trigram');
  const navigation = document.querySelector('.navigation');
  const cross = document.querySelector('.cross');

  trigram.addEventListener('click', () => {
    navigation.style.display = 'flex';
    trigram.style.display = 'none';
    cross.style.display = 'block';
  });

  cross.addEventListener('click', () => {
    navigation.style.display = 'none';
    trigram.style.display = 'block';
    cross.style.display = 'none';
  });
});