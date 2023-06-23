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


function Assiduite(props){
  const { t, i18n } = useTranslation();
  const currentUiContext = useContext(UiContext);
  const currentAppContext = useContext(AppContext);
  const [DoughnutData, setDoughnutData] = useState([]);
    
  useEffect(()=> {
    if(props.selectedNiveau!='') getDataNiveau(props.selectedNiveau, props.codeAssiduite);
    else if (props.selectedClasse!='') getDataClasse(props.selectedClass, props.codeAssiduite);
    else  getDataMatiere(props.selectedMatiere, props.codeAssiduite);
    
  },[]);

  const labels1=['< 10h', '10h-20h', '> 20h'];
  const labels2=['< 3jours', '3jours-5jours', '> 5jours'];
  const labels3=['   < 3jours  ', '   3jours-5jours   ', '      > 5jours  ', 'Exclusion definitive'];

  const state = {
    labels: (props.codeAssiduite ==1) ? labels1 : (props.codeAssiduite ==2) ? labels2 : labels3 ,
    datasets: [{        
        label: 'couverture',
        backgroundColor: [
            '#B21F00',
            '#C9DE00',
            '#2FDE00',
            '#00A6B4',
            '#6800B4'
        ],
        hoverBackgroundColor: [
            '#501800',
            '#4B5000',
            '#175000',
            '#003350',
            '#35014F'
        ],
        data: DoughnutData
    }]  
  }  

  const getSelectedAssiduiteLabels=(codeAssidite)=>{
    switch(codeAssidite){
      case 1: return labels1; //Absence
      case 2: return labels2; //Consigne
      case 3: return labels3; //Exclusion
      default: return labels1; //Par defaut
    }
  }

  const getDataNiveau=(niveauId,codeAssiduite)=>{

    /* axiosInstance.post(`getData/`, {
        id_niveau : niveauId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    setDoughnutData([1500, 1000, 100]);
  }

  const getDataClasse=(classeId,codeAssiduite)=>{

    /* axiosInstance.post(`getData/`, {
          id_class : classseId,
          id_sousetab:currentAppContext.currentEtab,        
          
      }).then((res)=>{
          console.log(res.data);
          setBarChartData(res.data);       
      }) */  
      setDoughnutData([300, 200, 150, 90]);
  }

  const getDataMatiere=(matiereId,codeAssiduite)=>{

    /* axiosInstance.post(`getData/`, {
        id_class : classseId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    setDoughnutData([100, 50, 70, 3]);
  }



  return(
    <Doughnut
        data={state}
            options={{
                title:{
                    display:true,
                    text:'Taux de couverture',
                    fontSize:20
                },
                legend:{
                    display:true,
                    position:'left'
                }
        }}
    />
  );
}
export default Assiduite;

