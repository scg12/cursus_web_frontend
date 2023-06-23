import React from 'react';
import classes from './FormPuce.module.css';
import { useContext } from "react";
import UiContext from '../../store/UiContext';
import M from 'materialize-css';

function FormPuce(props) {
    
    const currentUiContext = useContext(UiContext);
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme(){
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_puce ;
            case 'Theme2': return classes.Theme2_puce ;
            case 'Theme3': return classes.Theme3_puce ;
            default: return classes.Theme1_puce ;
        }
    }

    function getCurrentLibelleTheme(){
        // Choix du theme courant
        switch(selectedTheme){
             case 'Theme1': return classes.Theme1_menuLibelle ;
             case 'Theme2': return classes.Theme2_menuLibelle ;
             case 'Theme3': return classes.Theme3_menuLibelle ;
             default: return classes.Theme1_menuLibelle ;
         }
     }



    return(
        <div id = {props.id} className={getCurrentTheme()} style={props.style}>
            <img src={props.imgSource} className={(props.withCustomImage) ? props.imageStyle : classes.imgStyle} style={props.puceImgStyle}/>
            <span className={getCurrentLibelleTheme()} style={props.puceLabelStyle}>{props.libelle}</span>
            {props.children}
        </div>
    );
}
export default FormPuce;