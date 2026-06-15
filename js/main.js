document.addEventListener("DOMContentLoaded", function() {

    // --- HIỆU ỨNG GÕ CHỮ TERMINAL ---
    const textWhoami = "whoami";
    const textCat = "cat student.json";
    let i = 0, j = 0;

    function typeWhoami() {
        if (i < textWhoami.length) {
            document.getElementById("type-whoami").innerHTML += textWhoami.charAt(i);
            i++;
            setTimeout(typeWhoami, 80);
        } else {
            setTimeout(function() {
                document.getElementById("output-whoami").style.display = "block";
                document.getElementById("line-cat").style.display = "block";
                setTimeout(typeCat, 400);
            }, 300);
        }
    }

    function typeCat() {
        if (j < textCat.length) {
            document.getElementById("type-cat").innerHTML += textCat.charAt(j);
            j++;
            setTimeout(typeCat, 80);
        } else {
            setTimeout(function() {
                document.getElementById("output-cat").style.display = "block";
                document.getElementById("line-end").style.display = "block";
            }, 300);
        }
    }

    // Khởi động gõ chữ tự động
    typeWhoami();


    // --- ĐỔI MÀU NAVBAR KHI CUỘN TRANG (.navbar.scrolled) ---
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });


    // --- MENU ĐIỀU HƯỚNG MOBILE (Hamburger Menu) ---
    const navToggle = document.getElementById("nav-toggle");
    const navMobile = document.getElementById("nav-mobile");

    if (navToggle && navMobile) {
        navToggle.addEventListener("click", function() {
            navToggle.classList.toggle("active");
            navMobile.classList.toggle("open");
        });

        // Đóng menu khi nhấp vào một link bất kỳ trên mobile
        const mobileLinks = navMobile.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", function() {
                navToggle.classList.remove("active");
                navMobile.classList.remove("open");
            });
        });
    }


    // --- HIỆU ỨNG CUỘN HIỆN HÌNH (.reveal.visible) ---
    const reveals = document.querySelectorAll(".reveal");
    function checkReveal() {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 100; // Khoảng cách kích hoạt sớm trước khi phần tử lên tới nơi

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkReveal);
    checkReveal(); // Chạy thử lần đầu ngay khi load trang
});