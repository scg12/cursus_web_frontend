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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

var cur_fileToUpload = undefined;
var cur_classeId = undefined;
var cur_coursId = undefined;
var selected_file_name='';
var filename = '';


var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;

function InternMsg(props) {
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
        // getEtabListClasses();
        // getCoursClasse(currentAppContext.currentEtab, 0);
        currentUiContext.setIsParentMsgBox(false);
    },[]);


    const getEtabListClasses=()=>{
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  -- Choisir une classe --  ' : '  --Select Class --  '  }]
        
        if(props.formMode=="special"){
            tempTable=[];
            tempTable.push({value:props.selectedClasse.id, label:props.selectedClasse.label});
            setOptClasse(tempTable);
        }else{

            let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
            console.log(classes)
            let classes_user;
            if(currentAppContext.infoUser.is_prof_only) 
                classes_user = currentAppContext.infoUser.prof_classes;
            else{
                classes_user = currentAppContext.infoUser.censeur_classes;
                let prof_classes = currentAppContext.infoUser.prof_classes;
                // console.log(pp_classes)
                prof_classes.forEach(classe => {
                    if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                        classes_user.push({"id":classe.id,"libelle":classe.libelle})

                });
            }

            let n = classes_user.length;
            let m = classes.length;
            let i = 0;
            let j = 0;
            while(i<n){
                j = 0;
                while(j<m){
                    if(classes_user[i].id==classes[j].id_classe){
                        tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                        break;
                    }
                    j++;
                }
                i++;
            }

            // axiosInstance.post(`list-classes/`, {
            //     id_sousetab: currentAppContext.currentEtab,
            // }).then((res)=>{                
            //     res.data.map((classe)=>{
            //         tempTable.push({value:classe.id, label:classe.libelle})              
            //     })   
            //     setOptClasse(tempTable);                
            // })
        setOptClasse(tempTable);                

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
                if(currentAppContext.infoUser.is_censeur)
                    tabCours = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
                    
                else
                    tabCours = currentAppContext.infoUser.prof_cours.filter(cours=>cours.id_classe ==classeId)
        
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
        <div className={'card '+ classes.formContainerP4}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/NewComInterne.png'/>
                </div>
                           
                <div className={classes.formMainTitle} >
                    {t("nouv_communique_M")}
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

            <div style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", position:"absolute", top:"11.7vh", left:"5vw"}}>
                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'4.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("destinataire")}:
                    </div>
                        
                    <div> 
                        <input id="destinataireLabel" type="text" disabled={true} className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-8.3vw', height:'1rem', width:'20vw', fontSize:'1.13vw', color:'#898585'}}/>
                        <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                    </div>
                </div>

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'4.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg")}:
                    </div>
                        
                    <div style={{marginLeft:"-10vw", marginTop:"0.7vh"}}> 
                        {/* <textarea style={{width:"40vw",height:"auto", minHeight:"33vh"}}/> */}
                        <CKEditor
                            editor  = {ClassicEditor}
                            data    = "<p>Hello </p>"
                            style   = {{with:"40vw", minHeight:"33vh"}}
                            onReady = {editor => {
                                console.log("Editor is ready to use")
                            }}
                        
                        />
                    </div>
                </div> 

            </div>

            <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", position:"absolute",  bottom:"6.3vh", left:"1.7vw", height:'4.7vh'}}> 
                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                    {t("msg_deadline")}:
                </div>
                    
                <div> 
                    <input id="msgDeadlineLabel" type="text" disabled={true} className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-3vw', height:'1rem', width:'20vw', fontSize:'1.13vw', color:'#898585'}}/>
                </div>
            </div>
            
           
            <div className={classes.formButtonRowP}>
                <CustomButton
                    btnText={t('ok')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveOrUploadFP}
                    disable={(isDownload) ? !isDownload :!fileSelected}
                />

                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
            </div>

        </div>
       
    );
 }
 export default InternMsg;
 