import React from 'react';
import {useDrop} from 'react-dnd';
import { isMobile } from 'react-device-detect';
import {useState, useContext, useEffect} from "react";
import UiContext from '../../store/UiContext';
import classes from '../emploi_de_temps/EmploiT.module.css';
import MatiereDiv from '../emploi_de_temps/matiereDiv/MatiereDiv';
import ProfDiv from '../emploi_de_temps/profDiv/ProfDiv';
import classesP from '../emploi_de_temps/palette/Palette.module.css';


var droppedMatiere;
var droppedProf ={
    idProf:'',
    NomProf:'',
    sexe:'M',
    idJour:'',
    heureDeb:'',
    heureFin:'',
    IdMatiere:''
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
var jour;
var PeriodDeb;
var PeriodFin,PeriodId;
var classeId;
var droppableZoneWidth;
let CURRENT_DROPPED_MATIERE_LIST=[];
let CURRENT_MATIERE_LIST=[];


let CURRENT_PROFS_LIST=[];
let CURRENT_DROPPED_PROFS_LIST;




function DroppableDiv(props){

    const [boardMatieres,setBoardMatieres] = useState([]);
    const [boardProfs,setBoardProfs] = useState([]);
    const currentUiContext = useContext(UiContext);

    // useEffect(()=>{
        // if(matiereDropped){
        //     selectCell(droppedMatiere.idMatiere);
        //     var droppedMatieresTab = [...CURRENT_DROPPED_MATIERE_LIST];
        //     currentUiContext.addMatiereToDroppedMatiereList(droppedMatieresTab, -1);
        // }
    // },[])

    const[{isOver},drop] = useDrop(()=>({
        accept:  props.acceptType,

        drop :  (item) => dropHandler(item.id),
  
            collect: (monitor) => ({
            isOver:!!monitor.isOver(),
        })
    }),[currentUiContext]);
    
    var dropZone = props.id.split('_'); 
    var matiereIndex, profIndex;
     

    const dropHandler=(id)=>{
        //alert(id);
        CURRENT_MATIERE_LIST=currentUiContext.CURRENT_MATIERE_LIST;
        CURRENT_DROPPED_MATIERE_LIST=currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
        CURRENT_PROFS_LIST = currentUiContext.CURRENT_PROFS_LIST;
        console.log("*** dropHandler id: ",id,CURRENT_MATIERE_LIST);
        console.log("CURRENT_DROPPED_MATIERE_LIST:",CURRENT_DROPPED_MATIERE_LIST);
        console.log("CURRENT_MATIERE_LIST:",CURRENT_MATIERE_LIST);
        CURRENT_DROPPED_PROFS_LIST=currentUiContext.CURRENT_DROPPED_PROFS_LIST;

        var id_matiere = 0;
        if(props.acceptType == 'matiere') {
            //On reactive le button enregistrer
            currentUiContext.setETDataChanged(false);
            
            jour = dropZone[0];
            PeriodDeb = dropZone[1];
            PeriodFin = dropZone[2];

            // PeriodId = dropZone[3];
            var idMatiereToDrop = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
            if (document.getElementById(idMatiereToDrop) == null || document.getElementById(idMatiereToDrop)== undefined){
                clearCellSelection();
                droppableZoneWidth = document.getElementById(props.id).style.width;
                id_matiere = parseInt(id.split("matiere_")[1]);
                console.log("id_matiere: ",id_matiere)
                matiereIndex = CURRENT_MATIERE_LIST.findIndex((matiere)=>id == matiere.idMatiere);
                // matiereIndex = currentUiContext.matieresSousEtab.findIndex((matiere)=>matiere.id == matiere.idMatiere);
                console.log("CURRENT_MATIERE_LIST: ",CURRENT_MATIERE_LIST," matiereIndex: ",matiereIndex)
            
                // droppedMatiere = {...CURRENT_MATIERE_LIST[matiereIndex]};
                droppedMatiere = {...CURRENT_MATIERE_LIST[matiereIndex]};
                console.log('couleur',droppedMatiere.colorCode);
                droppedMatiere.idMatiere = idMatiereToDrop;
                droppedMatiere.idJour = jour;
                droppedMatiere.isSelected = true;
                droppedMatiere.isOld = false;
                droppedMatiere.heureDeb = PeriodDeb;
                droppedMatiere.heureFin = PeriodFin;
                droppedMatiere.idClasse = parseInt(currentUiContext.currentIdClasseEmploiTemps);
                droppedMatiere.tabProfsID =[];      

                let emp = {
                    libelle: PeriodDeb+"_"+PeriodFin,
                    id_jour: jour,
                    id_tranche: 0,
                    id_classe: currentUiContext.currentIdClasseEmploiTemps,
                    id_matiere: id_matiere,
                    id_enseignants: [],
                    value: jour+":"+PeriodDeb+"_"+PeriodFin+"*0",
                    modify: "c"
                }
                currentUiContext.setEmploiDeTemps([...currentUiContext.emploiDeTemps,emp]);

               
                // *reactiver
                setBoardMatieres((boardMatieres)=>[...boardMatieres, droppedMatiere]);
                
                //MISE A JOUR DES DONNEES GLOBALES
                // *reactiver
                console.log("before AddValueToValueDroppedMatiereList: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST)
                AddValueToValueDroppedMatiereList(-1,droppedMatiere);
                console.log("after AddValueToValueDroppedMatiereList: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST)


                // var droppedMatieresTab = [...CURRENT_DROPPED_MATIERE_LIST];
                var droppedMatieresTab = CURRENT_DROPPED_MATIERE_LIST;
                // *reactiver
                currentUiContext.addMatiereToDroppedMatiereList(droppedMatieresTab, -1);
                console.log("currentUiContext.CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST)
                var periode;///va etre initialise avec la periode de la grille.
               
                // getProfsList(droppedMatiere.codeMatiere, periode);
                // getProfsList2(droppedMatiere.codeMatiere, currentUiContext.listProfs);
                console.log("--- currentUiContext.listProfs: ",currentUiContext.listProfs);
                getProfsList2(id_matiere, currentUiContext.listProfs,currentUiContext.emploiDeTemps,jour,PeriodDeb,PeriodFin);
            } else{
                alert("Vous ne pouvez pas placer plus d'une matiere au meme emplacement!")
            }
            
        } else {
            if(props.acceptType == 'profImage') {
                currentUiContext.setETDataChanged(false);
                //alert("iciiiiii")
                jour = dropZone[1];
                PeriodDeb = dropZone[2];
                PeriodFin = dropZone[3];
                let profId;

                var idMat = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
                var droppedProfId = 'DP_'+ id +'_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
                console.log("idMat: ",idMat);
                console.log("droppedProfId: ",droppedProfId);
                //if(getCountSelectedDroppedMatieres()==1){
                    var tabSelectedDroppedMatieres = getSelectedDroppedMatieres();
                    console.log("tabSelectedDroppedMatieres: ",tabSelectedDroppedMatieres);
                    // var matiereIndex =  tabSelectedDroppedMatieres.findIndex((matiere)=> matiere.idMatiere == idMat);
                    var matiereIndex =  CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == idMat);
                    if (matiereIndex != -1) {
                        console.log("matiereIndex: ",matiereIndex);
                        var matiereToAddProf = {...CURRENT_DROPPED_MATIERE_LIST[matiereIndex]};
                        // var matiereToAddProf = {...CURRENT_DROPPED_MATIERE_LIST[matiereIndex]};
                        console.log("CURRENT_DROPPED_MATIERE_LIST: ",CURRENT_DROPPED_MATIERE_LIST);
                        console.log("matiereToAddProf: ",matiereToAddProf);
                        console.log("CURRENT_DROPPED_MATIERE_LIST[matiereIndex]: ",CURRENT_DROPPED_MATIERE_LIST[matiereIndex]);
                        console.log("CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID: ",CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID);
                        matiereToAddProf.tabProfsID = [...CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID];
                        console.log("matiereToAddProf.tabProfsID: ",matiereToAddProf.tabProfsID);
                        // matiereToAddProf.tabProfsID.push(droppedProfId);
                        // removeValueToDroppedMatiereList(matiereIndex);
                        
                        // AddValueToValueDroppedMatiereList(matiereIndex,matiereToAddProf)
                        if(!CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.includes(droppedProfId)){
                        console.log("CURRENT_PROFS_LIST: ",CURRENT_PROFS_LIST);
                        profIndex = CURRENT_PROFS_LIST.findIndex((prof)=>id == prof.idProf)
                        console.log("profIndex: ",profIndex);
                        droppedProf = {...CURRENT_PROFS_LIST[profIndex]}
                        profId = droppedProf.idProf;
                        console.log("droppedProf: ",droppedProf);
                        console.log("profId: ",profId)
                        droppedProf.idProf = droppedProfId;
                        droppedProf.idJour=jour;
                        droppedProf.heureDeb = PeriodDeb;
                        droppedProf.heureFin = PeriodFin;
                        droppedProf.idMatiere = idMat;   

                        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.push('DP_'+profId+'_'+jour+'_'+PeriodDeb +'_'+ PeriodFin);
                        currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST,-2);
                        console.log("CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST);
                        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;

                        
                      
                        console.log("PARAMS: Classe: ",currentUiContext.currentIdClasseEmploiTemps," jour: ",jour," idMat: ",matiereToAddProf.codeMatiere);
                        let emploiDeTemps = currentUiContext.emploiDeTemps;
                        let emp = emploiDeTemps.filter(e=>!e.modify.includes("s")&&e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                            e.id_jour==jour&&e.libelle==PeriodDeb+"_"+PeriodFin&&e.id_matiere==matiereToAddProf.codeMatiere);
                        let empIndex = emploiDeTemps.findIndex(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                            e.id_jour==jour&&e.libelle==PeriodDeb+"_"+PeriodFin&&e.id_matiere==matiereToAddProf.codeMatiere);
                            console.log("empIndex: ",empIndex);
                            console.log("profId: ",profId);
                            console.log("SELECTED EMP: ",emp,parseInt (profId.split("prof_")[1]));
                        if (emp.length>0){
                            let empToUpdate = emp[0];
                            var id_prof = parseInt (profId.split("prof_")[1]);
                                console.log("YOOOO: ", empToUpdate.value)
                                empToUpdate.id_enseignants.push(id_prof)
                                let listProfs = currentUiContext.listProfs.filter(item=>item.id==id_prof);
                                // console.log(listProfs);
                                let nomProf = listProfs[0].nom+" "+listProfs[0].prenom;
                                droppedProf.NomProf = nomProf;
                                droppedProf.idMatiere = idMat;
                                droppedProf.sexe = listProfs[0].sexe;
                                // empToUpdate.value+="*Mr."+droppedProf.NomProf+"%"+profId;
                                empToUpdate.value+="*Mr."+nomProf+"%"+profId;
                                // Pour dire qu'un prof a été ajouté
                                empToUpdate.modify+="e";
                                console.log("Yaaaa: ", empToUpdate.value)
                                console.log("empToUpdate: ",empToUpdate);
                                // emploiDeTemps[empIndex] = empToUpdate;
                                emploiDeTemps.splice(empIndex,1,empToUpdate)
                                console.log("emploiDeTemps: ",emploiDeTemps);
                                currentUiContext.setEmploiDeTemps(emploiDeTemps);
                            

                        }
                        setBoardProfs((boardProfs)=>[...boardProfs, droppedProf]);

                        //MISE A JOUR DES DONNEES GLOBALES
                        //CURRENT_DROPPED_PROFS_LIST.push(droppedProf)
                        // CURRENT_DROPPED_PROFS_LIST = currentUiContext.CURRENT_DROPPED_PROFS_LIST;
                        // CURRENT_DROPPED_PROFS_LIST.push(droppedProf);
                        console.log("Yooo: ",CURRENT_DROPPED_PROFS_LIST);
                        console.log("aaa: ",droppedProf);
                        AddValueToDroppedProfList(-1,droppedProf);
                        currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST);
                    
                        // var droppedProfTab = [...CURRENT_DROPPED_PROFS_LIST];
                        // var droppedProfTab = CURRENT_DROPPED_PROFS_LIST;
                        // console.log("droppedProfTab: ",droppedProfTab);
                        // currentUiContext.addMatiereToDroppedMatiereList(droppedProfTab, -1);
                     }
                    } else alert('vous pouvez uniquement affecter un enseignant aux matieres selectionnee');
              
               // } else alert('Vous devez selectionner une seule matiere '+getCountSelectedDroppedMatieres());
                
            }      
        }
    }

/*********************************Functions copiées depuis ET_Module********************************** */
function clearCellSelection(){
    var countSelected = getCountSelectedDroppedMatieres()
    if (countSelected >0) {
        console.log("** clearCellSelection CURRENT_DROPPED_MATIERE_LIST: ",CURRENT_DROPPED_MATIERE_LIST)
        for(var i=0; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){ 
            if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected){
                // disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
                disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
            }         
           
        }
        //SELECTED_MATIERE_ID='';
    }  
}
function getSelectedDroppedMatieres(){
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
function AddValueToDroppedProfList(position, valeur){
    if(position!=-1) CURRENT_DROPPED_PROFS_LIST.splice(position,0,valeur);
    else CURRENT_DROPPED_PROFS_LIST.push(valeur);
    console.log("CURRENT_DROPPED_PROFS_LIST: ",CURRENT_DROPPED_PROFS_LIST)
    // currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST);
}
function AddValueToValueDroppedMatiereList(position, valeur){
    if(position!=-1) CURRENT_DROPPED_MATIERE_LIST.splice(position,0,valeur);
    else CURRENT_DROPPED_MATIERE_LIST.push(valeur);
    // currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST);
}
function removeValueToDroppedMatiereList(position){
    CURRENT_DROPPED_MATIERE_LIST=CURRENT_DROPPED_MATIERE_LIST.splice(position,1);    
}
function getCountSelectedDroppedMatieres(){
    var count = 0;
    for(var i=0 ; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected==true) count++;
    }
    return count;
}
function disSelectCell(cellId) {
    if(isCellSelected(cellId)) {console.log("****cellId: ",cellId);
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
// function clearCellSelection(){
//     var countSelected = getCountSelectedDroppedMatieres()
//     if (countSelected >0) {
//         for(var i=0; i<CURRENT_DROPPED_MATIERE_LIST.length; i++){ 
//             if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected){
//                 // disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
//                 disSelectCell(CURRENT_DROPPED_MATIERE_LIST[i].idMatiere);
//             }         
           
//         }
//         //SELECTED_MATIERE_ID='';
//     }  
// }
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
function getProfsList2(codeMatiere, listProfs,emploiDeTemps,idjour,h_deb,h_fin){
    var libre=true;
    let profLibres = [];
    let profsMatieres = listProfs.filter((prof)=>prof.id_spe1==codeMatiere||prof.id_spe2==codeMatiere||prof.id_spe3==codeMatiere);
    console.log("*** listProfs: ",listProfs)
    for(let i=0;i<profsMatieres.length;i++){
        libre = true;
        for(let j=0;j<emploiDeTemps.length;j++){
            if(emploiDeTemps[j].id_enseignants.includes(profsMatieres[i].id)){
                if(emploiDeTemps[j].id_jour==idjour && emploiDeTemps[j].libelle==h_deb+"_"+h_fin){
                    libre=false;
                    break;
                }
            }
        }
        if (libre) profLibres.push(profsMatieres[i])
    }
    console.log("*** profLibres: ",profLibres)
    // profList = getProfs(codeMatiere)
    // tabProfs = profList.split('_');
    // initProfListWithProfs2(profsMatieres);
    initProfListWithProfs2(profLibres);
    // var currentListProfs = [...currentUiContext.listProfs.filter(item=>item.id_spe1==droppedMatiere.codeMatiere||item.id_spe2==droppedMatiere.codeMatiere||item.id_spe3==droppedMatiere.codeMatiere)];
    // currentUiContext.setListProfs(currentListProfs);

}
function initProfListWithProfs2(listeProf){
    var parent = document.getElementById('profList');
    var draggableSon, draggableSonText, draggableSonImg;

    // clearProflist();
    //alert(listeProf);
    let nb = listeProf.length;
    let nb_cours = 0;
    for (var i = 0; i < nb; i++) {
        nb_cours = currentUiContext.emploiDeTemps.filter(item=>item.id_enseignants.includes(listeProf[i].id)).length;
        var heure ="heure";
        if (nb_cours==0) heure = '';
        if (nb_cours>1)  heure = "heures";

        PROF_DATA = {};
        draggableSon =  document.getElementById('prof_' + listeProf[i].id);
        draggableSonText = document.getElementById('prof_' + listeProf[i].id+'_sub');
        
        draggableSon.className = classesP.profDivStyle;  
        draggableSon.title = listeProf[i].nom+" "+listeProf[i].prenom;       
        
        draggableSonText.textContent = listeProf[i].nom+" ("+ nb_cours+"h)";
        draggableSonText.className = classesP.profTextSyle;            

        draggableSonImg =  document.getElementById('prof_' + listeProf[i].id + '_img');
        draggableSonImg.className = classesP.profImgStyle;


        draggableSonImg = document.querySelector('#prof_' + listeProf[i].id + '_img > img')

        if(listeProf[i].sexe=="F"){
            draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        } else{
            draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        }
        
        draggableSonImg.style.display = 'block';

        // if(listeProf[i].includes('Mr.')) {
        //     draggableSonImg.setAttribute('src',"images/maleTeacher.png");
        // }else{
        //     draggableSonImg.setAttribute('src',"images/femaleTeacher.png");
        // }
        
        
        PROF_DATA.idProf = 'prof_' +listeProf[i].id;
        PROF_DATA.NomProf = listeProf[i].nom;
        
        CURRENT_PROFS_LIST.push(PROF_DATA);
        currentUiContext.setCurrentProfList(CURRENT_PROFS_LIST);
        PROF_DATA = {};                                     
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
        // draggableSonImg.className = null;

        draggableSonImg = document.querySelector('#prof_' + listProfs[i].id + '_img > img');
        draggableSonImg.style.display = 'none';

        // if (draggableSonImg.hasAttribute('src')) 
        // draggableSonImg.setAttribute('src','images/blank_prof.JPG');  
          
    } 
    CURRENT_PROFS_LIST = [];
}

function touchMatiereHandler(){
    if(currentUiContext.SELECTED_MATIERE_ID !=''){
        dropHandler(currentUiContext.SELECTED_MATIERE_ID);
        currentUiContext.setSelectedMatiereId('');
    }   
}

function touchProfHandler(){
    //alert("gggg:"+currentUiContext.SELECTED_PROF_ID)
    if(currentUiContext.SELECTED_PROF_ID !=''){
        dropHandler(currentUiContext.SELECTED_PROF_ID);
        currentUiContext.setSelectedProfId('');
    }   
}
/*************************************Return******************************************** */
    if(props.acceptType == 'matiere') {
        return(            
            <div id ={props.id} className={props.className} ref={drop} onClick={isMobile? touchMatiereHandler : null}>
                {boardMatieres.map((matiere) => {
                    return (
                        <MatiereDiv id={matiere.idMatiere}  matiereTitleStyle={classes.matiereTitleStyle} dragDivClassName={(matiere.isSelected) ? classes.droppedMatiereSelectedStyle: classes.droppedMatiereStyle} style={{backgroundColor:matiere.colorCode}}>
                            <div id={matiere.idMatiere+'_sub'} className={classes.matiereTitleStyle} >
                                {matiere.libelleMatiere}
                            </div>
                        </MatiereDiv>
                    );
                })}    
            </div>    
        );       

    } else {
        return(
            <div id ={props.id} className={props.className} style={props.style} ref={drop} onClick={isMobile? touchProfHandler : null}>
               {boardProfs.map((prof) => {
                    return (
                        <ProfDiv id={prof.idProf} 
                            dragDivClassName={classes.ProfDivStyle}
                            profImgStyle = {classes.profImgStyle}
                            profNameStyle={classes.profTextSyle}
                            // imgSrc={(prof.NomProf.includes('Mr.'))? "images/maleTeacher.png":"images/femaleTeacher.png"}
                            imgSrc={(prof.sexe=="M") ? "images/maleTeacher.png" : "images/femaleTeacher.png" }
                            imgClass={classes.imgStyle +' '+ classes.profImgStyle}
                        >                     
                            {prof.NomProf}                          
                        </ProfDiv>
                    );
                })}  
    
            </div>
    
        );    
    }                          
    
} 
export default DroppableDiv;

   
   




          