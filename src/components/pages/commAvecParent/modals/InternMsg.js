import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import {isMobile} from 'react-device-detect';
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {getTodayDate, changeDateIntoMMJJAAAA} from '../../../../store/SharedData/UtilFonctions';

var CURRENT_COMM;
var CURRENT_QUALITE;
var msgTitle      = "";
var msgDesciption = "";
var msgJour  = "";
var msgMois  = "";
var msgAnnee = "";
var listReceipient = "";


var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;

function InternMsg(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const [msgType, setMsgType] = useState("info") //1- info, 2- release, 3- urgent
    const [optDestinataire, setOpDestinataire] = useState([]);
   

    useEffect(()=> {
        setOpDestinataire(tabDestinataires);
        CURRENT_QUALITE = 0
        getListPersonnel(currentAppContext.currentEtab,CURRENT_QUALITE);
        currentUiContext.setIsParentMsgBox(false);
    },[]);

    var tabDestinataires =[
        {value:0, label:i18n.language=='fr'? "Tous" : "All"},
        {value:1, label:i18n.language=='fr'? "Enseignants" : "Teachers"},
        {value:2, label:i18n.language=='fr'? "Administration" : "Administration"}
    ]

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

    const  getListPersonnel=(sousEtabId, qualiteId)=>{
        listReceipient = "";
        axiosInstance.post(`list-personnel/`, {
            id_sousetab: sousEtabId,
        }).then((res)=>{
            console.log(res.data);

            switch(parseInt(qualiteId)){
                case 0: {listReceipient = formatListEns(res.data.enseignants)+'_'+formatListEns(res.data.adminstaffs); return;}
                case 1: {listReceipient = formatListEns(res.data.enseignants); return;}
                case 2: {listReceipient = formatListEns(res.data.adminstaffs); return;}
            }
            
            // if(qualiteId == 1){
            //     listReceipient = formatListEns(res.data.enseignants)
            // } else {
            //     if(qualiteId == 2){            
            //         listReceipient = formatListEns(res.data.adminstaffs)
            //     } else {
            //         listReceipient = formatListEns(res.data.enseignants)+'_'+formatListEns(res.data.adminstaffs);
            //     }
            // }
        })  
    }


    const formatListEns=(list) =>{
        var receipient = ""
       
        list.map((elt, index)=>{
            if(index < list.length-1){
                receipient = receipient + elt.id + '_';
            } else {
                receipient = receipient + elt.id;
            }
            
        })
        console.log("receipient",receipient);
        return receipient;
    }

    function saveMsg(){
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
        CURRENT_COMM.id_sousetab         = currentAppContext.currentEtab;
        CURRENT_COMM.sujet               = msgTitle;
        CURRENT_COMM.message             = msgDesciption;
        CURRENT_COMM.date                = getTodayDate(); 
        CURRENT_COMM.emetteur            = currentAppContext.idUser;
        CURRENT_COMM.date_debut_validite = getTodayDate();
        CURRENT_COMM.date_fin_validite   = msgJour+'/'+msgMois+'/'+msgAnnee;
        CURRENT_COMM.id_destinataires    = listReceipient;
        CURRENT_COMM.msgType             = msgType;
    }


    function formDataCheck1(){
        var errorMsg='';
       
        if(CURRENT_COMM.sujet.length == 0) {
            errorMsg=t("enter_msg_subject");
            return errorMsg;
        } 

        if(CURRENT_COMM.message.length == 0) {
            errorMsg=t("enter_correct_msg");
            return errorMsg;
        } 

        if(!((isNaN(changeDateIntoMMJJAAAA(CURRENT_COMM.date_fin_validite)) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(CURRENT_COMM.date_fin_validite))))))){
            errorMsg=t("enter_good_validity_date");
            return errorMsg;
        }

        //Test de posteriorite a la date d'aujourd'hui
        if(new Date(changeDateIntoMMJJAAAA(CURRENT_COMM.date_fin_validite)+' 23:59:59') < new Date()) {
            errorMsg = t("validity_date_lower_than_today_error");
            return errorMsg;
        }
       
        return errorMsg;
    }

    function recepientChangeHandler(e){
        CURRENT_QUALITE = e.target.value;
        console.log("qualite",CURRENT_QUALITE);
        getListPersonnel(currentAppContext.currentEtab,CURRENT_QUALITE);
    }

    function getMsgTitle(e){
        msgTitle = e.target.value;
    }

    function getValiditeJour(e){
        msgJour = e.target.value;
    }

    function getValiditeMois(e){
        msgMois = e.target.value;
    }
    
    function getValiditeAnnee(e){
        msgAnnee = e.target.value;
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

            <div style={{display:"flex", flexDirection:"column", justifyContent:"flex-start", position:"absolute", top:"11.7vh", left:"5vw"}}>
                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"1vh", marginLeft:"-3vw", height:'3.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("destinataire")}:
                    </div>

                    
                        
                    <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-start", marginLeft:"-5.7vw", width:"13vw"}}> 
                        <select id='selectRecepient' onChange={recepientChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2.3vw', height:'1.87vw',width:'23vw'}}>
                            {(optDestinataire||[]).map((option)=> {
                                return(
                                    <option  style={{textAlign:"left"}}  value={option.value}>{option.label}</option>
                                );
                            })}
                        </select>                              
                    </div>
                </div>

                

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"1vh", marginLeft:"-3vw", height:'3.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg_type")}:
                    </div>

                    <div style={{display:"flex", flexDirection:"row", marginLeft:"-8vw"}}>
                        <div style={{display:"flex", flexDirection:"row"}}>
                            <input type="radio"  name="msg_type" checked={msgType=="info"} onClick={()=>{setMsgType("info")}}/>
                            <div style={{marginLeft:"0.7vw", marginTop:"0.5vh"}}>{t('info')}</div>
                        </div>

                        <div style={{display:"flex", flexDirection:"row", marginLeft:"3vw"}}>
                            <input type="radio"  name="msg_type" checked={msgType=="release"}  onClick={()=>{setMsgType("release")}}/>
                            <div style={{marginLeft:"0.7vw", marginTop:"0.5vh"}}>{t('release')}</div>
                        </div>

                        <div style={{display:"flex", flexDirection:"row", marginLeft:"3vw"}}>
                            <input type="radio"  name="msg_type" checked={msgType=="urgent"}  onClick={()=>{setMsgType("urgent")}}/>
                            <div style={{marginLeft:"0.7vw", marginTop:"0.5vh"}}>{t('urgent')}</div>
                        </div>

                    </div>

                </div>

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"1vh", marginLeft:"-3vw", height:'2.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg_object")}:
                    </div>
                        
                    <div> 
                        <input id="msgObject" type="text" onChange = {getMsgTitle}  className={classes.inputRowControl}  defaultValue={props.currentPpLabel} style={{marginLeft:'-8.3vw', height:'1.3rem', width:'20vw', fontSize:'1.13vw', color:'#898585'}}/>
                        <input id="destinataireId"    type="hidden"  defaultValue={props.currentPpId}/>
                    </div>
                </div>

                <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", marginTop:"2vh", marginLeft:"-3vw", height:'2.7vh'}}> 
                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                        {t("msg")}:
                    </div>                        
                    
                </div> 

                <div style={{marginLeft:"-3vw", marginTop:"0.9vh"}}> 
                    {/* <textarea style={{width:"40vw",height:"auto", minHeight:"33vh"}}/> */}
                    <CKEditor
                        id ="editor1"
                        editor  = {ClassicEditor}
                        data    = ""
                        style   = {{with:"40vw", height:"17vh"}}
                        onReady = {editor => {
                            console.log("Editor is ready to use", editor)
                        }}

                        //onChange={(event,editor) => {msgDesciption = editor.getData().replace(/(<([^>]+)>)/ig, '')}}
                        onChange={(event,editor) => {msgDesciption = editor.getData();}}                    
                    />
                </div>

            </div>

            <div style={{ display:"flex", flexDirection:"row", justifyContent:"flex-start", position:"absolute",  bottom:"6.3vh", left:"1.7vw", height:'4.7vh', color:"#084481"}}> 
                <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                    {t("msg_deadline")}:
                </div>
                    
                <div style ={{display:'flex', flexDirection:'row', marginTop:"-1vh", marginLeft:"-0.8vw"}}> 
                    <input id="jour"  type="text"  onChange={getValiditeJour}  Placeholder=' jj'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw',  height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'-2vw'}} /> <div style={{marginTop:"1vh"}}>/</div>
                    <input id="mois"  type="text"  onChange={getValiditeMois}  Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}            maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw',  textAlign:"center", height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  /><div style={{marginTop:"1vh"}}>/</div>
                    <input id="anne"  type="text"  onChange={getValiditeAnnee}  Placeholder='aaaa' onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("lieu_naissance"))}}  maxLength={4}   className={classes.inputRowControl }  style={{width:'2.7vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', marginLeft:'0vw'}}  />
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
                    btnText={t('send')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveMsg}
                    // disable={(isDownload) ? !isDownload :!fileSelected}
                />
                
            </div>

        </div>
       
    );
 }
 export default InternMsg;
 