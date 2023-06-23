import React from 'react';
import classes from "./Book.module.css";

import CustomButton from '../customButton/CustomButton';
import Cover from '../book/Cover';
import TableOfContents from './TableOfContents'; 
import Sheet from '../book/Sheet';

import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';
import { useContext, useState } from "react";

import {LISTE_LECONS, TO_LEFT_SHEETS, TO_RIGHT_SHEETS, TAB_ETATLESSONS} from './CT_Module';
import {createModule, initToLeftSheets, initToRightSheets, addSheetOnRight} from './CT_Module';

var contenu = {

    date:'25/06/2022',
    libelleChapitre:'Chapitre Test',
    libelleLecon:'Lecon Test',
    resume:'Que Du blabla',
    previousId:'coverture'
}

function Book(props){

  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);

  const [isValid, setIsValid] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const selectedTheme = currentUiContext.theme;

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

  /*var modulesStringMap ={};
  modulesStringMap["module0"] =  "Premier Module";
  modulesStringMap["module1"] =  "Second Module";
  modulesStringMap["module2"] =  "Troisieme Module";

  var modulesString = [
    "chap1_NomChap1#lesson1_NomLesson1*lesson2_NomLesson2*lesson3_NomLesson3#chap2_NomChap2#lesson4_NomLesson4*lesson5_nomlesson5",
    "chap3_NomChap3#lesson6_NomLesson6*lesson7_nomLesson7#chap4_nomChap4#lesson8_nomLesson8*lesson9_nomLesson9",
    "chap5_NomChap5#lesson10_NomLesson10*lesson11_NomLesson11*lesson12_NomLesson12#chap6_NomChap6#lesson13_NomLesson13*lesson14_nomlesson14",
  ]*/
  

    
  function openBook(){
    var couverture = document.getElementById("coverture");
    var preface =  document.getElementById("preface");
    var sheet;       

    if (!bookOpen){            
      //TO_LEFT_SHEETS=[];
      //TO_RIGHT_SHEETS = [];
      initToLeftSheets();
      initToRightSheets();

      //createModule();
      //currentAppContext.setEtatLesson(TAB_ETATLESSONS);
      setBookOpen(true);
     
      console.log('Etats des lecon',TAB_ETATLESSONS);

      if(couverture.classList.contains('moveToRight3')){
        couverture.classList.replace('moveToRight3','moveToLeft1');
      } else{
        couverture.classList.add('moveToLeft1');
      }
      couverture.style.marginLeft ='-45.7vw';
      
      preface.classList.add('moveToRight1'); 
      preface.style.marginLeft ='15vw';

      //TO_RIGHT_SHEETS.push('preface');
      addSheetOnRight('preface');

      for(var i=0; i<LISTE_LECONS.length; i++){
          sheet = document.getElementById(LISTE_LECONS[i].lessonId);
          if(sheet!=null){
          //TO_RIGHT_SHEETS.push(LISTE_LECONS[i].lessonId);
          addSheetOnRight(LISTE_LECONS[i].lessonId);
          sheet.style.marginLeft='15vw';
        }               
      }  
  
    } else {
      if(!currentUiContext.bookInActivity){
        setBookOpen(false);
      
        if(preface.classList.contains('moveToRight1')){
          preface.classList.remove('moveToRight1');
        }

        /***Pour toutes les feuilles ouvertes, les fermer***/
        if (TO_LEFT_SHEETS.length > 0){
          for(var i=0; i<TO_LEFT_SHEETS.length; i++) {
              
            sheet = document.getElementById(TO_LEFT_SHEETS[i]);
            if(sheet.classList.contains('moveToLeft2')){
                sheet.classList.remove('moveToLeft2');
            }
            if (sheet!=preface) sheet.style.zIndex='1997';
            sheet.style.marginLeft ='0vw';
            //TO_LEFT_SHEETS.splice(i,1);
          }  
        }

        if(TO_RIGHT_SHEETS.length > 0){
          for(var i=0; i<TO_RIGHT_SHEETS.length; i++) {
            sheet = document.getElementById(TO_RIGHT_SHEETS[i]);
            if(sheet.classList.contains('moveToRight2')){
                sheet.classList.remove('moveToRight2');
            }
            if (sheet!=preface) sheet.style.zIndex='1997';
            sheet.style.marginLeft ='0vw';
            //TO_RIGHT_SHEETS.splice(i,1);                    
          }
        }
      
        /*Fermer la couverture */
        couverture.classList.replace('moveToLeft1','moveToRight3');
        couverture.style.marginLeft ='0vw'; 

        initToLeftSheets();
        initToRightSheets();
        
        //TO_LEFT_SHEETS=[];
        //TO_RIGHT_SHEETS=[];                      
      } 
        
    }      
      
  }

  return( 
    <div className={classes.bookContainer}>
      <Cover  id='coverture' 
        openText={(bookOpen)? props.closeBookText:props.openBookText} 
        openBookHandler={openBook}
        currentClasse={props.currentClasse} 
        currentMatiere={props.currentMatiere}
      />           
      <TableOfContents id='preface'/>
      {(LISTE_LECONS||[]).map((lecon, index) => {
          return (
            <Sheet rang={index} bd_id={lecon.id} id={lecon.lessonId} contenu ={lecon} etat ={lecon.etat}/>
          );
      })}                      
    </div>
          
  );
}
export default Book;