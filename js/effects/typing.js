export function initTyping(phrases) {
    const el = document.getElementById('typingText'); // Giả sử HTML cũ có ID này ở hero
    if (!el || !phrases.length) return;
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) charIndex--; else charIndex++;

        el.textContent = current.substring(0, charIndex);

        let speed = isDeleting ? 30 : 70;
        if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }

        setTimeout(type, speed);
    }
    setTimeout(type, 1000);
}