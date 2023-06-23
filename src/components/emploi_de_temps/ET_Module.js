import ReactDOM from 'react-dom';
import classes from './EmploiT.module.css';
import classesP from '../emploi_de_temps/palette/Palette.module.css';


// export const MATIERE_MAXSIZE = 25
export const PERIOD_COUNT = 13
export const DAYS_COUNT = 6
export const PROFLIST_MAXSIZE=25

export const TAB_MATIERES =[
    'matiere_1',
    'matiere_2',
    'matiere_3',
    'matiere_4',
    'matiere_5',
    'matiere_6',
    'matiere_7',
    'matiere_8',
    'matiere_9',
    'matiere_10',
    'matiere_11',
    'matiere_12',
    'matiere_13',
    'matiere_14',
    'matiere_15',
    'matiere_16',
    'matiere_17',
    'matiere_18',
    'matiere_19',
    'matiere_20',
    'matiere_21',
    'matiere_22',
    'matiere_23',
    'matiere_24',
    'matiere_25',
];

export const TAB_ENSEIGNANTS = [
    'prof_1',
    'prof_2',
    'prof_3',
    'prof_4',
    'prof_5',
    'prof_6',
    'prof_7',
    'prof_8',
    'prof_9',
    'prof_10',
    'prof_11',
    'prof_12',
    'prof_13',
    'prof_14',
    'prof_15',
    'prof_16',
    'prof_17',
    'prof_18',
    'prof_19',
    'prof_20',
    'prof_21',
    'prof_22',
    'prof_23',
    'prof_24',
    'prof_25'
]

const listProfs = [
    "Mr. ONDOUA p._Mme. MENGUE A._Mr. ABENA T._Mr. HOMBA S._Mr. Talla J._Mlle. ELIMBI_Mr. ETOA_Mr. BASSOGOG",
    "Mme. Ngo Milend_Mme. Ngo Nouki_Mme. Mendoua_Mme. Mouliom_Mme. Kamga_Mr. Belingua_Mr. Mpenza",
    "Mr. Evina_Mr. Bassagal_Mr. Tindo_Mr. Ateba_Mr. Kembo Ekoko_Mr. Telep_Mme. Ebana_Mr.Mbazoa_Mr. Elimbi",
    "Mme. Evina_Mme. Bassagal_Mme. Tindo_Mme. Ateba_Mme. Kembo Ekoko_Mme. Telep_Mme. Ebana_Mr. Mbazoa_Mr. Elimbi"        
]


export const TAB_VALEUR_HORAIRES =[
    '6h',
    '7h',
    '8h',
    '9h',
    '10h',
    '11h',
    '12h',
    '13h',
    '14h',
    '15h',
    '16h',
    '17h',
    '18h',
    '19h'  
];

export const TAB_PERIODES = [
    "6h_7h",
    "7h_8h",
    "8h_9h",
    "9h_10h",
    "B_10h_10h10",
    "10h10_11h",
    "11h_12h",
    "12h_12h40",
    "B_12h40_13h10",
    "13h10_14h",
    "14h_15h",
    "15h_16h",
    "16h_17h",
    "17h_18h",
    "18h_19h"
] ;

export const TAB_JOURS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"   
] ;

export const TAB_CRENEAU_PAUSE = [
    "10h_10h10",
    "12h40_13h10"
]

export const LONGUEUR_PERIODE ='4.4'

export const TAB_COLORS = {};
TAB_COLORS["GreenDark"] ='rgb(22, 122, 22)';
TAB_COLORS["Green"] ='rgb(60, 170, 60)';
TAB_COLORS["Yellow"] ='rgb(180, 219, 38)';
TAB_COLORS["YellowGold"] ='rgb(228, 224, 7)';
TAB_COLORS["BleuDark"] ='rgb(6, 29, 92)';
TAB_COLORS["Bleu"] ='rgb(43, 86, 206)';
TAB_COLORS["VioletDark"] ='rgb(117, 25, 121)';
TAB_COLORS["Violet"] ='rgb(206, 16, 212)';
TAB_COLORS["Orange"] ='rgb(219, 90, 15)';
TAB_COLORS["Red"] ='rgb(201, 10, 10)';
TAB_COLORS["PinkDark"] ='rgb(95, 22, 65)';
TAB_COLORS["Pink"] ='rgb(212, 16, 92)';
TAB_COLORS["Grey"] ='grey';
TAB_COLORS["Black"] ='rgb(26, 25, 25)';

