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
const gravite = 2;
let OiseauMonte = 0;

document.addEventListener("keypress" ,(e)=>{
    if (e.code==="Space") {

        console.log(e)
        OiseauMonte =25;
        yOiseau = yOiseau -25;
    }else{
        return;
        
    }

})


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

    ctx.lineWidth = 0;
    ctx.strokeRect(0,0,cvs.width,cvs.height);
    requestAnimationFrame(dessine);
   
}
dessine()
