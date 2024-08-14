import React from 'react';

import { useState,useContext, useEffect} from "react";
import UiContext from '../../store/UiContext';
import AppContext from '../../store/AppContext';

var SERVER_ADRESS;

function ServerConf(props){
    
    

   
    useEffect(()=> {
        getData();
        
    },[]);

    const getData =()=>{
        fetch('cursusConf.json',{
            headers : {
                'Content-type':'application/json',
                'Accept'      :'application/json'
            }
        }).then(function(response){
            return response.json();
        })
        .then(function(myJson){
            var objConf = {...myJson};
            SERVER_ADRESS = objConf.adress;           
            console.log("perepepepe",myJson)
        });
    }


    return SERVER_ADRESS;
        
};
export default ServerConf;