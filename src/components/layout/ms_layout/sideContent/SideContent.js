import React, {useState, useEffect} from 'react'

import { Component, useContext } from "react";
import UiContext from '../../../../store/UiContext';
import AppContext from '../../../../store/AppContext';
import Notification from '../../../notification/Notification';


import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';
import axiosInstance from '../../../../axios';

import 'react-materialize';
import 'materialize-css/dist/css/materialize.min.css';
import classes from './SideContent.module.css';

const DEFAULT_IMAGE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAAA9CAIAAADJU6fiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASOSURBVHhe7Zq7UuwwEETv/3/ITTYgICChioSAgISEiIiQlA+ALtTrkqVpPdb2LKJ0olve0aOnRw+b++9rMiDTtiGZtg3JtG1Ipm1DMm0bkmnbkEzbhmTaNiTTtiGZtg3JtG1IbNuenp7+t4FIttmDj4+Pl5eXh4eHu7s7DnAGT+7v75+fn9/f3xm9B+gNfaLnfMTT6YSHABoxqy3j7q7Ltg1jsNcaiGSbbby9veWSFDc3N9vHRQ/ohz22ASORYrZv4yBdcpP8/PxEdbA/C/yKGEZvAJXYLiwGIpEU9tIDWvUaFsNeahyqq3K2KXl4zohtYGdACbPTCNTEMvWww6iZ9C67x8dHtlyDFL++vi6FGDZPc24hoMzRuiq2qXrp3StMTG14Yu7yhdXf7pzZA0aEYYxYg0Fvb28Zd4a/aRx0XWjb9psIai3XBgr7g5nEgJmRBJWdclvMk3Fn+IPAR9fVbDN7Rmb5swDiGboGshkhwHpi6JoWIYnffCrw0XUd27D82dEalCojNGpKhS0F5WyugMYTGiXPBj/wqYWbruvYZp7D1RUTUKkpNMdsGbSm4HRCPGE+snDTdQXb1IbQ2CeWDhtkqKI2lxpAV4zYA09dV7BNXQ0Kh3YCCpBt1uDKzogIdapBGiN2wlPXFWxTbyrttY/XD7ZZY76WqGxukWDiqcvbNqx3dpHBiAYwOtusQeIYEaGyqd7VLsNZl7dtassyM65QpzdgxJnCgdHyqteOsy5v21RBdZ006vAHyeldiGTETjjr+mu2Jed/e/1uxFmXt23q1D1InsomYMROOOvytk11OLptzrqmbfswbatzqG2FzhPY4Ic/bpt6+d1LXnKtv8C25MOxIrnZO+vytk3lcS95jDhz2U0Sb3vKhkD+tclZ12+xDTCiASXvdDox4kwhEdVvTuoLoflJ3lmXt23tBVUAxc42a/LSLnxzwkwYJFD/68TU7qzL27bC16ZqHhdUaZuzUn+1wf7JCEHXKM66jrItnkEyb/Vtt5rHBTUr8zOjehHGYmKEoD2JAU9dR9kWJyuxTW0+uAUwokbX/zBQO495RMX02uap6yjb4hkkn0HVDTs/eE1UczWlwvFWvpX02uap6xDbkhnwaYTqtuVvYObVHKkpeKD2yfweH9NrG3DTdYhtyQz4NELduzAcIwTQEK/jhbIBqpDVvhq4QLubrv1ty2fAH9aYxQXKBpjrppoU0HWbByqPoKtkF/bVtb9t+Qz4wxrkRb3PqquXmRF0gq4YoekdDgL5c0bZNh9dFdu6Kg47eG4zhufPGQWF8H45DxBm9gzK2hIKwyFx2EhDGP6hVkygbBtw0CVtQ7Py7BsprHSAUdT2VaWavpwtwy20jHu0Lts2LGf2sZmybQHc0dtLBBsAgpOXii5wcTDPkhzcWfIF0V4ux+mybcPM2NlmWmwLoEJRLihSNEk2Z2waeIhZLTvMdsJwyFQyHP4dxlq2TURiAgDBaNJbMUfoqpxtk9/JtG1Ipm1DMm0bkmnbkEzbhmTaNiTTtiGZtg3JtG1Ipm1DMm0bkmnbgHx9fQNo/2b1E9/GYQAAAABJRU5ErkJggg==";

