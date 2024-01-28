import React from 'react';
import {isMobile} from 'react-device-detect';
import classes from "./Notification.module.css";
import CustomButton from "../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import AppContext from '../../store/AppContext';
import UiContext from "../../store/UiContext";
import BackDrop from '../backDrop/BackDrop';


function Notification(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme     = currentUiContext.theme;
    

    function getNotifBackgrd()
    {  // Choix du theme courant
       switch(props.msg.type){
            case 'info'   : return classes.infoBg    +' '+ classes.notifContainerStyle;
            case 'release': return classes.releaseBg +' '+ classes.notifContainerStyle;
            case 'urgent' : return classes.urgentBg  +' '+ classes.notifContainerStyle;
            default       : return classes.infoBg    +' '+ classes.notifContainerStyle;
        }
    }
 

    // function closeNotif(){

    // }
   
    /************************************ JSX Code ************************************/

    return (
            
        <div className={'card '+ getNotifBackgrd()} style={isMobile?{left:'35%',...props.mobNotifStyle}:props.notifStyle}>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", width:"100%", marginBottom:"1vh"}} >
                <div  style={{alignSelf:"center", fontSize:"2.3vh", fontWeight:"bold"}}>
                    {props.msg.title}
                </div>

                <div className={classes.closeNotif}  style={{alignSelf:"flex-end", marginTop:"-2.7vh", fontSize:"2.3vh", fontWeight:"bold", marginRight:"1vw", cursor:"pointer"}} onClick={props.closeNotif}>
                    {"x"}
                </div>                
            </div> 

            <div style={{display:"flex", marginLeft:"1.3vw", flexDirection:"column", fontSize:"0.97vw",  justifyContent:"center",}}>                           
                {props.msg.message}                  
            </div>
                
            
            {(props.msg.hasAction) &&
                <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", width:"97%"}}>           
                    <CustomButton
                        btnText        = {props.msg.btnText}
                        hasIconImg     = {false}
                        buttonStyle    = {props.msg.btnStyle}
                        btnTextStyle   = {props.msg.btnTextStyle}
                        btnClickHandler= {props.msg.btnClickHandler}
                        style          = {props.msg.btnStyle}
                    />
                </div>            
            }    
        </div>
          
    );
}
 
export default Notification;
 