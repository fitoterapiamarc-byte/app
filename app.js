const legalScreen = document.getElementById('legalScreen');
const homeScreen = document.getElementById('homeScreen');
const acceptBtn = document.getElementById('acceptBtn');
const rejectBtn = document.getElementById('rejectBtn');

const accepted = localStorage.getItem('cuerpoclaro_terms_accepted');

if (accepted === 'true') {
  legalScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
}

acceptBtn.addEventListener('click', () => {
  localStorage.setItem('cuerpoclaro_terms_accepted', 'true');
  legalScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
});

rejectBtn.addEventListener('click', () => {
  alert('Para utilizar la aplicación debes aceptar primero los términos legales.');
});
