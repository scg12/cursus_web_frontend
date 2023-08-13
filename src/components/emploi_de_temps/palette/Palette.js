import React, { useState } from 'react';

import classes from './Palette.module.css';

import { useContext } from "react";
import UiContext from '../../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../../translation/i18n';
import CustomButton from '../../customButton/CustomButton';
import classesP from './Palette.module.css';

// import {SELECTED_MATIERE_ID, CURRENT_PROFS_LIST, SELECTED_MATIERE_TAB, COUNT_SELECTED_MATIERES, CURRENT_DROPPED_MATIERE_LIST, SELECTED_PROF_ID, SELECTED_PROF_TAB, COUNT_SELECTED_PROFS, CURRENT_DROPPED_PROFS_LIST} from '../ET_Module'
// import {PROFLIST_MAXSIZE, TAB_COLORS} from '../ET_Module';
// import {getProfsList,getProfs, initProfList, setMatiereColor, getCountSelectedDroppedMatieres, updateCountSelectedMatieres, AddValueToSelectedMatiereTab, deleteMatiere, deleteProf, clearProflist} from '../ET_Module';

var PROF_DATA ={
    idProf:'',
    NomProf:'',
    idJour:'',
    heureDeb:'',
    heureFin:'',
    IdMatiere:''
}
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

 
function Palette(props) {

    const currentUiContext = useContext(UiContext);
    const [isValid,setIsValid]=useState(false);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };



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

    function getCurrentButtonTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_buttonStyle;
            case 'Theme2': return classes.Theme2_buttonStyle;
            case 'Theme3': return classes.Theme3_buttonStyle;
            default: return classes.Theme1_buttonStyle;
        }
    }

    function getCurrentFooterTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
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
    function getCountSelectedDroppedMatieres(){
        var count = 0;
        for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
        }
        return count;
    }
    function deleteMatiere () {
        var DropZoneId,toDeleIndex, droppedProfId, droppedProfZone,idTab;
        var countMatiere, tabPos, profDropZone, AssociatedProfCount;
        countMatiere = getCountSelectedDroppedMatieres();
        // var tabSelectedDroppedMatieres = getSelectedDroppedMatieres();
       
        tabPos = 0;
        console.log('ggdgdgd',countMatiere, CURRENT_DROPPED_MATIERE_LIST);
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
                console.log('matiere a supprimer',CURRENT_DROPPED_MATIERE_LIST[toDeleIndex]);
                var matiereToDeleteProf = {...CURRENT_DROPPED_MATIERE_LIST[toDeleIndex]};
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
    function deleteProf (){
        var DropProfId, children, profDropZone;
        var associatedMatiere, idTab, matiereIndex,profIndex, indexProf, profId;
        var countProfs = getCountSelectedDroppedProfs();
        console.log("delete prof: ",countProfs)
        // tabProfsID
        // let matiereDroppedSelected = CURRENT_DROPPED_MATIERE_LIST.filter
        if (countProfs >0) {
        //    let CURRENT_DROPPED_PROFS_LIST = currentUiContext.CURRENT_DROPPED_PROFS_LIST;
        //    let CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
            for(var i=0; i < countProfs; i++){
                profIndex = CURRENT_DROPPED_PROFS_LIST.findIndex((prof)=>prof.isSelected == true)
               console.log("ici : ",profIndex)
               console.log("yo ",CURRENT_DROPPED_PROFS_LIST)
                if(profIndex>=0){
                    DropProfId = CURRENT_DROPPED_PROFS_LIST[profIndex].idProf;
                    console.log(DropProfId,CURRENT_DROPPED_PROFS_LIST[profIndex])
                    associatedMatiere = CURRENT_DROPPED_PROFS_LIST[profIndex].idMatiere;
                    console.log(associatedMatiere)
                    matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == associatedMatiere)
                    console.log(matiereIndex)
                    if (matiereIndex>=0){
                        indexProf = CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.findIndex((prof)=> prof == DropProfId);
                        if (profIndex>=0) {
                            console.log("prof trouvé: ",DropProfId);
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
                            nomProf = listProfs[0].nom+" "+listProfs[0].prenom;
                            if(emp.length>0){
                                for(let i=0;i<emp.length;i++){
                                    let val =  emp[i].value;
                                    console.log(val,"Mr."+nomProf+"%prof_"+tab[2]);
                                    val = val.replace("*Mr."+nomProf+"%prof_"+tab[2],"")
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
                                currentUiContext.setEmploiDeTemps(emploiDeTemps);

                            }
                        }
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
            currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
            SELECTED_PROF_TAB =[];
            COUNT_SELECTED_PROFS = 0;
            SELECTED_PROF_ID='';        
        } 
    }
    function setMatiereColor(colorString){
    
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
    
        // draggableSonImg.setAttribute('src','images/blank_prof.JPG');
        // if (draggableSonImg.hasAttribute('src')) draggableSonImg.removeAttribute('src');
        // draggableSonImg.setAttribute('src',null);  
        // if (draggableSonImg!=null)
            // while(draggableSonImg.firstChild) draggableSonImg.removeChild(draggableSonImg.firstChild);
          
    } 
    CURRENT_PROFS_LIST = [];
}
    function getCountSelectedDroppedProfs(){
        var count = 0;
        var nb = CURRENT_DROPPED_PROFS_LIST.length;
        // console.log("getCountSelectedDroppedProfs CURRENT_DROPPED_PROFS_LIST: ",CURRENT_DROPPED_PROFS_LIST,CURRENT_DROPPED_PROFS_LIST.length)
        for(let i=0 ; i<nb; i++){
            if(CURRENT_DROPPED_PROFS_LIST[i].isSelected==true) count++;
        }
        return count;
    }
    // function getProfsList2(codeMatiere, listProfs,emploiDeTemps,idjour,h_deb,h_fin)
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


    function enableprofsList(){
        currentUiContext.setIsMatiereEnable(false);
    }
   
    return (    
        <div style={{display:'flex', flexDirection:'column'}}>
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