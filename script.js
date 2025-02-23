// clock update
const imagePath = 'assets/';
const len = 23;
const images = Array.from({ length: len }, (_, i) => `side${i + 1}.gif`);

// Function to generate a seed based on the current date
function getSeed() {
	const now = new Date();
	return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Seeded random number generator
function seededRandom(seed) {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
}

const seed = getSeed();
let slideIndex = Math.floor(seededRandom(seed) * len) + 1; // Set a seeded random slide index
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

function updateClock() {
	const now = new Date();
	const day = now.toLocaleDateString('en-GB', { weekday: 'long' }).charAt(0).toUpperCase() + now.toLocaleDateString('en-GB', { weekday: 'long' }).slice(1).toLowerCase();
	const dateString = `${day} ${now.toLocaleDateString()} ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
	document.getElementById('codes').textContent = dateString;
	setTimeout(updateClock, 1000);
}

setSlide(slideIndex);
updateClock();

// background
let resizeReset = function () {
	w = canvasBody.width = window.innerWidth;
	h = canvasBody.height = window.innerHeight;
}

const opts = {
	particleColor: "rgb(143, 143, 143)",
	lineColor: "rgb(143, 143, 143)",
	particleAmount: 50,
	defaultSpeed: 0.5,
	variantSpeed: 0.5,
	defaultRadius: 2,
	variantRadius: 2,
	linkRadius: 250,
};

window.addEventListener("resize", function () {
	deBouncer();
});

let deBouncer = function () {
	clearTimeout(tid);
	tid = setTimeout(function () {
		resizeReset();
	}, delay);
};

let checkDistance = function (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

let linkPoints = function (point1, hubs) {
	for (let i = 0; i < hubs.length; i++) {
		let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
		let opacity = 1 - distance / opts.linkRadius;
		if (opacity > 0) {
			drawArea.lineWidth = 0.5;
			drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
			drawArea.beginPath();
			drawArea.moveTo(point1.x, point1.y);
			drawArea.lineTo(hubs[i].x, hubs[i].y);
			drawArea.closePath();
			drawArea.stroke();
		}
	}
}

Particle = function (xPos, yPos) {
	this.x = Math.random() * w;
	this.y = Math.random() * h;
	this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
	this.directionAngle = Math.floor(Math.random() * 360);
	this.color = opts.particleColor;
	this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
	this.vector = {
		x: Math.cos(this.directionAngle) * this.speed,
		y: Math.sin(this.directionAngle) * this.speed
	};
	this.update = function () {
		this.border();
		this.x += this.vector.x;
		this.y += this.vector.y;
	};
	this.border = function () {
		if (this.x >= w || this.x <= 0) {
			this.vector.x *= -1;
		}
		if (this.y >= h || this.y <= 0) {
			this.vector.y *= -1;
		}
		if (this.x > w) this.x = w;
		if (this.y > h) this.y = h;
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
	};
	this.draw = function () {
		drawArea.beginPath();
		drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		drawArea.closePath();
		drawArea.fillStyle = this.color;
		drawArea.fill();
	};
};

function setup() {
	particles = [];
	resizeReset();
	for (let i = 0; i < opts.particleAmount; i++) {
		particles.push(new Particle());
	}
	window.requestAnimationFrame(loop);
}

function loop() {
	window.requestAnimationFrame(loop);
	drawArea.clearRect(0, 0, w, h);
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
	}
	for (let i = 0; i < particles.length; i++) {
		linkPoints(particles[i], particles);
	}
}

const canvasBody = document.getElementById("canvas"),
	drawArea = canvasBody.getContext("2d");
let delay = 200, tid,
	rgb = opts.lineColor.match(/\d+/g);
resizeReset();
setup();