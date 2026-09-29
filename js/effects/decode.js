export function initDecode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    document.querySelectorAll('.decode-trigger').forEach(el => {
        const originalText = el.innerText;
        el.dataset.original = originalText;

        const runEffect = () => {
            let iteration = 0;
            clearInterval(el.interval);
            el.interval = setInterval(() => {
                el.innerText = originalText.split("").map((letter, index) => {
                    if(index < iteration) return originalText[index];
                    return letters[Math.floor(Math.random() * 42)];
                }).join("");
                if(iteration >= originalText.length) clearInterval(el.interval);
                iteration += 1 / 3;
            }, 30);
        };

        // Chạy lần đầu
        runEffect();

        // Hover nếu không bị khóa once
        if (el.getAttribute('data-decode-once') !== 'true') {
            el.addEventListener('mouseover', runEffect);
        }
    });
}