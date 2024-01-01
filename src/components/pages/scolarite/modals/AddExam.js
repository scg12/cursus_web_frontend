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

var CURRENT_ANNEE_SCOLAIRE;
var selected_niveau;
var CURRENT_EXAM  = {};
var TABCLASSE     = [];
var listNiveaux   = [];




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
        
    },[]);


    function getFormData(){
        CURRENT_EXAM = {};
        var selected_classes =  examClasses.filter((elt)=>elt!=0);

        if(props.formMode == "creation"){
            CURRENT_EXAM.id_exam  = -1;
        } else {
            CURRENT_EXAM.id_exam  = currentUiContext.formInputs[0];
        }
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

        var fomCheckErrorStr =  formDataCheck1(CURRENT_EXAM);
        
        if(fomCheckErrorStr.length==0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
            props.actionHandler(CURRENT_EXAM);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;           
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
        var tabNiveau=[];    
        tabNiveau =  currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == currentAppContext.currentEtab)
        tabNiveau.map((classe)=>{
            listNiveaux.push({value:classe.id_niveau, label:classe.libelle});
        });
        
        console.log("niveaux",listNiveaux);

        if(props.formMode != 'creation'){  
            var idNiveau = currentUiContext.formInputs[2];
            var tempTab  = [...listNiveaux];             
            var index1   = tempTab.findIndex((elt)=>elt.value == idNiveau );
            var niveau   = tempTab.find((elt)=>elt.value ==  idNiveau);
          
            tempTab.splice(index1,1);
            tempTab.unshift(niveau);
            listNiveaux = [];

            listNiveaux = [...tempTab];

            console.log("niveaux2",listNiveaux,tempTab);
        }

        selected_niveau = listNiveaux[0].value; 
        setOptNiveau(listNiveaux); 
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
        var listClasseCible = [];
        var tempTable       = []
        var tabClasses      = [];
        TABCLASSE = [];
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab && cls.id_niveau==selected_niveau)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
            TABCLASSE.push(cls.id_classe); 
            listClasseCible.push(0);
        });

        if(props.formMode != 'creation'){ 
            console.log("selected classe",currentUiContext.formInputs[4])
            var selectedClasse =  currentUiContext.formInputs[4].split('_');
            selectedClasse.map((elt)=>{
                for(var i=0; i<TABCLASSE.length; i++){
                    if(TABCLASSE[i]== elt) listClasseCible[i] = elt;
                }               
            });

            TABCLASSE = [...listClasseCible];            
        }

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
                    <input id="id" type="hidden"  className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[0]} />
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("nom_exam")}:
                            </div>
                                
                            <div> 
                                <input id="nom_exam" type="text"  defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>

                        
                        
                        <div className={classes.inputRowLeft}> 
                            
                            <div style={{width:'7.7vw', fontWeight:570}}>
                                {t('level')}:  
                            </div>


                            {(props.formMode =='consult') ?
                                <div> 
                                    <input id="levelLabel" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} disabled={true}/>
                                    <input id="levelId" type="hidden" />
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
                                            <input id={"id_"+index} type="checkbox"  defaultChecked={examClasses[index]!=0}  onClick={(e)=>manageChbxChange(e,index)} />
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

        

                {(props.formMode == 'creation') &&
                    <CustomButton
                        btnText={t("save")}
                        // hasIconImg= {true}
                        // imgSrc='images/etape2.png'
                        imgStyle = {classes.frmBtnImgStyle2} 
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={saveExam}
                    />                
                }
                
                
                {(props.formMode == 'modif') &&
                    <CustomButton
                        btnText={t("modify")}
                        // hasIconImg= {true}
                        // imgSrc='images/etape2.png'
                        imgStyle = {classes.frmBtnImgStyle2} 
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={saveExam}
                    />
                }
     
            </div>

        </div>
       
    );
 }
 export default AddExam;
 