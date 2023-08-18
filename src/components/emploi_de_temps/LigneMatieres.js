import React from 'react';
import classes from './EmploiT.module.css';
import { useContext, useEffect, useState } from "react";
import UiContext from '../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../translation/i18n';

import MatiereDiv from './matiereDiv/MatiereDiv';
var CURRENT_MATIERE_LIST =[];
var tabMatiere;
var MATIERE_DATA = {};


function LigneMatieres(props) {
  
    const currentUiContext = useContext(UiContext);

     //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    useEffect(()=> {

        for (var i = 0; i < props.listeMatieres.length; i++) {
            tabMatiere = props.listeMatieres[i].split('*');
            MATIERE_DATA = {};
            MATIERE_DATA.idMatiere = 'matiere_' + tabMatiere[1];
            MATIERE_DATA.libelleMatiere = tabMatiere[0];
            MATIERE_DATA.codeMatiere = tabMatiere[1];
            MATIERE_DATA.colorCode = tabMatiere[2];
            
            CURRENT_MATIERE_LIST[i] = MATIERE_DATA;
          
        }
       
        console.log('matieres',CURRENT_MATIERE_LIST);
        currentUiContext.setCURRENT_MATIERE_LIST(CURRENT_MATIERE_LIST);

    },[currentUiContext.CURRENT_MATIERE_LIST]);

  
    
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
        <div style={{display:'flex', flexDirection:'row'}}>
            <div className={classes.matiereTitle} style={{marginLeft:'-2.7vw'}}>{t('matieres')}</div>
            <div id='matieres' className={classes.listeMatieres + ' matieres'}>
                {(props.listeMatieres||[]).map((matiere) => {
                    return (
                        <MatiereDiv id={"matiere_"+matiere.split('*')[1]}
                            title = {matiere.split('*')[0]}
                            dragDivClassName  = {classes.matiereStyle} 
                            matiereTitleStyle = {classes.matiereTitleStyle} 
                            dropDivClassName  = {null}
                            style={{backgroundColor:matiere.split('*')[2]}}
                           
                        >
                            {matiere.split('*')[0]} 
                        </MatiereDiv>
                    );
                })} 
                  
            </div>       

        </div>
        
    );
}

export default LigneMatieres;