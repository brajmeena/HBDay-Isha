const reelViewport = document.getElementById('reelViewport');
const reelsCard = document.getElementById('reelsCard');
const reelTrack = document.getElementById('reelTrack');
const reelSlides = Array.from(document.querySelectorAll('.reel-slide'));
const dotsWrapper = document.getElementById('dots');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const wishButton = document.getElementById('wishBtn');
const wishMessage = document.getElementById('wishMessage');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
const eggs = Array.from(document.querySelectorAll('.easter-egg'));
const popup = document.getElementById('magicPopup');
const popupText = document.getElementById('magicPopupText');
const closePopupButton = document.getElementById('closePopup');
const photoPopup = document.getElementById('photoPopup');
const photoPopupImage = document.getElementById('photoPopupImage');
const photoPopupText = document.getElementById('photoPopupText');
const closePhotoPopupButton = document.getElementById('closePhotoPopup');

let activeIndex = 0;
let autoplayInterval;
let autoplayResumeTimer;
let confettiPieces = [];
let animationId;
let touchStartY = 0;
let touchEndY = 0;
let popupTimer;

const AUTO_SCROLL_MS = 5000;
const AUTO_RESUME_DELAY_MS = 10000;
const POPUP_SHOW_MS = 10000;

const wishes = [
  'Wishing you endless laughter, love, and magical adventures! 💖',
  'May your year be as bright as your smile and as wild as Hogwarts nights! 🌟',
  'Happy Birthday! You deserve all the joy, cake, and confetti in the world! 🎂'
];

const memoryPhotos = [
  {
    src: './images/pop_isha_don.jpg',
    text: 'Isha, the Don 😎🌸'
  },
  {
    src: './images/pop_isha_np.jpg',
    text: 'Main character energy, always 🤝🔥'
  },
  {
    src: './images/isha_mybdy.jpg', 
    text: 'Beautiful, brave, and brilliant. 🤓🎈'
  },
  {
    src: './images/pop_isha_pop2.jpg',
    text: 'Ooops, wrong door, go back 🛺🔍.'
  },
  {
    src: './images/pop_isha_stop.jpg',
    text: 'tadho tha wasa 🫸🥤'
  },
  {
    src: './images/isha_dance.jpg',
    text: 'Queen of party and celebrations 📸👑'
  },
  {
    src: './images/isha_dance.jpg',
    text: 'Your happiest chapter starts now 💃🎉 '
  }
];

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function applyThemeByIndex(index) {
  const theme = reelSlides[index]?.dataset.theme || 'rose';
  reelViewport.setAttribute('data-theme', theme);
  reelsCard.setAttribute('data-theme', theme);
}

