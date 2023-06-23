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
            if(e.ctrlKey || e.metaKey){
                if(!isCellSelected( props.id)) {
                    //clearCellSelection();
                    selectCell(props.id);                
                } else {
                    //clearCellSelection();
                    disSelectCell(props.id);             
                }
            } else {
                if(!isCellSelected( props.id)) {
                    clearCellSelection();
                    selectCell(props.id);                
                } else {
                    clearCellSelection();
                    disSelectCell(props.id);                
                }

            }
           
            var countSelected = getCountSelectedDroppedMatieres()

            if(countSelected==1){
                var periode ; //ici il faudra initialiser la periode de la matiere selectionnee.
                let liste_prof = [],tab_prof_id;
                indexMatiere = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
                codeMatiere = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
                // getProfsList(codeMatiere, periode);
                periode = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].idMatiere;
                tab_prof_id = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].tabProfsID;
                console.log("tab_prof_id: ",tab_prof_id);
                tab_prof_id.forEach(prof => {console.log("$$ prof: ",prof,prof.split("DP_prof_")[1].split("_")[0]);
                    liste_prof.push(parseInt(prof.split("DP_prof_")[1].split("_")[0]))
                });
                console.log("liste_prof: ",liste_prof)
                // console.log("1indexMatiere: ",CURRENT_DROPPED_MATIERE_LIST[indexMatiere]);             
                getProfsList2(codeMatiere,periode,liste_prof);                      
        
            } else {
                if(countSelected >1){
                    
                    if(selectedDroppedMatiereHaveSameCode()){
                        let liste_prof = [],tab_prof_id;
                        var listePeriode; //ici il faudra initialiser avec la liste des periodes des matieres selectionnees
                        indexMatiere = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>(matiere.isSelected == true));
                        codeMatiere = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].codeMatiere;
                        // getProfsList(codeMatiere, listePeriode);     
                        periode = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].idMatiere;
                        tab_prof_id = CURRENT_DROPPED_MATIERE_LIST[indexMatiere].tabProfsID;
                        tab_prof_id.forEach(prof => {
                            liste_prof.push(parseInt(prof.split("DP_Prof_")[1].split("_")[0]))
                        });
                        console.log("liste_prof: ",liste_prof)
                        // console.log("2indexMatiere: ",CURRENT_DROPPED_MATIERE_LIST[indexMatiere]);             
                        getProfsList2(codeMatiere,periode,liste_prof);                    
                    }
                }
            }
        }
      
    }
    function getProfsList2(codeMatiere,periode,liste_prof_current_tranche){
        let idjour = periode.split("DM_")[1].split("_")[0];
        let tranche = periode.split("DM_")[1].split("_")[1]+"_";
        tranche += periode.split("DM_")[1].split("_")[2];
        console.log("tranche: ",tranche)
        console.log("y Periode: ",periode);
        let listProfs = currentUiContext.listProfs;
        let emploiDeTemps = currentUiContext.emploiDeTemps;
        var libre=true;
        let profLibres = [],profOccupes = [];
        let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
        console.log("*** profsMatieres: ",profsMatieres)
        console.log("*** emploiDeTemps: ",emploiDeTemps)
        let emploi_selected = emploiDeTemps.filter(e=>e.id_matiere==codeMatiere&&e.id_jour==idjour&&e.libelle==tranche);
        console.log("emploi_selected: ",emploi_selected)
        let emp;
        let idProfs =[];
        for(let j=0;j<emploi_selected.length;j++){
            emploi_selected[j].id_enseignants.forEach(prof => {
                profOccupes.push( prof)
            });
        }
        profOccupes.forEach(p => {
            if (!liste_prof_current_tranche.includes(p.id_enseignants))
            profLibres.push(p)
        });
        liste_prof_current_tranche.forEach(p => {
           if(!profOccupes.includes(p))
                profOccupes.push(p)
        });
        profLibres = profsMatieres.filter(p=>!profOccupes.includes(p.id))
    
    
        console.log("*** profLibres: ",profLibres);
        console.log("*** profOccupes: ",profOccupes);
        console.log("*** liste_prof_cureent_tranche: ",liste_prof_current_tranche);
        initProfListWithProfs2(profLibres);    
    }

    function initProfListWithProfs2(listeProf){
        var parent = document.getElementById('profList');
        var draggableSon, draggableSonText, draggableSonImg;
    
        clearProflist();
        //alert(listeProf);
        let nb = listeProf.length;
        let nb_cours = 0;
        for (var i = 0; i < nb; i++) {
            nb_cours = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listeProf[i].id)).length;

            PROF_DATA = {};
            draggableSon =  document.getElementById('prof_' + listeProf[i].id);
            draggableSonText = document.getElementById('prof_' + listeProf[i].id+'_sub');
            
            draggableSon.className = classesP.profDivStyle;  
            draggableSon.title = listeProf[i].nom+" "+listeProf[i].prenom;       
            
            draggableSonText.textContent = listeProf[i].nom+" ("+nb_cours+"h)";
            draggableSonText.className = classesP.profTextSyle;            
    
            draggableSonImg =  document.getElementById('prof_' + listeProf[i].id + '_img');
            draggableSonImg.className = classesP.profImgStyle;
    
            draggableSonImg = document.querySelector('#prof_' + listeProf[i].id + '_img > img')
    
            if(listeProf[i].sexe=="M")
                draggableSonImg.setAttribute('src',"images/maleTeacher.png");
            else
                draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
            draggableSonImg.style.display = 'block';

    
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
    function selectedDroppedMatiereHaveSameCode(){
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
    function clearCellSelection(){
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
    function selectCell(cellId){
   
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
    function disSelectCell(cellId) {
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
    function  isCellSelected (cellId) {
        var index = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId)
        return (CURRENT_DROPPED_MATIERE_LIST[index].isSelected == true);
    }
    function getCountSelectedDroppedMatieres(){
        var count = 0;
        for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
        }
        return count;
    }
    function clearProflist(){
        let listProfs = currentUiContext.listProfs;
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
            draggableSonImg.style.display = 'none';

            // if (draggableSonImg.hasAttribute('src')) draggableSonImg.removeAttribute('src');
            //draggableSonImg.setAttribute('src',null);  
              
        } 
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