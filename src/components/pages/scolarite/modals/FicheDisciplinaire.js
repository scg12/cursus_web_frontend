import React from 'react';
import ReactDOM from 'react-dom';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import { useFilePicker } from 'use-file-picker';




var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;

var cur_punitionDate='';
var cur_punitionDuree;
var cur_punitionMotif='';


var consignes_data =[];
var exclusions_data =[];
var other_data =[];



function FicheDisciplinaire(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
  
  
    const [gridAbsences, setGridAbsences]= useState([]);
    const [gridConsignes, setGridConsignes]= useState([]);
    const [gridExclusions, setGridExclusions]= useState([]);
    const [gridOther, setGgridOther]= useState([]);
    const[justiViewOpen, setjustifViewOpen]=useState(false);
    
    const [consignes, setConsignes] = useState([]);
    const [exclusions, setExclusion] = useState([]);
    const [autreSanction, setAutreSanction] = useState([]);
    
    
    useEffect(()=> {

        setGridAbsences(absences_data);
        setGridConsignes([]);
        setGridExclusions([]);
        setGgridOther([]);
        getClassStudentList(props.currentClasseId);
      
    },[]);

    const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        limitFilesConfig: { max: 1 },
        // minFileSize: 0.1, // in megabytes
        maxFileSize: 50,
        imageSizeRestrictions: {
          maxHeight: 500, // in pixels
          maxWidth: 500,
          minHeight: 32,
          minWidth: 32,
        },
    });
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (errors.length) {
        getUploadError();
        console.log(errors);
    }

    function getUploadError(){
        var errorMsg;
        if(errors.length){
            if(errors[0].fileSizeTooSmall)  {
                errorMsg = 'Le fichier selectionne est trop lourd! la taille du fichier ne doit pas exceder 50Mo !!!';
                return errorMsg;
            }
            
            if(errors[0].fileSizeToolarge)  {
                errorMsg = 'Le fichier selectionne est tres petit! la taille du fichier doit depasser 0.5ko !!!';
                return errorMsg;
            }

            if(errors[0].imageHeightTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }    

            if(errors[0].imageHeightTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            }            
        }       
    }


    
    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            console.log(listEleves);
            //LIST_ELEVES= [...getElevesTab(res.data)];
            //console.log(LIST_ELEVES) ;          
        })  
        return listEleves;     
    }



    function setButtonDisable(etape){
        switch(props.formMode){  
            case 'creation':                     
                switch(etape){
                    case 1: return false;
                    case 2: return true;
                }
            case 'modif':
                switch(etape){
                    case  1: return false;
                    case  2: return true;
                }
            default : 
                switch(etape){
                    case  1: return false;
                    case  2: return false;
                }
        }         
  
    }

    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
        }
    }
    
    
    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
    }


    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }


   

    function cancelHandler(){
        //MEETING={};
        props.cancelHandler();
    }


    /*------------------------------ End Design Fonctions -------------------------------*/

    const absences_data =[
        {id:1, date:'12/05/2023', nbre_heure:'3', heure_justifie:'1', heure_nonJustifie:'2' },
        {id:2, date:'08/07/2023', nbre_heure:'7', heure_justifie:'2', heure_nonJustifie:'5' },
        {id:3, date:'18/07/2023', nbre_heure:'3', heure_justifie:'2', heure_nonJustifie:'1' },
    ];

    /*const consignes_data =[
        {id:1, date:'12/05/2023', nbre_jour:'3', etat:0 },
    ];

     const exclusions_data =[
        {id:1, date:'12/05/2023', nbre_jour:'3', etat:0 },
    ];   
    */
    
    
    function handleEditRow(){

    }

    function consultRowData(){

    }

    function addConsigneRow(){
        consignes_data = [...gridConsignes];

        var index = consignes_data.findIndex((consigne)=>consigne.etat<2); //On ne peut pas ajouter une autre consigne alors qu'il y aune consigne non effectuee
        if (index <0){
                consignes_data.push({id:0, date:'', nbre_heure:'', motif:'', etat:0});
                setGridConsignes(consignes_data);
        } else {alert("ici")}
    }

    function addExclusionRow(){
        exclusions_data = [...gridExclusions];
        var index = exclusions_data.findIndex((exclusion)=>exclusion.etat<2);
        if (index <0){
            exclusions_data.push({id:0, date:'', nbre_jour:'', motif:'', definitif:false, etat:0});
            setGridExclusions(exclusions_data);
        } else {alert("ici")}
    }

    function addOtherRow(){
        other_data = [...gridOther];
        var index = other_data.findIndex((other_Punition)=>other_Punition.etat<2);
        if (index <0){
            other_data.push({id:0, date:'', nbre_jour:'', motif:'', etat:0});
            setGgridOther(other_data);
        } else {alert("ici")}
    }
   
    
    function showJustifPopup(){setjustifViewOpen(true)}

  
    
    function EnregConsigne(e){
        //Enregistrer la consigne et mettre a jour le useState gridConsignes
        var rowIndex = e.target.id;
        var tabDate = cur_punitionDate.split('/');
        document.getElementById('dateCons_'+rowIndex).style.border = 'none';
        document.getElementById('NbJoursCons_'+rowIndex).style.border = 'none';
        
        if(tabDate.length!=3){
            document.getElementById('dateCons_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateCons_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateCons_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateCons_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateCons_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateCons_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        if(isNaN(tabDate[0])||isNaN(tabDate[1])||isNaN(tabDate[2])){
            document.getElementById('dateCons_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateCons_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateCons_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateCons_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateCons_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateCons_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        if(tabDate[0]>31 || tabDate[0]<0 || tabDate[1]>12||tabDate[1]<0){
            document.getElementById('dateCons_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateCons_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateCons_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateCons_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateCons_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateCons_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        document.getElementById('dateCons_'+rowIndex).style.border = 'none';
       

        if(isNaN(cur_punitionDuree)){
            document.getElementById('NbJoursCons_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('NbJoursCons_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('NbJoursCons_'+rowIndex).style.height = '1.7vh';
            document.getElementById('NbJoursCons_'+rowIndex).style.width = '1.7vw';
            document.getElementById('NbJoursCons_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('NbJoursCons_'+rowIndex).style.paddingLeft = '0.7vw';
            document.getElementById('NbJoursCons_'+rowIndex).style.marginTop = '2vh';
            return-1
        }
        
        document.getElementById('NbJoursCons_'+rowIndex).style.border = 'none';
        
        console.log('ligne:', rowIndex);
        var tabConsignes = [...gridConsignes];

        tabConsignes[rowIndex].date = cur_punitionDate;
        tabConsignes[rowIndex].nbre_heure=cur_punitionDuree;
        tabConsignes[rowIndex].motif = cur_punitionMotif;
        tabConsignes[rowIndex].etat = 1;

        setGridConsignes(tabConsignes);
        cur_punitionDate=''; cur_punitionDuree=''; cur_punitionMotif='';

    }

    function EnregExclusion(e){
        //Enregistrer la consigne et mettre a jour le useState gridConsignes
        var rowIndex = e.target.id;
        var tabDate = cur_punitionDate.split('/');
        document.getElementById('dateExcl_'+rowIndex).style.border = 'none';
        document.getElementById('NbJoursExcl_'+rowIndex).style.border = 'none';

        if(tabDate.length!=3){
            document.getElementById('dateExcl_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateExcl_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateExcl_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateExcl_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateExcl_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateExcl_'+rowIndex).style.marginTop = '2vh';
            return -1;
        } 
        
        if(isNaN(tabDate[0])||isNaN(tabDate[1])||isNaN(tabDate[2])){
            document.getElementById('dateExcl_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateExcl_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateExcl_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateExcl_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateExcl_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateExcl_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        if(tabDate[0]>31 || tabDate[0]<0 || tabDate[1]>12||tabDate[1]<0){
            document.getElementById('dateExcl_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateExcl_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateExcl_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateExcl_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateExcl_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateExcl_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        document.getElementById('dateExcl_'+rowIndex).style.border = 'none';
    

        if(isNaN(cur_punitionDuree)){
            document.getElementById('NbJoursExcl_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('NbJoursExcl_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('NbJoursExcl_'+rowIndex).style.height = '1.7vh';
            document.getElementById('NbJoursExcl_'+rowIndex).style.width = '1.7vw';
            document.getElementById('NbJoursExcl_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('NbJoursExcl_'+rowIndex).style.paddingLeft = '0.7vw';
            document.getElementById('NbJoursExcl_'+rowIndex).style.marginTop = '2vh';
            return-1
        }
        
        document.getElementById('NbJoursExcl_'+rowIndex).style.border = 'none';
        
        console.log('ligne:', rowIndex);
        var tabExclusion = [...gridExclusions];

        tabExclusion[rowIndex].date = cur_punitionDate;
        tabExclusion[rowIndex].nbre_jour=cur_punitionDuree;
        tabExclusion[rowIndex].motif = cur_punitionMotif;
        tabExclusion[rowIndex].etat = 1;

        setGridExclusions(tabExclusion);
        cur_punitionDate=''; cur_punitionDuree=''; cur_punitionMotif='';
    }

    function EnregOther(e){
        //Enregistrer la consigne et mettre a jour le useState gridConsignes
        var rowIndex = e.target.id;
        var tabDate = cur_punitionDate.split('/');

        document.getElementById('dateOthr_'+rowIndex).style.border = 'none';
        document.getElementById('NbJoursOthr_'+rowIndex).style.border = 'none';
       

        if(tabDate.length!=3){
            document.getElementById('dateOthr_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateOthr_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateOthr_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateOthr_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateOthr_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateOthr_'+rowIndex).style.marginTop = '2vh';
            return -1;
        } 

        if(isNaN(tabDate[0])||isNaN(tabDate[1])||isNaN(tabDate[2])){
            document.getElementById('dateOthr_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateOthr_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateOthr_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateOthr_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateOthr_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateOthr_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }

        if(tabDate[0]>31 || tabDate[0]<0 || tabDate[1]>12||tabDate[1]<0){
            document.getElementById('dateOthr_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('dateOthr_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('dateOthr_'+rowIndex).style.height = '1.7vh';
            document.getElementById('dateOthr_'+rowIndex).style.width = '5.3vw';
            document.getElementById('dateOthr_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('dateOthr_'+rowIndex).style.marginTop = '2vh';
            return -1;
        }
        
        document.getElementById('dateOthr_'+rowIndex).style.border = 'none';
        

        if(isNaN(cur_punitionDuree)){
            document.getElementById('NbJoursOthr_'+rowIndex).style.borderRadius = '2vh';
            document.getElementById('NbJoursOthr_'+rowIndex).style.border = '0.47vh solid red';
            document.getElementById('NbJoursOthr_'+rowIndex).style.height = '1.7vh';
            document.getElementById('NbJoursOthr_'+rowIndex).style.width = '1.7vw';
            document.getElementById('NbJoursOthr_'+rowIndex).style.paddingTop = '0vh';
            document.getElementById('NbJoursOthr_'+rowIndex).style.paddingLeft = '0.7vw';
            document.getElementById('NbJoursOthr_'+rowIndex).style.marginTop = '2vh';
            return-1
        }
        
        document.getElementById('NbJoursOthr_'+rowIndex).style.border = 'none';
        
        console.log('ligne:', rowIndex);
        var tabOther = [...gridOther];

        tabOther[rowIndex].date = cur_punitionDate;
        tabOther[rowIndex].nbre_jour=cur_punitionDuree;
        tabOther[rowIndex].motif = cur_punitionMotif;
        tabOther[rowIndex].etat = 1;

        setGgridOther(tabOther);
        cur_punitionDate=''; cur_punitionDuree=''; cur_punitionMotif='';

    }



    function doConsigne(e){
        //Mettre a jour la consigne(passer de l'etat 1 a l'etat 2)
        var rowIndex = e.target.id;
        console.log('ligne:', rowIndex);
        var tabConsignes = [...gridConsignes];
        tabConsignes[rowIndex].id ='consigne_'+(rowIndex+1);
        tabConsignes[rowIndex].etat =2;
        setGridConsignes(tabConsignes);
        console.log('consignes', gridConsignes);
    }


    function doExclusion(e){
        //Mettre a jour l'exclusion (passer de l'etat 1 a l'etat 2)
        var rowIndex = e.target.id;
        console.log('ligne:', rowIndex);
        var tabExclusions = [...gridExclusions];
        tabExclusions[rowIndex].id ='exclusion_'+(rowIndex+1);
        tabExclusions[rowIndex].etat =2;
        setGridExclusions(tabExclusions);
        console.log('consignes', gridExclusions);
    
    }

    
    function doOther(e){
        //Mettre a jour la sanction (passer de l'etat 1 a l'etat 2)
        var rowIndex = e.target.id;
        console.log('ligne:', rowIndex);
        var tabOthers = [...gridOther];
        tabOthers[rowIndex].id ='other_'+(rowIndex+1);
        tabOthers[rowIndex].etat =2;
        setGgridOther(tabOthers);
        console.log('consignes', gridOther);
    
    }



    function deleteConsigne(e){
        //Suppression de la consigne
        var consigneId = e.target.id;
        var tabConsignes = [...gridConsignes];
        var rowIndex = tabConsignes.findIndex((consigne)=>consigne.id==consigneId);
        tabConsignes.splice(rowIndex,1);
        setGridConsignes(tabConsignes)
    }


    function deleteExclusion(e){
        //Suppression exclusion
        var exclusionId = e.target.id;
        var tabExclusion = [...gridExclusions];
        var rowIndex = tabExclusion.findIndex((exclusion)=>exclusion.id==exclusionId);
        tabExclusion.splice(rowIndex,1);
        setGridExclusions(tabExclusion)
    }

    function deleteOther(e){
        //Suppression autre sanction         
        var otherId = e.target.id;
        var tabOther = [...gridOther];
        var rowIndex = tabOther.findIndex((other)=>other.id==otherId);
        tabOther.splice(rowIndex,1);
        setGgridOther(tabOther)
    }

    function exclusionTypeHandler(e){
        var senderId = e.target.id;
        var rowIndex = senderId.substring(4);
        console.log('rowIndex:', e);

        var excluTab = [...gridExclusions];
        
        if(e.target.checked){
            excluTab[rowIndex].definitif=true
        } else {
            excluTab[rowIndex].definitif=false
        }
        setGridExclusions(excluTab);

    }

    

    function saveStudenFiche(){

    }

    function printStudentFiche(){

    }
   

    /************************************ JSX Code ************************************/
    const LigneAbsence=(props)=>{
        return(
            <div style={{display:'flex', color:props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'10vw'}}>{props.date}</div>
                <div style={{width:'7vw'}}>{props.nbreHeure}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'green', fontWeight:'700'}}>{props.nbreJustifie}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'red', fontWeight:'700'  }}>{props.nonJustifie}</div>
                <div style={{width:'7vw', marginLeft:'1vw', color: props.isHeader? 'white':'blue', cursor: props.isHeader? 'default' :'pointer' }}>
                    {props.isHeader ? t('action')
                        : props.nonJustifie >0 ? <input type="text" value= {t('justify')} style={{color:'blue', fontSize:'0.87vw', fontWeight:'700', cursor:'pointer'}} onClick={showJustifPopup} /> : null                      
                    }
                </div>
                <div style={{width:'3vw'}}></div>

            </div>
        );
    }

    const LigneTotauxAbsences=(props)=>{
        return(
            <div style={{display:'flex', color:'black', alignSelf:'flex-end', marginRight:'2.83vw', backgroundColor:'lightgray', flexDirection:'row', height:'3vh', width:'30vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'10vw',  fontWeight:'700'}}>{t('totaux')}</div>
                <div style={{width:'7vw',  fontWeight:'700'}}>{t('hours')} :{props.totalHeures}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'green', fontWeight:'700'}}>{t('justify')} : {props.totalJustifie}</div>
                <div style={{width:'7vw', color:props.isHeader?'white':'red', fontWeight:'700'  }}> {t('not_justify')} : {props.totalNonjustife}</div>
            </div>
        );
    }

    const LignePunitionHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw'}}>{t('date')}</div>
                <div style={{width:'4vw'}}>{(props.punitionCode==1) ? t('jours'):t('hours') }</div>
                {(props.punitionCode==1||props.punitionCode==11)&&     //0-> Consigne, 1->Exclusion temporaire, 11->Exclusion Definitive, 2->Autre
                    <div style={{width:'4vw'}}>{t('definitive')}</div>
                }
                <div style={{width:'15vw'}}>{t('motif')}</div>
                <div style={{width:'7vw'}}>{t('etat_actuel')} </div>
                <div style={{width:'3vw'}}>{t('action')}</div>                 
                <div style={{width:'3vw'}}/>                    
            </div>
        );
    }
  
    const LignePunition=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw'}}><input disabled={gridConsignes[props.rowIndex].etat>0}   id={'dateCons_'+props.rowIndex}    onChange={(e)=>{cur_punitionDate = e.target.value;}} type='text' placeholder='jj/mm/aaaa' style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.date}/></div>
                <div style={{width:'4vw'}}> <input  disabled={gridConsignes[props.rowIndex].etat>0}   id={'NbJoursCons_'+props.rowIndex} onChange={(e)=>{cur_punitionDuree = e.target.value;}} type='text' placeholder={t('nbre')} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.nbreJours}/></div>
                {(props.punitionCode==1||props.punitionCode==11)&&
                    <div style={{width:'2.7vw'}}><input  disabled={gridConsignes[props.rowIndex].etat>0}  type='checkbox' onClick={()=>{}} style={{width:'0.87vw', height:'0.87vw'}}/></div>
                }
                
                <div style={{width:'15vw'}}> <input disabled={gridConsignes[props.rowIndex].etat>0}  id={'motifCons_'+props.rowIndex} onChange={(e)=>{cur_punitionMotif = e.target.value;}} type='text' placeholder= {t("write_reason")} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.motif}/></div>
                <div style={{width:'7vw', fontWeight:'700'}}>
                    <label id={props.rowIndex} style={{ color:gridConsignes[props.rowIndex].etat < 2?'red':'green', height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh', cursor:'pointer', fontWeight:'700'}} onClick={gridConsignes[props.rowIndex].etat==0 ? props.EnregPunition : gridConsignes[props.rowIndex].etat==1 ? props.doPunition : null}>{gridConsignes[props.rowIndex].etat==0 ? t('save') : gridConsignes[props.rowIndex].etat ==1&&props.punitionCode!=11 ? t('to_be_done') :gridConsignes[props.rowIndex].etat >1 && props.punitionCode!=11 ? t('done') : null}</label>
                </div>
                <div style={{width:'3vw'}}> 
                    {(gridConsignes[props.rowIndex].etat < 2)&&                    
                        <img src="icons/baseline_delete.png"  
                            id={props.punitionId}
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={props.deletePunition}                         
                            alt=''
                        />
                    }
                </div>

            </div>
        );
    }

    const LignePunitionExcl=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw'}}><input disabled={gridExclusions[props.rowIndex].etat>0}   id={'dateExcl_'+props.rowIndex}    onChange={(e)=>{cur_punitionDate = e.target.value;}} type='text' placeholder='jj/mm/aaaa' style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.date}/></div>
                <div style={{width:'4vw'}}> <input  disabled={gridExclusions[props.rowIndex].etat>0}   id={'NbJoursExcl_'+props.rowIndex} onChange={(e)=>{cur_punitionDuree = e.target.value;}} type='text' placeholder={t('nbre')} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.nbreJours}/></div>
                {(props.punitionCode==1||props.punitionCode==11)&&
                    <div style={{width:'2.7vw'}}><input  disabled={gridExclusions[props.rowIndex].etat>0}  type='checkbox' id={'chk_'+props.rowIndex} checked={gridExclusions[props.rowIndex].definitif==true} onClick={(e)=>{exclusionTypeHandler(e)}} style={{width:'0.87vw', height:'0.87vw'}}/></div>
                }
                
                <div style={{width:'15vw'}}> <input disabled={gridExclusions[props.rowIndex].etat>0}  id={'motifExcl_'+props.rowIndex} onChange={(e)=>{cur_punitionMotif = e.target.value;}} type='text' placeholder={t('write_reason')} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.motif}/></div>
                <div style={{width:'7vw', fontWeight:'700'}}>
                    <label id={props.rowIndex} onClick={gridExclusions[props.rowIndex].etat==0 ? props.EnregPunition : gridExclusions[props.rowIndex].etat==1 ? props.doPunition : null} style={{ color:gridExclusions[props.rowIndex].etat < 2?'red':'green', height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh', cursor:'pointer', fontWeight:'700'}} >{gridExclusions[props.rowIndex].etat==0 ? t('save') : gridExclusions[props.rowIndex].etat ==1&&props.punitionCode!=11 ? t('to_be_done') :gridExclusions[props.rowIndex].etat >1 && props.punitionCode!=11 ? t('done'):null}</label>
                </div>
                <div style={{width:'3vw'}}> 
                    {(gridExclusions[props.rowIndex].etat < 2)&&                    
                        <img src="icons/baseline_delete.png"  
                            id={props.punitionId}
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={props.deletePunition}                         
                            alt=''
                        />
                    }
                </div>

            </div>
        );
    }


    const LignePunitionOth=(props)=>{
        return(
            <div style={{display:'flex', color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'3.7vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5.7vw'}}><input disabled={gridOther[props.rowIndex].etat>0}   id={'dateOthr_'+props.rowIndex}    onChange={(e)=>{cur_punitionDate = e.target.value;}} type='text' placeholder='jj/mm/aaaa' style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.date}/></div>
                <div style={{width:'4vw'}}> <input  disabled={gridOther[props.rowIndex].etat>0}   id={'NbJoursOthr_'+props.rowIndex} onChange={(e)=>{cur_punitionDuree = e.target.value;}} type='text' placeholder={t('nbre')} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.nbreJours}/></div>
                {(props.punitionCode==1||props.punitionCode==11)&&
                    <div style={{width:'2.7vw'}}><input  disabled={gridOther[props.rowIndex].etat>0}  type='checkbox' onClick={()=>{}} style={{width:'0.87vw', height:'0.87vw'}}/></div>
                }
                
                <div style={{width:'15vw'}}> <input disabled={gridOther[props.rowIndex].etat>0}  id={'motifOthr_'+props.rowIndex} onChange={(e)=>{cur_punitionMotif = e.target.value;}} type='text' placeholder= {t('write_reason')} style={{height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh'}} defaultValue={props.motif}/></div>
                <div style={{width:'7vw', fontWeight:'700'}}>
                    <label id={props.rowIndex} onClick={gridOther[props.rowIndex].etat==0 ? props.EnregPunition : gridOther[props.rowIndex].etat==1 ? props.doPunition : null} style={{ color:gridOther[props.rowIndex].etat < 2?'red':'green', height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh', cursor:'pointer', fontWeight:'700'}} >{gridOther[props.rowIndex].etat==0 ? t('save') : gridOther[props.rowIndex].etat ==1&&props.punitionCode!=11 ? t("to_be_done") :gridOther[props.rowIndex].etat >1 && props.punitionCode!=11 ? t("done"):null}</label>
                    {/*<input id={props.rowIndex} type='text'  style={{ color:gridOther[props.rowIndex].etat < 2?'red':'green', height:'1.4rem', fontSize:'0.87vw', paddingTop:'1.3vh', cursor:'pointer', fontWeight:'700'}} defaultValue={gridOther[props.rowIndex].etat==0 ?'Enregistrer' : gridOther[props.rowIndex].etat ==1&&props.punitionCode!=11 ? 'A effectuer' :gridOther[props.rowIndex].etat >1 && props.punitionCode!=11 ? 'Effectuee':null} onClick={gridOther[props.rowIndex].etat==0 ? props.EnregPunition : gridOther[props.rowIndex].etat==1 ? props.doPunition : null}/>*/}
                </div>
                <div style={{width:'3vw'}}> 
                    {(gridOther[props.rowIndex].etat < 2)&&                    
                        <img src="icons/baseline_delete.png"  
                            id={props.punitionId}
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={props.deletePunition}                         
                            alt=''
                        />
                    }
                </div>

            </div>
        );
    }


    return (
        <div className={'card '+ classes.formContainerP}>          
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/Studentprofile.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                :
                    <div className={classes.formMainTitle} >
                        {t('fiche_disciplinaire_M')}
                    </div>
                
                }
                
                <div className={classes.etapeP} style={{overflowY:'scroll', height:'75vh'}}>
                    <div className={classes.inputRow} style={{marginBottom:'1.3vh'}}> 
                        <div style={{marginLeft:'-4vw'}}>
                            <img alt='student' className={classes.photoStyleP} src={'images/photoHomme2.jpg'}/>
                        </div>   
                       
                        <div className={classes.studentInfo}  style={{marginRight:'-3.7vw', marginLeft:'1vw'}}>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                               <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('nom_M')} : </div> <div> ADAMA KOUATOU Emmanuel</div>
                            </div>

                            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                                <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('class_M')} : </div> <div> 6eA1</div>
                                <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'3vw'}}> {t('matricule_M')}  : </div> <div> 02JHGF85H</div>
                            </div>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                                <div style={{fontWeight:'700', marginRight:'0.3vw'}}> {t('age_M')} : </div> <div> 10 ans</div>
                                <div style={{fontWeight:'700', marginRight:'0.3vw', marginLeft:'4.3vw'}}> {t('redoublant_M')} : </div> <div> {t('no')}</div>
                            </div>
                        </div>
                 
                    </div>

                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}>
                        <div style={{display:'flex', flexDirection:'row',fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', justifyContent:'space-between'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('absences')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw'}}
                            />   

                            {(justiViewOpen)&&
                                <div style={{width:'17vw', height:'7vh', marginTop:'-2vh', borderStyle:'solid', borderColor:'black', borderWidth:'1px', borderRadius:7, display:'flex', flexDirection:'row', justifyContent:'center',marginRight:'4.3vw'}}>

                                </div>
                            }

                        </div>
                        
                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw',overflowY:'scroll', justifyContent:'center'}}>
                            <LigneAbsence date={t('date')} nbreHeure={t('nbre_hour')} nbreJustifie={t('Justify')} nonJustifie={t('not_Justify')} isHeader={true}/>
                            {(gridAbsences||[]).map((absence)=>{
                                return <LigneAbsence date={absence.date} nbreHeure={absence.nbre_heure} nbreJustifie={absence.heure_justifie} nonJustifie={absence.heure_nonJustifie} isHeader={false}/>
                                })
                            }
                            <LigneTotauxAbsences totalHeures={10} totalJustifie={5} totalNonjustife={5}/>
                        </div>
                    </div>

                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginBottom:'0vh', marginLeft:'0vw', width:'97%'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('consigne_title')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                            />  
                            <CustomButton
                                btnText={t('add')} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginRight:'4.3vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler = {() => {addConsigneRow()}}
                            />                      
                        </div>

                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', width:'93%',overflowY:'scroll', justifyContent:'center'}}>
                            <LignePunitionHeader punitionCode={0}/>
                            {(gridConsignes||[]).map((consigne,index)=>{
                                return <LignePunition punitionId={consigne.id} punitionCode={0} rowIndex={index} date={consigne.date} nbreJours={consigne.nbre_heure} motif={consigne.motif} etat={consigne.etat} isHeader={false} EnregPunition={EnregConsigne} doPunition={doConsigne} deletePunition={deleteConsigne}/>
                                })
                            }
                        </div>

                    </div>                    
                    
                  
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', width:'97%'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('exclusion')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                            /> 

                            <CustomButton
                                btnText={t('add')} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginRight:'4.3vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler = {() => {addExclusionRow()}}
                            />                        
                        </div>
                       
                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', width:'93%',overflowY:'scroll', justifyContent:'center'}}>
                            <LignePunitionHeader punitionCode={1}/>
                            {(gridExclusions||[]).map((exclusion,index)=>{
                                return <LignePunitionExcl definitif={exclusion.definitif} punitionId={exclusion.id} punitionCode={1} rowIndex={index} date={exclusion.date} nbreJours={exclusion.nbre_jours} motif={exclusion.motif} etat={exclusion.etat} isHeader={false} EnregPunition={EnregExclusion} doPunition={doExclusion} deletePunition={deleteExclusion}/>
                                })
                            }
                        </div>

                    </div>
                   
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'20vh'}}> 
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', fontSize:'1vw', fontWeight:'bold', marginLeft:'0vw', width:'97%'}}>
                            <FormPuce menuItemId ='1' 
                                isSimple={true} 
                                noSelect={true} 
                                imgSource={'images/' + getPuceByTheme()} 
                                withCustomImage={true} 
                                imageStyle={classes.PuceStyle}    
                                libelle = {t('other_sanction')}   
                                itemSelected={null}
                                style={{marginBottom:'-1vh'}}
                                puceImgStyle={{marginRight:'-0.3vw', marginTop:'1vh'}}
                            />         
                            <CustomButton
                                btnText={t('add')} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginRight:'4.3vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler = {() => {addOtherRow()}}
                            />              
                        </div>

                        <div style={{display:'flex', flexDirection:'column', marginTop:'0.7vh', marginLeft:'2vw', width:'93%',overflowY:'scroll', justifyContent:'center'}}>
                            <LignePunitionHeader punitionCode={2}/>
                            {(gridOther||[]).map((autre,index)=>{
                                return <LignePunitionOth  punitionId={autre.id} punitionCode={2} rowIndex={index} date={autre.date} nbreJours={autre.nbre_jours} motif={autre.motif} etat={autre.etat} isHeader={false} EnregPunition={EnregOther} doPunition={doOther} deletePunition={deleteOther}/>
                                })
                            }
                        </div>
                    </div>

                </div>
                       
            </div>
               
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText= {t('cancel')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}
                />

                <CustomButton
                    btnText={t('save')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveStudenFiche}
                />

                <CustomButton
                    btnText={t('imprimer')} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={printStudentFiche}
                />
    
            </div>

        </div>
       
    );
 }
 export default FicheDisciplinaire;
 