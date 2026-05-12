const STORAGE_KEY = 'pauloTarsoVolunteer';
const COUNT_KEY = 'pauloTarsoVolunteerCount';
const LAST_PAGE_KEY = 'pauloTarsoLastPage';

const form = document.getElementById('volunteer-form');
const messageBox = document.getElementById('volunteer-message');
const volunteerCount = document.getElementById('volunteer-count');
const visitNote = document.getElementById('visit-note');

const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const areaInput = document.getElementById('area');
const notesInput = document.getElementById('notes');

const storage = window.localStorage;
const pageBody = document.body;
const pageClass = pageBody.className;

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStoredVolunteer() {
  return parseJson(storage.getItem(STORAGE_KEY));
}

function getVolunteerCount() {
  return Math.max(0, parseInt(storage.getItem(COUNT_KEY) || '0', 10));
}

function setVolunteerCount(count) {
  storage.setItem(COUNT_KEY, String(Math.max(0, count)));
}

function saveVolunteer(volunteer) {
  storage.setItem(STORAGE_KEY, JSON.stringify(volunteer));
}

function getCurrentPageLabel() {
  return pageBody.dataset.pageLabel || document.title;
}

function updateLastVisitedPage() {
  storage.setItem(LAST_PAGE_KEY, getCurrentPageLabel());
}

function renderLastVisit() {
  if (!visitNote) return;
  const lastPage = storage.getItem(LAST_PAGE_KEY);
  const currentPage = getCurrentPageLabel();

  visitNote.textContent = lastPage && lastPage !== currentPage
    ? `Última página visitada: ${lastPage}`
    : 'Explore outras páginas do projeto para ver mais detalhes.';
}

function renderVolunteerStatus() {
  const volunteer = getStoredVolunteer();
  const count = getVolunteerCount();

  if (volunteerCount) {
    volunteerCount.textContent = String(count);
  }

  if (!messageBox) return;

  if (volunteer) {
    messageBox.textContent = `Obrigado por se inscrever, ${volunteer.name}! Sua participação em ${volunteer.area} faz diferença.`;
    messageBox.classList.add('volunteer-status');

    if (nameInput) nameInput.value = volunteer.name;
    if (ageInput) ageInput.value = volunteer.age;
    if (emailInput) emailInput.value = volunteer.email;
    if (areaInput) areaInput.value = volunteer.area;
    if (notesInput) notesInput.value = volunteer.notes;
  } else {
    messageBox.textContent = 'Preencha o formulário abaixo para participar do projeto e fortalecer o voluntariado na escola.';
    messageBox.classList.remove('volunteer-status');
  }
}

function isSameVolunteer(volunteerA, volunteerB) {
  return volunteerA && volunteerB && volunteerA.email && volunteerA.email === volunteerB.email;
}

function svgDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createHeroSvg() {
  const base = pageClass === 'projeto' ? '#1f4a8f' : pageClass === 'voluntarios' ? '#ffb03b' : '#1f4a8f';
  const accent = pageClass === 'projeto' ? '#ffb03b' : pageClass === 'voluntarios' ? '#1f4a8f' : '#ffb03b';

  return `
    <svg width="560" height="360" viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.28" />
          <stop offset="100%" stop-color="${base}" stop-opacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="560" height="360" rx="34" fill="url(#heroGradient)" />
      <circle cx="140" cy="110" r="60" fill="${base}" fill-opacity="0.85" />
      <circle cx="430" cy="90" r="42" fill="${accent}" fill-opacity="0.95" />
      <rect x="120" y="190" width="320" height="130" rx="24" fill="#ffffff" fill-opacity="0.92" />
      <path d="M160 220 H240 C250 220 250 240 260 240 H300" stroke="${base}" stroke-width="16" stroke-linecap="round" fill="none" />
      <path d="M320 260 C340 220 380 220 400 260" stroke="${accent}" stroke-width="16" stroke-linecap="round" fill="none" />
      <circle cx="220" cy="240" r="14" fill="${base}" />
      <circle cx="360" cy="240" r="14" fill="${accent}" />
    </svg>
  `;
}

