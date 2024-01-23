import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import axiosInstance from '../../../../axios';
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

var libelleCycle  = '';
var libelleNiveau = '';
var libelleClasse = '';

var suffixeClasse = '';
var selected_cycle;
var selected_niveau;
var selected_classe;


function CouvertureParProg(props){
    
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
        drawCouvparProgEtab(currentAppContext.currentEtab);  
        
        /*---- Stats CYCLE ----*/
        drawCouvParProgParCycle(selected_cycle);  
        
        /*---- Stats NIVEAU ----*/

        drawCouvParProgParNiveau(selected_niveau);  
        
        /*---- Stats CLASSE ----*/
        drawCouvParProgParClasse(selected_classe);  
        
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
        libelleCycle   = tempTable[0].label;

        setOptCycle(tempTable);
    }

    function getEtabNiveaux(){
        var tempTable=[]
        var tabNiveau=[];
         
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab && nivo.id_cycle==selected_cycle)
        tabNiveau.map((nivo)=>{
            tempTable.push({value:nivo.id_niveau, label:nivo.libelle});
        });

        selected_niveau = tempTable[0].value;
        libelleNiveau   = tempTable[0].label;

        setOptNiveau(tempTable);
        console.log("done well")
    }

    function getEtabClasses(){
        var tempTable=[]
        var tabClasses=[];
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab && cls.id_niveau==selected_niveau)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
        });
        selected_classe = tempTable[0].value;
        libelleClasse   = tempTable[0].label;

        setOptClasse(tempTable);
    }

    
    function getEtabProgressions(etabId){
        return new Promise(function(resolve, reject){
            axiosInstance.post(`couverture-programme/`, {
                id_sousetab : etabId,
                id_cycle    : selected_cycle,
                id_niveau   : selected_niveau,
                id_classe   : selected_classe,
                option      : 'sousetab'
    
            }).then((res)=>{
                console.log(res.data);
                var resSting = res.data.annees.join("_")+'*'+res.data.res_sousetab.join('_');
                console.log("la chaine",resSting);
                resolve(resSting);    
            });
            
        });
      
    }

    
    function getCycleProgressions(selected_cycle){
        return new Promise(function(resolve, reject){
            axiosInstance.post(`couverture-programme/`, {
                id_sousetab : currentAppContext.currentEtab,
                id_cycle    : selected_cycle,
                id_niveau   : selected_niveau,
                id_classe   : selected_classe,
                option      : 'niveau'

            }).then((res)=>{
                console.log(res.data);
                var resSting = res.data.annees.join("_")+'*'+res.data.res_cycle.join('_');
                resolve(resSting);
            });
        });
    }

    
    function getNiveauProgressions(selected_niveau){
        return new Promise(function(resolve, reject){
            axiosInstance.post(`couverture-programme/`, {
                id_sousetab : currentAppContext.currentEtab,
                id_cycle    : selected_cycle,
                id_niveau   : selected_niveau,
                id_classe   : selected_classe,
                option      : 'niveau'

            }).then((res)=>{
                console.log(res.data);
                var resSting = res.data.annees.join("_")+'*'+res.data.res_niveau.join('_');
                resolve(resSting);
            });
        });
    }


    function getClasseProgressions(selected_classe){
        return new Promise(function(resolve, reject){
            axiosInstance.post(`couverture-programme/`, {
                id_sousetab : currentAppContext.currentEtab,
                id_cycle    : selected_cycle,
                id_niveau   : selected_niveau,
                id_classe   : selected_classe,
                option      : 'classe'

            }).then((res)=>{
                console.log(res.data);
                var resSting = res.data.annees.join("_")+'*'+res.data.res_classe.join('_');
                resolve(resSting);
            });
        })
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
    function drawCouvparProgEtab(etabId){
        var tabProgress=[];
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(etabId!= undefined){        
            getEtabProgressions(etabId).then((progressionList)=>{
                tabProgress = progressionList.split('*');

                var selectedState = {
                    labels: (tabProgress.length > 0) ? [...tabProgress[0].split('_')]:[],
                    datasets: [
                        {
                            label: t('general_course_cover'),
                            backgroundColor: 'rgb(221,93,19)',
                            borderColor: 'rgb(255, 255, 255)',
                            borderWidth: 2,
                            data: (tabProgress.length > 0) ? [...tabProgress[1].split('_')]:[]
                        }
                    ]
                }
                containerDiv = document.getElementById('effectifsGenEtab');       
                ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);

            });
            
        } else {
            containerDiv = document.getElementById('effectifsGenEtab');  
            ReactDOM.render(null,containerDiv);
        }
    }
   

    function drawCouvParProgParCycle(cycleId){
        var tabProgress=[];
        var containerDiv;
        var title = 'couverture '+ ' en '+libelleClasse;

        if(cycleId!= undefined){        
            getCycleProgressions(cycleId).then((progressionList)=>{
                tabProgress = progressionList.split('*');

                var selectedState = {
                    labels: (tabProgress.length > 0) ? [...tabProgress[0].split('_')]:[],
                    datasets: [
                        {
                            label: t('course_completion_progress')+' '+libelleCycle,
                            backgroundColor: 'rgb(221,93,19)',
                            borderColor: 'rgb(255, 255, 255)',
                            borderWidth: 2,
                            data: (tabProgress.length > 0) ? [...tabProgress[1].split('_')]:[]
                        }
                    ]
                }
                containerDiv = document.getElementById('effectifsEtabParCycle');       
                ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);

            });
            
        } else {
            containerDiv = document.getElementById('effectifsEtabParCycle');  
            ReactDOM.render(null,containerDiv);
        }
    }

    

    function drawCouvParProgParNiveau(niveauId){
        var tabProgress=[];
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleNiveau;

        if(niveauId!= undefined){        
            getNiveauProgressions(niveauId).then((progressionList)=>{
                tabProgress = progressionList.split('*');

                var selectedState = {
                    labels:(tabProgress.length > 0) ? [...tabProgress[0].split('_')]:[],
                    datasets: [
                        {
                            label: t('course_completion_progress')+' '+libelleNiveau,
                            backgroundColor: 'rgb(221,93,19)',
                            borderColor: 'rgb(255, 255, 255)',
                            borderWidth: 2,
                            data: (tabProgress.length > 0) ? [...tabProgress[1].split('_')]:[]
                        }
                    ]
                }
                containerDiv = document.getElementById('effectifsEtabParNiveau');       
                ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
            })
            
        } else {
            containerDiv = document.getElementById('effectifsEtabParNiveau');  
            ReactDOM.render(null,containerDiv);
        }
    }

    
    function drawCouvParProgParClasse(classeId){
        var tabProgress=[];
        var containerDiv;
        var title = 'Effectif '+ ' en '+libelleClasse;

        if(classeId!= undefined){        
            getClasseProgressions(classeId).then((ProgressionList)=>{
                tabProgress = ProgressionList.split('*');

                var selectedState = {
                    labels: (tabProgress.length > 0) ? [...tabProgress[0].split('_')]:[],
                    datasets: [
                        {
                            label: t('course_completion_progress')+' '+libelleClasse,
                            backgroundColor: 'rgb(221,93,19)',
                            borderColor: 'rgb(255, 255, 255)',
                            borderWidth: 2,
                            data: (tabProgress.length > 0) ? [...tabProgress[1].split('_')]:[]
                        }
                    ]
                }
                containerDiv = document.getElementById('effectifsEtabParClasse');   
                ReactDOM.render(<SimpleBarDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);    
            });
            
        } else {
            containerDiv = document.getElementById('effectifsEtabParClasse');  
            ReactDOM.render(null,containerDiv);
        }
    }




    function dropDownCycleHandler(e){
        if(e.target.value > 0){
            selected_cycle = e.target.value;
            var cur_index  = optCycle.findIndex((index)=>index.value == selected_cycle);
            libelleCycle   = optCycle[cur_index].label;
            getEtabNiveaux();
            getEtabClasses();

            document.getElementById("select_level").options[0].selected  = true;
            document.getElementById("select_classe").options[0].selected = true;

            console.log(libelleCycle);
              
        } else {
            selected_cycle  = undefined;
            libelleCycle ='';
            suffixeClasse = '';
        }  

        /*---- Stats ETAB ----*/        
        drawCouvparProgEtab(currentAppContext.currentEtab);  
        

        /*---- Stats CYCLE ----*/
        drawCouvParProgParCycle(selected_cycle);  
      
        /*---- Stats NIVEAU ----*/
        drawCouvParProgParNiveau(selected_niveau);  
      
        /*---- Stats CLASSE ----*/
        drawCouvParProgParClasse(selected_classe);  
        
    }


    function dropDownNiveauHandler(e){
        if(e.target.value > 0){
            selected_niveau  = e.target.value;
            var cur_index = optNiveau.findIndex((index)=>index.value == selected_niveau);
            libelleNiveau = optNiveau[cur_index].label;
            getEtabClasses();
            document.getElementById("select_classe").options[0].selected = true;

            console.log(libelleNiveau);
              
        } else {
            selected_niveau  = undefined;
            libelleNiveau ='';
            suffixeClasse = '';
        }  

        
        /*---- Stats NIVEAU ----*/
        drawCouvParProgParNiveau(selected_niveau);  
       

        /*---- Stats CLASSE ----*/
        drawCouvParProgParClasse(selected_classe);  
        
        
    }


    function droDownClassHandler(e){
        if(e.target.value > 0){
            selected_classe = e.target.value;
            var cur_index   = optClasse.findIndex((index)=>index.value == selected_classe);
            libelleClasse   = optClasse[cur_index].label;

            console.log(libelleClasse);
                
        } else {
            selected_classe  = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
        //setTitleSuffix(suffixeClasse);          
        /*---- Stats ETAB ----*/        
        drawCouvparProgEtab(currentAppContext.currentEtab);  
        
        /*---- Stats CYCLE ----*/
        drawCouvParProgParCycle(selected_cycle);  
        

        /*---- Stats NIVEAU ----*/
        drawCouvParProgParNiveau(selected_niveau);  
        

        /*---- Stats CLASSE ----*/
        drawCouvParProgParClasse(selected_classe);  
        
    }

    

/******************************* JSX Code *******************************/
    return (        
        <div className={classes.formStyle}>
      
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={t('couv_progs_gen')}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce> 
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsGenEtab' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                {/* <div id='effectifsEtabParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/> */}
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                   {t("cycle_M")}   :                       
                </div>
                <div>
                    <select id="select_cycle" onChange={dropDownCycleHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optCycle||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>          
            
                
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={t('couv_progs_cycle')} itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParCycle' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                {/* <div id='effectifsParCycleParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/> */}
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                {t("level_M")}  :                       
                </div>
                <div>
                    <select id="select_level" onChange={dropDownNiveauHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optNiveau||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>  
            
             
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={t('couv_progs_niveau')}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParNiveau' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                {/* <div id='effectifsParNiveauParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/> */}
            </div>


            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                {t("class_M")}  :                       
                </div>
                <div>
                    <select id="select_classe" onChange={droDownClassHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optClasse||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>               
                
            </div>  

            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={t('couv_progs_classe')}  itemSelected={null} puceLabelStyle={{color:"black"}}> </FormPuce>
            <div className={classes.inputRow + ' '+ classes.margBottom3 +' '+ classes.borderBottom}>
                <div id='effectifsEtabParClasse'    className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw", marginRight:"7vw"}}/>
                {/* <div id='effectifsParClasseParSexe' className={classes.inputRow33 +' '+ classes.spaceAround} style={{width:"20vw", height:"10vw"}}/> */}
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
 
 export default CouvertureParProg;