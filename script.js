const mesaDeJuego = document.querySelector("#mesaDeJuego"); //ID de canvas tag
const ctx = mesaDeJuego.getContext("2d");
const puntuacion = document.querySelector("#puntuacion");
const btn1 = document.querySelector("#btn1");
const serpiente = document.querySelector(".serpiente");
const comidaSerpiente = document.querySelector("#comidaSerpiente");

let comida = "#bd0003";
let colorSerpinte = "#c0ff80";
let colorBordeSerpiente = "#2a8c4a";
let colorFondo = "#d4e6f1";
const anchoMax = mesaDeJuego.width;
const altoMax = mesaDeJuego.height;
const unidad = 25; // unidad en px
let movimiento = false;
let movimientoX = unidad;
let movimientoY = 0;
let comidaX;
let comidaY;
let puntuacionInicial = 0;
let velocidad = 150; //valor expresado en milisegundos
let cuerpoSerpiente = [
	{ x: unidad * 2, y: 0 },
	{ x: unidad * 1, y: 0 },
	{ x: 0, y: 0 },
];

dibujarComida = () => {
	ctx.fillStyle = comida;
	ctx.fillRect(comidaX, comidaY, unidad, unidad);
};
crearComida = () => {
	comidaRandom = (min, max) => {
		const random =
			Math.round((Math.random() * (max - min) + min) / unidad) * unidad;
		return random;
	};
	comidaX = comidaRandom(0, anchoMax - unidad);
	comidaY = comidaRandom(0, altoMax - unidad);
};
siguienteComida = () => {
	if (running) {
		setTimeout(() => {
			limpiarJuego();
			dibujarComida();
			moverSerpiente();
			dibujarSerpiente();
			juegoTerminado();
			juegoTerminado2();
			siguienteComida();
		}, velocidad);
	} else {
		mostrarJuegoTerminado();
	}
};
empezar = () => {
	puntuacionInicial = 0;
	movimientoX = unidad;
	movimientoY = 0;
	cuerpoSerpiente = [
		{ x: unidad * 2, y: 0 },
		{ x: unidad * 1, y: 0 },
		{ x: 0, y: 0 },
	];
	comenzarJuego();
};

comenzarJuego = () => {
	running = true;
	puntuacion.textContent = puntuacionInicial;
	crearComida();
	dibujarComida();
	siguienteComida();
};

limpiarJuego = () => {
	ctx.fillStyle = colorFondo;
	ctx.fillRect(0, 0, anchoMax, altoMax);
};

dibujarSerpiente = () => {
	ctx.fillStyle = colorSerpinte;
	ctx.strokeStyle = colorBordeSerpiente;
	cuerpoSerpiente.forEach((parteSerpiente) => {
		ctx.fillRect(parteSerpiente.x, parteSerpiente.y, unidad, unidad);
		ctx.strokeRect(parteSerpiente.x, parteSerpiente.y, unidad, unidad);
	});
};

moverSerpiente = () => {
	let cabeza = {
		x: cuerpoSerpiente[0].x + movimientoX,
		y: cuerpoSerpiente[0].y + movimientoY,
	};
	cuerpoSerpiente.unshift(cabeza);
	if (cuerpoSerpiente[0].x == comidaX && cuerpoSerpiente[0].y == comidaY) {
		puntuacionInicial += 10;
		puntuacion.textContent = puntuacionInicial;
		crearComida();
		storage();
	} else {
		cuerpoSerpiente.pop();
	}
};

cambioDireccion = (e) => {
	let flecha = e.keyCode;
	const izq = 37;
	const arriba = 38;
	const der = 39;
	const abajo = 40;

	const moverIzq = movimientoX === -unidad;
	const moverArr = movimientoY === -unidad;
	const moverDer = movimientoX === unidad;
	const moverAb = movimientoY === unidad;

	switch (true) {
		case flecha == izq && !moverDer:
			movimientoX = -unidad;
			movimientoY = 0;
			break;
		case flecha == der && !moverIzq:
			movimientoX = unidad;
			movimientoY = 0;
			break;
		case flecha == arriba && !moverAb:
			movimientoX = 0;
			movimientoY = -unidad;
			break;
		case flecha == abajo && !moverArr:
			movimientoX = 0;
			movimientoY = unidad;
			break;
	}
};

juegoTerminado = () => {
	switch (true) {
		case cuerpoSerpiente[0].x < 0:
			running = false;
			break;
		case cuerpoSerpiente[0].x >= anchoMax:
			running = false;
			break;
		case cuerpoSerpiente[0].y < 0:
			running = false;
			break;
		case cuerpoSerpiente[0].y >= altoMax:
			running = false;
			break;
	}
};

juegoTerminado2 = () => {
	for (let i = 1; i < cuerpoSerpiente.length; i += 1) {
		if (
			cuerpoSerpiente[i].x == cuerpoSerpiente[0].x &&
			cuerpoSerpiente[i].y == cuerpoSerpiente[0].y
		) {
			running = false;
		}
	}
};

mostrarJuegoTerminado = () => {
	Swal.fire({
		position: "top",
		icon: "warning",
		title: ` Tu puntuación es ${puntuacionInicial}`,
		text: "Lo siento, perdiste el juego",
		showConfirmButton: false,
		timer: 2000,
	});
	running = false;
};

storage = () => {
	let carga = 0;
	let i = 0;
	let punt = puntuacionInicial;
	do {
		carga++;
	} while (i < 0);
	localStorage.setItem(`carga${carga}`, `punaje: ${punt}`);
};

crearComida();
dibujarComida();

window.addEventListener("keydown", cambioDireccion);
btn1.addEventListener("click", empezar);
