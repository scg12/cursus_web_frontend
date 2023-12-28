import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import {isMobile} from 'react-device-detect';
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var CURRENT_EXAM = {};
var CURRENT_ANNEE_SCOLAIRE;
var TABCLASSE     = [];
var selected_niveau;



function AddExam(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [optNiveau, setOptNiveau]    = useState([]);
    const [optClasse, setOptClasse]    = useState([]);
    const [examClasses, setExamClasses] = useState([])
    const selectedTheme = currentUiContext.theme;
    
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
   
    useEffect(()=> {
        
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        getEtabNiveaux();
        getEtabClasses();

        if(props.formMode != 'creation'){ 
            CURRENT_EXAM = {};
        
            CURRENT_EXAM.id_exam  = putToEmptyStringIfUndefined(currentUiContext.formInputs[0]);
            CURRENT_EXAM.libelle  = putToEmptyStringIfUndefined(currentUiContext.formInputs[1]);
            CURRENT_EXAM.niveau   = putToEmptyStringIfUndefined(currentUiContext.formInputs[2]);
            
            //initialisation du select objet du conseil
            var tempTab = [...optNiveau];             
            var index1  = tempTab.findIndex((elt)=>elt.value ==  CURRENT_EXAM.niveau);
            var niveau  = tempTab.find((elt)=>elt.value ==  CURRENT_EXAM.niveau);
            
            tempTab.splice(index1,1);
            tempTab.unshift(niveau);
            setOptNiveau(tempTab);            
        }

    },[]);


    function getFormData(){
        CURRENT_EXAM = {};
        var selected_classes =  examClasses.filter((elt)=>elt!=0);

        if(props.formMode == "creation"){
            CURRENT_EXAM.id_exam  = -1;
        } else {
            CURRENT_EXAM.id_exam  = currentUiContext.formInputs[0];
        }
            
        CURRENT_EXAM.id_session   = props.id_session; 
        CURRENT_EXAM.id_sousetab  = currentAppContext.currentEtab;
        CURRENT_EXAM.libelle      = document.getElementById('nom_exam').value;
        CURRENT_EXAM.niveau       = selected_niveau;
        CURRENT_EXAM.classes      = selected_classes.length >0 ? selected_classes.join("_"):'';           
    }


    function saveExam(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_EXAM);
        getFormData();
        console.log('apres:',CURRENT_EXAM);
        
        if(formDataCheck1(CURRENT_EXAM).length==0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
            props.closeHandler(CURRENT_EXAM);  
    
        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formDataCheck1(CURRENT_EXAM);
        }
    }


    function formDataCheck1(exam){       
        var errorMsg='';
        if(exam.libelle.length == 0){
            errorMsg= t('enter_exam_name'); 
            return errorMsg;
        }

        if (exam.classes.length == 0) {
            errorMsg= t('no_classes_selected'); 
            return errorMsg;
        } 
      
        return errorMsg;  
    }


    function getEtabNiveaux(){
        var tempTable=[]
        var tabNiveau=[];
         
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab)
        tabNiveau.map((classe)=>{
        tempTable.push({value:classe.id_niveau, label:classe.libelle});
        });
        selected_niveau = tempTable[0].value;
        setOptNiveau(tempTable);
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
    

    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }
   
    function niveauChangeHandler(e){
        if(e.target.value > 0){
            selected_niveau  = e.target.value;
            var cur_index = optNiveau.findIndex((index)=>index.value == selected_niveau);
            getEtabClasses();            
 
        } else {
            selected_niveau  = undefined;
        }  
    }

    function getEtabClasses(){
        var tempTable=[]
        var tabClasses=[];
        TABCLASSE = [];
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab && cls.id_niveau==selected_niveau)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
            TABCLASSE.push(cls.id_classe); 
        });

        setOptClasse(tempTable);
        setExamClasses(TABCLASSE)
    }

    function manageChbxChange(e, index){
        if(e.target.checked) TABCLASSE[index] = optClasse[index].value;        
        else TABCLASSE[index] = 0;
        setExamClasses(TABCLASSE);

        console.log("checked",TABCLASSE.join('_'));
    }

    /************************************ JSX Code ************************************/
    return (
        <div className={'card '+ classes.formCanvas} style={{width:"37vw"}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImg} src='images/NewEvaluation.png'/>
                </div>
                {(props.formMode == 'creation')  ?                
                    <div className={classes.formMainTitle} >
                       {t("enreg_exams_M")}
                    </div>
                : (props.formMode == 'modif') ?
                    <div className={classes.formMainTitle} >
                       {t("modif_exams_M")}
                    </div>
                :
                    <div className={classes.formMainTitle} >
                       {t("consult_exams_M")}
                    </div>                
                }
                
            </div>

               
            <div id='errMsgPlaceHolder'/> 
        
            <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
                <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', justifyContent:"flex-end", fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomWidth:"auto", borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'3vh', paddingRight:"1.3vw"}}> 
                    {t("session_M")} : {CURRENT_ANNEE_SCOLAIRE} 
                </div>

                <div className={classes.inputRow} style ={{justifyContent:"flex-start"}}>
                    <div className={classes.groupInfo} >
                        
                        <div className={classes.inputRowLeft}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[11]}/>
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("nom_exam")}:
                            </div>
                                
                            <div> 
                                <input id="nom_exam" type="text"  defaultValue={currentUiContext.formInputs[0]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>

                        
                        
                        <div className={classes.inputRowLeft}> 
                            
                            <div style={{width:'7.7vw', fontWeight:570}}>
                                {t('level')}:  
                            </div>


                            {(props.formMode =='consult') ?
                                <div> 
                                    <input id="levelLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    <input id="levelId" type="hidden"  className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[2]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                </div>  
                                :
                                <div style={{marginBottom:'1.3vh', marginLeft:'6vw'}}> 
                                    <select id='select_level' defaultValue={1} onChange={niveauChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'4vh',width:'8vw'}}>
                                        {(optNiveau||[]).map((option)=> {
                                            return(
                                                <option  value={option.value}>{option.label}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            }

                        </div>
                
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("class_associated")}:
                            </div>
                                
                            <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-start", flexWrap:"wrap", width:"30vw"}}> 
                                {optClasse.map((elt, index)=>{                                   
                                    return (
                                        <div style={{display:'flex', flexDirection:"row", justifyContent:"center", marginLeft:index==0 ? "-1vw":"1.3vw"}}> 
                                            <input id={"id_"+index} type="checkbox"  defaultChecked={true}  onClick={(e)=>manageChbxChange(e,index)} />
                                            <label>{elt.label}</label>
                                        </div>
                                    )                                       

                                })}
                                
                            </div>
                        </div>
                        
                    </div>

                </div>
                    
            </div>
        
        
            <div className={classes.formButtonRow} style={{justifyContent:"flex-end"}}>
                <CustomButton
                    btnText= {t("cancel")}
                    // hasIconImg= {true}
                    // imgSrc='images/etape1.png'
                    imgStyle = {classes.frmBtnImgStyle1}   
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                <CustomButton
                    btnText={t("save")}
                    // hasIconImg= {true}
                    // imgSrc='images/etape2.png'
                    imgStyle = {classes.frmBtnImgStyle2} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={saveExam}
                />

                {/* <CustomButton
                    btnText={t("infoParnt")}
                    hasIconImg= {true}
                    imgSrc='images/etape3.png'
                    imgStyle = {classes.frmBtnImgStyle1} 
                    buttonStyle={classes.buttonEtape3}
                    btnTextStyle = {classes.btnEtapeTextStyle}
                    btnClickHandler={(etape3InActiv) ? null:()=>{showStep3();}}
                    disable={etape3InActiv} 
                /> */}
                
            </div>

        </div>
       
    );
 }
 export default AddExam;
 