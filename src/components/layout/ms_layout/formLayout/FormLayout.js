import React from 'react';
import classes from './FormLayout.module.css';
import {Link} from 'react-router-dom';

import { useTranslation } from "react-i18next";
import '../../../../translation/i18n'

import { useState,useContext } from "react";
import UiContext from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import {initFeaturesCode,initAppFeatureTable} from '../../Features/FeaturesCode';
import FeaturesCode from '../../Features/FeaturesCode';




var userProfile = ''
var profileAuthorisationString = ''

function FormLayout(props){

    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
  
    //const [selectedValue, setSelectedValue] =useState();
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
   

    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };




    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_loginHeader+ ' ' + classes.Theme1_header;
            case 'Theme2': return classes.Theme2_loginHeader + ' ' + classes.Theme2_header;
            case 'Theme3': return classes.Theme3_loginHeader + ' ' +classes.Theme3_header;
            default: return classes.Theme1_loginHeader + ' ' +classes.Theme1_header;
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


    function getFormMainContentStyle(){
        switch(props.formCode){
            case '1':  return  classes.mainContentSimple;
            default:   return   classes.mainContent;
        }
        
    }
     

    function getFormTitle(){

        switch(props.formCode){
            //----SCOLARITE ----
            case '1':  return    'Enregistrement et Gestion des Effectifs';
            case '2':  return    'Consultation Des Listes';
            case '3':  return    'Changement De Classe';
            case '4':  return    'Generation de Cartes Scolaire';
            case '5':  return    'Conseil De Classe';
            case '6':  return    'Admission En Classe Superieure';
            case '7':  return    'Emplois De Temps';
            case '8':  return    'Fiche De Progression';
            case '9':  return    'Programme En Vigueur des Classes';
            case '10': return    'Cahier De Texte';
            case '11':  return   'Controle de la Presence';
            case '12':  return   'Conseil De Discipline';
            case '13':  return   'Profile Academique';
            case '14':  return   "Billet d'entree";
            case '15':  return   'Billet de Sortie';
            case '16':  return   'Nouvelle Evaluation';
            case '17':  return   'Saisie Des Notes Aux Evaluations';
            case '18':  return   'Generation Bulletin de Notes';
            case '19':  return   'Consultation Bulletin de Notes';
            case '20':  return   'Examen Officiels';
            case '21':  return   'Saisie Des Notes Aux Examens Officiels';
            case '22':  return   'Resultats Aux Examens Officiels';

            //----FINANCES ----
            case '23':  return   'Frais De Scolarité';
            case '24':  return   'Etats Des Paiments Des Frais de Scolarité';
            case '25':  return   'Nouvelle Entrée De Fonds';
            case '26':  return   'Nouvelle Sortie De Fonds';
            case '27':  return   'Recapitulatif Des Entrées de Fonds';
            case '28':  return   'Recapitulatif Des Sorties De Fonds';
            case '29':  return   'Budget Previsionnel';
            case '30':  return   'Montant Total perÇu';

            //----STATS ----
            case '31':  return  'Taux De Réussite aux Examens';
            case '32':  return  'Evolution Des Effectifs';
            case '33':  return  'Evolution Du Niveau académique';
            case '34':  return  'Taux De Couverture Des Programmes';
            case '35':  return  'EVolution Du Budget';
            case '36':  return  "Evolution de l'Interaction Avec les Parents D'Elèves";
            case '37':  return  'Taux de Ralisation Des Investissements';

            //----IMPRESSIONS ----
            case '38':  return  "Impression De La Liste Des Elèves Par Classe";
            case '39':  return  'Impression Carte Scolaire';
            case '40':  return  'Impression Bulletin De Notes';
            case '41':  return  'Impression Certificat De Scolarité';
            case '42':  return  'Impression Emploi De Temps';
            case '43':  return  'Réimpression Procès Verbal Réussite a un examen';
            case '44':  return  "Impression D'une Communication En Interne";
           
            //----COMMUNICATION ----
            case '45':  return  'Nouveau Communiqué Interne';
            case '46':  return  'Consultation Des Messages';
            case '47':  return  "Relation Avec Les Parents D'Elèves";
            case '48':  return  'Stages Académiques';
            case '49':  return  'Orientation Et suivi Des Elèves';
            case '50':  return  'Envoi De Message';

            //----EXTRAS ----

            //----CONFIG ----

            default:   return   'Enregistrement Des Eleves';
        }

    }
     
    function getFeatureLogo() {

        switch(props.formCode){
            //----SCOLARITE ----
            case '1': return  'images/AddStudent.png';
            case '2': return  'images/ListStudent.png'  ;
            case '3': return  'images/ChangemtClass.png';
            case '4': return  'images/PrintSchoolCard.png';
            case '5': return  'images/ConseilClasse.png';
            case '6': return  'images/ClassSup.png';
            case '7': return  'images/Schedule.png';
            case '8': return  'images/FicheProgession.png';
            case '9': return  'images/ProgramClasse.png';
            case '10': return 'images/CahierTexte.png';
            case '11': return 'images/Appel.png';
            case '12': return 'images/ConseilDiscipline.png';
            case '13': return 'images/Studentprofile.png';
            case '14': return 'images/BilletEntree.png';
            case '15': return 'images/BilletSortie.png';
            case '16': return 'images/NewEvaluation.png';
            case '17': return 'images/SaveNotes.png';
            case '18': return 'images/PrintStudentReport.png';
            case '19': return 'images/LookStudentReport.png';
            case '20': return 'images/NewEvaluation.png';
            case '21': return 'images/SaveNotes.png';
            case '22': return 'images/ListAdmis.png';

            //----FINANCES ----
            case '23':  return  'images/SchoolFees.png';
            case '24':  return  'images/ListeEntrees.png';
            case '25':  return  'images/SortieFonds.png';
            case '26':  return  'images/FicheProgession.png';
            case '27':  return  'images/ListeEntrees.png';
            case '28':  return  'images/ListeSorties.png';
            case '29':  return  'images/EvolutionBudget.png';
            case '30':  return  'images/EtatPaiement.png';

            //----STATS ----
            case '31':  return  'images/EvolutionReussite.png';
            case '32':  return  'images/EvolutionEffectifs.png';
            case '33':  return  'images/EvolutionNiveauAcad.png';
            case '34':  return  'images/TauxCouvProg.png';
            case '35':  return  'images/EvolutionBudget.png';
            case '36':  return  'images/TauxInteractionPrt.png';
            case '37':  return  'images/TauxInvestissement.png';
          
            //----IMPRESSIONS ----
            case '38':  return  'images/ListStudent.png';
            case '39':  return  'images/PrintSchoolCard.png';
            case '40':  return  'images/PrintStudentReport.png';
            case '41':  return  'images/ChangemtClass.png';
            case '42':  return  'images/Schedule.png';
            case '43':  return  'images/ConseilClasse.png';
            case '44':  return  'images/CommInterne.png';

            //----COMMUNICATION ----
            case '45':  return  'images/NewComInterne.png';
            case '46':  return  'images/ConsulterMsg.png';
            case '47':  return  'images/RelationAvcParent.png';
            case '48':  return  'images/StageAcad.png';
            case '49':  return  'images/Orientation.png';
            case '50':  return  'images/Sms.png';

           
            //----EXTRAS ----
            
            //----CONFIG ---

            default: return 'images/NewStudent.png';
        }

    }

    return (                  
        <div className= {classes.formContainer}>
            <div className= {getCurrentHeaderTheme()}>
                <img src={getFeatureLogo()} className={classes.etabLogo}  alt="my image"/>   
                <div className={classes.formTitle}>{getFormTitle()}</div>
            </div>

            
            <div className= {getFormMainContentStyle()}>
                {props.children}

                <div className={classes.creatorZone}>
                    <div className={classes.creatorName}>
                        BOGEDEV
                    </div>
                </div>              
               
            </div>
               
                            
            <div className={getCurrentFooterTheme()}> 
                <div className={classes.copyRight}>
                    <h7> © Copyright 2022 </h7>
                </div>
                
                <div className={classes.cursusLogoStyle}> 
                    <img src='images/cursusLogo.png'  alt='AppLogo' className= {classes.cursusLogoStyle}></img>
                </div>
            </div>
                    
        </div>
    );         
   
};
export default FormLayout;