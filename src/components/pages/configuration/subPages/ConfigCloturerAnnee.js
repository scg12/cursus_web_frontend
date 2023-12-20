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
var tabPendingMeeting = [];



var chosenMsgBox;
const MSG_SUCCESS_CLOSE  = 1;
const MSG_WARNING_CLOSE  = 2;
const MSG_CONFIRM_CLOSE  = 3;




function ConfigCloturerAnnee(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [areAllMeetingDone,setAreAllMeetingDone] = useState(true);
    const [tabPendingClass, setTabPendingClass] = useState([]);
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
        // tabPendingMeeting = ['6ieme','Tlec'];
        // setTabPendingClass(tabPendingMeeting);
        // setAreAllMeetingDone(tabPendingMeeting.length <= 0) ;

        /*---------Voici le vrai code---------*/
        axiosInstance.post(`get-non-close-year-meeting/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            tabPendingMeeting = res.data.classes;
            setTabPendingClass(tabPendingMeeting);
            setAreAllMeetingDone(tabPendingMeeting.length <= 0) ;               
        })
    }    

   
    function closeSchoolYearHandler(){
        chosenMsgBox = MSG_CONFIRM_CLOSE;
        currentUiContext.setYearToClose(0);
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("confirm_year_closure_M"), 
            message:t("confirm_year_closure")
        });
    }
 
/************************************ JSX CODE ************************************/

    return (
        <div className={classes.formStyle}>          
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

            {!areAllMeetingDone &&
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                        {t("classes_with_annual_meeting_not_done")} 
                    </div> 
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", fontWeight:"bold", color:"#131f4c"}}> 
                        {tabPendingClass.map((cls)=>{   
                                                  
                            return <div>:{cls}</div>                               
                        })}
                    </div>
                </div>
            }


            
            <div className={classes.buttonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    hasIconImg= {true}
                    imgSrc='images/calendarGood2.png'
                    imgStyle = {classes.grdBtnImgStyle}
                    btnText={t('close_year')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {closeSchoolYearHandler}
                    // disable = {(areAllMeetingDone==true && currentUiContext.yearToClose==-1)}
                    disable = {areAllMeetingDone}

                />                
            </div>

            

        </div>
       
     );
 }
 
 export default ConfigCloturerAnnee;