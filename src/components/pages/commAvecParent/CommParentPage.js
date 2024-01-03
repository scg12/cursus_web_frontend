import React from "react";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import classes from './CommParentPage.module.css';
import M_classes from './M_CommParentPage.module.css';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import M from 'materialize-css';
import {isMobile} from 'react-device-detect';

import FormLayout from "../../layout/cs_layout/formLayout/FormLayout";
import NewComIntern from './subPages/NewComIntern';
import ConsultMsg from './subPages/ConsultMsg';
import RelationAvcParents from './subPages/RelationAvcParents';
import StagesAcad from './subPages/StagesAcad';
import OrientationEleves from "./subPages/OrientationEleves";
import EnvoiMsg from './subPages/EnvoiMsg';
import BackDrop from "../../backDrop/BackDrop";
import SynchroData from "./modals/SynchroData";

import { useState,useContext } from "react";
import UiContext from '../../../store/UiContext'
import AppContext from "../../../store/AppContext";

/*import Enregistrement from "./subPages/Enregistrement";
import ListeDesEleves from "./subPages/ListeDesEleves";
import CarteScolaire from "./subPages/CarteScolaire";
import ChangementClasse from "./subPages/ChangementClasse";
import AdmissionClasseSup from "./subPages/AdmissionClasseSup";
import ProgressBar from 'react-bootstrap/ProgressBar';*/



function CommParentPage() {
      
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
  
  //Cette constante sera lu lors de la configuration de l'utilisateur.
  const selectedTheme = currentUiContext.theme;
  const [curentMenuItemPId,setMenuItemPId]=useState(0);
  
  function showSideMenu(e) {
    const itemId = e.currentTarget.id
    setMenuItemPId(itemId);
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
  }
  
  
  function quitForm(){
    setModalOpen(0);
    currentUiContext.setIsParentMsgBox(true);
  }

  function showSynchroModal(){
    setModalOpen(1);
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
        {(modalOpen!=0)   && <BackDrop style={{height:'120vh'}}/>}
        {(modalOpen == 1) && <SynchroData cancelHandler={quitForm} />}
      

        <div className= {(isMobile) ? M_classes.pageTitle : classes.pageTitle}>
          {(isMobile) ? null : <img src="images/Communications.png"  className={classes.imageMargin1} alt="my image"/>}
          <div className={(isMobile)? M_classes.titleHmself : classes.titleHmself}>
            {t("comm_with_parentsM")}
          </div>
        </div>

        <div className= {getCurrentContaintTheme()}>
          {(currentAppContext.enableProfiles["COMM_PARENT_A"]=='1') ? 
            <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("comm_interne")} theme={selectedTheme}>
              {(currentAppContext.enableProfiles["COMM_PARENT_A1"]=='1') ? <MenuItemP menuItemId ='400'  imgSource='images/NewComInterne.png'      libelle={t("comm_interne")} itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1P : classes.customimgStyle1} ></MenuItemP> : null}
              {(currentAppContext.enableProfiles["COMM_PARENT_A2"]=='1') ? <MenuItemP menuItemId ='401'  imgSource='images/ConsulterMsg.png'       libelle={t("consult_mesg")} itemSelected={showSideMenu}    customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1 : classes.customimgStyle1P}></MenuItemP> : null}
            </MenuItemListP>
            :
            null
          }

          {(currentAppContext.enableProfiles["COMM_PARENT_B"]=='1') ? 
            <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("comm_externe")}  theme={selectedTheme}>
              {(currentAppContext.enableProfiles["COMM_PARENT_B1"]=='1') ? <MenuItemP menuItemId ='402'  imgSource='images/RelationAvcParent.png'          libelle={t("Relation_parent")} itemSelected={showSideMenu}></MenuItemP> : null}
              {(currentAppContext.enableProfiles["COMM_PARENT_B1"]=='1') ? <MenuItemP menuItemId ='405'  imgSource='images/synchro.png'                    libelle={t("synchro_data")} isModal={true} itemSelected={showSynchroModal} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle7}> </MenuItemP> : null}
              {(currentAppContext.enableProfiles["COMM_PARENT_B3"]=='1') ? <MenuItemP menuItemId ='403'  imgSource='images/Orientation.png'                libelle={t("suivi_orientation")} itemSelected={showSideMenu}></MenuItemP> :null}
              {(currentAppContext.enableProfiles["COMM_PARENT_B4"]=='1') ? <MenuItemP menuItemId ='404'  imgSource='images/SmsP.png'                       libelle={t("envoi_msg")} itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle4}></MenuItemP> : null }
            </MenuItemListP>
            :
            null
          }
        </div>
            
      <div id="side-menu" class="sidenav side-menu">
      <FormLayout formCode={curentMenuItemPId}>
          {curentMenuItemPId==400 && <NewComIntern/>   } 
          {curentMenuItemPId==401 && <ConsultMsg/>     }
          
          {curentMenuItemPId==402 && <RelationAvcParents/>  }
          {curentMenuItemPId==403 && <OrientationEleves/>   } 
          {curentMenuItemPId==404 && <EnvoiMsg/>            }
          {curentMenuItemPId==405 && <SynchroData/>            }
         
        </FormLayout>     
         
      </div>
    </div>
  );
}
export default CommParentPage