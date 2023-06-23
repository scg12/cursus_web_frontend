import React from 'react';
import classes from './MenuItemList.module.css'
import { useContext } from "react";
import UiContext from '../../../../store/UiContext'

function MenuItemList(props){
    
    const currentUiContext = useContext(UiContext);

    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = props.theme;

    function getCurrentTheme()
    { 
       // Choix du theme courant
       if (props.isGlobalMenu) {
           
            switch(selectedTheme){
                
                case 'Theme1': return classes.Theme1_menuItenListGlobal ;
                case 'Theme2': return classes.Theme2_menuItenListGlobal ;
                case 'Theme3': return classes.Theme3_menuItenListGlobal ;
                default: return classes.Theme1_menuItenListGlobal ;
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
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_menuHeader ;
            case 'Theme2': return classes.Theme2_menuHeader ;
            case 'Theme3': return classes.Theme3_menuHeader ;
            default: return classes.Theme1_menuHeader ;
        }
    }

    return (
        
        <div className={getCurrentTheme()+ ' ' + props.minWtdhStyle}>
            <div className= {getCurrentItemHeadTheme()+ ' ' + props.minWtdhStyle}>
                <span> {props.iconImg} </span>
                <span> {props.libelle} </span>
            </div>
            {props.children}
        </div>
        
    );
}
export default MenuItemList;