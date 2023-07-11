import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';

var cur_fileToUpload = undefined;
var cur_classeId = undefined;
var cur_coursId = undefined;
var selected_file_name='';
var filename = '';


var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;

function AddFicheProgess(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const [fileSelected, setFileSelected] = useState(false)
    const [fileUploaded, setFileUploaded] = useState(false);
    
   
    const [isDownload,setIsDownload]= useState(false);
    
    //const [formMode,setFormMode] = useState("creation") //creation, modif, consult


    const [optClasse, setOptClasse] = useState([]);
    const [optCours, setOptCours] = useState([]);
    const [inputDataCorrect, setInputDataCorrect] = useState(false);

    useEffect(()=> {
        selected_file_name='';
        getEtabListClasses();
        getCoursClasse(currentAppContext.currentEtab, 0);
        currentUiContext.setIsParentMsgBox(false);
        //console.log("msgParents:", currentUiContext.isParentMsgBox)
    },[]);


    const getEtabListClasses=()=>{
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  -- Choisir une classe --  ' : '  --Select Class --  '  }]
        
        if(props.formMode=="special"){
            tempTable=[];
            tempTable.push({value:props.selectedClasse.id, label:props.selectedClasse.label});
            setOptClasse(tempTable);
        }else{
            axiosInstance.post(`list-classes/`, {
                id_sousetab: currentAppContext.currentEtab,
            }).then((res)=>{                
                res.data.map((classe)=>{
                    tempTable.push({value:classe.id, label:classe.libelle})              
                })   
                setOptClasse(tempTable);                
            })
        }       
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        var tabCours;
        
        if(props.formMode=="special"){
            tempTable=[];
            cur_coursId = props.selectedCours.id;
            tempTable.push({value:props.selectedCours.id, label:props.selectedCours.label});
            setOptCours(tempTable);
            setInputDataCorrect(true);
        }else{
            if(classeId!=0){
                tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
                tabCours.map((cours)=>{
                    tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
                })    
            }       
            console.log('cours',tabCours,tempTable);
            setOptCours(tempTable);
            if(document.getElementById('optCours').options[0]!= undefined)
            document.getElementById('optCours').options[0].selected=true;
        }     
     
    }
    

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_FP: {
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

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_FP: {
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

    function getNotifButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_notifButtonStyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_notifButtonStyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_notifButtonStyle + ' '+ classes.margRight5P;
        }
    }

   
    /************************************ Handlers ************************************/    
    
    function classeChangeHandler(e){
       
        if(e.target.value != optClasse[0].value){
            cur_classeId = e.target.value;
            getCoursClasse(currentAppContext.currentEtab, cur_classeId);
        }else{
            cur_classeId = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
        }
        setInputDataCorrect(false);
    }


    function coursChangeHandler(e){
        if(e.target.value != optCours[0].value){
            cur_coursId = e.target.value;
            setInputDataCorrect(true);
            
        } else {
            cur_coursId = undefined;
            setInputDataCorrect(false);
        }

    }
    

    

    function downloadHandler(e){
        if(window.location.hostname==="localhost" || window.location.hostname==="127.0.0.1"){
            var downloadUrl = 'http://localhost:3000/fiches/FicheProgression.xlsx';
        } else var downloadUrl = 'http://192.168.43.99:3000/fiches/FicheProgression.xlsx';


        fetch(downloadUrl,{
            method: 'GET',
            headers:{
                'Content-Type':'blob'
            },
            responseType:'arraybuffer'
        })
        .then(response =>{
            response.blob().then(blob=> {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download ='FicheProgression.xls';
                a.click();
            })
            //window.location.href=response.url;
        })

        /*axios.post('http://localhost:3000/fiches', {
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
        });*/
        

    }

    function fileChangeHandler(e){
        cur_fileToUpload = e.target.files[0];
        if(cur_fileToUpload!=undefined){
            selected_file_name = cur_fileToUpload.name;
            setFileSelected(true);
        }else{
            selected_file_name = '';
            setFileSelected(false); 
        }
        console.log('file data',cur_fileToUpload);
        console.log("msgParents:", currentUiContext.isParentMsgBox);
        
    }


    function storeFicheProgress(coursId){
        //currentUiContext.setIsParentMsgBox(false);
        axiosInstance.post(`sauvegarder-fiche-progression/`, {
            id_cours : coursId,
            id_sousetab : currentAppContext.idEtabInit,
            filename : filename,
           
        }).then((res)=>{
            console.log("cours, sous etab:", coursId, currentAppContext.idEtabInit);
            console.log("fiche cree:",res.data);
            
           //ici il faut ajouter un if si l'operation se passe bien afficher ceci
           
            chosenMsgBox = MSG_SUCCESS_FP;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })
           
            //sinon afficher ceci
            /*chosenMsgBox = MSG_ERROR;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("success_operation_M"), 
                message:t("success_operation")
            })*/
                
        })

    }

    function saveFicheProgressChanges(e){
        uploadFile(cur_fileToUpload);
    }

    function uploadFile(){
        var form_data= new FormData();

        form_data.append('desciption','Fiche de progression par classe' );
        form_data.append('file_type','fiche-progression' );
        form_data.append('timestamp','' );
        form_data.append('file',cur_fileToUpload);

        axios.post(`http://127.0.0.1:8000/api/upload-fiche-progression/`,form_data, {
            header:{
                'Content-type': 'multipart/form-data'
            }
                 
        }).then((res)=>{
            console.log(res.data);
            filename = res.data.filename;
            storeFicheProgress(cur_coursId);  
           // setFileUploaded(true);           
        })

    }


    function saveOrUploadFP(e){       
        if(isDownload) props.cancelHandler();
        else  uploadFile(cur_fileToUpload);
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainerPPP}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/FicheProgession.png'/>
                </div>
                           
                <div className={classes.formMainTitle} >
                    {t("get_or_put_FP")}
                </div>                
            </div>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'47vh'}}/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            
                <div className={classes.etape}>                   

                    <div className={classes.inputRow}>
                        <div className={classes.groupInfo} >
                            <div className={classes.inputRowLeft}> 
                                <div style={{display:'flex', flexDirection:'row',  marginLeft:"-2.3vw", marginTop:"2vh"}}>
                                    <input type='radio' style={{width:'1.7vw', height:'2.3vh'}} checked={isDownload==false}  value={'presents'} name='ficheProg' onClick={()=>{isDownload? setIsDownload(false):setIsDownload(true)}}/>
                                    <label style={{color:'black',  fontWeight:"bold", fontSize:"1vw", marginRight:"0.3vw", marginLeft:"0.3vw", marginTop:"0vw"}}>{t('upload_FP')} </label>

                                    <input type='radio' style={{width:'1.7vw', height:'2.3vh'}} checked={isDownload==true}  value={'presents'} name='ficheProg' onClick={()=>{isDownload? setIsDownload(false):setIsDownload(true);}}/>
                                    <label style={{color:'black', fontWeight:"bold", fontSize:"1vw", marginLeft:'0.13vw', marginRight:"1vw",marginTop:"0vw" }}>{t('get_model_FP')}</label>
                                </div>                     
                            </div>
                            {isDownload ?
                                <div className={classes.inputRowLeft} style={{marginTop:'7vh'}}> 
                                    <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[11]}/>
                                   
                                    <CustomButton
                                        btnText={t('download_FPModel_here')}
                                        hasIconImg= {true}
                                        imgSrc='images/saveToDisk_trans.png'
                                        imgStyle = {classes.grdBtnImgStyle}  
                                        buttonStyle={getNotifButtonStyle()}
                                        btnTextStyle = {classes.notifBtnTextStyle}
                                        btnClickHandler={downloadHandler}
                                        //disable={(isValid==false)}   
                                    />
                                </div>
                                :
                                <div className={classes.groupInfo} style={{marginBottom:'3.7vh', marginTop:'2.7vh'}}>
                                    <div className={classes.inputRowLeft} style={{marginBottom:'3vw'}}> 
                                        <div style={{width:'19vw', fontWeight:570}}>
                                           {t('class')}:  
                                        </div>
                                            
                                        <div style={{marginBottom:'1.3vh', marginLeft:'-5.7vw'}}> 
                                            
                                            <select id='optClasse' defaultValue={1} onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'1.73rem',width:'12vw'}}>
                                                {(optClasse||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                         
                                        <div className={classes.inputRowLabel} style={{fontWeight:570, marginLeft:'2.3vw'}}>
                                            {t('course')}:   
                                        </div>
                                        
                                        <div style={{marginBottom:'1.3vh', marginLeft:'-2vw'}}>  
                                            
                                            <select id='optCours' defaultValue={1} onChange={coursChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-5.7vw', height:'1.73rem',width:'15vw'}}>
                                                {(optCours||[]).map((option)=> {
                                                    return(
                                                        <option  value={option.value}>{option.label}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        
                                    </div>

                                    <div className={classes.inputRowLeft}> 
                                        {/*<div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                            Fichier: 
                                            </div> */}                   
                                        <div style={{alignSelf:"center"}}> 
                                            <label for="xlsFile"  style={{height:'4.3vh', border:"1px solid none", borderRadius:'5px', paddingLeft:'0.3vw', paddingRight:'0.3vw', paddingTop:"1vh", paddingBottom:"1vh", backgroundColor:  inputDataCorrect ? 'rgb(85 118 194)':'gray', color:'white' }}><img alt='img' src="images/selectFile.png" style={{width:"1.93vw",height:"1.93vw", marginBottom:"-1.47vh"}}/>{t('select_file')}</label>
                                            <input id="xlsFile"  /*disabled={true}*/ type="file"  accept=".xls, .xlsx" onChange={fileChangeHandler} style={{display:"none"}}/>
                                        </div>

                                        <div style={{minWidth:'11vw', marginLeft:'0.7vw',alignSelf:"center",}}> 
                                            <label id="fileName" style={{fontSize:"2.3vh"}}>{selected_file_name}</label>
                                        </div>
   
                                        {/*(fileSelected)&&
                                            <CustomButton
                                                btnText= {t('depose_fichier')} 
                                                buttonStyle={getNotifButtonStyle()}
                                                btnTextStyle = {classes.gridBtnTextStyleP}
                                                style={{marginLeft:"2.67vw"}}
                                                btnClickHandler={saveFicheProgressChanges}
                                                //disable={(!fileSelected)}
                                            />
                                        */}
                                    </div>
                                                          
                                </div>
                            }

                        </div>
                       
                    </div>

                </div>
            
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />

                <CustomButton
                    btnText={t('ok')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveOrUploadFP}
                    disable={(isDownload) ? !isDownload :!fileSelected}
                />
                
            </div>

        </div>
       
    );
 }
 export default AddFicheProgess;
 