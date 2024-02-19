import React from 'react';
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import axiosInstance from '../../../../axios';
import { useContext, useState, useEffect } from "react";
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Bar,Line,Doughnut} from 'react-chartjs-2';
import { useTranslation } from "react-i18next";

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
    const currentAppContext = useContext(AppContext);
    const { t, i18n } = useTranslation();
    
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
    
    
    var listResults          = "";
    var listResultsParSex    = "";
    
    var listResultData       = "";
    var listResultLabels     = "";

    var listResultDataSexe   = "";
    var listResultLabelsSexe = "";
    
    
    var tabResultats=[];
    var tabResultatsParSex=[];

   

    var barWidth;
    var chartCd=[];
    var genderChartCd=[];
    var changedIndex;
    
   
    //--------Voila le format des donnnees pour les courbes --------------

    // listResults1       = "BACC_40_200_500*Probatoire_35_200_300";
    // listResultsParSex1 = "BACC_40_60*Probatoire_55_45";

    // resultSur5Ans = "65_59_80_81_56*85_80_82_65_57*84_82_84_58_68";
    // examAnne5Ans  = "BACC_Probatoire_BEPC*2018_2019_2020_2021_2022";

    // resultParSex3Ans = "65_59_80+42_58_35*35_32_80+42_74_37*34_54_80+47_50_82";
    // examAnne3Ans     = "BACC_Probatoire_BEPC*2020_2021_2022";
    //--------------------------------------------------------------------
    
    useEffect(()=> {

        getExamResults(currentAppContext.currentEtab).then((dd)=>{
       
            console.log("data", listResults,listResultLabels, listResultData, listResultLabelsSexe,listResultDataSexe);
            createChartStates(listResultLabels,listResultData);
            createComparativeGenderChart(listResultLabelsSexe,listResultDataSexe);

            tabResultats = listResults.split('*');

            for(var i=0; i<tabResultats.length; i++){
                chartCd[i]=1;
                genderChartCd[i]=1;
            }

            var examCount = tabResultats.length;
            barWidth = (examCount>1)? (Math.round(80/examCount)-7)+'vw' :'30vw';

            tabResultatsParSex = listResultsParSex.split('*');

            console.log("dfdffd",barChartStateTab, lineChartStateTab, doughnutStateTab, tabResultats);

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

            setIsLoading(false);

        })
        
    },[]);

    
    function getExamResults(sousEtabId){
        listResults          = "";
        listResultsParSex    = "";

        listResultData       = "";
        listResultLabels     = "";
    
        listResultDataSexe   = "";
        listResultLabelsSexe = "";

       
        return new Promise(function(resolve, reject){
            axiosInstance.post(`statistique-examens/`, {
                id_sousetab : sousEtabId,
            }).then((res)=>{
                console.log("taux resussite",res.data);
                
                var examCourants = [...res.data.exam_courants];
                var examPasses   = [...res.data.exam_passes];
                var listExam     = [];
                var sessions     = [];

                console.log("courants et passses", examCourants,examPasses);

                if(examCourants.length>0){
                    examCourants.map((exam, index)=>{
                        if(index < examCourants.length-1){
                            listResults       = listResults + exam.libelle + '_' + exam.taux_reussite + '_' + exam.nb_admis + '_' + exam.nb_candidats + '*';
                            listResultsParSex = listResultsParSex + exam.libelle + '_' + exam.taux_reussite_garcons + '_' + exam.taux_reussite_filles + '*';
                        }
                        else {
                            listResults       = listResults + exam.libelle + '_' +  exam.taux_reussite + '_' + exam.nb_admis + '_' + exam.nb_candidats;
                            listResultsParSex = listResultsParSex + exam.libelle + '_' + exam.taux_reussite_garcons + '_' + exam.taux_reussite_filles ;
                            sessions.push(exam.session.split('-')[1]);
                        }

                        listExam.push(exam.libelle);
                    });

                    console.log("resultats1",listResults, listResultsParSex, listExam);

                } else {
                    
                    listResults       = "";
                    listResultsParSex = "";


                    listExam.map((exam, index)=>{
                        if(index < listExam.length-1){
                            listResults       = listResults + exam +"_0_0_0*";
                            listResultsParSex = listResultsParSex + exam +"_0_0*";

                        } else {
                            listResults       = listResults + exam +"_0_0_0";
                            listResultsParSex = listResultsParSex + exam +"_0_0";
                        }
                  
                    })
     
                }

               
                var ResultData       = [];
                var ResultLabelsSexe = [];
                var examAnne5Ans = '';
                var examAnne3Ans = '';
                
               
                if(examPasses.length>0){
                    listExam.map((elt)=>{
                        ResultData.push([]);
                        ResultLabelsSexe.push({resGarcons:[],resFilles:[]});
                    })
                   
                    examPasses.map((exam, index)=>{
                        var pos = listExam.findIndex((ex)=> ex == exam.libelle);
                        ResultData[pos].push(exam.taux_reussite);
                        ResultLabelsSexe[pos].resGarcons.push(exam.taux_reussite_garcons);
                        ResultLabelsSexe[pos].resFilles.push(exam.taux_reussite_filles);
                       
                        if(sessions.find((elt)=>elt == exam.session)==undefined){
                            sessions.push(exam.session.split('-')[1]);
                        }
                    })
                    
                    var resultSur5Ans = "", resultParSex3Ans = "";
                    var sessions5Ans , sessions3Ans;

                    if(listResultData[0].length > 5){
                        listExam.map((elt, pos)=>{
                            var tab = listResultData[pos].reverse().slice(0,5);
                            ResultData[pos] = tab.reverse();
                        });
                        
                        sessions5Ans = sessions.reverse().slice(0,5).reverse();
                    } else{
                        sessions5Ans = sessions
                    } 
                    
                    if(ResultLabelsSexe[0].resGarcons.length > 3){
                    
                        listExam.map((elt, pos)=>{
                            var tabGarcons = ResultLabelsSexe[pos].resGarcons.reverse().slice(0,3);
                            var tabFilles  = ResultLabelsSexe[pos].resFilles.reverse().slice(0,3);
                            
                            ResultLabelsSexe[pos].resGarcons = tabGarcons.reverse();
                            ResultLabelsSexe[pos].resFilles  = tabFilles.reverse();
                        })  

                        sessions3Ans = sessions.reverse().slice(0,3).reverse();
                    } else {
                        sessions3Ans = sessions;
                    }
                    

                    listExam.map((elt, pos)=>{
                        var ch = listResultData[pos].join("_");
                        
                        var resBoys  =  ResultLabelsSexe[pos].resGarcons.join("_");
                        var resGirls =  ResultLabelsSexe[pos].resFilles.join("_");

                        if(pos < listExam.length-1){
                            resultSur5Ans = resultSur5Ans + ch + "*";
                            resultParSex3Ans = resultParSex3Ans + resBoys + "+" + resGirls + "*";
                        } else {
                            resultSur5Ans = resultSur5Ans + ch;
                            resultParSex3Ans = resultParSex3Ans + resBoys + "+" + resGirls;
                        }
                    })

                    examAnne5Ans = listExam.join("_")+'*'+sessions5Ans.join('_');
                    examAnne3Ans = listExam.join("_")+'*'+sessions3Ans.join('_');

                }else{
                    // resultSur5Ans = "65_59_80_81_56*85_80_82_65_57*84_82_84_58_68";
                    // examAnne5Ans  = "BACC_Probatoire_BEPC*2018_2019_2020_2021_2022";

                    // resultParSex3Ans = "65_59_80+42_58_35*35_32_80+42_74_37*34_54_80+47_50_82";
                    // examAnne3Ans     = "BACC_Probatoire_BEPC*2020_2021_2022";
                    
                    resultSur5Ans    = "";
                    resultParSex3Ans = "";

                    var result = "";
                    var resultSex = "";
                    var sessionSex;

                    if(sessions.length > 3){
                        sessionSex = sessions.slice(0,3);
                    } else {
                        sessionSex = sessions;
                    }

                    sessions.map((sess, index2)=>{
                        if(index2 < sessions.length-1){
                            result =  result +"0"+"_";
                        }else{
                            result =  result+"0";
                        }
                    });

                    sessionSex.map((sess, index3)=>{
                        if(index3 < sessionSex.length-1){
                            resultSex =  resultSex + "0" + "_";
                        }else{
                            resultSex =  resultSex + "0";
                        }
                    });

                   

                    listExam.map((exam, index1)=>{
                        if(index1 < listExam.length-1){
                            resultSur5Ans    = resultSur5Ans + result + "*";
                            resultParSex3Ans = resultParSex3Ans + resultSex + "+" + resultSex + "*";
                        } else {
                            resultSur5Ans    = resultSur5Ans + result;
                            resultParSex3Ans = resultParSex3Ans + resultSex + "+" + resultSex;
                        }
                    });
                   
                    examAnne5Ans  = listExam.join("_")+'*'+sessions.join("_");
                    examAnne3Ans  = listExam.join("_")+'*'+sessions.join("_");

                    console.log("resultats", examAnne3Ans,examAnne5Ans,resultSur5Ans, resultParSex3Ans,sessionSex);
                }

                listResultData      = resultSur5Ans;
                listResultDataSexe  = resultParSex3Ans ;
                listResultLabels    = examAnne5Ans;
                listResultLabelsSexe= examAnne3Ans

                resolve("OK");    
            });
            
        });

    }
    

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

        console.log("astate1",barChartStateTab);
        console.log("astate2",doughnutStateTab);
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

        console.log("toto1",comparativeBarChartStateTab);
        console.log("toto2",comparativeLineChartStateTab);
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
        // (isLoading==false) ?               
            <div className={classes.formStyle}>
                <div className={classes.inputRow}> 
                    <div className={classes.formTitle +' '+classes.margBottom3}>
                        {t("result_dashBoard_M")}
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
                                    (chartCode[examResultTab.findIndex((exam)=>(exam==examResult))]==3)&&
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
     
        // :
        //     <div className={classes.formET} style={{alignItems:"center", width:'100%', height:'100%', backgroundColor:"white"}}>
        //         <img src='images/Loading_icon.gif' alt="loading..." />
        //     </div>
        
       
     );
 }
 
 export default TauxDeReussite;