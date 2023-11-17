import React from 'react';
import ReactDOM from 'react-dom';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import  FormNumero from "../../../formPuce/FormNumero";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from '../../../backDrop/BackDrop';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate,changeDateIntoMMJJAAAA, getTodayDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";




var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function ResultatsGeneration(props) {
    
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const selectedTheme = currentUiContext.theme;
    const [typeBulletin, setTypeBulletin] = useState();
    const [bullTypeLabel, setBullTypeLabel] = useState();
    const [seq1, setSeq1] = useState("1");
    const [seq2, setSeq2] = useState("2");
    
    const [elevesCL, setEleveCL] = useState([]);
    const [elevesNCL,setEleveNCL] = useState([]);

    useEffect(()=> {
        console.log("gdgd", props.typeBulletin)
        setTypeBulletin(props.typeBulletin);
        getTrimSequences(props.bullPeriodeLabel);
        getBulletinTypeLabel(props.typeBulletin);

        var elevesClasses   = convertElevesDataIntoarray(props.elevesClasses, props.typeBulletin);
        var elevesNClasses  = convertElevesDataIntoarray(props.elevesNClasses,props.typeBulletin);
       
        setEleveCL(elevesClasses);
        setEleveNCL(elevesNClasses);
    },[]);

    function convertElevesDataIntoarray(elevesData, typeBulletin){
        var elvData = [];
        var eleve   = {};
        var resultatElev = [];
        elevesData.map((elv)=>{
            eleve = {};
            resultatElev      = elv.resultat.split("~~~");
            console.log("resultElv:", resultatElev)
            eleve.id          = elv.id;
            eleve.rang        = elv.rang;
            eleve.matricule   = resultatElev[1].split("²²")[2];
            eleve.nom         = resultatElev[1].split("²²")[0] + ' '+resultatElev[1].split("²²")[1];
            console.log("typeBull",typeBulletin);

            switch(typeBulletin){ 
                case 1: {
                    console.log("ici1");
                    eleve.moyenne = resultatElev[resultatElev.length-1].split("²²")[2];
                    break;
                }

                case 2: {
                    eleve.moy_seq1 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_seq2 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moyenne  = resultatElev[resultatElev.length-1].split("²²")[2];
                    break;
                }

                case 3: {
                    eleve.moy_trim1 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_trim2 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.moy_trim3 = resultatElev[resultatElev.length-1].split("²²")[2];
                    eleve.decision  = "";
                    eleve.promuEn   = "";
                    break;
                }
            }

            elvData.push(eleve);    
        })

        return elvData;

    }


   
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }


    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader+ ' ' + classes.formHeader;
            case 'Theme2': return classes.Theme2_formHeader + ' ' + classes.formHeader;
            case 'Theme3': return classes.Theme3_formHeader + ' ' +classes.formHeader;
            default: return classes.Theme1_formHeader + ' ' +classes.formHeader;
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
   
   
    /************************************ Handlers ************************************/  
    function quitFormAndGetData(){
        props.cancelHandler();
    }

    function printReports(){
        props.cancelHandler();
        props.printReportHandler();
    }
   
  
   
    function getTrimSequences(trimestre){
       switch(trimestre){
        case "Trimestre1": {setSeq1("1"); setSeq2("2");   return;} 
        case "Trimestre2": {setSeq1("3"); setSeq2("4");   return;}
        case "Trimestre3": {setSeq1("5"); setSeq2("6");   return;}
       }
    }

    function getBulletinTypeLabel(typeBulletin){
        switch(typeBulletin){
            case 1: {setBullTypeLabel(t('bulletin_sequentiel'));   return;} 
            case 2: {setBullTypeLabel(t('bulletin_trimestriel'));  return;}
            case 3: {setBullTypeLabel(t('bulletin_annuel'));       return;}
           }
    }

   
    /************************************ JSX Code ************************************/
    const LigneEleveHeader=(props)=>{
        return(
            <div style={{display:'flex', color:'white', backgroundColor:(props.ordered) ? '#065386':'#d0290c', flexDirection:'row', height:'3vh',  width:'50vw', fontSize:'0.77vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black', position:"absolute", top:'10vh', borderRadius:3}}>
                <div style={{width:'5vw', paddingLeft:"1.3vh"}}>  {(props.ordered) ? t("rang_M") :t("N°") }        </div>
                <div style={{width:'8vw'}}>                       {t("matricule_M")}      </div> 
                <div style={{width:'17vw'}}>                      {t("displayedName_M")}  </div>   
                
                
                {/*----- CAS BULLETIN TRIMESTRIEL -------*/}
                {(typeBulletin==2)&&
                    <div style={{width:'7vw'}}> {t("moy_seq_M")+seq1} </div>
                }
                
                {(typeBulletin==2)&&
                    <div style={{width:'7vw'}}> {t("moy_seq_M")+seq2} </div>
                }

                {/*----- CAS BULLETIN ANNUEL -------*/}
                {(typeBulletin==3)&&
                    <div style={{width:'7vw',fontSize:"0.7vw"}}> {t("moy_trim_M")+"1"}  </div>
                }
                
                {(typeBulletin==3)&&
                    <div style={{width:'7vw',fontSize:"0.7vw"}}> {t("moy_trim_M")+"2"}  </div>
                }

                {(typeBulletin==3)&&
                    <div style={{width:'7vw',fontSize:"0.7vw"}}> {t("moy_trim_M")+"3"}  </div>
                }

                {(typeBulletin==1)&&               
                    <div style={{width:'7vw', fontSize:"0.7vw"}}>  {t("moySeq_M")}          </div>
                }

                {(typeBulletin==2)&&               
                    <div style={{width:'7vw', fontSize:"0.7vw"}}>  {t("moyTrin_M")}         </div>
                }

                {(typeBulletin==3)&&               
                    <div style={{width:'7vw', fontSize:"0.7vw"}}>  {t("moyGenAN_M")}          </div>
                }
                
                {/*----- CAS BULLETIN ANNUEL -------*/}
                {(typeBulletin==3)&&
                    <div style={{width:'7vw',fontSize:"0.7vw"}}> {t("decision_M")}     </div>
                }
                {(typeBulletin==3)&&
                    <div style={{width:'7vw',fontSize:"0.7vw"}}> {t("Promu en")}       </div>
                }
            </div>
        );
    }

    const LigneEleve=(props)=>{
       
        return(
            <div style={{display:'flex', color:'black', backgroundColor:(props.ordered) ? (props.rowIndex % 2==0) ? 'white':'#e2e8f0cf' : (props.rowIndex % 2==0) ? '#ebe3e0':'#ebbda4', flexDirection:'row', height: 'fit-content',width:'50vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'5vw', fontWeight:"bold", paddingLeft:"1.3vh", color:(props.ordered) ? "#3e77b2":"black"}}>   {(props.ordered) ? (props.eleve.rang==1)? props.eleve.rang+t("er"):props.eleve.rang+t("ieme") : props.rowIndex+1}   </div>
                <div style={{width:'8vw'}}>   {props.eleve.matricule}       </div> 
                <div style={{width:'17vw', fontSize:"0.77vw", fontWeight:'bold'}}>         
                    {props.eleve.nom}                     
                </div>

                {/*----- CAS BULLETIN TRIMESTRIEL -------*/}
                
                {(typeBulletin==2)&&
                    <div style={{width:'7vw'}}> {props.eleve.moy_seq1} </div>
                }
                
                {(typeBulletin==2)&&
                    <div style={{width:'7vw'}}> {props.eleve.moy_seq2} </div>
                }
                
                {/*----- CAS BULLETIN ANNUEL -------*/}
                
                {(typeBulletin==3)&&
                    <div style={{width:'7vw', fontSize:"0.7vw"}}> {props.eleve.moy_trim1}  </div>
                }
                
                {(typeBulletin==3)&&
                    <div style={{width:'7vw', fontSize:"0.7vw"}}> {props.eleve.moy_trim2}  </div>
                }

                {(typeBulletin==3)&&
                    <div style={{width:'7vw', fontSize:"0.7vw"}}> {props.eleve.moy_trim3}  </div>
                }
               
                <div style={{width:'7vw', fontSize:"0.7vw"}}>  {props.eleve.moyenne}       </div>

                {/*----- CAS BULLETIN ANNUEL -------*/}
                {(typeBulletin==3)&&
                    <div style={{width:'10vw'}}> {props.eleve.decision}  </div>
                }
                {(typeBulletin==3)&&
                    <div style={{width:'10vw'}}> {props.eleve.promuEn}   </div>
                }               
              
            </div>
        );
    }

    


    return (
        <div className={'card '+ classes.formContainerP} style={{width:"53vw"}}>
           
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/genBulletinsP.png'/>
                </div>

                <div className={classes.formMainTitle} >
                    {t("RESULTATS DE LA GENERATION ") + bullTypeLabel +' - '+props.bullPeriodeLabel}
                </div>
                
            </div>
          
          
            <div style={{display:'flex', flexDirection:'column', paddingLeft: "1.37vw", paddingRight:"2vw",  paddinginTop:'30.7vh', height:'70vh', width:'80vw',  justifyContent:'center', position:"absolute"}}>
                
                <div style={{display:'flex', flexDirection:'column', width:'87%', position:"absolute", top:"3vh",}}>
                    
                    <div style={{position:'absolute', top:'6.3vh', width:"100%", fontSize:"0.9vw", fontWeight:"800", display:'flex', flexDirection:'row'}} >
                        <img src={'images/' + getPuceByTheme()} className={classes.PuceStyle}/>
                        {t("ELEVES CLASSES (ORDRE DE MERITE) ")}
                    </div>

                    <LigneEleveHeader ordered={true}/>
                    <div style={{display:'flex', flexDirection:'column', position:"absolute", top:"13vh", width:"50vw", height:elevesNCL.length>0 ?"40vh":"70vh", overflowY:"scroll", overflowX:'scroll', border: "solid 1px #6286b6cf", borderRadius:3}}>
                        {(elevesCL||[]).map((elv, index)=>{
                            return (
                                <LigneEleve 
                                    rowIndex = {index} 
                                    ordered =  {true}
                                    eleve   =  {elv}                                 
                                />
                            )})
                        }
                    </div>  

                </div>
               
                {(elevesNCL.length>0) &&
                    <div style={{display:'flex', flexDirection:'column', justifyContent:"center", position:"absolute", top:"53vh",width:'87%'}}>
                        
                        <div style={{position:'absolute', top:'6.3vh', width:"100%", fontSize:"0.9vw", fontWeight:"800", display:'flex', flexDirection:'row'}} >
                            <img src={'images/' + getPuceByTheme()} className={classes.PuceStyle}/>
                            {t("ELEVES NON CLASSES - ORDRE ALPHABETIQUE")}
                        </div>

                        
                        <LigneEleveHeader ordered={false}/>
                    
                    
                    
                        <div style={{display:'flex', flexDirection:'column', position:"absolute", top:"13vh", width:"50vw", height:"17vh", overflowY:"scroll", overflowX:'scroll', border: "solid 1px #ec6885", borderRadius:3}}>
                            {(elevesNCL||[]).map((elv, index)=>{
                                return (
                                    <LigneEleve
                                        rowIndex = {index}   
                                        ordered =  {false}
                                        eleve   =  {elv}                                 
                                    />
                                )})
                            }
                        </div>
                    

                    </div>
                }
                
                    
            </div>

            <div style={{display:'flex', flexDirection:'row', position:'absolute', right:0, bottom:'3vh'}}>
                <CustomButton
                    btnText={t("quitter")} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={quitFormAndGetData}
                />

                <CustomButton
                    btnText={t("imprimer_bulletin")} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={printReports}
                    style={{width:"fit-content",padding:3}}
                />
            </div>

        </div>

         
       
       
    );
 }
 export default ResultatsGeneration;
 