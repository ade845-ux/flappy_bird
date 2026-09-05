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
const sonVole = new Audio();
sonVole.src = "sons/sonVole.mp3";
const sonChoc = new Audio();
sonChoc.src = "sons/sonChoc.mp3";
const sonScore = new Audio();
sonScore.src = "sons/sonScore.mp3";

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

//fonction fesant le saut d'oiseau
function saut(){
 // console.log(e)
 if(finDuJeu=== false){
    OiseauMonte =10  ;
    yOiseau = yOiseau -25;

 } else{
   setTimeout(rechargeLeJeu,500)
 }
  

}
// Saut par sapce
document.addEventListener("keypress" ,(e)=>{
    if (e.code==="Space") {
        saut()
        // Joue le son lorsque le joueur appuie sur Espace.
        joueSonVole()

    }else{
        return;
        
    }

})
// Saut avec click droit 
document.addEventListener ("click",() =>{
  saut();
    // Joue le son lorsque le joueur clique.
    joueSonVole()
  

})
//recharger le game 
function rechargeLeJeu() {
    finDuJeu = false;
    location.reload();
}

// Dessin
function dessine(){
    ctx.drawImage(imageArrirePlan,0,0);
    // Gestion des tuyau
    for(let i= 0;i < tabTuyaux.length;i++){
        tabTuyaux[i].x-- ;

        //Dessin du tuyau
        ctx.drawImage(imageTuyauBas,tabTuyaux[i].x,tabTuyaux[i].y);
        ctx.drawImage(imageTuyauHaut,tabTuyaux[i].x,tabTuyaux[i].y-ecartTuyau-imageTuyauHaut.height);
        //nouveau tuyeau+hauteur random
        if (tabTuyaux[i].x===100) {
            tabTuyaux.push( {
                x: cvs.width,
                y:Math.floor(100 + Math.random()*100)

            }
                
            )
        } else if (tabTuyaux[i].x+largeurTuyau<0) {
            tabTuyaux.splice(i,1);
            i--;
            continue;
        }
        // Gestion des colisions
        const collisionHorizontale =
            xOiseau + largeurOiseau >= tabTuyaux[i].x &&
            xOiseau <= tabTuyaux[i].x + largeurTuyau;
        const collisionVerticale =
            yOiseau + hauteurOiseau > tabTuyaux[i].y ||
            yOiseau < tabTuyaux[i].y - ecartTuyau;

        if (yOiseau < 0 || yOiseau + hauteurOiseau > 300 ||
            (collisionHorizontale && collisionVerticale)) {
                sonChoc.play()
                finDuJeu= true;


               
        }
        // Gestion du score
        if (xOiseau === tabTuyaux[i].x+largeurTuyau+5) {
            score++;
            sonScore.play();
        }
    }
    ctx.drawImage(imageAvantPlan,0,cvs.height - imageAvantPlan.height);

    // Mouvement de l'oisau
    yOiseau = yOiseau + gravite;
    if (OiseauMonte>0) {
        OiseauMonte -- ;
        ctx.drawImage(imageOiseau2,xOiseau,yOiseau);
    }else{
        ctx.drawImage(imageOiseau1,xOiseau,yOiseau)
    }

    



    ctx.lineWidth = 3;
    ctx.strokeRect(0,0,cvs.width,cvs.height);
    // AFFICHAGE SCORE
    ctx.fillStyle = "black";
    ctx.font = "20px verdana";
    ctx.fillText("Score: "+ score, 10, cvs.height -20)
    if(finDuJeu === false){
      requestAnimationFrame(dessine);
      
    } else{
        // AFFICHAGE GAME OVER 
        ctx.fillStyle = "black";
        ctx.font = "30px verdana";
        ctx.fillText("GAME OVER", 50, 200);

        // AFFICHAGE SCO
        ctx.fillStyle = "black";
        ctx.font = "20px verdana";
        ctx.fillText("Cliquer pour recommencer ",  15, 230)
    }
      
   
}
dessine()
