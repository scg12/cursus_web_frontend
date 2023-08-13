import React from 'react';
import classes from './EmploiT.module.css';
import { useContext, useState } from "react";
import UiContext from '../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../translation/i18n';

import MatiereDiv from './matiereDiv/MatiereDiv';



function LigneMatieres(props) {
  
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
        <div style={{display:'flex', flexDirection:'row'}}>
            <div className={classes.matiereTitle} style={{marginLeft:'-2.7vw'}}>{t('matieres')}</div>
            <div id='matieres' className={classes.listeMatieres + ' matieres'}>
                {currentUiContext.matiereSousEtab.map((matiere) => {
                    return (
                        <MatiereDiv id={"matiere_"+matiere.id}
                            title = '' 
                            dragDivClassName  = {null} 
                            matiereTitleStyle = {null} 
                            dropDivClassName  = {null}
                        />
                    );
                })} 
                  
            </div>       

        </div>
        
    );
}

export default LigneMatieres;