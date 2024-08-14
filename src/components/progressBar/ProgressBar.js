import React from 'react';
import {isMobile} from 'react-device-detect';
import classes from "./ProgressBar.module.css";
import CustomButton from "../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import AppContext from '../../store/AppContext';
import UiContext from "../../store/UiContext";
import BackDrop from '../backDrop/BackDrop';


function ProgressBar(props) {
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme     = currentUiContext.theme;
    
    useEffect(()=> {
      
    },[]);

    /************************************ JSX Code ************************************/

    return (
            
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"auto",...props.barContainerStyle}}>
            {(props.showRate==true && props.ratePosition=="top") &&
                <label style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",...props.rateTextStyle}}>{props.rate}</label>
            }

            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", width:props.pgBarWidth,...props.barStyle}} >
                <div  style={{height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", ...props.rateStyle}}>
                    {(props.showRate==true && props.ratePosition=="inside") &&
                        <label style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",...props.rateTextStyle}}>{props.rate}</label>
                    }
                </div>  
            </div> 

            {(props.showRate==true && props.ratePosition=="bottom") &&
                <label style={props.rateTextStyle}>{props.rate}</label>
            }

        </div>          
    );
}
 
export default ProgressBar;
 