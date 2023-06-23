import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";
import Select from 'react-select';

const baseURL = 'http://127.0.0.1:8000/';
// const baseURL = 'http://192.168.43.36:8000/';
var CURRENT_ETAB = { 
    id:0, 
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
};

function AddEtab(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [typeEtab, setTypeEtab] = useState(currentUiContext.formInputs[12]);
    const [lang, setLang] = useState(currentUiContext.formInputs[8]);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    const selectedTheme = currentUiContext.theme;

    const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        limitFilesConfig: { max: 1 },
        // minFileSize: 0.1, // in megabytes
        maxFileSize: 50,
        imageSizeRestrictions: {
          maxHeight: 1000, // in pixels
          maxWidth: 1000,
          minHeight: 32,
          minWidth: 32,
        },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errors.length) {
        getUploadError();
        console.log(errors);
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
    ];
    const optEtab=[
        {value: 'maternelle',  label:'Maternelle'   },
        {value: 'primaire',  label:'Primaire'   },
        {value: 'secondaire',  label:'Secondaire'}
    ];

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

    const customStyles = {

        control: base => ({
            ...base,
            height:27,
            minHeight: 27,
            width:'10vw',
            minwidth:'10vw',
            fontSize:'0.9vw',
            fontWeight:'500',     
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
              height: state.isSelected ? '3.7vh': '3.7vh',
              marginTop: state.isSelected ? '-0.7vh' : '-0.7vh'
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
        }
    
    /************************************ Handlers ************************************/

    function getFormData(){
        // let logoElt = document.getElementById('logo')
        if (document.getElementById('logo') !== null)
            CURRENT_ETAB.logo = document.getElementById('logo').src;
        console.log("logo:",document.getElementById('logo'))
        CURRENT_ETAB.id = document.getElementById('idEtab').value;
        CURRENT_ETAB.type_sousetab = document.getElementById('typeSousetab').value;
        CURRENT_ETAB.libelle = (document.getElementById('libelle').value !='') ? putToEmptyStringIfUndefined(document.getElementById('libelle').value).trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim();
        CURRENT_ETAB.date_creation = (document.getElementById('date_creation').value !='') ? putToEmptyStringIfUndefined(document.getElementById('date_creation').value).trim() : putToEmptyStringIfUndefined(document.getElementById('date_creation').defaultValue).trim();
        CURRENT_ETAB.nom_fondateur = (document.getElementById('nom_fondateur').value !='') ? putToEmptyStringIfUndefined(document.getElementById('nom_fondateur').value).trim() : putToEmptyStringIfUndefined(document.getElementById('nom_fondateur').defaultValue).trim();
        CURRENT_ETAB.localisation = (document.getElementById('localisation').value != '') ? putToEmptyStringIfUndefined(document.getElementById('localisation').value).trim() : putToEmptyStringIfUndefined(document.getElementById('localisation').defaultValue).trim();
        CURRENT_ETAB.bp = (document.getElementById('bp').value != '') ? putToEmptyStringIfUndefined(document.getElementById('bp').value).trim() : putToEmptyStringIfUndefined(document.getElementById('bp').defaultValue).trim();
        CURRENT_ETAB.email = (document.getElementById('email').value != '') ? putToEmptyStringIfUndefined(document.getElementById('email').value).trim() : putToEmptyStringIfUndefined(document.getElementById('email').defaultValue).trim();
        CURRENT_ETAB.tel = (document.getElementById('tel').value != '' ) ? putToEmptyStringIfUndefined(document.getElementById('tel').value).trim() : putToEmptyStringIfUndefined(document.getElementById('tel').defaultValue).trim();
        CURRENT_ETAB.devise = (document.getElementById('devise').value != '') ? putToEmptyStringIfUndefined(document.getElementById('devise').value).trim() : putToEmptyStringIfUndefined(document.getElementById('devise').defaultValue).trim();
        CURRENT_ETAB.langue= document.getElementById('codeLangue').value;
        CURRENT_ETAB.site_web = (document.getElementById('site_web').value != '') ? putToEmptyStringIfUndefined(document.getElementById('site_web').value).trim() : putToEmptyStringIfUndefined(document.getElementById('site_web').defaultValue).trim();        
        return CURRENT_ETAB;
    }

    function setFormData(){
        var inputs=[];
        inputs[0]= CURRENT_ETAB.libelle;
        inputs[1]= CURRENT_ETAB.date_creation;
        inputs[2]= CURRENT_ETAB.nom_fondateur;
        inputs[3]= CURRENT_ETAB.devise;
        inputs[4]= CURRENT_ETAB.localisation;
        inputs[5]= CURRENT_ETAB.bp;
        inputs[6]= CURRENT_ETAB.email;
        inputs[7]= CURRENT_ETAB.tel;
        inputs[8]= CURRENT_ETAB.langue;
        inputs[9]= CURRENT_ETAB.site_web;
        inputs[10]= CURRENT_ETAB.id;
        inputs[11]= CURRENT_ETAB.logo;
        inputs[12]= CURRENT_ETAB.type_sousetab;
        currentUiContext.setFormInputs(inputs)
    
    }

    function getUploadError(){
        var errorMsg;
        if(errors.length){
            if(errors[0].fileSizeTooSmall)  {
                errorMsg = 'Le fichier selectionne est trop lourd! la taille du fichier ne doit pas exceder 50Mo !!!';
                return errorMsg;
            }
            
            if(errors[0].fileSizeToolarge)  {
                errorMsg = 'Le fichier selectionne est tres petit! la taille du fichier doit depasser 0.5ko !!!';
                return errorMsg;
            }

            if(errors[0].imageHeightTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooSmall)  {
                errorMsg = 'Le fichier a de tres petites dimension !!!';
                return errorMsg;
            }    

            if(errors[0].imageHeightTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            }

            if(errors[0].imageWidthTooBig)  {
                errorMsg = 'Le fichier a de grandes dimensions  !!!';
                return errorMsg;
            } 
            
            
        }       
    }
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var NomEtab;
        var NomFondateur;
       
        NomEtab = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;
        NomFondateur = (document.getElementById('nom_fondateur').value!= undefined) ? document.getElementById('nom_fondateur').value.trim() : putToEmptyStringIfUndefined(document.getElementById('nom_fondateur').defaultValue).trim;              
        
        if(NomEtab.length == 0 || NomFondateur.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }

    function dropDownChangeHandler(e){
      document.getElementById('codeLangue').value = e.value;
      setLang(e.value);
    }
    function dropDownTypeEtabChangeHandler(e){
        document.getElementById('typeSousetab').value = e.value;
        setTypeEtab(e.value);
      }

    /************************************ JSX Code ************************************/

//     return (
//         <div className={classes.formStyle}>
//             <div className={classes.inputRow}> 
//                 {(errors.length) ?
//                     <div className={classes.errorMsg}> {getUploadError()}</div>
//                     :
//                     null
//                 }
//                 {(filesContent.length==0) ? 
//                     <div className={classes.etabLogo}>
//                         {(currentUiContext.formInputs[11]!==undefined && currentUiContext.formInputs[11] !== null )?
//                         < img src={baseURL+currentUiContext.formInputs[11]} id='en'  className={classes.logoImg} alt="my image"/>:
//                         < img src="images/logoDefault.png" id='en'  className={classes.logoImg} alt="my image"/>}
//                         <CustomButton
//                             btnText='Choisir Logo' 
//                             buttonStyle={getSmallButtonStyle()}
//                             btnTextStyle = {classes.btnSmallTextStyle}
//                             btnClickHandler = {() => openFileSelector()}
//                         />
//                     </div>  
//                         :
//                     <div className={classes.etabLogo}>
//                         <img id="logo" alt={filesContent[0].name} className={classes.logoImg} src={filesContent[0].content}/>
//                         <div className={classes.photoFileName}>{filesContent[0].name}</div>
//                         <CustomButton
//                             btnText='Choisir Logo' 
//                             buttonStyle={getSmallButtonStyle()}
//                             btnTextStyle = {classes.btnSmallTextStyle}
//                             btnClickHandler = {() => openFileSelector()}
//                         />
//                     </div>
//                 }
                
//             </div>
           
//             <div id='errMsgPlaceHolder'/>

            
//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Nom Etablissement :  
//                 </div>
                    
//                 <div> 
//                     <input id="libelle" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
//                 </div>
//             </div>

//              <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Type :  
//                 </div>
//                 <div style={{marginBottom:'1.3vh'}}> 
//                     <Select
//                         options={optEtab}
//                         className={classes.selectStyle +' slctClasseStat'}
//                         classNamePrefix="select"
//                         value={{value: typeEtab,  label:typeEtab==="primaire"?'Primaire':typeEtab==="secondaire"?"Secondaire":"Maternelle"  }}
//                         styles={selectLangueStyles}
//                         onChange={dropDownTypeEtabChangeHandler} 
//                     />
//                 </div>
//             </div> 

//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Date Creation :  
//                 </div>
                    
//                 <div> 
//                     <input id="date_creation" type="text" className={classes.inputRowControl + ' formInput medium' }  defaultValue={currentUiContext.formInputs[1]}/>
//                 </div>
//             </div>

//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Nom Fondateur :  
//                 </div>
                    
//                 <div> 
//                     <input id="nom_fondateur" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[2]}/>
//                 </div>
//             </div>
//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                 Devise Etablissement :
//                 </div>
                    
//                 <div> 
//                     <input id="devise" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[3]}/>
//                 </div>
//             </div>

//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Localisation :  
//                 </div>
                    
//                 <div> 
//                     <input id="localisation" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[4]} />
//                 </div>
//             </div>

//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     BP :  
//                 </div>
                    
//                 <div> 
//                     <input id="bp" type="text" className={classes.inputRowControl + ' formInput small'}  defaultValue={currentUiContext.formInputs[5]} />
//                 </div>
//             </div>
//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Email :  
//                 </div>
                    
//                 <div> 
//                     <input id="email" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[6]}/>
//                 </div>
//             </div>
//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     TEL :  
//                 </div>
                    
//                 <div> 
//                     <input id="tel" type="text" className={classes.inputRowControl + ' formInput medium'}  defaultValue={currentUiContext.formInputs[7]}/>
//                 </div>
//             </div>
//              <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Langue :  
//                 </div>
                    
//                 <div style={{marginBottom:'1.3vh'}}> 
//                     <Select
//                         options={optLangue}
//                         className={classes.selectStyle +' slctClasseStat'}
//                         classNamePrefix="select"
//                         value={{value: lang,  label:lang==="fr"?'Français':"English"}}
//                         styles={selectLangueStyles}
//                         onChange={dropDownChangeHandler} 
//                     />
//                 </div>
//             </div> 
//             <div className={classes.inputRowLeft}> 
//                 <div className={classes.inputRowLabel}>
//                     Site Web :  
//                 </div>
                    
//                 <div> 
//                     <input id="site_web" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[9]}/>
//                 </div>
//             </div>
//             <div>
//                 <input id="codeLangue" type="hidden"  value={lang}/>
//                 <input id="typeSousetab" type="hidden"  value={typeEtab}/>
//                 <input id="idEtab" type="hidden"  value={currentUiContext.formInputs[10]}/>
//             </div>
           
//             <div className={classes.buttonRow}>
//                 <CustomButton
//                     btnText='Annuler' 
//                     buttonStyle={getButtonStyle()}
//                     btnTextStyle = {classes.btnTextStyle}
//                     btnClickHandler={props.cancelHandler}
//                 />
                
//                 <CustomButton
//                     btnText={(props.formMode=='creation') ? 'Valider':'Modifier'} 
//                     buttonStyle={getButtonStyle()}
//                     btnTextStyle = {classes.btnTextStyle}
//                     btnClickHandler={(isValid) ? props.actionHandler : null}
//                     disable={!isValid}
//                 />
                
//             </div>

            

//         </div>
       
//      );
//  }
return (
    <div className={classes.formStyle}>
        <div className={classes.inputRow}> 
            {(errors.length) ?
                <div className={classes.errorMsg}> {getUploadError()}</div>
                :
                null
            }
           
           {(filesContent.length==0) ? 
                    <div className={classes.etabLogo}>
                        {(currentUiContext.formInputs[11]!==undefined && currentUiContext.formInputs[11] !== null )?
                        < img src={baseURL+currentUiContext.formInputs[11]} id='en'  className={classes.logoImg} alt="my image"/>:
                        < img src="images/logoDefault.png" id='en'  className={classes.logoImg} alt="my image"/>}
                        <CustomButton
                            btnText='Choisir LogoA' 
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {() => {openFileSelector();}}
                        />
                    </div>  
                        :
                    
                    <div className={classes.etabLogo}>
                        <img id="logo" alt={filesContent[0].name} className={classes.logoImg} src={filesContent[0].content}/>
                        
                        <CustomButton
                            btnText='Choisir LogoB' 
                            buttonStyle={getSmallButtonStyle()}
                            btnTextStyle = {classes.btnSmallTextStyle}
                            btnClickHandler = {() => {openFileSelector();}}
                        />
                    </div>
            }

           
            
        </div>
       
        <div id='errMsgPlaceHolder'/>

        
        <div className={classes.inputRowLeft}>
            <div className={classes.Mandatory}>*</div>
            <div className={classes.inputRowLabel}>
                Nom Etablissement :  
            </div>
                
            <div> 
                <input id="libelle" type="text"  style={{marginLeft:'-1.2vw'}} className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[0]} />
            </div>
        </div>
        <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel}>
                        Type :  
                    </div>
                    <div style={{marginBottom:'1.3vh'}}> 
                        <Select
                            options={optEtab}
                            className={classes.selectStyle +' slctClasseStat'}
                            classNamePrefix="select"
                            value={{value: typeEtab,  label:typeEtab==="primaire"?'Primaire':typeEtab==="secondaire"?"Secondaire":"Maternelle"  }}
                            styles={customStyles}
                            onChange={dropDownTypeEtabChangeHandler} 
                        />
                    </div>
                </div>

        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                Date Creation :  
            </div>
                
            <div> 
                <input id="date_creation" type="text" className={classes.inputRowControl + ' formInput medium' }  defaultValue={currentUiContext.formInputs[1]}/>
            </div>
        </div>

        <div className={classes.inputRowLeft}>
            <div className={classes.Mandatory}>*</div> 
            <div className={classes.inputRowLabel}>
                Nom Fondateur :  
            </div>
                
            <div> 
                <input id="nom_fondateur" type="text" style={{marginLeft:'-1.2vw'}} className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[2]}/>
            </div>
        </div>
        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
            Devise Etablissement :
            </div>
                
            <div> 
                <input id="devise" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[3]}/>
            </div>
        </div>

        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                Localisation :  
            </div>
                
            <div> 
                <input id="localisation" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[4]} />
            </div>
        </div>

        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                BP :  
            </div>
                
            <div> 
                <input id="bp" type="text" className={classes.inputRowControl + ' formInput small'}  defaultValue={currentUiContext.formInputs[5]} />
            </div>
        </div>
        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                Email :  
            </div>
                
            <div> 
                <input id="email" type="text" className={classes.inputRowControl + ' formInput'}  defaultValue={currentUiContext.formInputs[6]}/>
            </div>
        </div>
        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                TEL :  
            </div>
                
            <div> 
                <input id="tel" type="text" className={classes.inputRowControl + ' formInput medium'}  defaultValue={currentUiContext.formInputs[7]}/>
            </div>
        </div>
        <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Langue :  
                </div>
                    
                <div style={{marginBottom:'1.3vh'}}> 
                    <Select
                        options={optLangue}
                        className={classes.selectStyle +' slctClasseStat'}
                        classNamePrefix="select"
                        value={{value: lang,  label:lang==="fr"?'Français':"English"}}
                        styles={selectLangueStyles}
                        onChange={dropDownChangeHandler} 
                    />
                </div>
            </div> 
        <div className={classes.inputRowLeft}> 
            <div className={classes.inputRowLabel}>
                Site Web :  
            </div>
                
            <div> 
                <input id="site_web" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} defaultValue={currentUiContext.formInputs[9]}/>
            </div>
        </div>
        <div>
        <input id="codeLangue" type="hidden"  value={lang}/>
                <input id="typeSousetab" type="hidden"  value={typeEtab}/>
                <input id="idEtab" type="hidden"  value={currentUiContext.formInputs[10]}/>
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
                disable={!isValid}
            />
            
        </div>

        

    </div>
   
 );
}
 export default AddEtab;
 