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


function Effectifs(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    // const [barchartData, setBarChartData] = useState([]);
    
    // const [barchartData, setBarChartData] = useState(props.selectedNiveau!=''?props.BarChartData:props.BarchartClasseData);
    const [barchartData, setBarChartData] = useState(props.BarChartData);
    // const [BarchartClasseData, setBarchartClasseData] = useState(props.BarchartClasseData);
    
  useEffect(()=> {
    if(props.selectedNiveau!='') getDataNiveau(props.selectedNiveau, props.isInscrits);
    else getDataClasse(props.selectedClass, props.isInscrits);
    
  },[]);

  const state = (props.selectedNiveau!='') ? 
  {
    labels: ['Total', 'Garçons','Filles' ],                
    datasets: [{        
        label: (props.isInscrits) ? t('effectifs_inscrit')  : t('effectifs_total'),
        backgroundColor:  (props.isInscrits) ? ['grey','rgb(53, 119, 241)','rgb(222 8 51)']: ['grey','rgb(53, 119, 241)','rgb(222 8 51)'],
        borderColor: 'white',
        borderWidth: 1,
        data: props.BarchartData
    },
  ]}
  
    :

  {
    labels: ['Total', 'Garçons','Filles' ],                
    datasets: [{        
        label: (props.isInscrits) ? t('effectifs_inscrit')  : t('effectifs_total'),
        backgroundColor:  (props.isInscrits) ? ['grey','rgb(53, 119, 241)','rgb(222 8 51)']: ['grey','rgb(53, 119, 241)', 'rgb(222 8 51)'],
        borderColor: 'white',
        borderWidth: 1,
        data: props.BarchartData
    },
  ]};

const getDataClasse=(classeId,isInscrits)=>{

   /* axiosInstance.post(`getData/`, {
        id_class : classseId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    setBarChartData(props.BarchartClasseData);
}

const getDataNiveau=(niveauId,isInscrits)=>{

  /* axiosInstance.post(`getData/`, {
       id_class : classseId,
       id_sousetab:currentAppContext.currentEtab,        
       
   }).then((res)=>{
       console.log(res.data);
       setBarChartData(res.data);       
   }) */  
   setBarChartData(props.BarChartData);
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
export default Effectifs;

