import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Select from 'react-select';

import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";

var BACCPercentage=45;
var PROBATPercentage=35;
var BEPCPercentage=70;

function EvolutionBudget(props){
    
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const selectedTheme = currentUiContext.theme;

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

    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }


    const optClasse=[
        {value: '0',      label:'Choisir une classe' },
        {value: '6em1',   label:'6ieme 1'            },
        {value: '5em2',   label:'5ieme 2'            },
        {value: '4A2',    label:'4ieme A2'           },
        {value: '3E',     label:'3ieme Esp'          },
        {value: '2c1',    label:'2nd C1'             },
        {value: '1L',     label:'1ere L'             },
        {value: 'TD',     label:'Tle D'              }
    ];


    /******************************* <Handlers> *******************************/
    function dropDownHandler(){

    }

    function cancelHandler() {
        var sideNav = document.getElementById('side-menu');
        var backDrop = document.querySelectorAll('.sidenav-overlay');
       

        backDrop.forEach(element => {
            element.style.display='none';
            element.style.opacity='0';
          });
          
        sideNav.style.transform='translateX(105%)';
    }
     /******************************* </Handlers> *******************************/
        
    return (        
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle +' '+classes.margBottom3}>
                    TABLEAU DE BORD DE PRESENTATION DE L'EVOLUTION DU BUDGET
                </div>
            </div>

            <div className={classes.inputRow}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                    CLASSE  :                       
                </div>
                <div>
                    <select onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optClasse||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select> 
                </div>               
                
            </div>            
                   
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Du Budget Sur les 3 Dernieres Annees"  itemSelected={null}> </FormPuce>
                
            {/* <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Des Effectifs Sur les 3 dernieres Annees"  itemSelected={null}> </FormPuce>
                <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Des Effectifs Par Sexe Sur les 3 Dernieres Annees "  itemSelected={null}> </FormPuce>
             */
            }        
 
            
            <div className={classes.buttonRow+' '+classes.margLeft5 }>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}

                />
                                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable={(isValid == false)}
                />
                
            </div>

            

        </div>
       
     );
 }
 
 export default EvolutionBudget;