export const COLORS=[];
COLORS[0] = 'rgb(33, 102, 167)';
COLORS[1] = 'rgb(117, 25, 121)';
COLORS[2] = 'rgb(212, 16, 92)';
COLORS[3] = 'rgb(170, 95, 10)';
COLORS[4] = 'rgb(60, 170, 60)';
COLORS[5] = 'rgb(6, 29, 92)';
COLORS[6] = 'rgb(206, 16, 212)';
COLORS[7] = 'rgb(6, 83, 134)';
COLORS[8] = 'rgb(36, 45, 54)';
COLORS[9] = 'rgb(219, 90, 15)';
COLORS[10] = 'rgb(100, 13, 172)';
COLORS[11] = 'rgb(117, 136, 9)';
COLORS[12]  = 'rgb(33, 102, 167)';
COLORS[13] = 'grey';
COLORS[14] = 'rgb(37, 2, 22)';
COLORS[15] = 'rgb(43, 86, 206)';
COLORS[16] = 'rgb(105, 7, 45)';
COLORS[17] = 'rgb(4, 59, 50)';
COLORS[18] = 'rgb(4, 59, 50)';
COLORS[19] = 'rgb(4, 59, 50)';
COLORS[20] = 'rgb(4, 59, 50)';
COLORS[21] = 'rgb(4, 59, 50)';
COLORS[22] = 'rgb(4, 59, 50)';
COLORS[23] = 'rgb(4, 59, 50)';
COLORS[24] = 'rgb(4, 59, 50)';
COLORS[25] = 'rgb(4, 59, 50)';

export const generateRandomNumbers=(numbercount,begin,limit)=>{
    var tabNumbers = [];
    while(tabNumbers.length < numbercount){
        var nb= Math.floor(Math.random()*limit)+ begin; 
        if(tabNumbers.indexOf(nb)===-1) tabNumbers.push(nb);
    }
    return [...tabNumbers];
}

/********************** EMPLOI DE TEMPS MATIERE **********************/
export let SELECTED_MATIERE_ID;
export let COUNT_SELECTED_MATIERES;

export let SELECTED_MATIERE_TAB;
export let CURRENT_MATIERE_LIST;
export let CURRENT_DROPPED_MATIERE_LIST;


export const updateSelectedMatiereId=(valeur)=>{
    SELECTED_MATIERE_ID = valeur;
}

export const updateCountSelectedMatieres=(valeur)=>{
    COUNT_SELECTED_MATIERES = valeur;
}

//---SELECTED_MATIERE_TAB
export const AddValueToSelectedMatiereTab=(position, valeur)=>{
    if(valeur='') SELECTED_MATIERE_TAB=[];
    else{
        if(position!=-1) SELECTED_MATIERE_TAB.splice(position,0,valeur);
        else SELECTED_MATIERE_TAB.push(valeur);
    }   
}

export const removeValueToSelectedMatiereTab=(position)=>{
    SELECTED_MATIERE_TAB.splice(position,1);    
}

//---CURRENT_MATIERE_LIST
export const AddValueToCurrentMatiereList=(position, valeur)=>{
    if(position!=-1) CURRENT_MATIERE_LIST.splice(position,0,valeur);
    else CURRENT_MATIERE_LIST.push(valeur);
}

export const removeValueToCurrentMatiereList=(position)=>{
    CURRENT_MATIERE_LIST.splice(position,1);    
}

//---CURRENT_DROPPED_MATIERE_LIST
export const AddValueToValueDroppedMatiereList=(position, valeur)=>{
    if(position!=-1) CURRENT_DROPPED_MATIERE_LIST.splice(position,0,valeur);
    else CURRENT_DROPPED_MATIERE_LIST.push(valeur);
}

export const removeValueToDroppedMatiereList=(position)=>{
    CURRENT_DROPPED_MATIERE_LIST.splice(position,1);    
}

/********************** EMPLOI DE TEMPS PROF **********************/

export let COUNT_SELECTED_PROFS;
export let SELECTED_PROF_ID;

export let SELECTED_PROF_TAB;
export let CURRENT_PROFS_LIST;
export let CURRENT_DROPPED_PROFS_LIST;


export const updateSelectedProfId=(valeur)=>{
    SELECTED_PROF_ID = valeur;
}

export const updateCountSelectedProfs=(valeur)=>{
    COUNT_SELECTED_PROFS = valeur;
}

//---SELECTED_PROF_TAB
export const AddValueToSelectedProfTab=(position, valeur)=>{
    if(position!=-1) SELECTED_PROF_TAB.splice(position,0,valeur);
    else SELECTED_PROF_TAB.push(valeur);
}

export const removeValueToSelectedProfTab=(position)=>{
    SELECTED_PROF_TAB.splice(position,1);    
}


//---CURRENT_PROF_LIST
export const AddValueToCurrentProfList=(position, valeur)=>{
    if(position!=-1) CURRENT_PROFS_LIST.splice(position,0,valeur);
    else CURRENT_PROFS_LIST.push(valeur);
}

export const removeValueToCurrentProfList=(position)=>{
    CURRENT_PROFS_LIST.splice(position,1);    
}


//---CURRENT_DROPPED_PROFS_LIST
export const AddValueToDroppedProfList=(position, valeur)=>{
    if(position!=-1) CURRENT_DROPPED_PROFS_LIST.splice(position,0,valeur);
    else CURRENT_DROPPED_PROFS_LIST.push(valeur);
}

export const removeValueToDroppedProfList=(position)=>{
    CURRENT_MATIERE_LIST.splice(position,1);    
}


