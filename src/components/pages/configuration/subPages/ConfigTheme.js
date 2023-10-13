import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import { useContext, useState } from "react";
import UiContext from  '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import { useTranslation } from "react-i18next";
import axiosInstance from '../../../../axios';


function ConfigTheme(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [curentMenuItemId,setMenuItemId]=useState(0);

    const selectedTheme = currentUiContext.theme;

    function updateCalendarTheme1(){
        const calendarBorder = document.querySelector('.react-calendar__month-view__days');
        calendarBorder.style.borderColor='rgb(60, 160, 21)';   
        
        const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
        calendarWeekLabelStyle.style.color= 'rgb(60, 160, 21)';

        const calendarNowDate = document.querySelector('.react-calendar__tile--now')
        calendarNowDate.style.backgroundColor = 'rgb(60, 160, 21)';
        calendarNowDate.style.color = 'white';

    }
     
    
    function updateCalendarTheme2(){
        const calendarBorder = document.querySelector('.react-calendar__month-view__days');
        calendarBorder.style.borderColor='rgb(35, 88, 187)';
        
        const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
        calendarWeekLabelStyle.style.color= 'rgb(35, 88, 187)';

        const calendarNowDate = document.querySelector('.react-calendar__tile--now')
        calendarNowDate.style.backgroundColor = 'rgb(35, 88, 187)';
        calendarNowDate.style.color = 'white';
    }
    
    function updateCalendarTheme3(){
        
        const calendarBorder = document.querySelector('.react-calendar__month-view__days');
        calendarBorder.style.borderColor='rgb(209, 30, 90)';
        
        const calendarWeekLabelStyle = document.querySelector('.react-calendar__month-view__weekdays');
        calendarWeekLabelStyle.style.color= 'rgb(209, 30, 90)';

        const calendarNowDate = document.querySelector('.react-calendar__tile--now')
        calendarNowDate.style.backgroundColor = 'rgb(209, 30, 90)';
        calendarNowDate.style.color = 'white';

    }

    function toggleThemeChangeHandler1(){
        axiosInstance.post(`save-theme/`, {
            id_user: currentAppContext.idUser, // a fournir
            theme:"Theme1"                
        }).then((res)=>{
            console.log(res.data);           
            currentUiContext.updateTheme('Theme1');
            updateCalendarTheme1();
                          
        })  
        //Enlever ceci qd on va decommenter;
        currentUiContext.updateTheme('Theme1');
        updateCalendarTheme1();
    }

    function toggleThemeChangeHandler2(){
        axiosInstance.post(`save-theme/`, {
            id_user: currentAppContext.idUser, // a fournir
            theme:"Theme2"                
        }).then((res)=>{
            console.log(res.data);           
            currentUiContext.updateTheme('Theme2');
            updateCalendarTheme2();
                          
        })  
        //Enlever ceci qd on va decommenter;
        currentUiContext.updateTheme('Theme2');
        updateCalendarTheme2();
    }

    function toggleThemeChangeHandler3(){
        axiosInstance.post(`save-theme/`, {
            id_user: currentAppContext.idUser, // a fournir
            theme:"Theme3"                
        }).then((res)=>{
            console.log(res.data);           
            currentUiContext.updateTheme('Theme3');
            updateCalendarTheme3();
                          
        })  
        //Enlever ceci qd on va decommenter;
        currentUiContext.updateTheme('Theme3');
        updateCalendarTheme3();
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



    return (
        <div className={classes.formStyle}>
            <div className={classes.buttonRow}>
            
                <CustomButton
                    btnText='Theme 1' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={toggleThemeChangeHandler1}
                    hasIconImg= {true}
                    imgSrc='images/Theme1.png'
                    imgStyle = {classes.imgStyle}
                />
                    
                <CustomButton
                    btnText='Theme 2' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={toggleThemeChangeHandler2}
                    hasIconImg= {true}
                    imgSrc='images/Theme2.png'
                    imgStyle = {classes.imgStyle}

                />

                <CustomButton
                    btnText='Theme 3' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={toggleThemeChangeHandler3}
                    hasIconImg= {true}
                    imgSrc='images/Theme3.png'
                    imgStyle = {classes.imgStyle}
                />

            </div>
           
           {/* <div className={classes.buttonRow} style={{justifyContent:'flex-end', width:'80%'}}>
                <CustomButton
                    btnText='Appliquer' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {()=>{}}
                    //disable = {(isValid==false)}

                />
            </div>   */} 

        </div>
        
    );
 }
 
 export default ConfigTheme;