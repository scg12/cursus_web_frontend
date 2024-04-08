import React from 'react';
import CustomButton from '../../../customButton/CustomButton';
import {isMobile} from 'react-device-detect';
import classes from "../../scolarite/subPages/SubPages.module.css";
import UiContext from '../../../../store/UiContext';
import { useContext } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import {useTranslation} from "react-i18next";





function PDFTemplate(props) {
    const currentUiContext = useContext(UiContext);
   // const currentAppContext = useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const { t, i18n } = useTranslation();

    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }
   
   
    /************************************ JSX Code ************************************/

    return (
        <div style={{height:"73vh", width: "100%", backgroundColor:isMobile?'rgba(0,0,0,0.5)':null, display:'flex', flexDirection:'column', justifyContent:'center', zIndex:1200, position:'absolute',...props.style}}>
           
           {(props.loadingText==undefined)?
                <div style={{ alignSelf: 'center',  position: 'absolute', top:isMobile?'47%':'49.3%', fontWeight:'bolder', color:'#fffbfb', marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {t('traitement')}...
                </div>  
                :
                <div style={{ alignSelf: 'center',  position: 'absolute', top:isMobile?'47%':'49.3%', fontWeight:'bolder', color:'#fffbfb', marginTop:'-2.7vh', fontSise:'0.9vw'}}> 
                    {props.loadingText}...
                </div>  
            }               
        
            <div style={{   
                alignSelf: 'center',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '13vw',
                height: '3.13vh',
                position: 'absolute',
                top:'50%',
                zIndex: '1200',
                overflow: 'hidden'
            }}
            >
                <img src='images/loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
            </div>   

            <div style={{position:"relative", zIndex:1207}}>
                {props.children}
            </div>
            <div style={{height: "7vh", width: "100%", display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1vh', position: isMobile?'absolute':null, bottom:isMobile ? 2:null}}>
                <CustomButton
                    btnText={t('close_preview')}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.gridBtnTextStyle}
                    btnClickHandler={props.previewCloseHandler}                
                />
            </div>           

        </div>
         
    );
 }
 export default PDFTemplate;
 