/********************************** FONCTIONS **********************************/
export const setMatiereColor=(colorString)=>{
    
    var countSelectedMatieres = getCountSelectedDroppedMatieres();
   if(countSelectedMatieres){
        for (var i= 0; i< CURRENT_DROPPED_MATIERE_LIST.length; i++){
            
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true){
                
                //CURRENT_DROPPED_MATIERE_LIST[i].isSelected = false;
                document.getElementById(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere).style.backgroundColor = TAB_COLORS[colorString];
                //document.getElementById(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere).style.borderColor = TAB_COLORS[colorString];
                
                if (colorString=='Yellow'|| colorString=='YellowGold'){
                    document.getElementById(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere).style.color = 'black';
                }

            }
            
        }

    }
}

function droppedProfClickHandler(e){
    var droppedProfDiv = e.target.id;
    //On enleve l'extension _sub ou _img
    droppedProfDiv = droppedProfDiv.substring(0,droppedProfDiv.length-4)
    profZoneClickedHandler(droppedProfDiv);  
    console.log(droppedProfDiv) 
}

function matiereClickHandler(e){
    var indexMatiere, codeMatiere, matiereId;
    console.log('event',e);
    // console.log('matiereClickHandler listProfs',listProfs);
    matiereId = e.target.id;
    if (matiereId.includes('_sub'))  matiereId = matiereId.substring(0,matiereId.length-4)
    if(e.ctrlKey || e.metaKey){
        if(!isCellSelected(matiereId)) {
            //clearCellSelection();
            selectCell(matiereId);                
        } else {
            //clearCellSelection();
            disSelectCell(matiereId);             
        }
    } else {
        if(!isCellSelected(matiereId)) {
            clearCellSelection();
            selectCell(matiereId);                
        } else {
            clearCellSelection();
            disSelectCell(matiereId);                
        }

    }
    
    var countSelected = getCountSelectedDroppedMatieres()

    if(countSelected==1){
        var periode ; //ici il faudra initialiser la periode de la matiere selectionnee.
        indexMatiere = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
        codeMatiere = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
        getProfsList(codeMatiere, periode);               
    } else {
        if(countSelected >1){
            
            if(selectedDroppedMatiereHaveSameCode()){
                var listePeriode; //ici il faudra initialiser avec la liste des periodes des matieres selectionnees
                indexMatiere = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
                codeMatiere = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
                getProfsList(codeMatiere, listePeriode);                      
            }
        }
    }
}

