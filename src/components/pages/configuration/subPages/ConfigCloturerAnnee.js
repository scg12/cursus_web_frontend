import React from 'react';
import axiosInstance from '../../../../axios';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

var login;
var CURRENT_ANNEE_SCOLAIRE;
var ARE_ALMEETIN_DONE;
var tabPendingMeeting;


var chosenMsgBox;
const MSG_SUCCESS_CLOSE  = 1;
const MSG_WARNING_CLOSE  = 2;
const MSG_CONFIRM_CLOSE  = 3;




function ConfigCloturerAnnee(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [areAllMeetingDone,setAreAllMeetingDone] = useState(true);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(true);
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        getNonCloseYearMeeting();
        
    },[]);

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnCloseYearstyle ;
        case 'Theme2': return classes.Theme2_BtnCloseYearstyle ;
        case 'Theme3': return classes.Theme3_BtnCloseYearstyle ;
        default: return classes.Theme1_BtnCloseYearstyle ;
      }
    }

/************************************ Handlers ************************************/
    //GE tu vas ecrire la requete qui cherche tous les CC annuels non clotures
    //Voici son corps
    function getNonCloseYearMeeting() {  
        axiosInstance.post(`get-non-close-year-meeting/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            tabPendingMeeting = []
            setAreAllMeetingDone(tabPendingMeeting.length > 0) ;
               
        }) 

    }    

   
    function closeSchoolYearHandler(){
        chosenMsgBox = MSG_CONFIRM_CLOSE;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"question", 
                msgTitle:t("confirm_year_closure_M"), 
                message:t("confirm_year_closure")
            });

    }

    //GE tu vas ecrire la fonction pour cloturer l'annee
   //Voici son corps
    function closeSchoolYear(){
        alert("Mettre le code ici!!!");
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_CLOSE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //setModalOpen(0);  
                return 1;
            }

            case MSG_WARNING_CLOSE:{
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //setModalOpen(0); 
                return 1;
            }

            case MSG_CONFIRM_CLOSE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                closeSchoolYear();
                //setModalOpen(0);  
                return 1;
            }

            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                closeSchoolYear();
            }
        }        
    }

    const rejectHandler=()=>{
        switch(chosenMsgBox){

            case MSG_SUCCESS_CLOSE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                //getClassStudentList(CURRENT_CLASSE_ID); 
                return 1;
            }

           
            case MSG_WARNING_CLOSE: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }

            case MSG_CONFIRM_CLOSE: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                // modifyClassMeeting(CURRENT_MEETING);
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

    
    
    
/************************************ JSX CODE ************************************/

    return (
        <div className={classes.formStyle}>
            {(currentUiContext.msgBox.visible == true && !currentUiContext.isParentMsgBox) &&
                <MsgBox 
                    msgTitle            = {currentUiContext.msgBox.msgTitle} 
                    msgType             = {currentUiContext.msgBox.msgType} 
                    message             = {currentUiContext.msgBox.message} 
                    customImg           = {true}
                    customStyle         = {true}
                    contentStyle        = {classes.msgContent}
                    imgStyle            = {classes.msgBoxImgStyleP}
                    buttonAcceptText    = {(currentUiContext.msgBox.msgType  == "question")? t("yes") : t("ok")}
                    buttonRejectText    = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />               
            }
            <div id='errMsgPlaceHolder'></div>
            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel} style={{width:"auto",justifyContent:"center"}}>
                    {t("year_closure_M")} 
                </div>                  
            </div>
            <div className={classes.inputRow} style={{marginBottom:"2vh", width:"15vw", border:"solid 1px black"}}> 
                         
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("annee_scolaire")} 
                </div>                    
                <div style={{fontWeight:"bold", color:"#131f4c"}}> 
                    :{CURRENT_ANNEE_SCOLAIRE}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("effectifs_total")} 
                </div>                    
                <div style={{fontWeight:"bold", color:"#131f4c"}}> 
                    :{12355}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("taux_de_reussite_general")} 
                </div>                    
                <div style={{fontWeight:"bold", color:"#131f4c"}}> 
                    :{"30%"}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("taux_de_reussite_general_exams")} 
                </div>                    
                <div style={{fontWeight:"bold", color:"#131f4c"}}> 
                    :{"45%"}
                </div>
            </div>

            

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("all_classMeeting_done")} ?
                </div>                    
                <div style={{fontWeight:"bold", color:"#1a68b6"}}> 
                    :{areAllMeetingDone ? t("yes"):t("no")}
                </div>
            </div>


            
            <div className={classes.buttonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    hasIconImg= {true}
                    imgSrc='images/checkImg.png'
                    imgStyle = {classes.grdBtnImgStyle}
                    btnText={t('close_year')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {closeSchoolYearHandler}
                    disable = {(areAllMeetingDone==false)}

                />                
            </div>

            

        </div>
       
     );
 }
 
 export default ConfigCloturerAnnee;