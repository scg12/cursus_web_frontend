import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from '../../../customButton/CustomButton';
import Sheet from '../../../book/Sheet';
import TableOfContents from '../../../book/TableOfContents';
import Book from '../../../book/Book';
import UiContext from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import {LESSON, CHAPITRE, MODULE, TAB_MODULES, TAB_CHAPITRE, TAB_LESSON, TAB_ETATLESSONS} from "../../../../store/SharedData/DndLists"
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';


function CahierDeTexte(props){

  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);

  const [isValid, setIsValid] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  
  
  const { t, i18n } = useTranslation();
  const selectedTheme = currentUiContext.theme;

  useEffect(()=> {
    currentAppContext.setEtatLesson(TAB_ETATLESSONS);
    console.log(TAB_ETATLESSONS, currentAppContext.etatLesson);
  },[]);


    


  

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
      }
    }
    
    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }


    var modulesStringMap ={};
    modulesStringMap["module0"] =  "Premier Module";
    modulesStringMap["module1"] =  "Second Module";
    modulesStringMap["module2"] =  "Troisieme Module";
  
    var modulesString = [
      "chap1_NomChap1#lesson1_NomLesson1*lesson2_NomLesson2*lesson3_NomLesson3#chap2_NomChap2#lesson4_NomLesson4*lesson5_nomlesson5",
      "chap3_NomChap3#lesson6_NomLesson6*lesson7_nomLesson7#chap4_nomChap4#lesson8_nomLesson8*lesson9_nomLesson9",
      "chap5_NomChap5#lesson10_NomLesson10*lesson11_NomLesson11*lesson12_NomLesson12#chap6_NomChap6#lesson13_NomLesson13*lesson14_nomlesson14",
    ]
  

    function createModule() {
        var modulesTab, chapTab, lessonTab,lesson,j;
        //var tab_Module = [];
    
        TAB_MODULES = [];
        TAB_CHAPITRE={};
        TAB_LESSON ={};
    
        for(var i=0; i < modulesString.length; i++){
          MODULE ={}
          MODULE.moduleId = 'module'+i;
          MODULE.libelleModule = modulesStringMap[MODULE.moduleId];
          MODULE.tabChapitre = [];
          TAB_MODULES[i] = {...MODULE};
          TAB_CHAPITRE['module'+i] =[];
        }
    
        for(var i=0; i < modulesString.length; i++){
          modulesTab = modulesString[i].split('#');
          
          j = 0;
          while(j < modulesTab.length-1) {
            chapTab = modulesTab[j].split('_');
            CHAPITRE={}
            CHAPITRE.chapitreId = chapTab[0];
            CHAPITRE.libelleChapitre = chapTab[1];
            TAB_CHAPITRE['module'+i].push(CHAPITRE);
    
            CHAPITRE.tabLesson = [];
            TAB_LESSON[CHAPITRE.chapitreId] = [];
    
            lessonTab = modulesTab[j+1].split('*');
            
            for(var k = 0; k <lessonTab.length; k++){
              lesson = lessonTab[k].split('_');
              LESSON={};
              LESSON.lessonId = lesson[0];
              LESSON.libelleLesson = lesson[1];
              LESSON.etat = lesson[2];
              LESSON.contenu = '';
    
              TAB_LESSON[CHAPITRE.chapitreId].push(LESSON);
              CHAPITRE.tabLesson.push(LESSON);             
            }
                    
            TAB_MODULES[i].tabChapitre.push(CHAPITRE);        
            j= j+2;            
          }
        }
      }
    

    
    

    function openBook(){
        var couverture = document.getElementById("coverture");
        var feuille =  document.getElementById("preface");
       
        if (couverture.style.marginLeft =='-45.7vw'){
            
          setBookOpen(false);
          if(couverture.classList.contains('openBook')){
              couverture.classList.remove('openBook');
          }

          if(feuille.classList.contains('openSheet')){
              feuille.classList.remove('openSheet');
          }

          //couverture.classList.remove('openBook');
          couverture.classList.add('closeBook'); 
          couverture.style.marginLeft ='0vw';
          
          //feuille.classList.remove('openSheet');  
          feuille.classList.add('closeSheet'); 
          feuille.style.marginRight ='0vw';
            
           

        } else {

          createModule();

          setBookOpen(true);

          if(couverture.classList.contains('closeBook')){
              couverture.classList.remove('closeBook');
          }

          if(feuille.classList.contains('closeSheet')){
              feuille.classList.remove('closeSheet');
          }
          
          couverture.classList.add('openBook'); 
          couverture.style.marginLeft ='-45.7vw';
        
  
          feuille.classList.add('openSheet'); 
          feuille.style.marginRight ='-15vw';           
            
        }     
                         
    }

    return(
        <Book 
          currentClasse={props.currentClasse} 
          currentMatiere={props.currentMatiere}
          openBookText= {t("open_lesson_book")} 
          closeBookText={t("close_lesson_book")} 
        /> 

    );
}
export default CahierDeTexte;