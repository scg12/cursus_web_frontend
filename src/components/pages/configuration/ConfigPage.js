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





function ConfigPage(props) {
   
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [curentMenuItemId,setMenuItemId]=useState(0);
    

    const [section1SelectedItem,setSection1SelectedItem]=useState(0);
    const [section2SelectedItem,setSection2SelectedItem]=useState(0);
    const [section3SelectedItem,setSection3SelectedItem]=useState(0);
    const [section4SelectedItem,setSection4SelectedItem]=useState(0);
    const [section5SelectedItem,setSection5SelectedItem]=useState(0);
    
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
    
    
    return ( 

        <div className= {classes.viewContent}>
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
                        {t("configurationM")}
                    </div>
                }
                
                <div className={(isMobile)? M_classes.titleHmself : classes.titleHmself}>
                    {t("configurationM")} 
                </div>
                
            </div>

    

            <div className= {getCurrentContaintTheme()}>
                {(currentAppContext.enableProfiles["CONFIG_A"]=='1') ? 
                    <MenuItemList minWtdhStyle={classes.size72Vw} libelle= 'Configuration des Paramètres Personnels' theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_A1"]=='1') ? <MenuItem menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle='Modification Du Login'                    itemSelected={()=>{(section1SelectedItem == 0) ? setSection1SelectedItem(1):(section1SelectedItem == 1) ? setSection1SelectedItem(0):setSection1SelectedItem(1)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A2"]=='1') ? <MenuItem menuItemId ='2' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle='Modification Du Mot de Passe'             itemSelected={()=>{(section1SelectedItem == 0) ? setSection1SelectedItem(2):(section1SelectedItem == 2) ? setSection1SelectedItem(0):setSection1SelectedItem(2)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A3"]=='1') ? <MenuItem menuItemId ='3' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle='Modification De La Photo de profil'       itemSelected={()=>{(section1SelectedItem == 0) ? setSection1SelectedItem(3):(section1SelectedItem == 3) ? setSection1SelectedItem(0):setSection1SelectedItem(3)}}> </MenuItem>  :  null}
                                {(currentAppContext.enableProfiles["CONFIG_A4"]=='1') ? <MenuItem menuItemId ='4' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}    libelle='Modification Du Thème'                    itemSelected={()=>{(section1SelectedItem == 0) ? setSection1SelectedItem(4):(section1SelectedItem == 4) ? setSection1SelectedItem(0):setSection1SelectedItem(4)}}> </MenuItem>  :  null}
                            </div>
                            
                            <div className={(section1SelectedItem == 0) ? getDetailSectionBlankTheme():getDetailSectionTheme()}> 
                                
                                {(section1SelectedItem==1) ?
                                    <ConfigLogin/>
                                    : null
                                }
                                
                                {(section1SelectedItem==2) ?
                                    <ConfigPswd/>
                                    : null
                                }

                                {(section1SelectedItem==3) ?
                                    <ConfigPhoto/>
                                    : null
                                }

                                {(section1SelectedItem==4) ?
                                    <ConfigTheme/>
                                    : null
                                }
                            </div>
                                
                            
                        </div>
                    </MenuItemList>
                    :
                    null
                }
        
                {(currentAppContext.enableProfiles["CONFIG_B"]=='1') ? 
                    <MenuItemList minWtdhStyle={classes.size72Vw} libelle= "Configuration De La Structure De L'Etablissement" theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection} >
                                {(currentAppContext.enableProfiles["CONFIG_B1"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle= "Modification Des Infos Générales De L'Etablissement"               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(1):(section2SelectedItem == 1) ? setSection2SelectedItem(0):setSection2SelectedItem(1)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Gestion Des Cycles"                                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(2):(section2SelectedItem == 2) ? setSection2SelectedItem(0):setSection2SelectedItem(2)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Gestion Des Niveaux'                                                 itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(3):(section2SelectedItem == 3) ? setSection2SelectedItem(0):setSection2SelectedItem(3)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Gestion Des Classes'                                                 itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(9):(section2SelectedItem == 9) ? setSection2SelectedItem(0):setSection2SelectedItem(9)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition Des Classes d'Examen"                                    itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(10):(section2SelectedItem == 10) ? setSection2SelectedItem(0):setSection2SelectedItem(10)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Gestion des Matières de l'Etablissement"                   itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(4):(section2SelectedItem == 4) ? setSection2SelectedItem(0):setSection2SelectedItem(4)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Association des Matières aux Classes'                    itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(5):(section2SelectedItem == 5) ? setSection2SelectedItem(0):setSection2SelectedItem(5)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Définition des Cours par Classes'                    itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(11):(section2SelectedItem == 11) ? setSection2SelectedItem(0):setSection2SelectedItem(11)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Définition des Groupes de Matières'                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(6):(section2SelectedItem == 6) ? setSection2SelectedItem(0):setSection2SelectedItem(6)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Gestion des Matricules'        itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(7):(section2SelectedItem == 7) ? setSection2SelectedItem(0):setSection2SelectedItem(7)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Modifier la configuration de l'établissement"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(8):(section2SelectedItem == 8) ? setSection2SelectedItem(0):setSection2SelectedItem(8)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Hierarchie Etablissement"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(12):(section2SelectedItem == 12) ? setSection2SelectedItem(0):setSection2SelectedItem(12)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Quotas Cursus"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(13):(section2SelectedItem == 13) ? setSection2SelectedItem(0):setSection2SelectedItem(13)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition Type d'Enseignants"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(14):(section2SelectedItem == 14) ? setSection2SelectedItem(0):setSection2SelectedItem(14)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Gestion des Trimestres"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(15):(section2SelectedItem == 15) ? setSection2SelectedItem(0):setSection2SelectedItem(15)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Gestion des Séquences"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(16):(section2SelectedItem == 16) ? setSection2SelectedItem(0):setSection2SelectedItem(16)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Classes de Spécialité"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(17):(section2SelectedItem == 17) ? setSection2SelectedItem(0):setSection2SelectedItem(17)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Jours ouvrables"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(18):(section2SelectedItem == 18) ? setSection2SelectedItem(0):setSection2SelectedItem(18)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Pauses"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(19):(section2SelectedItem == 19) ? setSection2SelectedItem(0):setSection2SelectedItem(19)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Tranches Horaires"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(20):(section2SelectedItem == 20) ? setSection2SelectedItem(0):setSection2SelectedItem(20)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition Matières de spécialité des Enseignants"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(21):(section2SelectedItem == 21) ? setSection2SelectedItem(0):setSection2SelectedItem(21)}}></MenuItem> : null}
                                {/* {(currentAppContext.enableProfiles["CONFIG_B3"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={classes.imageStyle}   libelle="Définition des Quotas Cursus"                         itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(13):(section2SelectedItem == 13) ? setSection2SelectedItem(0):setSection2SelectedItem(13)}}></MenuItem> : null} */}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Gestion Des Appréciation De Notes"                                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(22):(section2SelectedItem == 22) ? setSection2SelectedItem(0):setSection2SelectedItem(22)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Causes de Convocation au Conseil de Discipline"                                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(23):(section2SelectedItem == 23) ? setSection2SelectedItem(0):setSection2SelectedItem(23)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Condition de Reoublement et d'exclusion"                                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(24):(section2SelectedItem == 24) ? setSection2SelectedItem(0):setSection2SelectedItem(24)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_B2"]=='1') ?  <MenuItem  isSimple={true} imgSource={'images/' + getPuceByTheme()}  withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Types de Sanctions"                                               itemSelected={()=>{(section2SelectedItem == 0) ? setSection2SelectedItem(25):(section2SelectedItem == 25) ? setSection2SelectedItem(0):setSection2SelectedItem(25)}}></MenuItem> : null}

                            </div>
                            
                            <div className={ (section2SelectedItem == 0) ? getDetailSectionBlankTheme() : getDetailSectionTheme()} style={{height:'fit-content'}}>
                                {(section2SelectedItem==1) ?
                                    <ConfigGen/>
                                    : null
                                } 

                                {(section2SelectedItem==2) ?
                                    <ConfigCycle/>
                                    : null
                                }

                                {(section2SelectedItem==3) ?
                                    <ConfigNiveau/>
                                    : null
                                }

                                {(section2SelectedItem==9) ?
                                    <ConfigClasses/>
                                    : null
                                }
                                {(section2SelectedItem==10) ?
                                    <ConfigClasseExamen/>
                                    : null
                                }
                                {(section2SelectedItem==11) ?
                                    <ConfigCours/>
                                    : null
                                }


                                {(section2SelectedItem==4) ?
                                    <ConfigMatieres/>
                                    : null
                                }
                                {(section2SelectedItem==6) ?
                                    <ConfigGroupe/>
                                    : null
                                }

                                {(section2SelectedItem==7) ?
                                    <ConfigMatricule/>
                                    : null
                                }

                                {(section2SelectedItem==5) ?
                                    <ConfigMatieresClasse/>
                                    : null
                                }

                                {(section2SelectedItem==8) ?
                                    <ConfigAnnee/>
                                    : null
                                }

                                {(section2SelectedItem==12) ?
                                    <ConfigHierarchie/>
                                    : null
                                }
                                {(section2SelectedItem==13) ?
                                    <ConfigQuotasCursus/>
                                    : null
                                }
                                {(section2SelectedItem==14) ?
                                    <ConfigTypeEnseignant/>
                                    : null
                                }
                                {(section2SelectedItem==15) ?
                                    <ConfigTrimestre/>
                                    : null
                                }
                                {(section2SelectedItem==16) ?
                                    <ConfigSequence/>
                                    : null
                                }
                                {(section2SelectedItem==17) ?
                                    <ConfigSpecialiteClasse/>
                                    : null
                                }
                                {(section2SelectedItem==18) ?
                                    <ConfigJour/>
                                    : null
                                }
                                {(section2SelectedItem==19) ?
                                    <ConfigPause/>
                                    : null
                                }
                                {(section2SelectedItem==20) ?
                                    <ConfigTrancheHoraire/>
                                    : null
                                }
                                {(section2SelectedItem==21) ?
                                    <ConfigSpecialiteEns/>
                                    : null
                                }
                                {(section2SelectedItem==22) ?
                                    <ConfigAppreciationNote/>
                                    : null
                                }
                                {(section2SelectedItem==23) ?
                                    <ConfigCausesConvocationCD/>
                                    : null
                                }
                                {(section2SelectedItem==24) ?
                                    <ConfigConditionRedoublementExclusion/>
                                    : null
                                }
                                {(section2SelectedItem==25) ?
                                    <ConfigTypeSanction/>
                                    : null
                                }
                                
                            </div>
                                
                        </div>
                    </MenuItemList>
                    :
                    null
                }

                {(currentAppContext.enableProfiles["CONFIG_C"]=='1') ? 
                    <MenuItemList minWtdhStyle={classes.size72Vw}  libelle= "Configuartion Des Comptes Utilisateurs Et Des Rôles" theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_C1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Gestion des Utilisateurs'       itemSelected={()=>{(section3SelectedItem == 0) ? setSection3SelectedItem(1):(section3SelectedItem == 1) ? setSection3SelectedItem(0):setSection3SelectedItem(1)}}> </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_C2"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Activer Utilisateurs désactivés"     itemSelected={()=>{(section3SelectedItem == 0) ? setSection3SelectedItem(2):(section3SelectedItem == 2) ? setSection3SelectedItem(0):setSection3SelectedItem(2)}}> </MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_C2"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition Spécialité(s) Enseignants"     itemSelected={()=>{(section3SelectedItem == 0) ? setSection3SelectedItem(3):(section3SelectedItem == 3) ? setSection3SelectedItem(0):setSection3SelectedItem(3)}}> </MenuItem> : null}
                            </div>
                           
                            <div className={(section3SelectedItem == 0) ? getDetailSectionBlankTheme() : getDetailSectionTheme()}> 
                            {(section3SelectedItem==1) ?
                                    <ConfigUser/>
                                    : null
                                }
                            {(section3SelectedItem==2) ?
                                <ConfigActiverUser/>
                                : null
                            }
                            {(section3SelectedItem==3) ?
                                <ConfigEnseignantSpecialites/>
                                : null
                            }
                            </div>
                            
                        </div>
                    </MenuItemList>
                    :
                    null
                }

                {(currentAppContext.enableProfiles["CONFIG_D"]=='1') ? 
                    <MenuItemList minWtdhStyle={classes.size72Vw}   libelle= "Configuartion Des Paiements" theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_D1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='Définition Type Payement Elève'           itemSelected={()=>{(section4SelectedItem == 0) ? setSection4SelectedItem(1):(section4SelectedItem == 1) ? setSection4SelectedItem(0):setSection4SelectedItem(1)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Types de Payement Divers"  itemSelected={()=>{(section4SelectedItem == 0) ? setSection4SelectedItem(2):(section4SelectedItem == 2) ? setSection4SelectedItem(0):setSection4SelectedItem(2)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Types de Payement Enseignants"  itemSelected={()=>{(section4SelectedItem == 0) ? setSection4SelectedItem(3):(section4SelectedItem == 3) ? setSection4SelectedItem(0):setSection4SelectedItem(3)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_D1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Définition des Types de Payement Personnel Administratif"  itemSelected={()=>{(section4SelectedItem == 0) ? setSection4SelectedItem(4):(section4SelectedItem == 4) ? setSection4SelectedItem(0):setSection4SelectedItem(4)}}></MenuItem> : null}
                            </div>
                            
                            <div className={ (section4SelectedItem == 0) ? getDetailSectionBlankTheme() : getDetailSectionTheme()}> 
                                {(section4SelectedItem==1) ?
                                    <ConfigPayementEleve/>
                                    : null
                                    }
                                {(section4SelectedItem==2) ?
                                    <ConfigPayementDivers/>
                                    : null
                                    } 
                                {(section4SelectedItem==3) ?
                                    <ConfigTypePayementEns/>
                                    : null
                                    } 
                                {(section4SelectedItem==4) ?
                                    <ConfigTypePayementAdminstaff/>
                                    : null
                                    } 
                            </div>
                            
                        </div>
                    </MenuItemList>
                    :
                    null
                }  

                {(currentAppContext.enableProfiles["CONFIG_E"]=='1') ? 
                    <MenuItemList minWtdhStyle={classes.size72Vw}  libelle= "Configuartion Des Messages" theme={selectedTheme}>
                        <div className={classes.MenuGroup}>
                            <div className={classes.MenuItemsection}>
                                {(currentAppContext.enableProfiles["CONFIG_E1"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle='EVolution Du Budget'                                    itemSelected={()=>{(section5SelectedItem == 0) ? setSection5SelectedItem(1):(section5SelectedItem == 1) ? setSection5SelectedItem(0):setSection5SelectedItem(1)}}></MenuItem> : null}
                                {(currentAppContext.enableProfiles["CONFIG_E2"]=='1') ?  <MenuItem isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true}  imageStyle={isMobile? M_classes.imageStyle_M : classes.imageStyle}   libelle="Evolution de l'Interaction  Avec les Parents D'Elèves"  itemSelected={()=>{(section5SelectedItem == 0) ? setSection5SelectedItem(2):(section5SelectedItem == 2) ? setSection5SelectedItem(0):setSection5SelectedItem(2)}}></MenuItem> : null}
                            </div>
                            
                            <div className={(section5SelectedItem == 0) ? getDetailSectionBlankTheme() : getDetailSectionTheme()}> 
                                
                            </div>
                               
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