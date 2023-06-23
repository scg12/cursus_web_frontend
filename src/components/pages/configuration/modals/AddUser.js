import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import { useContext, useState, useEffect } from "react";


function AddUser(props) {
    const currentUiContext = useContext(UiContext);
    const currentAppContext = useContext(AppContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const selectedTheme = currentUiContext.theme;

    let optSexe= [{value:"M",label:"M"},{value:"F",label:"F"}]


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
    function getSelectDropDownTextColr() {
        switch(selectedTheme){
            case 'Theme1': return 'rgb(60, 160, 21)';
            case 'Theme2': return 'rgb(64, 49, 165)';
            case 'Theme3': return 'rgb(209, 30, 90)';
            default: return 'rgb(60, 160, 21)';
        }   
    }

    useEffect(()=> {
        setIsValid(true)

    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function cocheTout(e){
        let id = e.target.id;
        console.log(id)
        let value = e.target.checked;
        id = id.replace("toto","");
        let els = document.querySelectorAll(`[checkbox=checkbox_${id}]`);
        let n = els.length;
        console.log(n);
        console.log(id,value)
        let item = document.getElementById("checkbox_"+id);
        if (item.checked && value)
            for(let i=0;i<n;i++){
                els[i].checked = value
            }
        else
            for(let i=0;i<n;i++){
                els[i].checked = false
            }        
    }

    function handleChange(e){
        var pwd1 = document.getElementById('pwd1').value;
        var pwd2 = document.getElementById('pwd2').value;
        var nom = document.getElementById('nom').value;
        var prenom = document.getElementById('prenom').value;
        if(nom.length > 0) { 
            if(pwd1!='' && pwd2!='')
                if(pwd1===pwd2)
                    setIsValid(true)
                else setIsValid(false)
            else setIsValid(false)
        }else {
            setIsValid(false)
        }
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:'2vh', marginTop:'1vh', fontSize:'1.13vw', fontWeight:'bold', textDecorationLine:'underline', color:'#065386'}}>
                INFORMATIONS GENERALES DE L'UTILISATEUR
            </div>

          

            {props.formMode=='modif'&&
                <div className={classes.inputRowLeft}> 
                    <div className={classes.inputRowLabel}>
                        Utilisateur actif? :  
                    </div>
                        
                    <div> 
                    {props.formMode=='modif'&&currentUiContext.formInputs[14]&&<div><input className={classes.inputRowLeft} type="checkbox" defaultChecked checkbox={"is_active"} id="is_active"/></div>}
                    {props.formMode=='modif'&&currentUiContext.formInputs[14]==false&&<div><input className={classes.inputRowLeft} type="checkbox" checkbox={"is_active"} id="is_active"/></div>}
                    </div>
                </div>
            }

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Login :  
                </div>
                    
                <div> 
                    <input id="login" type="text" className={classes.inputRowControl + ' formInput'} defaultValue={currentUiContext.formInputs[6]} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Password :  
                </div>
                    
                <div> 
                    <input id="pwd1" type="password" defaultValue="aaaa" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Password :  
                </div>
                    
                <div> 
                    <input id="pwd2" type="password" defaultValue="aaaa" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Nom :  
                </div>
                    
                <div> 
                    <input id="nom" type="text" defaultValue={currentUiContext.formInputs[0]} className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Prénom :  
                </div>
                    
                <div> 
                    <input id="prenom" type="text" defaultValue={currentUiContext.formInputs[1]} className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Email :  
                </div>
                    
                <div> 
                    <input id="email" type="text" defaultValue={currentUiContext.formInputs[15]} className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    sexe :  
                </div>
                    
                <div > 
                    {<select className={classes.comboBoxStyle} id='sexe' style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    >
                        {(optSexe||[]).map((option)=> {
                            return(
                                currentUiContext.formInputs[8]==option.value?
                                <option style={{color:'black'}} selected value={option.value}>{option.label}</option>
                                :
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Tel1 :  
                </div>
                    
                <div> 
                    <input id="tel1" type="text" defaultValue={currentUiContext.formInputs[11]}  className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Tel2 :  
                </div>
                    
                <div> 
                    <input id="tel2" type="text" defaultValue={currentUiContext.formInputs[12]} className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Entrée :  
                </div>
                    
                <div> 
                    <input id="date_entree" defaultValue={currentUiContext.formInputs[9]} type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date Sortie :  
                </div>
                    
                <div> 
                    <input id="date_sortie" type="text" defaultValue={currentUiContext.formInputs[10]} className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>

           
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center', marginBottom:'2vh', marginTop:'1vh', fontSize:'1.13vw', fontWeight:'bold', textDecorationLine:'underline', color:'#065386'}}>
                SELECTIONNEZ LES ROLES DE L'UTILISATEUR
            </div>
            

            <div style={{display:"flex", flexDirection:"row", justifyContent:'center',alignItems:'center', alignSelf:'flex-start'}}>
                {
                    currentUiContext.formInputs[5].map((admin,indexAdmin)=>{
                        return(
                        <div style={{display:"flex",flexDirection:"column", marginLeft:'2vw'}}>
            { (()=>{
                    let adminstaffs = currentUiContext.formInputs[5];
                    let id_responsabilites = currentUiContext.formInputs[3].split("²²");
                    let nb = id_responsabilites.length;
                    let responsabilites = [];
                    let clss = [];
                    let item,respo;
                    for(let i=0;i<nb;i++){
                        if (id_responsabilites[i] !=""){
                            item = id_responsabilites[i].split(":")
                            responsabilites.push(item[0])
                            clss.push(","+item[1]+",")
                        }
                    }
                    
                    console.log("responsabilites: ",responsabilites," classes: ",clss)

                    let n = adminstaffs.length;
                    let classes = currentAppContext.infoClasses.filter((classe)=>classe.id_setab == currentAppContext.currentEtab);
                    console.log(classes)
                    let nc = classes.length;
                    let ligne = [],index=-1;
                    if(indexAdmin==0){
                        currentUiContext.formInputs[13] ?
                        ligne.push(
                            <div className={classes.inputRowLeft} key={"key_ens"} style={{}}>
                                <input type="checkbox" checkbox="check" defaultChecked id={"checkbox_ens"}/>
                                <b>Enseignant</b><br /> 
                            </div>
                        )
                        :
                        ligne.push(
                            <div className={classes.inputRowLeft} key={"key_ens"}>
                                <input type="checkbox" checkbox="check" id={"checkbox_ens"}/><b>Enseignant</b><br /> 
                            </div>
                        );
                    }
                    

                    for(let i=indexAdmin;i<=indexAdmin;i++){
                        ligne.push(<div><input type="checkbox" id={"toto"+adminstaffs[i].id} onChange={cocheTout}/>Tous/Aucun
                        </div>);
                        index = -1;
                        if (responsabilites.includes(""+adminstaffs[i].id)){
                            ligne.push(<div className={classes.inputRowLeft} key={"key_lib"+adminstaffs[i].id}>
                            <input type="checkbox" defaultChecked checkbox="check" id={"checkbox_"+adminstaffs[i].id} />
                            <b>{adminstaffs[i].libelle}</b> </div>);
                            index = responsabilites.indexOf(""+adminstaffs[i].id)
                            console.log("index: ",index)
                        }
                        
                        else
                            ligne.push(<div className={classes.inputRowLeft} key={"key_lib"+adminstaffs[i].id}>
                            <input type="checkbox" checkbox="check" id={"checkbox_"+adminstaffs[i].id} />
                            <b>{adminstaffs[i].libelle}</b> </div>);
                       
                            for(let j=0;j<nc;j++){
                                if(index >=0){
                                    // console.log(clss[index],classes[j].id_classe)
                                    if (clss[index].includes(","+classes[j].id_classe+","))
                                        ligne.push(<div className={classes.inputRowLeft} key={"key_lib"+adminstaffs[i].id}>
                                        <input type="checkbox" defaultChecked checkbox={"checkbox_"+adminstaffs[i].id} id={"classe_"+classes[j].id_classe}/>{classes[j].libelle}</div>);
                                    else
                                    ligne.push(<div className={classes.inputRowLeft} key={"key_lib"+adminstaffs[i].id}>
                                        <input type="checkbox" checkbox={"checkbox_"+adminstaffs[i].id} id={"classe_"+classes[j].id_classe}/>{classes[j].libelle}</div>);
                                }
                                else
                                    ligne.push(<div className={classes.inputRowLeft} key={"key_lib"+adminstaffs[i].id}>
                                        <input type="checkbox" checkbox={"checkbox_"+adminstaffs[i].id} id={"classe_"+classes[j].id_classe}/>{classes[j].libelle}</div>);
                                
                            }
                            ligne.push(<br />);

                }

                    return ligne;
                })
                ()}
            </div>);

                    })
                }
            </div>

            
            <input type="hidden" id="idUser" defaultValue={currentUiContext.formInputs[2]}/>
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
 export default AddUser;
 