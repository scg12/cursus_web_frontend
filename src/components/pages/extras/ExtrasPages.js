import React from "react";
import {isMobile} from 'react-device-detect';

import { useTranslation } from "react-i18next";
import classes from './ExtrasPages.module.css';
import M_classes from './M_ExtrasPages.module.css';

import FormLayout from "../../layout/cs_layout/formLayout/FormLayout";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import WebcamCapture from "./subPages/WebcamCapture";
import DistanceLearning from './subPages/DistanceLearning';
import GestBibliotheque from './subPages/GestBibliotheque';
import GestCantine from './subPages/GestCantine';
import GestDortoir from './subPages/GestDortoir';
import GestTransport from './subPages/GestTransport';
import StageAcademic from './subPages/StageAcademic';

import M from 'materialize-css';


import { useState,useContext } from "react";
import UiContext from '../../../store/UiContext'

/*import Enregistrement from "./subPages/Enregistrement";
import ListeDesEleves from "./subPages/ListeDesEleves";
import CarteScolaire from "./subPages/CarteScolaire";
import ChangementClasse from "./subPages/ChangementClasse";
import AdmissionClasseSup from "./subPages/AdmissionClasseSup";
import ProgressBar from 'react-bootstrap/ProgressBar';*/



function ExtrasPages() {
       
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  
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
  {  // Choix du theme courant
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
        <div className = {(isMobile) ? M_classes.pageTitle : classes.pageTitle}>
            {(isMobile) ? null : <img src="images/extraFeature.png"  className={classes.imageMargin1} alt="my image"/>}
          <div className ={(isMobile)? M_classes.titleHmself : classes.titleHmself}>
            {t("extrasM")}
          </div>
        </div>
  
        <div className= {getCurrentContaintTheme()}>
          <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= 'Fonctionnalités supplémentaires liés à la scolarité' theme={selectedTheme}>
            <MenuItemP menuItemId ='500'  imgSource='images/photo4f4.png'         libelle={t('prise_de_photo_par_lot')}     itemSelected={showSideMenu}    customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3 : classes.customimgStyle7P}></MenuItemP>
            <MenuItemP menuItemId ='501'  imgSource='images/StageAcad.png'             libelle={t('gest_stageAcad')}             itemSelected={showSideMenu}    customImg={true} customImgStyle={isMobile ? M_classes.iconStyleP : classes.customimgStyle7} ></MenuItemP>
            <MenuItemP menuItemId ='502'  imgSource='images/distanceLearning.png'      libelle={t('distance_learning')}          itemSelected={showSideMenu}    customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle6}></MenuItemP>
          </MenuItemListP>

          <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle= 'Fonctionnalités supplémentaires liés à la Logistique scolaire' theme={selectedTheme}>
            <MenuItemP menuItemId ='503'  imgSource='images/resto.png'           libelle= {t('gest_cantine')}                    itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle6}></MenuItemP>
            <MenuItemP menuItemId ='504'  imgSource='images/transport2.png'      libelle= {t('gest_transfort')}                  itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle6}></MenuItemP>
            <MenuItemP menuItemId ='505'  imgSource='images/Bibliotheque.png'    libelle= {t('gest_biblio')}                     itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle6}></MenuItemP>
            <MenuItemP menuItemId ='506'  imgSource='images/dortoir.png'         libelle= {t('gest_dortoir')}                    itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle6}></MenuItemP>
          </MenuItemListP>
        
        </div>
              
        <div id="side-menu" class="sidenav side-menu">
          <FormLayout formCode={curentMenuItemPId}>
            {curentMenuItemPId== 500 ? <WebcamCapture/>    : null}
            {curentMenuItemPId== 501 ? <StageAcademic/>    : null}
            {curentMenuItemPId== 502 ? <DistanceLearning/> : null}
            

            {curentMenuItemPId== 503 ? <GestCantine/>       : null}
            {curentMenuItemPId== 504 ? <GestTransport/>     : null}
            {curentMenuItemPId== 505 ? <GestBibliotheque/>  : null}
            {curentMenuItemPId== 506 ? <GestDortoir/>       : null}
          </FormLayout>
        </div>
      </div>
    );
}
export default ExtrasPages;