function SideContent(props) {

    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    //Cette constante sera lu lors de la configuration de l'utilisateur.
    const selectedTheme = currentUiContext.theme;
    const[optEtab, setOpEtab] = useState([]);
    const[optAnnee, setOpAnnee] = useState([]);
    const[optCycle, setOptCycle] = useState([]);
    const[optNiveau, setOptNiveau] = useState([]);
    const[idAnnee, setIdAnnee] = useState([]);
    const[idEtab, setIdEtab] = useState([]);
    const[changeCycleSelected, setChangeCycleSelected] = useState('');
    const[changeEtabSelected, setChangeEtabSelected] = useState('');
    const[changeAnneeSelected, setChangeAnneeSelected] = useState('');
    const[changeNiveauSelected, setChangeNiveauSelected] = useState('');

    const { t, i18n } = useTranslation();
    
    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.id);
    };

    function getCurrentTheme()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_sideContent;
            case 'Theme2': return classes.Theme2_sideContent;
            case 'Theme3': return classes.Theme3_sideContent;
            default: return classes.Theme1_sideContent;
        }
    }


    function getCurrentThemeSideLabel()
    { 
       // Choix du theme courant
       switch(selectedTheme){
            case 'Theme1': return classes.Theme1_sideContentLabel;
            case 'Theme2': return classes.Theme2_sideContentLabel;
            case 'Theme3': return classes.Theme3_sideContentLabel;
            default: return classes.Theme1_sideContentLabel;
        }
    }
    let id_etab_init = 0;
    let id_annee_init = 0;
    

    useEffect(()=> {
        id_etab_init = currentAppContext.idEtabInit;
        id_annee_init = currentAppContext.activatedYear.id_annee;
        setOpAnnee(createOption(currentAppContext.infoAnnees,"id_annee","libelle"));
        // console.log("id_annee_init: ",id_annee_init)
        // console.log("POPO: ",currentAppContext.infoAnnees.filter((ann)=>ann.id_annee==id_annee_init));
        setChangeAnneeSelected(createOption(currentAppContext.infoAnnees.filter((ann)=>ann.id_annee==id_annee_init),"id_annee","libelle"));
        console.log("id_etab_init: ",id_etab_init)
        setIdAnnee(id_annee_init);
        setIdEtab(id_etab_init);
        currentAppContext.setCurrentYear(id_annee_init);
        currentAppContext.setCurrentEtab(id_etab_init);
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == id_annee_init),'id_setab','libelle')); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init),'id_cycle','libelle')); 
        // console.log("BOBO: ",currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init))
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab_init),"id_niveau","libelle"));
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == id_annee_init),'id_cycle','libelle')[0]);
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab_init),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab_init),'id_cycle','libelle')[0]);
        // console.log("currentYear: ",currentAppContext.currentYear," currentEtab: ", currentAppContext.currentEtab);

        if(currentAppContext.currentEtabInfos != null && currentAppContext.currentEtabInfos != undefined && currentAppContext.currentEtabInfos.logo_url != null && currentAppContext.currentEtabInfos.logo_url != undefined && currentAppContext.currentEtabInfos.logo_url != ""){
            document.getElementById("logo_url").value = currentAppContext.currentEtabInfos.logo_url;
        } else {
            document.getElementById("logo_url").value = DEFAULT_IMAGE_URL;
        }   
        
        console.log("Etab en cours", currentAppContext.currentEtabInfos);
        
    },[])
  
 
    function getSelectDropDownTextColr() {
        switch(selectedTheme){
            case 'Theme1': return 'rgb(60, 160, 21)';
            case 'Theme2': return 'rgb(64, 49, 165)';
            case 'Theme3': return 'rgb(209, 30, 90)';
            default: return 'rgb(60, 160, 21)';
        }
        
    }


    function createOption(tabOption,idField, labelField){
        var newTab=[];
        for(var i=0; i< tabOption.length; i++){
            var obj={
                value: tabOption[i][idField],
                label: tabOption[i][labelField]
            }
            newTab.push(obj);
        }
        return newTab;
    }

    function onChangeAnneeHandler(e){
        setIdAnnee(idAnnee);
        setOpAnnee(null);
        setOpEtab(null);

        currentAppContext.setCurrentYear(idAnnee);

        setOptCycle(null);
        setOptNiveau(null);

        setOpAnnee(createOption(currentAppContext.infoAnnees,'id_annee','libelle')); 
        setChangeAnneeSelected(createOption(currentAppContext.infoAnnees.filter((ann)=>ann.id_annee == e.value),'id_annee','libelle'));

        let etabs = currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value);
        let id_etab = null;
        if (etabs.length >0)
            // setIdEtab(createOption(etabs,'id_cycle','libelle')[0].value);
            // id_etab = createOption(etabs,'id_cycle','libelle')[0].value;
            id_etab = etabs[0].id_setab;
        // console.log("id_etab: ",id_etab)
        currentAppContext.setCurrentEtab(id_etab);
        // console.log("currentYear: ",currentAppContext.currentYear," currentEtab: ", currentAppContext.currentEtab);
        
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value),'id_setab','libelle')); 
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == e.value),'id_cycle','libelle')[0]); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == id_etab),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == id_etab),'id_cycle','libelle')[0]);

    }
    function onChangeSectionHandler(e){
        setIdEtab(e.value);
        currentAppContext.setCurrentEtab(e.value);
        setOpEtab(null);
        setOptCycle(null);
        setOptNiveau(null);
        setOpEtab(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_annee == idAnnee),'id_setab','libelle')); 
        setChangeEtabSelected(createOption(currentAppContext.infoSetabs.filter((etab)=>etab.id_setab == e.value),'id_cycle','libelle')); 
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == e.value),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == e.value),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == e.value),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_setab == e.value),'id_cycle','libelle')[0]);

    }
    function onChangeCycleHandler(e){
        setOptCycle(null);
        setOptNiveau(null);
        setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == idEtab),'id_cycle','libelle')); 
        setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),"id_niveau","libelle"));
        setChangeCycleSelected(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_cycle == e.value),'id_cycle','libelle')[0]);
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_cycle','libelle')[0]);
    }

    function onChangeNiveauHandler(e){
        setChangeNiveauSelected(createOption(currentAppContext.infoNiveaux.filter((nivo)=>nivo.id_cycle == e.value),'id_cycle','libelle')[0]);
    }


    function setNotifAsReaded(idNotif,userId){
        return new Promise(function(resolve, reject){
          
            axiosInstance.post(`set-message-as-read/`, {
                id_sousetab     : currentAppContext.currentEtab,
                user_id         : userId,
                msg_id          : idNotif
    
            }).then((res)=>{
                console.log("resultat du remove",res.data);
                resolve(res.data);
            })
            
        });
    }


    function closeNotifHandler(e,notif,index){
        var notifs = [...currentAppContext.tabNotifs];

        console.log("notif",  notif);
        notifs.splice(index,1);     
        document.getElementById("notifMsg"+notif.msg.id).style.display = 'none';
        

        // notifs.map((ntf, ind)=>{
        //     if(ind != index){           
        //         document.getElementById("notifMsg"+ntf.msg.id).style.display = 'block';
        //     }                
        // });      
        
        console.log("reste",notifs);
       // currentAppContext.setTabNotifs((notifs));
    }

    function seNotifAsReadHandler(e,notif,index){
        var notifs = [...currentAppContext.tabNotifs];
        console.log("notif",  notif);
        //Ici je vais en BD marquer que la notif est lue
        //Et, je cache la notif et je l'enleve du tableau des notifs
        setNotifAsReaded(notif.msg.id, currentAppContext.idUser).then((result)=>{
            notifs.splice(index,1);
            document.getElementById("notifMsg"+notif.msg.id).style.display = 'none';
            // notifs.map((ntf, ind)=>{
            //     if(ind == index){
            //         document.getElementById("notifMsg"+notif.msg.id).style.display = 'none';
            //     } else {
            //         document.getElementById("notifMsg"+ntf.msg.id).style.display = 'block';
            //     }                
            // })          
           
            console.log("reste",notifs);
            //currentAppContext.setTabNotifs((notifs));
        });        
    }
          
    return (

        <div> 
            
            <div className= {classes.mainInfosStyle}>
                <div id="notifZone" className={classes.notifZone + " notifFrom"}>
                    {currentAppContext.tabNotifs.map((notif, index)=>{
                        return(
                            <Notification 
                                msg={notif.msg} 
                                notifStyle      = {{marginBottom:"0.3vh"}} 
                                closeNotif      = {(e)=>{closeNotifHandler(e,notif,index)}} 
                                
                                btnStyle        = {classes.buttonStyle}                            
                                btnTextStyle    = {classes.buttonTexStyle}

                                btnClickHandler = {(e)=>{seNotifAsReadHandler(e,notif,index)}}
                            />
                        )
                       
                    })}
                </div>

                {/*<div> 
                    <label className= {getCurrentThemeSideLabel() +' '+ classes.upperCase}> 
                        {t("annee_scolaire")}
                    </label> 
                </div>*/}

                <div id='annee' > 
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'16.3vh',borderColor:getSelectDropDownTextColr()}}>
                        {(optAnnee||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>
                <div id='section'>
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'19.3vh',borderColor:getSelectDropDownTextColr()}}>
                        {(optEtab||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>
                <div id='trimestre'>
                    <select className={classes.comboBoxStyle} style={{color:getSelectDropDownTextColr(), width:'14.3vh',borderColor:getSelectDropDownTextColr()}}>
                        {(optCycle||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <input id="logo_url" type ="hidden"/>
            <canvas id="output" style={{display:'none'}}><img src={DEFAULT_IMAGE_URL}/></canvas>
        </div>
    );
}


export default SideContent;