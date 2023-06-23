import React from 'react';
import classes from './MenuItem.module.css';
import { useContext } from "react";
import UiContext from '../../../../store/UiContext';
import M from 'materialize-css';

function MenuItem(props) {
    
    const currentUiContext = useContext(UiContext);
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme(){
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_menuItem ;
            case 'Theme2': return classes.Theme2_menuItem ;
            case 'Theme3': return classes.Theme3_menuItem ;
            default: return classes.Theme1_menuItem ;
        }
    }

    function getCurrentThemeSimple(){
        // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_menuItemSimple ;
            case 'Theme2': return classes.Theme2_menuItemSimple ;
            case 'Theme3': return classes.Theme3_menuItemSimple ;
            default: return classes.Theme1_menuItemSimple ;
        }

    }


    return(
        <div id = {props.menuItemId} className={(props.isSimple) ? getCurrentThemeSimple() : getCurrentTheme()  + ' sidenav-trigger'} data-target='side-menu' onClick={props.itemSelected}>
            <img src={props.imgSource} className={(props.withCustomImage) ? props.imageStyle : classes.imgStyle}>{props.iconImg}</img>
            <span className={classes.menuLibelle} >{props.libelle}</span>
            {props.children}
        </div>

    );


}
export default MenuItem;