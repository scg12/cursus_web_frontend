import React from 'react';
import classes from './MenuItemList.module.css';
import M_classes from './M_MenuItemList.module.css';
import { useContext } from "react";
import UiContext from '../../../../store/UiContext';
import {isMobile} from 'react-device-detect';

function MenuItemListP(props){
    
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = props.theme;

    function getCurrentTheme()
    { 
       // Choix du theme courant
       if(isMobile) {               
        switch(selectedTheme){
                
            case 'Theme1': return M_classes.Theme1_menuItenList ;
            case 'Theme2': return M_classes.Theme2_menuItenList ;
            case 'Theme3': return M_classes.Theme3_menuItenList ;
            default: return M_classes.Theme1_menuItenList ;
        }
        } else {
                
            switch(selectedTheme){
                
                case 'Theme1': return classes.Theme1_menuItenList ;
                case 'Theme2': return classes.Theme2_menuItenList ;
                case 'Theme3': return classes.Theme3_menuItenList ;
                default: return classes.Theme1_menuItenList ;
            }
        }
       
    }
    

    function getCurrentItemHeadTheme()
    {  // Choix du theme courant
       if(isMobile) {
            switch(selectedTheme){
                case 'Theme1': return M_classes.Theme1_menuHeader ;
                case 'Theme2': return M_classes.Theme2_menuHeader ;
                case 'Theme3': return M_classes.Theme3_menuHeader ;
                default: return M_classes.Theme1_menuHeader ;
            }
       } else {
            switch(selectedTheme){
                case 'Theme1': return classes.Theme1_menuHeader ;
                case 'Theme2': return classes.Theme2_menuHeader ;
                case 'Theme3': return classes.Theme3_menuHeader ;
                default: return classes.Theme1_menuHeader ;
            }
        }      
    }

    function getItemsRowDisplay()
    {  // Choix du theme courant
       if(isMobile) {
        return M_classes.itemRow ;
        } else {
        return classes.itemRow ;
        }      
    }


    if(isMobile) {
        return (
            <div className={getCurrentTheme()+ ' ' + props.minWtdhStyle}>
                <div className= {getCurrentItemHeadTheme()+ ' ' + props.minWtdhStyle}>
                    <span> {props.iconImg} </span>
                    <span> {props.libelle} </span>
                </div>
                {props.children}
                {/*<div className={getItemsRowDisplay()}>
                    {props.children}
                </div>*/}  
            </div>
        ) 
        } else {
        return (            
            <div className={getCurrentTheme()+ ' ' + props.minWtdhStyle}>
                <div className= {getCurrentItemHeadTheme()+ ' ' + props.minWtdhStyle}>
                    <span> {props.iconImg} </span>
                    <span> {props.libelle} </span>
                </div>
                <div className={getItemsRowDisplay()}>
                    {props.children}
                </div>            
            </div>
            
        );
    }
}
export default MenuItemListP;