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
           case 'Theme1': return classes.sideContentPosition + ' '+ classes.Theme1_sideContentStyle+' '+classes.Theme1_RightBorder;
           case 'Theme2': return classes.sideContentPosition + ' '+ classes.Theme2_sideContentStyle+' '+classes.Theme2_RightBorder;
           case 'Theme3': return classes.sideContentPosition + ' '+ classes.Theme3_sideContentStyle+' '+classes.Theme3_RightBorder;
           default: return classes.sideContentPosition + ' '+ classes.Theme1_sideContentStyle+' '+classes.Theme1_RightBorder;
       }
   }

 return (
        <div className= {getCurrentTheme()}>
            {/* <div style={{width:'100%', height:'120%', marginTop:'-2.3vh',borderRight:'solid 0.3px white'}}> */}
               
            {/* </div> */}
            {props.children}
         
        </div>
    );
}
export default LeftLayout;