export const initGrille=(ET_data,matiereSousEtab,listProfs,id_classe,emploiDeTemps)=> {
    var i, j, jour, periode, codeMatiere, profId,id_tranche;
    // on doit aussi ajouter l'id de la classe en parametre
    // on cherche dans emploiDeTemps l'attribut value et on travaille avec
    // var tabMatiere = ET_data.split('|');
    var tabMatiere = [];
    console.log("ET_data: ",ET_data," id_classe: ",id_classe);
    i = 0;
    let emploiTemps = emploiDeTemps.filter(em=>em.id_classe==id_classe)
    console.log("emploiTemps: ",emploiTemps);
    // console.log("initGrille :",matiereSousEtab);
    let cpte_emploiTemps = emploiTemps.length;
    while(i < cpte_emploiTemps) {
        // jour = tabMatiere[i].split(':')[0];
        jour = emploiTemps[i].id_jour;
        // periode = tabMatiere[i].split(':')[1].split('*')[0];
        periode = emploiTemps[i].libelle;
        id_tranche = emploiTemps[i].id_tranche;
        // codeMatiere = tabMatiere[i].split(':')[1].split('*')[1];
        codeMatiere = emploiTemps[i].id_matiere;
        
        var idMatiereToDrop = 'DM_'+jour +'_' +  periode;
        var matiereIndex = CURRENT_MATIERE_LIST.findIndex((matiere)=> matiere.codeMatiere == codeMatiere);
        
        if(matiereIndex >= 0){
            var droppedMatiere = {...CURRENT_MATIERE_LIST[matiereIndex]};
            
            droppedMatiere.idMatiere = idMatiereToDrop;
            droppedMatiere.idJour = jour;
            droppedMatiere.isSelected = false
            droppedMatiere.heureDeb = periode.split('_')[0];
            droppedMatiere.heureFin = periode.split('_')[1];
            droppedMatiere.tabProfsID =[];
            //droppedMatiere.tabProfsID.push(tabMatiere[i].split(':')[1].split('*')[2]);

           
            
            //POSITIONNEMENT DE L'ELEMENT SUR LA GRILLE
            var parentDiv = document.createElement('div');
            parentDiv.id = droppedMatiere.idMatiere;
            parentDiv.className = classes.droppedMatiereStyle;
           

            var enfanDiv = document.createElement('div');
            enfanDiv.id = droppedMatiere.idMatiere + '_sub';
            enfanDiv.className = classes.matiereTitleStyle;
            enfanDiv.textContent = droppedMatiere.libelleMatiere;

            parentDiv.appendChild(enfanDiv);
            

            var idDropZone = jour +'_'+ periode;
            console.log('zone de drop :', idDropZone)
            var containerDiv = document.getElementById(idDropZone);
            containerDiv.appendChild(parentDiv);
            parentDiv.addEventListener('click', (e) => {matiereClickHandler(e)})
            
            //S'IL YA UN OU DES PROFS, ON LES GERE
            if(emploiTemps[i].value.split('*')[2].length>2){
            //    var countProf =  tabMatiere[i].split(':')[1].split('*').length-2;
               var countProf =  emploiTemps[i].id_enseignants.length;
                j = 0;
                while(j<countProf){
                    
                    // var droppedProfId = 'DP_'+ tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[1] + '_' + jour +'_' +  periode;
                    var droppedProfId = 'DP_Prof_'+ emploiTemps[i].id_enseignants[j]+"_"+emploiTemps[i].id_jour+"_"+emploiTemps[i].libelle
                    
                    var droppedprofImgDiv = document.createElement('div');
                    droppedprofImgDiv.id = droppedProfId +'_img';
                    droppedprofImgDiv.className = classes.profImgStyle;


                    var droppedprofImg = document.createElement('img');
                    droppedprofImg.className = classes.imgStyle +' '+ classes.profImgStyle;
                    droppedprofImg.id = droppedProfId +'_img';
                    // droppedprofImg.setAttribute('src',(tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[0].includes('Mr.'))? "images/maleTeacher.png":"images/femaleTeacher.png");
                    droppedprofImg.setAttribute('src', "images/maleTeacher.png");
                    droppedprofImg.addEventListener('click', (e) => {droppedProfClickHandler(e)})

                    
                    var droppedprofText = document.createElement('div');
                    droppedprofText.id = droppedProfId +'_sub';
                    droppedprofText.className = classes.profTextSyle;
                    // droppedprofText.textContent = tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[0];
                    droppedprofText.textContent = emploiTemps[i].value.split("*")[2].split("%")[0].split("Mr."[1]);
                    droppedprofText.addEventListener('click', (e) => {droppedProfClickHandler(e)})


                   
                    droppedprofImgDiv.appendChild(droppedprofImg)
                    droppedprofImgDiv.appendChild(droppedprofText)
                    //droppedprofImgDiv.addEventListener('click', (e) => {droppedProfClickHandler(e)})


                    var droppedprofDiv = document.createElement('div');
                    droppedprofDiv.id = droppedProfId;
                    droppedprofDiv.className = classes.profDivStyle;
                    droppedprofDiv.appendChild(droppedprofImgDiv);
                    //droppedprofDiv.addEventListener('click', () => {droppedProfClickHandler(droppedProfId)})
                    
                    var container = document.getElementById('P_'+ jour + '_' +  periode);
                    container.appendChild(droppedprofDiv)
                    //container.addEventListener('click', () => {droppedProfClickHandler(droppedProfId)})

                    droppedMatiere.tabProfsID.push(droppedProfId);

                    PROF_DATA = {};
                    PROF_DATA.idProf     = droppedProfId;
                    // PROF_DATA.NomProf    = tabMatiere[i].split(':')[1].split('*')[j+2].split('%')[0];
                    PROF_DATA.NomProf    = emploiTemps[i].value.split("*")[2].split("%")[0].split("Mr."[1]);
                    PROF_DATA.idJour     = jour;
                    PROF_DATA.idMatiere  = idMatiereToDrop;
                    PROF_DATA.heureDeb   = periode.split('_')[0];
                    PROF_DATA.heureFin   = periode.split('_')[1];
                    PROF_DATA.isSelected = false
                    
                    CURRENT_DROPPED_PROFS_LIST.push(PROF_DATA);
                    j++;

                    console.log(PROF_DATA, CURRENT_DROPPED_PROFS_LIST)
                }
               
            }

             //MISE A JOUR DES DONNEES GLOBALES
             AddValueToValueDroppedMatiereList(-1,droppedMatiere);
           
           
        }  
        i++;         
    }
}


export const clearGrille=(TAB_PERIODES,TAB_JOURS)=> {
    var DropZoneId;
    var childDivs;
    var NB_PERIODE = TAB_PERIODES.length;
    var DAYS_COUNT = TAB_JOURS.length;
   
    for (var dayId = 0; dayId < DAYS_COUNT; dayId++) {
        // console.log( TAB_JOURS[dayId].libelle)
        // for (var periode = 0; periode <= PERIOD_COUNT+1; periode++)
        for (var periode = 0; periode < NB_PERIODE; periode++)
         {
            //La DropZone de la Matiere
            DropZoneId = TAB_JOURS[dayId].id+"_"+TAB_PERIODES[periode].duree;
            childDivs = document.getElementById(DropZoneId);
            // console.log("childDivs: ",childDivs)
            if (childDivs!=null){
                childDivs = childDivs.childNodes
                console.log("YO: ",childDivs)
                for(var i = 0; i < childDivs.length; i++){
                    console.log("son: ",childDivs[i])
                    childDivs[i].remove();
                }
            }                
            //La DroZone du Prof
            DropZoneId = 'P_'+TAB_JOURS[dayId].id+'_'+TAB_PERIODES[periode].duree;
            childDivs = document.getElementById(DropZoneId);
            if (childDivs!=null){
                if (childDivs.style.borderColor=='red'){
                    childDivs.style.borderStyle = null;
                    childDivs.style.borderWidth = null;
                    childDivs.style.borderColor = null;
                    childDivs.className = classes.ProfDroppableDivstyle;
                }
                childDivs = childDivs.childNodes;
                for(var i = 0; i < childDivs.length; i++){
                    childDivs[i].remove();
                }
            }                
            
        }
    }

}

