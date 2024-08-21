import React from 'react';
import { Divider } from 'react-materialize';
import classes from './FooterContent.module.css';
import { useContext } from "react";
import UiContext from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';

import { useTranslation } from "react-i18next";
import '../../../../translation/i18n'


 
function FooterContent(props) {
  
    const currentUiContext  = useContext(UiContext);
    const currentAppContext = useContext(AppContext);

     //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    
    function getCurrentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
        }
    }

    function getCurrentFooterTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
        }
    }

    function getAppBottomLogo(version){
        switch(version){
            case 'starter': return "images/starterBottomTr.png" ;
            case 'admin'  : return "images/adminBottomTr.png" ;
            case 'online' : return "images/onlineBottomTr.png" ;
            default: return "images/starterBottomTr.png" ;
        }
    }



   return (
       
        <div className={getCurrentFooterTheme()}> 
            <div className={classes.copyRight}>
                    <h7> © Copyright 2022 </h7>
                </div>
                
                <div className={classes.LogoStyle}> 
                    <img src={()=>getAppBottomLogo(currentAppContext.appVersion)} /*'images/bottomLogo.png'*/  alt='AppLogo' className= {classes.logoStyle}></img>
                </div>
        </div>
    );
}

export default FooterContent;