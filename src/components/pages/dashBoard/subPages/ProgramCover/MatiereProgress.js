import React from 'react';
import classes from "../../DashBoardPage.module.css";
import CustomButton from '../../../../customButton/CustomButton';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {createCTStructure} from "../../../../book/CT_Module";
import M from 'materialize-css';
import axiosInstance from '../../../../../axios';

// import UiContext from "../../../../store/UiContext";
// import AppContext from '../../../../store/AppContext';
// import { useContext, useState, useEffect } from "react";
// import axiosInstance from '../../../../axios';
// import MsgBox from '../../../msgBox/MsgBox';
// import BackDrop from "../../../backDrop/BackDrop";
// import { alpha, styled } from '@mui/material/styles';
// import { DataGrid, gridClasses } from '@mui/x-data-grid';
// import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var groupWidth;

const MatiereProgress = (props) =>{
    const { t, i18n } = useTranslation();

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
        // console.log('parpapa', tabResult)
        if (tabResult.length==1) return 1;
        if((pos >= 0)&&(pos<=tabResult.length-1)) return tabResult[pos];
        else return undefined;    
    }

    function accessCTHandler(){
        const menus = document.querySelectorAll('.side-menu');
        M.Sidenav.init(menus, {edge: 'right'});
        var id_cours = document.getElementById("matiereId").value;
        console.log("id_cours: ",id_cours)
        createFicheProgression(id_cours);
    }

    const createFicheProgression=(coursId)=>{  
        let cts = [];
        let mods = [];
        let chaps = [];
        // axiosInstance.post(`get-fiche-progression/`, {
        axiosInstance.post(`get-cahier-texte/`, {
            id_cours: coursId,
        }).then((res)=>{
            // console.log('fiche progress:', res.data);
            res.data.cts.map(item=>cts.push(item));
            res.data.mods.map(item=>mods.push(item));
            res.data.chaps.map(item=>chaps.push(item));
    
            console.log("cts: ",cts);
            console.log(mods);
            console.log(chaps);
            createCTStructure(coursId,cts);   
            /*currentAppContext.setEtatLesson(TAB_ETATLESSONS)
            console.log('etats', currentAppContext.etatLesson)*/                     
        }) 
    }
    
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
            <ProgressBar style={{width:(groupWidth-3)+'vw', height:'2vh' /*height: (groupWidth==12) ?'3vh':'7vh'*/}}  striped variant= {getProgressColor(getStringAtPosition(props.matiereInfo,1))} now= {getStringAtPosition(props.matiereInfo,2)} key={1}/>
        </div>              
    );
  } 
  export default MatiereProgress;

