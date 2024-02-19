import React from "react";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import UiContext from '../../../store/UiContext';
import AppContext from '../../../store/AppContext';
import classes from './ConfigPage.module.css';
import M_classes from './M_ConfigPage.module.css';
import {isMobile} from 'react-device-detect';
import MenuItemList from "../../layout/cs_layout/menuItemList/MenuItemList";
import MenuItem from "../../layout/cs_layout/menuItem/MenuItem";
import M from 'materialize-css';
import ConfigLogin from "./subPages/ConfigLogin";
import ConfigPswd from "./subPages/ConfigPswd";
import ConfigTheme from "./subPages/ConfigTheme";
import ConfigPhoto from "./subPages/ConfigPhoto";
import ConfigGen from "./subPages/ConfigGen";
import ConfigSection from "./subPages/ConfigSection";
import ConfigCycle from "./subPages/ConfigCycle";
import ConfigNiveau from "./subPages/ConfigNiveau";
import ConfigMatieres from "./subPages/ConfigMatieres";
import ConfigClasses from "./subPages/ConfigClasses";
import ConfigClasseExamen from "./subPages/ConfigClasseExamen";
import ConfigMatieresClasse from "./subPages/ConfigMatieresClasse";
import ConfigDivisionTemps from "./subPages/ConfigDivisionTemps";
import ConfigCours from "./subPages/ConfigCours";
import ConfigGroupe from "./subPages/ConfigGroupe";
import ConfigMatricule from "./subPages/ConfigMatricule";
import ConfigAnnee from "./subPages/ConfigAnnee";
import ConfigHierarchie from "./subPages/ConfigHierarchie";
import ConfigQuotasCursus from "./subPages/ConfigQuotasCursus";
import ConfigPayementEleve from "./subPages/ConfigPayementEleve";
import ConfigPayementDivers from "./subPages/ConfigPayemenetDivers";
import ConfigTypeEnseignant from "./subPages/ConfigTypeEnseignant";
import ConfigTypePayementEns from "./subPages/ConfigTypePayementEns";
import ConfigTypePayementAdminstaff from "./subPages/ConfigTypePayementAdminstaff";
import ConfigTrimestre from "./subPages/ConfigTrimestre";
import ConfigSequence from "./subPages/ConfigSequence";
import ConfigSpecialiteClasse from "./subPages/ConfigSpecialiteClasse";
import ConfigJour from "./subPages/ConfigJour";
import ConfigPause from "./subPages/ConfigPause";
import ConfigTrancheHoraire from "./subPages/ConfigTrancheHoraire";
import ConfigUser from "./subPages/ConfigUser";
import ConfigSpecialiteEns from "./subPages/ConfigSpecialiteEns";
import ConfigActiverUser from "./subPages/ConfigActiverUser";
import ConfigEnseignantSpecialites from "./subPages/ConfigEnseignantSpecialites";
import ConfigAppreciationNote from "./subPages/ConfigAppreciationNote";
import ConfigCausesConvocationCD from "./subPages/ConfigCausesConvocationCD";
import ConfigConditionRedoublementExclusion from "./subPages/ConfigConditionRedoublementExclusion";
import ConfigTypeSanction from "./subPages/ConfigTypeSanction";
import ConfigClassesPassages from "./subPages/ConfigClassesPassages";
import ConfigCloturerAnnee from "./subPages/ConfigCloturerAnnee";






