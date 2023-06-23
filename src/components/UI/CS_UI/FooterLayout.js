import React from 'react';
import classes from './CsLayout.module.css';
import { useContext } from "react";
import UiContext from '../../../store/UiContext';
   

function FooterLayout(props) {
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.footerPosition + ' ' + classes.Theme1_footerStyle;
            case 'Theme2': return classes.footerPosition + ' ' + classes.Theme2_footerStyle;
            case 'Theme3': return classes.footerPosition + ' ' + classes.Theme3_footerStyle ;
            default: return classes.footerPosition + ' ' + classes.Theme1_footerStyle;
        }
    }



    return (
        <div className= {getCurrentTheme()}>
            {props.children}
        </div>
    );
}
export default FooterLayout;