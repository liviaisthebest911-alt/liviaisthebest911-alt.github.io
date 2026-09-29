let canvas, ctx;
let style = 'math';
let isRunning = false;
let animationId;
let particles = [];
let lifeGrid = [];
const cols = 40, rows = 30;

export function initBackgroundFx(bgStyle, initialStart) {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    style = bgStyle;

    resize();
    window.addEventListener('resize', resize);

    // Page Visibility API để tiết kiệm tài nguyên
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopLoop();
        else if (isRunning) startLoop();
    });

    // Easter Egg: Konami hoặc phím 'g'
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    window.addEventListener('keydown', (e) => {
        if (e.key === 'g' || e.key === 'G') {
            style = style === 'life' ? 'math' : 'life';
            initData();
        }
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                style = 'life'; initData(); konamiIndex = 0;
            }
        } else { konamiIndex = 0; }
    });

    // Lắng nghe thay đổi theme để vẽ lại màu
    const observer = new MutationObserver(() => initData());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (initialStart) {
        isRunning = true;
        initData();
        startLoop();
    }
}

export function toggleBackgroundFx(enable) {
    isRunning = enable;
    if (enable) { initData(); startLoop(); }
    else { stopLoop(); ctx.clearRect(0, 0, canvas.width, canvas.height); }
}

function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    initData();
}

function initData() {
    if (!ctx) return;
    particles = [];
    const color = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#8a7482';

    if (style === 'symbols') {
        const chars = ['∑', '∫', 'π', '√', '∞', '∂', 'λ', '{', '}', '=>', '</>', '0', '1'];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                char: chars[Math.floor(Math.random() * chars.length)],
                speedY: -0.2 - Math.random() * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
                fontSize: Math.random() * 20 + 10
            });
        }
    } else if (style === 'life') {
        lifeGrid = Array(cols).fill().map(() => Array(rows).fill(0).map(() => Math.random() > 0.85 ? 1 : 0));
    }
    // "math" mode uses time functions directly
}

function drawLoop(time) {
    if (!isRunning) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const colorStr = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
    ctx.fillStyle = colorStr;
    ctx.strokeStyle = colorStr;

    if (style === 'math') {
        // Lưới tọa độ mờ
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        for(let x = 0; x < w; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for(let y = 0; y < h; y += 50) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();

        // Lissajous curve
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        const tOffset = time * 0.0005;
        for (let i = 0; i < Math.PI * 2; i += 0.05) {
            let lx = w/2 + Math.sin(3 * i + tOffset) * (w * 0.3);
            let ly = h/2 + Math.sin(2 * i) * (h * 0.3);
            if (i===0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
        }
        ctx.stroke();
    }
    else if (style === 'symbols') {
        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.fontSize}px monospace`;
            ctx.fillText(p.char, p.x, p.y);
            p.y += p.speedY;
            if (p.y < -50) p.y = h + 50;
        });
    }
    else if (style === 'life') {
        // Game of life logic (chạy chậm)
        ctx.globalAlpha = 0.05;
        const cellW = w / cols;
        const cellH = h / rows;
        if (Math.floor(time / 200) % 2 === 0) { // Update every ~200ms
            let nextGrid = lifeGrid.map(arr => [...arr]);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let neighbors = 0;
                    for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 1; y++) {
                            if (x === 0 && y === 0) continue;
                            let ni = (i + x + cols) % cols, nj = (j + y + rows) % rows;
                            neighbors += lifeGrid[ni][nj];
                        }
                    }
                    if (lifeGrid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) nextGrid[i][j] = 0;
                    else if (lifeGrid[i][j] === 0 && neighbors === 3) nextGrid[i][j] = 1;

                    if (nextGrid[i][j]) ctx.fillRect(i * cellW, j * cellH, cellW - 1, cellH - 1);
                }
            }
            lifeGrid = nextGrid;
        } else {
            // Just draw
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (lifeGrid[i][j]) ctx.fillRect(i * cellW, j * cellH, cellW - 1, cellH - 1);
                }
            }
        }
    }

    animationId = requestAnimationFrame(drawLoop);
}

function startLoop() { if (!animationId) animationId = requestAnimationFrame(drawLoop); }
function stopLoop() { cancelAnimationFrame(animationId); animationId = null; }