export function initPostUtils(allowMotion) {
    // 1. Khối code: Nút copy, thêm data-lang
    document.querySelectorAll('.post-content pre').forEach(pre => {
        const code = pre.querySelector('code');
        if (code) {
            const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
            if (langClass) pre.setAttribute('data-lang', langClass.replace('language-', ''));
            else pre.setAttribute('data-lang', 'TEXT');

            // Highlight dòng đơn giản
            const lines = code.innerHTML.split('\n');
            if (lines.length > 1 && lines[lines.length-1].trim() === "") lines.pop();
            code.innerHTML = lines.map(l => `<span class="code-line">${l || ' '}</span>`).join('\n');
        }

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerText = 'Copy';
        btn.onclick = () => {
            navigator.clipboard.writeText(pre.innerText.replace('Copy', '').trim());
            btn.innerText = 'Đã chép';
            setTimeout(() => btn.innerText = 'Copy', 2000);
        };
        pre.appendChild(btn);
    });

    // 2. Math fade in on scroll
    if (allowMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Cần đợi KaTeX render xong
        setTimeout(() => {
            document.querySelectorAll('.katex-display').forEach(el => observer.observe(el));
        }, 1500);
    } else {
        setTimeout(() => {
            document.querySelectorAll('.katex-display').forEach(el => el.classList.add('visible'));
        }, 500);
    }

    // 3. Sine wave progress bar
    const canvas = document.getElementById('reading-progress-canvas');
    if (canvas && allowMotion) {
        const ctx = canvas.getContext('2d');
        const updateProgress = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = 6 * dpr;
            ctx.scale(dpr, dpr);

            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height); // 0 to 1

            const w = window.innerWidth;
            const drawW = w * scrolled;
            const accentColor = getComputedStyle(document.body).getPropertyValue('--accent').trim();

            ctx.clearRect(0, 0, w, 6);
            ctx.beginPath();
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;

            for(let x = 0; x <= drawW; x++) {
                const y = 3 + Math.sin(x * 0.05 + winScroll * 0.01) * 2;
                if(x===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Vẽ đường nền mờ
            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--surface-2').trim();
            ctx.moveTo(drawW, 3); ctx.lineTo(w, 3);
            ctx.stroke();
        };
        window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), {passive: true});
        window.addEventListener('resize', updateProgress);
        updateProgress();
    }
}