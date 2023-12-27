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
var TABCLASSE     = [];


function AddManuel(props) {
    const { t, i18n }    = useTranslation();
    
    const currentUiContext   = useContext(UiContext);
    const currentAppContext  = useContext(AppContext);
    const selectedTheme      = currentUiContext.theme;
    // const [isValid, setIsValid] = useState(false);
    const [optTypeManuel, setOptTypeManuel] = useState([]);
    const [optClasse, setOptClasse]         = useState([]);
    
    var typeManuel =[
        {value:1, label:"Livre"},
        {value:2, label:"fasicule"}, 
        {value:3, label:"Dictionnaire"},        
    ]


    useEffect(()=> {        
        CURRENT_ANNEE_SCOLAIRE = document.getElementById("activated_annee").options[0].label;
        setOptTypeManuel(typeManuel);
        getEtabClasses();       

        if(props.formMode != 'creation'){ 
            
        }else{
            
        }        
    },[]);


    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
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
   

    function getFormData(){
      
    }
    
    function formDataCheck1(eleve){       
        var errorMsg='';
        if(eleve.nom.length == 0){
            errorMsg= t('enter_student_name'); 
            return errorMsg;
        }

        if (eleve.prenom.length == 0) {
            errorMsg= t('enter_student_surname'); 
            return errorMsg;
        }

        if(eleve.date_naissance.length == 0) {
            errorMsg= t('enter_correct_bithDate'); 
            return errorMsg;
        } 

        if(!((isNaN(eleve.date_naissance) && (!isNaN(Date.parse(eleve.date_naissance)))))){
            errorMsg= t('enter_correct_bithDate'); 
            return errorMsg;
        }

        if(eleve.lieu_naissance.length == 0 ){
            errorMsg= t('enter_student_bithPlace');  
            return errorMsg;
        }    
        return errorMsg;  
    }
    

    function getEtabClasses(){
        var tempTable=[];
        var tabClasses=[];
        TABCLASSE = [];
         
        tabClasses =  currentAppContext.infoClasses.filter((cls)=>cls.id_setab == currentAppContext.currentEtab && cls.id_niveau==props.currentLevel)
        tabClasses.map((cls)=>{
            tempTable.push({value:cls.id_classe, label:cls.libelle});
            TABCLASSE.push(1); 
        });

        setOptClasse(tempTable);
    }


    function manageChbxChange(e, index){
        if(e.target.checked) TABCLASSE[index] = 1;        
        else TABCLASSE[index] = 0;
     //   setExamClasses(TABCLASSE);
        console.log("checked",TABCLASSE.join('_'));
    }

    function typeChangeHandler(){

    }


    /************************************ JSX Code ************************************/

    return (
        <div className={'card '+ classes.formCanvas} style={{width:"37vw", height:"50vh"}}>
            <div className={getCurrentHeaderTheme()}>
                <div className={classes.formImageContainer}>
                    <img alt='add student' className={classes.formHeaderImgP} src='images/addBook.png'/>
                </div>
                <div className={classes.formMainTitle} >
                    {t("new_manuel_M")}
                </div>
                
            </div>

               
            <div id='errMsgPlaceHolder'/> 
        
            <div id="AjoutEleveEtape1" className={classes.etape} /*onLoad={()=>{moveToLeft()}}*/>
                {/* <div className={classes.inputRowLeft} style={{color:'rgb(6, 146, 18)', justifyContent:"flex-end", fontFamily:'Roboto, sans-serif', fontWeight:570, fontSize:'1.27vw', borderBottomWidth:"auto", borderBottomStyle:'solid', borderBottomColor:'rgb(6, 146, 18)', borderBottomWidth:1.97, marginBottom:'3vh', paddingRight:"1.3vw"}}> 
                    {t("session_M")} : {CURRENT_ANNEE_SCOLAIRE} 
                </div> */}

                <div className={classes.inputRow} style ={{justifyContent:"flex-start"}}>
                    <div className={classes.groupInfo} style={{paddingTop:"1.7vh"}}>                       
                        <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("level")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-5vw'}}>  
                                <input id="classe" type="text" className={classes.inputRowControl }  defaultValue={props.currentLeveLabel} style={{width:'3vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#898585'}} disabled={true}/>
                                <input id="classe" type="hidden"  defaultValue={props.currentLevel}/>
                            </div>
                        </div>
                        
                        <div className={classes.inputRowLeft}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[11]}/>
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("nom_manuel")}:
                            </div>
                                
                            <div> 
                                <input id="nom" type="text"  defaultValue={currentUiContext.formInputs[0]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>

                        
                        <div className={classes.inputRowLeft}> 
                            <div style={{width:'7.7vw', fontWeight:570}}>
                                {t('manual_type')}:  
                            </div>
                                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'6vw'}}> 
                                <select id='select_type_manuel' defaultValue={1} onChange={typeChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-8.7vw', height:'4vh',width:'8vw'}}>
                                    {(optTypeManuel||[]).map((option)=> {
                                        return(
                                            <option  value={option.value}>{option.label}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>


                        <div className={classes.inputRowLeft}> 
                            <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[11]}/>
                            <div className={classes.inputRowLabel} style={{fontWeight:570}}>
                                {t("author")}:
                            </div>
                                
                            <div> 
                                <input id="nom" type="text"  defaultValue={currentUiContext.formInputs[0]} style={{marginLeft:'-2vw', height:isMobile ? '1.3vw':'1.7vw', fontSize:'1vw', width:'23vw'}}/>
                            </div>
                        </div>

                        <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 
                            <div className={classes.inputRowLabelP} style={{fontWeight:570, }}>
                                {t("prix_en_vigueur")}: 
                            </div>                    
                            <div style={{marginBottom:'1.3vh', marginLeft:'-5vw'}}>  
                                <input id="classe" type="number" className={classes.inputRowControl }  defaultValue={props.currentClasseLabel} style={{width:'7vw', textAlign:'center', height:'1.3vw', fontSize:'1.3vw', marginLeft:'0vw', color:'#898585'}} />
                                <input id="classe" type="hidden"  defaultValue={props.currentClasseId}/>
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
                    // disable={(isValid==false)}
                />
                
                <CustomButton
                    btnText={t("save")}
                    // hasIconImg= {true}
                    // imgSrc='images/etape2.png'
                    imgStyle = {classes.frmBtnImgStyle2} 
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.actionHandler}
                    // disable={(isValid==false)}
                />
      
            </div>

        </div>
       
    );
 }
 export default AddManuel;
 