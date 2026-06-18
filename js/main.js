document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const copyEmailButton = document.getElementById("copy-email");
    const downloadButton = document.getElementById("download-cv");
    const printButton = document.getElementById("print-cv");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.classList.toggle("active", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    if (copyEmailButton) {
        copyEmailButton.addEventListener("click", async () => {
            const email = copyEmailButton.dataset.copy || "";
            const originalText = copyEmailButton.textContent;

            try {
                await navigator.clipboard.writeText(email);
                copyEmailButton.textContent = "Copied";
                copyEmailButton.classList.add("copied");
            } catch (error) {
                copyEmailButton.textContent = email;
            }

            window.setTimeout(() => {
                copyEmailButton.textContent = originalText;
                copyEmailButton.classList.remove("copied");
            }, 1800);
        });
    }

    [downloadButton, printButton].forEach((button) => {
        if (button) {
            button.addEventListener("click", () => window.print());
        }
    });
});
