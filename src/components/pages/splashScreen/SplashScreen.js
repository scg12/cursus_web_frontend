import React from 'react';
import classes from './SplashScreen.module.css';
import {Link} from 'react-router-dom';

import { useTranslation } from "react-i18next";
import '../../../translation/i18n';
import ProgressBar from '../../progressBar/ProgressBar';
import { useState,useContext, useEffect} from "react";
import UiContext from '../../../store/UiContext';
import AppContext from '../../../store/AppContext';
import { createAxiosInstance } from '../../../axios';
import { useHistory } from 'react-router-dom';
import LoginForm from '../login/LoginForm';


const BARWIDTH = 27;
var index;
var pourcentage = 0;
var objConf     = {};


function SplashScreen(props){
    
    const currentUiContext                  = useContext(UiContext);
    const currentAppContext                 = useContext(AppContext);
    const [isLoginView, setIsLoginView]     = useState(false);
    const [percent, setPercent]             = useState(0);
    const [appVersion, setAppVersion]       = useState("starter");
    

    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };
    
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;


    useEffect(()=> {
        getAPPConfAndStoreServer();
    

        pourcentage = 0;
        // Ici on charge le theme et la langue stockes ds le fichier local de conf.
       

        // Ici lit l'@ du serveur ds le fichier local de conf et la mettre dans le contexte.
        
        
       
        for(index=0;index<=4;index++){
            setTimeout(function() {
                pourcentage = pourcentage + 25;
                setPercent(pourcentage);               
               if (pourcentage == 125) {
                    setIsLoginView(true); 
                    currentAppContext.setIsUserLogging(false)
                }
            },index*1000);          

        }
    },[]);

    const getAPPConfAndStoreServer =()=>{
        fetch('cursusConf.json',{
            headers : {
                'Content-type':'application/json',
                'Accept'      :'application/json'
            }
        }).then(function(response){
            return response.json();
        })
        .then(function(myJson){
            objConf = {...myJson};           

            setAppVersion(objConf.version);
            currentAppContext.setServerAdress(objConf.adress);
            currentAppContext.setAppVersion(objConf.version);
            //const axiosInstance = createAxiosInstance(objConf.adress);
            //currentAppContext.setAxiosInstance(axiosInstance);
            console.log("perepepepe",myJson)
        });
    }



    function getCurrentContentTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_pageContainer + ' ' + classes.pageContainer;
            case 'Theme2': return classes.Theme2_pageContainer + ' ' + classes.pageContainer;
            case 'Theme3': return classes.Theme3_pageContainer + ' ' + classes.pageContainer;
            default: return classes.Theme1_pageContainer + ' ' + classes.pageContainer;
        }
    }


    function getCurrentProgressBarLoadingTheme()
    {  // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return "#074b99";
            case 'Theme2': return "#3ca015";
            case 'Theme3': return "#4031a5";
            default: return "#074b99";
        }
    }



    function getImageFromAppVersion(version,langue){
        if(version == "starter"){
            if(langue=='fr'){
                return 'images/logoStarterFrTr.png';
            } else {
                return 'images/logoStarterEnTr.png';
            }  
        } else {
            if(langue=='fr'){
                return 'images/logoAdminFrTr.png';
            } else {
                return 'images/logoAdminEnTr.png';
            }  
        }
    }
    
    if(isLoginView) return (<LoginForm/>)
    else
    
        return ( 
            <div className= {classes.pageContainer}>
                <div className= {getCurrentContentTheme()}>
                    <img src={getImageFromAppVersion(appVersion,i18n.language)}  alt='AppLogo' className= {classes.logoStyle}></img> 
                   

                    <ProgressBar 

                        pgBarWidth    = {BARWIDTH+"vw"}
                        rate          = {percent+'%'}
                        rateTextStyle = {{fontSize:"0.9vw", marginBottom:"-0.53vh", color:"white"}}
                        rateStyle     = {{width:(percent*BARWIDTH)/100+'vw', borderRadius:"0.7vh", backgroundColor:getCurrentProgressBarLoadingTheme()/*backgroundColor:"#065386" backgroundColor:"#0f68a4"*/}}
                        showRate      = {true}
                        ratePosition  = {"inside"}

                        barContainerStyle={{
                            marginTop:"1.3vh"
                        }}

                        barStyle={{
                            height           :"3.3vh", 
                            borderRadius     :"1vh", 
                            backgroundColor  :"white",
                            border           :"solid 1px #3b4f78",
                            marginTop        :"-12.3vh",
                            marginLeft       :"3.7vw"
                        }}
                        
                    />   
                </div>
            </div>
        )
    };
export default SplashScreen;