import React from 'react';
import classes from './LoginForm.module.css';
import {Link} from 'react-router-dom';

import { useTranslation } from "react-i18next";
import '../../../translation/i18n';
import CustomButton from '../../customButton/CustomButton';

import {createAxiosInstance} from "../../../axios";
// import axiosInstance from "../../../axios"; 
import { useState,useContext} from "react";
import UiContext from '../../../store/UiContext';
import AppContext from '../../../store/AppContext';
import { useHistory } from 'react-router-dom';

import {initFeaturesCode,initAppFeatureTable} from '../../Features/FeaturesCode';
// import FeaturesCode from '../../Features/FeaturesCode';





var userProfile = ''
var profileAuthorisationString = ''
var ERROR_CODE;


var listNotifs=[];

let FeaturesCode = {}
function LoginForm(props){

    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const history = useHistory();
    const [passWordError, setPassWordError]=useState(false);
    const [isLoading, setIsLoading]=useState(false);
    
    //const [selectedValue, setSelectedValue] =useState();
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const usrConnected = currentAppContext.usrIsLogged;
    const passWdCorrect = false;

    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    const axiosInstance = createAxiosInstance(currentAppContext.serverAdress);


    //Necessaire pour l'emploi de temps
    let listMatieres = [];
    let matieres = [];
    let classess = [];
    let indexClasse = -1;
    let emploiDeTemps = [];
    let listProfs = [];
    let tab_jours = [];
    let tab_periodes = [];
    let tab_creneau_pause = [];
    let tab_valeur_horaire = [];


    function getCurrentHeaderTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_loginHeader + ' ' + classes.Theme1_header;
            case 'Theme2': return classes.Theme2_loginHeader + ' ' + classes.Theme2_header;
            case 'Theme3': return classes.Theme3_loginHeader + ' ' +classes.Theme3_header;
            default: return classes.Theme1_loginHeader + ' ' +classes.Theme1_header;
        }
    }

    function getCurrentContentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.mainContentPosition;
            case 'Theme2': return classes.mainContentPosition;
            case 'Theme3': return classes.mainContentPosition;
            default: return classes.mainContentPosition;
        }
    }

    function getCurrentFooterTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_footer;
            case 'Theme2': return classes.Theme2_footer;
            case 'Theme3': return classes.Theme3_footer;
            default: return classes.Theme1_footer;
        }
    }

    function getCurrentWidgetTemplateStyle()
    {  // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'right ' + classes.Theme1_widget ;
            case 'Theme2': return 'right ' + classes.Theme2_widget;
            case 'Theme3': return 'right ' + classes.Theme3_widget;
            default: return 'right ' + classes.Theme1_widget;
        }
    }

    function getWidgetContentStyle()
    {  // Choix du theme courant
    switch(selectedTheme){
        case 'Theme1': return classes.Theme1_widget_content ;
        case 'Theme2': return classes.Theme2_widget_content ;
        case 'Theme3': return classes.Theme3_widget_content ;
        default: return classes.Theme1_widget_content ;
        }
    }

    function getFormHeaderStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_formHeader;
            case 'Theme2': return classes.Theme2_formHeader;
            case 'Theme3': return classes.Theme3_formHeader;
            default: return classes.Theme1_formHeader;
        }
    }

    const getRightsStringFromProfile = (profile) => {
        console.log("profile:",profile)
        switch(profile) {
            
            case 'admin': { initFeaturesCode('1'); return('');} 
            
            case 'proviseur':  { initFeaturesCode('1'); return('');}
           
            case 'censeur':{ 
                initFeaturesCode('0'); 
                return('SCOLARITE*-COMM_PARENT*-FINANCE*-STATS*-CONFIG_A*-EXTRAS*');
            }  
           
            case 'surveillant': {
                initFeaturesCode('0');
                return('SCOLARITE_A2-SCOLARITE_B1-SCOLARITE_B3-SCOLARITE_B4-SCOLARITE_C*-SCOLARITE_E3-COMM_PARENT*-STATS*-CONFIG_A*-EXTRAS*');
            } 

            case 'econome': {
                initFeaturesCode('0'); 
                //return('SCOLARITE_A2-SCOLARITE_B1-FINANCE*-COMM_PARENT*-STATS*-CONFIG_B1-CONFIG_D1-EXTRAS*');
                return('FINANCE*-COMM_PARENT*-STATS*-CONFIG_B1-CONFIG_D1-EXTRAS*');
            }

            case 'enseignant': {
                initFeaturesCode('0'); 
                return('SCOLARITE_A2-SCOLARITE_A5-SCOLARITE_A6-SCOLARITE_B*-SCOLARITE_C*-SCOLARITE_D*-COMM_PARENT*-STATS*-CONFIG_A*-EXTRAS*');
            }

            case 'advisor': {
                initFeaturesCode('0'); 
                return('SCOLARITE_A2-SCOLARITE_A5-SCOLARITE_B1-SCOLARITE_B3-SCOLARITE_B4-SCOLARITE_C2-SCOLARITE_C3-SCOLARITE_D2-SCOLARITE_E3-COMM_PARENT*-STATS*-CONFIG_A*-EXTRAS*');
            }

        }
     
    }

    function getErrorMessage(errorCode){
        switch(errorCode){
            case 401: return "incorrectPwd";
            case 500: return "server_error";
            default: return "incorrectPwd";
        }
    }

    function updateCalendarTheme(theme){
        console.log("***theme.includes(3):",theme.includes("3"))
        if (theme.includes("1")){
            const calendarBorder = document.querySelector('.react-calendar__month-view__days');
            calendarBorder.style.borderColor='rgb(60, 160, 21)';   
            
            const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
            calendarWeekLabelStyle.style.color= 'rgb(60, 160, 21)';

            const calendarNowDate = document.querySelector('.react-calendar__tile--now')
            calendarNowDate.style.backgroundColor = 'rgb(60, 160, 21)';
            calendarNowDate.style.color = 'white';
        }
        else if(theme.includes("2")){
            const calendarBorder = document.querySelector('.react-calendar__month-view__days');
            calendarBorder.style.borderColor='rgb(35, 88, 187)';
            
            const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
            calendarWeekLabelStyle.style.color= 'rgb(35, 88, 187)';

            const calendarNowDate = document.querySelector('.react-calendar__tile--now')
            calendarNowDate.style.backgroundColor = 'rgb(35, 88, 187)';
            calendarNowDate.style.color = 'white';
        }
        else{
            const calendarBorder = document.querySelector('.react-calendar__month-view__days');
            calendarBorder.style.borderColor='rgb(209, 30, 90)';
            
            const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
            calendarWeekLabelStyle.style.color= 'rgb(209, 30, 90)';

            const calendarNowDate = document.querySelector('.react-calendar__tile--now')
            calendarNowDate.style.backgroundColor = 'rgb(209, 30, 90)';
            calendarNowDate.style.color = 'white';
        }
        

    }

    function generateFeaturesCodeFromString(string){
        console.log(string)
        let codes = string.split('');
        FeaturesCode["SCOLARITE"]    = codes[0];
        FeaturesCode["SCOLARITE_A"]  = codes[1];
        FeaturesCode["SCOLARITE_A1"] = codes[2];
        FeaturesCode["SCOLARITE_A2"] = codes[3];
        FeaturesCode["SCOLARITE_A3"] = codes[4];
        FeaturesCode["SCOLARITE_A4"] = codes[5];
        FeaturesCode["SCOLARITE_A5"] = codes[6];
        FeaturesCode["SCOLARITE_A6"] = codes[7];
        FeaturesCode["SCOLARITE_B"]  = codes[8];
        FeaturesCode["SCOLARITE_B1"] = codes[9];
        FeaturesCode["SCOLARITE_B2"] = codes[10];
        FeaturesCode["SCOLARITE_B3"] = codes[11];
        FeaturesCode["SCOLARITE_B4"] = codes[12];
        FeaturesCode["SCOLARITE_B5"] = codes[13];
        FeaturesCode["SCOLARITE_B6"] = codes[14];
        FeaturesCode["SCOLARITE_C"]  = codes[15];
        FeaturesCode["SCOLARITE_C1"] = codes[16];
        FeaturesCode["SCOLARITE_C2"] = codes[17];
        FeaturesCode["SCOLARITE_C3"] = codes[18];
        FeaturesCode["SCOLARITE_C4"] = codes[19];
        FeaturesCode["SCOLARITE_C5"] = codes[20];
        FeaturesCode["SCOLARITE_D"]  = codes[21];
        FeaturesCode["SCOLARITE_D1"] = codes[22];
        FeaturesCode["SCOLARITE_D2"] = codes[23];
        FeaturesCode["SCOLARITE_D3"] = codes[24];
        FeaturesCode["SCOLARITE_D4"] = codes[25];
        FeaturesCode["SCOLARITE_D5"] = codes[26];
        FeaturesCode["SCOLARITE_D6"] = codes[27];
        FeaturesCode["SCOLARITE_E"]  = codes[28];
        FeaturesCode["SCOLARITE_E1"] = codes[29];
        FeaturesCode["SCOLARITE_E2"] = codes[30];
        FeaturesCode["SCOLARITE_E3"] = codes[31];
        FeaturesCode["SCOLARITE_E4"] = codes[32];
        FeaturesCode["FINANCE"]      = codes[33];
        FeaturesCode["FINANCE_A"]    = codes[34];
        FeaturesCode["FINANCE_A1"]   = codes[35];
        FeaturesCode["FINANCE_A2"]   = codes[36];
        FeaturesCode["FINANCE_B"]    = codes[37];
        FeaturesCode["FINANCE_B1"]   = codes[38];
        FeaturesCode["FINANCE_B2"]   = codes[39];
        FeaturesCode["FINANCE_B3"]   = codes[40];
        FeaturesCode["FINANCE_B4"]   = codes[41];
        FeaturesCode["FINANCE_C"]    = codes[42];
        FeaturesCode["FINANCE_C1"]   = codes[43];
        FeaturesCode["FINANCE_C2"]   = codes[44];
        FeaturesCode["FINANCE_D"]    = codes[45];
        FeaturesCode["FINANCE_D1"]   = codes[46];
        FeaturesCode["FINANCE_D2"]   = codes[47];
        FeaturesCode["FINANCE_D3"]   = codes[48];
        FeaturesCode["FINANCE_D4"]   = codes[49];
        FeaturesCode["STATS"]        = codes[50];
        FeaturesCode["STATS_A"]      = codes[51];
        FeaturesCode["STATS_A1"]     = codes[52];
        FeaturesCode["STATS_A2"]     = codes[53];
        FeaturesCode["STATS_A3"]     = codes[54];
        FeaturesCode["STATS_A4"]     = codes[55];
        FeaturesCode["STATS_A5"]     = codes[56];
        FeaturesCode["STATS_B"]      = codes[57];
        FeaturesCode["STATS_B1"]     = codes[58];
        FeaturesCode["STATS_B2"]     = codes[59];
        FeaturesCode["STATS_B3"]     = codes[60];
        FeaturesCode["STATS_C"]      = codes[61];
        FeaturesCode["STATS_C1"]     = codes[62];
        FeaturesCode["STATS_C2"]     = codes[63];
        FeaturesCode["STATS_C3"]     = codes[64];
        FeaturesCode["STATS_C4"]     = codes[65];
        FeaturesCode["COMM_PARENT"]     = codes[66];
        FeaturesCode["COMM_PARENT_A"]   = codes[67];
        FeaturesCode["COMM_PARENT_A1"]  = codes[68];
        FeaturesCode["COMM_PARENT_A2"]  = codes[69];
        FeaturesCode["COMM_PARENT_B"]   = codes[70];
        FeaturesCode["COMM_PARENT_B1"]  = codes[71];
        FeaturesCode["COMM_PARENT_B2"]  = codes[72];
        FeaturesCode["COMM_PARENT_B3"]  = codes[73];
        FeaturesCode["CONFIG"]          = codes[74];
        FeaturesCode["CONFIG_A"]        = codes[75];
        FeaturesCode["CONFIG_A1"]       = codes[76];
        FeaturesCode["CONFIG_A2"]       = codes[77];
        FeaturesCode["CONFIG_A3"]       = codes[78];
        FeaturesCode["CONFIG_A4"]       = codes[79];
        FeaturesCode["CONFIG_A5"]       = codes[80];
        FeaturesCode["CONFIG_A6"]       = codes[81];
        FeaturesCode["CONFIG_B"]        = codes[82];
        FeaturesCode["CONFIG_B1"]  = codes[83];
        FeaturesCode["CONFIG_B2"]  = codes[84];
        FeaturesCode["CONFIG_B3"]  = codes[85];
        FeaturesCode["CONFIG_B4"]  = codes[86];
        FeaturesCode["CONFIG_B5"]  = codes[87];
        FeaturesCode["CONFIG_B6"]  = codes[88];
        FeaturesCode["CONFIG_B7"]  = codes[89];
        FeaturesCode["CONFIG_B8"]  = codes[90];
        FeaturesCode["CONFIG_B9"]  = codes[91];
        FeaturesCode["CONFIG_B10"] = codes[92];
        FeaturesCode["CONFIG_B11"] = codes[93];
        FeaturesCode["CONFIG_B12"] = codes[94];
        FeaturesCode["CONFIG_B13"] = codes[95];
        FeaturesCode["CONFIG_B14"] = codes[96];
        FeaturesCode["CONFIG_B15"] = codes[97];
        FeaturesCode["CONFIG_B16"] = codes[98];
        FeaturesCode["CONFIG_B17"] = codes[99];
        FeaturesCode["CONFIG_B18"] = codes[100];
        FeaturesCode["CONFIG_B19"] = codes[101];
        FeaturesCode["CONFIG_B20"] = codes[102];
        FeaturesCode["CONFIG_B21"] = codes[103];
        FeaturesCode["CONFIG_B22"] = codes[104];
        FeaturesCode["CONFIG_B23"] = codes[105];
        FeaturesCode["CONFIG_B24"] = codes[106];
        FeaturesCode["CONFIG_B25"] = codes[107];
        FeaturesCode["CONFIG_B26"] = codes[108];
        FeaturesCode["CONFIG_C"]  = codes[109];
        FeaturesCode["CONFIG_C1"] = codes[110];
        FeaturesCode["CONFIG_C2"] = codes[111];
        FeaturesCode["CONFIG_C3"] = codes[112];
        FeaturesCode["CONFIG_D"]  = codes[113];
        FeaturesCode["CONFIG_D1"] = codes[114];
        FeaturesCode["CONFIG_D2"] = codes[115];
        FeaturesCode["CONFIG_D3"] = codes[116];
        FeaturesCode["CONFIG_D4"] = codes[117];
        FeaturesCode["CONFIG_E"]  = codes[118];
        FeaturesCode["CONFIG_E1"] = codes[119];
        FeaturesCode["CONFIG_E2"] = codes[120];
        FeaturesCode["EXTRAS"]    = codes[121];
        FeaturesCode["EXTRAS_A"]  = codes[122];
        FeaturesCode["EXTRAS_A1"] = codes[123];
        FeaturesCode["EXTRAS_A2"] = codes[124];
        FeaturesCode["EXTRAS_A3"] = codes[125];
        FeaturesCode["EXTRAS_B"]  = codes[126];
        FeaturesCode["EXTRAS_B1"] = codes[127];
        FeaturesCode["EXTRAS_B2"] = codes[128];
        FeaturesCode["EXTRAS_B3"] = codes[129];
        FeaturesCode["EXTRAS_B4"] = codes[130];



        console.log("fct FeaturesCode: ",FeaturesCode)
        
    }

    function loadEmploiDetemps(etabId){
        axiosInstance.post(`get-current-emploi-de-temps/`, {
            id_sousetab: etabId
        }).then((res)=>{
            console.log("ET",res.data, res.data.profPrincipaux);
            res.data.matieres.map((m)=>{matieres.push(m)});
            res.data.classes.map((c)=>{classess.push(c)});
            res.data.ListMatieres.map((lm)=>{listMatieres.push(lm)});
            res.data.emploiDeTemps.map((em)=>{emploiDeTemps.push(em)});
            res.data.listProfs.map((lp)=>{listProfs.push(lp)});
            res.data.TAB_JOURS.map((j)=>{tab_jours.push(j)});
            res.data.TAB_PERIODES.map((p)=>{tab_periodes.push(p)});
            res.data.TAB_CRENEAU_PAUSE.map((p)=>{tab_creneau_pause.push(p)});
            res.data.TAB_VALEUR_HORAIRE.map((vh)=>{tab_valeur_horaire.push(vh)});
            
            currentUiContext.setClasseEmploiTemps(classess);
            currentUiContext.setListMatieres(listMatieres);
            currentUiContext.setListProfs(listProfs);
            currentUiContext.setIndexClasse(indexClasse);
            currentUiContext.setMatiereSousEtab(matieres);
            currentUiContext.setTAB_JOURS(tab_jours);
            currentUiContext.setTAB_PERIODES(tab_periodes);
            currentUiContext.setTAB_VALEUR_HORAIRE(tab_valeur_horaire);
            currentUiContext.setEmploiDeTemps(emploiDeTemps);
            currentUiContext.setTAB_CRENEAU_PAUSE(tab_creneau_pause);
            currentUiContext.setCurrentPPList(res.data.profPrincipaux);
           

            console.log("------ListProfs:------", listProfs)

            if(tab_valeur_horaire.length>0){
            currentUiContext.setIntervalleMaxTranche(tab_valeur_horaire[0]+"_"+tab_valeur_horaire[tab_valeur_horaire.length-1]);
        }})
        
    }

    function initUserNotifs(foundedNotifs){
        var msgText = {};
        listNotifs  = [];
     
        console.log("comm internes", foundedNotifs);
        foundedNotifs.map((com)=>{
            msgText ={
                id                  : com.id,
                type                : com.msgType,
                libelle             : com.titreMsg,
                Description         : com.message,
                date_debut_validite : com.validite_deb,
                date_fin_validite   : com.validite_fin,
                hasAction           : true,
                btnText             : t("set_as_read"),
             
                btnClickHandler:{
            
                }
            }
            

            listNotifs.push({msg:msgText}); 
            msgText = {} ;             
        })

        currentAppContext.setTabNotifs(listNotifs);             
        
    }


    function connectHandler()
    {    
        setPassWordError(false);
        setIsLoading(true);
        const loginText = document.getElementById('login').value;
        const passwordText = document.getElementById('password').value;

       


        // axiosInstance.baseURL = 'http://'+currentAppContext.serverAdress+':8000/api/';
        // console.log("adresse server",currentAppContext.serverAdress,axiosInstance)

        axiosInstance
        .post(`token-get/`, {
            username: loginText,
            password: passwordText,
        },{headers:{}})
        .then((res) => {
            if (res.data.status=="ko")
               {
                // ERROR_CODE = res.response.status;
                setPassWordError(true);
                setIsLoading(false);
                console.log(res.data.status=="ko")
               }
            else{
                localStorage.setItem('access', res.data.access);
                localStorage.setItem('refresh', res.data.refresh);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access');
                // history.push('/test');
                console.log("login",res.data);
                userProfile = 'admin';
                profileAuthorisationString = getRightsStringFromProfile(userProfile)
            
                generateFeaturesCodeFromString(res.data.FeaturesCode);
                
                currentAppContext.setInfoAnnees(res.data.info_annees);
                currentAppContext.setUsrConnected(loginText,userProfile);
                currentAppContext.setEnableProfiles(FeaturesCode);
                currentAppContext.setIdUser(res.data.id_user);
                currentAppContext.setIdEtabInit(res.data.id_etab_init);
                currentAppContext.setCurrentEtab(res.data.id_etab_init);                
                currentAppContext.setActivatedYear(res.data.activated_year);
                currentAppContext.setInfoSetabs(res.data.info_setabs);
                currentAppContext.setInfoUser(res.data.info_user);
                currentAppContext.setInfoCycles(res.data.info_cycles);
                currentAppContext.setInfoNiveaux(res.data.info_niveaux);
                currentAppContext.setInfoClasses(res.data.info_classes);
                currentAppContext.setInfoMatieres(res.data.info_matieres);
                currentAppContext.setInfoCours(res.data.info_cours);
                currentUiContext.updateFirstLoad(true);

                //Added 29/03/2024
                currentAppContext.setCurrentEtabInfos(res.data.info_setabs.find((setab)=>setab.id_setab == res.data.id_etab_init));

                // Added 04/02/2024
                //Ici, on va aller chercher toutes les notifs non lu du user
                initUserNotifs(res.data.info_user.user_comms);
                
                
                //Pour les MsgBoxes
                currentUiContext.setIsParentMsgBox(true);            
                // profileAuthorisationString = getRightsStringFromProfile(userProfile);
                //console.log(currentAppContext.infoCours);
                currentUiContext.setIsDashboardNav(true);

                loadEmploiDetemps(res.data.id_etab_init);
                setIsLoading(false);            
                
                currentUiContext.updateTheme(res.data.theme);
                // currentUiContext.updatePhotoUrl(res.data.photo_url);

                i18n.changeLanguage(res.data.langue);
                updateCalendarTheme(res.data.theme);

            
                history.replace('/');
            }
        },(res)=>{
            ERROR_CODE = res.response.status;
            setPassWordError(true);
            setIsLoading(false);
            //console.log('erreur',res.response.status);
        });     
    }


    function getImageFromAppVersion(version,langue){
        if(langue=='fr'){
            switch(version){
                case 'starter': return 'images/logoStarterFrTr.png';
                case 'admin'  : return 'images/logoAdminFrTr.png';
                case 'online' : return "images/logoOnlineFrTr.png" ;
                default: return "images/logoStarterFrTr.png" ;
            }
        } else {
            switch(version){
                case 'starter': return 'images/logoStarterEnTr.png';
                case 'admin'  : return 'images/logoAdminEnTr.png';
                case 'online' : return "images/logoOnlineEnTr.png" ;
                default: return "images/logoStarterEnTr.png" ;
            }
        }       
    }

    function getAppName(version){
        switch(version){
            case 'starter': return "Cursus Starter" ;
            case 'admin'  : return "Cursus Administration" ;
            case 'online' : return "Cursus Online" ;
            default: return "Cursus Starter" ;
        }
    }


    
    return ( 
        <div className= {classes.loginContainer}>
            <div className= {getCurrentHeaderTheme()}>
                <img src= {getImageFromAppVersion(currentAppContext.appVersion,i18n.language)}   alt='AppLogo' className= {classes.logoStyle}></img>
            </div>

            <div className= {getCurrentWidgetTemplateStyle()+ ' '+ getWidgetContentStyle() }>
                <div id='fr' onClick={changeLanguage} className={classes.langButton}> 
                    <img src="images/drapeauFrance.png" id='fr' alt="my image" className={classes.widgetIcon}  onClick={changeLanguage}  />   
                </div>
                
                <div id='en' onClick={changeLanguage} className={classes.langButton}>
                    < img src="images/drapeauAnglais.png" id='en'  alt="my image" className={classes.widgetIcon}  onClick={changeLanguage}/>  
                </div> 
            </div>
           {/* <div className= {classes.cardAndCreator}>*/}
                <div className= {classes.loginMainContent}>
                    <div className={'card ' + ' '+ getCurrentContentTheme()}>
                        
                        <div className={getFormHeaderStyle()}>
                        {t("Connexion")} 
                        </div>
                        <form class={"container section" +' '+ classes.formContent}>
                            <div className= {classes.headerText}> {t("acceder_espace" )} </div>
                            <div class="divider"></div>

                            <div class="input-field">
                                <input id="login" type="text" class="validate" style={{width:'18vw', height:30, paddingBottom:5}} />
                                <label for="login">{t("login" )} </label>
                            </div>

                            <div class="input-field">
                                <input id="password" type="password" class="validate" style={{width:'18vw', height:30, paddingBottom:5}} />
                                <label for="password">{t("password" )}</label>
                            </div>

                            <Link className= {classes.linkStyle}> <i>{t("forgetPwd")}</i></Link>
                            { passWordError ? 
                                <p className={classes.errorMsgStyle}> {t(getErrorMessage(ERROR_CODE))}</p> 
                                : null
                            }
                        </form>

                        <div class="input-field center" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", marginTop:passWordError ? "2vh": isLoading ? "-0.8vh": null}}>
                            
                            {/* <button  class="btn-small button" style={{fontSize:'1vw', fontWeight:555, width:'10vw', height:'5.3vh', borderRadius:7}} onClick={connectHandler}>{t("Connexion")}</button> */}

                            <CustomButton
                                btnText={t("Connexion")}
                                hasIconImg= {true}
                                imgSrc='icons/login1.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={classes.loginButton}
                                btnTextStyle = {classes.loginButtonText}
                                btnClickHandler={connectHandler}
                                
                            />
                        </div>

                        {isLoading && 
                            <div style={{display:"flex", flexDirection:'column', justifyContent:'center', alignItems:"center", width:"100%", height:"3vw", overflow:'hidden'}}>
                                <img alt="Loading..." src="images/Loading_icon.gif" style={{height:"7vw"}}/>
                            </div>
                        } 
                        
                    </div>
                {/*</div>*/}



                <div className={classes.creatorZone} style={{marginTop:isLoading ? "-3vh" :"0vh" }}>
                    <label className={classes.creatorName}>
                        BOGEDEV
                    </label>
                </div>


            </div>
                            
            <div className= {getCurrentFooterTheme()} style={{paddingRight:"1.77vw"}}>
                <div className={classes.copyRight}>
                    <h7> © Copyright 2022 </h7>
                </div>
                

                <div className={classes.aboutApp} style={{width:"29vw",paddingBottom:"1vh"}}> 
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", marginLeft:(i18n.language=='fr') ? "-1vw":"0vw"}}>
                        {/* <img src="images/cursusLogo_Mob1.png" style={{position:"absolute",marginTop:"0.3vh", marginRight:"18.7vw", width:"7vw", height:"5vh"}}/> */}
                        <div className={classes.aboutAppTextStyle} style={{width:"29vw", color:"whitesmoke" /*"#bobob5"*/ /*"#2a2a32"*/ /*"#20202d"*/}}>
                           <b style={{fontSize:"1.3vw", fontFamily:"math", marginRight:"0.17vw", fontWeight:"bolder"}}>{getAppName(currentAppContext.appVersion)}</b> {t("is_aproduct_of")}  <b style={{fontFamily:"system-ui", fontWeight:"bolder", fontSize:"1.03vw"}}>BOGEDEV Corporation. </b> {t("rightsReserve")}
                        </div>

                        {/* <div style={{width:"30vw", fontSize:"smaller"}}> 
                            {t("rightsReserve")} 
                        </div> */}
                    </div>
                    
                    
                </div>
            <div>  
                    
        </div>
              
    </div>
</div>
)};
export default LoginForm;