import React from 'react';
import classes from './EmploiT.module.css';
import Jour from './Jour';
import DroppableDiv from '../droppableDiv/DroppableDiv';
import { useContext } from "react";
import UiContext from '../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../translation/i18n';


 
function Ligne(props) {
  
    const currentUiContext = useContext(UiContext);

     //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    
    function getCurrentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
        }
    }

    function getCurrentFooterTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
        }
    }

   return (
        <div id={props.id} className={classes.ligne}> 
            <Jour>{props.jour} </Jour>

            <DroppableDiv 
                id={props.id + '_'+'6h-'+'7h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            
            <DroppableDiv
                id={props.id + '_'+'7h-'+'8h'} 
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'8h-'+'9h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'9h-'+'10h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'10h-'+'11h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            <DroppableDiv 
                id={props.id + '_'+'11h-'+'12h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'12h-'+'13h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'13h-'+'14h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'14h-'+'15h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            
            <DroppableDiv 
                id={props.id + '_'+'15h-'+'16h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'16h-'+'17h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            <DroppableDiv 
                id={props.id + '_'+'17h-'+'18h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'18h-'+'19h'}
                acceptType='matiere'
                CurrentMatiereList = {props.CurrentMatiereList}
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            
            {/*<DroppableDiv 
                id={props.id + '_'+'19h'+'20h'}
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                id={props.id + '_'+'20h'+'21h'}
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv
                id={props.id + '_'+'21h'+'22h'} 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                //dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            
            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />

            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />
            <DroppableDiv 
                acceptType='matiere'
                //listOfDroppedItems={props.dayMatiereList}
                dropHandler = {props.dropMatiereHandler}
                className={classes.droppableDivstyle}
            />*/}

            
       </div>
    );
}

export default Ligne;