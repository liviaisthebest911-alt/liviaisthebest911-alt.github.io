'use strict';

/* =====================================================
   OLIVE JUNE MATH — MAIN SCRIPT
   1. Theme toggle (dark/light, lưu localStorage)
   2. Mobile nav toggle
   3. Hero terminal — hiệu ứng gõ chữ + dòng lệnh
   4. Scroll reveal (fade-in + skill bars)
   5. Copy email
   6. Contact form (client-side demo)
   7. Footer year
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initHeroTyping();
  initTerminalLines();
  initScrollReveal();
  initCopyEmail();
  initContactForm();
  document.getElementById('footerYear').textContent = new Date().getFullYear();
});

/* ---------- 1. Theme toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ---------- 2. Mobile nav ---------- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 3. Hero typing effect ---------- */
function initHeroTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Đam mê Python & Java.',
    'Thích thuật toán & cấu trúc dữ liệu.',
    'Đang xây dựng portfolio này từ đầu.',
    'Luôn học hỏi công nghệ mới, mỗi ngày.',
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 55);
  }

  tick();
}

/* ---------- 4. Terminal panel lines ---------- */
function initTerminalLines() {
  const container = document.getElementById('terminalLines');
  if (!container) return;

  const lines = [
    { prompt: '~$', text: 'whoami', type: 'cmd' },
    { text: 'olive_june_math — sinh viên CNTT, VNU-HUS', type: 'out' },
    { prompt: '~$', text: 'cat skills.txt', type: 'cmd' },
    { text: 'Python · Java · Toán ứng dụng', type: 'out' },
    { prompt: '~$', text: './build_future.sh', type: 'cmd' },
    { text: '# đang chạy... từng bước một, mỗi ngày', type: 'comment' },
  ];

  lines.forEach((line, i) => {
    const span = document.createElement('span');
    span.className = 'line';
    span.style.animationDelay = `${i * 260 + 300}ms`;

    if (line.type === 'cmd') {
      span.innerHTML = `<span class="prompt">${line.prompt}</span>${escapeHtml(line.text)}`;
    } else if (line.type === 'comment') {
      span.innerHTML = `<span class="comment">${escapeHtml(line.text)}</span>`;
    } else {
      span.innerHTML = `<span class="out">${escapeHtml(line.text)}</span>`;
    }
    container.appendChild(span);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- 5. Scroll reveal ---------- */
function initScrollReveal() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const barEls = document.querySelectorAll('.skill-bar');

  if (!('IntersectionObserver' in window)) {
    fadeEls.forEach((el) => el.classList.add('in-view'));
    barEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
  );

  fadeEls.forEach((el) => observer.observe(el));
  barEls.forEach((el) => observer.observe(el));
}

/* ---------- 6. Copy email ---------- */
function initCopyEmail() {
  const btn = document.getElementById('copyBtn');
  const emailLink = document.getElementById('emailLink');
  if (!btn || !emailLink) return;

  btn.addEventListener('click', async () => {
    const email = emailLink.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const original = btn.textContent;
      btn.textContent = 'Đã sao chép!';
      setTimeout(() => { btn.textContent = original; }, 1800);
    } catch (err) {
      // Trình duyệt không hỗ trợ Clipboard API — im lặng bỏ qua
      console.warn('Không thể sao chép email tự động:', err);
    }
  });
}

/* ---------- 7. Contact form (demo phía client) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Vui lòng điền đầy đủ thông tin hợp lệ.';
      status.style.color = 'var(--danger)';
      return;
    }

    // Demo: chưa nối backend/email service thật.
    // Có thể thay đoạn này bằng fetch() gọi Formspree, EmailJS, hoặc API riêng.
    status.textContent = 'Cảm ơn bạn! Tin nhắn đã sẵn sàng gửi (demo — chưa nối dịch vụ email thật).';
    status.style.color = 'var(--accent)';
    form.reset();
  });
}