import React from 'react';
import ReactDOM from 'react-dom';
import { useFilePicker } from 'use-file-picker';
import {isMobile} from 'react-device-detect';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import  FormNumero from "../../../formPuce/FormNumero";
import FormPuce from '../../../formPuce/FormPuce';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from '../../../backDrop/BackDrop';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import AppContext from '../../../../store/AppContext';
import UiContext from "../../../../store/UiContext";
import {convertDateToUsualDate} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";


var LIST_ELEVES = undefined;
var JOUR_DEB, MOIS_DEB, YEAR_DEB, DATEDEB;
var JOUR_FIN, MOIS_FIN, YEAR_FIN, DATEFIN;
var JOUR_SORTIE, MOIS_SORTIE, YEAR_SORTIE, DATESORTIE;

var HEURE_DEB, MIN_DEB;
var HEURE_FIN, MIN_FIN;

var eleves_data=[];

var BILLET_SORTIE ={}
var currentEleveId = undefined;




var chosenMsgBox;
const MSG_SUCCESS =1;
const MSG_WARNING =2;


function BilletES(props) {
    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext)
    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;
    const [optEleves, setOptEleves] = useState([]);
    const [isDureeJour, setIsDureeJour] = useState(true);
    const [isBilletJustified, setIsBilletJustified] = useState(false);
   
  
    useEffect(()=> {
        getClassStudentList(props.currentClasseId);
        currentEleveId = undefined;
        
        if (props.formMode != 'creation'){
            BILLET_SORTIE = {
                id_eleves   : currentUiContext.formInputs[0],
                id_billet   : currentUiContext.formInputs[1],                
                id_sousetab : currentUiContext.formInputs[2],
                id_classe   : currentUiContext.formInputs[3], 
                nom         : currentUiContext.formInputs[4],                
                type_duree  : currentUiContext.formInputs[5],
                date_deb    : currentUiContext.formInputs[6],
                date_fin    : currentUiContext.formInputs[7],
                date_jour   : currentUiContext.formInputs[8],
                status      : currentUiContext.formInputs[9],
            }
            
            var tabEleves = [... optEleves];
            tabEleves.splice(0,1);
           
            var curEleve = tabEleves.find((elv)=>elv.value == BILLET_SORTIE.id_eleves);
            var index    = tabEleves.findIndex((elv)=>elv.value == BILLET_SORTIE.id_eleves);
           
            tabEleves.splice(index,1);
            tabEleves.unshift(curEleve);
           
            setOptEleves(tabEleves);
            setIsBilletJustified(BILLET_SORTIE.status);
            
            var estDureeJour = (BILLET_SORTIE.type_duree == "jour") ? true : false;
            setIsDureeJour(estDureeJour)
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
    const  getClassStudentList=(classId)=>{
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log("eleves", res.data);
            setOptEleves(getElevesTab(res.data));
                  
        })  
    }

    function getElevesTab(elevesTab){
        var tabEleves = [{value:0,label:"---------------- "+t('choose_eleve')+" ---------------"}]
        var new_eleve;
        elevesTab.map((eleve)=>{
            new_eleve = {};
            new_eleve.value = eleve.id;
            new_eleve.label = eleve.nom +' '+eleve.prenom;
            tabEleves.push(new_eleve);       
        })
        return tabEleves;
    }


    function complete0(ch){
        if(ch.length==1) ch = '0'+ch;
    }


    function checkFormData(){
        var errorMsg='';
        var today = complete0(new Date().getDate())+'/'+ complete0(new Date().getMonth()+1)+'/'+new Date().getFullYear();

        console.log(new Date(),new Date(BILLET_SORTIE.date_deb) < new Date());

        
       
        console.log("id Eleve",currentEleveId);

        if(currentEleveId==undefined || currentEleveId==0){
            errorMsg=t("select_student");
            return errorMsg;
        }


        if(isDureeJour){

            if(BILLET_SORTIE.date_deb == undefined || BILLET_SORTIE.date_deb.length == 0) {
                errorMsg=t("enter_startdate");
                return errorMsg;
            } 

            if(!((isNaN(BILLET_SORTIE.date_deb) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_deb))))))){
                errorMsg=t("enter_good_startdate");
                return errorMsg;
            }
    
            if(BILLET_SORTIE.date_fin == undefined || BILLET_SORTIE.date_fin.length == 0) {
                errorMsg=t("enter_enddate");
                return errorMsg;
            } 
    
            if(!((isNaN(BILLET_SORTIE.date_fin) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_fin))))))){
                errorMsg=t("enter_good_enddate");
                return errorMsg;
            }

            //Ajouter les tests de comparaison entre les deux dates et avec la date du jour
            if(new Date(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_fin)) < new Date(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_deb))) {
                errorMsg = t("startDate_greater_than_endDate_error");
                return errorMsg;
            } 

            //Test de posteriorite a la date d'aujourd'hui
            if(new Date(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_deb)) < new Date()) {
                errorMsg = t("dateDeb_lower_than_today_error");
                return errorMsg;
            }

        } else {
            var BS_hourDeb = BILLET_SORTIE.date_deb.split(':')[0];
            var BS_minDeb  = BILLET_SORTIE.date_deb.split(':')[1]
            var BS_hourFin = BILLET_SORTIE.date_fin.split(':')[0];
            var BS_minFin  = BILLET_SORTIE.date_fin.split(':')[1]

            if(BILLET_SORTIE.date_jour == undefined || BILLET_SORTIE.date_jour.length == 0) {
                errorMsg=t("enter_exitdate");
                return errorMsg;
            } 
    
            if(!((isNaN(BILLET_SORTIE.date_jour) && (!isNaN(Date.parse(changeDateIntoMMJJAAAA(BILLET_SORTIE.date_jour))))))){
                errorMsg=t("enter_good_exitdate");
                return errorMsg;
            }

            if(BS_hourDeb.length == 0|| BS_minDeb.length == 0) {
                errorMsg=t("enter_good_start_hour");
                return errorMsg;
            } 
    
            if(isNaN(BS_hourDeb)||isNaN(BS_minDeb)){
                errorMsg=t("enter_good_start_hour");
                return errorMsg;
            }

            if(BS_hourFin.length == 0|| BS_minFin.length == 0) {
                errorMsg=t("enter_good_end_hour");
                return errorMsg;
            } 
    
            if(isNaN(BS_hourFin)||isNaN(BS_minFin)){
                errorMsg=t("enter_good_end_hour");
                return errorMsg;
            }

            //Ajouter ici le test de coparaison entre les deux heures
            var dateTimeDeb = '01-01-2023 '+BILLET_SORTIE.date_deb+':00';
            var dateTimeFin = '01-01-2023 '+BILLET_SORTIE.date_fin+':00';
            
            console.log('la date'+dateTimeFin, new Date(dateTimeFin));
            
            if(new Date(dateTimeFin) < new Date(dateTimeDeb)) {
                errorMsg = t("startHour_greater_than_endHour_error");
                return errorMsg;
            }
        }
               
        return errorMsg;
    }

    function getFormData(){
        BILLET_SORTIE = {};
        BILLET_SORTIE.id_sousetab = currentAppContext.currentEtab;
        BILLET_SORTIE.id_classe   = props.currentClasseId;
        BILLET_SORTIE.id_eleves   = currentEleveId;
        BILLET_SORTIE.type_duree  = isDureeJour? "jour" : "heure";
        BILLET_SORTIE.date_deb    = DATEDEB;
        BILLET_SORTIE.date_fin    = DATEFIN;
        BILLET_SORTIE.date_jour   = DATESORTIE;
        BILLET_SORTIE.status      = isBilletJustified;
        console.log("Billet",BILLET_SORTIE)
    }

    // ------- Duree en heure
    function  getJourDeb(e){
        JOUR_DEB = e.target.value;
        DATEDEB = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
        
    }

    function  getMoisDeb(e){
        MOIS_DEB = e.target.value;
        DATEDEB = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
      
    }

    function  getAnneeDeb(e){
        YEAR_DEB = e.target.value;
        DATEDEB = JOUR_DEB+'/'+MOIS_DEB+'/'+YEAR_DEB;
    }

    function  getJourFin(e){
        JOUR_FIN = e.target.value;
        DATEFIN = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    }

    function  getMoisFin(e){
        MOIS_FIN = e.target.value;
        DATEFIN = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    }

    function  getAnneeFin(e){
        YEAR_FIN = e.target.value;
        DATEFIN = JOUR_FIN+'/'+MOIS_FIN+'/'+YEAR_FIN;
    }


    // ------- Date du jour 
    function  getJourSortie(e){
        JOUR_SORTIE = e.target.value;
        DATESORTIE = JOUR_SORTIE+'/'+MOIS_SORTIE+'/'+YEAR_SORTIE;
    }

    function  getMoisSortie(e){
        MOIS_SORTIE = e.target.value;
        DATESORTIE = JOUR_SORTIE+'/'+MOIS_SORTIE+'/'+YEAR_SORTIE;
    }

    function  getAnneeSortie(e){
        YEAR_SORTIE = e.target.value;
        DATESORTIE = JOUR_SORTIE+'/'+MOIS_SORTIE+'/'+YEAR_SORTIE;
    }

    // ------- Duree en heure 
    function getheureDeb(e){
        HEURE_DEB = e.target.value;
        DATEDEB = HEURE_DEB+':'+MIN_DEB;
    }


    function getMinDeb(e){
        MIN_DEB = e.target.value;
        DATEDEB = HEURE_DEB+':'+MIN_DEB;
    }

    function getheureFin(e){
        HEURE_FIN = e.target.value;
        DATEFIN = HEURE_FIN+':'+MIN_FIN;
    }


    function getMinFin(e){
        MIN_FIN = e.target.value;
        DATEFIN = HEURE_FIN+':'+MIN_FIN;
    }



    function changeDateIntoMMJJAAAA(date){
        var dateTab = date.split('/');
        return dateTab[1]+'/'+dateTab[0]+'/'+dateTab[2];
    }


    function saveBilletHandler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        BILLET_SORTIE ={};
        getFormData();
        var formErrors = checkFormData();
        
        if(formErrors.length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }       
                      
            props.createElthandler(BILLET_SORTIE);

        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formErrors;
        }
        
    }


    function updateBilletHandler(){
        var errorDiv = document.getElementById('errMsgPlaceHolder');
        BILLET_SORTIE ={};
        getFormData();
        var formErrors = checkFormData();
        
        if(formErrors.length==0){
            if(errorDiv.textContent.length!=0){
                errorDiv.className = null;
                errorDiv.textContent = '';
            }       
                      
            props.ModifyEltHandler(BILLET_SORTIE);

        } else {
            errorDiv.className = classes.formErrorMsg;
            errorDiv.textContent = formErrors;
        }

    }

  

  
   
    function elevesChangeHandler(e){
        currentEleveId = e.target.value;
    }

    function cancelHandler(){      
        props.cancelHandler();
    }

    

    function moveOnMax(e,currentField, nextField){
        if(nextField!=null){
            e = e || window.event;
            if(e.keyCode != 9){
                if(currentField.value.length >= currentField.maxLength){
                    nextField.focus();
                }
            }
        }
     
    }

    function manageDureeHandler(e){
        if(isDureeJour) setIsDureeJour(false);
        else setIsDureeJour(true)
        DATEDEB = '';
        DATEFIN = '';
        DATESORTIE = '';
    }

    function manageJustifyHandler(e){
        if(isBilletJustified) setIsBilletJustified(false);
        else setIsBilletJustified(true);
    }
  

    /************************************ JSX Code ************************************/

       return (
            <div className={'card '+ classes.formContainerP6}>
           
                <div className={getCurrentHeaderTheme()} style={{marginBottom:"10vh"}}>
                    <div className={classes.formImageContainer}>
                        <img alt='add student' className={classes.formHeaderImg} src='images/BilletEntreeSortie.png'/>
                    </div>
                    {(props.formMode == 'creation')  ?                
                        <div className={classes.formMainTitle} >
                            {t("new_exit_Permission_M")}
                        </div>
                    : (props.formMode == 'modif') ?
                        <div className={classes.formMainTitle} >
                            {t("update_exit_permission_M")}
                        </div>
                    :
                        <div className={classes.formMainTitle} >
                            {t("look_exit_permission_M")}
                        </div>
                    }
                
                </div>
                
                <div id='errMsgPlaceHolder'/> 

          
              
                    <div className={classes.inputRowLeft}>
                        <div className={classes.groupInfo} style={{fontSize:'1vw'}}>
                            <div className={classes.inputRowLeft} style={{height:'4.7vh', marginTop:"2vh"}}> 
                                <div style={{fontWeight:570, width:"10vw"}}>
                                    {t("eleve_nom")}:
                                </div>

                                {(props.formMode =='consult') ?
                                    <div> 
                                        <input id="eleve" type="text"        className={classes.inputRowControl}    defaultValue={currentUiContext.formInputs[0]}    style={{width:'15vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        <input id="eleveId" type="hidden"    className={classes.inputRowControl}    defaultValue={currentUiContext.formInputs[4]}    style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                    </div>  
                                    :
                                    <select id='elevesSelect' onChange={elevesChangeHandler} className={classes.comboBoxStyle} style={{marginLeft:'-2.3vw', height:'1.87vw',width:'23vw'}}>
                                        {(optEleves||[]).map((option)=> {
                                            return(
                                                <option  style={{textAlign:"left"}}  value={option.value}>{option.label}</option>
                                            );
                                        })}
                                    </select>
                                }                                 
                                
                            </div>

                            <div className={classes.inputRowLeft} style={{height:'4.7vh', marginTop:"2vh"}}> 
                                <input id="id" type="hidden"  defaultValue={currentUiContext.formInputs[0]}/>
                                <div style={{fontWeight:570,  width:"7.77vw"}}>
                                    {t("duree_in")}:
                                </div>
                                <div style={{display:'flex',  flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                    <input type="radio" name="type_duree" checked={isDureeJour}  onClick={manageDureeHandler}/>
                                    <div style={{marginLeft:"0.3vw"}}> {t('en_jour')} </div>
                                </div>

                                <div style={{display:'flex',  flexDirection:'row', justifyContent:'center', alignItems:'center', marginLeft:'2vw'}}>
                                    <input type="radio" name="type_duree"  onClick={manageDureeHandler} />
                                    <div style={{marginLeft:"0.3vw"}}> {t('en_heure')} </div>
                                </div>
                            </div>

                            {isDureeJour &&

                                <div className={classes.inputRowLeft} style={{height:'4.7vh', marginTop:"3vh"}}> 
                                    <div style={{fontWeight:570,  width:"10vw"}}>
                                        {t("date_deb")}:
                                    </div>
                                    {(props.formMode =='consult') ?
                                        <div> 
                                            <input id="date_deb" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[6]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        </div>
                                        :
                                        (props.formMode == 'creation') ?

                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}  onChange={getJourDeb}     maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} />/
                                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}  onChange={getMoisDeb}     maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />/
                                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}  onChange={getAnneeDeb}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                                            </div>
                                            :
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour_deb"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_deb"), document.getElementById("mois_deb"))}}  onChange={getJourDeb}     maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} defaultValue={currentUiContext.formInputs[6].split(":")[0]} />/
                                                <input id="mois_deb"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_deb"), document.getElementById("anne_deb"))}}  onChange={getMoisDeb}     maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  defaultValue={currentUiContext.formInputs[6].split(":")[1]} />/
                                                <input id="anne_deb"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_deb"), document.getElementById("jour_fin"))}}  onChange={getAnneeDeb}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}} defaultValue={currentUiContext.formInputs[6].split(":")[2]} />
                                            </div>
                                    }

                                    <div style={{fontWeight:570, marginLeft:"2vw", width:"10vw"}}>
                                        {t("date_fin")}:
                                    </div>
                                    
                                    {(props.formMode =='consult') ?
                                        <div> 
                                            <input id="date_fin" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[7]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        </div>
                                        :

                                        (props.formMode == 'creation') ?

                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}   onChange={getJourFin}    maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} />/
                                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}   onChange={getMoisFin}    maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />/
                                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}                                  onChange={getAnneeFin}   maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  />
                                            </div>
                                            :
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour_fin"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour_fin"), document.getElementById("mois_fin"))}}   onChange={getJourFin}    maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} defaultValue={currentUiContext.formInputs[7].split(":")[0]}/>/
                                                <input id="mois_fin"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois_fin"), document.getElementById("anne_fin"))}}   onChange={getMoisFin}    maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  defaultValue={currentUiContext.formInputs[7].split(":")[1]}/>/
                                                <input id="anne_fin"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne_fin"), null)}}                                  onChange={getAnneeFin}   maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  defaultValue={currentUiContext.formInputs[7].split(":")[2]}/>
                                            </div>
                                    }

                                </div>

                            }

                            {!isDureeJour &&                                 
                                <div className={classes.inputRowLeft} style={{height:'4.7vh', marginBottom:"1vh"}}> 
                                    <div style={{fontWeight:570, width:"10vw"}}>
                                        {t("date_jour")}:
                                    </div>
                                    {(props.formMode =='consult') ?
                                        <div> 
                                            <input id="date_jour" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[8]} style={{width:'6vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}}/>
                                        </div>
                                        :

                                        (props.formMode == 'creation') ?
                                        
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}          maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} onChange={getJourSortie}/>/
                                                <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}          maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMoisSortie}/>/
                                                <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure_deb"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getAnneeSortie}/>
                                            </div>
                                            :
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="jour"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour"), document.getElementById("mois"))}}          maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-2vw'}} onChange={getJourSortie}    defaultValue={currentUiContext.formInputs[8].split(":")[0]} />/
                                                <input id="mois"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois"), document.getElementById("anne"))}}          maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMoisSortie}    defaultValue={currentUiContext.formInputs[8].split(":")[1]}/>/
                                                <input id="anne"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne"), document.getElementById("heure_deb"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getAnneeSortie}   defaultValue={currentUiContext.formInputs[8].split(":")[2]}  />
                                            </div>
                                    }                                   

                                </div>
                                
                            }

                            
                            {!isDureeJour &&

                                <div className={classes.inputRowLeft} style={{height:'4.7vh'}}> 

                                

                                    <div className={classes.inputRowLabelP} style={{fontWeight:570}}>
                                        {t("heure_deb")}:
                                    </div>

                                    {(props.formMode =='consult') ?
                                        <div> 
                                            <input id="heure_deb" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}/>
                                        </div>
                                        :
                                        (props.formMode == 'creation') ?
                                    
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="heure_deb"  type="text"  Placeholder='hh'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure_deb"), document.getElementById("min_deb"))}}     maxLength={2}   className={classes.inputRowControl }   style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} onChange={getheureDeb} /><b>h</b>
                                                <input id="min_deb"  type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min_deb"), document.getElementById("heure_fin"))}}    maxLength={2}    className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMinDeb}/><b>min</b>
                                            </div>
                                            :
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="heure_deb"  type="text"  Placeholder='hh'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure_deb"), document.getElementById("min_deb"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} onChange={getheureDeb}  defaultValue={currentUiContext.formInputs[3].split(":")[0]} /><b>h</b>
                                                <input id="min_deb"  type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min_deb"), document.getElementById("heure_fin"))}}   maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMinDeb}    defaultValue={currentUiContext.formInputs[3].split(":")[0]} /><b>min</b>
                                            </div>
                                    }
                                    
                                    <div className={classes.inputRowLabelP} style={{fontWeight:570, marginLeft:'2vw'}}>
                                        {t("heure_fin")}:
                                    </div>

                                    {(props.formMode =='consult') ?
                                        <div> 
                                            <input id="heure_fin" type="text" className={classes.inputRowControl}  defaultValue={currentUiContext.formInputs[3]} style={{width:'3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}}/>
                                        </div>
                                        :

                                        (props.formMode == 'creation') ?

                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="heure_fin"  type="text"  Placeholder='hh'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure_fin"), document.getElementById("min_fin"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} onChange={getheureFin} /><b>h</b>
                                                <input id="min_fin"    type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min_fin"), null)}}                                    maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMinFin} /><b>min</b>
                                            </div>
                                            :
                                            <div style ={{display:'flex', flexDirection:'row'}}> 
                                                <input id="heure_fin"  type="text"  Placeholder='hh'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("heure_fin"), document.getElementById("min_fin"))}}     maxLength={2}   className={classes.inputRowControl }  style={{width:'1.3vw', height:'1.3vw', fontSize:'1vw', marginLeft:'-7vw'}} onChange={getheureFin} defaultValue={currentUiContext.formInputs[3].split(":")[0]}/><b>h</b>
                                                <input id="min_fin"    type="text"    Placeholder='mm'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("min_fin"), null)}}                                    maxLength={2}   className={classes.inputRowControl }  style={{width:'1.7vw', height:'1.3vw', fontSize:'1vw', marginLeft:'0vw'}}  onChange={getMinFin} defaultValue={currentUiContext.formInputs[3].split(":")[0]}/><b>min</b>
                                            </div>
                                    }

                                </div>
                            }

                            {(props.formMode != 'creation') &&
                                <div className={classes.inputRowLeft} style={{marginLeft:'0vw', marginTop:"1vh"}}>
                                    <div style={{marginTop:'0.23vh'}}>  
                                        <input type='checkbox' checked={isBilletJustified} style={{width:"1.3vw", height:"1.3vw"}} onClick={manageJustifyHandler}/>                             
                                    </div>

                                    <div className={classes.inputRowLabel} style={{fontWeight:570, marginLeft:'0.3vw', width:"20vw"}}>
                                        {t('Justify_permission')}
                                    </div>
                                </div>
                            }

                        </div>
                       
                    </div>
                    
                    
                    {(props.formMode != 'consult') ?
                        <div className={classes.inputRowRight} style={{borderTopStyle:'solid', borderTopWidth:"2px", paddingTop:"2vh", position:'absolute', bottom:'0', marginBottom: isMobile ? '-1vh':'2vh'}}>
                            <CustomButton
                                btnText={t("cancel")}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={cancelHandler}
                            />

                            {(props.formMode != 'creation') &&
                                <CustomButton
                                    btnText={t("apply")}
                                    buttonStyle={getGridButtonStyle()}
                                    btnTextStyle = {classes.btnTextStyle}
                                    btnClickHandler={saveBilletHandler}
                                />

                            }

                            {(props.formMode != 'modif') &&

                                <CustomButton
                                    btnText={t("save")}
                                    buttonStyle={getGridButtonStyle()}
                                    btnTextStyle = {classes.btnTextStyle}
                                    btnClickHandler={updateBilletHandler}
                                />
                            }

                        </div>
                      
                        :                    

                        <div className={classes.inputRowRight} style={{borderTopStyle:'solid', borderTopWidth:"2px", paddingTop:"2vh", position:'absolute', bottom:'0', marginBottom: isMobile ? '-1vh':'2vh'}}>
                            <CustomButton
                                btnText={t("cancel")}
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.btnTextStyle}
                                btnClickHandler={cancelHandler}
                            />
                        </div>

                    }                 
                </div>            
           
       
        );
    }
 export default BilletES;
 