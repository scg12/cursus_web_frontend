import React from 'react';
import classes from './EmploiT.module.css';
import ValeurHeure from './ValeurHeure';
import { useContext, useEffect } from "react";
import UiContext from '../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../translation/i18n';

var TAB_VALEURS_PAUSE=[];
 
function LigneValeur(props) {
  
    const currentUiContext = useContext(UiContext);

     //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    useEffect(()=> {        
        TAB_VALEURS_PAUSE = createValeurPause()        
        console.log('Liste valeur pause',TAB_VALEURS_PAUSE)
    },[]);
    
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


    function computePauseDivSize(dureePauseEnMinutes){
        let minutes = calculDureePause(currentUiContext.intervalleMaxTranche)
        return Math.floor(dureePauseEnMinutes*65/minutes);
        // return Math.floor(dureePauseEnMinutes*60/(currentUiContext.TAB_PERIODES.length))/60;
    }

    function calculDureePause(creneau){
        var tabHeure, tabHeureDeb,tabHeureFin;
        var dureePause=[];
        tabHeure = creneau.split('_');
        tabHeureDeb = tabHeure[0].split('h');
        tabHeureFin = tabHeure[1].split('h');
        // console.log("calculDureePause: ",tabHeureDeb, tabHeureFin);
        tabHeureDeb[0] =Evaluate(tabHeureDeb[0]);
        tabHeureDeb[1] =Evaluate(tabHeureDeb[1]);
        tabHeureFin[0] =Evaluate(tabHeureFin[0]);
        tabHeureFin[1] =Evaluate(tabHeureFin[1]);
        if( tabHeureDeb[0]==tabHeureFin[0]){
            dureePause.push(0);
            dureePause.push(tabHeureFin[1] - tabHeureDeb[1]);
        }else{
            if(tabHeureDeb[1]==tabHeureFin[1]){
                dureePause.push((tabHeureFin[0] -  tabHeureDeb[0]))
                dureePause.push(0); 
            } else{
                dureePause.push(tabHeureFin[0] -  (tabHeureDeb[0]+1));
                dureePause.push((60-tabHeureDeb[1])+tabHeureFin[1]);
            }           

        }
        
        return ((dureePause[0]*60)+ dureePause[1]);
    }

    function Evaluate(val){
        if(val==''||val==' '|| isNaN(val)) return 0;
        else return eval(val);
    
    }

    function createValeurPause(){
        var tabValeurPauses = [];
        var cur_pause=[];
        currentUiContext.TAB_CRENEAU_PAUSE
        .map((pause)=>{cur_pause = pause.split('_');
            tabValeurPauses.push(cur_pause[0]);
            tabValeurPauses.push(cur_pause[1])
        })

        console.log(tabValeurPauses);
        return tabValeurPauses;
    }

    function isValeurPause(valeur){
        if(TAB_VALEURS_PAUSE.findIndex((pause)=>pause==valeur)<0) return false
        else return true; 

    }


   return (
        <div className={classes.ligneValeur}> 
            {currentUiContext.TAB_VALEUR_HORAIRE.map((hour,index) => {
                return (
                    index<currentUiContext.TAB_VALEUR_HORAIRE.length&&
                    <div style={{display:'flex',flexDirection:'row', width:computePauseDivSize(calculDureePause(currentUiContext.TAB_VALEUR_HORAIRE[index]+"_"+currentUiContext.TAB_VALEUR_HORAIRE[index+1]))+'vw'}}>
                        {index%2==0&&<div style={{fontSize:isValeurPause(currentUiContext.TAB_VALEUR_HORAIRE[index]) ? '0.7vw':'1vw', fontWeight: '680', marginLeft:'-5px', color:isValeurPause(currentUiContext.TAB_VALEUR_HORAIRE[index]) ? 'red': 'rgb(58 93 161)'}}>{currentUiContext.TAB_VALEUR_HORAIRE[index]}</div>}
                        {index%2==1&&<div style={{fontSize:isValeurPause(currentUiContext.TAB_VALEUR_HORAIRE[index]) ? '0.7vw':'1vw', fontWeight: '680', marginLeft:'5px',  color:isValeurPause(currentUiContext.TAB_VALEUR_HORAIRE[index]) ? 'red': 'rgb(58 93 161)'}}>{currentUiContext.TAB_VALEUR_HORAIRE[index]}</div>}
                    </div>
                        // <ValeurHeure id={hour} heure={hour}/>
                );
            })}

            {/*<ValeurHeure> 6h </ValeurHeure>
            <ValeurHeure> 7h </ValeurHeure>
            <ValeurHeure> 8h </ValeurHeure>
            <ValeurHeure> 9h </ValeurHeure>
            <ValeurHeure> 10h </ValeurHeure>
            <ValeurHeure> 11h </ValeurHeure>
            <ValeurHeure> 12h </ValeurHeure>
            <ValeurHeure> 13h </ValeurHeure>
            <ValeurHeure> 14h </ValeurHeure>
            <ValeurHeure> 15h </ValeurHeure>
            <ValeurHeure> 16h </ValeurHeure>
            <ValeurHeure> 17h </ValeurHeure>
            <ValeurHeure> 18h </ValeurHeure>
            */}

        </div>
    );
}

export default LigneValeur;