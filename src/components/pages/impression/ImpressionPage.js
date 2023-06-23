import React from "react";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import classes from './ImpressionPage.module.css';
import M_classes from './M_ImpressionPage.module.css';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import M from 'materialize-css';
import {isMobile} from 'react-device-detect';

import FormLayout from "../../layout/cs_layout/formLayout/FormLayout";
import ListEleves from './subPages/ListEleves';
import CarteScolaire from './subPages/CarteScolaire';
import BulletinNotes from './subPages/BulletinNotes';
import CertificatScolarite from './subPages/CertificatScolarite';
import EmploiTemps from './subPages/EmploiTemps';
import PvExamen from './subPages/PvExamen';
import InfoInterne from './subPages/InfoInterne';

import { useState,useContext } from "react";
import UiContext from '../../../store/UiContext';
import AppContext from "../../../store/AppContext";

/*import Enregistrement from "./subPages/Enregistrement";
import ListeDesEleves from "./subPages/ListeDesEleves";
import CarteScolaire from "./subPages/CarteScolaire";
import ChangementClasse from "./subPages/ChangementClasse";
import AdmissionClasseSup from "./subPages/AdmissionClasseSup";
import ProgressBar from 'react-bootstrap/ProgressBar';*/



function ImpressionPage() {
      
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);
  
  //Cette constante sera lu lors de la configuration de l'utilisateur.
  const selectedTheme = currentUiContext.theme;
  const [curentMenuItemPId,setMenuItemPId]=useState(0);
  
  function showSideMenu(e) {
    const itemId = e.currentTarget.id
    setMenuItemPId(itemId);
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
  }
  
  
  function getCurrentContaintTheme()
  { // Choix du theme courant

    if(isMobile){
      switch(selectedTheme){
        case 'Theme1': return M_classes.Theme1_mainContentPosition ;
        case 'Theme2': return M_classes.Theme2_mainContentPosition ;
        case 'Theme3': return M_classes.Theme3_mainContentPosition ;
        default: return M_classes.Theme1_mainContentPosition ;
      }

    } else {
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_mainContentPosition ;
        case 'Theme2': return classes.Theme2_mainContentPosition ;
        case 'Theme3': return classes.Theme3_mainContentPosition ;
        default: return classes.Theme1_mainContentPosition ;
      }

    }
    
  }
  
  return ( 
    <div className= {classes.viewContent}>
      <div className= {(isMobile)? M_classes.pageTitle : classes.pageTitle}>
        <div className={(isMobile)? M_classes.rowDisplay : classes.rowDisplay}>
        {(isMobile) ? null: <img src="images/printing1.png"  className={classes.imageMargin1} alt="my image"/>}
          {t("impressionsM")}
        </div>
      </div>

      <div className= {getCurrentContaintTheme()}>
        {(currentAppContext.enableProfiles["IMPRESSIONS_A"]=='1') ? 
          <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle= {t("impressions_frequentes")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["IMPRESSIONS_A1"]=='1') ? <MenuItemP menuItemId ='38'  imgSource='images/ListStudent.png'              libelle={t("list_eleves")}                       itemSelected={showSideMenu} ></MenuItemP> : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A2"]=='1') ? <MenuItemP menuItemId ='39'  imgSource='images/PrintSchoolCard.png'          libelle={t("carte_scolaire")}                                     itemSelected={showSideMenu}></MenuItemP>  : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A3"]=='1') ? <MenuItemP menuItemId ='40'  imgSource='images/PrintStudentReport.png'       libelle={t("imp_bulletins_notes")}                                  itemSelected={showSideMenu}></MenuItemP>  : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A4"]=='1') ? <MenuItemP menuItemId ='41'  imgSource='images/ChangemtClass.png'            libelle={t("certificat_scolarite")}                             itemSelected={showSideMenu}></MenuItemP>  : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A5"]=='1') ? <MenuItemP menuItemId ='42'  imgSource='images/Schedule.png'                 libelle={t("schedule")}                                     itemSelected={showSideMenu}></MenuItemP>  : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A6"]=='1') ? <MenuItemP menuItemId ='43'  imgSource='images/ConseilClasse.png'            libelle={t("pv_reussites")}     itemSelected={showSideMenu}></MenuItemP>  : null}
            {(currentAppContext.enableProfiles["IMPRESSIONS_A7"]=='1') ? <MenuItemP menuItemId ='44'  imgSource='images/CommInterne.png'              libelle={t("anoucement")}                         itemSelected={showSideMenu}></MenuItemP>  : null}
          </MenuItemListP>
          :
          null
        }
      </div>
            
      <div id="side-menu" class="sidenav side-menu">
        <FormLayout formCode={curentMenuItemPId}>
            {curentMenuItemPId==38 && <ListEleves/>            } 
            {curentMenuItemPId==39 && <CarteScolaire/>         }
            {curentMenuItemPId==40 && <BulletinNotes/>         }
            {curentMenuItemPId==41 && <CertificatScolarite/>   }
            {curentMenuItemPId==42 && <EmploiTemps/>           } 
            {curentMenuItemPId==43 && <PvExamen/>              }
            {curentMenuItemPId==44 && <InfoInterne/>           }
           
            {/*curentMenuItemPId==8 && <EmploiDeTemps/>    */  }
          </FormLayout>
          {/*curentMenuItemPId==1 ? <Enregistrement/> : null}
          {curentMenuItemPId==2 ? <ListeDesEleves/> : null}
          {curentMenuItemPId==3 ? <CarteScolaire/> : null}
          {curentMenuItemPId==4 ? <ChangementClasse/> : null}
          {curentMenuItemPId==5 ? <AdmissionClasseSup/> : null*/}
      </div>
    </div>
  );
}

export default ImpressionPage