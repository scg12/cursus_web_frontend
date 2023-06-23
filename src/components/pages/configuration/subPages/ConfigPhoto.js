import React from 'react';
import { useFilePicker } from 'use-file-picker';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState } from "react";


function ConfigPhoto(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const selectedTheme = currentUiContext.theme;
    const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
        readAs: 'DataURL',
        accept: 'image/*',
        multiple: false,
        limitFilesConfig: { max: 1 },
        // minFileSize: 0.1, // in megabytes
        maxFileSize: 50,
        imageSizeRestrictions: {
          maxHeight: 500, // in pixels
          maxWidth: 500,
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
    /************************************ Handlers ************************************/
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
        
    function updateProfile(e){       
        e.preventDefault();
        var fileName = filesContent[0].name; 
        var fileContent = filesContent[0].content;
        console.log(fileContent);   
        //Mettre a jour le profil utilisateur
        /*axiosInstance.post(`update_user/`, {
            id: '', // a fournir
            username:newLogin                
        }).then((res)=>{
            console.log(res.data);
                //Retourner le statut de l'action
            
            alert('Login Modifier avec succes!')
            clearForm();              
        }) */        

    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>  
            {(errors.length) ?
                <div className={classes.errorMsg}> {getUploadError()}</div>
                :
                null
            }
    
            {(filesContent.length==0) ?        
                <div className={classes.photoZone}>       
                    <div className={classes.photoStyle}>
                        <img src="images/profile.png" id='en'  className={classes.widgetIcon} alt="my image"/>
                    </div>
                    <div className={classes.photoFileName}></div>                
                </div>
                :
                <div className={classes.photoZone}>
                    <div className={classes.photoStyle}>
                        <img alt={filesContent[0].name} className={classes.widgetIcon} src={filesContent[0].content}/>
                    </div>
                    <div className={classes.photoFileName}>{filesContent[0].name}</div>
                </div>
            }
            
            <div className={classes.buttonRow}> 
                <CustomButton
                    btnText='Choisir Image' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler = {() => openFileSelector()}

                />

                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable = {(isValid==(filesContent.length!=0 && errors.length==0))}
                    btnClickHandler = {updateProfile}

                />
            </div>                      
        </div>       
    );
 }
 
 export default ConfigPhoto;