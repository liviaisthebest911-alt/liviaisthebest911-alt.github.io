import { initBackgroundFx, toggleBackgroundFx } from './effects/background.js';
import { initTyping } from './effects/typing.js';
import { initDecode } from './effects/decode.js';
import { initPostUtils } from './effects/post-utils.js';

/* =====================================================
   OLIVE JUNE MATH — MAIN SCRIPT
   Tích hợp các chức năng cũ và hiệu ứng mới (Toán/Lập trình)
   ===================================================== */

const APP_CONFIG = {
  effects: {
    background: true,
    bgStyle: 'math', // Có thể đổi thành "symbols" hoặc "life"
    mouseGlow: true,
    decode: true,
    typing: true,
    bootEffect: true
  },
  typingPhrases: [
    'Sinh viên ngành Toán - Tin @ VNU-HUS.',
    'Đam mê Java, Web Development & Thuật toán.',
    'Code is just math in disguise.',
    'Luôn học hỏi công nghệ mới, mỗi ngày.'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. KHỞI TẠO CÁC HIỆU ỨNG MỚI ---
  initNewEffects();

  // --- 2. KHỞI TẠO CÁC CHỨC NĂNG GIAO DIỆN CƠ BẢN (TỪ BẢN GỐC) ---
  initThemeToggle();
  initMobileNav();
  initTerminalLines();
  initScrollReveal();
  initCopyEmail();
  initContactForm();

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- LOGIC ĐIỀU PHỐI HIỆU ỨNG MỚI ---------- */
function initNewEffects() {
  // 1. Màn hình Boot (Chỉ chạy 1 lần mỗi phiên)
  if (APP_CONFIG.effects.bootEffect) {
    const boot = document.getElementById('boot-screen');
    if (boot) {
      if (!sessionStorage.getItem('booted')) {
        setTimeout(() => {
          boot.style.opacity = '0';
          setTimeout(() => boot.remove(), 300);
          sessionStorage.setItem('booted', 'true');
        }, 550); // Biến mất rất nhanh để không gây cản trở
      } else {
        boot.remove();
      }
    }
  }

  // 2. Kiểm tra cài đặt hệ thống (Tôn trọng prefers-reduced-motion & tiết kiệm pin mobile)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const savedFxState = localStorage.getItem('fxEnabled');

  // Mặc định: tắt trên mobile hoặc khi user giảm motion
  let isFxEnabled = savedFxState !== null ? (savedFxState === 'true') : (!isMobile && !prefersReducedMotion);

  // 3. Khởi tạo Canvas Background
  if (APP_CONFIG.effects.background) {
    initBackgroundFx(APP_CONFIG.effects.bgStyle, isFxEnabled);

    const fxBtn = document.getElementById('fxToggle');
    if (fxBtn) {
      fxBtn.style.opacity = isFxEnabled ? '1' : '0.5';
      fxBtn.addEventListener('click', () => {
        isFxEnabled = !isFxEnabled;
        localStorage.setItem('fxEnabled', isFxEnabled);
        fxBtn.style.opacity = isFxEnabled ? '1' : '0.5';
        toggleBackgroundFx(isFxEnabled);
      });
    }
  }

  // 4. Khởi tạo vầng sáng theo con trỏ chuột
  if (APP_CONFIG.effects.mouseGlow && !isMobile) {
    const glow = document.getElementById('mouse-glow');
    if (glow) {
      document.addEventListener('mousemove', (e) => {
        if(!isFxEnabled) { glow.style.opacity = '0'; return; }
        glow.style.opacity = '1';
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    }
  }

  // 5. Khởi tạo hiệu ứng Text & Trang Bài viết
  if (APP_CONFIG.effects.typing && !prefersReducedMotion) {
    initTyping(APP_CONFIG.typingPhrases);
  } else {
    const el = document.getElementById('typingText');
    if (el) el.textContent = APP_CONFIG.typingPhrases[0];
  }

  if (APP_CONFIG.effects.decode && !prefersReducedMotion) initDecode();
  initPostUtils(!prefersReducedMotion);
}


/* ---------- CÁC HÀM CŨ TỪ BẢN GỐC (GIỮ NGUYÊN HOẠT ĐỘNG) ---------- */

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

function initTerminalLines() {
  const container = document.getElementById('terminalLines');
  if (!container) return;

  const lines = [
    { prompt: '~$', text: 'whoami', type: 'cmd' },
    { text: 'olive_june_math — sinh viên Toán-Tin, VNU-HUS', type: 'out' },
    { prompt: '~$', text: 'cat skills.txt', type: 'cmd' },
    { text: 'Java · PostgreSQL · Phân tích Thuật toán', type: 'out' },
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
      console.warn('Không thể sao chép email tự động:', err);
    }
  });
}

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

    status.textContent = 'Cảm ơn bạn! Tin nhắn đã sẵn sàng gửi.';
    status.style.color = 'var(--accent)';
    form.reset();
  });
}