function renderReel(index) {
  reelTrack.style.transform = `translateY(-${index * 100}%)`;
  applyThemeByIndex(index);
  Array.from(dotsWrapper.children).forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function moveSlide(step) {
  activeIndex = (activeIndex + step + reelSlides.length) % reelSlides.length;
  renderReel(activeIndex);
}

function createDots() {
  reelSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Go to reel ${i + 1}`);
    dot.addEventListener('click', () => {
      activeIndex = i;
      renderReel(activeIndex);
      scheduleAutoplay();
    });
    dotsWrapper.appendChild(dot);
  });
}

function scheduleAutoplay() {
  clearInterval(autoplayInterval);
  clearTimeout(autoplayResumeTimer);
  autoplayResumeTimer = setTimeout(() => {
    autoplayInterval = setInterval(() => moveSlide(1), AUTO_SCROLL_MS);
  }, AUTO_RESUME_DELAY_MS);
}

function startAutoplayNow() {
  clearInterval(autoplayInterval);
  clearTimeout(autoplayResumeTimer);
  autoplayInterval = setInterval(() => moveSlide(1), AUTO_SCROLL_MS);
}

function launchConfetti() {
  setCanvasSize();
  confettiPieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 5 + Math.random() * 7,
    speedY: 2 + Math.random() * 4,
    speedX: -2 + Math.random() * 4,
    rotation: Math.random() * 360,
    rotationSpeed: -8 + Math.random() * 16,
    color: randomItem(['#ff5ea8', '#9c7dff', '#ffd166', '#2ec4b6', '#ffffff'])
  }));

  const endTime = Date.now() + 2500;
  cancelAnimationFrame(animationId);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach((piece) => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rotation += piece.rotationSpeed;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.7);
      ctx.restore();
      if (piece.y > canvas.height + 20) {
        piece.y = -10;
      }
    });

    if (Date.now() < endTime) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function launchMagicBurst() {
  setCanvasSize();
  const sparks = Array.from({ length: 500 }, () => ({
    x: canvas.width / 2,
    y: canvas.height * 0.32,
    angle: Math.random() * Math.PI * 2,
    speed: 2 + Math.random() * 5,
    radius: 2 + Math.random() * 3,
    life: 100 + Math.floor(Math.random() * 18),
    color: randomItem(['#ffe066', '#a78bfa', '#7dd3fc', '#f9a8d4'])
  }));

  cancelAnimationFrame(animationId);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach((spark) => {
      if (spark.life <= 0) {
        return;
      }
      spark.x += Math.cos(spark.angle) * spark.speed;
      spark.y += Math.sin(spark.angle) * spark.speed;
      spark.speed *= 0.96;
      spark.life -= 1;

      ctx.beginPath();
      ctx.fillStyle = spark.color;
      ctx.globalAlpha = Math.max(spark.life / 40, 0);
      ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    if (sparks.some((spark) => spark.life > 0)) {
      animationId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

function handleSwipe() {
  const swipeDistance = touchEndY - touchStartY;
  if (Math.abs(swipeDistance) < 40) {
    return;
  }

  if (swipeDistance > 0) {
    moveSlide(-1);
  } else {
    moveSlide(1);
  }

  scheduleAutoplay();
}

function hideMagicPopup() {
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden', 'true');
  if (!photoPopup.classList.contains('show')) {
    document.body.classList.remove('modal-open');
  }
}

function showMagicPopup(message) {
  popupText.textContent = message || 'Magic found! ✨';
  popup.classList.add('show');
  popup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  clearTimeout(popupTimer);
  popupTimer = setTimeout(hideMagicPopup, POPUP_SHOW_MS);
}

function hidePhotoPopup() {
  photoPopup.classList.remove('show');
  photoPopup.setAttribute('aria-hidden', 'true');
  if (!popup.classList.contains('show')) {
    document.body.classList.remove('modal-open');
  }
}

function showPhotoPopup() {
  const chosen = randomItem(memoryPhotos);
  photoPopupImage.src = chosen.src;
  photoPopupText.textContent = chosen.text;
  photoPopup.classList.add('show');
  photoPopup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  clearTimeout(popupTimer);
  popupTimer = setTimeout(hidePhotoPopup, POPUP_SHOW_MS);
}

wishButton.addEventListener('click', () => {
  wishMessage.textContent = randomItem(wishes);
  launchConfetti();
});

upButton.addEventListener('click', () => {
  moveSlide(-1);
  scheduleAutoplay();
});

downButton.addEventListener('click', () => {
  moveSlide(1);
  scheduleAutoplay();
});

reelViewport.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) < 10) {
    return;
  }
  event.preventDefault();
  
  if (event.deltaY > 0) {
    moveSlide(1);
  } else {
    moveSlide(-1);
  }

  scheduleAutoplay();
}, { passive: false });

reelViewport.addEventListener('touchstart', (event) => {
  event.preventDefault();
  touchStartY = event.changedTouches[0].clientY;
}, { passive: false });

reelViewport.addEventListener('touchmove', (event) => {
  event.preventDefault();
}, { passive: false });

reelViewport.addEventListener('touchend', (event) => {
  event.preventDefault();
  touchEndY = event.changedTouches[0].clientY;
  handleSwipe();
}, { passive: false });

eggs.forEach((egg) => {
  egg.addEventListener('click', () => {
    if (egg.dataset.type === 'photo') {
      showPhotoPopup();
    } else {
      showMagicPopup(egg.dataset.message);
    }
    launchMagicBurst();
  });
});

closePopupButton.addEventListener('click', hideMagicPopup);
closePhotoPopupButton.addEventListener('click', hidePhotoPopup);
window.addEventListener('resize', setCanvasSize);

createDots();
renderReel(activeIndex);
startAutoplayNow();
setCanvasSize();


