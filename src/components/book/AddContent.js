import React from 'react';
import classes from "./Book.module.css";
import CustomButton from '../customButton/CustomButton';
import { useTranslation } from "react-i18next";
import '../../translation/i18n';

function AddContent(props){

    
    return(
        <div className={classes.inputRowSimple+' '+classes.container}>
            <div className={classes.inputRowLeft+' '+classes.textStyle}>
                Devoir
            </div>
            <div className={classes.inputRowLeft}>
                <textarea id="resumer"  rows={70} type="text"/>
            </div>
        </div>    
    );
}

export default AddContent;
