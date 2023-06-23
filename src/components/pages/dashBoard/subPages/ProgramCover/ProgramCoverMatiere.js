import React from "react";
import ReactDOM from 'react-dom';


import classes from '../../DashBoardPage.module.css';
import M_classes from '../../subPages/M_subPages.module.css';
import {isMobile} from 'react-device-detect';
import { useState, useEffect, useContext } from "react";

import UiContext from '../../../../../store/UiContext';
import AppContext from "../../../../../store/AppContext";


import ProgressBar from 'react-bootstrap/ProgressBar';
import CustomButton from "../../../../customButton/CustomButton";

import { useTranslation } from "react-i18next";

import axiosInstance from '../../../../../axios';
import MsgBox from "../../../../msgBox/MsgBox";
import M from 'materialize-css';


var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;

var groupWidth;


function ProgramCoverNiveau(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
   
    
  useEffect(()=> {
    createProgressionMatieres(props.selectedMatiere.id);
  },[props.selectedMatiere.id]);



  function getMatieres(classe){
    switch(classe){
      case 0  :  return listMatieres[0] ;
      case 1  :  return listMatieres[1] ;
      case 2  :  return listMatieres[2] ;
      case 3  :  return listMatieres[3] ;
      case 4  :  return listMatieres[4] ;
      case 5  :  return listMatieres[5] ;
      case 6  :  return listMatieres[6] ;
      case 7  :  return listMatieres[7] ;
    }      
  }   
  
  function getProgressColor(matiereCode){
    switch(matiereCode){
        case '1': return 'success' ;
        case '2': return 'info' ;
        case '3':  return 'warning' ;
        case '4':  return 'danger' ;           
    }      
  }

  
  function getStringAtPosition(examSting,pos){
      
    var tabResult = examSting.split('*');
    console.log('parpapa', tabResult)
    if (tabResult.length==1) return 1;
    if((pos >= 0)&&(pos<=tabResult.length-1)) return tabResult[pos];
    else return undefined;    
  }

  function createProgressionMatieres(matiere){
    var tabMatieres=[];
    var listMat;
    var matTab=[];
    var groupCount;
    var parentDiv,j;
    
  
    //initialisation de la div conteneur.
    parentDiv = document.getElementById('matieresProgress');
    groupCount = parentDiv.childNodes.length;
    
    if(groupCount>0){           
        for(var i = 1; i <= groupCount; i++){
            document.getElementById('sousGroupe'+i).remove();
        }
    }    
    if(matiere != undefined) {
        //Recuperation De la liste des matieres avc leur infos.        
        listMat = getMatieres(matiere);
  
        //Extraction du nombre de groupes et calcul de la largeur d'un groupe. 
        matTab = listMat.split('+');
        groupCount = matTab[0];
        if(groupCount==1) {
            groupWidth = 12
        }
        else{
          groupWidth = (Math.round(40/groupCount)-7)
        }
        //groupWidth = (groupCount!=0)? (groupCount==2)? 40: (Math.round(40/groupCount)-7) :40;
  
        //Creation du tableau des matieres.
        tabMatieres = matTab[1].split('_');
    
        //Creation des sous Divs conteneurs et
        //Ajout des matieres avec leur progression.
        for (var i = 1; i <=groupCount; i++) {
            var cell = document.createElement('div');
            cell.id='sousGroupe'+i;
            cell.className=classes.matiereProgress;
            cell.style.width = groupWidth;
            /*cell.style.fontWeight='bold';
            cell.textContent='Matieres du Groupe '+i; */
  
            parentDiv.appendChild(cell);
  
            for (var j = 0; j < tabMatieres.length; j++) {  
                if(getStringAtPosition(tabMatieres[j],1)==i){
                    var sousDiv = document.createElement('div');
                    sousDiv.className= classes.inputRowLeft;
                    document.getElementById('sousGroupe'+i).appendChild(sousDiv);
                    ReactDOM.render(<MatiereProgress matiereInfo={tabMatieres[j]}/>,sousDiv)
                }                    
            }         
        }
    } 
  }



  const listMatieres = [
    "3+Allemand*1*78_Francais*1*84_Anglais*1*62_Histoire*2*73_ECM*2*75_SVT*2*82_PCT*2*93_Maths*2*72_Sport*3*100_TM*3*100_ESF*3*100",
    "1+Anglais*1*84_Mr ATEBA Bilahi",
    '1+Allemand*1*50_Mme ELIMBI Cecile',
    "1+Maths*1*75_Mme BATHIA Bertine",
    "1+PCT*1*85_Mr EVINA Samson",
    "1+SVT*1*75_Mr TEUKAM Simplice",
    "1+Histoire*1*65_Mr MBARGA Elvis",
    "1+Geographie*1*95_Mr MALAMBO Hubert",  
  ];


  function accessCTHandler(e){
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});

    /*var select1 = document.getElementById('selectId1');
    var select2 = document.getElementById('selectId2');

    if(select1 != null && select1 != undefined){
        select1.options[0].label = (i18n.language=='fr') ? ' choisir ' :' choose ';
  
    }
  
    if(select2 != null && select2 != undefined){
        select2.options[0].label = (i18n.language=='fr') ? ' choisir ' :' choose ';
  
    }*/
  }
  
    

  const MatiereProgress = (props) =>{
    return(   
        (getStringAtPosition(props.matiereInfo,0)==1) ?
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', marginBottom:'-2vh', marginLeft:'1.3vh'}} className='sidenav-trigger' data-target='side-menu'>
            <div  style={{fontWeight:'900', marginRight:'1vw'}}>Enseignant :{props.matiereInfo} </div>

            <CustomButton
                btnText={t("access_book")} 
                buttonStyle={classes.Theme1_BtnstyleConfig}
                btnTextStyle = {classes.btnTextStyle}
                hasIconImg= {false}
                btnClickHandler={accessCTHandler}
                //disable={(isValid==true)}
            />
        </div>       
        :        
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', marginBottom:'-2vh', marginLeft:'1.3vh'}}>
          <div style={{display:'flex', flexDirection:'row'}}>
             <div  style={{fontWeight:'900'}}>{getStringAtPosition(props.matiereInfo,0)} </div>
             <div style={{fontWeight:'900'}}>{'('+getStringAtPosition(props.matiereInfo,2)+'%)' }</div>          
          </div>           
            <ProgressBar style={{width:(groupWidth-3)+'vw', height: (groupWidth==12) ?'2vh':null}}  striped variant= {getProgressColor(getStringAtPosition(props.matiereInfo,1))} now= {getStringAtPosition(props.matiereInfo,2)} key={1}/>
        </div>              
    );
  }
  
  


    return(
        <div id='matieresProgress' style={{fontSize:'0.7vw', display:'flex', flexDirection:'row', justifyContent:'center'}}>

        </div>
    )
}
export default ProgramCoverNiveau;

