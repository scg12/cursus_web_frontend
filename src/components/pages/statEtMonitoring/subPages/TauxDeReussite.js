import React from 'react';
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Bar,Line,Doughnut} from 'react-chartjs-2';

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


var BACCPercentage=45;
var PROBATPercentage=35;
var BEPCPercentage=70;

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
  

function TauxDeReussite(props){
    
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const [examResultTab,setExamResultTab] = useState([]);
    const [examResultByGender,setExamResultByGender] = useState([]);
    const [barChartStateArray,  setBarChartStateArray] = useState([]);
    const [lineChartStateArray,  setLineChartStateArray] = useState([]);
    const [doughnutStateArray,  setDoughnutStateArray] = useState([]);
    const [genderBarChartStateArray,  setGenderBarChartStateArray] = useState([]);
    const [genderLineChartStateArray,  SetGenderLineChartStateArray] = useState([]);
    const [progressBarWidth,setProgressBarWidth] = useState(0);
    const [chartCode, setChartCode]=useState([]);
    const [genderChartCode, setgenderChartCode]=useState([]);
    const selectedTheme = currentUiContext.theme;

    var barChartStateTab=[];
    var lineChartStateTab=[];
    var doughnutStateTab=[];

    var comparativeBarChartStateTab=[];
    var comparativeLineChartStateTab=[];
    
    const state1 = {
        labels: ['January', 'February', 'March', 'April', 'May'],                
        datasets: [{        
            label: 'Rainfall',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
        }]        
    }

    const state2 = {
        labels: ['January', 'February', 'March','April', 'May'],
        datasets: [{        
            label: 'Rainfall',
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
            data: [65, 59, 80, 81, 56]
        }]
        
    }
      
      

    var listResults="Baccalaureat_40_250_625*Probatoire_55_400_727*BEPC_57_1500_2632";
    var listResultsParSex="Baccalaureat_46_54*Probatoire_55.3_54.7*BEPC_60_40";
    
    var listResultData ="65_59_80_81_56*85_80_82_65_57*84_82_84_58_68";
    var listResultLabels ="Baccalaureat_Probatoire_BEPC*2018_2019_2020_2021_2022";

    var listResultDataSexe ="65_59_80+42_58_35*35_32_80+42_74_37*34_54_80+47_50_82";
    var listResultLabelsSexe ="Baccalaureat_Probatoire_BEPC*2020_2021_2022";
    
    
    var tabResultats=[];
    var tabResultatsParSex=[];

   

    var barWidth;
    var chartCd=[];
    var genderChartCd=[];
    var changedIndex;
    
    //dans le useEffect suivant, on va faire la requete
    //pour recuperer les donnees des exams en BD
    
    useEffect(()=> {
        createChartStates(listResultLabels,listResultData);
        createComparativeGenderChart(listResultLabelsSexe,listResultDataSexe);

        tabResultats = listResults.split('*');

        for(var i=0; i<tabResultats.length; i++){
            chartCd[i]=1;
            genderChartCd[i]=1;
        }

        var examCount = tabResultats.length;
        barWidth = (examCount!=0)? (Math.round(80/examCount)-7)+'vw' :'20vw';

        tabResultatsParSex = listResultsParSex.split('*');

        setBarChartStateArray(barChartStateTab);
        setLineChartStateArray(lineChartStateTab);
        setDoughnutStateArray(doughnutStateTab);

        setGenderBarChartStateArray(comparativeBarChartStateTab);
        SetGenderLineChartStateArray(comparativeLineChartStateTab);


        setExamResultTab(tabResultats);
        setExamResultByGender(tabResultatsParSex)
        setProgressBarWidth(barWidth);
        setChartCode(chartCd);
        setgenderChartCode(genderChartCd);
    },[]);
    

    function createChartStates(resultLabels, resultData){
        var resultDataTab=[];
        var resultLabelsTab=[];
        var currentBarChartData, currentLineChartData, currentDoughnutData;
        var currentBarChartState, currentLineChartState, currentdoughnutState;

        resultLabelsTab = resultLabels.split('*');
        var libellesExam = resultLabelsTab[0].split('_');
        var yearsExam = resultLabelsTab[1].split('_');

        resultDataTab = resultData.split('*');
        

        for(var i=0; i<resultDataTab.length; i++){
           
            currentBarChartData = {
                label:'',
                backgroundColor: '#6800B4',
                borderColor:  'rgba(255,255,255,1)',
                borderWidth:2,
                data:[]
            };

            currentLineChartData = {
                label:'',
                backgroundColor: '#2FDE00',
                borderColor:  'gray',
                borderWidth:2,
                data:[]
            };

            currentDoughnutData = {
                label:'',
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
                data:[]
            };

            currentBarChartState =  {
                labels:[],
                datasets:[],
            }
            currentLineChartState =  {
                labels:[],
                datasets:[],
            }
            currentdoughnutState =  {
                labels:[],
                datasets:[],
            }
            
            var dataTab = resultDataTab[i].split('_');

            currentBarChartData.label = libellesExam[i];
            currentBarChartData.data = dataTab;
            currentBarChartState.labels = yearsExam;
            currentBarChartState.datasets.push({...currentBarChartData});

            currentLineChartData.label = libellesExam[i];
            currentLineChartData.data = dataTab;
            currentLineChartState.labels = yearsExam;
            currentLineChartState.datasets.push({...currentLineChartData});
            
            currentDoughnutData.label = libellesExam[i];
            currentDoughnutData.data = dataTab;
            currentdoughnutState.labels =  yearsExam;
            currentdoughnutState.datasets.push({...currentDoughnutData});

            barChartStateTab.push({...currentBarChartState});
            lineChartStateTab.push({...currentLineChartState});
            doughnutStateTab.push({...currentdoughnutState});
        }

        console.log(barChartStateTab);
        console.log(doughnutStateTab);
    }

    function createComparativeGenderChart(genderResultLabels, genderResultData){
        var genderResultDataTab=[];
        var genderResultLabelsTab=[];
        var currentBoysBarChartData, currentGirlsBarChartData, currentBoysLineChartData, currentGirlsLineChartData;
        var currentBarChartState, currentLineChartState;

        genderResultLabelsTab = genderResultLabels.split('*');
        var libellesExam = genderResultLabelsTab[0].split('_');
        var yearsExam = genderResultLabelsTab[1].split('_');

        genderResultDataTab = genderResultData.split('*');
        
        for(var i=0; i<genderResultDataTab.length; i++){
           
            currentBoysBarChartData = {
                label:'',
                backgroundColor:  '#2FDE00',
                borderColor:  'rgba(255,255,255,1)',
                borderWidth:2,
                data:[]
            };

            currentGirlsBarChartData = {
                label:'',
                backgroundColor: '#B21F00',
                borderColor:  'rgba(255,255,255,1)',
                borderWidth:2,
                data:[]
            };
            

            currentBoysLineChartData = {
                label:'',
                backgroundColor:  '#2FDE00',
                borderColor:  '#2FDE00',
                borderWidth:2,
                data:[]
            };

            currentGirlsLineChartData = {
                label:'',
                backgroundColor: '#B21F00',
                borderColor: '#B21F00',
                borderWidth:2,
                data:[]
            };
           
            currentBarChartState =  {
                labels:[],
                datasets:[],
            }
            
            currentLineChartState =  {
                labels:[],
                datasets:[],
            }
            
            
            var dataTab = genderResultDataTab[i].split('+');
            //---BarChart Donnees des garcons
            currentBoysBarChartData.label ='Garcons';
            currentBoysBarChartData.data = dataTab[0].split('_');
            currentBarChartState.labels = yearsExam;
            currentBarChartState.datasets.push({...currentBoysBarChartData});
            //---BarChart Donnees des filles
            currentGirlsBarChartData.label ='Filles';
            currentGirlsBarChartData.data = dataTab[1].split('_');
            currentBarChartState.labels = yearsExam;
            currentBarChartState.datasets.push({...currentGirlsBarChartData});


             //---LineChart Donnees des garcons
            currentBoysLineChartData.label = 'Garcons';
            currentBoysLineChartData.data = dataTab[0].split('_');
            currentLineChartState.labels = yearsExam;
            currentLineChartState.datasets.push({...currentBoysLineChartData});
            
            //---LineChart Donnees des filles
            currentGirlsLineChartData.label = 'Filles';
            currentGirlsLineChartData.data = dataTab[1].split('_');
            currentLineChartState.labels = yearsExam;
            currentLineChartState.datasets.push({...currentGirlsLineChartData});

            comparativeBarChartStateTab.push({...currentBarChartState});
            comparativeLineChartStateTab.push({...currentLineChartState});
            
        }

        console.log(comparativeBarChartStateTab);
        console.log(comparativeLineChartStateTab);
    }


    function getStringAtPosition(examSting,pos) {
        var tabResult = examSting.split('_');
        if (tabResult.length==0) return undefined;
        if((pos >= 0)&&(pos<=tabResult.length-1)) return tabResult[pos];
        else return undefined;        
    }

    function getButtonStyle() 
    {   // Choix du theme courant
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

    function cancelHandler() {
        var sideNav = document.getElementById('side-menu');
        var backDrop = document.querySelectorAll('.sidenav-overlay');
       

        backDrop.forEach(element => {
            element.style.display='none';
            element.style.opacity='0';
          });
          
        sideNav.style.transform='translateX(105%)';
    }

    return (                
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle +' '+classes.margBottom3}>
                    TABLEAU DE BORD DE PRESENTATION DE L'EVOLUTION DES RESULTATS SCOLAIRES
                </div>
            </div>
                   
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Taux de Reussite Aux Examens Officiels"  itemSelected={null}> </FormPuce>
            <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                {(examResultTab||[]).map((examResult) => {
                    return(
                        <div className={classes.margLeft2}> 
                             <div className={classes.inputRowLeft}>
                                <div className={classes.bold +' '+classes.fontSize1}>
                                    {getStringAtPosition(examResult,0) }
                                </div>
                                <div className={classes.fontSize1}>
                                    {'('+getStringAtPosition(examResult,2)+' admis sur '+ getStringAtPosition(examResult,3)+')'}  
                                </div>       
                             </div>
                                     
                            <ProgressBar style={{width:progressBarWidth, height: '3.7vh'}} striped variant="info" now= {getStringAtPosition(examResult,1)} key={1} label={`${getStringAtPosition(examResult,1)}%`}/>
                        </div>
                    );
                })}
            
            </div>
                
            <FormPuce menuItemId ='2' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Taux De Reussite Par Sexe"  itemSelected={null}> </FormPuce>
            <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                {(examResultByGender||[]).map((examResult) => {
                    return(
                        <div className={classes.margLeft2}> 
                            <div className={classes.inputRowLeft}>
                            <div className={classes.bold +' '+classes.fontSize1}>
                                    {getStringAtPosition(examResult,0) }
                                </div>
                                <div className={classes.fontSize1}>
                                    {' (% Total des admis '+ examResultTab[examResultByGender.findIndex((index)=>index==examResult)].split('_')[1] + ' )'}
                                </div>                                  
                            </div>                    
                            <ProgressBar style={{width:progressBarWidth, height: '3.7vh'}}>
                                <ProgressBar striped variant="info" now={getStringAtPosition(examResult,1)} label={`Garcons: ${getStringAtPosition(examResult,1)}%`} key={1} />
                                <ProgressBar variant="warning" now={getStringAtPosition(examResult,2)} label={`Filles : ${getStringAtPosition(examResult,2)}%`} key={2} />
                            </ProgressBar>
                        </div>    
                    );
                })} 
               
            </div>
            <FormPuce menuItemId ='3' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Du Taux De Reussite Sur les 5 Dernieres Annees "  itemSelected={null}> </FormPuce>
            <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                {(examResultTab||[]).map((examResult) => {                   
                    return(
                        <div className={classes.inputRow +' '+ classes.margLeft2} style={{width:progressBarWidth, height: 'fit-content'}}> 
                            {(chartCode[examResultTab.findIndex((exam)=>(exam==examResult))]==1)?
                                <Bar
                                    data={barChartStateArray[barChartStateArray.findIndex((chartState)=>(chartState.datasets[0].label == getStringAtPosition(examResult,0)))]}
                                    options={{
                                        title:{
                                        display:true,
                                        text:'Evolution du taux de reussite au '+getStringAtPosition(examResult,0),
                                        fontSize:20
                                        },
                                        legend:{
                                        display:true,
                                        position:'right'
                                        }
                                    }}
                                />
                                :
                                (chartCode[examResultTab.findIndex((exam)=>(exam==examResult))]==2)?
                                    <Line
                                        data={lineChartStateArray[lineChartStateArray.findIndex((chartState)=>(chartState.datasets[0].label == getStringAtPosition(examResult,0)))]}
                                        options={{
                                            title:{
                                                display:true,
                                                text:'Evolution du taux de reussite au '+getStringAtPosition(examResult,0),
                                                fontSize:20
                                            },
                                            legend:{
                                                display:true,
                                                position:'right'
                                            }
                                        }}
                                    />
                                :
                                (chartCode[examResultTab.findIndex((exam)=>(exam==examResult))]==3)?
                                    <Doughnut
                                    data={doughnutStateArray[doughnutStateArray.findIndex((doughnutState)=>(doughnutState.datasets[0].label == getStringAtPosition(examResult,0)))]}
                                        options={{
                                            title:{
                                                display:true,
                                                text:'Evolution du taux de reussite au '+getStringAtPosition(examResult,0),
                                                fontSize:20
                                            },
                                            legend:{
                                                display:true,
                                                position:'right'
                                            }
                                        }}
                                    />
                                :null
                            }
                            
                            <div className={classes.inputRowRight}>
                                <div className={classes.buttonList}>
                                    <CustomButton
                                        btnText='' 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnTextStyle}
                                        btnClickHandler={()=>{changedIndex = examResultTab.findIndex((exam)=>(exam==examResult)); chartCd = [...chartCode]; chartCd[changedIndex]=1; setChartCode(chartCd);}}
                                        hasIconImg= {true}
                                        imgSrc='images/barChart.png'
                                        imgStyle = {classes.imgStyle}
                                    />
                                    <CustomButton
                                        btnText='' 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnTextStyle}
                                        btnClickHandler={()=>{changedIndex = examResultTab.findIndex((exam)=>(exam==examResult)); chartCd = [...chartCode]; chartCd[changedIndex]=2; setChartCode(chartCd);}}
                                        hasIconImg= {true}
                                        imgSrc='images/linechart2.png'
                                        imgStyle = {classes.imgStyle}
                                    />                            
                                    <CustomButton
                                        btnText='' 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnTextStyle}
                                        btnClickHandler={()=>{changedIndex = examResultTab.findIndex((exam)=>(exam==examResult)); chartCd = [...chartCode]; chartCd[changedIndex]=3; setChartCode(chartCd);}}
                                        hasIconImg= {true}
                                        imgSrc='images/pieChart.png'
                                        imgStyle = {classes.imgStyle}
                                    />
                                </div>
                            </div>
                        </div>                       
                    );                  
                })}                       
            </div>
               
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Du Taux De Reussite Par Sexe Sur les 3 Dernieres Annees"  itemSelected={null}> </FormPuce>
            <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                {(examResultTab||[]).map((examResult) => {                   
                    return(
                        <div className={classes.inputRow +' '+ classes.margLeft2} style={{width:progressBarWidth, height: 'fit-content'}}> 
                            {(genderChartCode[examResultTab.findIndex((exam)=>(exam==examResult))]==1)?
                                <Bar
                                    data={genderBarChartStateArray[examResultTab.findIndex((exam)=>(exam==examResult))]}
                                    options={{
                                        title:{
                                            display:true,
                                            text:'Evolution comparative du taux de reussite au '+getStringAtPosition(examResult,0),
                                            fontSize:20
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                />
                                :
                                <Line
                                    data={genderLineChartStateArray[examResultTab.findIndex((exam)=>(exam==examResult))]}
                                    options={{
                                        title:{
                                            display:true,
                                            text:'Evolution du taux de reussite au '+getStringAtPosition(examResult,0),
                                            fontSize:20
                                        },
                                        legend:{
                                            display:true,
                                            position:'right'
                                        }
                                    }}
                                />
                                                             
                                
                            }
                            
                            <div className={classes.inputRowRight}>
                                <div className={classes.buttonList}>
                                    <CustomButton
                                        btnText='' 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnTextStyle}
                                        btnClickHandler={()=>{changedIndex = examResultTab.findIndex((exam)=>(exam==examResult)); genderChartCd = [...genderChartCode]; genderChartCd[changedIndex]=1; setgenderChartCode(genderChartCd);}}
                                        hasIconImg= {true}
                                        imgSrc='images/barChart.png'
                                        imgStyle = {classes.imgStyle}
                                    />
                                    <CustomButton
                                        btnText='' 
                                        buttonStyle={getSmallButtonStyle()}
                                        btnTextStyle = {classes.btnTextStyle}
                                        btnClickHandler={()=>{changedIndex = examResultTab.findIndex((exam)=>(exam==examResult)); genderChartCd = [...genderChartCode]; genderChartCd[changedIndex]=2; setgenderChartCode(genderChartCd);}}
                                        hasIconImg= {true}
                                        imgSrc='images/linechart2.png'
                                        imgStyle = {classes.imgStyle}
                                    />                         
                                    
                                </div>
                            </div>
                        </div>                       
                    );                  
                })}                       
            </div>
                   
            
            
            <div className={classes.buttonRow+' '+classes.margLeft5 }>
                <CustomButton
                    btnText='Imprimer' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}

                />
                
                {/*<CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable={(isValid == false)}
                />*/}
                
            </div>
            

        </div>
       
     );
 }
 
 export default TauxDeReussite;