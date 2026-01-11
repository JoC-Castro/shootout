const gameStart = new Audio(`./sounds/gameStart.mp3`);
const pistolShoot = new Audio(`./sounds/pistolShoot.m4a`);
const duelOver = new Audio(`./sounds/duelOver.mp3`);
const duelOver2 = new Audio(`./sounds/duelOver2.mp3`);
const gameStartFinal = new Audio(`./sounds/gameStartFinal.mp3`);

let shoot = document.getElementById("shoot");
let go = document.getElementById("go");
let indicador = document.getElementById("indicador");
let enemy = document.getElementById("enemy");
let hero = document.getElementById("hero");
let nivel = document.getElementById("nivel");
let restart = document.getElementById("restart");

let canShoot = false;
let reacted = false;
let preShootTimer = null;
let shootWindowTimer = null;
let stage = 1;
let gameOver = false;
let delay = 0;
let startTime = 0;
let endTime = 0;

pistolShoot.preload = 'auto';
gameStart.preload = 'auto';
gameStartFinal.preload = 'auto';
duelOver.preload = 'auto';
duelOver2.preload = 'auto';


go.hidden = false;

go.addEventListener("click", handleGoClick);
shoot.addEventListener("click", handleShootClick);
restart.addEventListener("click", handleRestartClick);


function handleGoClick() {
    if (gameOver) return;
    switch (stage) {
        case 1:
            startStage(600);
            break;
        case 2:
            startStage(400);
            break;
        case 3:
            startStage(270);
            break;
    }
}

function handleShootClick() {
    if (gameOver) return;
    reacted = true;
    shoot.hidden = true;
    
    if (!canShoot) {
        tooSoon();
        return;
    }

    clearTimeout(shootWindowTimer);
    endTime = performance.now();
    let reactionTime = Math.round(endTime - startTime);

    if (stage === 3){
        indicador.innerHTML = `¡Tu nombre será leyenda! <br> Tiempo de reacción: ${reactionTime} ms`;
    } else {
        indicador.innerHTML = `¡Eres el más rápido del oeste! <br> Tiempo de reacción: ${reactionTime} ms`;
    }
    
    pistolShootSound();
    if(stage === 3){
        duelOver2Sound();
    } else {
        duelOverSound();
    }

    enemy.src = "./imgs/enemyD.png";
    hero.src = "./imgs/heroS.png"
    indicador.style.backgroundColor = "gray";

    if (stage < 3) {
        stage++;
        nivel.textContent = `Nivel ${stage}`;
        setTimeout(updateUI, 6000);
    } else {
        gameOver = true;
        setTimeout(() => restart.hidden = false, 1500);
    }
}

function startStage(windowTime) {
    if (stage < 3) {
        gameStartSound();
    } else {
        gameStartSoundFinal();
    }

    go.hidden = true;
    shoot.hidden = false;
    indicador.textContent = "";
    indicador.style.backgroundColor = "red";

    if (stage === 3) {
        delay = Math.floor(Math.random() * 15000) + 5000;
    } else {
        delay = Math.floor(Math.random() * 9000) + 3000;
    }

    preShootTimer = setTimeout(() => {
        canShoot = true;
        enemy.src = "./imgs/enemyS.png";
        indicador.textContent = "";
        indicador.style.backgroundColor = "green";
        startTime = performance.now();

        shootWindowTimer = setTimeout(() => {
            if (!reacted) tooSlow();
        }, windowTime);
    }, delay);
}

function tooSoon() {
    clearTimeout(preShootTimer);

    indicador.textContent = `¡Demasiado pronto, vaquero!`;

    pistolShootSound();

    hero.src = "./imgs/heroE.png";
    enemy.src = "./imgs/enemyS.png"

    indicador.style.backgroundColor = "gray";
    gameOver = true;
    setTimeout(() => restart.hidden = false, 1500);
}

function tooSlow() {
    shoot.hidden = true;

    indicador.textContent = `¡Eras rápido… pero no lo suficiente!`;

    pistolShootSound();

    enemy.src = "./imgs/enemyS.png"
    hero.src = "./imgs/heroD.png";

    indicador.style.backgroundColor = "gray";
    gameOver = true;
    setTimeout(() => restart.hidden = false, 1500);
}

function pistolShootSound() {
    pistolShoot.currentTime = 0;
    pistolShoot.volume = 0.1;
    pistolShoot.play();
}

function duelOverSound() {
    duelOver.currentTime = 0;
    duelOver.volume = 0.1;
    duelOver.play();
}

function duelOver2Sound() {
    duelOver2.currentTime = 0;
    duelOver2.volume = 0.3;
    duelOver2.play();
}

function gameStartSound() {
    gameStart.currentTime = 0;
    gameStart.volume = 0.6;
    gameStart.play();
}

function gameStartSoundFinal() {
    gameStartFinal.currentTime = 0;
    gameStartFinal.volume = 0.3;
    gameStartFinal.play();
}

function updateUI() {
    hero.src = "./imgs/hero.png";
    enemy.src = "./imgs/enemy.png";

    indicador.style.backgroundColor = "";
    indicador.textContent = "";

    canShoot = false;
    reacted = false;
    preShootTimer = null;
    shootWindowTimer = null;
    go.hidden = false;
    shoot.hidden = true;
    restart.hidden = true;
    startTime = 0;
    endTime = 0;
}

function handleRestartClick() {
    location.reload();
}