import React from 'react';
import {isMobile} from 'react-device-detect';
import classes from "./MsgBox.module.css";
import CustomButton from "../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import AppContext from '../../store/AppContext';
import UiContext from "../../store/UiContext";
import BackDrop from '../backDrop/BackDrop';


function MsgBox(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
    

    function getCurrentHeaderTheme()
    {  // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
        }
           
    }
 
   
    /************************************ JSX Code ************************************/

    return (
            
        <div className={'card '+ classes.msgBoxContainer} style={isMobile?{left:'35%',...props.containerStyle}:props.containerStyle}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.msgBoxImageContainer}>
                    <img alt='logoCursus' className={classes.formHeaderImg} src='images/cursusLogo_Mob.png'/>
                </div>
                <div className={classes.formMainTitle} >
                    {props.msgTitle}
                </div>              
            </div>

            <div className={classes.msgBoxContent}>
                
                {(props.msgType == 'info') ?                
                    <img alt='msgInfo'            className = {(props.customImg) ? props.imgStyle : classes.msgIcoImg} src='images/msgBoxIcon/info_trans.png'/>
                : (props.msgType == 'question') ?
                    <img alt='msgQuestion'        className = {(props.customImg) ? props.imgStyle : classes.msgIcoImg} src='images/msgBoxIcon/question_trans.png'/>
                : (props.msgType == 'warning') ?
                    <img alt='msgWarning'         className = {(props.customImg) ? props.imgStyle : classes.msgIcoImg} src='images/msgBoxIcon/warning1_trans.png'/>
                : (props.msgType == 'danger') ?
                    <img alt='msgDanger'          className = {(props.customImg) ? props.imgStyle : classes.msgIcoImg} src='images/msgBoxIcon/danger_trans.png'/>
                : null
                }
                {props.isCustomMessage?
                    <div className={(props.customStyle) ? props.contentStyle : classes.msgContainer}>                   
                        {props.messageLines.map((elt)=>{
                            return(<div style={props.tabligneStyle}> {elt}</div>)
                        })}                  
                    </div>                    
                    :
                    <div className={(props.customStyle) ? props.contentStyle : classes.msgContainer}>                   
                        {props.message}                  
                    </div>
                    
                }
               
            </div>
                
            
            {(props.msgType == 'info') ?     
                <div className={classes.formButtonRow}>           
                    <CustomButton
                        btnText={props.buttonAcceptText}
                        hasIconImg={false}
                        buttonStyle={classes.buttonStyle}
                        btnTextStyle = {classes.btnEtapeTextStyle}
                        btnClickHandler={props.buttonAcceptHandler}
                        //disable={etape1InActiv}
                    />
                </div>
            : (props.msgType == 'question') ?

                <div className={classes.formButtonRow}>  
                    <CustomButton
                        btnText={props.buttonAcceptText}
                        hasIconImg={false}
                        buttonStyle={classes.buttonStyle}
                        btnTextStyle = {classes.btnEtapeTextStyle}
                        btnClickHandler={props.buttonAcceptHandler}
                        //disable={etape1InActiv}
                    /> 

                    <CustomButton
                        btnText={props.buttonRejectText}
                        hasIconImg={false}
                        buttonStyle={classes.buttonStyle}
                        btnTextStyle = {classes.btnEtapeTextStyle}
                        btnClickHandler={props.buttonRejectHandler}
                        //disable={etape1InActiv}
                    />                    
                </div>
                
            : (props.msgType == 'warning') ?

                <div className={classes.formButtonRow}>           
                    <CustomButton
                        btnText={props.buttonAcceptText}
                        hasIconImg={false}
                        buttonStyle={classes.buttonStyle}
                        btnTextStyle = {classes.btnEtapeTextStyle}
                        btnClickHandler={props.buttonAcceptHandler}
                        //disable={etape1InActiv}
                    />
                </div>

            : (props.msgType == 'danger') ?

                <div className={classes.formButtonRow}>           
                    <CustomButton
                        btnText={props.buttonAcceptText}
                        hasIconImg={false}
                        buttonStyle={classes.buttonStyle}
                        btnTextStyle = {classes.btnEtapeTextStyle}
                        btnClickHandler={props.buttonAcceptHandler}
                        //disable={etape1InActiv}
                    />
                </div>
            : null
            }    
        </div>
          
    );
}
 
export default MsgBox;
 