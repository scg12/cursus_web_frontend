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
import {initFeaturesCode,initAppFeatureTable} from '../../../Features/FeaturesCode';
import FeaturesCode from '../../../Features/FeaturesCode';




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
            case '100':  return   t('enreg_student');
            case '101':  return   t('consult_list_M');
            case '102':  return   t('school_certificate_M');
            case '103':  return   t('generate_card_M');
            case '104':  return   t('conseils_classses');
            case '105':  return   t('next_class_admission');

            case '106':  return   t('schedules');
            case '107':  return   t("consult_schedule_M");
            case '109':  return   t('FP_management');
            case '110':  return   t('class_programs');
            case '111':  return   t('lesson_book');
           
            case '112':  return   t('student_check');
            case '113':  return   t('look_students_presence_M');
            case '114':  return   t('conseil_discipline');
            case '115':  return   t('acad_profile');
            case '116':  return   t("exit_entry_ticket");
            case '117':  return   t('exit_ticket');

            
            case '120':  return   t('saisie_note_eval_M');
            case '121':  return   t('look_note_eval_M');
            case '122':  return   t('Gen_bulletin_M');
            case '123':  return   t('print_bulletin_M');
            
            case '124':  return   t('examen_officiels');
            case '125':  return   t('Saisie Des Notes Aux Examens Officiels');
            case '126':  return   t('official_exams_results');
            

            //----FINANCES ----
            case '200':  return   'Frais De Scolarité';
            case '201':  return   'Etats Des Paiments Des Frais de Scolarité';

            case '202':  return   'Nouvelle Entrée De Fonds';
            case '203':  return   'Nouvelle Sortie De Fonds';
            case '204':  return   'Recapitulatif Des Entrées de Fonds';
            case '205':  return   'Recapitulatif Des Sorties De Fonds';

            case '206':  return   'Budget Previsionnel';
            case '207':  return   'Montant Total perÇu';

            //----STATS ----
            case '300':  return  t('evolution_effectifs');
            case '301':  return  t('taux_reussite');
            case '302':  return  t('evolution_niv_acad');
            case '303':  return  t('couverture_programs');
            case '304':  return  t('couv_prog_cours');
            case '305':  return  t("stat_absences");
            case '306':  return  t('paiement_profs');
            case '307':  return  t('travail_scolaire');
            case '308':  return  t("evolution_budget");
            case '309':  return  t('evolution_comParents');
            case '310':  return  t('taux_realisation_invest');
           
            //----COMMUNICATION ----
            case '400':  return  'Nouveau Communiqué Interne';
            case '401':  return  'Consultation Des Messages';

            case '402':  return  "Relation Avec Les Parents D'Elèves";
            case '403':  return  'Orientation Et suivi Des Elèves';
            case '404':  return  'Envoi De Message';
            case '405':  return  t('synchro_data')

            //----EXTRAS ----
            case '501':  return  t('gest_stageAcad');
            case '502':  return  t('distance_learning');
            case '503':  return  t('gest_cantine');
            case '504':  return  t('gest_transfort');
            case '505':  return  t('gest_biblio');
            case '506':  return  t('gest_dortoir');

            //----CONFIG ----

            default:   return   'Enregistrement Des Eleves';
        }

    }
     
    function getFeatureLogo() {

        switch(props.formCode){
            //----SCOLARITE ----
            case '100':   return  'images/AddStudent.png';
            case '101':   return  'images/ListStudent.png'  ;
            case '102':   return  'images/certificateP.png';
            case '103':   return  'images/PrintSchoolCard.png';
            case '104':   return  'images/ConseilClasse.png';
            case '105':   return  'images/ClassSup.png';

            case '106':   return  'images/Schedule.png';
            case '107':   return  'images/lookSchedule.png';
            case '109':   return  'images/FicheProgession.png';
            case '110':   return  'images/ProgramClasse.png';
            case '111':  return   'images/CahierTexte.png';

            case '112':  return  'images/Appel.png';
            case '113':  return  'images/lookPresence.png';
            case '114':  return  'images/ConseilDiscipline.png';
            case '115':  return  'images/Studentprofile.png';
            case '116':  return  'images/BilletEntreeSortie.png';
            case '117':  return  'images/BilletSortie.png';

            case '120':  return  'images/SaveNotesP.png';
            case '121':  return  'images/LookNotes.png';
            case '122':  return  'images/genBulletinsP.png';
            case '123':  return  'images/printReport.png';
            
            case '124':  return  'images/NewEvaluation.png';
            case '125':  return  'images/saisiExam.png';
            case '126':  return  'images/ListAdmis.png';
            
            //----FINANCES ----
            case '200':  return  'images/SchoolFees.png';
            case '201':  return  'images/ListeEntrees.png';

            case '202':  return  'images/EntreeFonds.png';
            case '203':  return  'images/SortieFonds.png';
            case '204':  return  'images/ListeEntrees.png';
            case '205':  return  'images/ListeSorties.png';

            case '206':  return  'images/EvolutionBudget.png';
            case '207':  return  'images/EtatPaiement.png';

            //----STATS ----
            case '300':  return  'images/EvolutionEffectifs.png';
            case '301':  return  'images/EvolutionReussite.png';
            case '302':  return  'images/EvolutionNiveauAcad.png';
            case '303':  return  'images/TauxCouvProg.png';
            case '304':  return  'images/statCouverture.png';
            case '305':  return  'images/statPresence.png';
            case '306':  return  'images/statPaieProfs.png';
            case '307':  return  'images/statTravail.png';
            case '308':  return  'images/EvolutionBudget.png';
            case '309':  return  'images/TauxInteractionPrt.png';
            case '310':  return  'images/statTravail.png';
          
            //----COMMUNICATION ----
            case '400':  return  'images/NewComInterne.png';
            case '401':  return  'images/ConsulterMsg.png';

            case '402':  return  'images/RelationAvcParent.png';
            case '403':  return  'images/Orientation.png';
            case '404':  return  'images/SmsP.png';
            case '405':  return  t('images/synchro.png')

           
            //----EXTRAS ----
            case '500':  return  'images/ChangemtClass.png';
            case '501':  return  'images/StageAcad.png';
            case '502':  return  'images/distanceLearning.png';

            case '503':  return  'images/resto.png';
            case '504':  return  'images/transport2.png';
            case '505':  return  'images/Bibliotheque.png';
            case '506':  return  'images/dortoir.png';
            
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
                    <img src='images/cursusLogo_Mob.png'  alt='AppLogo' className= {classes.cursusLogoStyle}></img>
                </div>
            </div>
                    
        </div>
    );         
   
};
export default FormLayout;