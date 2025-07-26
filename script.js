// Slideshow
const imagePath = 'assets/';
const len = 33;
const images = Array.from({ length: len }, (_, i) => `side${i + 1}.gif`);

function getSeed() {
	const now = new Date();
	return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function seededRandom(seed) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

function getDailyDefaultSlideIndex() {
	const seed = getSeed();
	return Math.floor(seededRandom(seed) * len) + 1;
}

let slideIndex = localStorage.getItem('slideIndex');
const dailyDefaultSlideIndex = getDailyDefaultSlideIndex();

if (!slideIndex) {
	slideIndex = dailyDefaultSlideIndex;
	localStorage.setItem('slideIndex', slideIndex);
} else {
	slideIndex = parseInt(slideIndex, 10);
	const lastAccessedDate = localStorage.getItem('lastAccessedDate');
	const currentDate = new Date().toDateString();
	if (lastAccessedDate !== currentDate) {
		slideIndex = dailyDefaultSlideIndex;
		localStorage.setItem('slideIndex', slideIndex);
	}
}

localStorage.setItem('lastAccessedDate', new Date().toDateString());
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
		s.style.transition = "opacity .7s";
	});
	localStorage.setItem('slideIndex', slideIndex);
}

setSlide(slideIndex);

// Clock
function updateClock() {
	const now = new Date();
	const day = now.toLocaleDateString('en-GB', { weekday: 'long' });
	const dayOfMonth = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const year = now.getFullYear();
	const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const dateString = `${day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()} ${dayOfMonth}-${month}-${year} ${time}`;
	document.getElementById('codes').textContent = dateString;
	setTimeout(updateClock, 1000);
}
updateClock();

// Background Animation
const canvasBody = document.getElementById("canvas");
const drawArea = canvasBody.getContext("2d");
let w, h, particles;

const opts = {
	particleColor: "rgb(143, 143, 143)",
	lineColor: "rgb(143, 143, 143)",
	particleAmount: 60,
	defaultSpeed: 0.5,
	variantSpeed: 0.5,
	defaultRadius: 2,
	variantRadius: 2,
	linkRadius: 250,
};

function resizeReset() {
	w = canvasBody.width = window.innerWidth;
	h = canvasBody.height = window.innerHeight;
}

window.addEventListener("resize", () => {
	clearTimeout(window.resizeTimeout);
	window.resizeTimeout = setTimeout(resizeReset, 200);
});

function checkDistance(x1, y1, x2, y2) {
	return Math.hypot(x2 - x1, y2 - y1);
}

function linkPoints(point1, hubs) {
	const rgb = opts.lineColor.match(/\d+/g);
	for (let i = 0; i < hubs.length; i++) {
		const distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
		const opacity = 1 - distance / opts.linkRadius;
		if (opacity > 0) {
			drawArea.lineWidth = 0.5;
			drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
			drawArea.beginPath();
			drawArea.moveTo(point1.x, point1.y);
			drawArea.lineTo(hubs[i].x, hubs[i].y);
			drawArea.stroke();
		}
	}
}

class Particle {
	constructor() {
		this.x = Math.random() * w;
		this.y = Math.random() * h;
		this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
		this.directionAngle = Math.random() * Math.PI * 2;
		this.color = opts.particleColor;
		this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
		this.vector = {
			x: Math.cos(this.directionAngle) * this.speed,
			y: Math.sin(this.directionAngle) * this.speed
		};
	}

	update() {
		this.border();
		this.x += this.vector.x;
		this.y += this.vector.y;
	}

	border() {
		if (this.x >= w || this.x <= 0) this.vector.x *= -1;
		if (this.y >= h || this.y <= 0) this.vector.y *= -1;
		this.x = Math.max(0, Math.min(w, this.x));
		this.y = Math.max(0, Math.min(h, this.y));
	}

	draw() {
		drawArea.beginPath();
		drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		drawArea.fillStyle = this.color;
		drawArea.fill();
	}
}

function setup() {
	particles = [];
	resizeReset();
	for (let i = 0; i < opts.particleAmount; i++) {
		particles.push(new Particle());
	}
	loop();
}

function loop() {
	drawArea.clearRect(0, 0, w, h);
	for (const particle of particles) {
		particle.update();
		particle.draw();
	}
	for (const particle of particles) {
		linkPoints(particle, particles);
	}
	requestAnimationFrame(loop);
}
setup();