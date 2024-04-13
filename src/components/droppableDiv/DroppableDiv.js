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
        CURRENT_MATIERE_LIST         = currentUiContext.CURRENT_MATIERE_LIST;
        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
        CURRENT_PROFS_LIST           = currentUiContext.CURRENT_PROFS_LIST;
        CURRENT_DROPPED_PROFS_LIST   = currentUiContext.CURRENT_DROPPED_PROFS_LIST;

        console.log("*** dropHandler id: ",id,CURRENT_MATIERE_LIST);
        console.log("CURRENT_DROPPED_MATIERE_LIST:",CURRENT_DROPPED_MATIERE_LIST);
        console.log("CURRENT_MATIERE_LIST et PROFS:",CURRENT_MATIERE_LIST);
        

        var id_matiere = 0;
        if(props.acceptType == 'matiere') {
            
            //On reactive le button enregistrer
            currentUiContext.setETDataChanged(true);
            
            jour      = dropZone[0];
            PeriodDeb = dropZone[1];
            PeriodFin = dropZone[2];
           
            var idMatiereToDrop = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
            
            // On teste si une matiere n'est pas deja ds la zone 
            if (document.getElementById(idMatiereToDrop) == null || document.getElementById(idMatiereToDrop)== undefined){
                clearCellSelection();
                
                //On recupere l'id de la matiere en BD
                id_matiere     = parseInt(id.split("matiere_")[1]);
               
                //On cherche les infos a deposer et on la cree 
                matiereIndex              = CURRENT_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == id);
                droppedMatiere            = {...CURRENT_MATIERE_LIST[matiereIndex]};
                droppedMatiere.idMatiere  = idMatiereToDrop;
                droppedMatiere.idJour     = jour;
                droppedMatiere.isSelected = true;
                droppedMatiere.isOld      = false;
                droppedMatiere.heureDeb   = PeriodDeb;
                droppedMatiere.heureFin   = PeriodFin;
                droppedMatiere.idClasse   = parseInt(currentUiContext.currentIdClasseEmploiTemps);
                droppedMatiere.tabProfsID = [];      

                //On cree une entree dans l'ET.
                let emp = {
                    libelle       : PeriodDeb+"_"+PeriodFin,
                    id_jour       : jour,
                    id_tranche    : 0,
                    id_classe     : currentUiContext.currentIdClasseEmploiTemps,
                    id_matiere    : id_matiere,
                    id_enseignants: [],
                    value         : jour+":"+PeriodDeb+"_"+PeriodFin+"*0",
                    modify        : "c"
                }
                currentUiContext.setEmploiDeTemps([...currentUiContext.emploiDeTemps,emp]);

                //On met a jour la liste courante des dropped matieres du useState.
                setBoardMatieres((boardMatieres)=>[...boardMatieres, droppedMatiere]);
                
                //MISE A JOUR DES DONNEES GLOBALES              
                AddValueToValueDroppedMatiereList(-1,droppedMatiere);
                var droppedMatieresTab = CURRENT_DROPPED_MATIERE_LIST;
                currentUiContext.addMatiereToDroppedMatiereList(droppedMatieresTab, -1);
                
                //On ressort la liste des profs libres pour cette matiere ds la div de la liste des profs
                //searchAndSetProfLibresInProfDiv(id_matiere, currentUiContext.listProfs,currentUiContext.emploiDeTemps,jour,PeriodDeb,PeriodFin);
                searchAndSetProfLibresInProfDiv(id_matiere,idMatiereToDrop,[]); 
            } else{
                alert("Vous ne pouvez pas placer plus d'une matiere au meme emplacement!")
            }
            
        } else {
            if(props.acceptType == 'profImage') {
                let profId;

                //On reactive le button enregistrer
                currentUiContext.setETDataChanged(true); 
                
                jour      = dropZone[1];
                PeriodDeb = dropZone[2];
                PeriodFin = dropZone[3];                

                //On recree les id de l zone de drop de la matiere ds la grille et la zone de drop du prof ds la grille
                var idMat         = 'DM_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;
                var droppedProfId = 'DP_'+ id +'_'+jour +'_'+ PeriodDeb +'_'+ PeriodFin;

                // //if(getCountSelectedDroppedMatieres()==1){
                // var tabSelectedDroppedMatieres = getSelectedDroppedMatieres().length;
                // console.log("tabSelectedDroppedMatieres: ",tabSelectedDroppedMatieres);
                   
                //On obtient la matiere qui va contenir le prof a drop avec touttes ses infos
                var matiereIndex =  CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == idMat && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);
                if (matiereIndex != -1) {
                    console.log("matiereIndex: ",matiereIndex);
                    var matiereToAddProf        = {...CURRENT_DROPPED_MATIERE_LIST[matiereIndex]};
                    matiereToAddProf.tabProfsID = [...CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID];
                    
                    //On verifie que le prof la n'est pas deja ds la liste des profs de la matiere.
                    if(!CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.includes(droppedProfId)){
                        profIndex               = CURRENT_PROFS_LIST.findIndex((prof)=>prof.idProf == id)
                        droppedProf             = {...CURRENT_PROFS_LIST[profIndex]}
                        profId                  = droppedProf.idProf;
                        
                        var id_prof             = parseInt (profId.split("prof_")[1]);
                        let listProfs           = currentUiContext.listProfs.filter(item=>item.id==id_prof);
                      
                        droppedProf.idProf      = droppedProfId;
                        droppedProf.idJour      = jour;
                        droppedProf.heureDeb    = PeriodDeb;
                        droppedProf.heureFin    = PeriodFin;
                        droppedProf.idMatiere   = idMat;  
                        droppedProf.sexe        = listProfs[0].sexe;

                        CURRENT_DROPPED_MATIERE_LIST[matiereIndex].tabProfsID.push(droppedProfId);
                        currentUiContext.addMatiereToDroppedMatiereList(CURRENT_DROPPED_MATIERE_LIST,-2);
                        
                        console.log("CURRENT_DROPPED_MATIERE_LIST: ",currentUiContext.CURRENT_DROPPED_MATIERE_LIST);
                        CURRENT_DROPPED_MATIERE_LIST = currentUiContext.CURRENT_DROPPED_MATIERE_LIST;
                        
                        
                        console.log("PARAMS: Classe: ",currentUiContext.currentIdClasseEmploiTemps," jour: ",jour," idMat: ",matiereToAddProf.codeMatiere);
                        
                        //On met a jour l'entree de l'ET pour la matiere la.
                        let emploiDeTemps = currentUiContext.emploiDeTemps;
                        let emp           = emploiDeTemps.filter(e=>!e.modify.includes("s")&&e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                        
                        e.id_jour==jour&&e.libelle==PeriodDeb+"_"+PeriodFin&&e.id_matiere==matiereToAddProf.codeMatiere);
                        
                        let empIndex     = emploiDeTemps.findIndex(e=>e.id_classe==currentUiContext.currentIdClasseEmploiTemps&&
                        
                        e.id_jour==jour&&e.libelle==PeriodDeb+"_"+PeriodFin&&e.id_matiere==matiereToAddProf.codeMatiere);
                        
                        console.log("empIndex: ",empIndex);
                        console.log("profId: ",profId);
                        console.log("SELECTED EMP: ",emp,parseInt (profId.split("prof_")[1]));
                        
                        if (emp.length>0){
                            let empToUpdate       = emp[0];
                            id_prof               = parseInt (profId.split("prof_")[1]);
                            console.log("YOOOO: ", empToUpdate.value)
                            empToUpdate.id_enseignants.push(id_prof)
                            listProfs             = currentUiContext.listProfs.filter(item=>item.id==id_prof);
                            // console.log(listProfs);
                            let nomProf           = listProfs[0].nom+" "+listProfs[0].prenom;
                            droppedProf.NomProf   = nomProf;
                            droppedProf.idMatiere = idMat;
                            droppedProf.sexe      = listProfs[0].sexe;
                            
                            if( droppedProf.sexe == "M") empToUpdate.value+="*Mr."+nomProf+"%"+profId;
                            else empToUpdate.value+="*Mme."+nomProf+"%"+profId;
                            
                            // Pour dire qu'un prof a été ajouté
                            empToUpdate.modify+="e";
                            console.log("Yaaaa: ", empToUpdate.value)
                            console.log("empToUpdate: ",empToUpdate);
                            
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
                        currentUiContext.addProfToDroppedProfList(CURRENT_DROPPED_PROFS_LIST,-1);
                    
                        // var droppedProfTab = [...CURRENT_DROPPED_PROFS_LIST];
                        // var droppedProfTab = CURRENT_DROPPED_PROFS_LIST;
                        // console.log("droppedProfTab: ",droppedProfTab);
                        // currentUiContext.addMatiereToDroppedMatiereList(droppedProfTab, -1);
                    }

                } else alert('vous pouvez uniquement affecter un enseignant aux matieres selectionnee');
            
            // } else alert('Vous devez selectionner une seule matiere '+getSelectedDroppedMatieres());
            
        }      
        }
    }

