import React from "react";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import MenuItemListP from '../../layout/cs_layout/menuItemList/MenuItemListP';
import classes from './ScolaritePage.module.css';
import M_classes from './M_ScolaritePage.module.css';
import MenuItemP from '../../layout/cs_layout/menuItem/MenuItemP';
import M from 'materialize-css';

import { useState,useContext } from "react";
import UiContext from '../../../store/UiContext'

import Enregistrement from "./subPages/Enregistrement";
import ListeDesEleves from "./subPages/ListeDesEleves";
import CarteScolaire from "./subPages/CarteScolaire";
import ChangementClasse from "../extras/subPages/ChangementClasse";
import AdmissionClasseSup from "./subPages/AdmissionClasseSup";
import EmploiDeTemps from "./subPages/EmploiDeTemps";
import CahierDeTexte from "./subPages/CahierDeTexte";
import ConseilClasse from "./subPages/ConseilClasse";
import ListManuelsScolaires from "./subPages/ListManuelsScolaires";
import Appel from "./subPages/Appel";
import ConseilDiscipline from "./subPages/ConseilDiscipline";
import Studentprofile from "./subPages/Studentprofile";
import BilletEntreeSortie from "./subPages/BilletEntreeSortie";
//import BilletSortie from "./subPages/BilletSortie";
import NewEvaluation from "./subPages/NewEvaluation";
import SaveNotes from "./subPages/SaveNotes";
import GenStudentReport   from "./subPages/GenStudentReport";
import PrintStudentReport from "./subPages/PrintStudentReport";
import LookStudentPresence from "./subPages/LookStudentPresence";
import ConsultEmploiTemps  from "./subPages/ConsultEmploiTemps";
import NewOfficialExam from "./subPages/NewOfficialExam";
import SaveExamNotes from "./subPages/SaveExamNotes";
import ListAdmis from "./subPages/ListAdmis";
import ListingNotes from "./subPages/ListingNotes";
import SuiviFicheProgress from "./subPages/SuiviFicheProgress";
import ConsultEmploiDeTemps from "./subPages/ConsultEmploiDeTemps";
import CertificatScolarite from "./subPages/CertificatScolarite";

import ProgressBar from 'react-bootstrap/ProgressBar';
import AppContext from "../../../store/AppContext";
import FormLayout from "../../layout/cs_layout/formLayout/FormLayout";
import {isMobile} from 'react-device-detect';
import MsgBox from '../../msgBox/MsgBox';

import AddFicheProgess from './modals/AddFicheProgess';
import ActivateSequence from './modals/ActivateSequence';
import SearchAcademicHistory from "./modals/SearchAcademicHistory";
import BackDrop from "../../backDrop/BackDrop";
import axiosInstance from "../../../axios";


var constMsg ={
  msgShown:false,
  msgType:'info',
  msgTitle:"",
  message:"",   
}

