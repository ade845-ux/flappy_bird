//Contexte graphic
const cvs = document.getElementById("zone_de_dessin");
cvs.width = 300;
cvs.height = 400;
const ctx = cvs.getContext("2d");

// Images                                                                                                                                                                                                         

const imageArrirePlan = new Image();
imageArrirePlan.src = "images/arrierePlan.png";

const imageAvantPlan = new Image();
imageAvantPlan.src = "images/avantPlan.png";

const imageTuyauBas = new Image();
imageTuyauBas.src = "images/tuyauBas.png";

const imageTuyauHaut = new Image();
imageTuyauHaut.src = "images/tuyauHaut.png";

const imageOiseau1 = new Image();
imageOiseau1.src = "images/oiseau1.png";

const imageOiseau2 = new Image();
imageOiseau2.src = "images/oiseau2.png";

// SON
const sonGameover = new Audio();
sonGameover.src = "sons/sonGameover.mp3";
const sonVole = new Audio();
sonVole.src = "sons/sonVole.mp3";
const sonChoc = new Audio();
sonChoc.src = "sons/sonChoc.mp3";
const sonScore = new Audio();
sonScore.src = "sons/sonScore.mp3";
const sonFond = new Audio();
sonFond.src = "sons/sonFond.mp3"
sonFond.loop = true;
sonFond.volume = 0.3;

// Recommence le son depuis le début à chaque saut.
function joueSonVole() {
    sonVole.currentTime = 0;
    sonVole.play();
}

//Paramètre des tuyaux
const largeurTuyau = 40;
const ecartTuyau = 80;

let tabTuyaux = [];
tabTuyaux[0]= {
    x : cvs.width ,
    y: cvs.height - 150
}
// Paramettre de l'oiseau
let xOiseau = 100;
let yOiseau = 150;
const gravite = 1;
let OiseauMonte = 0;
const largeurOiseau = 34;
const hauteurOiseau = 24;

// parametre jeu
let finDuJeu = false;
let score = 0;

// Défilement du décor (Parallaxe)
let xFond = 0;
const vitesseFond = 0.3; // Ciel lent en arrière-plan
let xSol = 0;
const vitesseSol = 1;    // Sol calé sur la vitesse des tuyaux

// Gestion de la Pause
let enPause = false;

function togglePause() {
    if (finDuJeu) return;
    enPause = !enPause;
    if (enPause) {
        sonFond.pause();
    } else {
        sonFond.play();
    }
}

// Détecte si le clic est sur le bouton pause en haut à droite
function estClicSurPause(e) {
    const rect = cvs.getBoundingClientRect();
    const scaleX = cvs.width / rect.width;
    const scaleY = cvs.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    return (clickX >= 250 && clickX <= 295 && clickY >= 10 && clickY <= 55);
}

//fonction fesant le saut d'oiseau
function saut(){
    if (sonFond.paused && !enPause) {
        sonFond.play();
    }
    if(finDuJeu === false && enPause === false){
        OiseauMonte = 10;
        yOiseau = yOiseau - 25;
    } else if (finDuJeu === true) {
        setTimeout(rechargeLeJeu, 500);
    }
}

// Saut par Espace et touche P pour Pause
document.addEventListener("keydown", (e) => {
    if (e.code === "KeyP") {
        togglePause();
    } else if (e.code === "Space") {
        if (!enPause) {
            saut();
            joueSonVole();
        }
    }
});

// Clic souris / tactile mobile
document.addEventListener("click", (e) => {
    if (finDuJeu) {
        setTimeout(rechargeLeJeu, 500);
        return;
    }

    // Si on clique sur l'icône pause en haut à droite
    if (estClicSurPause(e)) {
        togglePause();
        return;
    }

    // Si le jeu est en pause, cliquer n'importe où reprend la partie
    if (enPause) {
        togglePause();
        return;
    }

    saut();
    joueSonVole();
});
//recharger le game 
function rechargeLeJeu() {
    finDuJeu = false;
    location.reload();
}

