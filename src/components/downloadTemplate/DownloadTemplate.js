import React from "react";
import CustomButton from "../customButton/CustomButton";
import classes from './DownloadTemplate.module.css';
import { useTranslation } from "react-i18next";




function DownloadTemplate(props) {
    const { t, i18n } = useTranslation();

    function downloadhandler(e){
        let url = window.URL.createObjectURL(props.fileBlobString);
        let a = document.createElement('a');
        a.href = url;
        a.download = props.fileName;
        a.click();
        //window.location.href=url;    
    }
    


    return (
        <div style={{width:"100%", height:"80vh", backgroundColor:"white", display:'flex', flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <div style={{color:'black', fontSize:'0.9vw'}}>{props.fileBlobString}</div>
            <CustomButton
                btnText={t('download')}
                buttonStyle={classes.Btnstyle}
                btnTextStyle = {classes.btnTextStyle}
                btnClickHandler={downloadhandler}
                //disable={(isValid==false)}
            />
        </div>

    ); 

}
export default DownloadTemplate;