export const initProfList=(listProfs)=>{
    clearProflist(listProfs);
    COUNT_SELECTED_PROFS=0;
    SELECTED_PROF_ID='';
    SELECTED_PROF_TAB=[];
    CURRENT_DROPPED_PROFS_LIST=[];
   
}

export const clearMatiereList=(matieres) =>{
    var parent, enfants, draggableSon;
    //On initialise tout ce aui concerne la matiere.
    COUNT_SELECTED_MATIERES=0;
    SELECTED_MATIERE_ID='';
    SELECTED_MATIERE_TAB=[]
    CURRENT_DROPPED_MATIERE_LIST=[];
    CURRENT_MATIERE_LIST=[];
    let MATIERE_MAXSIZE = matieres.length;
    
    parent = document.getElementById('matieres');
    enfants = parent.childNodes;
    
    for (var i = 0; i < MATIERE_MAXSIZE; i++) {
        parent =  document.getElementById('matiere_' + matieres[i].id);
        draggableSon = document.getElementById('matiere_' + matieres[i].id+'_sub');
        parent.className = null;
        parent.title = '';
        draggableSon.textContent ='';
        draggableSon.className = null; 
    }    
}

export const initMatiereList=(listeMatieres)=>{
    console.log("listeMatieres: ",listeMatieres)
    var MATIERE_DATA ={
        idMatiere:'',
        codeMatiere:'',
        libelleMatiere:'',
        idJour:'',
        heureDeb:'',
        heureFin:'',
        tabProfsID:[]
    };
    var parent, draggableSon;
    var tabMatiere =[];
    
    for (var i = 0; i < listeMatieres.length; i++) {
        
        tabMatiere = listeMatieres[i].split('*');
        parent =  document.getElementById('matiere_' + tabMatiere[1]);
        draggableSon = document.getElementById('matiere_' + tabMatiere[1]+'_sub');
        parent.className = classes.matiereStyle;  
        parent.title = tabMatiere[0];
        
        MATIERE_DATA = {};
        MATIERE_DATA.idMatiere = 'matiere_' + tabMatiere[1];
        MATIERE_DATA.libelleMatiere = tabMatiere[0];
        MATIERE_DATA.codeMatiere = tabMatiere[1];
        CURRENT_MATIERE_LIST[i] = MATIERE_DATA;
        
        draggableSon.textContent = tabMatiere[0];
        draggableSon.className = classes.matiereTitleStyle;                     
              
    }
    MATIERE_DATA = {};
    console.log(CURRENT_MATIERE_LIST);
}


export const deleteProf =() => {
    var DropProfId, children, profDropZone;
    var associatedMatiere, idTab, matiereIndex,profIndex, indexProf, profId;
    var countProfs = getCountSelectedDroppedProfs();
    
    if (countProfs >0) {
       
        for(var i=0; i < countProfs; i++){
           
            profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.isSelected == true)
            if(profIndex>=0){
                DropProfId = CURRENT_DROPPED_PROFS_LIST[profIndex].idProf;
                associatedMatiere = CURRENT_DROPPED_PROFS_LIST[profIndex].idMatiere;
                matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == associatedMatiere)
                
                if (matiereIndex>=0){
                    indexProf = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.findIndex((prof)=> prof == DropProfId);
                    if (profIndex>=0) CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.splice(indexProf,1);
                    else{alert("Erreur, le prof n'est pas enregistre pour une matiere")}
                   

                    profDropZone =  document.getElementById(DropProfId);  
                    children = profDropZone.childNodes;   
                    for(var i = 0; i < children.length; i++){
                        children[i].remove();
                    } 
                    profDropZone.remove();
            
                    if (profDropZone.style.borderColor=='red'){
                        profDropZone.style.borderStyle = null;
                        profDropZone.style.borderWidth = null;
                        profDropZone.style.borderColor = null;
                        profDropZone.className = null;
                    }
                }                
                CURRENT_DROPPED_PROFS_LIST.splice(profIndex,1);
            }                      
        }
        SELECTED_PROF_TAB =[];
        COUNT_SELECTED_PROFS = 0;
        SELECTED_PROF_ID='';        
    } 
}