/*********************************Functions copiées depuis ET_Module********************************** */
function clearCellSelection(){
    var tabSelectedMatieres = getSelectedDroppedMatieres();

    tabSelectedMatieres.map((droppedMatiere)=>{        
        console.log("** matiere to deselect: ",droppedMatiere);
        disSelectCell(droppedMatiere.idMatiere);
    });
   
}

function getSelectedDroppedMatieres(){
    var droppedMatiereTab = [];
    var i = 0;
    while(i < CURRENT_DROPPED_MATIERE_LIST.length){
        if(CURRENT_DROPPED_MATIERE_LIST[i].isSelected == true && CURRENT_DROPPED_MATIERE_LIST[i].idClasse == currentUiContext.currentIdClasseEmploiTemps){
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


function  isCellSelected (cellId) {
    var index = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps)
    console.log("index sselected", index, CURRENT_DROPPED_MATIERE_LIST[index].isSelected);
    return (CURRENT_DROPPED_MATIERE_LIST[index].isSelected == true);
}


function disSelectCell(cellId) {
  
    console.log("****cellId: ",cellId);
    var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=> matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps );
    
    CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = false;
    
    if(document.getElementById(cellId).style.backgroundColor.length==0){
        document.getElementById(cellId).style.borderColor = 'rgb(6, 83, 134)';
    } else{
        document.getElementById(cellId).style.borderColor = document.getElementById(cellId).style.backgroundColor;
    }
    
    clearProflist();

}


function selectCell(cellId){  
    var matiereIndex = CURRENT_DROPPED_MATIERE_LIST.findIndex((matiere)=>matiere.idMatiere == cellId && matiere.idClasse == currentUiContext.currentIdClasseEmploiTemps);

    CURRENT_DROPPED_MATIERE_LIST[matiereIndex].isSelected = true;      
    
    document.getElementById(cellId).style.borderColor ='red';

    console.log("etat", cellId, CURRENT_DROPPED_MATIERE_LIST[matiereIndex],CURRENT_DROPPED_MATIERE_LIST)
    
    clearProflist();
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
                            dragDivClassName={classes.profDivStyle}
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

   
   




          