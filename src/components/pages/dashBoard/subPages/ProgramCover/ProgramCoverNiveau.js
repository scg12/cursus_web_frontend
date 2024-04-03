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


function ProgramCoverNiveau(props){
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    // const [DoughnutData, setDoughnutData] = useState([70,30]);
    const [DoughnutData, setDoughnutData] = useState(props.DoughnutData);
    
  useEffect(()=> {
    // getData(props.selectedNiveau);
    console.log("useEffect...")
  },[]);

let state = {
    labels:['       %'+t('couvert'), '% '+t('non_couvert')],
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
        data: props.DoughnutData
    }]
  
};


function getData(niveauId){
    console.log("SALUT: ",niveauId);
    axiosInstance.post(`program-cover-niveau/`, {
        id_niveau : niveauId,
        id_sousetab:currentAppContext.currentEtab,        
        
    }).then((res)=>{
        console.log(res.data);
        // setDoughnutData(res.data);       
    }) 
    setDoughnutData([70,30]);
}

    return(
        
        <Doughnut id={props.id}
            data={state}
                options={{
                    title:{
                        display:true,
                        text:'Taux de couverture',
                        fontSize:20
                    },
                    legend:{
                        display:true,
                        position:'left',
                        // fontSize:"20vw"
                    }
            }}
            
        />

      
        
    )
}
export default ProgramCoverNiveau;