export const profZoneClickedHandler=(id)=>{
    SELECTED_PROF_ID = id;
    var idTab = SELECTED_PROF_ID.split('_');
    var ProfDroppableZone = 'P_'+idTab[3]+'_'+idTab[4]+'_'+idTab[5];
    var index;
       
    if (idTab[0]=='DP') {
        
        index = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.idProf == id)
       
        if(index >=0) {
            if(CURRENT_DROPPED_PROFS_LIST[index].isSelected == false){
                CURRENT_DROPPED_PROFS_LIST[index].isSelected = true;
                document.getElementById(SELECTED_PROF_ID).style.borderStyle ='solid';
                document.getElementById(SELECTED_PROF_ID).style.borderWidth ='1px';  
                document.getElementById(SELECTED_PROF_ID).style.borderColor ='red';

            } else {
                CURRENT_DROPPED_PROFS_LIST[index].isSelected = false;
                document.getElementById(SELECTED_PROF_ID).style.borderStyle = null;
                document.getElementById(SELECTED_PROF_ID).style.borderWidth = null;
                document.getElementById(SELECTED_PROF_ID).style.borderColor = null;
            }
 
        } else{
            alert('Le prof selectionne ne figure pas dans la lista des profs')
        }        
    }      
}

export const getSelectedDroppedMatieres=()=>{
    var droppedMatiereTab = [];
    var i = 0;
    while(i < CURRENT_DROPPED_MATIERE_LIST.length){
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected == true){
            droppedMatiereTab.push({...CURRENT_DROPPED_MATIERE_LIST[i]});
        }
        i++;
    }

    return droppedMatiereTab;
}

export const deleteMatiere =(listProfs) => {
    var DropZoneId,toDeleIndex, droppedProfId, droppedProfZone,idTab;
    var countMatiere, tabPos, profDropZone, AssociatedProfCount;
    countMatiere = getCountSelectedDroppedMatieres();
    var tabSelectedDroppedMatieres = getSelectedDroppedMatieres();
   
    tabPos = 0;
    console.log('ggdgdgd', CURRENT_DROPPED_MATIERE_LIST);
    while(tabPos<countMatiere){
        console.log(tabPos+'fois')
        var toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true)
        DropZoneId = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].idMatiere;
        idTab = DropZoneId.split('_');
        //'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
        droppedProfZone ='P_'+idTab[1]+'_'+idTab[2]+'_'+idTab[3];
                    
        //toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == DropZoneId);             
        console.log(CURRENT_DROPPED_MATIERE_LIST[toDeleIndex]);
        if(toDeleIndex >= 0){
            console.log('matiere a supprimer',CURRENT_DROPPED_MATIERE_LIST[toDeleIndex])
            if (CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length > 0) {
                AssociatedProfCount = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length;
                
                while(AssociatedProfCount > 0){
                    droppedProfId = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.shift();
                    profDropZone =  document.getElementById(droppedProfId);  
                    var children = profDropZone.childNodes;   
                    for(var i = 0; i < children.length; i++){
                        children[i].remove();
                    } 
                    profDropZone.remove();
            
                    if (profDropZone.style.borderColor=='red'){
                        profDropZone.style.borderStyle = null;
                        profDropZone.style.borderWidth = null;
                        profDropZone.style.borderColor = null;
                    }                   
                    AssociatedProfCount--;
                }  
            }
            CURRENT_DROPPED_MATIERE_LIST.splice(toDeleIndex,1);
            document.getElementById(DropZoneId).remove();
        }
        tabPos++;
    }
    clearProflist(listProfs);
}


export const  isCellSelected =(cellId) => {
    var index = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId)
    return (CURRENT_DROPPED_MATIERE_LIST[index].isSelected == true);
}

export const getCountSelectedDroppedMatieres=()=>{
    var count = 0;
    for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
    }
    return count;
}

export const getCountSelectedDroppedProfs=()=>{
    var count = 0;
    for(var i=0 ; i<CURRENT_DROPPED_PROFS_LIST.length; i++){
        if(CURRENT_DROPPED_PROFS_LIST[i].isSelected==true) count++;
    }
    return count;
}


export const selectedDroppedMatiereHaveSameCode=()=>{
    var areSame = true;
    var i = 1;
    var firstSelectedIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected==true);
    var codeMatiere = CURRENT_DROPPED_MATIERE_LIST[firstSelectedIndex].codeMatiere;

    while(i < CURRENT_DROPPED_MATIERE_LIST.length && areSame==true) {
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected == true && CURRENT_DROPPED_MATIERE_LIST[i].codeMatiere != codeMatiere) areSame = false;
        i++;       
    }
    return areSame;
}


export const clearCellSelection=()=>{
    var countSelected = getCountSelectedDroppedMatieres()
    if (countSelected >0) {
        for(var i=0; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){ 
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected){
                // disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
                disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
            }         
           
        }
        //SELECTED_MATIERE_ID='';
    }  
}


export const selectCell=(cellId)=>{
   
    if(!isCellSelected(cellId)) {
        var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId);
        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = true;      
        document.getElementById(cellId).style.borderColor ='red';
        clearProflist();

        //COUNT_SELECTED_MATIERES ++;
        //SELECTED_MATIERE_TAB.push(cellId);
        
        //if (COUNT_SELECTED_MATIERES==1) SELECTED_MATIERE_ID = cellId;
        //else SELECTED_MATIERE_ID = '';
        // Vider la liste des profs
         
    }
}


