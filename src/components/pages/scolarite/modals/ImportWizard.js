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
import ProgressBar from '../../../progressBar/ProgressBar';
import MsgBox from '../../../msgBox/MsgBox';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import * as XLSX_IMPORT from 'xlsx';
import {convertDateToUsualDate, getTodayDate, darkGrey, ajouteZeroAuCasOu, convertDateToAAAAMMjj} from '../../../../store/SharedData/UtilFonctions';


var cur_fileToUpload   = undefined;
var cur_fileToDownLoad = undefined
var cur_classeId       = undefined;
var cur_coursId        = undefined;
var cur_coursLabel     = undefined
var selected_file_name ='';
var filename           = '';
var import_feedBack    = [];
var DATA_SIZE          = 0;


var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;
const BARWIDTH       =27;


const SERVER_ADDRESS = 'http://192.168.43.99';

function ImportWizard(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext                      = useContext(UiContext);
    const currentAppContext                     = useContext(AppContext)
    const selectedTheme                         = currentUiContext.theme;
    const [feedback, setFeedback]               = useState([]);     
    const [percent, setPercent]                 = useState(0);
    const [showFeedBack, setShowFeedBack]       = useState(false);
    const [countImported, setCountImported]     = useState(0);
   
    useEffect(()=> {
        DATA_SIZE =  props.ImportedData.length;
        import_feedBack = [];
        checkAndInsertData();       
    },[]);


    function checkAndInsertData(){
        var importError   = '';
        var pourcentage   = 0;
        var countImported = 0;
        var imported_data = [...props.ImportedData];
        console.log('data_impported', imported_data[0])
      
        
        props.ImportedData.map((data, index)=>{
            setTimeout(function() {
                // pourcentage = pourcentage + 1;
                // setPercent(pourcentage);
             
                importError = props.dataCheckFunction(data,index+1);
                if(importError.length == 0){  
                    console.log("pas d'erreur")             
                    props.insertFunction(data);   
                    countImported++;    
                } else {
                    import_feedBack.push(importError);
                    console.log("erreur!!!",importError,import_feedBack);
                    importError = "";
                }

                pourcentage = pourcentage + 1;
                setPercent(pourcentage);   
                setCountImported(countImported);     
            },80*index);

        });

       // props.updateGridFct();
           
        setFeedback(import_feedBack); setCountImported(countImported);
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
    function showImportFeedBack(){
        if(showFeedBack) setShowFeedBack(false);
        else setShowFeedBack(true);
    }    

    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formImpExp} style={{height:(feedback.length==0|| !showFeedBack)? "37vh":(feedback.length <2 && showFeedBack)? "37vh" : (feedback.length >=2 && feedback.length <10 && showFeedBack)? 44+feedback.length*1+"vh":44+feedback.length*2+"vh"}}>
            <div className={getCurrentHeaderTheme()}>
                {props.isImport ?
                    <div className={classes.formImageContainer}>
                        <img alt='add student' className={classes.formHeaderImg1}  src='images/import.png'/>
                    </div>
                    :
                    <div className={classes.formImageContainer}>
                        <img alt='add student' className={classes.formHeaderImg1}  src='images/export.png'/>
                    </div>
                }
               
                <div className={classes.formMainTitleP} >
                    {t("import_wizard")}
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
            
            <div style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", position:"absolute", top:(Math.round((percent*100)/DATA_SIZE)<100) ? "19vh" : "15vh", left:"3vw", height:"auto"}}>
                {(Math.round((percent*100)/DATA_SIZE)<100) &&
                    <div style={{marginTop:"-7vh", marginBottom:"-2vh"}}>
                        <img src="images/import.gif" style={{width:"20vw", height:"9vh", /*transform:"rotate(180deg)"*/}}/>
                    </div>
                }

                <ProgressBar 

                    pgBarWidth    = {BARWIDTH+"vw"}
                    rate          = {Math.round((percent*100)/DATA_SIZE)+'%'}
                    rateTextStyle = {{fontSize:"0.9vw", marginBottom:"-0.53vh", color:"white", textAlign:"center"}}
                    rateStyle     = {{justifyContent:"center", alignItems:"center", width:Math.round((percent*BARWIDTH)/DATA_SIZE)+'vw', /*backgroundColor:"#065386"*/ backgroundColor:"#0f68a4", borderRadius:"1vh",}}
                    showRate      = {true}
                    ratePosition  = {"inside"}

                    barContainerStyle={{
                        marginTop:"2.3vh"
                    }}

                    barStyle={{
                        height           :"3.3vh", 
                        borderRadius     :"1vh", 
                        backgroundColor  :"white",
                        border           :"solid 1px #3b4f78",
                        marginTop        :"0vh"
                    }}

                />
                {(showFeedBack)&& 
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", marginTop:"2vh", width:"100%", height:"auto", fontSize:"0.77vw"}}> 
                        <label style={{color:"green", fontWeight:"bold"}}>{feedback.length==0 ? t("import_succes") : countImported==0? t('no_data_imported') : countImported + " " +t("data_imported")}</label>            
                    </div>
                } 


                {(showFeedBack)&& 
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", marginTop:"0vh", width:"100%", height:"auto", fontSize:"0.77vw"}}> 
                    
                        {feedback.map((fdBck)=>{
                           return(                           
                                <div style={{display:"flex",flexDirection:"row", height:"3vh"}}>
                                    <img src="images/cancel_trans.png" style={{width:"1vw",height:"1.3vw"}}/>
                                    <label style={{color:"black"}}>{fdBck}</label>                         
                                </div>                       
                            )  
                        })}                      
                    </div>
                }

              

            </div>
            
            <div className={classes.formButtonRowP}>
                {(Math.round((percent*100)/DATA_SIZE)>=100) &&
                    <CustomButton
                        btnText         = {showFeedBack?  t('hide_imoprt_report') : t('show_imoprt_report')}
                        buttonStyle     = {getGridButtonStyle()}
                        btnTextStyle    = {classes.btnTextStyle}
                        style           = {{width:"auto", paddingLeft:"0.3vw", paddingRight:"0.3vw"}}
                        btnClickHandler = {showImportFeedBack}
                    />
                }

               
                <CustomButton
                    btnText         = {t('cancel')}
                    buttonStyle     = {getGridButtonStyle()}
                    btnTextStyle    = {classes.btnTextStyle}
                    btnClickHandler = {props.cancelHandler}
                />
                
                
            </div>

        </div>
       
    );
 }
 export default ImportWizard;
 