// Dessin
function dessine(){
    // 1. Défilement de l'arrière-plan (Ciel lent)
    if (finDuJeu === false && enPause === false) {
        xFond -= vitesseFond;
        if (xFond <= -cvs.width) xFond = 0;
    }
    ctx.drawImage(imageArrirePlan, xFond, 0);
    ctx.drawImage(imageArrirePlan, xFond + cvs.width, 0);

    // Gestion des tuyaux
    for(let i = 0; i < tabTuyaux.length; i++){
        if (enPause === false) {
            tabTuyaux[i].x--;
        }

        // Dessin du tuyau
        ctx.drawImage(imageTuyauBas, tabTuyaux[i].x, tabTuyaux[i].y);
        ctx.drawImage(imageTuyauHaut, tabTuyaux[i].x, tabTuyaux[i].y - ecartTuyau - imageTuyauHaut.height);

        // Nouveau tuyau + hauteur random
        if (enPause === false) {
            if (tabTuyaux[i].x === 100) {
                tabTuyaux.push({
                    x: cvs.width,
                    y: Math.floor(100 + Math.random() * 100)
                });
            } else if (tabTuyaux[i].x + largeurTuyau < 0) {
                tabTuyaux.splice(i, 1);
                i--;
                continue;
            }

            // Gestion des collisions
            const collisionHorizontale =
                xOiseau + largeurOiseau >= tabTuyaux[i].x &&
                xOiseau <= tabTuyaux[i].x + largeurTuyau;
            const collisionVerticale =
                yOiseau + hauteurOiseau > tabTuyaux[i].y ||
                yOiseau < tabTuyaux[i].y - ecartTuyau;

            if (yOiseau < 0 || yOiseau + hauteurOiseau > 300 ||
                (collisionHorizontale && collisionVerticale)) {
                    sonChoc.play();
                    finDuJeu = true;
            }

            // Gestion du score
            if (xOiseau === tabTuyaux[i].x + largeurTuyau + 5) {
                score++;
                sonScore.play();
            }
        }
    }

    // 2. Défilement du sol (Avant-plan calé sur les tuyaux)
    if (finDuJeu === false && enPause === false) {
        xSol -= vitesseSol;
        if (xSol <= -cvs.width) xSol = 0;
    }
    const ySol = cvs.height - imageAvantPlan.height;
    ctx.drawImage(imageAvantPlan, xSol, ySol);
    ctx.drawImage(imageAvantPlan, xSol + cvs.width, ySol);

    // Mouvement de l'oiseau
    if (enPause === false) {
        yOiseau = yOiseau + gravite;
        if (OiseauMonte > 0) {
            OiseauMonte--;
        }
    }

    if (OiseauMonte > 0) {
        ctx.drawImage(imageOiseau2, xOiseau, yOiseau);
    } else {
        ctx.drawImage(imageOiseau1, xOiseau, yOiseau);
    }

    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, cvs.width, cvs.height);

    // AFFICHAGE SCORE
    ctx.textAlign = "center";
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("Score : " + score, cvs.width / 2, 40);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText("Score : " + score, cvs.width / 2, 40);

    // BOUTON PAUSE EN HAUT À DROITE
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(enPause ? "▶" : "⏸", 275, 40);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeText(enPause ? "▶" : "⏸", 275, 40);

    // ÉCRAN DE PAUSE
    if (enPause) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("PAUSE", cvs.width / 2, 190);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText("PAUSE", cvs.width / 2, 190);

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#f1c40f";
        ctx.fillText("Touchez pour reprendre", cvs.width / 2, 230);
        ctx.strokeText("Touchez pour reprendre", cvs.width / 2, 230);
    }

    if(finDuJeu === false){
      requestAnimationFrame(dessine);
      
    } else{
        // son de game over
        sonFond.pause();
        setTimeout(() => {
            sonGameover.play();
        }, 1000); 

        // AFFICHAGE GAME OVER 
        ctx.textAlign = "center";

        ctx.font = "bold 34px sans-serif";
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("GAME OVER", cvs.width / 2, 180);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeText("GAME OVER", cvs.width / 2, 180);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "white";
        ctx.fillText("Score final : " + score, cvs.width / 2, 220);
        ctx.strokeText("Score final : " + score, cvs.width / 2, 220);

        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#f1c40f";
        ctx.fillText("Touchez pour recommencer", cvs.width / 2, 255);
        ctx.strokeText("Touchez pour recommencer", cvs.width / 2, 255);
    }
      
   
}
dessine()
