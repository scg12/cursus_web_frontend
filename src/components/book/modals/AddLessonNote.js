import React from 'react';
import classes1 from "../Book.module.css";
import classes2 from "../../pages/scolarite/subPages/SubPages.module.css";
import CustomButton from "../../customButton/CustomButton"
import { useContext, useState, useEffect } from "react";
import AppContext from '../../../store/AppContext';
import UiContext from "../../../store/UiContext";
import { useTranslation } from "react-i18next";


var cur_note=''
function AddLessonNote(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes2.Theme1_formHeader+ ' ' + classes1.formHeader;
            case 'Theme2': return classes2.Theme2_formHeader + ' ' + classes1.formHeader;
            case 'Theme3': return classes2.Theme3_formHeader + ' ' +classes1.formHeader;
            default: return classes2.Theme1_formHeader + ' ' +classes1.formHeader;
        }
    }

    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes1.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes1.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes1.Theme3_BtnstyleSmall ;
        default: return classes1.Theme1_BtnstyleSmall ;
      }
    }
 

    function addLessonNote(){
        //Recuperation de la note saisie
         props.addNote(cur_note);
    }
   
    /************************************ JSX Code ************************************/

    return (
            
        <div className={'card '+ classes1.noteContainer}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes1.noteImageContainer}>
                    <img alt='logoCursus' className={classes1.formHeaderImg} src='images/cursusLogo_Mob.png'/>
                </div>
                <div className={classes1.formMainTitle} >
                    {(props.isDevoir) ? t("add_homework_M") :  t("add_summary_M") }
                </div>              
            </div>

            <div className={classes1.noteContent}>           
                <div className={classes1.inputRowSimple+' '+classes1.container}>
                    <div style={{fontSize:"0.9vw", fontWeight:"800"}}>{(props.isDevoir)? t("homework") : t("summary")}:</div>
                    <div className={classes1.inputRowLeft+' '+classes1.textStyle}>
                        <textarea id="noteZone"  rows={100} type="text" style={{fontSize:"0.87rem", height:'4.7rem',marginLeft:'0.7vw', marginRight:'0.7vw', width:"19.3vw", borderRadius:3}} onChange={(e)=>{cur_note = e.target.value}}/>
                    </div>
                    
                </div>        
            </div>                
           

            <div className={classes1.formButtonRow}> 

                <CustomButton
                    btnText={t("cancel")} 
                    buttonStyle={getSmallButtonStyle()}
                    style={{width:'3.7vw', marginTop:'0.7vw' }}
                    btnTextStyle = {classes1.btnSmallTextStyle}
                    btnClickHandler={props.cancelHandler}
                />   
                
                <CustomButton
                    btnText={t("ok")} 
                    buttonStyle={getSmallButtonStyle()}
                    style={{width:'3.7vw', marginLeft:'2vw', marginTop:'0.7vw'}}
                    btnTextStyle = {classes1.btnSmallTextStyle}
                    btnClickHandler={addLessonNote}
                />   

                
            </div>                
             
        </div>
          
    );
}
 
export default AddLessonNote;
 