import classes from './EmploiT.module.css';
import Ligne from './Ligne';
import LigneDebut from './LigneDebut';
import LigneFin from './LigneFin';
import LigneValeur from './LigneValeur';

import { useContext } from "react";
import UiContext from '../../store/UiContext';

import { useTranslation } from "react-i18next";
import '../../../translation/i18n';



 
function Grille(props) {
  
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
        <div className={classes.grille}> 
            <LigneValeur/>
            <LigneDebut id='0'     jour='Lundi'       CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
            <Ligne      id='1'     jour='Mardi'       CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
            <Ligne      id='2'     jour='Mercredi'    CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
            <Ligne      id='3'     jour='Jeudi'       CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
            <Ligne      id='4'     jour='Vendredi'    CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
            <LigneFin   id='5'     jour='Samedi'      CurrentMatiereList = {props.CurrentMatiereList} /*dayMatiereList={props.ListeLundi}*//>
        </div>
       
    );
}

export default Grille;