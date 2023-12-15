import React from 'react';
import axiosInstance from '../../../../axios';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

var login;
var CURRENT_ANNEE_SCOLAIRE;
var ARE_ALMEETIN_DONE;
var tabPendingMeeting;
function ConfigCloturerAnnee(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [areAllMeetingDone,setAreAllMeetingDone] = useState(true);
    const { t, i18n } = useTranslation();
    const [isValid, setIsValid] = useState(false);
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
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

    function getNonCloseYearMeeting() {
        axiosInstance.post(`get-non-close-year-meeting/`, {
            id_sousetab: currentAppContext.currentEtab,
        }).then((res)=>{
            tabPendingMeeting = []
            setAreAllMeetingDone(tabPendingMeeting.length > 0) ;
               
        }) 

    }    


    function closeSchoolYear(){

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


            
            <div className={classes.buttonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    btnText={t('close_year')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {closeSchoolYear}
                    disable = {(areAllMeetingDone==false)}

                />                
            </div>

            

        </div>
       
     );
 }
 
 export default ConfigCloturerAnnee;