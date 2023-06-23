import React from 'react';
import CustomButton from '../../../customButton/CustomButton';
import {isMobile} from 'react-device-detect';
import classes from "../../scolarite/subPages/SubPages.module.css";
import UiContext from '../../../../store/UiContext';
import { useContext } from 'react';
import { PDFViewer } from '@react-pdf/renderer';




function PDFTemplate(props) {
    const currentUiContext = useContext(UiContext);
   // const currentAppContext = useContext(AppContext);

    const selectedTheme = currentUiContext.theme;

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
        <div style={{height:"73vh", width: "100%", backgroundColor:isMobile?'white':null, display:'flex', flexDirection:'column', justifyContent:'center', zIndex:1200, position:'absolute'}}>
            
            <div>
                {props.children}
            </div>
            <div style={{height: "7vh", width: "100%", display:'flex', flexDirection:'row', justifyContent:'center', marginTop:'1vh'}}>
                <CustomButton
                    btnText={"Fermer l'apercu"}
                    buttonStyle={getGridButtonStyle()}
                    btnTextStyle = {classes.gridBtnTextStyle}
                    btnClickHandler={props.previewCloseHandler}                
                />
            </div>           

        </div>
         
    );
 }
 export default PDFTemplate;
 