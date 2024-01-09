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


var CURRENT_ELEVE = {};
var CURRENT_ANNEE_SCOLAIRE;
var CURRENT_MANUEL;
var TABCLASSE     = [];


function AddManuel(props) {
    const { t, i18n }    = useTranslation();
    
    const currentUiContext   = useContext(UiContext);
    const currentAppContext  = useContext(AppContext);
    const selectedTheme      = currentUiContext.theme;
    // const [isValid, setIsValid] = useState(false);
    const [optClasse,  setOptClasse]        = useState([]);
    const [tabChecked, setTabChecked]       = useState([]);
    const [manuelClasses, setManuelClasses] = useState([]);
    
    var typeManuel =[
        {value:1, label:"Livre"},
        {value:2, label:"fasicule"}, 
        {value:3, label:"Dictionnaire"},        
    ]


    useEffect(()=> {        
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        getEtabClasses();       

        // if(props.formMode != 'creation'){ 
        //     CURRENT_MANUEL = {};
        //     CURRENT_MANUEL.id_manuel   = currentUiContext.formInputs[0];
        //     CURRENT_MANUEL.description = currentUiContext.formInputs[0]
        // }      
    },[]);


    function saveManuel(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        console.log('avant:',CURRENT_MANUEL);
        getFormData();
        console.log('apres:',CURRENT_MANUEL);

        var fomCheckErrorStr =  formDataCheck1(CURRENT_MANUEL);
        
        if(fomCheckErrorStr.length == 0){
           
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }
            props.actionHandler(CURRENT_MANUEL);  
    
        } else {
            errorDiv.textContent = fomCheckErrorStr;
            errorDiv.className   = classes.formErrorMsg;            
        }
    }

    function getFormData(){
        
        CURRENT_MANUEL = {};
        var selected_classes =  manuelClasses.filter((elt)=>elt!=0);

        if(props.formMode == "creation"){
            CURRENT_MANUEL.id_manuel  = -1;
        } else {
            CURRENT_MANUEL.id_manuel  = currentUiContext.formInputs[0];
        }
     
        CURRENT_MANUEL.nomLivre    = document.getElementById('nom_manuel').value;
        CURRENT_MANUEL.description = document.getElementById('description').value; 
        CURRENT_MANUEL.prix        = document.getElementById('prix_en_vigueur').value;
        CURRENT_MANUEL.data        = CURRENT_MANUEL.nomLivre+'²²'+CURRENT_MANUEL.description+'²²'+ CURRENT_MANUEL.prix; 

        CURRENT_MANUEL.id_sousetab = currentAppContext.currentEtab;
        CURRENT_MANUEL.id_classes  = selected_classes.length >0 ? selected_classes.join("²²"):'';
        CURRENT_MANUEL.id_niveau      = parseInt(props.currentLevel);                  
    }

    function formDataCheck1(manuel){       
        var errorMsg='';
        if(manuel.nomLivre.length == 0){
            errorMsg= t('enter_manuel_name'); 
            return errorMsg;
        }

        if (manuel.prix.length == 0) {
            errorMsg= t('enter_manuel_price'); 
            return errorMsg;
        }

        if(isNaN(manuel.prix)) {
            errorMsg= t('enter_correct_manuel_price'); 
            return errorMsg;
        } 


        if(manuel.id_classes.length == 0 ){
            errorMsg= t('no_manuel_classes_selected');  
            return errorMsg;       
        }    
        return errorMsg;  
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
   
    function getEtabClasses(){
        var listClasseCible = [];
        var tempTable       = [];
        var tabClasses      = [];
        TABCLASSE = [];
        
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab && cls.id_niveau==props.currentLevel)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
            TABCLASSE.push(cls.id_classe); 
            listClasseCible.push(0);
        });

        if(props.formMode != 'creation'){ 
            var selectedClasse =  currentUiContext.formInputs[4].split(',');
            selectedClasse.map((elt)=>{
                for(var i=0; i<TABCLASSE.length; i++){
                    if(TABCLASSE[i]== elt) listClasseCible[i] = elt;
                }               
            });

            TABCLASSE = [...listClasseCible];            
        }

        setOptClasse(tempTable);
        setManuelClasses(TABCLASSE);
    }


    function manageChbxChange(e, index){
        if(e.target.checked) TABCLASSE[index] = optClasse[index].value;        
        else TABCLASSE[index] = 0;
        setManuelClasses(TABCLASSE);
        console.log("checked",TABCLASSE.join('_'));
    }

   
    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formCanvas} style={{width:"37vw", height:"50vh"}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImgP} src='images/addBookP.png'/>
                </div>
                {(props.formMode == "creation") ?
                    <div className={classes.formMainTitle} >
                        {t("new_manuel_M")}
                    </div>
                    :
                    (props.formMode == "modif") ?
                        <div className={classes.formMainTitle} >
                            {t("update_manuel_M")}
                        </div>
                    :
                    <div className={classes.formMainTitle} >
                        {t("consult_manuel_M")}
                    </div>
                }
                
                
            </div>

               
            <div id='errMsgPlaceHolder'/> 
        
            <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
                {/* <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', justifyContent:"flex-end", fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomWidth:"auto", borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'3vh', paddingRight:"1.3vw"}}> 
                    {t("session_M")} : {CURRENT_ANNEE_SCOLAIRE} 
                </div> */}

                <div className={classes.inputRow} style ={{justifyContent:"flex-start"}}>
                    <div className={classes.groupInfo} style={{paddingTop:"2.3vh"}}>                       
                        <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("level")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-5vw'}}>  
                                <input id="niveau" type="text"    className={classes.inputRowControl }  defaultValue={props.currentLeveLabel} style={{width:'3vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#494646'}} disabled={true}/>
                                <input id="niveau" type="hidden"  defaultValue={props.currentLevel}/>
                            </div>
                        </div>
                        
                        <div className={classes.inputRowLeft}> 
                            
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("nom_manuel")}:
                            </div>
                                
                            <div> 
                                <input id="nom_manuel" type="text" disabled={(props.formMode == 'consult')? true:false}  defaultValue={currentUiContext.formInputs[1]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>


                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("description")}:
                            </div>
                                
                            <div> 
                                <input id="description" type="text" disabled={(props.formMode == 'consult')? true:false}  defaultValue={currentUiContext.formInputs[2]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("prix_en_vigueur")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-5vw'}}>  
                                <input id="prix_en_vigueur" type="number" disabled={(props.formMode == 'consult')? true:false} className={classes.inputRowControl }  defaultValue={currentUiContext.formInputs[3]} style={{width:'7vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#898585'}} />
                            </div>
                            <div style={{marginBottom:'1.3vh', marginLeft:'0.3vw'}}>  
                                <input type="label" style={{border:"none"}}   value={"FCFA"}/>
                            </div>
                        </div>
                
                        <div className={classes.inputRowLeft}> 
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("class_associated")}:
                            </div>

                            <div style={{display:'flex', flexDirection:"row", justifyContent:"flex-start", flexWrap:"wrap", width:"30vw"}}> 
                                {optClasse.map((elt, index)=>{                                   
                                    return (
                                        <div style={{display:'flex', flexDirection:"row", justifyContent:"center", marginLeft:index==0 ? "-1vw":"1.3vw"}}> 
                                            <input id={"id_"+index} type="checkbox" disabled={(props.formMode == 'consult')? true:false}  defaultChecked={manuelClasses[index]!=0}  onClick={(e)=>manageChbxChange(e,index)} />
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
                    // disable={(isValid==false)}
                />
                
                {(props.formMode == 'creation') &&
                    <CustomButton
                        btnText={t("save")}
                        // hasIconImg= {true}
                        // imgSrc='images/etape2.png'
                        imgStyle = {classes.frmBtnImgStyle2} 
                        buttonStyle={getGridButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={saveManuel}
                        // disable={(isValid==false)}
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
                        btnClickHandler={saveManuel}
                        // disable={(isValid==false)}
                    />  
                }    
      
            </div>

        </div>
       
    );
 }
 export default AddManuel;
 