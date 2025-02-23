const imagePath = 'assets/';
const len = 23;
const images = Array.from({ length: len }, (_, i) => `side${i + 1}.gif`);
let slideIndex = Number(localStorage.getItem('slideIndex')) || 1;
const slideshow = document.getElementById('slideshow');

images.forEach((img, i) => {
    slideshow.innerHTML += `<div class="mySlides"><img src="${imagePath}${img}" style="cursor:pointer;" onclick="changeSlide(1)"></div>`;
});

function changeSlide(n) {
    setSlide(slideIndex + n);
}

function setSlide(n) {
    const slides = document.getElementsByClassName("mySlides");
    slideIndex = (n > slides.length) ? 1 : (n < 1) ? slides.length : n;
    [...slides].forEach((s, i) => {
        s.style.opacity = i === slideIndex - 1 ? "1" : "0";
        s.style.transition = "opacity .5s";
    });
    localStorage.setItem('slideIndex', slideIndex);
}

function updateClock() {
    const now = new Date();
    const day = now.toLocaleDateString('en-GB', { weekday: 'long' }).toUpperCase();
    const dateString = `${day} ${now.toLocaleDateString()} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    document.getElementById('codes').textContent = dateString;
    setTimeout(updateClock, 1000);
}

setSlide(slideIndex);
updateClock();