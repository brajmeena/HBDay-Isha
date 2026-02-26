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

let activeIndex = 0;
let autoplay;
let confettiPieces = [];
let animationId;
let touchStartY = 0;
let touchEndY = 0;
let popupTimer;

const wishes = [
  'Wishing you endless laughter, love, and magical adventures! 💖',
  'May your year be as bright as your smile and as wild as Hogwarts nights! 🌟',
  'Happy Birthday! You deserve all the joy, cake, and confetti in the world! 🎂'
];

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
      resetAutoplay();
    });
    dotsWrapper.appendChild(dot);
  });
}

function resetAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => moveSlide(1), 4000);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
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

  resetAutoplay();
}

function hideMagicPopup() {
  popup.classList.remove('show');
  popup.setAttribute('aria-hidden', 'true');
}

function showMagicPopup(message) {
  popupText.textContent = message || 'Magic found! ✨';
  popup.classList.add('show');
  popup.setAttribute('aria-hidden', 'false');
  clearTimeout(popupTimer);
  popupTimer = setTimeout(hideMagicPopup, 3800);
}

wishButton.addEventListener('click', () => {
  wishMessage.textContent = randomItem(wishes);
  launchConfetti();
});

upButton.addEventListener('click', () => {
  moveSlide(-1);
  resetAutoplay();
});

downButton.addEventListener('click', () => {
  moveSlide(1);
  resetAutoplay();
});

reelViewport.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) < 10) {
    return;
  }

  if (event.deltaY > 0) {
    moveSlide(1);
  } else {
    moveSlide(-1);
  }

  resetAutoplay();
}, { passive: true });

reelViewport.addEventListener('touchstart', (event) => {
  touchStartY = event.changedTouches[0].clientY;
});

reelViewport.addEventListener('touchend', (event) => {
  touchEndY = event.changedTouches[0].clientY;
  handleSwipe();
});

eggs.forEach((egg) => {
  egg.addEventListener('click', () => {
    showMagicPopup(egg.dataset.message);
    launchConfetti();
  });
});

closePopupButton.addEventListener('click', hideMagicPopup);
window.addEventListener('resize', setCanvasSize);

createDots();
renderReel(activeIndex);
resetAutoplay();
setCanvasSize();