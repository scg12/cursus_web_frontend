import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import axios from 'axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import { useTranslation } from "react-i18next";
import BackDrop from '../../../backDrop/BackDrop';
import MsgBox from '../../../msgBox/MsgBox';


var LIST_MATIERES_SPE = [];

var chosenMsgBox;
const MSG_SUCCESS_FP =11;
const MSG_WARNING_FP =12;
const MSG_ERROR_FP   =13;

var CRITERIA = {};

function CriteresGeneration(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const selectedTheme = currentUiContext.theme;
   

    const [modalOpen,setModalOpen] = useState(0);
    const [matieresSpe, setMatieresSpe] = useState([]);
   
    useEffect(()=> {
        console.log("classe", props.classeId);
        getMatieresSpecialites(props.classeId);
        currentUiContext.setIsParentMsgBox(false);
    },[]);


    function getMatieresSpecialites(idClasse){
        console.log("classeId",idClasse);
        LIST_MATIERES_SPE = [];
        axiosInstance.post(`classe-matieres-specialite/`, {
            id_classe: idClasse,
        }).then((res)=>{      
            console.log("matieres", res.data, );          
            (res.data||[]).map((matiere)=>{
                LIST_MATIERES_SPE.push({value:matiere.id, label:matiere.libelle});             
            })
            setMatieresSpe(LIST_MATIERES_SPE);
        })
    }


    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_FP: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_FP: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_FP: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
            }
        }
        
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

    /************************************ Handlers ************************************/    
    function checkMatiereSpeHandler(){

    }

    function matieresSansNoteHandler(){

    }

    function totalCoefMinHandler(){

    }

    function includeNCHandler(){

    }

    function includeCoefManquntsHandler(){

    }
    
    

    function generateSeqBulletin(){
        props.cancelHandler();
        props.generateHandler(CRITERIA)
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formContainerP5} style={{top:'23vh'}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/criteresGeneration.png'/>
                </div>
                           
                <div className={classes.formMainTitle} style={{marginLeft:'0.7vw'}}>
                    {t("CRITERES DE SELECTION DES ELEVES POUR GENERATION")}
                </div>                
            </div>
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("ok")}
                    buttonRejectText = {t("non")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            
            <div className={classes.searchFormContainer} style={{marginTop:'7vh'}}>               
              
                <div className={classes.legend} style={{marginRight:"0.3vw", top:'11.3vh'}}> <label style={{/*color:'#e0e06c',*/ color:"white",  fontWeight:"bold", fontSize:"0.83vw",}}><i>{t("Les éleves vérifiants les criteres suivants seront selectionnés pour génération des bulletins")}</i></label></div>                    
                <div className={classes.container} style={{marginTop:'1.3vw',  borderRadius:'7px', marginLeft:"-0.77vw", border:"solid 1.87px gray", justifyContent:'center', alignItems:'center', width:'95%', height:'33vh', paddingLeft:"1vw"}}> 
                    
                    <div className={classes.container} style={{marginBottom:'3.7vh', marginTop:'3.3vh',width:'100%'}}>
                        <div className={classes.inputRowLeft}>
                            <div className={classes.container}>
                                <div className={classes.inputRowLeft} style={{marginTop:"1.3vh",marginBottom:"0.7vh"}}>                                        
                                    <div style={{width:'30.3vw',fontWeight:570}}>
                                        {t('Nbre Max de matières sans notes')}:  
                                    </div>
                                    <input type='number' defaultValue={2} style={{fontSize:"1.03vw", textAlign:"center", width:'3.3vw', height:'3.3vh', marginTop:'0.7vh', border:"1px solid black", borderRadius:3}}  onClick={matieresSansNoteHandler}/>                                                                             
                                    
                                </div>

                                <div className={classes.inputRowLeft}>                                        
                                    <div style={{width:'30.3vw',fontWeight:570}}>
                                        {t('Total min de coefficients pris en compte')}:  
                                    </div>
                                    <input type='number' defaultValue={20} style={{fontSize:"1.03vw", textAlign:"center",width:'3.3vw', height:'3.3vh', marginTop:'0.7vh', border:"1px solid black", borderRadius:3}}  onClick={totalCoefMinHandler}/>                                       
                                </div>

                                {(matieresSpe.length>0) &&
                                    <div className={classes.inputRowLeft} style={{marginTop:"0.7vh"}}>                                       
                                        <div style={{width:'37.3vw',fontWeight:570}}>
                                            {t('Matières de spécialité qui doivent avoir des notes')}:  
                                        </div>                                    
                                    </div>                                
                                }

                                <div className={classes.inputRowLeft} style={{marginTop:"0.35vh", marginBottom:"1vw"}}>
                                    {(matieresSpe||[]).map((elt)=>{
                                        return (
                                            <div style={{width:"100%",display:"flex",flexDirection:"row", justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
                                                <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.3vh'}}   value={'presents'} name='matri' onClick={checkMatiereSpeHandler}/>
                                                <div style={{width:'fit-content',fontWeight:200, fontSize:"0.9vw", marginTop:'0.3vh'}}>
                                                    {elt.label}
                                                </div>
                                            </div>
                                        )
                                    })}                                    
                                </div>

                                <div className={classes.inputRowLeft}>
                                    <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.47vh', }} value={'presents'} name='matri' onClick={includeNCHandler}/>
                                    <div style={{width:'20vw',fontWeight:800, color:"#062686de", fontSize:"0.9vw"}}>
                                        {t('Inclure les élèves non classés')}
                                    </div>

                                    <input type='checkbox' style={{width:'1.3vw', height:'2vh', marginTop:'0.47vh'}}  value={'presents'} name='matri' onClick={includeCoefManquntsHandler}/>
                                    <div style={{width:'30vw',fontWeight:800, color:"#062686de", fontSize:"0.9vw"}}>
                                        {t('Calculer les moyennes de élèves non classés en incluant les coefs manquants')}
                                    </div>
                                </div>

                            </div>

                        
                        </div>

                    </div>
                       
                </div>               
               
            </div>
            
            <div className={classes.formButtonRowPP}>
               
                <CustomButton
                    btnText={t('cancel')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />

                <CustomButton
                    btnText= {t('generate')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={generateSeqBulletin}
                    //disable={(isActualStudent) ? !isActualStudent :!fileSelected}
                />               
            </div>
        </div>       
    );
 }
 export default CriteresGeneration;
 