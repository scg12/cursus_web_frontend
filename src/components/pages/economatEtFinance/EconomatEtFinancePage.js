import React from "react";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import classes from './EconomatEtFinancePage.module.css';
import M_classes from './M_EconomatEtFinancePage.module.css';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import {isMobile} from 'react-device-detect';
import M from 'materialize-css';

import FormLayout from '../../layout/cs_layout/formLayout/FormLayout'
import FraisScolarite from './subPages/FraisScolarite';
import EtatsPaiement from './subPages/EtatsPaiement';
import EntreeFonds from './subPages/EntreeFonds';
import SortieFonds from './subPages/SortieFonds';
import RecapEntrees from './subPages/RecapEntrees';
import DefPaiements from './subPages/DefPaiements'
import RecapSorties from './subPages/RecapSorties';
import PaiementStaff from './subPages/PaiementStaff'
import Budget from './subPages/Budget';
import TotalForm from './subPages/TotalForm';



import { useState,useContext } from "react";
import UiContext from '../../../store/UiContext'
import AppContext from "../../../store/AppContext";

/*import Enregistrement from "./subPages/Enregistrement";
import ListeDesEleves from "./subPages/ListeDesEleves";
import CarteScolaire from "./subPages/CarteScolaire";
import ChangementClasse from "./subPages/ChangementClasse";
import AdmissionClasseSup from "./subPages/AdmissionClasseSup";
import ProgressBar from 'react-bootstrap/ProgressBar';*/



function EconomatEtFinancePage() {
      
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
            <div className= {(isMobile) ? M_classes.pageTitle : classes.pageTitle}>
                {(isMobile) ? null : <img src="images/monei.png"  className={classes.imageMargin1} alt="my image"/>}
                
                <div className={(isMobile)? M_classes.titleHmself : classes.titleHmself}>
                    {t("eco_and_financeM")} 
                </div>
                
            </div>

            <div className= {getCurrentContaintTheme()}>

                {(currentAppContext.enableProfiles["FINANCE_A"]=='1') ? 
                    <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle=  {t("frais_scolarite")}  theme={selectedTheme}>
                        {(currentAppContext.enableProfiles["FINANCE_A1"]=='1') ? <MenuItemP menuItemId ='200'  imgSource='images/SchoolFees.png'         libelle= {t("paiement_scolarite")}  itemSelected={showSideMenu} ></MenuItemP> : null}
                        {(currentAppContext.enableProfiles["FINANCE_A2"]=='1') ? <MenuItemP menuItemId ='201'  imgSource='images/ListeEntrees.png'       libelle= {t("etat_frais")}  itemSelected={showSideMenu}></MenuItemP> : null}
                    </MenuItemListP>
                    :
                    null
                }

                {(currentAppContext.enableProfiles["FINANCE_B"]=='1') ? 
                    <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle= {t("staff_fees")} theme={selectedTheme}>
                        {/* pour le MenuItem ci, mettre le bon code */}
                        {(currentAppContext.enableProfiles["FINANCE_B3"]=='1') ? <MenuItemP menuItemId ='202' imgSource='images/confSalaire.png'        libelle={t("def_paiement_personnel")} itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3 : classes.imgStyleP}></MenuItemP>  : null}
                        {(currentAppContext.enableProfiles["FINANCE_B3"]=='1') ? <MenuItemP menuItemId ='203' imgSource='images/salaireProf.png'        libelle={t("paiement_personnel")} itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3 : classes.imgStyleP}></MenuItemP>  : null}
                        {(currentAppContext.enableProfiles["FINANCE_B3"]=='1') ? <MenuItemP menuItemId ='204' imgSource='images/ListeSorties.png'       libelle={t("bilan_paiement_staff")} itemSelected={showSideMenu}></MenuItemP> : null}
                        {/*<MenuItemP libelle='Admission en claase2 ' itemSelected={showSideMenu}></MenuItemP>*/}
                    </MenuItemListP>
                    :
                    null
                }

                {(currentAppContext.enableProfiles["FINANCE_B"]=='1') ? 
                    <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle= {t("other_fees")} theme={selectedTheme}>
                        {/* pour le MenuItem ci, mettre le bon code */}
                        {(currentAppContext.enableProfiles["FINANCE_B1"]=='1') ? <MenuItemP menuItemId ='205' imgSource='images/EntreeFonds.png'        libelle={t("entree_fond")} itemSelected={showSideMenu}></MenuItemP>  : null}
                        {(currentAppContext.enableProfiles["FINANCE_B2"]=='1') ? <MenuItemP menuItemId ='206' imgSource='images/SortieFonds.png'        libelle={t("sortie_fond")} itemSelected={showSideMenu}></MenuItemP>  : null}
                        {(currentAppContext.enableProfiles["FINANCE_B2"]=='1') ? <MenuItemP menuItemId ='207' imgSource='images/ListeEntrees.png'       libelle={t("recap_entree")} itemSelected={showSideMenu}></MenuItemP> : null}
                        {(currentAppContext.enableProfiles["FINANCE_B3"]=='1') ? <MenuItemP menuItemId ='208' imgSource='images/ListeSorties.png'       libelle={t("recap_sortie")} itemSelected={showSideMenu}></MenuItemP> : null}
                        {/*<MenuItemP libelle='Admission en claase2 ' itemSelected={showSideMenu}></MenuItemP>*/}
                    </MenuItemListP>
                    :
                    null
                }


                {(currentAppContext.enableProfiles["FINANCE_C"]=='1') ? 
                    <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("bilan_financier")} theme={selectedTheme}>
                        {(currentAppContext.enableProfiles["FINANCE_C1"]=='1') ? <MenuItemP menuItemId ='209' imgSource='images/EvolutionBudget.png'        libelle={t("budget_evolution")} itemSelected={showSideMenu}></MenuItemP> :null}
                        {(currentAppContext.enableProfiles["FINANCE_C2"]=='1') ? <MenuItemP menuItemId ='210' imgSource='images/EtatPaiement.png'           libelle={t("total_percu")}itemSelected={showSideMenu}></MenuItemP> : null}
                    </MenuItemListP>
                    :
                    null
                }

            </div>
                
            <div id="side-menu" class="sidenav side-menu">
                <FormLayout formCode={curentMenuItemPId}>
                    {curentMenuItemPId== 200 && <FraisScolarite formMode='ajout'/>    } 
                    {curentMenuItemPId== 201 && <EtatsPaiement/> } 

                    {curentMenuItemPId== 202 && <DefPaiements/>  }
                    {curentMenuItemPId== 203 && <PaiementStaff/> }
                    {curentMenuItemPId== 204 && <RecapSorties/>  }

                    {curentMenuItemPId== 205 && <EntreeFonds/>   }
                    {curentMenuItemPId== 206 && <SortieFonds/>   } 
                    {curentMenuItemPId== 207 && <RecapEntrees/>  }
                    {curentMenuItemPId== 208 && <RecapSorties/>  }                   
                   
                    {curentMenuItemPId== 209 && <Budget/>        }
                    {curentMenuItemPId== 210 && <TotalForm/>     }
                   
                    
                </FormLayout>     
      </div>
        </div>
    );
}
export default EconomatEtFinancePage;