export const disSelectCell=(cellId) =>{
    if(isCellSelected(cellId)) {
        var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == cellId);
        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = false;
        if(document.getElementById(cellId).style.backgroundColor.length==0){
            document.getElementById(cellId).style.borderColor = 'rgb(6, 83, 134)';
        }else{
            document.getElementById(cellId).style.borderColor = document.getElementById(cellId).style.backgroundColor;
        }
       //console.log(document.getElementById(cellId).style.backgroundColor);
        clearProflist();

       /* var index = SELECTED_MATIERE_TAB.findIndex((droppedMatierId)=>cellId == droppedMatierId);        
        if(index>=0) {
            
            
            SELECTED_MATIERE_TAB.splice(index,1);
            COUNT_SELECTED_MATIERES --;

            if(COUNT_SELECTED_MATIERES==1) SELECTED_MATIERE_ID = SELECTED_MATIERE_TAB[0];
            else SELECTED_MATIERE_ID ='';

            // Vider la liste des profs si elle ne l'est pas
            clearProflist();
        }*/
      
    }

}

export const clearProflist=(listProfs)=>{
    var draggableSon, draggableSonText, draggableSonImg;
    var PROFLIST_MAXSIZE =listProfs.length;
    for (var i = 0; i < PROFLIST_MAXSIZE; i++) {
        draggableSon =  document.getElementById('prof_' + listProfs[i].id);
        draggableSonText = document.getElementById('prof_' + listProfs[i].id+'_sub');
       
        draggableSon.className = null;
        draggableSon.title = '';
        draggableSonText.textContent ='';
        draggableSonText.className = null;

        draggableSonImg =  document.getElementById('prof_' + listProfs[i].id + '_img');
        draggableSonImg.className = null;

        draggableSonImg = document.querySelector('#prof_' + listProfs[i].id + '_img > img');
        if (draggableSonImg.hasAttribute('src')) draggableSonImg.removeAttribute('src');
        //draggableSonImg.setAttribute('src',null);  
          
    } 
    CURRENT_PROFS_LIST = [];
}

var PROF_DATA ={
    idProf:'',
    NomProf:'',
    idJour:'',
    heureDeb:'',
    heureFin:'',
    idMatiere:'',
    isSelected:false
}

// *activer
export const initProfListWithProfs2=(listeProf)=>{
    var parent = document.getElementById('profList');
    var draggableSon, draggableSonText, draggableSonImg;

    clearProflist(listeProf);
    //alert(listeProf);
  
    for (var i = 0; i < listeProf.length; i++) {
        PROF_DATA = {};
        draggableSon =  document.getElementById('prof_' + listeProf[i].id);
        draggableSonText = document.getElementById('prof_' + listeProf[i].id+'_sub');
        
        draggableSon.className = classesP.profDivStyle;  
        draggableSon.title = listeProf[i].nom+" "+listeProf[i].prenom;       
        
        draggableSonText.textContent = listeProf[i].nom;
        draggableSonText.className = classesP.profTextSyle;            

        draggableSonImg =  document.getElementById('prof_' + listeProf[i].id + '_img');
        draggableSonImg.className = classesP.profImgStyle;

        draggableSonImg = document.querySelector('#prof_' + listeProf[i].id + '_img > img')

        draggableSonImg.setAttribute('src',"images/maleTeacher.png");

        // if(listeProf[i].includes('Mr.')) {
        //     draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        // }else{
        //     draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        // }
        
        
        PROF_DATA.idProf = 'prof_' +listeProf[i].id;
        PROF_DATA.NomProf = listeProf[i].nom;
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        PROF_DATA = {};                                     
    }
 
}
// *desactiver
export const initProfListWithProfs=(listeProf)=>{
    var parent = document.getElementById('profList');
    var draggableSon, draggableSonText, draggableSonImg;

    clearProflist();
    //alert(listeProf);
  
    for (var i = 0; i < listeProf.length; i++) {
        PROF_DATA = {};
        draggableSon =  document.getElementById('prof_' + (i+1));
        draggableSonText = document.getElementById('prof_' + (i+1)+'_sub');
        
        draggableSon.className = classesP.profDivStyle;  
        draggableSon.title = listeProf[i];       
        
        draggableSonText.textContent = listeProf[i];
        draggableSonText.className = classesP.profTextSyle;            

        draggableSonImg =  document.getElementById('prof_' + (i+1) + '_img');
        draggableSonImg.className = classesP.profImgStyle;

        draggableSonImg = document.querySelector('#prof_' + (i+1) + '_img > img')
        if(listeProf[i].includes('Mr.')) {
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        }else{
            draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        }
        
        
        PROF_DATA.idProf = 'prof_' + (i+1);
        PROF_DATA.NomProf = listeProf[i];
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        PROF_DATA = {};                                     
    }
 
}
// *activer
// export const getProfs=(codeMatiere)=>{
    
//     switch(codeMatiere){
//         case '001': return listProfs[1] ;
//         case '002': return listProfs[2] ;
//         case '003': return listProfs[3]
//         default: return listProfs[0];
//         //case 'matiere_4':   return listProfs[2] ;           
//     }
  
