import React, { useState, useEffect} from "react";
import {Link} from 'react-router-dom';

import { useContext} from "react";
import { useHistory } from 'react-router-dom';
import UiContext from '../../../../store/UiContext'
import AppContext from '../../../../store/AppContext';

import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';

import MsgBox from '../../../../components/msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";

import classes from './HeadAndNav.module.css';
import 'materialize-css/dist/css/materialize.min.css';
import axiosInstance from "../../../../axios";



var chosenMsgBox;
const MSG_SUCCESS  =1;
const MSG_WARNING  =2;
const MSG_QUESTION =3;
  
function HeadAndNav(props) {
    const etabName = 'College Francois Xavier Vogt';
    const devise = 'Ora et labora';
    const CURRENT_ETAB_INFOS ={};
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
   
 
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    // le user connecte
    const usrConnected = currentAppContext.usrLogin;
    const { t, i18n } = useTranslation();
    //const [msg, showMsg]= useState({constMsg});
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
        axiosInstance.post(`save-langue/`, {
            id_user: currentAppContext.idUser,
            langue:event.target.id                
        }).then((res)=>{
            console.log(res.data);                                     
        })  
    };

    useEffect(()=> {
        currentUiContext.updateFirstLoad(true);
        console.log("infos Etab",currentAppContext.currentEtabInfos);
    },[])
    currentUiContext.updateTab(getTheInitialActiveMenuId())

    //currentActiveMenuId = getTheInitialActiveMenuId();

    function editProfile(){
        alert("Voulez-vous modifier vos parametres personnels?")
    }
  
    function logouthandler(){
        currentUiContext.setIsParentMsgBox(true);
        chosenMsgBox = MSG_QUESTION
        currentUiContext.showMsgBox({
            visible:true, 
            msgType :"question", 
            msgTitle:t("logout"), 
            msgCode :"CLOSE_APP",
            message :t("quit_question")
        })

        /*if(window.confirm("Voulez-vous vraiment vous deconnecter?")){
            currentUiContext.updateFirstLoad(true);
            //currentUiContext.updateTab(getTheInitialActiveMenuId());
            currentAppContext.logOut();
        }*/        
    }
  
    function getCurrentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_header ;
            case 'Theme2': return classes.Theme2_header ;
            case 'Theme3': return classes.Theme3_header ;
            default: return classes.Theme1_header ;
        }
    }


    function getCurrentThemeActiveMenuBgClr()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return 'Theme1_menuLi' ;
            case 'Theme2': return 'Theme2_menuLi' ;
            case 'Theme3': return 'Theme3_menuLi' ;
            default: return 'Theme1_menuLi' ;
        }
    }

    function getCurrentWidgetTemplateStyle()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return 'right ' + classes.Theme1_widget ;
            case 'Theme2': return 'right ' + classes.Theme2_widget;
            case 'Theme3': return 'right ' + classes.Theme3_widget;
            default: return 'right ' + classes.Theme1_widget;
        }
    }
    
    function getWidgetContentStyle()
    { // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_widget_content ;
            case 'Theme2': return classes.Theme2_widget_content ;
            case 'Theme3': return classes.Theme3_widget_content ;
            default: return classes.Theme1_widget_content ;
        }
    }

    function getCurrentHeaderBarTheme()
    {  // Choix du theme courant
       switch(selectedTheme)
       {
            case 'Theme1': return classes.Theme1_border;
            case 'Theme2': return classes.Theme2_border;
            case 'Theme3': return classes.Theme3_border;
            default: return classes.Theme1_border;
        }
    } 
    
    function getTheInitialActiveMenuId() {
        if(currentUiContext.firstLoad==true){
            //Ici voir avec Ge
            if(currentAppContext.enableProfiles["SCOLARITE"]=='1')    return 'menuLi0';
            if(currentAppContext.enableProfiles["SCOLARITE"]=='1')    return 'menuLi1';
            if(currentAppContext.enableProfiles["FINANCE"]=='1')      return 'menuLi2';
            if(currentAppContext.enableProfiles["STATS"]=='1')        return 'menuLi3';
            if(currentAppContext.enableProfiles["IMPRESSIONS"]=='1')  return 'menuLi4';
            if(currentAppContext.enableProfiles["COMM_PARENT"]=='1')  return 'menuLi5';
            if(currentAppContext.enableProfiles["EXTRAS"]=='1')       return 'menuLi6';
            if(currentAppContext.enableProfiles["CONFIG"]=='1')       return 'menuLi7';
          

        } else {
            return currentUiContext.selectedTab;
        }
      
    }

    function putActiveClass(menuId) {
        if(getTheInitialActiveMenuId()==menuId) return ' active';
        else return '';
    }
    
    function toggleActiveMenu(NewActiveMenuId) {
       
        const currentActiveDiv = document.querySelector('#'+currentUiContext.selectedTab);
        if(currentActiveDiv!= null)
            currentActiveDiv.classList.remove('active');

        const NewActiveDiv = document.querySelector('#'+NewActiveMenuId);
        NewActiveDiv.classList.add('active');
        currentUiContext.updateTab( NewActiveMenuId)
        if (currentUiContext.firstLoad) {
            currentUiContext.updateFirstLoad(false)
        }
        
        //currentActiveMenuId = NewActiveMenuId;
    }

    function backToHome() {
        currentUiContext.updateFirstLoad(true);
        var firstMenu = getTheInitialActiveMenuId();
        toggleActiveMenu(firstMenu);
    }

    function closeSchoolYear(){         
        axiosInstance.post(`migrations/`, {
            id_sousetab: currentAppContext.currentEtab,
            date_deb: "2024-09-05",
            date_fin: "2025-07-31",
            date_essaie_cursus:"2024-10-02",
            date_limite_cursus:"2025-07-31"
        }).then((res)=>{
           alert("MIGRATION TERMINEE AVEC SUCCESS !"); 
           currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            });
           return 1;             
        })      
    }

    function closeExamSession(){
        axiosInstance.post(`cloture_session/`, {
            id_sousetab : currentAppContext.currentEtab,
            id_user     : currentAppContext.idUser 
        }).then((res)=>{
           alert("EXAMENS TERMINEE AVEC SUCCESS !");
           currentUiContext.showMsgBox({
                visible:false, 
                msgType:"", 
                msgTitle:"", 
                message:""
            });
           return 1;              
        })      
    }


    const acceptHandler=()=>{
        console.log("code MSG",chosenMsgBox);
        switch(currentUiContext.msgBox.msgCode){
            case "CLOSE_YEAR": {
               
            }

    
            case "CLOSE_APP": {
                console.log("IL VEUT DECONNECTER: ")
                currentUiContext.updateFirstLoad(true);
                currentAppContext.logOut();
                currentUiContext.setCurrentSelectedMenuID('0');
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               

                axiosInstance.post(`logout/`, {
                    refresh  : localStorage.getItem('refresh'),
                    userId   : currentAppContext.idUser,
                    setab_id : currentAppContext.currentEtab,

                },{headers:{}})
                    .then((res) => {
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        console.log(res.data);
                    },(res)=>{                    
                        console.log('Erreur: ',res);                       
                    });                    
               
                return 1;
            }
    
            case "CLOSE_YEAR": {
                alert("cloture annee!!!");
                //closeSchoolYear();
                
                return 1;
            }

            case "CLOSE_EXAMS": {
                alert("ok ok");
                // closeExamSession();
                
                return 1;
            }

            
            
           
            default: {

                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                return 1;

               
            }
        }
       
    }

    const rejectHandler=()=>{
        switch(chosenMsgBox){
            case MSG_SUCCESS: {               
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                return 1;
            }
    
            case MSG_QUESTION: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                return 1;
            }
    
            case MSG_WARNING: {
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                return 1;
            }
        }        
    }
    
    return (
      
        <header className={getCurrentTheme()} > 
            { (currentUiContext.msgBox.visible == true) ?
                <BackDrop/>
                :
                null
            }
            { (currentUiContext.msgBox.visible == true)&&currentUiContext.isParentMsgBox ?
                 <MsgBox 
                    msgTitle            = {currentUiContext.msgBox.msgTitle} 
                    msgType             = {currentUiContext.msgBox.msgType} 
                    message             = {currentUiContext.msgBox.message} 
                    isCustomMessage     = {currentUiContext.msgBox.msgCode == "CLOSE_EXAMS"? true:false}
                    messageLines        = {currentUiContext.msgBox.msgCode == "CLOSE_EXAMS"? currentUiContext.msgBox.messageLines:[]}
                    customImg           = {true}
                    customStyle         = {true}
                    contentStyle        = {currentUiContext.msgBox.msgCode == "CLOSE_EXAMS"? classes.msgContentP:classes.msgContent}
                    tabligneStyle       = {currentUiContext.msgBox.msgCode == "CLOSE_EXAMS"? {marginBottom:"-3.7vh", width:"100%"}:null}
                    imgStyle            = {classes.msgBoxImgStyleP}
                    buttonAcceptText    = {t("yes")}
                    buttonRejectText    = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />   
                :
                null
            }

           
   
       
            <div className={classes.etabInfos}>
                <div  className={classes.logoStyle}> 
                    {/* <Link to='/' onClick={backToHome}><img src='images/collegeVogt.png'  width='100px' height='90px' alt='AppLogo' className= {classes.logoStyle}></img></Link> */}
                    <Link to='/' onClick={backToHome}>
                        {(currentAppContext.currentEtabInfos.logo_url.length==0)?
                            <img id="etab_logo" src= "images/logoDefault.png"  width='100px' height='90px' alt='AppLogo' className= {classes.logoStyle}></img>
                            :
                            <img id="etab_logo" src={ currentAppContext.currentEtabInfos.logo_url}  width='100px' height='90px' alt='AppLogo' className= {classes.logoStyle}></img>
                        }
                    </Link>
                    
                </div>
            
                <div className= {classes.etabNameDisplayPos}> 
                    <div id="etab_name" className= {classes.etabNameStyle}>
                       {currentAppContext.currentEtabInfos.libelle}
                    </div>
                    <div id="etab_motto" className= {classes.etabMotoStyle}> 
                        <i> {currentAppContext.currentEtabInfos.devise} </i> 
                    </div>
                </div>
                
            </div>
          
            <div style={{position:'absolute', top: '10vh',left: '2px', width: '100%'}}>
                <nav className={getCurrentTheme() + ' ' + getCurrentHeaderBarTheme() }>
                    <div className='nav-wrapper'>
                    
                        <ul className="right">
                           
                            <li id='menuLi0' className={classes.menuLi2 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi0')}>
                                <Link to='dashBoardPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi0')}> < img src="images/monitoring1.png"  className={classes.imageMargin2}  alt="my image"/>{t("supervisionM")} </Link>
                            </li>
                        

                            {currentAppContext.enableProfiles["SCOLARITE"]=='1'&&<li id='menuLi1' className={classes.menuLi1 +' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi1')}>
                                <Link to='scolarite' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi1')} > < img src="images/scolariteP.png"  className={classes.imageMargin0}  alt="my image"/> {t("scolariteM")} </Link>
                            </li>}
                        
                        
                            {currentAppContext.enableProfiles["FINANCE"]=='1'&&<li id='menuLi2' className={classes.menuLi1 +' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi2')}>
                                <Link to='economat-et-financePage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi2')}> < img src="images/monei.png"  className={classes.imageMargin01} alt="my image"/>{t("eco_and_financeM")} </Link>
                            </li>}
                        

                            {currentAppContext.enableProfiles["STATS"]=='1'&&<li id='menuLi3' className={classes.menuLi2 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi3')}>
                                <Link to='stats-et-monitoringPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi3')}>< img src="images/monitoring.png" className={classes.imageMargin01}  alt="my image"/>{t("stats_and_monitoringM")} </Link>
                            </li >}                         
                        

                            {currentAppContext.enableProfiles["COMM_PARENT"]=='1'&&<li id='menuLi4' className={classes.menuLi3 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi4')}>
                                <Link to='comm-avec-parentPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi4')}> < img src="images/CommunicationP3.png"   className={classes.imageMargin02} alt="my image"/>{t("comm_with_parentsM")} </Link>
                            </li>}
                        

                            {currentAppContext.enableProfiles["EXTRAS"]=='1'&&<li id='menuLi5' className={classes.menuLi1 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi5')}>
                                <Link to='extrasPages' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi5')}> < img src="images/extraFeature.png"  className={classes.imageMargin4}  alt="my image"/> {t("extrasM")} </Link>
                            </li>}
                            
                        
                            {currentAppContext.enableProfiles["CONFIG"]=='1'&&<li id='menuLi6' className={classes.menuLi3 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi6')}>
                                <Link to='configuration' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi6')} ><img src="images/configuration4.png"  className={classes.imageMargin3}  alt="my image"/>{t("configurationM")} </Link>
                            </li>}
                              
                            
                        </ul>

                    </div>

                </nav>

            </div>


            
            
            <div className= {getCurrentWidgetTemplateStyle()+ ' '+ getWidgetContentStyle() }>
            
                <div onClick={changeLanguage} className={classes.langButton}> 
                    <img src="images/drapeauFrance.png" id='fr'  className={classes.widgetIcon}  alt="my image"  />   
                </div>
                
                <div onClick={changeLanguage} className={classes.langButton}>
                    < img src="images/drapeauAnglais.png" id='en'  className={classes.widgetIcon} alt="my image" />  
                </div> 

                <div className={classes.divider}/>

                {(currentAppContext.infoUser.photo_url=="")?
                    <div className={classes.langButton}>
                        < img src="images/profile.png" className={classes.widgetIcon} alt="my image"/>  
                    </div>
                    :
                    <div className={classes.langButton}>
                        < img src={currentAppContext.infoUser.photo_url}  className={classes.widgetIcon} alt="my image" />  
                    </div>
                }
               

                <div className={classes.profileLabel}>
                    {usrConnected}
                </div>    

                <div className={classes.divider}/>

                <div id='en' className={classes.langButton}>
                    < img src="images/logout.png" id='en' className={classes.widgetIcon} alt="my image" onClick={logouthandler}/>  
                </div>
                
            </div>
            
        </header>
    

        
    );
}

export default HeadAndNav;