function ScolaritePage(){
    
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif, 3=consult, 4=impression 
  const [msg, showMsg]= useState({constMsg})
  
  //Cette constante sera lu lors de la configuration de l'utilisateur.
  const selectedTheme = currentUiContext.theme;
  const [curentMenuItemPId,setMenuItemPId]=useState(0);

  //Necessaire pour l'emploi de temps
  let listMatieres = [];
  let matieres = [];
  let classess = [];
  let indexClasse = -1;
  let emploiDeTemps = [];
  let listProfs = [];
  let tab_jours = [];
  let tab_periodes = [];
  let tab_creneau_pause = [];
  let tab_valeur_horaire = [];

  
  function showSideMenu(e) {
   
    currentUiContext.setIsParentMsgBox(false);
    
    const itemId = e.currentTarget.id
    setMenuItemPId(itemId);


    currentUiContext.setPreviousSelectedMenuID(currentUiContext.currentSelectedMenuID);
    currentUiContext.setCurrentSelectedMenuID(itemId);

    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});

    var select1 = document.getElementById('selectId1');
    var select2 = document.getElementById('selectId2');
    var select3 = document.getElementById('selectClass1');
    var select4 = document.getElementById('selectClass2');
    var select5 = document.getElementById('selectPeriod1');

    

    if(select1 != null && select1 != undefined){
      select1.options[0].label = (i18n.language=='fr') ? ' choisir ' :' choose ';

    }

    if(select2 != null && select2 != undefined){
      select2.options[0].label = (i18n.language=='fr') ? ' choisir ' :' choose ';

    }

    if(select3 != null && select3 != undefined){
      select3.options[0].label = (i18n.language=='fr') ? ' Choisir une classe ' :'  Select a class  ';

    }

    if(select4 != null && select4 != undefined){
      select4.options[0].label = (i18n.language=='fr') ? ' Choisir une classe ' :'  Select a class  ';

    }

    if(select5 != null && select5 != undefined){
      select5.options[0].label = (i18n.language=='fr') ? ' Choisir une periode ' :'  Select a period  ';

    }

    console.log("MsgBox Parent",currentUiContext.isParentMsgBox)

  }


  function showSideMenu2(e) {
    //currentUiContext.setIsParentMsgBox(false);
    const itemId = e.currentTarget.id
    setMenuItemPId(itemId);

    currentUiContext.setPreviousSelectedMenuID(currentUiContext.currentSelectedMenuID);
    currentUiContext.setCurrentSelectedMenuID(itemId);

    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    console.log("SCOLARITE GET EMP")
    axiosInstance.post(`get-current-emploi-de-temps/`, {
              id_sousetab: currentAppContext.currentEtab
          }).then((res)=>{
              console.log(res.data);
          res.data.matieres.map((m)=>{matieres.push(m)});
          res.data.classes.map((c)=>{classess.push(c)});
          res.data.ListMatieres.map((lm)=>{listMatieres.push(lm)});
          res.data.emploiDeTemps.map((em)=>{emploiDeTemps.push(em)});
          res.data.listProfs.map((lp)=>{listProfs.push(lp)});
          res.data.TAB_JOURS.map((j)=>{tab_jours.push(j)});
          res.data.TAB_PERIODES.map((p)=>{tab_periodes.push(p)});
          res.data.TAB_CRENEAU_PAUSE.map((p)=>{tab_creneau_pause.push(p)});
          res.data.TAB_VALEUR_HORAIRE.map((vh)=>{tab_valeur_horaire.push(vh)});
          
          currentUiContext.setClasseEmploiTemps(classess);
          currentUiContext.setListMatieres(listMatieres);
          currentUiContext.setListProfs(listProfs);
          currentUiContext.setIndexClasse(indexClasse);
          currentUiContext.setMatiereSousEtab(matieres);
          currentUiContext.setTAB_JOURS(tab_jours);
          currentUiContext.setTAB_PERIODES(tab_periodes);
          currentUiContext.setTAB_VALEUR_HORAIRE(tab_valeur_horaire);
          currentUiContext.setEmploiDeTemps(emploiDeTemps);
          currentUiContext.setTAB_CRENEAU_PAUSE(tab_creneau_pause);

          if(tab_valeur_horaire.length>0){
          currentUiContext.setIntervalleMaxTranche(tab_valeur_horaire[0]+"_"+tab_valeur_horaire[tab_valeur_horaire.length-1]);
        }
    })     
    console.log("MsgBox Parent",currentUiContext.isParentMsgBox) 
    
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

  function addNewStudent(){

  }

  function modifyStudent(){

  }

  function quitForm(){
    setModalOpen(0);
    currentUiContext.setIsParentMsgBox(true);
  }

  function showFicheView(){
    setModalOpen(3);
  }

  function showActivationSaisieView(){
    setModalOpen(4);
  }

  function showDossierAcadView(){
    setModalOpen(5);
  }

  function closeExamSession(){
    currentUiContext.setIsParentMsgBox(true);
    currentUiContext.setYearToClose(1);
    currentUiContext.showMsgBox({
      visible:true, 
      msgType : "question", 
      msgCode :"CLOSE_EXAMS",
      msgTitle: t("close_exam_M"), 
      message : t("close_exam_confirm") +'\<br\> '+t("close_exam_no_modif")+'\<br\> '+t("close_exam_ensure")
    })
  }

  
  return (

    <div className= {classes.viewContent}>
      {(modalOpen!=0)   && <BackDrop style={{height:'120vh'}}/>}
      {(modalOpen == 3) && <AddFicheProgess       formMode= {(modalOpen==1) ? 'creation': (modalOpen==2) ?  'modif' : 'consult'}  actionHandler={(modalOpen==1) ? addNewStudent : modifyStudent} cancelHandler={quitForm} />}
      {(modalOpen == 4) && <ActivateSequence      cancelHandler={quitForm} />}
      {(modalOpen == 5) && <SearchAcademicHistory cancelHandler={quitForm} />}
      
      <div className= {(isMobile)?  M_classes.pageTitle  : classes.pageTitle}>
        {(isMobile) ? null:< img src="images/scolariteP.png"  className={classes.imageMargin1} alt="my image"/>}
        <div className={(isMobile)? M_classes.titleHmself : classes.titleHmself}>         
          {t("scolariteM")}
        </div>
      </div>

      <div className= {getCurrentContaintTheme()}>
        {
        (currentAppContext.enableProfiles["SCOLARITE_A"]=='1') ? 
          <MenuItemListP minWtdhStyle={classes.size72Vw}  libelle= {t("enreg_admis")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["SCOLARITE_A1"]=='1') ?   <MenuItemP menuItemId ='100'  imgSource='images/NewStudent.png'        libelle={t("add_student")}         itemSelected={showSideMenu}>                                                           </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_A2"]=='1') ?   <MenuItemP menuItemId ='101'  imgSource='images/ListStudent.png'       libelle={t("consult_lists")}       itemSelected={showSideMenu}>                                                           </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_A6"]=='1') ?   <MenuItemP menuItemId ='105'  imgSource='images/ChangemtClass.png'     libelle={t('changemnt_class')}     itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3 : classes.imgStyleP}>       </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_A3"]=='1') ?   <MenuItemP menuItemId ='102'  imgSource='images/certificateP.png'      libelle={t("school_certificate")}  itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle4}>  </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_A4"]=='1') ?   <MenuItemP menuItemId ='103'  imgSource='images/PrintSchoolCard.png'   libelle={t("gen_cartes")}          itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1 : classes.customimgStyle8}> </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_A5"]=='1') ?   <MenuItemP menuItemId ='104'  imgSource='images/ConseilClasse.png'     libelle={t("conseils_classses")}   itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3 : classes.imgStyleP}>       </MenuItemP> : null}
            {/* {(currentAppContext.enableProfiles["SCOLARITE_A6"]=='1') ?   <MenuItemP menuItemId ='105'  imgSource='images/ClassSup.png'          libelle={t("classes_sup")}         itemSelected={showSideMenu} style={isMobile?{ marginBottom:'-2vh'}:null}>               </MenuItemP> : null} */}
          </MenuItemListP>
          :
          null
        }

        {(currentAppContext.enableProfiles["SCOLARITE_B"]=='1') ?
          <MenuItemListP minWtdhStyle={classes.size72Vw}   libelle= {t("schedule_courses")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["SCOLARITE_B1"]=='1') ? <MenuItemP menuItemId ='106' imgSource='images/Schedule.png'                            libelle={t("emploi_temps")}        itemSelected={showSideMenu}>                                                           </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_B2"]=='1') ? <MenuItemP menuItemId ='107' imgSource='images/lookSchedule.png'                        libelle={t("consult_ET")}          itemSelected={showSideMenu} style={isMobile?{ marginLeft:'0.83vw'}:null} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle4} > </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_B3"]=='1') ? <MenuItemP isModal={true} menuItemId ='108' imgSource='images/FicheProgession.png'      libelle={t("fiches_progression")}  itemSelected={showFicheView} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1P : classes.imgStyleP}>                                                  </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_B4"]=='1') ? <MenuItemP menuItemId ='109' imgSource='images/FicheProgession.png'                     libelle={t("suivi_fiche_p")}       itemSelected={showSideMenu}  customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1P : classes.imgStyleP}>                                                   </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_B5"]=='1') ? <MenuItemP menuItemId ='110' imgSource='images/ProgramClasse.png'                       libelle={t("programmes_classes")}  itemSelected={showSideMenu}  style={isMobile?{ marginLeft:'-0.089vw'}:null} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1P : classes.imgStyleP}>   </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_B6"]=='1') ? <MenuItemP menuItemId ='111' imgSource='images/CahierTexte.png'                         libelle={t("cahier_textes")}       itemSelected={showSideMenu}  style={isMobile?{ marginLeft:'-0.089vw'}:null} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle1P : classes.imgStyleP} >  </MenuItemP> : null}
          </MenuItemListP>
          :
          null
        }

        {(currentAppContext.enableProfiles["SCOLARITE_D"]=='1') ?
          <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("suivi_devoir_notes")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["SCOLARITE_D1"]=='1') ? <MenuItemP isModal={true} menuItemId ='118' imgSource='images/DossierAcad.png'       libelle={t("look_academic_history")}     itemSelected={showDossierAcadView}                                               customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4 : classes.customimgStyle6}>       </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_D2"]=='1') ? <MenuItemP isModal={true} menuItemId ='119' imgSource='images/activateNotes.png'     libelle={t("new_evaluation")}            itemSelected={showActivationSaisieView}                                          customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4 : classes.customimgStyle6}>       </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_D3"]=='1') ? <MenuItemP menuItemId ='120'                imgSource='images/SaveNotesP.png'        libelle={t("saisie_note")}               itemSelected={showSideMenu} style={isMobile?{marginLeft:'1vw'}:null}            customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4P : classes.customimgStyle4}>      </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_D4"]=='1') ? <MenuItemP menuItemId ='121'                imgSource='images/LookNotes.png'         libelle={t("consult_notes")}             itemSelected={showSideMenu} style={isMobile?{marginLeft:'0.33vw'}:null}          customImg={true} customImgStyle={isMobile ? M_classes.iconStyle3P1 :classes.customimgStyle5}>      </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_D5"]=='1') ? <MenuItemP menuItemId ='122'                imgSource='images/genBulletinsP.png'     libelle={t("generate_report")}           itemSelected={showSideMenu} style={isMobile?{marginLeft:'1vw', marginRight:'0.57vw', marginTop:'1vh', marginBottom:'-0.57vh'}:null} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle4}> </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_D6"]=='1') ? <MenuItemP menuItemId ='123'                imgSource='images/printReport.png'       libelle={t("print_report")}              itemSelected={showSideMenu} style={isMobile?{marginLeft:'1vw', marginRight:'0.57vw', marginTop:'1.9vh', marginBottom:'-0.57vh'}:null} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle : classes.customimgStyle4}> </MenuItemP> : null}
          </MenuItemListP>
          :
          null
        }

          
        {(currentAppContext.enableProfiles["SCOLARITE_C"]=='1') ?
          <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("discipline_assiduite")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["SCOLARITE_C1"]=='1') ? <MenuItemP menuItemId ='112'  imgSource='images/Appel.png'                 libelle={t("faire_appel")}              itemSelected={showSideMenu}>                                                                                            </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_C1"]=='1') ? <MenuItemP menuItemId ='113'  imgSource='images/lookPresence.png'          libelle={t("consult_appel")}            itemSelected={showSideMenu}>                                                                                            </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_C2"]=='1') ? <MenuItemP menuItemId ='114'  imgSource='images/ConseilDiscipline.png'     libelle={t("conseil_discipline")}       itemSelected={showSideMenu} customImg={true} customImgStyle={classes.customimgStyle3}>                                  </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_C3"]=='1') ? <MenuItemP menuItemId ='115'  imgSource='images/Studentprofile.png'        libelle={t("situation_eleve")}          itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4:classes.customimgStyle4}></MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_C4"]=='1') ? <MenuItemP menuItemId ='116'  imgSource='images/BilletEntreeSortie.png'    libelle={t("exit_entry_ticket")}        itemSelected={showSideMenu} customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4:classes.customimgStyle4}>                                                                                            </MenuItemP> : null}
            {/*(currentAppContext.enableProfiles["SCOLARITE_C5"]=='1') ? <MenuItemP menuItemId ='117'  imgSource='images/BilletSortie.png'          libelle={t("billet_sortie")}            itemSelected={showSideMenu} style={isMobile?{ marginBottom:'-2vh'}:null}>                                             </MenuItemP> : null*/}
          </MenuItemListP>
          :
          null
        }
        
        {(currentAppContext.enableProfiles["SCOLARITE_E"]=='1') ?
          <MenuItemListP minWtdhStyle={classes.size72Vw} libelle= {t("exams_officiels")} theme={selectedTheme}>
            {(currentAppContext.enableProfiles["SCOLARITE_E1"]=='1') ? <MenuItemP menuItemId ='124' imgSource='images/NewEvaluation.png'                 libelle={t("new_exam")}             itemSelected={showSideMenu}  style={isMobile?{marginLeft:'0.7vw', marginBottom:'-1vh'}:null}>                             </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_E2"]=='1') ? <MenuItemP menuItemId ='125' imgSource='images/saisiExam.png'                     libelle={t("saisi_resultats")}      itemSelected={showSideMenu}  customImg={true} customImgStyle={isMobile ? M_classes.iconStyle4P : classes.customimgStyle4}></MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_E3"]=='1') ? <MenuItemP menuItemId ='126' imgSource='images/ListAdmis.png'                     libelle={t("admis_exams")}          itemSelected={showSideMenu}  style={isMobile?{marginLeft:'0.7vw'}:null}>                                                  </MenuItemP> : null}
            {(currentAppContext.enableProfiles["SCOLARITE_E1"]=='1') ? <MenuItemP isModal={true} menuItemId ='127' imgSource='images/examClosed.png'  libelle={t("close_exam_session")}   itemSelected={closeExamSession} style={isMobile?{marginLeft:'0.7vw', marginBottom:'-1vh'}:{width:"7.3vw", height:"7.3vw", marginTop:"1vh", marginTop:"0.7vh", borderRadius:'1.3vw', marginBottom:'1vh'}}>                             </MenuItemP> : null}
          </MenuItemListP>
          :
          null
        }
         
      </div> 

      
                  
      <div id="side-menu" class="sidenav side-menu">
        <FormLayout formCode={curentMenuItemPId}>
          {/*-----SCOLARITE-1 : Enregistrement et admission en classe SUP----*/}
          {curentMenuItemPId== 100  && <ListeDesEleves formMode='ajout'/>      } 
          {curentMenuItemPId== 101  && <ListeDesEleves formMode='liste'/>      }
          {curentMenuItemPId== 102  && <CertificatScolarite/>                  }                    
          {curentMenuItemPId== 103  && <CarteScolaire formMode='generation'/>  }
          {curentMenuItemPId== 104  && <ConseilClasse formMode='ajout'/>       }
          {curentMenuItemPId== 105  &&  <ChangementClasse/>                    }          
          {/* {curentMenuItemPId== 105  && <AdmissionClasseSup/>           } */}
          
          {/*-------SCOLARITE-2 : Emploi de temps - cours et programmes------*/}
          {curentMenuItemPId== 106  && <EmploiDeTemps formMode='ajout'/>       }
          {curentMenuItemPId== 107  && <ConsultEmploiTemps/>                   }
          {curentMenuItemPId== 109  && <SuiviFicheProgress/>                   }
          {curentMenuItemPId== 110  && <ListManuelsScolaires/>                        } 
          {curentMenuItemPId== 111  && <CahierDeTexte currentClasse={null} currentMatiere={null}/> }

          {/*------SCOLARITE-3 : Suivi scolaire - examen de classe et Notes-----*/}
          {curentMenuItemPId== 120 && <SaveNotes noteMax={20}/>                   }
          {curentMenuItemPId== 121 && <ListingNotes/>                             }
          {curentMenuItemPId== 122 && <GenStudentReport/>                         }
          {curentMenuItemPId== 123 && <PrintStudentReport/>                       }
          {/*curentMenuItemPId== 121 && <SaveNotes noteMax={20}/>               */}
          
          {/*------------- SCOLARITE-4 : Discipline et assiduite --------------*/}
          {curentMenuItemPId== 112  && <Appel formMode='appel'/>                 }
          {curentMenuItemPId== 113  && <LookStudentPresence/>                    }
          {curentMenuItemPId== 114  && <ConseilDiscipline formMode='ajout'/>     }
          {curentMenuItemPId== 115  && <Studentprofile/>                         }
          {curentMenuItemPId== 116  && <BilletEntreeSortie/>                     }
          {/*curentMenuItemPId== 117  && <BilletSortie/>                           */}
          
          {/*------SCOLARITE-5 : Examen officiels------*/}
          {curentMenuItemPId== 124 && <NewOfficialExam/>                          }
          {curentMenuItemPId== 125 && <SaveExamNotes/>                            }
          {curentMenuItemPId== 126 && <ListAdmis/>                                }
         
        </FormLayout>     
      </div>
    </div>
  );
}

export default ScolaritePage;