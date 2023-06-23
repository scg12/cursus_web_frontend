import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';

import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";

var BACCPercentage=45;
var PROBATPercentage=35;
var BEPCPercentage=70;

function TauxInvestissmts(props){
    
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

    function cancelHandler() {
        var sideNav = document.getElementById('side-menu');
        var backDrop = document.querySelectorAll('.sidenav-overlay');
       

        backDrop.forEach(element => {
            element.style.display='none';
            element.style.opacity='0';
          });
          
        sideNav.style.transform='translateX(105%)';
    }
        
    return (        
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle +' '+classes.margBottom3}>
                    TABLEAU DE BORD DE PRESENTATION DE L'EVOLUTION DES INVESTISSEMENTS
                </div>
            </div>
                   
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution De la Realisation Des Investissements Sur les 3 Dernieres Annees"  itemSelected={null}> </FormPuce>
                
            {/* <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Des Effectifs Sur les 3 dernieres Annees"  itemSelected={null}> </FormPuce>
                <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Des Effectifs Par Sexe Sur les 3 Dernieres Annees "  itemSelected={null}> </FormPuce>
             */
            }
            <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                <div> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        Baccalaureat:  
                    </div>
               
                    <ProgressBar striped variant="success" now={BACCPercentage} key={1} label={`${BACCPercentage}%`}/>
                </div>

                <div className={classes.margLeft2}> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        Probatoire:  
                    </div>
               
                    <ProgressBar striped variant="success" now={PROBATPercentage} key={1} label={`${PROBATPercentage}%`}/>
                </div>

                <div className={classes.margLeft2}> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        BEPC:  
                    </div>
               
                    <ProgressBar striped variant="success" now={BEPCPercentage} key={1} label={`${BEPCPercentage}%`}/>
                </div>

            </div>
                
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Taux De Reussite Par Sexe"  itemSelected={null}> </FormPuce>
            <div className={classes.inputRowLeft+' '+classes.margLeft5}>                     
                <div> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        Baccalaureat:  
                    </div>
               
                    <ProgressBar>
                        <ProgressBar striped variant="success" now={35} label={`Garcons: ${BEPCPercentage}%`} key={1} />
                        <ProgressBar variant="warning" now={20} label={`Filles : ${BEPCPercentage}%`} key={2} />
                    </ProgressBar>
                </div>

                <div className={classes.margLeft2}> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        Probatoire:  
                    </div>
               
                    <ProgressBar>
                    <ProgressBar striped variant="success" now={35} label={`Garcons: ${BEPCPercentage}%`} key={1} />
                        <ProgressBar variant="warning" now={20} label={`Filles : ${BEPCPercentage}%`} key={2} />
                    </ProgressBar>
                </div>

                <div className={classes.margLeft2}> 
                    <div className={classes.inputRowLabel+ ' '+ classes.bold}>
                        BEPC:  
                    </div>
               
                    <ProgressBar>
                    <ProgressBar striped variant="success" now={35} label={`Garcons: ${BEPCPercentage}%`} key={1} />
                        <ProgressBar variant="warning" now={20} label={`Filles : ${BEPCPercentage}%`} key={2} />
                    </ProgressBar>
                </div>

            </div>
                

               
                            

            
        
                    <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Du Taux De Reussite Sur les 3 Dernieres Annees "  itemSelected={null}> </FormPuce>
                    
                    <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                        <div className={classes.inputRowLabel}>
                            Nom du Parent :
                        </div>
                            
                        <div> 
                            <input id="NomParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Adresse du Parent :
                        </div>
                            
                        <div> 
                            <input id="adresseParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Email du Parent :
                        </div>
                            
                        <div> 
                            <input id="mailParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>
               

               
                    <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Evolution Du Taux De Reussite Par Sexe Sur les 3 Dernieres Annees"  itemSelected={null}> </FormPuce>
                    
                    <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                        <div className={classes.inputRowLabel}>
                            Nom du Parent :
                        </div>
                            
                        <div> 
                            <input id="NomParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Adresse du Parent :
                        </div>
                            
                        <div> 
                            <input id="adresseParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Email du Parent :
                        </div>
                            
                        <div> 
                            <input id="mailParent" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>
         
            
            
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
 
 export default TauxInvestissmts;