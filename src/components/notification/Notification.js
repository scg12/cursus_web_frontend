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
    
    useEffect(()=> {
       document.getElementById("notif"+props.msg.id).innerHTML= props.msg.Description;
    },[]);

    function getNotifBackgrd()
    {  // Choix du theme courant
       switch(props.msg.type){
            case 'info'   : { return classes.infoBg    +' '+ classes.notifContainerStyle;
                // switch(selectedTheme){
                //     case 'Theme1': return classes.infoBg    +' '+ classes.notifContainerStyle;
                //     case 'Theme2': return classes.infoBg    +' '+ classes.notifContainerStyle;
                //     case 'Theme3': return classes.infoBg    +' '+ classes.notifContainerStyle;
                //     default: return classes.infoBg    +' '+ classes.notifContainerStyle;
                // }
            }
            case 'release': return classes.releaseBg +' '+ classes.notifContainerStyle;
            case 'urgent' : return classes.urgentBg  +' '+ classes.notifContainerStyle;
            default       : return classes.infoBg    +' '+ classes.notifContainerStyle;
        }
    }

    function createDomOfSting(HtmlstringToDomize) {
        var doc = new DOMParser().parseFromString(HtmlstringToDomize, "text/xml");
        return doc
    }
 

    // function closeNotif(){

    // }
   
    /************************************ JSX Code ************************************/

    return (
            
        <div id={"notifMsg"+props.msg.id} className={'card '+ getNotifBackgrd()} style={isMobile?{left:'35%',...props.mobNotifStyle}:props.notifStyle}>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", width:"100%", marginBottom:"1vh"}} >
                <div className={classes.notifTitle}>
                    {props.msg.libelle}
                </div>

                <div className={classes.closeNotif}  style={{alignSelf:"flex-end", marginTop:"-2.7vh", fontSize:"2.3vh", fontWeight:"bold", marginRight:"1vw", cursor:"pointer"}} onClick={props.closeNotif}>
                    {"x"}
                </div>                
            </div> 

            <div id={"notif"+props.msg.id}   className={classes.notifDescription}>                           
                {/* {props.msg.Description}  */}
            </div>
                
            
            {(props.msg.hasAction) &&
                <div style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", width:"97%"}}>           
                    <CustomButton
                        btnText        = {props.msg.btnText}
                        hasIconImg     = {false}
                        buttonStyle    = {props.btnStyle}
                        btnTextStyle   = {props.btnTextStyle}
                        btnClickHandler= {props.btnClickHandler}
                        
                    />
                </div>            
            }    
        </div>
          
    );
}
 
export default Notification;
 