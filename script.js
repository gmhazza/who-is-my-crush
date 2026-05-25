// ===== Floating Hearts Background =====
function createFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['❤️', '🌸', '💕', '✨', '💗', '🌷', '💖', '🩷'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
    const duration = 6 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (duration + 2) * 1000);
  }, 600);
}

// ===== Step Management =====
function showStep(stepId) {
  const steps = ['step-name', 'step-ask', 'step-sure', 'step-reveal'];
  steps.forEach(id => {
    const el = document.getElementById(id);
    if (id === stepId) {
      el.classList.remove('hidden');
      el.classList.add('step-enter');
    } else {
      el.classList.add('hidden');
      el.classList.remove('step-enter');
    }
  });
}

// ===== Name Check =====
document.getElementById('checkBtn').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value.trim().toLowerCase();
  const wrongMsg = document.getElementById('wrongMsg');

  if (name.includes('irsa')) {
    const audio = document.getElemntById("bgMusic");
    audio.play();
    wrongMsg.classList.add('hidden');
    setTimeout(() => showStep('step-ask'), 200);
  } else {
    wrongMsg.classList.remove('hidden');
    // Shake the input
    const input = document.getElementById('nameInput');
    input.style.animation = 'none';
    input.offsetHeight; // reflow
    input.style.animation = 'shake 0.4s ease';
  }
});

// Allow pressing Enter on input
document.getElementById('nameInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('checkBtn').click();
});

// Shake animation (injected via JS)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); }
    80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== Step 2: Can I tell you something? =====
document.getElementById('yesBtn1').addEventListener('click', () => {
  setTimeout(() => showStep('step-sure'), 150);
});

document.getElementById('noBtn1').addEventListener('click', () => {
  // Playful response — button runs away
  const btn = document.getElementById('noBtn1');
  btn.textContent = 'Are you sure? 🥺';
  btn.style.background = 'linear-gradient(135deg, #FFB0B5, #FFC6CA)';
  setTimeout(() => {
    btn.textContent = 'Okay fine... yes 💕';
    btn.addEventListener('click', () => showStep('step-sure'), { once: true });
  }, 800);
});

// ===== Step 3: Are you sure? =====
document.getElementById('yesBtn2').addEventListener('click', () => {
  setTimeout(() => {
    showStep('step-reveal');
    launchConfetti();
  }, 150);
});

document.getElementById('noBtn2').addEventListener('click', () => {
  const btn = document.getElementById('noBtn2');
  btn.textContent = "Too late now 😊";
  btn.disabled = true;
  setTimeout(() => {
    showStep('step-reveal');
    launchConfetti();
  }, 900);
});

// ===== Music Player =====
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');
let isPlaying = false;

playBtn.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play().catch(() => {
      playLabel.textContent = 'Add deathbed.mp3 to folder';
    });
    playIcon.textContent = '⏸';
    playLabel.textContent = 'Playing...';
    isPlaying = true;
  } else {
    audio.pause();
    playIcon.textContent = '▶';
    playLabel.textContent = 'Play our song';
    isPlaying = false;
  }
});

// ===== Confetti =====
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FFD3D6', '#FFB0B5', '#FFC6CA', '#F9DCC0', '#FFE5E7', '#FF8FA3', '#ff6b8a'];
  const shapes = ['❤️', '🌸', '💕', '✨', '🩷'];
  const particles = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      size: 10 + Math.random() * 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
      useEmoji: Math.random() > 0.4
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.vy += 0.05; // gravity
      if (p.y > canvas.height + 30) {
        p.opacity -= 0.02;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.useEmoji) {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.shape, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(-p.size / 2, -p.size / 4, p.size, p.size / 2, 4);
        ctx.fill();
      }
      ctx.restore();
    });

    frame++;
    if (frame < 220) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// ===== Init =====
createFloatingHearts();
showStep('step-name');