function ConfigPage(props) {
   
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [curentMenuItemId,setMenuItemId]=useState(0);
    

    const [currentActiveMenuID, setCurrentActiveMenuID]  = useState(undefined)
    const [section1SelectedItem,setSection1SelectedItem] = useState(0);
    const [section2SelectedItem,setSection2SelectedItem] = useState(0);
    const [section3SelectedItem,setSection3SelectedItem] = useState(0);
    const [section4SelectedItem,setSection4SelectedItem] = useState(0);
    const [section5SelectedItem,setSection5SelectedItem] = useState(0);
   
    const [sectionSelectedItem,setSectionSelectedItem] = useState(0);
    
    const selectedTheme = currentUiContext.theme;
    
    /*function showSideMenu(e) {
        const itemId = e.currentTarget.id
        setMenuItemId(itemId);
        const menus = document.querySelectorAll('.side-menu');
        M.Sidenav.init(menus, {edge: 'right'});
    }*/
         
    

    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    function getDetailSectionBlankTheme()
    { 
      return classes.MenuItemSectionDetails_BLANK
    }

    function getDetailSectionTheme()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_MenuItemSectionDetails ;
        case 'Theme2': return classes.Theme2_MenuItemSectionDetails ;
        case 'Theme3': return classes.Theme3_MenuItemSectionDetails ;
        default: return classes.Theme1_MenuItemSectionDetails ;
      }
    }

   /* function getCurrentContaintTheme()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_mainContentPosition ;
        case 'Theme2': return classes.Theme2_mainContentPosition ;
        case 'Theme3': return classes.Theme3_mainContentPosition ;
        default: return classes.Theme1_mainContentPosition ;
      }
    }*/

    function getCurrentContaintTheme(){ 
        // Choix du theme courant
        if(isMobile){
            switch(selectedTheme){
                case 'Theme1': return M_classes.Theme1_mainContentPosition ;
                case 'Theme2': return M_classes.Theme2_mainContentPosition ;
                case 'Theme3': return M_classes.Theme3_mainContentPosition ;
                default: return M_classes.Theme1_mainContentPosition ;
            }

        } else{
            switch(selectedTheme){
                case 'Theme1': return classes.Theme1_mainContentPosition ;
                case 'Theme2': return classes.Theme2_mainContentPosition ;
                case 'Theme3': return classes.Theme3_mainContentPosition ;
                default: return classes.Theme1_mainContentPosition ;
            }

        }
        
    }

    function toggleActiveMenu(NewActiveMenuId) {
        const NewActiveDiv = document.getElementById(NewActiveMenuId);
        if(currentActiveMenuID != undefined){
            const currentActiveDiv = document.getElementById(currentActiveMenuID);
            currentActiveDiv.classList.remove('activeP');

            if(currentActiveDiv!= NewActiveDiv){
                NewActiveDiv.classList.add('activeP');
                setCurrentActiveMenuID(NewActiveMenuId);
            } else {
                setCurrentActiveMenuID(undefined);
            }          
        }else{
            NewActiveDiv.classList.add('activeP');
            setCurrentActiveMenuID(NewActiveMenuId);
        }  

        if(parseInt(NewActiveMenuId)>=1 && parseInt(NewActiveMenuId)<=4) {
            document.getElementById("link_head_conf_1").click(); 
        }
        
        if(parseInt(NewActiveMenuId)>=5 && parseInt(NewActiveMenuId)<=31) {
            document.getElementById("link_head_conf_2").click(); 
        }

        if(parseInt(NewActiveMenuId)>=32 && parseInt(NewActiveMenuId)<=34) {
            document.getElementById("link_head_conf_3").click(); 
        }

        if(parseInt(NewActiveMenuId)>=35 && parseInt(NewActiveMenuId)<=38) {
            document.getElementById("link_head_conf_4").click(); 
        }

        if(parseInt(NewActiveMenuId)>=39)  {
            document.getElementById("link_head_conf_5").click(); 
        }
            
    }
  

    
    return ( 

        <div id="confs" className= {classes.viewContent}>
            {/*<div className= {classes.pageTitle}>
                <div className={classes.rowDisplay}>
                    <img src="images/configuration4.png"  className={classes.imageMargin1} id='en' width ='75px' height='80px' alt="my image"/>
                    {t("configurationM")}
                </div>
            </div>*/}

            <div className= {(isMobile) ? M_classes.pageTitle : classes.pageTitle}>
                {(isMobile) ? null 
                :  
                    <div className={classes.rowDisplay}>
                        <img src="images/configuration4.png"  className={classes.imageMargin1} id='en' width ='75px' height='80px' alt="my image"/>
                    </div>
                }
                
                <div className={(isMobile)? M_classes.titleHmself : classes.titleHmself}>
                    {t("configurationM")} 
                </div>                
            </div>

            <a id="link_head_conf_1" href="#conf_1"/>    

            <div className= {getCurrentContaintTheme()}>
                {(currentAppContext.enableProfiles["CONFIG_A"]=='1') ? 
                    <MenuItemList id="conf_1" minWtdhStyle={classes.size72Vw} libelle= {t("conf_param_perso")} theme={selectedTheme}>
                        <div  className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_A1"]=='1') ? <MenuItem menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle={t('modif_login')}       itemSelected={()=>{toggleActiveMenu('1'); (sectionSelectedItem == 0) ? setSectionSelectedItem(1):(sectionSelectedItem == 1) ? setSectionSelectedItem(0):setSectionSelectedItem(1)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A2"]=='1') ? <MenuItem menuItemId ='2' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle={t('modif_pswd')}        itemSelected={()=>{toggleActiveMenu('2'); (sectionSelectedItem == 0) ? setSectionSelectedItem(2):(sectionSelectedItem == 2) ? setSectionSelectedItem(0):setSectionSelectedItem(2)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A3"]=='1') ? <MenuItem menuItemId ='3' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle={t('modif_photo')}       itemSelected={()=>{toggleActiveMenu('3'); (sectionSelectedItem == 0) ? setSectionSelectedItem(3):(sectionSelectedItem == 3) ? setSectionSelectedItem(0):setSectionSelectedItem(3)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A4"]=='1') ? <MenuItem menuItemId ='4' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle={t('modif_theme')}       itemSelected={()=>{toggleActiveMenu('4'); (sectionSelectedItem == 0) ? setSectionSelectedItem(4):(sectionSelectedItem == 4) ? setSectionSelectedItem(0):setSectionSelectedItem(4)}}> </MenuItem>  :  null}
                            </div>
                            
                            
                                
                            {(sectionSelectedItem==1) ?
                                <div className={getDetailSectionTheme()}> 
                                    <ConfigLogin/>
                                </div>
                                : null
                            }
                            
                            {(sectionSelectedItem==2) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigPswd/>
                                </div>
                                : null
                            }

                            {(sectionSelectedItem==3) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigPhoto/>
                                </div>
                                : null
                            }

                            {(sectionSelectedItem==4) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTheme/>
                                </div>                                    
                                : null
                            }
                        </div>                               
                       
                    </MenuItemList>
                    :
                    null
                }

                <a id="link_head_conf_2" href="#conf_2"/> 
                
                {(currentAppContext.enableProfiles["CONFIG_B"]=='1') ? 
                    <MenuItemList id="conf_2" minWtdhStyle={classes.size72Vw} libelle= {t("conf_etab_struct")} theme={selectedTheme}>
                        <div  className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection} > 
                                {(currentAppContext.enableProfiles["CONFIG_B1"]=='1') ?   <MenuItem menuItemId ='5'  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t("modif_etab_gen_info")}             itemSelected={()=>{toggleActiveMenu('5');   (sectionSelectedItem == 0) ? setSectionSelectedItem(5):  (sectionSelectedItem == 5)  ? setSectionSelectedItem(0):setSectionSelectedItem(5)}}>   </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?   <MenuItem menuItemId ='6'  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t("gest_cycle")}                      itemSelected={()=>{toggleActiveMenu('6');   (sectionSelectedItem == 0) ? setSectionSelectedItem(6):  (sectionSelectedItem == 6)  ? setSectionSelectedItem(0):setSectionSelectedItem(6)}}>   </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?   <MenuItem menuItemId ='7'  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t('gest_level')}                      itemSelected={()=>{toggleActiveMenu('7');   (sectionSelectedItem == 0) ? setSectionSelectedItem(7):  (sectionSelectedItem == 7)  ? setSectionSelectedItem(0):setSectionSelectedItem(7)}}>   </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B4"]=='1') ?   <MenuItem menuItemId ='8'  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t("gest_classes")}                    itemSelected={()=>{toggleActiveMenu('8');   (sectionSelectedItem == 0) ? setSectionSelectedItem(8):  (sectionSelectedItem == 8)  ? setSectionSelectedItem(0):setSectionSelectedItem(8)}}>   </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B5"]=='1') ?   <MenuItem menuItemId ='9'  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_exam_classes")}                itemSelected={()=>{toggleActiveMenu('9');   (sectionSelectedItem == 0) ? setSectionSelectedItem(9):  (sectionSelectedItem == 9)  ? setSectionSelectedItem(0):setSectionSelectedItem(9)}}>   </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B6"]=='1') ?   <MenuItem menuItemId ='10' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t("gest_matiere")}                    itemSelected={()=>{toggleActiveMenu('10');  (sectionSelectedItem == 0) ? setSectionSelectedItem(10): (sectionSelectedItem == 10) ? setSectionSelectedItem(0):setSectionSelectedItem(10)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B7"]=='1') ?   <MenuItem menuItemId ='11' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t('matieres_clases_config')}          itemSelected={()=>{toggleActiveMenu('11');  (sectionSelectedItem == 0) ? setSectionSelectedItem(11): (sectionSelectedItem == 11) ? setSectionSelectedItem(0):setSectionSelectedItem(11)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B8"]=='1') ?   <MenuItem menuItemId ='12' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t('conf_cours_classes')}              itemSelected={()=>{toggleActiveMenu('12');  (sectionSelectedItem == 0) ? setSectionSelectedItem(12): (sectionSelectedItem == 12) ? setSectionSelectedItem(0):setSectionSelectedItem(12)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B9"]=='1') ?   <MenuItem menuItemId ='13' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle ={t('conf_leson_group')}                itemSelected={()=>{toggleActiveMenu('13');  (sectionSelectedItem == 0) ? setSectionSelectedItem(13): (sectionSelectedItem == 13) ? setSectionSelectedItem(0):setSectionSelectedItem(13)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B10"]=='1') ?  <MenuItem menuItemId ='14' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t('gest_matricule')}                   itemSelected={()=>{toggleActiveMenu('14');  (sectionSelectedItem == 0) ? setSectionSelectedItem(14): (sectionSelectedItem == 14) ? setSectionSelectedItem(0):setSectionSelectedItem(14)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B11"]=='1') ?  <MenuItem menuItemId ='15' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("modif_etab_conf")}                  itemSelected={()=>{toggleActiveMenu('15');  (sectionSelectedItem == 0) ? setSectionSelectedItem(15): (sectionSelectedItem == 15) ? setSectionSelectedItem(0):setSectionSelectedItem(15)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B12"]=='1') ?  <MenuItem menuItemId ='16' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("etab_hierarchie")}                  itemSelected={()=>{toggleActiveMenu('16');  (sectionSelectedItem == 0) ? setSectionSelectedItem(16): (sectionSelectedItem == 16) ? setSectionSelectedItem(0):setSectionSelectedItem(16)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B13"]=='1') ?  <MenuItem menuItemId ='17' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_cursus_quota")}                itemSelected={()=>{toggleActiveMenu('17');  (sectionSelectedItem == 0) ? setSectionSelectedItem(17): (sectionSelectedItem == 17) ? setSectionSelectedItem(0):setSectionSelectedItem(17)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B14"]=='1') ?  <MenuItem menuItemId ='18' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_type_prof")}                   itemSelected={()=>{toggleActiveMenu('18');  (sectionSelectedItem == 0) ? setSectionSelectedItem(18): (sectionSelectedItem == 18) ? setSectionSelectedItem(0):setSectionSelectedItem(18)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B15"]=='1') ?  <MenuItem menuItemId ='19' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("gest_trimestre")}                   itemSelected={()=>{toggleActiveMenu('19');  (sectionSelectedItem == 0) ? setSectionSelectedItem(19): (sectionSelectedItem == 19) ? setSectionSelectedItem(0):setSectionSelectedItem(19)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B16"]=='1') ?  <MenuItem menuItemId ='20' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("gest_sequence")}                    itemSelected={()=>{toggleActiveMenu('20');  (sectionSelectedItem == 0) ? setSectionSelectedItem(20): (sectionSelectedItem == 20) ? setSectionSelectedItem(0):setSectionSelectedItem(20)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B17"]=='1') ?  <MenuItem menuItemId ='21' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_classe_spe")}                  itemSelected={()=>{toggleActiveMenu('21');  (sectionSelectedItem == 0) ? setSectionSelectedItem(21): (sectionSelectedItem == 21) ? setSectionSelectedItem(0):setSectionSelectedItem(21)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B18"]=='1') ?  <MenuItem menuItemId ='22' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_jour_ouvrable")}               itemSelected={()=>{toggleActiveMenu('22');  (sectionSelectedItem == 0) ? setSectionSelectedItem(22): (sectionSelectedItem == 22) ? setSectionSelectedItem(0):setSectionSelectedItem(22)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B19"]=='1') ?  <MenuItem menuItemId ='23' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_pauses")}                      itemSelected={()=>{toggleActiveMenu('23');  (sectionSelectedItem == 0) ? setSectionSelectedItem(23): (sectionSelectedItem == 23) ? setSectionSelectedItem(0):setSectionSelectedItem(23)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B20"]=='1') ?  <MenuItem menuItemId ='24' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_tranches_horaires")}           itemSelected={()=>{toggleActiveMenu('24');  (sectionSelectedItem == 0) ? setSectionSelectedItem(24): (sectionSelectedItem == 24) ? setSectionSelectedItem(0):setSectionSelectedItem(24)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B21"]=='1') ?  <MenuItem menuItemId ='25' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("gest_matSpe_ens")}                  itemSelected={()=>{toggleActiveMenu('25');  (sectionSelectedItem == 0) ? setSectionSelectedItem(25): (sectionSelectedItem == 25) ? setSectionSelectedItem(0):setSectionSelectedItem(25)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B22"]=='1') ?  <MenuItem menuItemId ='26' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("gest_notes_apprec")}                itemSelected={()=>{toggleActiveMenu('26');  (sectionSelectedItem == 0) ? setSectionSelectedItem(26): (sectionSelectedItem == 26) ? setSectionSelectedItem(0):setSectionSelectedItem(26)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B23"]=='1') ?  <MenuItem menuItemId ='27' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("gest_conv_cd")}                     itemSelected={()=>{toggleActiveMenu('27');  (sectionSelectedItem == 0) ? setSectionSelectedItem(27): (sectionSelectedItem == 27) ? setSectionSelectedItem(0):setSectionSelectedItem(27)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B24"]=='1') ?  <MenuItem menuItemId ='28' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("redoublmnt_cond")}                  itemSelected={()=>{toggleActiveMenu('28');  (sectionSelectedItem == 0) ? setSectionSelectedItem(28): (sectionSelectedItem == 28) ? setSectionSelectedItem(0):setSectionSelectedItem(28)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B25"]=='1') ?  <MenuItem menuItemId ='29' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("set_sanction_types")}               itemSelected={()=>{toggleActiveMenu('29');  (sectionSelectedItem == 0) ? setSectionSelectedItem(29): (sectionSelectedItem == 29) ? setSectionSelectedItem(0):setSectionSelectedItem(29)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B26"]=='1') ?  <MenuItem menuItemId ='30' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_next_classes")}                itemSelected={()=>{toggleActiveMenu('30');  (sectionSelectedItem == 0) ? setSectionSelectedItem(30): (sectionSelectedItem == 30) ? setSectionSelectedItem(0):setSectionSelectedItem(30)}}>  </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B26"]=='1') ?  <MenuItem menuItemId ='31' isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}  libelle ={t("conf_close_year")}                  itemSelected={()=>{toggleActiveMenu('31');  (sectionSelectedItem == 0) ? setSectionSelectedItem(31): (sectionSelectedItem == 31) ? setSectionSelectedItem(0):setSectionSelectedItem(31)}} isSpecial={true} menuTextStyle={classes.MenuClose}>  </MenuItem> : null}

                            </div>
                            
                                    
                            {(sectionSelectedItem==5) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigGen/>
                                </div>                                   
                                : null
                            } 

                            {(sectionSelectedItem==6) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigCycle/>
                                </div>                                   
                                : null
                            }

                            {(sectionSelectedItem==7) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigNiveau/>
                                </div>                                     
                                : null
                            }

                            {(sectionSelectedItem==8) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigClasses/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==9) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigClasseExamen/>
                                </div>
                                
                                : null
                            }
                            {(sectionSelectedItem==10) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigCours/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==11) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigMatieres/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==12) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigGroupe/>
                                </div>                                   
                                : null
                            }

                            {(sectionSelectedItem==13) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigMatricule/>
                                </div>                                    
                                : null
                            }

                            {(sectionSelectedItem==14) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigMatieresClasse/>
                                </div>                                    
                                : null
                            }

                            {(sectionSelectedItem==15) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigAnnee/>
                                </div>                                    
                                : null
                            }

                            {(sectionSelectedItem==16) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigHierarchie/>
                                </div>                                   
                                : null
                            }
                            
                            {(sectionSelectedItem==17) ?
                                <div className={getDetailSectionTheme()}>
                                  <ConfigQuotasCursus/>
                                </div>                                   
                              : null
                            }

                            {(sectionSelectedItem==18) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTypeEnseignant/>
                                </div>                                    
                                : null
                            }

                            {(sectionSelectedItem==19) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTrimestre/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==20) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigSequence/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==21) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigSpecialiteClasse/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==22) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigJour/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==23) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigPause/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==24) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTrancheHoraire/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==25) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigSpecialiteEns/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==26) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigAppreciationNote/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==27) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigCausesConvocationCD/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==28) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigConditionRedoublementExclusion/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==29) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTypeSanction/>
                                </div>
                                : null
                            }
                            {(sectionSelectedItem==30) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigClassesPassages/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==31) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigCloturerAnnee/>
                                </div>                                    
                                : null
                            } 
                                
                        </div>
                    </MenuItemList>
                    :
                    null
                }
                
                <a id="link_head_conf_3" href="#conf_3"/>  

                {(currentAppContext.enableProfiles["CONFIG_C"]=='1') ? 
                    <MenuItemList id="conf_3" minWtdhStyle={classes.size72Vw}  libelle= {t("conf_users_and_roles")} theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_C1"]=='1') ?  <MenuItem menuItemId ='32' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t('gest_users')}      itemSelected={()=>{toggleActiveMenu('32'); (sectionSelectedItem == 0) ? setSectionSelectedItem(32):(sectionSelectedItem == 32) ? setSectionSelectedItem(0):setSectionSelectedItem(32)}}> </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_C2"]=='1') ?  <MenuItem menuItemId ='33' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("activate_users")}  itemSelected={()=>{toggleActiveMenu('33'); (sectionSelectedItem == 0) ? setSectionSelectedItem(33):(sectionSelectedItem == 33) ? setSectionSelectedItem(0):setSectionSelectedItem(33)}}> </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_C3"]=='1') ?  <MenuItem menuItemId ='34' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("gest_ens_Spe")}    itemSelected={()=>{toggleActiveMenu('34'); (sectionSelectedItem == 0) ? setSectionSelectedItem(34):(sectionSelectedItem == 34) ? setSectionSelectedItem(0):setSectionSelectedItem(34)}}> </MenuItem> : null}
                            </div>                           
                            
                            {(sectionSelectedItem==32) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigUser/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==33) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigActiverUser/>
                                </div>                                
                                : null
                            }
                            {(sectionSelectedItem==34) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigEnseignantSpecialites/>
                                </div>                                
                                : null
                            }
                        </div>                            
                        
                    </MenuItemList>
                    :
                    null
                }

                <a id="link_head_conf_4" href="#conf_4"/>  

                {(currentAppContext.enableProfiles["CONFIG_D"]=='1') ? 
                    <MenuItemList id="conf_4" minWtdhStyle={classes.size72Vw}   libelle={t("conf_payments" )} theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_D1"]=='1') ?  <MenuItem menuItemId ='35' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t('conf_payment_elv')}                 itemSelected={()=>{toggleActiveMenu('35'); (sectionSelectedItem == 0) ? setSectionSelectedItem(35):(sectionSelectedItem == 35) ? setSectionSelectedItem(0):setSectionSelectedItem(35)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D2"]=='1') ?  <MenuItem menuItemId ='36' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("conf_types_paiements_autres")}      itemSelected={()=>{toggleActiveMenu('36'); (sectionSelectedItem == 0) ? setSectionSelectedItem(36):(sectionSelectedItem == 36) ? setSectionSelectedItem(0):setSectionSelectedItem(36)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D3"]=='1') ?  <MenuItem menuItemId ='37' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("conf_types_paiements_prof")}        itemSelected={()=>{toggleActiveMenu('37'); (sectionSelectedItem == 0) ? setSectionSelectedItem(37):(sectionSelectedItem == 37) ? setSectionSelectedItem(0):setSectionSelectedItem(37)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D4"]=='1') ?  <MenuItem menuItemId ='38' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("conf_type_paiement_personel_Ad")}   itemSelected={()=>{toggleActiveMenu('38'); (sectionSelectedItem == 0) ? setSectionSelectedItem(38):(sectionSelectedItem == 38) ? setSectionSelectedItem(0):setSectionSelectedItem(38)}}></MenuItem> : null}
                            </div>
                            
                            
                            {(sectionSelectedItem==35) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigPayementEleve/>
                                </div>                                    
                                : null
                            }
                            {(sectionSelectedItem==36) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigPayementDivers/>
                                </div>                                    
                                : null
                            } 
                            {(sectionSelectedItem==37) ?                                    
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTypePayementEns/>
                                </div>
                                : null
                            } 
                            {(sectionSelectedItem==38) ?
                                <div className={getDetailSectionTheme()}>
                                    <ConfigTypePayementAdminstaff/>
                                </div>                                    
                                : null
                            } 
                        </div>
                        
                    </MenuItemList>
                    :
                    null
                }  

                <a id="link_head_conf_5" href="#conf_5"/>  

                {(currentAppContext.enableProfiles["CONFIG_E"]=='1') ? 
                    <MenuItemList id="conf_5" minWtdhStyle={classes.size72Vw}  libelle= {t("conf_messages")} theme={selectedTheme}>
                        <div  className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_E1"]=='1') ?  <MenuItem menuItemId ='39'isSimple={true}  imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t('budget_evolution_cf')}      itemSelected={()=>{toggleActiveMenu('39'); (sectionSelectedItem == 0) ? setSectionSelectedItem(39):(sectionSelectedItem == 39) ? setSectionSelectedItem(0):setSectionSelectedItem(389)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_E2"]=='1') ?  <MenuItem menuItemId ='40' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle={t("interactions_evolution")}   itemSelected={()=>{toggleActiveMenu('40'); (sectionSelectedItem == 0) ? setSectionSelectedItem(40):(sectionSelectedItem == 40) ? setSectionSelectedItem(0):setSectionSelectedItem(40)}}> </MenuItem> : null}
                            </div>
                            
                          
                            {(sectionSelectedItem==39) ?
                                <div className={getDetailSectionTheme()}>
                                  {/*mettre la balise ici qd ce sera cree*/} 
                                </div>                                    
                                : null
                            } 

                            {(sectionSelectedItem==40) ?
                                <div className={getDetailSectionTheme()}>
                                  {/*mettre la balise ici qd ce sera cree*/} 
                                </div>                                    
                                : null
                            } 
                               
                        </div>
                    </MenuItemList>
                    :
                    null
                }           
                 
        
            </div>
                
          {/*<div id="side-menu" class="sidenav side-menu">
            curentMenuItemId==1 ? <Enregistrement/> : null}
            {curentMenuItemId==2 ? <ListeDesEleves/> : null}
            {curentMenuItemId==3 ? <CarteScolaire/> : null}
            {curentMenuItemId==4 ? <ChangementClasse/> : null}
            {curentMenuItemId==5 ? <AdmissionClasseSup/> : null
          </div>*/}

        </div>
    );

}

export default ConfigPage;