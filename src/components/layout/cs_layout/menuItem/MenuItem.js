import React from 'react';
import classes from './MenuItem.module.css';
import M_classes from './M_MenuItem.module.css';
import { useContext } from "react";
import UiContext from '../../../../store/UiContext';
import {isMobile} from 'react-device-detect';

function MenuItem(props) {
    
    const currentUiContext = useContext(UiContext);
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;

    function getCurrentTheme(){
       // Choix du theme courant      
        if(isMobile) {
            switch(selectedTheme){
                case 'Theme1': return M_classes.Theme1_menuItem ;
                case 'Theme2': return M_classes.Theme2_menuItem ;
                case 'Theme3': return M_classes.Theme3_menuItem ;
                default: return M_classes.Theme1_menuItem ;
            }
        } else {
            switch(selectedTheme){
                case 'Theme1': return classes.Theme1_menuItem ;
                case 'Theme2': return classes.Theme2_menuItem ;
                case 'Theme3': return classes.Theme3_menuItem ;
                default: return classes.Theme1_menuItem ;
            }
        }        
    }

    function getCurrentThemeSimple(){
        // Choix du theme courant
        if(isMobile) {
            switch(selectedTheme){
                case 'Theme1': return M_classes.Theme1_menuItemSimple ;
                case 'Theme2': return M_classes.Theme2_menuItemSimple ;
                case 'Theme3': return M_classes.Theme3_menuItemSimple ;
                default: return M_classes.Theme1_menuItemSimple ;
            }
        } else {
            switch(selectedTheme){
                case 'Theme1': return classes.Theme1_menuItemSimple ;
                case 'Theme2': return classes.Theme2_menuItemSimple ;
                case 'Theme3': return classes.Theme3_menuItemSimple ;
                default: return classes.Theme1_menuItemSimple ;
            }
        }     
    }


    return(
        <div id = {props.menuItemId} className={(props.isSimple) ? getCurrentThemeSimple() : getCurrentTheme()  + ' sidenav-trigger'} data-target='side-menu' onClick={props.itemSelected}>
            <img src={props.imgSource} className={(props.withCustomImage) ? props.imageStyle : (isMobile) ? M_classes.imgStyle: classes.imgStyle}>{props.iconImg}</img>
            <span className={classes.menuLibelle} >{props.libelle}</span>
            {props.children}
        </div>

    );


}
export default MenuItem;