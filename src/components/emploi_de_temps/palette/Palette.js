import React, { useState } from 'react';

import classes from './Palette.module.css';

import { useContext } from "react";
import UiContext from '../../../store/UiContext';
import BackDrop from '../../backDrop/BackDrop';
import MsgBox from '../../msgBox/MsgBox';

import { useTranslation } from "react-i18next";
import '../../../translation/i18n';
import CustomButton from '../../customButton/CustomButton';
import classesP from './Palette.module.css';

// import {SELECTED_MATIERE_ID, CURRENT_PROFS_LIST, SELECTED_MATIERE_TAB, COUNT_SELECTED_MATIERES, CURRENT_DROPPED_MATIERE_LIST, SELECTED_PROF_ID, SELECTED_PROF_TAB, COUNT_SELECTED_PROFS, CURRENT_DROPPED_PROFS_LIST} from '../ET_Module'
// import {PROFLIST_MAXSIZE, TAB_COLORS} from '../ET_Module';
// import {getProfsList,getProfs, initProfList, setMatiereColor, getCountSelectedDroppedMatieres, updateCountSelectedMatieres, AddValueToSelectedMatiereTab, deleteMatiere, deleteProf, clearProflist} from '../ET_Module';

var PROF_DATA ={}
let COUNT_SELECTED_PROFS;
let SELECTED_PROF_ID;

let SELECTED_PROF_TAB;
let CURRENT_PROFS_LIST;
let PROFLIST_MAXSIZE;
var TAB_COLORS = {};
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
let CURRENT_DROPPED_MATIERE_LIST;
let CURRENT_DROPPED_PROFS_LIST;

var droppedPPid;
var AssociatedProfCount;
var currentDroppedProfs;
var deleteContinu = true;
var ppemploiDeTemps;
var ppIndex;

