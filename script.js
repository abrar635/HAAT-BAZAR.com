let slideIndex = 0;
let slides = document.querySelector(".slides");
let dots = document.querySelectorAll(".dot");
let totalSlides = document.querySelectorAll(".slides a").length;
let slideWidth = document.querySelector(".slides a").offsetWidth;
let interval;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let isDragging = false;
let isClick = true; // Track if it’s a click or a drag

// Disable image dragging inside links (Prevents unwanted behavior)
document.querySelectorAll(".slides a img").forEach(img => {
    img.setAttribute("draggable", false);
});

// Function to Show Slide Properly
function showSlides(index) {
    if (index >= totalSlides) slideIndex = 0;
    if (index < 0) slideIndex = totalSlides - 1;

    currentTranslate = -slideIndex * slideWidth;
    slides.style.transition = "transform 0.3s ease-out"; // Smooth transition
    slides.style.transform = `translateX(${currentTranslate}px)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add("active");
    }
}

// Next & Previous Slide
function plusSlides(n) {
    resetAutoSlide();
    slideIndex += n;
    showSlides(slideIndex);
}

// Go to Specific Slide (Dots)
function currentSlide(n) {
    resetAutoSlide();
    slideIndex = n;
    showSlides(slideIndex);
}

// Auto Slide
function autoSlide() {
    interval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000);
}

// Reset Auto-Slide (Fixes the bug)
function resetAutoSlide() {
    clearInterval(interval);
    autoSlide();
}

// Initialize Slider
document.addEventListener("DOMContentLoaded", () => {
    slideWidth = document.querySelector(".slides a").offsetWidth;
    slides.style.width = `${totalSlides * slideWidth}px`;
    showSlides(slideIndex);
    autoSlide();
});

// Adjust Slide Width on Resize
window.addEventListener("resize", () => {
    slideWidth = document.querySelector(".slides a").offsetWidth;
    showSlides(slideIndex);
});

// **DRAGGING FUNCTIONALITY (TOUCH + MOUSE)**

// Start Dragging
function startDrag(e) {
    e.preventDefault(); // Prevent unintended behaviors like link dragging
    startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    isDragging = true;
    isClick = true; // Assume it's a click until movement happens
    prevTranslate = currentTranslate;
    slides.style.transition = "none"; // Remove transition for smooth dragging
    clearInterval(interval); // Pause auto-slide while dragging
}

// Dragging Movement
function moveDrag(e) {
    if (!isDragging) return;
    let moveX = (e.type.includes("touch") ? e.touches[0].clientX : e.clientX) - startX;

    if (Math.abs(moveX) > 10) { // If moved more than 10px, it's a drag, not a click
        isClick = false;
    }

    currentTranslate = prevTranslate + moveX;
    slides.style.transform = `translateX(${currentTranslate}px)`;
}

// Stop Dragging and Snap to Nearest Slide
function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    let moveX = (e.type.includes("touch") ? e.changedTouches[0].clientX : e.clientX) - startX;

    if (isClick) {
        // Allow link to work if it’s a click
        return;
    }

    if (moveX > 50) {
        slideIndex--; // Swipe Right (Previous)
    } else if (moveX < -50) {
        slideIndex++; // Swipe Left (Next)
    }

    showSlides(slideIndex);
    resetAutoSlide(); // Restart auto-slide after drag
}

// Prevent Click During Drag
document.querySelectorAll(".slides a").forEach(link => {
    link.addEventListener("click", (e) => {
        if (!isClick) {
            e.preventDefault(); // Prevent link click if it was a drag
        }
    });
});

// Add Event Listeners for Touch and Mouse
slides.addEventListener("pointerdown", startDrag);
slides.addEventListener("pointermove", moveDrag);
slides.addEventListener("pointerup", endDrag);
slides.addEventListener("pointerleave", endDrag);

// **TOUCH SUPPORT FOR MOBILE (Adjust for mobile)**

// For touch, we'll explicitly handle start, move, and end
slides.addEventListener("touchstart", startDrag);
slides.addEventListener("touchmove", moveDrag);
slides.addEventListener("touchend", endDrag);

// For mobile, prevent dragging on links that will open a page
document.querySelectorAll(".slides a").forEach(link => {
    link.addEventListener("click", (e) => {
        if (!isClick) {
            e.preventDefault(); // Prevent link click if it was a drag
        }
    });
});

// **ARROW KEY SUPPORT**
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        plusSlides(1);
    } else if (e.key === "ArrowLeft") {
        plusSlides(-1);
    }
});
