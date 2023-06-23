import classes from '../../components/emploi_de_temps/EmploiT.module.css';
import {PROFLIST_MAXSIZE,TAB_JOURS, TAB_VALEUR_HORAIRES,LONGUEUR_PERIODE,TAB_CRENEAU_PAUSE} from './DndConst';
import {COUNT_SELECTED_PROFS,SELECTED_PROF_TAB,SELECTED_PROF_ID,CURRENT_PROFS_LIST, CURRENT_DROPPED_PROFS_LIST} from './DndLists';
import {COUNT_SELECTED_MATIERES,CURRENT_DROPPED_MATIERE_LIST,SELECTED_MATIERE_TAB,SELECTED_MATIERE_ID} from './DndLists'

export const deleteProf =() => {
    var DropProfId, children, profDropZone;
    var associatedMatiere, idTab, matiereIndex,profIndex,profId;
    
    if (COUNT_SELECTED_PROFS > 0) {
        for(var i=0; i < SELECTED_PROF_TAB.length; i++){
            DropProfId = SELECTED_PROF_TAB[i]; 
            //alert(DropProfId) ;  
            idTab =  DropProfId.split('_');
            associatedMatiere='DM_'+idTab[1]+'_'+idTab[2]+'_'+idTab[3];
            profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.IdMatiere == associatedMatiere)
            if(profIndex>=0){
                profId = CURRENT_DROPPED_PROFS_LIST[profIndex].idProf;
                //On enleve ce prof ds la matiere a laquelle il est affecte
                matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == associatedMatiere);
                
                if (matiereIndex>=0){
                   // alert('Matiere'+CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID);

                    profIndex=CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.findIndex((prof)=>prof==profId)
                    if(profIndex>=0){
                       //alert('on est entree');
                        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.splice(profIndex,1);
                    }

                    profDropZone =  document.getElementById(DropProfId);  
                    children = profDropZone.childNodes;   
                    for(var i = 0; i < children.length; i++){
                        children[i].remove();
                    } 
            
                    if (profDropZone.style.borderColor=='red'){
                        profDropZone.style.borderStyle = null;
                        profDropZone.style.borderWidth = null;
                        profDropZone.style.borderColor = null;
                        profDropZone.className = classes.ProfDroppableDivstyle;
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

export const deleteMatiere =() => {
    var DropZoneId,toDeleIndex, droppedProfId, droppedProfZone,idTab;
    var profDropZone, AssociatedProfCount;
    
    if (COUNT_SELECTED_MATIERES > 0) {
        for(var i=0; i < SELECTED_MATIERE_TAB.length; i++){
             
            DropZoneId = SELECTED_MATIERE_TAB[i];
            idTab = DropZoneId.split('_');
            //'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
            droppedProfZone ='P_'+idTab[1]+'_'+idTab[2]+'_'+idTab[3];
                     
            toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == DropZoneId);             
           
            if (CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length > 0) {
               
                AssociatedProfCount = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length;
               
                for(var i=0; i<AssociatedProfCount; i++){
                    droppedProfId = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.shift();
                    document.getElementById(droppedProfId).remove();
                }
                
                //ici faut changer la couleur au cas on on avait selectionne le prof
                profDropZone= document.getElementById(droppedProfZone);
                if (profDropZone.style.borderColor=='red'){
                    profDropZone.style.borderStyle = null;
                    profDropZone.style.borderWidth = null;
                    profDropZone.style.borderColor = null;
                    profDropZone.className = classes.ProfDroppableDivstyle;
                }
            }
            CURRENT_DROPPED_MATIERE_LIST.splice(toDeleIndex,1);
            document.getElementById(DropZoneId).remove();
        }
        clearProflist();
        SELECTED_MATIERE_TAB =[];
        COUNT_SELECTED_MATIERES = 0;
        SELECTED_MATIERE_ID='';         

    } /*else {
        alert("vous n'avez pas selectionne de matiere a supprimer");
    }*/
}


export const  isCellSelected =(cellId) => {
    return document.getElementById(cellId).style.borderColor =='red';
}


export const clearCellSelection=()=>{
    //alert('icioooh'+COUNT_SELECTED_MATIERES+SELECTED_MATIERE_TAB);
    var countSelected = COUNT_SELECTED_MATIERES;
    if (countSelected >0) {
        for(var i=0; i<countSelected; i++){
            disSelectCell(SELECTED_MATIERE_TAB[i]);
        }
        SELECTED_MATIERE_ID='';
    }  
}


export const selectCell=(cellId)=>{
    if(!isCellSelected(cellId)) {
        document.getElementById(cellId).style.borderColor ='red';
        COUNT_SELECTED_MATIERES ++;
        SELECTED_MATIERE_TAB.push(cellId);
        if (COUNT_SELECTED_MATIERES==1) SELECTED_MATIERE_ID = cellId;
        else SELECTED_MATIERE_ID = '';
        // Vider la liste des profs
        clearProflist();
        //alert(COUNT_SELECTED_MATIERES+SELECTED_MATIERE_TAB)
    }
}


export const disSelectCell=(cellId) =>{
   // alert('pppp'+cellId);
    if(isCellSelected(cellId)) {
        document.getElementById(cellId).style.borderColor = document.getElementById(cellId).style.backgroundColor;
        var index = SELECTED_MATIERE_TAB.findIndex((droppedMatierId)=>cellId == droppedMatierId);        
        if(index>=0) {
            SELECTED_MATIERE_TAB.splice(index,1);
            COUNT_SELECTED_MATIERES --;
            if(COUNT_SELECTED_MATIERES==1) SELECTED_MATIERE_ID = SELECTED_MATIERE_TAB[0];
            else SELECTED_MATIERE_ID =''
            // Vider la liste des profs si elle ne l'est pas
            clearProflist();
        }
      
    }

}

export const clearProflist=()=>{
    var draggableSon, draggableSonText, draggableSonImg;

    for (var i = 0; i < PROFLIST_MAXSIZE; i++) {
        draggableSon =  document.getElementById('prof_' + (i+1));
        draggableSonText = document.getElementById('prof_' + (i+1)+'_sub');
       
        draggableSon.className = null;
        draggableSon.title = '';
        draggableSonText.textContent ='';
        draggableSonText.className = null;

        draggableSonImg =  document.getElementById('prof_' + (i+1) + '_img');
        draggableSonImg.className = null;

        draggableSonImg = document.querySelector('#prof_' + (i+1) + '_img > img')
        draggableSonImg.setAttribute('src',"");                  
    } 
    CURRENT_PROFS_LIST = [];
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

