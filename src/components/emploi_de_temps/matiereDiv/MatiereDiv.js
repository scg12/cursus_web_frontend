import React from 'react';
import { isMobile } from 'react-device-detect';
import DraggableDiv from '../../draggableDiv/DraggableDiv';
// import {CURRENT_DROPPED_MATIERE_LIST} from '../ET_Module';
// import {getProfsList,selectedDroppedMatiereHaveSameCode, clearCellSelection, selectCell, disSelectCell, isCellSelected, getCountSelectedDroppedMatieres} from '../ET_Module';
import { useContext} from "react";
import UiContext from '../../../store/UiContext';
import classesP from '../../emploi_de_temps/palette/Palette.module.css';


let CURRENT_DROPPED_MATIERE_LIST;
let PROF_DATA ={
    idProf:'',
    NomProf:'',
    idJour:'',
    heureDeb:'',
    heureFin:'',
    idMatiere:'',
    isSelected:false
}
let CURRENT_PROFS_LIST;

function MatiereDiv(props){ 
    const currentUiContext = useContext(UiContext);
    
    function matiereClickHandler(e){

        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;

        var indexMatiere, codeMatiere;
        var idTab = props.id.split('_');

        if(isMobile){
            if(props.id[0]=="m") currentUiContext.setSelectedMatiereId(props.id); //On est sur une matiere
        }
       
       
        if (idTab[0]=='DM') {
            console.log("on est ici PP1 ");
            if(e.ctrlKey || e.metaKey){
                if(!isCellSelected(props.id)) {
                    //clearCellSelection();
                    selectCell(props.id);                
                } else {
                    //clearCellSelection();
                    disSelectCell(props.id);             
                }
            } else {
                if(!isCellSelected(props.id)) {
                    console.log("on est ici PP1: ");
                    clearCellSelection();
                    selectCell(props.id);                
                } else {
                    console.log("on est ici PP2: ");
                    clearCellSelection();
                    disSelectCell(props.id);                
                }

            }
           
            var countSelected = getCountSelectedDroppedMatieres()

            if(countSelected==1){
                console.log("on est ici PP: ", CURRENT_DROPPED_MATIERE_LIST);
                var periode ; //ici il faudra initialiser la periode de la matiere selectionnee.
                let liste_prof = [], tab_prof_id;
                
                indexMatiere  = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
                codeMatiere   = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
              
                periode       = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].idMatiere;
                tab_prof_id   = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].tabProfsID;

                
                tab_prof_id.forEach(prof => {console.log("$$ prof: ",prof,prof.split("DP_prof_")[1].split("_")[0]);
                    liste_prof.push(parseInt(prof.split("DP_prof_")[1].split("_")[0]))
                });

                console.log("data matiere",codeMatiere, periode, liste_prof,CURRENT_DROPPED_MATIERE_LIST,indexMatiere)
  
                searchAndSetProfLibresInProfDiv(codeMatiere,periode,liste_prof);                      
        
            } else {
                if(countSelected >1){
                    
                    if(selectedDroppedMatiereHaveSameCode()){
                        console.log("ici ncncncn")
                        let liste_prof = [],tab_prof_id;
                        //On obtient le sous tab des matieres selected
                        var tabDroppedSelectedMatieres =  CURRENT_DROPPED_MATIERE_LIST.filter((matiere)=>(matiere.isSelected == true) && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);
                        
                        //On cherche la matiere qui le moins de profs dispo
                        var matiereWithLowestFreeProfs = tabDroppedSelectedMatieres[0];

                        tabDroppedSelectedMatieres.map((dropSelMat, index)=>{
                            if(index>0){
                                console.log("idMatieres", matiereWithLowestFreeProfs.codeMatiere, dropSelMat.codeMatiere);
                                console.log("Prof Libres", getProfLibres(matiereWithLowestFreeProfs.codeMatiere, matiereWithLowestFreeProfs.idMatiere), getProfLibres(dropSelMat.codeMatiere, dropSelMat.idMatiere));
                                if(getProfLibres(matiereWithLowestFreeProfs.codeMatiere, matiereWithLowestFreeProfs.idMatiere).length > getProfLibres(dropSelMat.codeMatiere, dropSelMat.idMatiere).length){
                                    matiereWithLowestFreeProfs = {...dropSelMat};
                                }
                            } 
                        })
    
                        codeMatiere  = matiereWithLowestFreeProfs.codeMatiere;
                        periode      = matiereWithLowestFreeProfs.idMatiere;
                        tab_prof_id  = matiereWithLowestFreeProfs.tabProfsID;

                        tab_prof_id.forEach(prof => {
                            liste_prof.push(parseInt(prof.split("DP_prof_")[1].split("_")[0]))
                        });
                        console.log("liste_prof: ",liste_prof)
                        searchAndSetProfLibresInProfDiv(codeMatiere,periode,liste_prof);                    
                    }
                }
            }
        }
      
    }

    function getProfLibres(codeMatiere, periode){
        
        console.log("periode la",periode);
        let idjour  = periode.split("DM_")[1].split("_")[0];
        let tranche = periode.split("DM_")[1].split("_")[1]+"_";
        tranche += periode.split("DM_")[1].split("_")[2];

        let listProfs     = currentUiContext.listProfs;
        let emploiDeTemps = currentUiContext.emploiDeTemps;
        var profOccupes   = [];
        
        //On obtient tous les enseignants de la matiere
        let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);

        //On obtient toutes les entree de l'ET qui correspondent au jour la et a la tranche la
        let emploi_selected = emploiDeTemps.filter(e=>e.id_matiere==codeMatiere && e.id_jour==idjour && e.libelle==tranche);
        console.log("ET selected", emploiDeTemps, emploi_selected, codeMatiere, idjour, tranche);
       
        //Les profs occupes seront tous les profs de ces entrees la.
        for(let j=0; j<emploi_selected.length; j++){
            emploi_selected[j].id_enseignants.forEach(prof => {
                profOccupes.push(prof)
            });
        }
         
        //Les profs libres sont les autees profs de cette matiere qui ne sont pas occupes.
        return profsMatieres.filter(p=>!profOccupes.includes(p.id));
        
    }

    

    function searchAndSetProfLibresInProfDiv(codeMatiere, periode, liste_prof_current_tranche){
        let idjour  = periode.split("DM_")[1].split("_")[0];
        let tranche = periode.split("DM_")[1].split("_")[1]+"_";

        tranche += periode.split("DM_")[1].split("_")[2];
        console.log("tranche: ",tranche)
        console.log("y Periode: ",periode);

        let listProfs     = currentUiContext.listProfs;
        let emploiDeTemps = currentUiContext.emploiDeTemps;
       
        let profLibres    = [], profOccupes = [];

        //On obtient tous les enseignants de la matiere
        let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
        console.log("*** profsMatieres: ",profsMatieres)
        console.log("*** emploiDeTemps: ",emploiDeTemps)
        
        //On obtient toutes les entree de l'ET qui correspondent au jour la et a la tranche la
        let emploi_selected = emploiDeTemps.filter(e=>e.id_matiere==codeMatiere && e.id_jour==idjour && e.libelle==tranche);
        console.log("emploi_selected: ",emploi_selected)
       
        //Les profs occupes seront tous les profs de ces entrees la.
        for(let j=0; j<emploi_selected.length; j++){
            emploi_selected[j].id_enseignants.forEach(prof => {
                profOccupes.push(prof)
            });
        }

        // profOccupes.forEach(p => {
        //     if (!liste_prof_current_tranche.includes(p.id_enseignants))
        //     profLibres.push(p)
        // });

        liste_prof_current_tranche.forEach(p => {
           if(!profOccupes.includes(p))  profOccupes.push(p)               
        });
        
        //Les profs libres sont les autees profs de cette matiere qui ne sont pas occupes.
        profLibres = profsMatieres.filter(p=>!profOccupes.includes(p.id))
    
    
        console.log("*** profLibres: ",profLibres);
        console.log("*** profOccupes: ",profOccupes);
        console.log("*** liste_prof_cureent_tranche: ",liste_prof_current_tranche);
        initProfDivWithListProfs(profLibres);    
    }


    function initProfDivWithListProfs(listeProf){
        var draggableSon, draggableSonText, draggableSonImg;   
        let nb_cours = 0;
        let nb_profs = listeProf.length;
        
        clearProflist();
        
        for (var i = 0; i < nb_profs; i++) {
            nb_cours  = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listeProf[i].id)).length;
            var heure = "heure";
            if (nb_cours==0) heure = '';
            if (nb_cours>1)  heure = "heures";
    
            PROF_DATA = {};
            draggableSon                  = document.getElementById('prof_' + listeProf[i].id);
            draggableSonText              = document.getElementById('prof_' + listeProf[i].id+'_sub');
            
            draggableSon.className        = classesP.profDivStyle;  
            draggableSon.title            = listeProf[i].nom+" "+listeProf[i].prenom;       
            
            draggableSonText.textContent  = listeProf[i].nom+" ("+ nb_cours+"h)";
            draggableSonText.className    = classesP.profTextSyle;            
    
            draggableSonImg               = document.getElementById('prof_' + listeProf[i].id + '_img');
            draggableSonImg.className     = classesP.profImgStyle;
    
    
            draggableSonImg               = document.querySelector('#prof_' + listeProf[i].id + '_img > img')
    
            if(listeProf[i].sexe=="F"){
                draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
               
            } else{
                draggableSonImg.setAttribute('src',"images/maleTeacher.png");
            }
            
            draggableSon.style.display     = 'block';
            draggableSonText.style.display = 'block';
            draggableSonImg.style.display  = 'block';
           
            PROF_DATA.idProf  = 'prof_' +listeProf[i].id;
            PROF_DATA.NomProf = listeProf[i].nom;
            PROF_DATA.sexe    = listeProf[i].sexe;
            
            CURRENT_PROFS_LIST.push(PROF_DATA);
            currentUiContext.setCurrentProfList(CURRENT_PROFS_LIST);
            PROF_DATA = {};                                     
        }
     
    }
    


    function selectedDroppedMatiereHaveSameCode(){
        var areSame = true;
        var i = 1;
        var firstSelectedIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected==true && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);
        var codeMatiere = CURRENT_DROPPED_MATIERE_LIST[firstSelectedIndex].codeMatiere;
    
        while(i < CURRENT_DROPPED_MATIERE_LIST.length && areSame==true) {
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected == true && CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentUiContext.currentIdClasseEmploiTemps && CURRENT_DROPPED_MATIERE_LIST[i].codeMatiere != codeMatiere) areSame = false;
            i++;       
        }
        return areSame;
    }

    function clearCellSelection(){
       
        for(var i=0; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){ 
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected){                
                disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
            }         
            
        }
         
    }

    function selectCell(cellId){  
        var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);

        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = true;      
        
        document.getElementById(cellId).style.borderColor ='red';

        console.log("etat", cellId, CURRENT_DROPPED_MATIERE_LIST[matiereIndex],CURRENT_DROPPED_MATIERE_LIST)
        
        clearProflist();
    }

   

    function disSelectCell(cellId) {
  
        var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);
        
        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = false;
        
        if(document.getElementById(cellId).style.backgroundColor.length==0){
            document.getElementById(cellId).style.borderColor = 'rgb(6, 83, 134)';
        } else{
            document.getElementById(cellId).style.borderColor = document.getElementById(cellId).style.backgroundColor;
        }

        console.log("etat", cellId, CURRENT_DROPPED_MATIERE_LIST[matiereIndex],CURRENT_DROPPED_MATIERE_LIST)
        
        clearProflist();
    
    }


    function  isCellSelected (cellId) {
        var index = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps)
        return (CURRENT_DROPPED_MATIERE_LIST[index].isSelected == true);
    }



    function getCountSelectedDroppedMatieres(){
        var count = 0;
        for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
            if(CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentUiContext.currentIdClasseEmploiTemps && CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
        }
        console.log("count selected",count,currentUiContext.currentIdClasseEmploiTemps);
        return count;
    }


    function clearProflist(){
        var draggableSon, draggableSonText, draggableSonImg;   
        currentUiContext.listProfs.map((prof,index)=>{
            draggableSon                  = document.getElementById('prof_' + prof.id);
            draggableSonText              = document.getElementById('prof_' + prof.id+'_sub');
            draggableSonImg               = document.getElementById('prof_' + prof.id + '_img');      
            draggableSonImg               = document.querySelector('#prof_' + prof.id + '_img > img');
    
            draggableSon.style.display     = 'none';
            draggableSonText.style.display = 'none';
            draggableSonImg.style.display  = 'none';
        }) 
        CURRENT_PROFS_LIST = [];
    }
    


    return (        
        <DraggableDiv id={props.id} className={props.dragDivClassName} style={props.style} type='matiere' title={props.title} onClick={matiereClickHandler}>
            <div id={props.id+'_sub'} className={props.matiereTitleStyle}>
                {props.children}
            </div>
        </DraggableDiv>          
    );

}
export default MatiereDiv;