function createProjectImageSvg() {
  return `
    <svg width="560" height="260" viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg">
      <rect width="560" height="260" rx="28" fill="#ffffff" />
      <circle cx="120" cy="110" r="58" fill="#1f4a8f" opacity="0.95" />
      <circle cx="440" cy="130" r="52" fill="#ffb03b" opacity="0.9" />
      <path d="M180 210 C220 150 320 150 360 210" stroke="#1f4a8f" stroke-width="18" fill="none" stroke-linecap="round" />
      <path d="M130 98 C145 80 175 80 190 98" fill="none" stroke="#ffffff" stroke-width="11" stroke-linecap="round" />
      <path d="M410 120 C425 100 455 100 470 120" fill="none" stroke="#ffffff" stroke-width="11" stroke-linecap="round" />
      <text x="280" y="220" text-anchor="middle" font-size="22" fill="#1f4a8f">IA Solidária</text>
    </svg>
  `;
}

function createProfileImageSvg() {
  return `
    <svg width="560" height="320" viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg">
      <rect width="560" height="320" rx="30" fill="#1f4a8f" />
      <circle cx="236" cy="118" r="58" fill="#ffb03b" />
      <rect x="170" y="180" width="220" height="110" rx="24" fill="#ffffff" />
      <path d="M210 212 C240 178 320 178 350 212" stroke="#1f4a8f" stroke-width="18" fill="none" stroke-linecap="round" />
      <circle cx="234" cy="118" r="24" fill="#1f4a8f" />
      <circle cx="318" cy="118" r="24" fill="#1f4a8f" />
      <text x="280" y="290" text-anchor="middle" font-size="26" fill="#ffffff">Equipe</text>
    </svg>
  `;
}

function renderHeroVisual() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;

  const existingImage = heroVisual.querySelector('.visual-image');
  if (existingImage) return;

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'visual-image';
  imageWrapper.innerHTML = `<img src="${svgDataUri(createHeroSvg())}" alt="Ilustração do projeto Caminho Solidário" />`;
  heroVisual.appendChild(imageWrapper);
}

function renderProjectCanvas() {
  const canvas = document.querySelector('.image-canvas');
  if (!canvas) return;

  canvas.innerHTML = `<img src="${svgDataUri(createProjectImageSvg())}" alt="Ilustração IA gerada para o projeto" />`;
}

function renderProfileImages() {
  document.querySelectorAll('.profile-card img').forEach((img) => {
    img.src = svgDataUri(createProfileImageSvg());
    img.alt = 'Ilustração da equipe do voluntariado';
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!messageBox) return;

  const volunteer = {
    name: nameInput?.value.trim() || '',
    age: ageInput?.value.trim() || '',
    email: emailInput?.value.trim() || '',
    area: areaInput?.value || '',
    notes: notesInput?.value.trim() || '',
    date: new Date().toISOString(),
  };

  if (!volunteer.name || !volunteer.age || !volunteer.email || !volunteer.area) {
    messageBox.textContent = 'Por favor, preencha todos os campos obrigatórios para concluir a inscrição.';
    messageBox.classList.remove('volunteer-status');
    return;
  }

  const existingVolunteer = getStoredVolunteer();
  const isNewRegistration = !isSameVolunteer(volunteer, existingVolunteer);

  saveVolunteer(volunteer);

  if (isNewRegistration) {
    setVolunteerCount(getVolunteerCount() + 1);
  }

  renderVolunteerStatus();

  if (volunteerCount) {
    volunteerCount.textContent = String(getVolunteerCount());
  }

  messageBox.textContent = `Inscrição recebida! Bem-vindo(a) ao Projeto "Caminho Solidário", ${volunteer.name}!`;
  messageBox.classList.add('volunteer-status');

  form.reset();
}

if (form) {
  form.addEventListener('submit', handleFormSubmit);
}

renderPageGraphics();
renderVolunteerStatus();
renderLastVisit();
updateLastVisitedPage();

function renderPageGraphics() {
  renderHeroVisual();
  renderProjectCanvas();
  renderProfileImages();
}
