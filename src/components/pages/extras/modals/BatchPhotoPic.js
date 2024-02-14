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
const MSG_SUCCESS_FP = 1;
const MSG_WARNING_FP = 2;
const MSG_ERROR_FP   = 3;
const MultiSelectId  = "MS-4"

var CURRENT_COMM;

var msgTitle               = "";
var msgDesciption          = "";


function BatchPhotoPic(props) {
    const { t, i18n }       = useTranslation();
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme     = currentUiContext.theme;
    const [picturesList, setPictureList] = useState([]);
    const [photoInfo, setPhotoInfo]      = useState({});
    const webcamRef = useRef(null); // create a webcam reference
    const [imgSrc, setImgSrc] = useState(null); // initialize it
    
    
    useEffect(()=> {        
        currentUiContext.setIsParentMsgBox(false);   
        getBatchPhotoInfos(props.batchPhotoId);
    },[]);


   
   
  
      // create a capture function
      const capture = useCallback(() => {
          const imageSrc = webcamRef.current.getScreenshot();
          setImgSrc(imageSrc);
      }, [webcamRef]);

    var tabElevesPhoto =[
        {id:1, nomEleve:"ABENA Luc Basile",    photoPath:"", photoValid:false},
        {id:2, nomEleve:"ABE OWONA Simplice",  photoPath:"", photoValid:false},
        {id:3, nomEleve:"BELIMGA OMGBA Marc",  photoPath:"", photoValid:true},
        {id:4, nomEleve:"TALBA MALA Rodrigue", photoPath:"", photoValid:false}
    ]
    
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
   
   

    function sendMsg(e){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_COMM);
        getFormData();
        console.log('apres:',CURRENT_COMM);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_COMM);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
           props.actionHandler(CURRENT_COMM);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function getFormData(){
        CURRENT_COMM = {};
        CURRENT_COMM.id_sousetab  = currentAppContext.currentEtab;
        CURRENT_COMM.sujet        = msgTitle;
        CURRENT_COMM.message      = msgDesciption;
        CURRENT_COMM.date         = getTodayDate(); 
        CURRENT_COMM.emetteur     = currentAppContext.infoUser.user_name;
       // CURRENT_COMM.id_eleves    = getIdDestinataires(listDestinataires,list_destinataires_ids);
    }

    function getIdDestinataires(destinataires, destinatairesId){
        // var tabDestinataires   = destinataires.split(',');
        // var tabDestinatairesId = destinatairesId.split('_');

        // console.log("destinataires", tabDestinatairesId, tabDestinataires);
        // var ids_destinataires  = "";

        // tabDestinataires.map((elt1, index)=>{
        //     var dest = tabDestinatairesId.find((elt2)=>elt2.split('*')[1] == elt1)

        //     if(index <tabDestinataires.length-1){
        //         ids_destinataires = ids_destinataires + dest.split('*')[0]+'_';
        //     } else {
        //         ids_destinataires = ids_destinataires + dest.split('*')[0];
        //     }

        // });

        // console.log("destinataires", ids_destinataires);
        // return ids_destinataires;
    }


    function formDataCheck1(){
        var errorMsg='';

        if(CURRENT_COMM.id_eleves.length == 0) {
            errorMsg=t("enter_msg_recipient");
            return errorMsg;
        } 
       
        if(CURRENT_COMM.sujet.length == 0) {
            errorMsg=t("enter_msg_subject");
            return errorMsg;
        } 

        if(CURRENT_COMM.message.length == 0) {
            errorMsg=t("enter_correct_msg");
            return errorMsg;
        } 

       
        return errorMsg;
    }

    function getMsgTitle(e){
        msgTitle = e.target.value;
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

    const  getBatchPhotoInfos=(batchPhotoId)=>{
        var listEleves = []
        // axiosInstance.post(`get-batch-photo-list/`, {
        //     batchPhotoId: batchPhotoId,
        // }).then((res)=>{
        //     //console.log(res.data);
        //     //setPictureList(res.data);
            
        // });
        setPictureList(tabElevesPhoto);
    }

    

    function displayElevPhoto(e,photoElv){
        setPhotoInfo(photoElv);
    }


    const takePicture =  useCallback(() => {
       
        console.log("gdgdgd", photoInfo);
        // var tabElvPhoto = [...picturesList]
        // const imageSrc = webcamRef.current.getScreenshot();
       
        // var index = tabElvPhoto.findIndex((elPhoto)=>elPhoto.id = photoInfo.id);
        // tabElevesPhoto[index].id = photoInfo.id;
        // tabElevesPhoto[index].nomEleve = photoInfo.nomEleve;
        // tabElevesPhoto[index].photoPath = imageSrc;
        // tabElevesPhoto[index].photoValid = true;
        // setPictureList(tabElevesPhoto);


        
       // setImgSrc(imageSrc);
    }, [webcamRef]);
       
    

    function validatePicture(e){

    }

    const retake = () => {
        setImgSrc(null);
    };
    
   
    
    /************************************ JSX Code ************************************/

    const LignePhotoEleve=(props)=>{
        return(
            <div class={"lignePhoto"} style={{display:"flex", flexDirection:"row", height:"5.3vh", paddingTop:"0.4vh", marginBottom:"1vh", paddingLeft:"1vh", border:"1px solid gainsboro"}}   onClick={(e)=>{displayElevPhoto(e,props.photoEleve)}}>
               <img id="profile"  src={'images/photo4Fois4P.png'} alt='dossierIcon' style={{width:'1.63vw', height:'1.63vw', marginRight:'1vw',borderRadius:"3px", border:"solid 1px #4a4646",padding:"0.1vh"}}/>
               <div style={{fontSize:'0.9vw',  fontWeight:'bold', width:"100%"}}>{props.photoEleve.nomEleve}</div>
                {props.photoEleve.photoValid && <img src={'images/check.png'} alt='dossierIcon' style={{width:'1.67vw', height:'1.67vw', borderRadius:"0.84vw", marginRight:"1vh", paddingTop:"0.3vh",borderColor:"green"}} />}
            </div>
        );
    }

    return (
        <div className={'card '+ classes.formContainerP4P}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/photo4f4.png'/>
                </div>
                {props.formMode == "consult" ?         
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
                        {picturesList.map((pictureElv)=>{
                            return(
                                <LignePhotoEleve photoEleve={pictureElv}/>
                            ); 
                        })}
                    </div>
                   
                </div>

                <div style={{display:"flex", flexDirection:"column", width:"60vw", justifyContent:"center", alignItems:"center"}}>
                    
                    <div style={{color:"black", fontSize:"0.9vw", fontWeight:"800"}}>
                        {photoInfo.nomEleve}
                    </div>

                    <div style={{width:"15vw", height:"15vw",border:"1px solid black"}}>
                        <Webcam height={80} width={200} screenshotFormat="image/jpeg" ref={webcamRef} />
                        <img src={photoInfo.photoPath}/>
                    </div>

                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-between", width:"13%"}}>
                      

                        <CustomButton
                            btnText={t("filmer")}
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {takePicture}
                        />

                        <CustomButton
                            btnText={t("valider")}
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {validatePicture}
                        />
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
                {!(props.formMode=="consult")&&
                    <CustomButton
                        btnText={t('save')}
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={sendMsg}
                        //disable={(isDownload) ? !isDownload :!fileSelected}
                    />
                }
            </div>

        </div>
       
    );
 }
 export default BatchPhotoPic;
 