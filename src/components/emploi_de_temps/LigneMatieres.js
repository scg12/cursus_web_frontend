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
           
              {/* <MatiereDiv 
                id='matiere_1'
                title = '' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            
            <MatiereDiv 
                id='matiere_2'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_3'
                title=' ' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_4'
                title=' ' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_5'
                title=' ' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_6'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_7'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}            
            />
            <MatiereDiv 
                id='matiere_8'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_9'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_10'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_11'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_12'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_13'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_14'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_15'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_16'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_17'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_18'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_19'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_20'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_21'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_22'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_23'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_24'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
            />
            <MatiereDiv 
                id='matiere_25'
                title='' 
                dragDivClassName  = {null} 
                matiereTitleStyle = {null} 
                dropDivClassName  = {null}
        />     */}     
        </div>       
    );
}

export default LigneMatieres;