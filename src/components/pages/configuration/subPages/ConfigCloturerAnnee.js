import React from 'react';
import axiosInstance from '../../../../axios';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';


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
    const [areAllMeetingDone,setAreAllMeetingDone]     = useState(false);
    const [isExamSessionClosed,setIsExamSessionClosed] = useState(false);
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
            var conseils_programmes = res.data.programmes
            console.log("programmes, classes sans CC",tabPendingMeeting,res.data.programmes);
            //tabPendingMeeting = ['6ieme','Tlec'];           
            setTabPendingClass(tabPendingMeeting);
            setAreAllMeetingDone(conseils_programmes==1 && tabPendingMeeting.length == 0) ;               
        })
    }    

   
    function closeSchoolYearHandler(){
        chosenMsgBox = MSG_CONFIRM_CLOSE;
        currentUiContext.setYearToClose(0);
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgCode :"CLOSE_YEAR",
            msgTitle:t("confirm_year_closure_M"), 
            message:t("confirm_year_closure")
        });
    }
 
/************************************ JSX CODE ************************************/

    return (
        <div className={classes.formStyle}>    
            <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'1.3vh'}}> 
                {t("conf_close_year")}
            </div>      
            <div id='errMsgPlaceHolder'></div>
            <div className={classes.inputRow}> 
                <div className={classes.inputRowLabel} style={{width:"auto",justifyContent:"center", fontWeight:"bold"}}>
                    {t("year_closure_M")} 
                </div>                  
            </div>
            <div className={classes.inputRow} style={{marginBottom:"2vh", width:"15vw", border:"solid 1px black"}}> 
                         
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("annee_scolaire")} 
                </div> 
                <div style={{fontWeight:"bold", color:"#131f4c"}}> : </div>                   
                <div style={{fontWeight:"bold", color:"#131f4c", marginLeft:"0.37vw"}}> 
                    {CURRENT_ANNEE_SCOLAIRE}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("effectifs_total")} 
                </div>  
                <div style={{fontWeight:"bold", color:"#131f4c"}}> : </div>                  
                <div style={{fontWeight:"bold", color:"#131f4c", marginLeft:"0.37vw"}}> 
                    {12355}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("taux_de_reussite_general")} 
                </div> 
                <div style={{fontWeight:"bold", color:"#131f4c"}}> : </div>                   
                <div style={{fontWeight:"bold", color:"#131f4c", marginLeft:"0.37vw"}}> 
                    {"30%"}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("taux_de_reussite_general_exams")} 
                </div> 
                <div style={{fontWeight:"bold", color:"#131f4c"}}> : </div>                   
                <div style={{fontWeight:"bold", color:"#131f4c",  marginLeft:"0.37vw"}}> 
                    {"45%"}
                </div>
            </div>

            

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("all_classMeeting_done")} ?
                </div>                    
                <div style={{fontWeight:"bold", color:"#1a68b6"}}> 
                <div style={{}}> : </div>
                    { areAllMeetingDone ?
                        <div style={{marginTop:"-3.3vh", marginLeft:"0.7vw"}}> 
                            <img src="images/check_trans.png"   style={{width:"1.3vw", height:"1vw"}}/>
                        </div> 
                    
                        :
                        <div style={{marginTop:"-3.13vh", marginLeft:"0.7vw"}}>
                            <img src="images/delete.png"        style={{width:"1.5vw", height:"1.3vw"}}/>
                        </div>                        
                    }
                </div>
            </div>

            {!areAllMeetingDone  &&
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel} style={{width:"23vw", marginLeft:"1.7vw", fontSize:"0.89vw", marginTop:'-1vh'}}>
                        -  {t("classes_with_annual_meeting_not_done")} 
                    </div> 
                    <div style={{marginTop:"-1vh",marginLeft:"-1.7vw", fontSize:"0.89vw", marginRight:"0.3vw", fontWeight:"bold", color:"#131f4c"}}> : </div>
                    {(tabPendingClass.length > 0) ?
                        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", fontWeight:"bold", color:"#131f4c", marginTop:'-1vh'}}> 
                            {tabPendingClass.map((cls)=>{ 
                                return <div style={{fontSize:"0.89vw"}}>{cls}</div>                               
                            })}
                        </div>
                        :
                        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", fontWeight:"bold", color:"#131f4c", fontSize:"0.89vw", marginTop:'-1vh'}}> 
                            {t("all_classes")}                       
                        </div>
                    }
                </div>
            }

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel} style={{width:"23vw"}}>
                    {t("exam_session_closed")} ?
                </div>                    
                <div style={{fontWeight:"bold", color:"#1a68b6"}}> 
                    <div style={{}}> : </div>
                        { isExamSessionClosed ?
                            <div style={{marginTop:"-3.3vh", marginLeft:"0.7vw"}}> 
                                <img src="images/check_trans.png"   style={{width:"1.3vw", height:"1vw"}}/>
                            </div> 
                    
                            :
                            <div style={{marginTop:"-3.13vh", marginLeft:"0.7vw"}}>
                                <img src="images/delete.png"        style={{width:"1.5vw", height:"1.3vw"}}/>
                            </div>                            
                        }
                    
                    {/* :{isExamSessionClosed ?  
                        <img src="images/check_trans.png"   style={{width:"1.3vw", height:"1vw"}}/>
                            :
                        <img src="images/delete.png"   style={{width:"1.5vw", height:"1.7vw"}}/>
                    } */}
                </div>
               
                            
                           
            </div>

            


            
            <div className={classes.buttonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    hasIconImg= {true}
                    imgSrc='images/calendarGood2.png'
                    imgStyle = {classes.grdBtnImgStyle}
                    btnText={t('close_year')} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {closeSchoolYearHandler}                    
                    disable = {!areAllMeetingDone || !isExamSessionClosed || !currentUiContext.yearToClose<0}

                />                
            </div>

            

        </div>
       
     );
 }
 
 export default ConfigCloturerAnnee;