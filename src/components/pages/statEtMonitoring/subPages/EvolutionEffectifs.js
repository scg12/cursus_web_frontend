import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Select from 'react-select';

import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";
import {Bar} from 'react-chartjs-2';


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

var libelleClasse='';
var curentClasse=''
var suffixeClasse='';
var sectionTitle1 = "Evolution effectifs sur les 5 dernieres Annees";
var sectionTitle2 = "Evolution effectifs par sexe Sur les 5 dernieres Annees";


function EvolutionEffectifs(props){
    
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const [titleSuffix, setTitleSuffix] = useState('');
    const selectedTheme = currentUiContext.theme;

    useEffect(()=> {
        createGenChartStates(listProgressionsGen);
    },[]);

    var chartLegend ='Evolution generale des effectifs'

    function createGenChartStates(chartData){
        var resultDataTab=[];
        var currentBarChartData;
        var currentBarChartState;
        var titleGen = 'Evolution generale des effectifs sur les 5 dernieres annees'
        
        resultDataTab = chartData.split('*');       
           
        currentBarChartData = {
            label:'',
            backgroundColor: '#6800B4',
            borderColor:  'rgba(255,255,255,1)',
            borderWidth:2,
            data:[]
        };

        currentBarChartState =  {
            labels:[],
            datasets:[],
        }         
         
        currentBarChartData.label = chartLegend;
        currentBarChartData.data = resultDataTab[1].split('_');
        currentBarChartState.labels =  resultDataTab[0].split('_');;
        currentBarChartState.datasets.push({...currentBarChartData});

        var containerDiv = document.getElementById('effectifsGenProgressDiagramm');       
        ReactDOM.render(<EffectigProgressGenDiagram ChartTextTitle= {titleGen} state={currentBarChartState}/>,containerDiv);

    }

    const EffectigProgressGenDiagram=(props) =>{
        return(
            <Bar
                data={props.state}
                options={{
                    title:{
                        display:true,
                        text: props.ChartTextTitle, 
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

    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    const optClasse=[
        {value: '0',      label:'Choisir une classe' },
        {value: '6em1',   label:'6ieme 1'            },
        {value: '5em2',   label:'5ieme 2'            },
        {value: '4A2',    label:'4ieme A2'           },
        {value: '3E',     label:'3ieme Esp'          },
        {value: '2c1',    label:'2nd C1'             },
        {value: '1L',     label:'1ere L'             },
        {value: 'TD',     label:'Tle D'              }
    ];

    const listProgressionsGen = "2018_2019_2020_2021_2022*65_59_80_81_56";        

    const listProgressions =[
        "2018_2019_2020_2021_2022*65_59_80_81_56",
        "2018_2019_2020_2021_2022*85_80_82_65_57",
        "2018_2019_2020_2021_2022*84_82_84_58_68",
        "2018_2019_2020_2021_2022*65_80_80_48_74",
        "2018_2019_2020_2021_2022*65_59_90_81_79",
    ];


    const listProgressionsSexe =[
        "2018_2019_2020_2021_2022*65_59_80_81_56*27_45_87_32_28",
        "2018_2019_2020_2021_2022*85_80_82_65_57*43_35_85_32_24",
        "2018_2019_2020_2021_2022*84_82_84_58_68*13_35_23_32_24",
        "2018_2019_2020_2021_2022*65_80_18_48_74*43_35_85_32_24",
        "2018_2019_2020_2021_2022*65_59_23_81_79*30_35_80_32_24",
    ];

    
     
    function getProgressions(classe){
        switch(classe){
            case '6em1': return listProgressions[0] ;
            case '5em2': return listProgressions[1] ;
            case '4A2':  return listProgressions[3] ;
            case '3E':   return listProgressions[4] ;
            case '2c1':  return listProgressions[0] ;
            case '1E':   return listProgressions[1] ;
            case 'TE':   return listProgressions[2] ;
        }      
    }

    function getProgressionsSexe(classe){
        switch(classe){
            case '6em1': return listProgressionsSexe[0] ;
            case '5em2': return listProgressionsSexe[1] ;
            case '4A2':  return listProgressionsSexe[3] ;
            case '3E':   return listProgressionsSexe[4] ;
            case '2c1':  return listProgressionsSexe[0] ;
            case '1E':   return listProgressionsSexe[1] ;
            case 'TE':   return listProgressionsSexe[2] ;
        }      
    }

    const EffectifsProgressDiagram =(props) =>{
        return(
            <Bar
                data={props.state}
                options={{
                    title:{
                        display:true,
                        text: props.ChartTextTitle, 
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

    const EffectifsSexeProgressDiagram =(props) =>{
        return(
            <Bar
                data={props.state}
                options={{
                    title:{
                        display:true,
                        text: props.ChartTextTitle, 
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

    /******************************* Handlers *******************************/
    function EvolutionDiagram(classeId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(classeId!= undefined){        
            currentProgressionList = getProgressions(classeId);
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Evolution des effectifs en '+libelleClasse,
                        backgroundColor: 'rgb(221, 93, 19)',
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsProgressDiagramm');       
            ReactDOM.render(<EffectifsProgressDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsProgressDiagramm');  
            ReactDOM.render(null,containerDiv);
        }
                

        
    }

    function EvolutionDiagramSexe(classeId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif'+ ' en '+libelleClasse;
        if(classeId != undefined) {
            currentProgressionList = getProgressionsSexe(classeId);
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Garcons '+libelleClasse,
                        backgroundColor: 'rgb(14, 94, 199)',
                        borderColor: 'rgb(250, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    },
                    {
                        label: 'Filles '+libelleClasse,
                        backgroundColor: 'rgb(250, 19, 19)',
                        borderColor: 'rgb(250, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[2].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsSexeProgressDiagramm');       
            ReactDOM.render(<EffectifsSexeProgressDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsSexeProgressDiagramm');       
            ReactDOM.render(null,containerDiv);
        }        
    }

    function dropDownHandler(e){
        if(e.target.value != optClasse[0].value){
            curentClasse = e.target.value;
            var cur_index = optClasse.findIndex((index)=>index.value == curentClasse);
            libelleClasse = optClasse[cur_index].label;

            console.log(libelleClasse);
            suffixeClasse = ' en '+libelleClasse;     
        } else {
            curentClasse = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
        setTitleSuffix(suffixeClasse);          
        EvolutionDiagram(curentClasse);  
        EvolutionDiagramSexe(curentClasse);  
    }

/******************************* JSX Code *******************************/
    return (        
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle +' '+classes.margBottom3}>
                    TABLEAU DE BORD DE PRESENTATION DE L'EVOLUTION DES EFFECTIFS
                </div>
            </div>

            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle='Evolution Generale des effectifs dur les 5 dernieres annees'  itemSelected={null}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsGenProgressDiagramm' className={classes.inputRow33 +' '+ classes.spaceAround}/>
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                    CLASSE  :                       
                </div>
                <div>
                    <select onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optClasse||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>          
            
                
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle1 + titleSuffix}  itemSelected={null}> </FormPuce>
            <div id='effectifsProgressDiagramm' className={classes.inputRow33 +' '+ classes.spaceAround}/>
             
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle2 + titleSuffix}  itemSelected={null}> </FormPuce>
            <div id='effectifsSexeProgressDiagramm' className={classes.inputRow33 +' '+ classes.spaceAround}/>
                    

               
                   
            
            
            {/*<div className={classes.buttonRow+' '+classes.margLeft5 }>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}

                />
                                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable={(isValid == false)}
                />
                
            </div>*/}

            

        </div>
       
     );
 }
 
 export default EvolutionEffectifs;