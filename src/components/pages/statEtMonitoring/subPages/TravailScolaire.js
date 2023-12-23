import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Select from 'react-select';

import UiContext  from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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

var currentCycle  = 0
var currentNiveau = 0
var currentClasse  = 0;

var suffixeClasse='';
var sectionTitle1 = "Evolution effectifs sur les 5 dernieres Annees";
var sectionTitle2 = "Evolution effectifs par sexe Sur les 5 dernieres Annees";

var selected_cycle;
var selected_niveau;
var selected_classe;


function TravailScolaire(props){
    
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();

    const [isValid, setIsValid] = useState(false);
    const [titleSuffix, setTitleSuffix] = useState('');
    const selectedTheme = currentUiContext.theme;

    const [optCycle, setOptCycle]   = useState([]);   
    const [optNiveau, setOptNiveau] = useState([]);
    const [optClasse, setOptClasse] = useState([]);
    

    useEffect(()=> {

        getEtabCycles();
        getEtabNiveaux();
        getEtabClasses();
        
        //setTitleSuffix(suffixeClasse);  
        /*---- Stats ETAB ----*/        
        drawEffectifGenEtab(currentAppContext.currentEtab);  
        drawEffectifEtabParSexe(currentAppContext.currentEtab);  

        /*---- Stats CYCLE ----*/
        drawEffectifParCycle(currentCycle);  
        drawEffectifParCycleParSexe(currentCycle);   

        /*---- Stats NIVEAU ----*/
        drawEffectifParNiveau(currentClasse);  
        drawEffectifParNiveauParSexe(currentClasse); 

        /*---- Stats CLASSE ----*/
        drawEffectifParClasse(currentClasse);  
        drawEffectifParClasseParSexe(currentClasse); 

    },[]);

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



    function getEtabCycles(){
        var tempTable=[]
        var tabCycles=[];
         
        tabCycles =  currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab)
        tabCycles.map((cycle)=>{
            tempTable.push({value:cycle.id_cycle, label:cycle.libelle});
        });
        selected_cycle = tempTable[0].value;
        setOptCycle(tempTable);
    }

    function getEtabNiveaux(){
        var tempTable=[]
        var tabNiveau=[];
         
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab)
        tabNiveau.map((nivo)=>{
            tempTable.push({value:nivo.id_niveau, label:nivo.libelle});
        });
        selected_niveau = tempTable[0].value;
        setOptNiveau(tempTable);
    }

    function getEtabClasses(){
        var tempTable=[]
        var tabClasses=[];
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
        });
        selected_classe = tempTable[0].value;
        setOptClasse(tempTable);
    }

    // const optClasse=[
    //     // {value: '0',      label:'Choisir une classe' },
    //     {value: '6em1',   label:'6ieme 1'            },
    //     {value: '5em2',   label:'5ieme 2'            },
    //     {value: '4A2',    label:'4ieme A2'           },
    //     {value: '3E',     label:'3ieme Esp'          },
    //     {value: '2c1',    label:'2nd C1'             },
    //     {value: '1L',     label:'1ere L'             },
    //     {value: 'TD',     label:'Tle D'              }
    // ];

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

    const SimpleBarDiagram =(props) =>{
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

    const GenderBarDiagram =(props) =>{
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
    function drawEffectifGenEtab(etabId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(etabId!= undefined){        
            currentProgressionList = getProgressions('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Evolution des effectifs en '+libelleClasse,
                        backgroundColor: '#0fa09a',
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsGenEtab');       
            ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsGenEtab');  
            ReactDOM.render(null,containerDiv);
        }
    }

    function drawEffectifEtabParSexe(etabId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif'+ ' en '+libelleClasse;
        if(etabId != undefined) {
            currentProgressionList = getProgressionsSexe('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Garcons '+libelleClasse,
                        backgroundColor: '#32a306',
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
            containerDiv = document.getElementById('effectifsEtabParSexe');       
            ReactDOM.render(<GenderBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsEtabParSexe');       
            ReactDOM.render(null,containerDiv);
        }        
    }


    function drawEffectifParCycle(cycleId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(cycleId!= undefined){        
            currentProgressionList = getProgressions('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Evolution des effectifs en '+libelleClasse,
                        backgroundColor: '#0fa09a',
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsEtabParCycle');       
            ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsEtabParCycle');  
            ReactDOM.render(null,containerDiv);
        }
    }

    function drawEffectifParCycleParSexe(cycleId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif'+ ' en '+libelleClasse;
        if(cycleId != undefined) {
            currentProgressionList = getProgressionsSexe('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Garcons '+libelleClasse,
                        backgroundColor: '#32a306',
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
            containerDiv = document.getElementById('effectifsParCycleParSexe');       
            ReactDOM.render(<GenderBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsParCycleParSexe');       
            ReactDOM.render(null,containerDiv);
        }        
    }


    function drawEffectifParNiveau(niveauId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(niveauId!= undefined){        
            currentProgressionList = getProgressions('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Evolution des effectifs en '+libelleClasse,
                        backgroundColor: '#0fa09a',
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsEtabParNiveau');       
            ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsEtabParNiveau');  
            ReactDOM.render(null,containerDiv);
        }
    }

    function drawEffectifParNiveauParSexe(niveauId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif'+ ' en '+libelleClasse;
        if(niveauId != undefined) {
            currentProgressionList = getProgressionsSexe('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Garcons '+libelleClasse,
                        backgroundColor: '#32a306',
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
            containerDiv = document.getElementById('effectifsParNiveauParSexe');       
            ReactDOM.render(<GenderBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsParNiveauParSexe');       
            ReactDOM.render(null,containerDiv);
        }        
    }

    function drawEffectifParClasse(classeId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(classeId!= undefined){        
            currentProgressionList = getProgressions('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Evolution des effectifs en '+libelleClasse,
                        backgroundColor:'#0fa09a',
                        borderColor: 'rgb(255, 255, 255)',
                        borderWidth: 2,
                        data: [...tabProgress[1].split('_')]
                    }
                ]
            }
            containerDiv = document.getElementById('effectifsEtabParClasse');       
            ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsEtabParClasse');  
            ReactDOM.render(null,containerDiv);
        }
    }

    function drawEffectifParClasseParSexe(classeId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Effectif'+ ' en '+libelleClasse;
        if(classeId != undefined) {
            currentProgressionList = getProgressionsSexe('6em1');
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                    {
                        label: 'Garcons '+libelleClasse,
                        backgroundColor: '#32a306',
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
            containerDiv = document.getElementById('effectifsParClasseParSexe');       
            ReactDOM.render(<GenderBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('effectifsParClasseParSexe');       
            ReactDOM.render(null,containerDiv);
        }        
    }


    function dropDownCycleHandler(e){
        if(e.target.value > 0){
            currentCycle  = e.target.value;
            var cur_index = optCycle.findIndex((index)=>index.value == currentCycle);
            libelleClasse = optCycle[cur_index].label;

            console.log(libelleClasse);
            suffixeClasse = ' en '+libelleClasse;     
        } else {
            currentCycle  = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
    }


    function dropDownNiveauHandler(e){
        if(e.target.value > 0){
            currentNiveau  = e.target.value;
            var cur_index = optClasse.findIndex((index)=>index.value == currentNiveau);
            libelleClasse = optClasse[cur_index].label;

            console.log(libelleClasse);
            suffixeClasse = ' en '+libelleClasse;     
        } else {
            currentNiveau  = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
    }


    function droDownClassHandler(e){
        if(e.target.value > 0){
            currentClasse  = e.target.value;
            var cur_index = optClasse.findIndex((index)=>index.value == currentClasse);
            libelleClasse = optClasse[cur_index].label;

            console.log(libelleClasse);
            suffixeClasse = ' en '+libelleClasse;     
        } else {
            currentClasse  = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
        //setTitleSuffix(suffixeClasse);          
        /*---- Stats ETAB ----*/        
        drawEffectifGenEtab(currentClasse);  
        drawEffectifEtabParSexe(currentClasse);  

        /*---- Stats CYCLE ----*/
        drawEffectifParCycle(currentCycle);  
        drawEffectifParCycleParSexe(currentCycle);   

        /*---- Stats NIVEAU ----*/
        drawEffectifParNiveau(currentNiveau);  
        drawEffectifParNiveauParSexe(currentNiveau); 

        /*---- Stats CLASSE ----*/
        drawEffectifParClasse(currentClasse);  
        drawEffectifParClasseParSexe(currentClasse); 
    }

    

/******************************* JSX Code *******************************/
    return (        
        <div className={classes.formStyle}>
      
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle='Evolution Generale des effectifs dur les 5 dernieres annees'  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce> 
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsGenEtab' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                <div id='effectifsEtabParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/>
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                   {t("cycle_M")}   :                       
                </div>
                <div>
                    <select onChange={dropDownCycleHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optCycle||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>          
            
                
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle1 + titleSuffix}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParCycle' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                <div id='effectifsParCycleParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/>
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                {t("level_M")}  :                       
                </div>
                <div>
                    <select onChange={dropDownNiveauHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optNiveau||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>  
            
             
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle2 + titleSuffix}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParNiveau' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                <div id='effectifsParNiveauParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/>
            </div>


            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                {t("class_M")}  :                       
                </div>
                <div>
                    <select onChange={droDownClassHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optClasse||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>  

            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle2 + titleSuffix}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParClasse' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                <div id='effectifsParClasseParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/>
            </div>
            
                    

               
                   
            
            
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
 
 export default TravailScolaire;