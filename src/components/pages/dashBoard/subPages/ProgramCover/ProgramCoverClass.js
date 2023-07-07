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


function ProgramCoverClass(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [barchartData, setBarChartData] = useState([]);

    const [barchartDataLabels, setBarchartDataLabels] = useState(props.barchartDataLabels);
    const [barchartDataValues, setBarchartDataValues] = useState(props.barchartDataValues);

    
  useEffect(()=> {
    getData(props.selectedClass);
  },[]);

  const state = {
    // labels: ['6emes', '5emes', '4iemes', '3iemes', '2nds', '1eres', "Tles"],                
    labels: props.barchartDataLabels,                
    datasets: [{        
        label: t('couverture_pourcent'),
        backgroundColor: '#6800B4',
        borderColor: 'white',
        borderWidth: 1,
        data: props.barchartDataValues
    }]        
  };

const getData=(classseId)=>{

   /* axiosInstance.post(`getData/`, {
        id_class : classseId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        setBarChartData(res.data);       
    }) */  
    setBarChartData([65, 59, 80, 81, 56, 80, 90, 95]);
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
export default ProgramCoverClass;

