import React from 'react';

import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import MultiSelect from '../../../multiSelect/MultiSelect';
import { useContext, useState, useEffect, useCallback,useRef} from "react";
import {isMobile} from 'react-device-detect';
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import Webcam from "react-webcam";
import {getTodayDate, changeDateIntoMMJJAAAA} from '../../../../store/SharedData/UtilFonctions';



var chosenMsgBox;
const MSG_SUCCESS   = 1;
const MSG_WARNING   = 2;
const MSG_CONFIRM   = 3;
const MSG_ERROR     = 4;
const MultiSelectId = "MS-4"

var CURRENT_BATCH_PHOTO;
var CURRENT_SELECTED_INDEX = 0;

var photoLibelle    = "";
var photoDesc       = "";
var comptSelected   = 0;


function BatchPhotoPic(props) {
    const { t, i18n }       = useTranslation();
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme     = currentUiContext.theme;
    const [picturesList, setPictureList] = useState([]);
    // const [photoInfo,    setPhotoInfo]   = useState(tabElevesPhoto[0]);
    const webcamRef = useRef(null);                        // create a webcam reference
    const [imgSrc, setImgSrc]            = useState(""); // initialize it
    const [rowSelected, SetRowSelected]  = useState([]);
    const [countChecked, setCounChecked] = useState(props.photoList.filter((elt)=>elt.has_picture==true).length);
    const [isValid, setIsValid]  = useState(false);
    
    var tabElevesPhoto = initPhotoList(props.photoList);
    
    useEffect(()=> {        
        currentUiContext.setIsParentMsgBox(false); 
        CURRENT_SELECTED_INDEX = 0;  
        photoLibelle =  currentUiContext.formInputs[1];
        photoDesc    =  currentUiContext.formInputs[2];
        getBatchPhotoInfos(props.batchPhotoId); 
        console.log("les finished",countChecked)
        // setCounChecked(comptSelected);
    },[]);


    
    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
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
    function initPhotoList(listElvPhoto){
        var tabElt   = [];
        var photoElv = {};
        comptSelected = 0
        listElvPhoto.map((elt)=>{
            photoElv        = {};
            photoElv.id          = elt.id
            photoElv.nomEleve    = elt.nom+' '+elt.prenom;
            photoElv.photoPath   = elt.photo_url;
            photoElv.photoValid  = elt.has_picture==null||elt.has_picture==false? -1 : 1;
            if(photoElv.photoValid==1) comptSelected++;
            tabElt.push(photoElv);
        });
       // setCounChecked(comptSelected);
        return tabElt;        
    }

    const  getBatchPhotoInfos=(batchPhotoId)=>{
      
        var rowSelected = [];
       
        tabElevesPhoto.map((elt, index)=>{
            if(index==0) {
                rowSelected.push(true);
                CURRENT_SELECTED_INDEX = 0;
            }
            rowSelected.push(false);
        });
        
        SetRowSelected(rowSelected); 
        setPictureList(tabElevesPhoto);
        setImgSrc(tabElevesPhoto[0].photoPath);
               
    }
      
   

    function updateBatchPhoto(e){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_BATCH_PHOTO);
        getFormData();
        console.log('apres:',CURRENT_BATCH_PHOTO);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_BATCH_PHOTO);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
           props.actionHandler(CURRENT_BATCH_PHOTO);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function closeBatchPhoto(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_BATCH_PHOTO);
        getFormData();
        console.log('apres:',CURRENT_BATCH_PHOTO);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_BATCH_PHOTO);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
           props.actionHandler(CURRENT_BATCH_PHOTO);  
           props.cancelHandler();
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }

    }

    
    function getFormData(){
        CURRENT_BATCH_PHOTO = {};
        CURRENT_BATCH_PHOTO.id_sousetab = parseInt(currentAppContext.currentEtab);
        CURRENT_BATCH_PHOTO.libelle     = photoLibelle;
        CURRENT_BATCH_PHOTO.but         = photoDesc;
        CURRENT_BATCH_PHOTO.id_eleves   = getIdEleves();
        CURRENT_BATCH_PHOTO.etat        = 1
        CURRENT_BATCH_PHOTO.id_liste    = props.batchPhotoId;
    }

    function getIdEleves(){
        var elevIds = "";
        picturesList.map((elt, index)=>{
            if(index < picturesList.length-1){
                elevIds =  elevIds + elt.id +'_';
            } else {
                elevIds =  elevIds + elt.id;
            }
        });
        return elevIds;
    }


    function formDataCheck1(){
        var errorMsg='';

        // if(CURRENT_BATCH_PHOTO.id_eleves.length == 0) {
        //     errorMsg=t("enter_msg_recipient");
        //     return errorMsg;
        // } 
       
        // if(CURRENT_BATCH_PHOTO.sujet.length == 0) {
        //     errorMsg=t("enter_msg_subject");
        //     return errorMsg;
        // } 

        // if(CURRENT_BATCH_PHOTO.message.length == 0) {
        //     errorMsg=t("enter_correct_msg");
        //     return errorMsg;
        // } 

       
        return errorMsg;
    }

  
   

    function upDateElevePhoto(eleveId, photoUrl){
        return new Promise(function(resolve, reject){
            axiosInstance
            .post(`save-photo-eleve/`, {
                id_eleve  : eleveId,
                photo_url : photoUrl
            }).then((res)=>{
                console.log(res.data.status)
                resolve(1);
            },(res)=>{
                console.log(res.data.status)
                reject(0);
            })     

        })       
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //currentUiContext.setIsParentMsgBox(true);
                return 1;                
            }

            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
                })  
                upDateElevePhoto(picturesList[CURRENT_SELECTED_INDEX].id, picturesList[CURRENT_SELECTED_INDEX].photoPath).then(()=>{
                    picturesList[CURRENT_SELECTED_INDEX].photoValid = 1;
                    setCounChecked(countChecked+1);
                    chosenMsgBox = MSG_SUCCESS;
                    currentUiContext.showMsgBox({
                        visible  : true, 
                        msgType  : "info", 
                        msgTitle : t("success_modif_M"), 
                        message  : t("success_modif")
                    });
                    return 1;
                });                
               
            }

            case MSG_WARNING: {
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

            case MSG_SUCCESS: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               
                return 1;
            }

            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               
                return 1;
            }


            case MSG_CONFIRM: {
                currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
                })  
           
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               
            }
        }
        
    }


    function displayElevPhoto(e,rowIndex){
        var tabRowSelected =  [...rowSelected];
        
        tabRowSelected[CURRENT_SELECTED_INDEX] = false;
        tabRowSelected[rowIndex] = true;
        CURRENT_SELECTED_INDEX   = rowIndex;        
       
        setImgSrc(picturesList[CURRENT_SELECTED_INDEX].photoPath)
        SetRowSelected(tabRowSelected);
    }


    const takePicture =  useCallback(() => {
       
        const imageSrc  = webcamRef.current.getScreenshot();         
        console.log("ffff",imageSrc);

        var tabElvPhoto = [...picturesList];      
        
        tabElevesPhoto[CURRENT_SELECTED_INDEX].photoPath  = imageSrc;
        tabElevesPhoto[CURRENT_SELECTED_INDEX].photoValid = 0;

        var photoInf    = {...picturesList[CURRENT_SELECTED_INDEX]};
        console.log("gdgdgd", photoInf, CURRENT_SELECTED_INDEX); 

        setIsValid(true);
        setPictureList(tabElevesPhoto);
        //setPhotoInfo(photoInf);
        
        setImgSrc(imageSrc);
    }, [webcamRef]);

    const retake = () => {
        tabElevesPhoto = [...picturesList];
        tabElevesPhoto[CURRENT_SELECTED_INDEX].photoPath  = "";
        tabElevesPhoto[CURRENT_SELECTED_INDEX].photoValid = -1;
        setPictureList(tabElevesPhoto);
        setIsValid(false);
        //setPhotoInfo(tabElevesPhoto[CURRENT_SELECTED_INDEX]);
        setImgSrc(null);
    };

       
    

    function validatePicture(e){
        chosenMsgBox = MSG_CONFIRM;
        currentUiContext.showMsgBox({
            visible:true, 
            msgType  : "question", 
            msgTitle : t("confirm_M"), 
            message  : t("confirm_photo")
        });

    }
    
    /************************************ JSX Code ************************************/

    const LignePhotoEleve=(props)=>{
        return(
            <div class={rowSelected[props.rowIndex]?"lignePhoto rowActive":"lignePhoto"} style={{display:"flex", flexDirection:"row", height:"5.3vh", paddingTop:"0.4vh", marginBottom:"1vh", paddingLeft:"1vh", border:"1px solid gainsboro"}}   onClick={(e)=>{displayElevPhoto(e,props.rowIndex)}}>
               <img id="profile"  src={'images/photo4Fois4P.png'} alt='dossierIcon' style={{width:'1.63vw', height:'1.63vw', marginRight:'1vw',borderRadius:"3px", border:"solid 1px #4a4646",padding:"0.1vh"}}/>
               <div style={{fontSize:'0.9vw',  fontWeight:'bold', width:"100%"}}>{props.photoEleve.nomEleve}</div>
                {props.photoEleve.photoValid==0 && <img src={'images/not_finished1.jpeg'} alt='dossierIcon' style={{width:'1.67vw', height:'1.67vw', borderRadius:"0.84vw", marginRight:"1vh", paddingTop:"0.3vh",borderColor:"green"}} />}
                {props.photoEleve.photoValid==1 && <img src={'images/check.png'} alt='dossierIcon' style={{width:'1.67vw', height:'1.67vw', borderRadius:"0.84vw", marginRight:"1vh", paddingTop:"0.3vh",borderColor:"green"}} />}
            </div>
        );
    }

    return (
        <div className={'card '+ classes.formContainerP4P}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/photo4f4.png'/>
                </div>
                {props.formMode == "look" ?         
                    <div className={classes.formMainTitle} >
                        {t("consult_batch_picture_M")}
                    </div>
                    :
                    <div className={classes.formMainTitle} >
                        {t("take_batch_Picture_M")}
                    </div>
                }                
            </div>

            <div id='errMsgPlaceHolder'/>

            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop style={{height:'100vh'}}/>}
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
            
            <div style={{display:"flex", flexDirection:"row", width:"100%", height:"79.9%", position:"absolute", top:"10vh"}}>
                

                <div style={{display:"flex", flexDirection:"column", width:"40vw", height:"100%", borderRight:"1.7px solid #b9b3b3"}}>
                    <div style={{width:"100%", height:"4.7vh", backgroundColor:"#07417b"/*backgroundColor:"#555151"*/ /*backgroundColor:"#9e9797"*/, color:"white", textAlign:"center", border:"solid 2px #e2d3d3", fontSize:"0.97vw", paddingTop:"0.43vh",marginBottom:"1vh"}}>
                        {t("list_of_children_M")}
                    </div>

                    <div style={{ width:"100%", height:"100%", overflowY:"scroll"}}>
                        {picturesList.map((pictureElv, index)=>{
                            return(
                                <LignePhotoEleve rowIndex={index} photoEleve={pictureElv}/>
                            ); 
                        })}
                    </div>
                   
                </div>

                <div style={{display:"flex", flexDirection:"column", width:"60vw", justifyContent:"center", alignItems:"center"}}>
                {picturesList[CURRENT_SELECTED_INDEX]!=undefined &&
                    <div style={{color:"black", fontSize:"0.9vw", fontWeight:"800"}}>
                        {picturesList[CURRENT_SELECTED_INDEX].nomEleve}
                    </div>
                }

                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"15vw", height:"15vw",border:"2px solid black", borderRadius:"0.7vw"}}>
                        {!imgSrc?
                            <Webcam screenshotFormat="image/jpeg" ref={webcamRef}  style={{width:"14.67vw",height:"15vw",aspectRatio:1}} mirrored={true}
                            screenshotQuality={1} />
                            :
                            <img src={imgSrc} style={{width:"14.67vw"/*,height:"15vw",aspectRatio:1*/}}/>                        
                        }                        
                       
                    </div>

                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-between", width:"17%"}}>
                      
                    {!imgSrc && picturesList[CURRENT_SELECTED_INDEX]!=undefined && picturesList[CURRENT_SELECTED_INDEX].photoValid <=0 &&
                        <CustomButton
                            btnText={t("filmer")}
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {takePicture}
                            style={{minWidth:"3vw"}}
                        />
                    }

                    {imgSrc && picturesList[CURRENT_SELECTED_INDEX]!=undefined && picturesList[CURRENT_SELECTED_INDEX].photoValid <=0 &&
                        
                        <CustomButton
                            btnText={t("re-filmer")}
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {retake}
                            style={{minWidth:"3vw"}}
                        />
                    }

                    {picturesList[CURRENT_SELECTED_INDEX]!=undefined && picturesList[CURRENT_SELECTED_INDEX].photoValid <=0 &&
                        <CustomButton
                            btnText={t("valider")}
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {validatePicture}
                            disable={isValid==false}
                            style={{minWidth:"3vw"}}
                        />
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
                {(props.formMode=="capture")&&
                    <CustomButton
                        btnText={t('ok')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={props.cancelHandler}
                        //disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }

                {(props.formMode=="capture" && countChecked==picturesList.length)&&
                    <CustomButton
                        btnText={t('close')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={closeBatchPhoto}
                        //disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }
            </div>

        </div>
       
    );
 }
 export default BatchPhotoPic;
 