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


function FraisClasse(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [barchartData, setBarChartData] = useState([]);
    
  useEffect(()=> {
    if(props.selectedNiveau!='') getDataNiveau(props.selectedNiveau, props.isSchoolFees);
    else getDataClasse(props.selectedClass, props.isSchoolFees);
    
  },[]);

  const state = (props.selectedNiveau!='') ? 
  {
    labels: ['En regle', '1ere tranche','2ieme tranche','non paye' ],                
    datasets: [{        
        label: (props.isSchoolFees) ? t('frais_scolariteP') : t('other_fees'),
        backgroundColor:  (props.isSchoolFees) ? 'rgb(55 192 17)': 'blue',
        borderColor: 'white',
        borderWidth: 1,
        data: barchartData
    },
  ]}
  
    :

  {
    labels: ['En regle', '1ere tranche','2ieme tranche','non paye' ],                
    datasets: [{        
        label: (props.isSchoolFees) ? t('frais_scolariteP') : t('other_fees'),
        backgroundColor:  (props.isSchoolFees) ? 'rgb(59 93 173)': 'rgb(55 192 17)',
        borderColor: 'white',
        borderWidth: 1,
        data: barchartData
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
    setBarChartData([1500, 1500, 2000, 1500]);
}

const getDataNiveau=(niveauId,isInscrits)=>{

  /* axiosInstance.post(`getData/`, {
       id_class : classseId,
       id_sousetab:currentAppContext.currentEtab,        
       
   }).then((res)=>{
       console.log(res.data);
       setBarChartData(res.data);       
   }) */  
   setBarChartData([1500, 1500, 2000, 1500]);
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
export default FraisClasse;

