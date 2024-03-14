import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from "../../../../store/AppContext";
import {formatCurrency} from "../../../../store/SharedData/UtilFonctions";
import { useContext, useState, useEffect } from "react";

var  payement_data = [];

function AddPayementEleve(props) {
    const currentUiContext            = useContext(UiContext);
    const currentAppContext           = useContext(AppContext);
    const [isValid, setIsValid]       = useState(props.formMode=='modif');
    const [optCycle, setOptCycle]     = useState([]);
    const [optNiveau, setOptNiveau]   = useState([]);
    const [optClasse, setOptClasse]   = useState([]);
    const [tabTranches, setTabTranches] = useState([]);
    const selectedTheme = currentUiContext.theme;

    let cycleSelected = "all";
    let niveauSelected = "all";

    function getButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_Btnstyle ;
        case 'Theme2': return classes.Theme2_Btnstyle ;
        case 'Theme3': return classes.Theme3_Btnstyle ;
        default: return classes.Theme1_Btnstyle ;
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
    function getSmallButtonStyle()
    { // Choix du theme courant
      switch(selectedTheme){
        case 'Theme1': return classes.Theme1_BtnstyleSmall ;
        case 'Theme2': return classes.Theme2_BtnstyleSmall ;
        case 'Theme3': return classes.Theme3_BtnstyleSmall ;
        default: return classes.Theme1_BtnstyleSmall ;
      }
    }

    function createOption(tabOption,idField, labelField){
        var newTab=[];
        newTab.push({value:"all",label:"__All__"})
        for(var i=0; i< tabOption.length; i++){
            var obj={
                value: tabOption[i][idField],
                label: tabOption[i][labelField]
            }
            newTab.push(obj);
        }
        return newTab;
    }

    useEffect(()=> {
        //setOptCycle(createOption(currentAppContext.infoCycles.filter((cycle)=>cycle.id_setab == currentAppContext.currentEtab),'id_cycle','libelle')); 

        let infos = currentUiContext.formInputs[1].split("²²");
        let n = infos.length
        let tabPaiement = [];  

        for(let i=0;i<n;i++){
            let items = infos[i].split(",")
            let payment = {};
           
            payment.libelle  = items[1];
            payment.montant  = items[2];
            payment.date_deb = items[4];
            payment.date_fin = items[5]
            payment.etat     = 1;

            tabPaiement.push(payment);
        }
        
        setTabTranches(tabPaiement);

    },[])

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function handleChange(e){
        var payement;
       
        payement = (document.getElementById('libelle').value != undefined) ? document.getElementById('libelle').value.trim() : putToEmptyStringIfUndefined(document.getElementById('libelle').defaultValue).trim;        
        if(payement.length == 0) { 
            setIsValid(false)
        } else {
            setIsValid(true)
        }
    }
    function dropDownCycleChangeHandler(e){
        // document.getElementById('idCycleSelected').value = e.target.value;
        // cycleSelected = e.target.value;
        if ( e.target.value == "all"){
            setOptNiveau([]);
            setOptClasse([]);
        }
        else{
            setOptNiveau(createOption(currentAppContext.infoNiveaux.filter((niv)=>niv.id_cycle == e.target.value),'id_niveau','libelle')); 
        // document.getElementById("idNiveauSelected").value = document.getElementById("niveau").value
            // var s_value = createOption(currentAppContext.infoNiveaux.filter((niv)=>niv.id_cycle == document.getElementById("id_niveau").value),'id_niveau','libelle')
            setOptClasse([{value:"all",label:"__All__"}]); 
            // setOptClasse(s_value); 

        }
      }
      function dropDownNiveauChangeHandler(e){
        // document.getElementById('idNiveauSelected').value = e.target.value;
        // niveauSelected = e.target.value;
        if ( e.target.value == "all")
            setOptClasse([])
        else{
            setOptClasse(createOption(currentAppContext.infoClasses.filter((classe)=>classe.id_niveau == e.target.value),'id_classe','libelle')); 
            // document.getElementById("idClasseSelected").value = createOption(currentAppContext.infoClasses.filter((classe)=>classe.id_niveau == e.target.value),'id_classe','libelle')[0].value;
        }
      }

      function dropDownClasseChangeHandler(e){
        // console.log(e)
        // document.getElementById("idClasseSelected").value = e.target.value
      }

      function addTranchePaiement(){

      }

      function removeTranchePaiement(){

      }

        function addParticipantRow(){
            payement_data = [...tabTranches];
            var index = payement_data.findIndex((elt)=>elt.value==0);
            if (index <0){            
                payement_data.push({libelle:'', montant:'0', date_deb:'', date_fin:'', etat:0});
                setTabTranches(payement_data);
                console.log(payement_data);
            } 
        }

        function moveOnMax(e,currentField, nextField){
            if(nextField!=null){
                e = e || window.event;
                if(e.keyCode != 9){
                    if(currentField.value.length >= currentField.maxLength){
                        nextField.focus();
                    }
                }
            }
         
        }

      

    /************************************ JSX Code ************************************/
    const LignePayementHeader=(props)=>{
        return(
            <div style={{display:'flex', flexDirection:"row", color:'white', backgroundColor:'rgb(6, 83, 134)', flexDirection:'row', height:'3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw'}}>{"Libelle"}</div>
                <div style={{width:'11.3vw'}}>{"montant"}</div>
                <div style={{width:'11.3vw'}}>{"Date Debut"}</div> 
                <div style={{width:'11.3vw'}}>{"Date Fin"}</div>
                <div style={{width:'7vw', marginLeft:'1.7vw'}}>{"action"}</div>
            </div>
        );
    }

    const LignePayement=(props)=>{
        return(
            <div style={{display:'flex',  flexDirection:"row", color: props.isHeader ?'white':'black', backgroundColor: props.isHeader ?'rgb(6, 83, 134)':'white', flexDirection:'row', height: props.isHeader ?'3vh':'4.3vh', width:'40vw', fontSize:'0.87vw', alignItems:'center', borderBottomStyle:'solid', borderBottomWidth:'1px', borderBottomColor:'black', borderTopStyle:'solid', borderTopWidth:'1px', borderTopColor:'black'}}>
                <div style={{width:'17vw', fontWeight:"800"}}>
                    {(props.payement.etat > 0) ? 
                        props.payement.libelle
                        :
                        <input type="text" style={{width:"10vw", fontWeight:"800", fontSize:"0.8vw", border:"solid 1px black", height:"3vh", borderRadius:"3px", margin:"auto",marginTop:"0.37vh"}}/>
                    }                                          
                </div>
                
                <div style={{width:'11.3vw'}}>
                    {(props.payement.etat > 0) ? 
                        formatCurrency(Math.abs(props.payement.montant))
                        :
                        <input type="number" style={{width:"5vw", fontSize:"0.87vw",border:"solid 1px black", height:"3vh", borderRadius:"3px", margin:"auto",marginTop:"0.37vh", marginLeft:"-0.7vw"}}/>
                    }         
                </div>

                <div style={{width:'11.3vw'}}>
                    {(props.payement.etat > 0) ? 
                        props.payement.date_deb
                        :
                        <div style ={{display:'flex', flexDirection:'row', marginLeft:"2vw", marginTop:"1.7vh"}}> 
                            <input id="jour1"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour1"), document.getElementById("mois1"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw'}} /><div style={{marginTop:"0.7vh"}}>/</div>
                            <input id="mois1"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois1"), document.getElementById("anne1"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', textAlign:"center",}}  /><div style={{marginTop:"0.7vh"}}>/</div>
                            <input id="anne1"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne1"), document.getElementById("jour2"))}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}  />
                        </div>
                    }
                </div>

                <div style={{width:'11.3vw'}}>
                    {(props.payement.etat > 0) ? 
                        props.payement.date_fin
                        :
                        <div style ={{display:'flex', flexDirection:'row', marginLeft:"2vw", marginTop:"1.7vh"}}> 
                            <input id="jour2"   type="text"    Placeholder=' jj'   onKeyUp={(e)=>{moveOnMax(e,document.getElementById("jour2"), document.getElementById("mois2"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.3vw', fontSize:'1vw', height:'1.3vw', marginLeft:'-2vw'}} /><div style={{marginTop:"0.7vh"}}>/</div>
                            <input id="mois2"   type="text"    Placeholder='mm'    onKeyUp={(e)=>{moveOnMax(e,document.getElementById("mois2"), document.getElementById("anne2"))}}      maxLength={2}     className={classes.inputRowControl }  style={{width:'1.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw', textAlign:"center",}}  /><div style={{marginTop:"0.7vh"}}>/</div>
                            <input id="anne2"   type="text"    Placeholder='aaaa'  onKeyUp={(e)=>{moveOnMax(e,document.getElementById("anne2"), null)}}     maxLength={4}     className={classes.inputRowControl }  style={{width:'2.7vw', fontSize:'1vw', height:'1.3vw', marginLeft:'0vw'}}  />
                        </div>
                    }
                </div>
              
                <div style={{width:'7vw', marginLeft:'1.7vw', display:'flex', flexDirection:'row'}}> 
                    {(props.payement.etat>0) &&
                        <img src="images/cancel_trans.png"  
                            id={props.participantId}
                            width={25} 
                            height={33} 
                            className={classes.cellPointer} 
                            onClick={addTranchePaiement}                         
                            alt=''
                        />
                    }

                    {(props.payement.etat<=0) &&
                        <img src="images/checkp_trans.png"  
                            width={19} 
                            height={19} 
                            className={classes.cellPointer} 
                            onClick={removeTranchePaiement}                         
                            alt=''
                            style={{marginLeft:'0.3vw', marginTop:'0.3vh'}}
                        />
                    }
                </div>

            </div>
        );
    }

    return (
        props.formMode=='modif'?
        <div className={classes.formStyle}>
            <div id='errMsgPlaceHolder'/> 

            <CustomButton
                btnText={"Ajouter"} 
                buttonStyle={getSmallButtonStyle()}
                style={{marginBottom:'2vh', alignSelf:"flex-end"}}
                btnTextStyle = {classes.btnSmallTextStyle}
                btnClickHandler={()=>{addParticipantRow()}}
            />    

            {/* { (()=>{
                    let infos = currentUiContext.formInputs[1].split("²²");
                    let n = infos.length
                    let ligne = [];

                    ligne.push(<LignePayementHeader/>);

                    for(let i=0;i<n;i++){
                        let items = infos[i].split(",")

                        let payment = {};

                        payment.libelle  = items[1];
                        payment.montant  = items[2];
                        payment.date_deb = items[4];
                        payment.date_fin = items[5]
                        payment.etat     = 1
                        ligne.push(<LignePayement payement={payment}/>)

                        // ligne.push(<div key={"key_lib"+items[0]}><label>Libelle:</label>&nbsp;<input libelle="lib" id={"libelle_"+items[0]} type="text" defaultValue={items[1]}/>
                        // <input type="checkbox" checkbox="check" id={"checkbox_"+items[0]}/> Supprimer</div>);
                        // ligne.push(<div key={"key_montant"+items[0]}><label>montant:</label>&nbsp;<input montant="montant" type="text" id={"montant_"+items[0]} defaultValue={items[2]}/></div>);
                        // ligne.push(<div key={"key_deb"+items[0]}><label>Date Debut:</label>&nbsp;<input deb="deb" type="text" id={"deb_"+items[0]} defaultValue={items[4]}/></div>);
                        // ligne.push(<div key={"key_fin"+items[0]}><label>Date Fin:</label>&nbsp;<input fin="fin" type="text" id={"fin_"+items[0]} defaultValue={items[5]}/></div>);
                    }


                    return ligne;
                })
                ()}*/ }
            
            <LignePayementHeader/>
            
            { tabTranches.map((tranch)=>{
                return <LignePayement payement={tranch}/>
            })}
            
            <div>
                <input id="idClasse" type="hidden"  defaultValue={currentUiContext.formInputs[2]}/>
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
        :
        <div className={classes.formStyle}>
        <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Cycle :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 
                    {<select className={classes.comboBoxStyle} id="id_cycle" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownCycleChangeHandler}
                    >  
                        {/* <option style={{color:'black'}} value="all" selected >__All__</option> */}
                        {                        
                        (optCycle||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>}
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Niveau :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 

                    {<select className={classes.comboBoxStyle} id="id_niveau" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownNiveauChangeHandler}
                    >  
                        {                        
                        (optNiveau||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                        
                    </select>}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Classe :  
                </div>
                <div style={{marginBottom:'1.3vh'}}> 

                    {<select className={classes.comboBoxStyle} id="id_classe" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                    onChange={dropDownClasseChangeHandler}
                    >  
                        {                        
                        (optClasse||[]).map((option)=> {
                            return(
                                <option style={{color:'black'}} value={option.value}>{option.label}</option>
                            );
                        })}
                        
                    </select>}
                </div>
            </div>

            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Libelle :  
                </div>
                    
                <div> 
                    <input id="libelle" type="text" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Montant :  
                </div>
                    
                <div> 
                    <input id="montant" type="number" min="0" defaultValue="0" className={classes.inputRowControl + ' formInput'} onChange={handleChange} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date début payement :  
                </div>
                    
                <div> 
                    <input id="date_deb" type="text" className={classes.inputRowControl + ' formInput'} />
                </div>
            </div>
            <div className={classes.inputRowLeft}> 
                <div className={classes.inputRowLabel}>
                    Date fin payement :  
                </div>
                    
                <div> 
                    <input id="date_fin" type="text" className={classes.inputRowControl + ' formInput'} />
                </div>
            </div>

            {/* <input id="idCycleSelected" type="text"  defaultValue="all"/>
            <input id="idNiveauSelected" type="text"  defaultValue="all"/>
            <input id="idClasseSelected" type="text"  defaultValue="all"/> */}

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
 export default AddPayementEleve;
 