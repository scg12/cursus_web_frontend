import React from "react";
import { useTranslation } from "react-i18next";
import classes from '../../subPages/subPages.module.css';
import M_classes from '../../subPages/M_subPages.module.css';
import {isMobile} from 'react-device-detect';
import { useState, useEffect, useContext } from "react";
import UiContext from '../../../../../store/UiContext';
import AppContext from "../../../../../store/AppContext";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Bar,Line,Doughnut} from 'react-chartjs-2';
import ReactDOM from 'react-dom';
import axiosInstance from '../../../../../axios';
import MsgBox from "../../../../msgBox/MsgBox";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
  } from 'chart.js'; 

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend   
  );

var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;
const ROWS_PER_PAGE= 40;


function Resultats(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [barchartData, setBarChartData] = useState(props.BarChartData);
    
  useEffect(()=> {
    if(props.selectedNiveau!='') getDataNiveau(props.selectedNiveau, props.codeResultat);
    else if (props.selectedClasse!='') getDataClasse(props.selectedClass, props.codeResultat);
    else  getDataMatiere(props.selectedMatiere, props.codeResultat);
    
  },[]);

  const labels1=['Moy < 10/20', '10/20-12/20', '12/20-14/20', '14/20-16/20', 'Moy > 17/20'];
  const labels2=['BACC', 'Probatoire', 'BEPC'];
  

  const state = (props.selectedNiveau!='') ? 
  {
    labels: props.LabelsResult,                
    datasets: [{        
        // label: (props.codeResultat==1) ? 'Resultats scolaires ' : 'Examens Officiels ',
        label: 'Resultats scolaires ',
        backgroundColor:  (props.codeResultat) ? 'green': 'blue',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: props.BarchartData
    },
  ]}
  
    :(props.selectedClass!='')?

      {
        labels: props.LabelsResult,               
        datasets: [{        
            // label: (props.codeResultat==1) ? 'Resultats scolaires ' : 'Examens Officiels ',
            label: 'Resultats scolaires ',
            backgroundColor:  (props.codeResultat==2) ? 'grey': 'rgb(72 107 218)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: props.BarchartData
        },
      ]}
    :
    {
      labels: props.LabelsResult,               
      datasets: [{        
          // label: (props.codeResultat==1) ? 'Resultats scolaires ' : 'Examens Officiels ',
          label: 'Resultats scolaires ',
          backgroundColor:  (props.codeResultat==2) ? 'grey': 'rgb(72 107 218)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          data: props.BarchartData
      },
  ]};


const getDataNiveau=(niveauId,codeResultat)=>{

  /* axiosInstance.post(`getData/`, {
        id_class : classseId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    // if(codeResultat==1)  setBarChartData([30,40,15,12,5]);
    // else setBarChartData([56, 45, 62]);
    setBarChartData(props.BarchartDataResultNiveau);
}

const getDataClasse=(classeId,codeResultat)=>{

   /* axiosInstance.post(`getData/`, {
        id_class : classseId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    // if(codeResultat==1)  setBarChartData([30,40,15,12,5]);
    // else setBarChartData([70, 65, 52]);
    setBarChartData(props.BarChartData);
}


const getDataMatiere=(matiereId,codeResultat)=>{

  /* axiosInstance.post(`getData/`, {
       id_matiere : matiereId,
       id_sousetab:currentAppContext.currentEtab,        
       
   }).then((res)=>{
       console.log(res.data);
       setBarChartData(res.data);       
   }) */  
  setBarChartData([30,40,15,12,5]);
   
}





    return(
        <Bar
            data={state}
            options={{
                title:{
                display:true,
                text:'Taux de couverture par classe',
                fontSize:20
                },
                legend:{
                display:true,
                position:'right'
                }
            }}
        />
    );
}
export default Resultats;