var chosenMsgBox;
const MSG_QUESTION_PAL1 = 110;
const MSG_QUESTION_PAL2 = 111;
const MSG_SUCCESS_PAL   = 12;
const MSG_WARNING_PAL   = 13;
const MSG_ERROR_PAL     = 12;

 
function Palette(props) {

    const currentUiContext = useContext(UiContext);
    const [isValid,setIsValid]=useState(false);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
  
    function getOngletProfStyle()
    { // Choix du theme courant
        if(currentUiContext.isMatiereEnable){
            switch(selectedTheme){
                case 'Theme1': return classes.paletteContainerP + ' '+ classes.Theme1_Btnstyle +' buttonDefault ';
                case 'Theme2': return classes.paletteContainerP + ' '+ classes.Theme2_Btnstyle +' buttonDefault ';
                case 'Theme3': return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault ';
                default: return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault ';
            }
        } else {
            switch(selectedTheme){
                case 'Theme1': return classes.paletteContainerP + ' '+ classes.Theme1_Btnstyle +' buttonDefault Theme1_active';
                case 'Theme2': return classes.paletteContainerP + ' '+ classes.Theme2_Btnstyle +' buttonDefault Theme2_active';
                case 'Theme3': return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault Theme3_active';
                default: return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault Theme1_active';
            }

        }
       
    }


    function getOngletMatiereStyle()
    { // Choix du theme courant
        if(currentUiContext.isMatiereEnable){
            switch(selectedTheme){
                case 'Theme1': return classes.paletteContainerP + ' '+ classes.Theme1_Btnstyle +' buttonDefault Theme1_active';
                case 'Theme2': return classes.paletteContainerP + ' '+ classes.Theme2_Btnstyle +' buttonDefault Theme2_active';
                case 'Theme3': return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault Theme3_active';
                default: return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault Theme1_active';
            }
           
        } else {
            switch(selectedTheme){
                case 'Theme1': return classes.paletteContainerP + ' '+ classes.Theme1_Btnstyle +' buttonDefault ';
                case 'Theme2': return classes.paletteContainerP + ' '+ classes.Theme2_Btnstyle +' buttonDefault ';
                case 'Theme3': return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault ';
                default: return classes.paletteContainerP + ' '+ classes.Theme3_Btnstyle +' buttonDefault ';
            }
        }       
    }

    
    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_QUESTION_PAL1: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                
                //currentUiContext.setIsParentMsgBox(true);                
               
                var profDropZone =  document.getElementById(droppedPPid); 
                var profIndex = currentDroppedProfs.findIndex((elt)=>elt.idProf == droppedPPid);
                
                if(profIndex>=0){
                    var nomProf = currentDroppedProfs[profIndex].NomProf;
                    var idPP = "prof_" + nomProf;
                    document.getElementById(idPP).style.display="none";
                    currentDroppedProfs.splice(profIndex,1);
                }

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
                //AssociatedProfCount--;
                return 1;                
            }

            case MSG_QUESTION_PAL2: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                //On update l'emploi de temps avec les modifs pour suppression effective
                currentUiContext.setEmploiDeTemps(ppemploiDeTemps);

                var profDropZone =  document.getElementById(droppedPPid);  
                var profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((elt)=>elt.idProf == droppedPPid);
                
                if(profIndex>=0){
                    var nomProf = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf;
                    var idPP = "prof_" + nomProf;
                    document.getElementById(idPP).style.display="none";
                }

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
                
                CURRENT_DROPPED_PROFS_LIST.splice(ppIndex,1);
                return 1;
                
            }

            case MSG_SUCCESS_PAL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_PAL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            
            case MSG_QUESTION_PAL1: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                deleteContinu = false
                return 1;
            }

            case MSG_QUESTION_PAL2: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
               var profDropZone =  document.getElementById(droppedPPid);  
               if (profDropZone.style.borderColor=='red'){
                   console.log("pppppdhdhd")
                   profDropZone.style.borderStyle = null;
                   profDropZone.style.borderWidth = null;
                   profDropZone.style.borderColor = null;
                   profDropZone.className = null;
               }
                return 1;
            }

            case MSG_SUCCESS_PAL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_PAL :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }


    

    function deleteElements(){
        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
        CURRENT_DROPPED_PROFS_LIST = currentUiContext.CURRENT_DROPPED_PROFS_LIST;
        console.log("CURRENT_DROPPED_MATIERE_LIST: ",CURRENT_DROPPED_MATIERE_LIST);
        console.log("CURRENT_DROPPED_PROFS_LIST: ",CURRENT_DROPPED_PROFS_LIST);
        deleteMatiere();
        deleteProf();
        currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST,-1);
        currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
    }

    // function getCountSelectedDroppedMatieres(){
    //     var count = 0;
    //     for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
    //         if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
    //     }
    //     return count;
    // }

    function getCountSelectedDroppedMatieres(){
        var count = 0;
        for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
            if(CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentUiContext.currentIdClasseEmploiTemps && CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
        }
        console.log("count selected",count,currentUiContext.currentIdClasseEmploiTemps);
        return count;
    }


    function isProfPrincipal(idprof,classeId){
        var pp = currentUiContext.currentPPList.find((elt)=>(elt.PP_id == idprof && elt.id_classe == classeId))
        if(pp!=undefined) return true;
        else return false;
    }

    function deleteMatiere () {

        var DropZoneId,toDeleIndex, droppedProfId, droppedProfZone,idTab;
        var countMatiere, tabPos, profDropZone;
        var currentDroppedProfs = [];
        countMatiere = getCountSelectedDroppedMatieres();
       
       
        tabPos = 0;
        console.log('ggdgdgd',countMatiere, CURRENT_DROPPED_MATIERE_LIST);

        while(tabPos<countMatiere){
            
            var toDeleIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.isSelected == true && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps)
            
            DropZoneId = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].idMatiere;
            idTab = DropZoneId.split('_');
            droppedProfZone ='P_'+idTab[1]+'_'+idTab[2]+'_'+idTab[3];
                        
            if(toDeleIndex >= 0){
                
                var matiereToDeleteProf = {...CURRENT_DROPPED_MATIERE_LIST[toDeleIndex]};
               
                if (CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length > 0) {

                    currentDroppedProfs = [...currentUiContext.CURRENT_DROPPED_PROFS_LIST];

                    AssociatedProfCount = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.length;
                    
                    while(AssociatedProfCount > 0 && deleteContinu){
                        
                        droppedProfId  = CURRENT_DROPPED_MATIERE_LIST[toDeleIndex].tabProfsID.shift();                        
                        profDropZone   =  document.getElementById(droppedProfId); 
                        
                        var idProf    = droppedProfId.split('_')[2];
                        var idClasse  = document.getElementById("selectClasse").value;
                        var droppedPP = currentDroppedProfs.filter((elt)=>elt.idProf.split('_')[2] == idProf);
                        console.log('gggggdrop',droppedPP);
                        
                        if (isProfPrincipal(idProf,idClasse)) {
                            droppedPPid  = droppedProfId;
                            if(droppedPP.length == 1){
                                chosenMsgBox = MSG_QUESTION_PAL1;
                                currentUiContext.showMsgBox({
                                    visible:true, 
                                    msgType:"question", 
                                    msgTitle:t("question_M"),
                                    message:t("L'enseignant affecte a cette matiere est professeur principal. Voulez-vous vraiment supprimer cette matiere?")
                                }) 
                            }

                        } else {
                            var profIndex = currentDroppedProfs.findIndex((elt)=>elt.idProf == droppedProfId);
                            if(profIndex>=0){
                                currentDroppedProfs.splice(profIndex,1);
                            
                                if(droppedPP.length == 1){
                                    var nomProf = currentDroppedProfs[profIndex].NomProf;
                                    var idPP = "prof_" + nomProf;
                                    document.getElementById(idPP).style.display="none";
                                }
                                
                            }

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
                           
                        }    

                        AssociatedProfCount--;                   
                    }
                    
                    if(deleteContinu){
                        CURRENT_DROPPED_MATIERE_LIST.splice(toDeleIndex,1);
                        document.getElementById(DropZoneId).remove();                           
                        currentUiContext.addProfToDroppedProfList(currentDroppedProfs,-1);
                        console.log("prof associes", currentDroppedProfs, currentUiContext.CURRENT_DROPPED_PROFS_LIST,droppedProfId);
                    }
                        
                   
                } else {
                    CURRENT_DROPPED_MATIERE_LIST.splice(toDeleIndex,1);
                    document.getElementById(DropZoneId).remove();                   
                }               
            }
            tabPos++;

            let emploiDeTemps = currentUiContext.emploiDeTemps;
            let emp = emploiDeTemps.filter(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                e.id_jour==idTab[1]&&e.libelle==idTab[2]+"_"+idTab[3]&&e.id_matiere==matiereToDeleteProf.codeMatiere);
            let empIndex = emploiDeTemps.findIndex(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                e.id_jour==idTab[1]&&e.libelle==idTab[2]+"_"+idTab[3]&&e.id_matiere==matiereToDeleteProf.codeMatiere);
                console.log("empIndex: ",empIndex);

            if (emp.length>0){
                let empToUpdate = emp[0];
                // C'est un cours qui a été créé pendant la session courante on peut simplement le supprimer
                if(empToUpdate.modify.includes("c"))
                      emploiDeTemps.splice(empIndex,1)
                // Ca vient de la bd donc la suppression doit se faire en bd
                else{
                    empToUpdate.modify +="s";
                    emploiDeTemps.splice(empIndex,1,empToUpdate)
                    console.log("emploiDeTemps: ",emploiDeTemps);
                }

                    
                    currentUiContext.setEmploiDeTemps(emploiDeTemps);
                

            }
        }
        currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST,-2);
        clearProflist();
    }

    function clearPPList(){
        var parentDiv = document.getElementById("profsList2");
        var childDiv = undefined
        while(parentDiv.firstChild){
            childDiv = parentDiv.firstChild;
            parentDiv.removeChild(parentDiv.firstChild);
        } 
    }
    
    function deleteProf (){
        
        var DropProfId, children, profDropZone;
        var associatedMatiere, idTab, matiereIndex,profIndex, indexProf, profId;
        var countProfs = getCountSelectedDroppedProfs();
        
        console.log("delete prof: ",countProfs)
       
        if (countProfs >0) {
            for(var i=0; i < countProfs; i++){
                profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.isSelected == true)
                DropProfId = CURRENT_DROPPED_PROFS_LIST[profIndex].idProf;
                associatedMatiere = CURRENT_DROPPED_PROFS_LIST[profIndex].idMatiere;
                matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == associatedMatiere && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps)
                
                if (profIndex>=0 && matiereIndex>=0){
                    indexProf = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.findIndex((prof)=> prof == DropProfId);
                   
                    CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.splice(indexProf,1);

                    var id_matiere = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].codeMatiere;
                    var tab = DropProfId.split("_");
                    let emploiDeTemps = currentUiContext.emploiDeTemps;
                    let emp = emploiDeTemps.filter(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                        e.id_jour==tab[3]&&e.libelle==tab[4]+"_"+tab[5]&&e.id_matiere==id_matiere);
                    console.log("emp: ",emp);
                    let nomProf = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf[1];
                    console.log("Mr"+nomProf+"%prof_"+tab[2]);
                    
                    // 5:10h30_11h25*2*Mr.Enseigant1 Aminata%prof_5*Mr.Censeur Censeur%prof_14
                    let listProfs = currentUiContext.listProfs.filter(item=>item.id==tab[2]);
                    console.log(listProfs);
                    nomProf  = listProfs[0].nom+" "+listProfs[0].prenom;
                    var sexe = listProfs[0].sexe;
                    if(emp.length>0){
                        for(let i=0;i<emp.length;i++){
                            let val =  emp[i].value;
                            console.log(val,"Mr."+nomProf+"%prof_"+tab[2]);
                            val = (sexe=="M") ? val.replace("*Mr."+nomProf+"%prof_"+tab[2],""):val.replace("*Mme."+nomProf+"%prof_"+tab[2],"")
                            emp[i].value = val;
                            console.log(emp);
                        }
                        let empIndex =-1;
                        empIndex=emploiDeTemps.findIndex(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                            e.id_jour==tab[3]&&e.libelle==tab[4]+"_"+tab[5]&&e.id_matiere==id_matiere);
                            console.log("empIndex: ",empIndex);
                            if(empIndex>-1){
                                emploiDeTemps[empIndex] = emp[0];
                                emploiDeTemps[empIndex].modify += "e";
                                emploiDeTemps[empIndex].id_enseignants.splice();
                                let idEnsIndex = -1;
                                idEnsIndex = emploiDeTemps[empIndex].id_enseignants.findIndex(item=>item==tab[2]);
                                console.log("idEnsIndex: ",idEnsIndex,tab[2])
                                if(idEnsIndex>-1) 
                                    emploiDeTemps[empIndex].id_enseignants.splice(idEnsIndex,1);

                            }
                        console.log("emploiDeTemps: ",emploiDeTemps)                     
                    }

                    //console.log("prof trouvé: ",DropProfId);
                    var idProf   = DropProfId.split('_')[2];
                    var idClasse = document.getElementById("selectClasse").value;
                    var droppedPP = CURRENT_DROPPED_PROFS_LIST.filter((elt)=>elt.idProf.split('_')[2] == idProf);

                    if (isProfPrincipal(idProf,idClasse)) {
                        droppedPPid  = DropProfId;
                        ppemploiDeTemps = [...emploiDeTemps];
                        ppIndex = profIndex;                        

                        if(droppedPP.length == 1){
                            chosenMsgBox = MSG_QUESTION_PAL2;
                            currentUiContext.showMsgBox({
                                visible:true, 
                                msgType:"question", 
                                msgTitle:t("question_M"),
                                message:t("L'enseignant selectionne est principal. Voulez-vous vraiment le supprimer ?")
                            }) 
                        }

                    } else {
                        //On update l'emploi de temps avec les modifs pour suppression effective
                        currentUiContext.setEmploiDeTemps(emploiDeTemps);

                        profDropZone =  document.getElementById(DropProfId);  
                        var profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((elt)=>elt.idProf == DropProfId);
                
                        if(profIndex>=0 && droppedPP.length==1){
                            var ProfName = CURRENT_DROPPED_PROFS_LIST[profIndex].NomProf;
                            var idPP = "prof_" + ProfName;
                            document.getElementById(idPP).style.display="none";
                        }

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
                        
                        CURRENT_DROPPED_PROFS_LIST.splice(profIndex,1);       
                    }
                
                } else alert("Erreur, le prof n'est pas enregistre pour une matiere");              
            }
                 
            currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
            //SELECTED_PROF_TAB =[];
            //COUNT_SELECTED_PROFS = 0;
            //SELECTED_PROF_ID='';        
        } 
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
        } 
        CURRENT_PROFS_LIST = [];
    }

    function getCountSelectedDroppedProfs(){
        var count = 0;
        var nb = CURRENT_DROPPED_PROFS_LIST.length;
        for(let i=0 ; i<nb; i++){
            if(CURRENT_DROPPED_PROFS_LIST[i].isSelected==true) count++;
        }
        return count;
    }

    function getProfsList2(codeMatiere)
    {   console.log("codeMatiere: ",codeMatiere);
        var libre=true;
        let listProfs = currentUiContext.listProfs;
        let emploiDeTemps = currentUiContext.emploiDeTemps
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
    function initProfListWithProfs2(){
        var parent = document.getElementById('profList');
        var draggableSon, draggableSonText, draggableSonImg;
        let listeProf = currentUiContext.listeProf;
        clearProflist();
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

    function enableMatieresList(){
        currentUiContext.setIsMatiereEnable(true);
    }

    function initMatiereList(listeMatieres){
        var CURRENT_MATIERE_LIST=[];
        console.log("listeMatieres: ",listeMatieres)
      
        var MATIERE_DATA ={}
        var parent, draggableSon;
        var tabMatiere =[];
        
        for (var i = 0; i < listeMatieres.length; i++) {
            
            tabMatiere = listeMatieres[i].split('*');
            parent =  document.getElementById('matiere_' + tabMatiere[1]);
            draggableSon = document.getElementById('matiere_' + tabMatiere[1]+'_sub');
            parent.className = classes.matiereStyle; 
            
            // parent.style.backgroundColor=COLORS[colorIndexes[i]];  
            parent.style.backgroundColor=tabMatiere[2];  
            parent.title = tabMatiere[0];
            
            MATIERE_DATA = {};
            MATIERE_DATA.idMatiere = 'matiere_' + tabMatiere[1];
            MATIERE_DATA.libelleMatiere = tabMatiere[0];
            MATIERE_DATA.codeMatiere = tabMatiere[1];
           
            MATIERE_DATA.colorCode = tabMatiere[2];
            
            CURRENT_MATIERE_LIST[i] = MATIERE_DATA;
            
            draggableSon.textContent = tabMatiere[0];
            draggableSon.className = classes.matiereTitleStyle;                     
                  
        }
        MATIERE_DATA = {};
        console.log('matieres',CURRENT_MATIERE_LIST);
        currentUiContext.setCURRENT_MATIERE_LIST(CURRENT_MATIERE_LIST);
    }

    function enableprofsList(){
        currentUiContext.setIsMatiereEnable(false);
    }
   
    return (    
        <div style={{display:'flex', flexDirection:'column'}}> 
            {/* {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && 
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            } */}

            <div className={classes.paletteContainer} style={{marginBottom:'2vh'}}> 
                <div className={classes.buttonContainer}>
                    <CustomButton
                        btnText=''
                        buttonStyle={classes.buttonStyle}
                        //btnTextStyle = {classes.btnTextStyleX}
                        hasIconImg= {true}
                        imgSrc='images/delete.png'
                        imgStyle = {classes.imgStyle}
                        btnClickHandler={deleteElements}
                    />           
                </div>
            </div>

            <CustomButton  
                id='matieresPalette'
                btnText=' Matieres'
                hasIconImg= {false}
                buttonStyle={getOngletMatiereStyle()}
                style={{marginBottom:'1.3vh'}}
                btnClickHandler={enableMatieresList}
                btnTextStyle={classes.ongletTexte}                                                   
            />

            <CustomButton 
                id='profPrincipalPalette' 
                btnText=' Principal'
                hasIconImg= {false}
                buttonStyle={getOngletProfStyle()}
                btnClickHandler={enableprofsList}
                btnTextStyle={classes.ongletTexte} 
                disable={(currentUiContext.CURRENT_DROPPED_PROFS_LIST.length == 0)}                                                   
            />  
        </div> 
       
    );
}

export default Palette;