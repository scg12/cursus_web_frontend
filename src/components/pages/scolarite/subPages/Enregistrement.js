import classes from "./SubPages.module.css";
import React from 'react';
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";

function Enregistrement(props) {
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
                <div className={classes.formTitle}>
                    FORMULAIRE D'ENREGISTREMENT ELEVE
                </div>
            </div>

            <div className={classes.etabLogo+ ' ' +classes.right + ' '+ classes.margRight7}>
                        < div className={classes.logoImg}> PHOTO </div>
                        <CustomButton
                            btnText='Choisir Photo' 
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                        />
            </div>
            

            <div className={classes.formContaintStyle}>
               
                <div className={classes.inputSection}>
                   
                    <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Informations de L'Eleve"  itemSelected={null}> </FormPuce>
                    <div className={classes.inputRowLeft+' '+classes.margLeft5}> 
                        <div className={classes.inputRowLabel}>
                            Nom(s) :  
                        </div>
                            
                        <div> 
                            <input id="NomEleve" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                        Prenom(s) :
                        </div>
                            
                        <div> 
                            <input id="prenomEleve" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Date de Naissance :
                        </div>
                            
                        <div> 
                            <input id="dateNaissancee" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Lieu de Naissance :
                        </div>
                            
                        <div> 
                            <input id="lieuNaissance" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                    <div className={classes.inputRowLeft+' '+classes.margLeft5}>  
                        <div className={classes.inputRowLabel}>
                            Classe :
                        </div>
                            
                        <div> 
                            <input id="lieuNaissance" type="text" className={classes.inputRowControl + ' formInput'} />
                        </div>
                    </div>

                </div>

            
                <div className={classes.inputSection+' '+classes.margTop7}>
                    <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Informations du Parent(Pere, Mere ou Tuteur)"  itemSelected={null}> </FormPuce>
                    
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
 
 export default Enregistrement;