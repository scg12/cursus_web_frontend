import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var CURRENT_ELEVE = {
    //---Infos Perso 
    id:-1,
    matricule : '',
    nom : '',
    prenom : '',
    date_naissance : '',
    lieu_naissance : '',
    adresse : '',
    sexe : 'M',
    photo_url : '',
    age:20,           
    //---Infos Scolaires
    date_entree : '',
    etab_provenance:'',
    classe:'',
    filiere:'',
    redouble : false,
    est_en_regle: false,
    //---Infos des parents
    nom_pere : '',
    email_pere : '',
    tel_pere : '',
    prenom_pere :'',

    nom_mere : '',
    email_mere : '',
    tel_mere : '',
    prenom_mere : '',         
             
};
let tabSexePrim=[];
let tabRedoublePrim=[];

function AddStudent(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
    const[etape,setEtape] = useState(1);
    const [etape1InActiv, setEtape1InActiv] = useState(setButtonDisable(1));
    const [etape2InActiv, setEtape2InActiv] = useState(setButtonDisable(2));
    const [etape3InActiv, setEtape3InActiv] = useState(setButtonDisable(3));
    const [optSexe, setOptSexe]= useState([]);
    const [optRedouble, setOptRedouble]= useState([]);
    const [isMasculin,setIsMasculin]= useState(true);
    const [isRedoublant,setIsRedoublant]= useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    //const [formMode,setFormMode] = useState("creation") //creation, modif, consult


    const [optClasse, setOptClasse] = useState([]);
    //const [optFiliere, setOptFiliere] = useState([]);

    useEffect(()=> {
        /*if(etape==1)
        document.getElementById("AjoutEleveEtape").classList.add('gotoLeft');
        if(etape==2)
        document.getElementById("AjoutEleveEtape2").classList.add('gotoLeft');
        if(etape==3)
        document.getElementById("AjoutEleveEtape3").classList.add('gotoLeft');*/

        if(props.formMode != 'creation'){
           setOptSexe(tabSexe.filter((sex)=>sex.value == currentUiContext.formInputs[12])) 
        }else{
            setOptSexe(tabSexe);
            setOptRedouble(tabRedouble);
        }

        
            CURRENT_ELEVE = {
                //---Infos Perso 
                id : putToEmptyStringIfUndefined(currentUiContext.formInputs[11]),
                nom : putToEmptyStringIfUndefined(currentUiContext.formInputs[0]),
                prenom : putToEmptyStringIfUndefined(currentUiContext.formInputs[1]),
                date_naissance : putToEmptyStringIfUndefined(currentUiContext.formInputs[2]),
                lieu_naissance : putToEmptyStringIfUndefined(currentUiContext.formInputs[3]),
                adresse : '',
                sexe :putToEmptyStringIfUndefined(currentUiContext.formInputs[12]),
                photo_url : '',           
                //---Infos Scolaires
                date_entree : putToEmptyStringIfUndefined(currentUiContext.formInputs[14]),
                etab_provenance:putToEmptyStringIfUndefined(currentUiContext.formInputs[4]),
                classe:'',
                filiere:'',
                redouble : putToEmptyStringIfUndefined(currentUiContext.formInputs[13]),
                //---Infos des parents
                nom_pere : putToEmptyStringIfUndefined(currentUiContext.formInputs[5]),
                email_pere : putToEmptyStringIfUndefined(currentUiContext.formInputs[6]),
                tel_pere : putToEmptyStringIfUndefined(currentUiContext.formInputs[7]),
                prenom_pere :'',
        
                nom_mere : putToEmptyStringIfUndefined(currentUiContext.formInputs[8]),
                email_mere : putToEmptyStringIfUndefined(currentUiContext.formInputs[9]),
                tel_mere : putToEmptyStringIfUndefined(currentUiContext.formInputs[10]),
                prenom_mere : '',      
                         
            }; 
            if(CURRENT_ELEVE.sexe=='M'||CURRENT_ELEVE.sexe=='') setIsMasculin(true) 
            else setIsMasculin(false); 
            
            if(CURRENT_ELEVE.redouble=='N'|| CURRENT_ELEVE.redouble=='') setIsRedoublant(false) 
            else setIsRedoublant(false); 

            console.log(currentUiContext.formInputs)

           
       
        getEtabListNiveaux();
        //getEtabListSpecialites(); en stand by (faut charger la table specialites)....
    },[]);


    const getEtabListNiveaux=()=>{
        var tempTable=[]
        axiosInstance.post(`list-niveaux/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            console.log(res.data);
            res.data.map((niveau)=>{
                tempTable.push({value:niveau.id, label:niveau.libelle})
            })
            setOptClasse(tempTable)                   
        })                
    }


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

    

    function setButtonDisable(etape){
        switch(props.formMode){  
            case 'creation':                     
                switch(etape){
                    case 1: return false;
                    case 2: return true;
                    case 3: return true;                    
                }
            case 'modif':
                switch(etape){
                    case  1: return false;
                    case  2: return true;
                    case  3: return true;                    
                }
            default : 
                switch(etape){
                    case  1: return false;
                    case  2: return false;
                    case  3: return false;                    
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


    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
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

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
    }


    const tabRedouble=[
        {value: 'N',   label:t('no')  },
        {value: 'O',   label:t('yes')  },       
    ];

    const tabSexe=[        
        {value: 'M',  label:t('form_masculin') },
        {value: 'F',  label:t('form_feminin')  }
    ];

    
   
    /************************************ Handlers ************************************/    
    function getUploadError(){
        var errorMsg;
        if(errors.length){
            if(errors[0].fileSizeTooSmall)  {
                errorMsg =  t("too_heavy_file"); 
                return errorMsg;
            }
            
            if(errors[0].fileSizeToolarge)  {
                errorMsg = t("too_small_file"); 
                return errorMsg;
            }

            if(errors[0].imageHeightTooSmall)  {
                errorMsg = t("file_size_too_small");;
                return errorMsg;
            }

            if(errors[0].imageWidthTooSmall)  {
                errorMsg = t("file_size_too_small"); 
                return errorMsg;
            }    

            if(errors[0].imageHeightTooBig)  {
                errorMsg = t("file_size_too_big");
                return errorMsg;
            }

            if(errors[0].imageWidthTooBig)  {
                errorMsg = t("file_size_too_big"); 
                return errorMsg;
            }            
        }       
    }

    function moveToLeft(){
        if(isButtonClicked) 
        document.getElementById("AjoutEleveEtape1").classList.add('gotoRight');
    }

    function gotoStep2Handler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData1();
        if(formDataCheck1(CURRENT_ELEVE).length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            } 
                 
            setEtape2InActiv(false);
            setEtape(2);
            setFormData2();
            setIsButtonClicked(true);
          
            //document.getElementById("AjoutEleveEtape1").classList.add('gotoRight');
            
            //if(currentUiContext.formInputs.length>0)
           // setOptRedouble(tabRedoublePrim);

           

        } else {
            setEtape2InActiv(true);
            setEtape3InActiv(true);           
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1(CURRENT_ELEVE);
        }
    }

    function backToStep1Handler(){
        setEtape2InActiv(true);
        setEtape(1);
        setFormData1();
    }

    function gotoStep3Handler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        getFormData2();
        if(formDataCheck2(CURRENT_ELEVE).length==0){
           if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }         
            setEtape3InActiv(false);
            setEtape(3);
            setFormData3();

        } else {
            if(etape3InActiv==false) setEtape3InActiv(true)
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1(CURRENT_ELEVE);
        }
    }

    function backToStep2Handler(){
        setEtape3InActiv(true);
        setEtape(2);
        setFormData2();
       
       // setOptRedouble(tabRedoublePrim);
       // console.log(tabRedoublePrim);
    }

    function finishAllSteps(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        //console.log('avant:',CURRENT_ELEVE);
        getFormData3();
        //console.log('apres:',CURRENT_ELEVE);
        if(formDataCheck3(CURRENT_ELEVE).length==0){
           if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }         
            props.actionHandler(CURRENT_ELEVE);
            //props.cancelHandler();

        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck3(CURRENT_ELEVE);
        }
    }   

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }
    
    function getFormData1(){
        CURRENT_ELEVE.id      = document.getElementById('id').value;
        CURRENT_ELEVE.nom     = putToEmptyStringIfUndefined(document.getElementById('nom').value).trim(); //(document.getElementById('nom').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom').defaultValue).trim();
        CURRENT_ELEVE.prenom  = putToEmptyStringIfUndefined(document.getElementById('prenom').value).trim(); // (document.getElementById('prenom').value !='') ? putToEmptyStringIfUndefined(document.getElementById('prenom').value).trim() : putToEmptyStringIfUndefined(document.getElementById('prenom').defaultValue).trim();
        CURRENT_ELEVE.date_naissance = document.getElementById('anne').value+'-'+ document.getElementById('mois').value + '-' + document.getElementById('jour').value;
        CURRENT_ELEVE.lieu_naissance = putToEmptyStringIfUndefined(document.getElementById('lieu_naissance').value).trim(); //(document.getElementById('lieu_naissance').value !='') ? putToEmptyStringIfUndefined(document.getElementById('lieu_naissance').value).trim() : putToEmptyStringIfUndefined(document.getElementById('lieu_naissance').defaultValue).trim();
        CURRENT_ELEVE.sexe = isMasculin ? 'M' : 'F';
        CURRENT_ELEVE.age  = 20;

        
        //if(currentUiContext.formInputs.length>0)
        //tabRedoublePrim = tabRedouble.filter((situation)=>situation.value == currentUiContext.formInputs[13]);
       
        console.log(CURRENT_ELEVE);
    }

    function setFormData1(){
        var tabEleve=[];        
        tabEleve[11] = CURRENT_ELEVE.id;
        tabEleve[0]  = CURRENT_ELEVE.nom; 
        tabEleve[1]  = CURRENT_ELEVE.prenom; 
        tabEleve[2]  = convertDateToUsualDate(CURRENT_ELEVE.date_naissance); 
        tabEleve[3]  = CURRENT_ELEVE.lieu_naissance;
        //tabEleve[12] = CURRENT_ELEVE.sexe;
        
        currentUiContext.setFormInputs(tabEleve);
        setOptSexe(tabSexe.filter((sex)=>sex.value == CURRENT_ELEVE.sexe));
        
    }

    function getFormData2(){
        CURRENT_ELEVE.etab_provenance =(document.getElementById('origine').value !='') ? putToEmptyStringIfUndefined(document.getElementById('origine').value).trim() : putToEmptyStringIfUndefined(document.getElementById('origine').defaultValue).trim();
        CURRENT_ELEVE.classe = document.getElementById('classe').value;
        CURRENT_ELEVE.redouble = isRedoublant ? true:false;
        CURRENT_ELEVE.date_entree = document.getElementById('date_entree').value;
        CURRENT_ELEVE.est_en_regle = false;
        console.log(CURRENT_ELEVE);
    }

    function setFormData2(){
        var tabEleve=[];        
        tabEleve[4]  = CURRENT_ELEVE.etab_provenance;
        tabEleve[13] = CURRENT_ELEVE.redouble;
        tabEleve[14] = CURRENT_ELEVE.date_entree;
        currentUiContext.setFormInputs(tabEleve);
    }

    function getFormData3(){
        //eleve.prenom_pere   = (document.getElementById('nom_pere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_pere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_pere').defaultValue).trim();
        //eleve.prenom_mere   = (document.getElementById('nom_pere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_pere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_pere').defaultValue).trim();
        CURRENT_ELEVE.nom_pere      = putToEmptyStringIfUndefined(document.getElementById('nom_pere').value).trim(); //(document.getElementById('nom_pere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_pere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_pere').defaultValue).trim();
        CURRENT_ELEVE.nom_mere      = putToEmptyStringIfUndefined(document.getElementById('nom_mere').value).trim(); //(document.getElementById('nom_mere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_mere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_mere').defaultValue).trim();
        CURRENT_ELEVE.tel_pere      = putToEmptyStringIfUndefined(document.getElementById('tel_pere').value).trim();   //(document.getElementById('tel_pere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('tel_pere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('tel_pere').defaultValue).trim();
        CURRENT_ELEVE.tel_mere      = putToEmptyStringIfUndefined(document.getElementById('tel_mere').value).trim();   //(document.getElementById('tel_mere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('tel_mere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('tel_mere').defaultValue).trim();
        CURRENT_ELEVE.email_pere    = putToEmptyStringIfUndefined(document.getElementById('email_pere').value).trim(); //(document.getElementById('email_pere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('email_pere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('email_pere').defaultValue).trim();
        CURRENT_ELEVE.email_mere    = putToEmptyStringIfUndefined(document.getElementById('email_mere').value).trim();  //(document.getElementById('email_mere').value !='') ? putToEmptyStringIfUndefined(document.getElementById('email_mere').value).trim() : putToEmptyStringIfUndefined(document.getElementById('email_mere').defaultValue).trim();     
      
        console.log(CURRENT_ELEVE);
    }

    function setFormData3(){
        var tabEleve=[];

        tabEleve[5] = CURRENT_ELEVE.nom_pere;
        tabEleve[6] = CURRENT_ELEVE.email_pere;
        tabEleve[7] = CURRENT_ELEVE.tel_pere;
        tabEleve[8] = CURRENT_ELEVE.nom_mere;
        tabEleve[9] = CURRENT_ELEVE.email_mere;
        tabEleve[10]= CURRENT_ELEVE.tel_mere;        
        
        currentUiContext.setFormInputs(tabEleve);
    }

    function formDataCheck1(eleve){       
        var errorMsg='';
        if(eleve.nom.length == 0){
            errorMsg= t('enter_student_name'); 
            return errorMsg;
        }

        if (eleve.prenom.length == 0) {
            errorMsg= t('enter_student_surname'); 
            return errorMsg;
        }

        if(eleve.date_naissance.length == 0) {
            errorMsg= t('enter_correct_bithDate'); 
            return errorMsg;
        } 

        if(!((isNaN(eleve.date_naissance) && (!isNaN(Date.parse(eleve.date_naissance)))))){
            errorMsg= t('enter_correct_bithDate'); 
            return errorMsg;
        }

        if(eleve.lieu_naissance.length == 0 ){
            errorMsg= t('enter_student_bithPlace');  
            return errorMsg;
        }    
        return errorMsg;  
    }
    

    function formDataCheck2(eleve){       
        var errorMsg='';
        return errorMsg;   
    }


    function formDataCheck3(eleve){       
        var errorMsg='';
        if(eleve.nom_pere.length == 0 && eleve.nom_mere.length == 0){
            errorMsg= t('enter_parent_name_atLeast'); 
            return errorMsg;
        }
        if( eleve.email_pere.length == 0 &&  eleve.email_mere.length == 0){
            errorMsg= t('enter_parent_email_atLeast'); 
            return errorMsg;
        }

        if(eleve.email_pere.length != 0 && !eleve.email_pere.includes('@')){
            errorMsg= t('enter_father_correct_email'); 
            return errorMsg ;
        }  

        if(eleve.email_mere.length != 0 && !eleve.email_mere.includes('@')){
            errorMsg= t('enter_mother_correct_email'); 
            return errorMsg;
        } 
        
        if((eleve.tel_mere.length==0 && eleve.tel_pere.length==0)||(eleve.tel_mere.length >0 && isNaN(eleve.tel_mere.replace(/\s/g,'')))||(eleve.tel_pere.length >0 && isNaN(eleve.tel_pere.replace(/\s/g,''))) ){
            errorMsg= t('enter_correct_phone_number'); 
            console.log(eleve.tel_pere.replace(/\s/g,''))
            return errorMsg;
        }
        return errorMsg;  
    }


    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
    }

    function showStep1(){
        if(props.formMode=='consult'){
            setFormData1(); setEtape(1);
        }
    }

    function showStep2(){
        if(props.formMode=='consult'){
            setFormData2(); setEtape(2);
        }

    }

    function showStep3(){
        if(props.formMode=='consult'){
            setFormData3();setEtape(3);
        }
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainer}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/AddStudent.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                        {t("enreg_eleve_M")}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                       {t("modif_eleve_M")} 
                    </div>
                :
                    <div className={classes.formMainTitle} >
                       {t("consult_eleve_M")}
                    </div>
                
                }
                
            </div>

            {(errors.length) ?
                    <div className={classes.formErrorMsg} style={{marginTop:'3vh'}}> {getUploadError()}</div>
                    :
                    null
                }           
                <div id='errMsgPlaceHolder'/> 
            {(etape == 1) &&
                <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
                    <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'3vh'}}> 
                        {t("etape")} 1: {t("infoPersoStudent")} 
                        {(props.formMode=='consult')&&
                            <div style={{position:'absolute', right:0, top:'-0.7vh' }}>
                                <CustomButton
                                    btnText='Quitter' 
                                    buttonStyle={getSmallButtonStyle()}
                                    style={{marginBottom:'-0.3vh', marginRight:'0.8vw', width:'4.3vw'}}
                                    btnTextStyle = {classes.btnSmallTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                />
                            </div>
                        }
                    </div>

                    <div className={classes.inputRow}>
                        <div className={classes.groupInfo} >
                            <div className={classes.inputRowLeft}> 
                                <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[11]}/>
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("form_nom")}:
                                </div>
                                    
                                <div> 
                                    <input id="nom" type="text"  defaultValue={currentUiContext.formInputs[0]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                                </div>
                            </div>

                            <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("form_prenom")}: 
                                </div>
                                    
                                <div> 
                                    <input id="prenom" type="text" defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                                </div>
                            </div>
                    
                            <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("form_dateNaiss")}:
                                </div>
                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="date_naissance" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[2]} style={{width:'6vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>
                                    :
                                    (currentUiContext.formInputs[2].length == 0) ?
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"  type="text"   Placeholder=' jj'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'-2vw'}} />/
                                        <input id="mois"  type="text"   Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  />/
                                        <input id="anne" type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("lieu_naissance"))}}  maxLength={4}   className={classes.inputRowControl }  style={{width:'2.7vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                                    </div>
                                    :
                                    <div style ={{display:'flex', flexDirection:'row'}}> 
                                        <input id="jour"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}          className={classes.inputRowControl}  style={{width:'1.3vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw',  marginLeft:'-2vw'}}  defaultValue={currentUiContext.formInputs[2].split("/")[0]} />/
                                        <input id="mois"  type="text"  maxLength={2}  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}          className={classes.inputRowControl}  style={{width:'1.7vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw',  marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[2].split("/")[1]} />/
                                        <input id="anne" type="text"  maxLength={4}   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("lieu_naissance"))}} className={classes.inputRowControl}  style={{width:'2.7vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw',  marginLeft:'0vw'}}  defaultValue={currentUiContext.formInputs[2].split("/")[2]} />
                                    </div>
                                }
                            </div>

                            <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("form_lieuNaiss")}:
                                </div>
                                    
                                <div> 
                                    <input id="lieu_naissance" type="text"   defaultValue={currentUiContext.formInputs[3]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw'}}/>
                                </div>
                            </div>

                            <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("form_sexe")}
                                </div>   

                                <div style={{display:'flex', flexDirection:'row',  marginLeft:"-2.3vw"}}>
                                    <label style={{color:'black', marginLeft:'0.13vw', marginRight:"0.3vw",marginTop:"0.23vw", height:'1.3vw', fontSize:'1vw' }}> {t("form_masculin")} </label>
                                    <input type='radio' checked={isMasculin==true}  value={'presents'} name='profpresents' style={{width:'1.13vw', height:'1.13vw', marginTop:'1vh'}} onClick={()=>{isMasculin? setIsMasculin(false):setIsMasculin(true)}}/>

                                    <label style={{color:'black', marginLeft:'0.13vw', marginRight:"0.3vw", marginLeft:"1.3vw", marginTop:"0.23vw", height:'1.3vw', fontSize:'1vw'}}> {t("form_feminin")} </label>
                                    <input type='radio' checked={isMasculin==false}  value={'presents'} name='profpresents' style={{width:'1.13vw', height:'1.13vw', marginTop:'1vh'}} onClick={()=>{isMasculin? setIsMasculin(false):setIsMasculin(true)}}/>
                                </div>                     
                            </div>
                        </div>

                        <div className={classes.inputRowRight} style={{paddingRight:'1vw'}}> 
                            {(filesContent.length==0) ? 
                                <div className={classes.etabLogo}>
                                    <div  className={classes.logoImg}>Photo 4X4</div>
                                    <CustomButton
                                        btnText={t("select_photo")}
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler = {() => {getFormData1(); setFormData1(); openFileSelector()}}
                                    />
                                </div>  
                                    :
                                <div className={classes.etabLogo}>
                                    <img alt={filesContent[0].name} className={classes.logoImg} src={filesContent[0].content}/>
                                    <div className={classes.photoFileName}>{filesContent[0].name}</div>
                                    <CustomButton
                                        btnText={t("select_photo")} 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnSmallTextStyle}
                                        btnClickHandler = {() => {getFormData1(); setFormData1(); openFileSelector();}}
                                    />
                                    <input id="photo_url" type="hidden"  defaultValue=''/>
                                </div>
                            }              
                        </div>                     

                    </div>
                    
                    
                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'1vh', marginBottom: isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText= {t("cancel")}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={props.cancelHandler}
                            />

                            <CustomButton
                                btnText= {t("etape")+' 2 >'}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={gotoStep2Handler}
                            />
                        </div>
                    }                    
                </div>
            }

            {(etape == 2)&&
                <div id='AjoutEleveEtape2' className={classes.etape} /*onLoad={()=>{document.getElementById("AjoutEleveEtape2").classList.add('gotoLeft');}}*/>
                    <div className={classes.inputRowLeft} style={{color:'rgb(9, 103, 211)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(9, 103, 211)', borderBottomWidth:1.97, marginBottom:'3vh'}}> 
                        {t("etape")} 2: {t("schoolInfos")}  
                        {(props.formMode=='consult') &&
                            <div style={{position:'absolute', right:0, top:'-0.7vh' }}>
                                <CustomButton
                                btnText= {t("quitter")} 
                                buttonStyle={getSmallButtonStyle()}
                                style={{marginBottom:'-0.3vh', marginRight:'0.8vw', width:'4.3vw'}}
                                btnTextStyle = {classes.btnSmallTextStyle}
                                btnClickHandler={props.cancelHandler}
                            />
                            </div>
                        }
                    </div>

                    <div className={classes.groupInfo} style={{marginBottom:'3.7vh'}}>
                        <div className={classes.inputRowLeft}> 
                            <div style={{width:'19vw', fontWeight:570}}>
                                {t("provenance")}:  
                            </div>
                                
                            <div> 
                                <input id="origine" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[4]} style={{marginLeft:'-2vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft}> 
                                <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                    {t("annee_entree")}:  
                                </div>
                                <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}> 
                                    <input id="date_entree" type="text"  maxLength={4} className={classes.inputRowControl}  defaultValue={(props.formMode =='creation') ? new Date().getFullYear() : currentUiContext.formInputs[14]} style={{width:'3vw', height:'1.3rem', marginLeft:'0vw'}}  disabled={true} />
                                </div>
                            </div>

                    
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("classe_entree")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}>  
                                <input id="classe" type="text" className={classes.inputRowControl }  defaultValue={props.currentClasseLabel} style={{width:'4.3vw', height:'1.3rem', marginLeft:'0vw'}} disabled={true}/>
                                <input id="classe" type="hidden"  defaultValue={props.currentClasseId}/>
                            </div>
                        </div>

                       

                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("redoublant")}:  
                            </div>  
                            <div style={{display:'flex', flexDirection:'row',  marginLeft:"-2vw"}}>
                                <label style={{color:'black', marginLeft:'0.13vw', marginRight:"0.3vw", marginTop:"0.23vw"}}>  {t("no")} </label>
                                <input type='radio' checked={isRedoublant==false}  value={'presents'} name='profpresents' onClick={()=>{isRedoublant? setIsRedoublant(false):setIsRedoublant(true)}}/>
                                
                                <label style={{color:'black', marginLeft:'0.13vw', marginRight:"0.3vw", marginLeft:"1vw",marginTop:"0.23vw" }}> {t("yes")} </label>
                                <input type='radio' checked={isRedoublant==true}  value={'presents'} name='profpresents' onClick={()=>{isRedoublant? setIsRedoublant(false):setIsRedoublant(true)}}/>
                            </div>                 
                        </div>                       
                    </div>
                    
                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'1vh', marginBottom:isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText={'< '+t("etape")+' 1'}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={backToStep1Handler}
                            />
                            <CustomButton
                                btnText= {t("etape") + ' 3 >'}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={gotoStep3Handler}
                            />
                        </div>
                    }
                </div>
            }

            {(etape == 3) &&
                <div id='AjoutEleveEtape3' className={classes.etape} /*onLoad={()=>{document.getElementById("AjoutEleveEtape3").classList.add('gotoLeft');}}*/>
                    <div className={classes.inputRowLeft} style={{color:'rgb(185, 131, 14)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(185, 131, 14)', borderBottomWidth:1.97, marginBottom:'3vh'}}> 
                    {t("etape")+' 3'}:{t("studentParentInfos")} 
                        {(props.formMode=='consult')&&
                            <div style={{position:'absolute', right:0, top:'-0.7vh' }}>
                                <CustomButton
                                    btnText={t("quitter")}
                                    buttonStyle={getSmallButtonStyle()}
                                    style={{marginBottom:'-0.3vh', marginRight:'0.8vw', width:'4.3vw'}}
                                    btnTextStyle = {classes.btnSmallTextStyle}
                                    btnClickHandler={props.cancelHandler}
                                />
                            </div>
                        }
                    </div>

                    <div className={classes.groupInfo}>
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_faterName")}:
                            </div>
                                
                            <div> 
                                <input id="nom_pere" enable={(props.formMode != 'consult')} type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[5]} style={{marginLeft:'-2vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_mailPere")}
                            </div>
                                
                            <div> 
                                <input id="email_pere" disable={(props.formMode == 'consult')} type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[6]} style={{marginLeft:'-2vw'}}/>
                            </div>
                        </div>
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_telPere")}:
                            </div>
                                
                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                <label style={{color:'grey', marginLeft:'-2vw', marginRight:'0.17vw', fontSize:'1rem'}}>+237/ </label>
                                <input id="tel_pere" disable={(props.formMode == 'consult')} type="text" maxLength={12} className={classes.inputRowControl} style={{width:'7vw', height:'1.3rem', marginLeft:'0vw'}}   defaultValue={currentUiContext.formInputs[7]} />
                            </div>
                        </div>
                        
                        <div className={classes.inputRowLeft} > 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_nomMere")}:
                            </div>
                                
                            <div> 
                                <input id="nom_mere" disable={(props.formMode == 'consult')} type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[8]} style={{marginLeft:'-2vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_EmailMere")}:
                            </div>
                                
                            <div> 
                                <input id="email_mere" disable={(props.formMode == 'consult')} type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[9]} style={{marginLeft:'-2vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("form_TelMere")}:
                            </div>
                                
                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                <label style={{color:'grey', marginLeft:'-2vw', marginRight:'0.17vw', fontSize:'1rem'}}>+237/ </label>
                                <input id="tel_mere" disable={(props.formMode == 'consult')} type="text" maxLength={12}  className={classes.inputRowControl}   defaultValue={currentUiContext.formInputs[10]} style={{width:'7vw', height:'1.3rem', marginLeft:'0vw'}}/>
                            </div>
                        </div>

                    </div>

                    {(props.formMode != 'consult') &&
                        <div className={classes.inputRowRight} style={{position:'absolute', bottom:'1vh', marginBottom:isMobile ? '-1vh':'-3vh'}}>
                            <CustomButton
                                btnText= {'< '+t("etape")+' 2'}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={backToStep2Handler}
                            />
                            <CustomButton
                                btnText={t("terminer")}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={finishAllSteps}
                            />
                        </div>                        
                    }                    
                    
                </div>
            }
            
            <div className={classes.formButtonRow}>
                <CustomButton
                    btnText= {t("infoPerso")}
                    hasIconImg= {true}
                    imgSrc='images/etape1.png'
                    imgStyle = {classes.frmBtnImgStyle1}   
                    buttonStyle={classes.buttonEtape1}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={()=>{showStep1();}}
                    disable={etape1InActiv}
                />
                
                <CustomButton
                    btnText={t("infoAcad")}
                    hasIconImg= {true}
                    imgSrc='images/etape2.png'
                    imgStyle = {classes.frmBtnImgStyle2} 
                    buttonStyle={classes.buttonEtape2}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={(etape2InActiv) ? null: ()=>{showStep2();}}
                    disable={etape2InActiv}
                />

                <CustomButton
                    btnText={t("infoParnt")}
                    hasIconImg= {true}
                    imgSrc='images/etape3.png'
                    imgStyle = {classes.frmBtnImgStyle1} 
                    buttonStyle={classes.buttonEtape3}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={(etape3InActiv) ? null:()=>{showStep3();}}
                    disable={etape3InActiv} 
                />
                
            </div>

        </div>
       
    );
 }
 export default AddStudent;
 