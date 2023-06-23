import React from 'react';
import { useContext } from "react";
import UiContext from '../../../store/UiContext';

import classes from './CsLayout.module.css';


function MainContentLayout(props) {
    
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.mainDisplayPosition + ' '+ classes.Theme1_mainContentStyle;
            case 'Theme2': return classes.mainDisplayPosition + ' '+ classes.Theme2_mainContentStyle;
            case 'Theme3': return classes.mainDisplayPosition + ' '+ classes.Theme3_mainContentStyle;
            default: return classes.mainContentPosition + ' '+ classes.Theme1_mainContentStyle;
        }
    }
  
    return (
        <div className= {getCurrentTheme()}>
            {props.children}
        </div>
    );

}
export default MainContentLayout; 