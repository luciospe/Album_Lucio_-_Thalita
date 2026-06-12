/**
 * MEMÓRIAS — Lucio & Thalita
 * Álbum Digital Romântico
 * script.js
 */

/* =============================================
   ESTADO GLOBAL
============================================== */
let coverDismissed = false;
let scrollY = 0;

/* =============================================
   ABERTURA: Efeito de abrir o álbum ao rolar
============================================== */
function initCover() {
  const cover = document.getElementById('cover');
  if (!cover) return;

  // Esconde a capa ao rolar pela primeira vez
  const onFirstScroll = () => {
    if (coverDismissed) return;

    const scrolled = window.scrollY;
    if (scrolled > 5) {
      coverDismissed = true;
      cover.classList.add('hidden');

      // Remove o listener depois de usado
      window.removeEventListener('scroll', onFirstScroll);
    }
  };

  window.addEventListener('scroll', onFirstScroll, { passive: true });

  // Também suporta toque em mobile
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (coverDismissed) return;
    const diff = touchStartY - e.touches[0].clientY;
    if (diff > 10) {
      coverDismissed = true;
      cover.classList.add('hidden');
    }
  }, { passive: true });
}

/* =============================================
   REVEAL ON SCROLL — IntersectionObserver
============================================== */
function initReveal() {
  const items = document.querySelectorAll('.reveal-item');

  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Para itens que só precisam aparecer uma vez:
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  items.forEach((item) => observer.observe(item));
}

/* =============================================
   PARALLAX SUAVE nas polaroids
============================================== */
function initParallax() {
  const polaroids = document.querySelectorAll('.polaroid-wrap');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;

    polaroids.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const dist = (rect.top + rect.height / 2) - center;
      const factor = (i % 2 === 0) ? 0.04 : -0.04;
      const shift = dist * factor;
      const baseRot = parseFloat(getComputedStyle(el).getPropertyValue('--rot') || '0');

      el.style.transform = `rotate(${baseRot}deg) translateY(${shift}px)`;
    });
  }, { passive: true });
}

/* =============================================
   PARTÍCULAS DE CORAÇÕES FLUTUANTES
============================================== */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['♡', '♥', '✦', '·'];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    // Posição e velocidade aleatória
    const x = Math.random() * 100;
    const dur = 7 + Math.random() * 10; // entre 7s e 17s
    const delay = Math.random() * 12;   // atraso aleatório

    el.style.setProperty('--x', `${x}%`);
    el.style.setProperty('--dur', `${dur}s`);
    el.style.setProperty('--delay', `${delay}s`);

    container.appendChild(el);
  }
}

/* =============================================
   EFEITO DE ESCRITA LETRA A LETRA na capa
   (reforça a animação CSS com um typewriter JS)
============================================== */
function initTypewriter() {
  const el = document.getElementById('coverLabel');
  if (!el) return;

  const text = 'MEMÓRIAS';
  el.textContent = '';
  el.style.opacity = '1';
  el.style.animation = 'none';
  el.style.transform = 'translateY(0)';

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
      // Remove o cursor depois de terminar
      setTimeout(() => {
        el.classList.remove('typewriter');
      }, 2000);
    }
  }, 120);
}

/* =============================================
   EFEITO HOVER nas páginas escuras:
   leve mudança de brilho ao passar o mouse
============================================== */
function initPageHover() {
  const darkPages = document.querySelectorAll('.page-dark');

  darkPages.forEach((page) => {
    page.addEventListener('mousemove', (e) => {
      const rect = page.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      page.style.backgroundImage =
        `radial-gradient(circle at ${x}% ${y}%, #2a2a2a 0%, #1a1a1a 60%)`;
    });

    page.addEventListener('mouseleave', () => {
      page.style.backgroundImage = '';
    });
  });
}

/* =============================================
   CURSOR PERSONALIZADO (coração suave)
============================================== */
function initCustomCursor() {
  // Cria o cursor
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 8px;
    height: 8px;
    background: rgba(201, 168, 76, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease, opacity 0.2s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Expande no hover de elementos interativos
  document.querySelectorAll('.polaroid, .gallery-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(4)';
      cursor.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
    });
  });
}

/* =============================================
   INICIALIZAÇÃO
============================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Aguarda um frame para garantir que o CSS está aplicado
  requestAnimationFrame(() => {
    initCover();
    initTypewriter();
    initReveal();
    initParticles();
    initParallax();
    initPageHover();

    // Cursor customizado apenas em desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      initCustomCursor();
    }
  });
});

/* =============================================
   SCROLL SUAVE PARA ACESSIBILIDADE
   (caso alguém use tab/enter no scroll hint)
============================================== */
document.getElementById('scrollHint')?.addEventListener('click', () => {
  coverDismissed = true;
  document.getElementById('cover')?.classList.add('hidden');
  setTimeout(() => {
    document.getElementById('page1')?.scrollIntoView({ behavior: 'smooth' });
  }, 600);
});
