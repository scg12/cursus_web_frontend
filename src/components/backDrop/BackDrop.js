import React from 'react';
import classes from '../backDrop/BackDrop.module.css';

function BackDrop(props) {
    return (<div id={props.id} className={classes.backDrop} style={props.style}/>);
}

export default BackDrop;