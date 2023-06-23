import React from 'react';
import { useContext } from "react";
import UiContext from '../../../store/UiContext';

import classes from './CsLayout.module.css';


function LeftLayout(props) {
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
   const selectedTheme = currentUiContext.theme;


   
   function getCurrentTheme()
   { 
      // Choix du theme courant
      switch(selectedTheme){
           case 'Theme1': return classes.sideContentPosition + ' '+ classes.Theme1_sideContentStyle;
           case 'Theme2': return classes.sideContentPosition + ' '+ classes.Theme2_sideContentStyle;
           case 'Theme3': return classes.sideContentPosition + ' '+ classes.Theme3_sideContentStyle;
           default: return classes.sideContentPosition + ' '+ classes.Theme1_sideContentStyle;
       }
   }

 return (
        <div className= {getCurrentTheme()}>
         {props.children}
        </div>
    );
}
export default LeftLayout;