// }
// *desactiver
export const getProfs=(codeMatiere)=>{
    
    switch(codeMatiere){
        case '001': return listProfs[1] ;
        case '002': return listProfs[2] ;
        case '003': return listProfs[3]
        default: return listProfs[0];
        //case 'matiere_4':   return listProfs[2] ;           
    }
  
}
// *activer
export const getProfsList2=(codeMatiere, listProfs,emploiDeTemps,idjour,h_deb,h_fin)=>{
    var libre=true;
    let profLibres = [];
    let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
    console.log("*** listProfs: ",listProfs)
    for(let i=0;i<profsMatieres.length;i++){
        libre = true;
        for(let j=0;j<emploiDeTemps.length;j++){
            if(emploiDeTemps[j].id_enseignants.includes(profsMatieres[i].id)){
                // console.log("==EGALITE  emploiDeTemps[j]: ",emploiDeTemps[j],"profsMatieres[i]: ",profsMatieres[i],emploiDeTemps[j].id_enseignants.includes(profsMatieres[i].id))
                libre=false;
                break;
            }
        }
        if (libre) profLibres.push(profsMatieres[i])
    }
    console.log("*** profLibres: ",profLibres)
    // profList = getProfs(codeMatiere)
    // tabProfs = profList.split('_');
    // initProfListWithProfs2(profsMatieres);
    initProfListWithProfs2(profLibres);

}
// *desactiver
export const getProfsList=(codeMatiere, periode)=>{


    var tabProfs,profList;
    var codeMatiere;

    profList = getProfs(codeMatiere)
    tabProfs = profList.split('_');
    initProfListWithProfs(tabProfs);

    /*countMatieres = getCountSelectedDroppedMatieres();
    if(countMatieres == 0) {
        alert('Vous devez selectionner une matiere!');
    } else {
        if(countMatieres > 1) {
            alert('Vous devez selectionner une seule matiere!');
        } else {
            profList = getProfs(codeMatiere)
            tabProfs = profList.split('_');
            initProfListWithProfs(tabProfs);
        } 
    }*/
}


export const addPauseOnGrid=(creneau)=>{
    var crenoHoraire, heureDeb,heureFin, heurePauseSurGrilleIndex;
    var eltPeriode, labelPause1, labelPause2, leftMargin;
  
    crenoHoraire = creneau.split('_');
    heureDeb = crenoHoraire[0].split('h');
    heureFin = crenoHoraire[1].split('h');
   
    heurePauseSurGrilleIndex = TAB_VALEUR_HORAIRES.findIndex((heure)=>heure.includes(heureDeb[0]+'h'));
    if(heurePauseSurGrilleIndex >= 0){

        leftMargin = (Evaluate(heureDeb[1])*LONGUEUR_PERIODE)/60;
        eltPeriode = document.getElementById(TAB_VALEUR_HORAIRES[heurePauseSurGrilleIndex]);
        
        if(leftMargin==0)heureDeb[1]='00';
       
        labelPause1 = document.createElement('div');
        labelPause1.textContent = heureDeb[0]+'h'+heureDeb[1];
        labelPause1.style.color='red';
        labelPause1.style.fontSize='0.5vw';
        labelPause1.style.fontWeight='700';
        labelPause1.style.marginLeft=(heureDeb[1]=='00')? '-1.3vw':leftMargin+'vw';
        if(leftMargin==0) labelPause1.style.marginBottom='-0.7vw';
        
        eltPeriode.appendChild(labelPause1);
    }  

   
    heurePauseSurGrilleIndex = TAB_VALEUR_HORAIRES.findIndex((heure)=>heure.includes(heureFin[0]+'h'));
    if(heurePauseSurGrilleIndex >= 0){

        leftMargin = (Evaluate(heureFin[1])*LONGUEUR_PERIODE)/60;
        eltPeriode = document.getElementById(TAB_VALEUR_HORAIRES[heurePauseSurGrilleIndex]);
        
        if(leftMargin==0) heureFin[1]='00';
       
        labelPause2 = document.createElement('div');
        labelPause2.textContent = heureFin[0]+'h'+heureFin[1];
        labelPause2.style.color='red';
        labelPause2.style.fontSize='0.5vw';
        labelPause2.style.fontWeight='700';
        labelPause2.style.marginLeft= (heureFin[1]=='00')? '-1.3vw':leftMargin+'vw';
        if(leftMargin==0) labelPause2.style.marginBottom='-0.7vw';
        
        eltPeriode.appendChild(labelPause2);           

    }           
        
}


export const createPauses=()=>{
    for(var i=0; i<TAB_CRENEAU_PAUSE.length; i++) {
        //tabDureePause = calculDureePause(TAB_CRENEAU_PAUSE[i]);
        addPauseOnGrid(TAB_CRENEAU_PAUSE[i]);
    }     
}


export const getJourIndex=(jour)=>{
    return TAB_JOURS.indexOf(jour);
} 

export const Evaluate=(val)=>{
    if(val==''||val==' '|| isNaN(val)) return 0;
    else return eval(val);

}










