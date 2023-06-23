import React from 'react';
import { useContext } from "react";
import UiContext from '../../../store/UiContext';

import classes from './CsLayout.module.css';


function TopLayout(props) {
    
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.headNavPosition + ' ' + classes.Theme1_headerStyle;
            case 'Theme2': return classes.headNavPosition + ' ' + classes.Theme2_headerStyle;
            case 'Theme3': return classes.headNavPosition + ' ' + classes.Theme3_headerStyle;
            default: return classes.headNavPosition + ' ' + classes.Theme1_headerStyle;
        }
    }
  
    return (
        <div className= {getCurrentTheme()}>
            {props.children}
        </div>
    );

}
export default TopLayout; 