import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";

var sectionLib,sectionDesc;

function AddSection(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const selectedTheme = currentUiContext.theme;
    const initialFormDate = Object.freeze({
        libelle:'',
        date_creation:'',
        nom_fondateur:'',
        localisation:'',
        bp:'',
        email:'',
        tel:'',
        devise:'',
        logo:'',
        langue:'fr',
        site_web:''
    });

  

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

    const optLangue=[
        {value: 'fr',  label:'Français'   },
        {value: 'en',  label:'English'    }
    ]

    const selectLangueStyles = {
        control: base => ({
          ...base,
          height: '2.5vh',
          minHeight: '2.5vh',
          width:'12vw',
          minwidth:'12vw',
          paddingBottom : 30,
          fontSize:'1vw',         
        }),
        placeholder:base => ({
            ...base,
            marginTop:'-3.3vh',
            fontSize: '1vw'
        }),
        indicatorsContainer:(base,state) => ({
            ...base,
            height: state.isSelected ?'5vh': '5vh',
            marginTop: state.isSelected ? '-1.3vh' :'-1.3vh',
            alignSelf: state.isSelected ? 'center' : 'center',
        }),
        indicatorSeparator:(base,state) => ({
            ...base,
            height: state.isSelected ? '4.7vh': '4.7vh',
            marginTop: state.isSelected ? '-1.4vh' : '-1.4vh'
        }),        
        dropdownIndicator:(base,state) => ({
            ...base,
            marginTop: state.isSelected ? '-2.7vh' : '-2.7vh',
            fontSize: state.isSelected ? '1vw' : '1vw'
        }),        
        singleValue: (base,state) => ({
            ...base,
            marginTop: state.isSelected ? '-3.7vh' : '-3.7vh',
            fontSize:  state.isSelected ? '0.9vw' : '0.9vw',
            fontWeight: state.isSelected ? '670' : '670'
        })       
    };

    function CheckMainFields(){       
        // if(document.getElementById('libelle') == null || document.getElementById('nom_fondateur') == null) {
        //     if(props.formMode=='creation') return false;
        //     else return true;            
        // }
        // else return false;        
        return true;
    }

    function handleChange(e){
        var NomSetab;
        var NomFondateur;
       
        NomSetab = (document.getElementById('libelle').defaultvalue != undefined) ? document.getElementById('libelle').defaultvalue.trim() : document.getElementById('libelle').value.trim();
        // NomFondateur = (document.getElementById('nom_fondateur').defaultvalue!= undefined) ? document.getElementById('nom_fondateur').defaultvalue.trim() : document.getElementById('nom_fondateur').value.trim();              
        
        if(NomSetab.length !== 0 ) {           
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }

    // function changeHandler() {
    //     sectionLib = document.getElementById('sectionLib').value;
    //     sectionDesc = document.getElementById('sectionDesc').value;
        
    //     if(props.formMode=='creation') {
    //         if(sectionLib.length == 0) {
    //             setIsValid(false)
    //         } else {
    //             setIsValid(true)
    //         }
    //     } else {
    //         if(sectionLib.length == 0 && sectionDesc.length == 0) {
    //             setIsValid(false)
    //         } else {
    //             setIsValid(true)
    //         }
    //     }
      
    // }
 
    return (
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.etabLogo}>
                    < img src="images/logoDefault.png" id='en'  className={classes.logoImg} alt="my image"/>  
                    <CustomButton
                        btnText='Choisir Logo' 
                        buttonStyle={getSmallButtonStyle()}
                        btnTextStyle = {classes.btnSmallTextStyle}
                    />
                </div>
            </div>
           
            <div id='errMsgPlaceHolder'/>

            
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nom Etablissement :  
                </div>
                    
                <div> 
                    <input id="libelle" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Creation :  
                </div>
                    
                <div> 
                    <input id="date_creation" type="text" className={classes.inputRowControl + ' formInput medium' } onChange={handleChange} defaultValue={currentUiContext.formInputs[1]}/>
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nom Fondateur :  
                </div>
                    
                <div> 
                    <input id="nom_fondateur" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[2]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                Devise :
                </div>
                    
                <div> 
                    <input id="devise" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[3]}/>
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Localisation :  
                </div>
                    
                <div> 
                    <input id="localisation" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[4]} />
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Bp :  
                </div>
                    
                <div> 
                    <input id="bp" type="text" className={classes.inputRowControl + ' formInput small'} onChange={handleChange} defaultValue={currentUiContext.formInputs[5]} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Email :  
                </div>
                    
                <div> 
                    <input id="email" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[6]}/>
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Tel :  
                </div>
                    
                <div> 
                    <input id="tel" type="text" className={classes.inputRowControl + ' formInput medium'} onChange={handleChange} defaultValue={currentUiContext.formInputs[7]}/>
                </div>
            </div>
            {/* <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Langue :  
                </div>
                    
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optLangue}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        defaultValue = {optLangue[0]}
                        styles={selectLangueStyles}
                        onChange={dropDownChangeHandler} 
                    />
                </div>
            </div> */}
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Site Web :  
                </div>
                    
                <div> 
                    <input id="site_web" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[9]}/>
                </div>
            </div>
            <div>
                {/* <input id="codeLangue" type="hidden"  value={optLangue[0]}/> */}
                <input id="codeLangue" type="hidden"  value="fr"/>
                {/* <input id="idSetab" type="hidden" value="" defaultValue={currentUiContext.formInputs[10]} /> */}
                <input id="idSetab" type="hidden" defaultValue={currentUiContext.formInputs[10]} />
            </div>
           
            <div className={classes.buttonRow}>
                <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={props.cancelHandler}
                />
                
                <CustomButton
                    btnText={(props.formMode=='creation') ? 'Valider':'Modifier'} 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={(isValid) ? props.actionHandler : null}
                    disable={(isValid==CheckMainFields())}
                />
                
            </div>

            

        </div>
       
     );
}
 
export default AddSection;