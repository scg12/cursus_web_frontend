import React, { useState } from "react";
import {Link} from 'react-router-dom';

import { useContext} from "react";
import { useHistory } from 'react-router-dom';
import UiContext from '../../../../store/UiContext'
import AppContext from '../../../../store/AppContext';

import { useTranslation } from "react-i18next";
import '../../../../translation/i18n'

import classes from './HeadAndNav.module.css';
import 'materialize-css/dist/css/materialize.min.css';
import SideContent from '../sideContent/SideContent';
import TopFixedLayout from '../../../UI/MS_UI/TopFixedLayout';
import MsgBox from "../../../msgBox/MsgBox";
import BackDrop from "../../../backDrop/BackDrop";
import axiosInstance from "../../../../axios";


var currentActiveMenuId ='menuLi0';
  
function HeadAndNav(props) {
    const etabName = 'College Francois Xavier Vogt';
    const devise = 'Ora et labora';
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
   
 
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    // le user connecte
    const usrConnected = currentAppContext.usrLogin;
    const { t, i18n } = useTranslation();
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };
    currentUiContext.updateTab(getTheInitialActiveMenuId())

    //currentActiveMenuId = getTheInitialActiveMenuId();

    function editProfile(){
        alert("Voulez-vous modifier vos parametres personnels?")
    }
  
    function logouthandler(){
        currentUiContext.showMsgBox({
            visible:true, 
            msgType:"question", 
            msgTitle:t("logout"), 
            message:t("quit_question")
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
            if(currentAppContext.enableProfiles["SCOLARITE"]=='1')    return 'menuLi0';
            if(currentAppContext.enableProfiles["FINANCE"]=='1')      return 'menuLi1';
            if(currentAppContext.enableProfiles["STATS"]=='1')        return 'menuLi2';
            if(currentAppContext.enableProfiles["IMPRESSIONS"]=='1')  return 'menuLi3';
            if(currentAppContext.enableProfiles["COMM_PARENT"]=='1')  return 'menuLi4';
            if(currentAppContext.enableProfiles["EXTRAS"]=='1')       return 'menuLi5';
            if(currentAppContext.enableProfiles["CONFIG"]=='1')       return 'menuLi6';

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

    const acceptHandler=()=>{
        console.log("IL VEUT DECONNECTER: ")
        axiosInstance
        .post(`logout/`,
         {
            refresh: localStorage.getItem('refresh'),
        },{headers:{}})
        .then((res) => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            console.log(res.data);
        },(res)=>{
            
            console.log('Erreur: ',res);
        });

        currentUiContext.updateFirstLoad(true);
        currentAppContext.logOut();
        currentUiContext.showMsgBox({
            visible:false, 
            msgType:"question", 
            msgTitle:t("logout"), 
            message:t("quit_question"),
        });
    }

    const rejectHandler=()=>{
        currentUiContext.showMsgBox({
            visible:false, 
            msgType:"question", 
            msgTitle:t("logout"), 
            message:t("quit_question")
        });
    }
    
    return (
        <header className={getCurrentTheme()}> 
            {(currentUiContext.msgBox.visible == true)&& <BackDrop style={{zIndex:'999'}}/>}               
         
            { (currentUiContext.msgBox.visible == true) ?
                 <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {t("yes")}
                    buttonRejectText = {t("no")}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />         
                :
                null
            }
            <div className={classes.etabInfos}>
                <div className={classes.logoStyle}> 
                    <Link to='/' onClick={backToHome}><img src='images/collegeVogt.png'  width='100px' height='90px' alt='AppLogo' className= {classes.logoStyle}></img></Link>
                </div>
            
                <div className= {classes.etabNameDisplayPos}> 
                    <div className= {classes.etabNameStyle}>
                       {etabName}
                    </div>
                    <div className= {classes.etabMotoStyle}> 
                        <i> {devise} </i> 
                    </div>
                </div>
                
            </div>
          
            <div>
                <nav className={getCurrentTheme() + ' ' + getCurrentHeaderBarTheme() }>
                    <div  className={'nav-wrapper  '+classes.siteNav}>
                    
                        <ul className="right" style={{marginTop:'1vh'}}>

                            <li id='menuLi0' className={classes.menuLi2 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi0')}>
                                <Link to='dashBoardPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi0')}> < img src="images/monitoring1.png"  className={classes.imageMargin2P}  alt="my image"/></Link>
                            </li>

                            <li id='menuLi1' className={classes.menuLi1 +' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi1')}>
                                <Link to='scolarite' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi1')} > < img src="images/scolariteP.png"  className={classes.imageMargin0}  alt="my image"/></Link>
                            </li>
                           
                            <li id='menuLi2' className={classes.menuLi1 +' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi2')}>
                                <Link to='economat-et-financePage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi2')}> < img src="images/monei.png"  className={classes.imageMargin01} alt="my image"/></Link>
                            </li>
                          
                            <li id='menuLi3' className={classes.menuLi2 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi3')}>
                                <Link to='stats-et-monitoringPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi3')}>< img src="images/monitoring.png" className={classes.imageMargin01}  alt="my image"/></Link>
                            </li >
                           
                            {/*<li id='menuLi3' className={classes.menuLi2 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi3')}>
                                <Link to='impressionPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi3')}> < img src="images/printing1.png"  className={classes.imageMargin2}  alt="my image"/></Link>
                            </li>*/}
                           
                            <li id='menuLi4' className={classes.menuLi3 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi4')}>
                                <Link to='comm-avec-parentPage' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi4')}> < img src="images/CommunicationP3.png"   className={classes.imageMargin02} alt="my image"/></Link>
                            </li>
                            
                            <li id='menuLi5' className={classes.menuLi1 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi5')}>
                                <Link to='extrasPages' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi5')}> < img src="images/extraFeature.png"  className={classes.imageMargin2}  alt="my image"/></Link>
                            </li>
                           
                            <li id='menuLi6' className={classes.menuLi3 + ' '+ getCurrentThemeActiveMenuBgClr() + putActiveClass('menuLi6')}>
                                <Link to='configuration' className={classes.rowDisplay} onClick={()=>toggleActiveMenu('menuLi6')} ><img src="images/configuration4.png"  className={classes.imageMargin3}  alt="my image"/> </Link>
                            </li>                            
                            
                        </ul>

                    </div>

                </nav>

            </div>
            <TopFixedLayout>
                <SideContent/>
                <div className= {getCurrentWidgetTemplateStyle()+ ' '+ getWidgetContentStyle() }>
                
                    <div id='fr' onClick={changeLanguage} className={classes.langButton}> 
                        <img src="images/drapeauFrance.png" id='fr'  className={classes.widgetIcon}  alt="my image" onClick={changeLanguage}  />   
                    </div>
                    
                    <div id='en' onClick={changeLanguage} className={classes.langButton}>
                        < img src="images/drapeauAnglais.png" id='en'  className={classes.widgetIcon} alt="my image" onClick={changeLanguage}/>  
                    </div> 

                    <div className={classes.divider}/>

                    <div onClick={editProfile} className={classes.langButton}>
                        < img src="images/profile.png" id='en'  className={classes.widgetIcon} alt="my image" onClick={changeLanguage}/>  
                    </div>

                    {/*<div  onClick={editProfile} className={classes.profileLabel}>
                        {usrConnected}
                            </div>    */}

                    <div className={classes.divider}/>

                    <div id='en' className={classes.langButton}>
                        < img src="images/logout.png" id='en' className={classes.widgetIcon} alt="my image" onClick={logouthandler}/>  
                    </div>
                    
                </div>
            </TopFixedLayout>
            
        </header>
    );
}

export default HeadAndNav;