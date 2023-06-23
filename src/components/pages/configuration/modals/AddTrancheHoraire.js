import React from 'react';
import classes from "../subPages/SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import { useContext, useState, useEffect } from "react";


function AddTrancheHoraire(props) {
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(props.formMode=='modif');
    const [opt, setOpt] = useState([]);
    // const [rerender, setRerender] = useState();
    // const [afterRender, setAfterRender] = useState();
    const [hasChanged, sethasChanged] = useState([0]);
    // const [heures, setHeures] = useState((currentUiContext.formInputs[7]).split(','));
    const selectedTheme = currentUiContext.theme;   

    let n = (currentUiContext.formInputs[1].split(",")).length?currentUiContext.formInputs[1]!=undefined:0;
    // let n =0;
    let n_tranches_ajoutees = 0;
    let last_item_id ="";
    let heure_list = [];
    let type_tranches_list = [];
    let id_tranches_list = [];
    let duree_periodes_list = [];
    let duree_periode = currentUiContext.formInputs[6];
    let ligne = [];
    let cpte_pause = 0;
    let cpte_tr = 0;



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

    function createOption(tabOption,idField,idField2, labelField){
        var newTab=[];
        for(var i=0; i< tabOption.length; i++){
            var obj={
                value: tabOption[i][idField]+"_"+tabOption[i][idField2],
                label: tabOption[i][labelField]+":"+tabOption[i][idField2],
            }
            newTab.push(obj);
        }
        return newTab;
    }
    function addMinutes(time, minsToadd){
        function D(J){return (J<10?'0' :'')+J;}
        var piece = time.split("h");
        var mins = piece[0]*60 + +piece[1] + +minsToadd;

        return D(mins%(24*60)/60 | 0) + 'h' + D(mins%60);
    }

    useEffect(()=> { console.log("heure_list: ",heure_list.length)
        // if (!afterRender) return;
        setOpt(createOption(currentUiContext.formInputs[5],'id','duree','libelle'));
    

        // setAfterRender(false)
        // document.addEventListener('DOMContentLoaded', function(){
        //     var el=document.createElement('input');
        //     el.type ='text';
        //     el.id = 'type_tranches_list';
        //     el.value = "type_tranches_list";
            
        //     var containeur = document.getElementById('contenu');
        //     containeur.appendChild(el);
        // },false)

    },[])
    // },[afterRender])

    // useEffect(()=>{
    //     setAfterRender(true)
    // },[rerender]);
    // return {
    //     setRerender
    // }

    /************************************ Handlers ************************************/
   
    function putToEmptyStringIfUndefined(chaine){
        if (chaine==undefined) return '';
        else return chaine;
    }

    function ajouterTranche(){
        let heure_deb;
        let heure_next;
        let innerText;

        // if (hasChanged==2){
        //     heure_list = [];
        //     // heure_list.push(addMinutes(currentUiContext.formInputs[9],'00'));
        //     // document.getElementById('heure_list').value = heure_list;
        // }

        if (heure_list.length ==0){
            heure_deb = addMinutes(currentUiContext.formInputs[9],'00')
            heure_next = addMinutes(heure_deb, duree_periode)
            heure_list.push(heure_deb)
            console.log("debut: ",heure_deb)
        }
        else{
            heure_deb = heure_list[heure_list.length - 1]
            heure_next = addMinutes(heure_deb, duree_periode)
            console.log("suite: ",heure_deb, "__ ",heure_list)
        }

        id_tranches_list.push("-1"); //-1 pr dire q c'est une tranche à créer qui n'a pas encore d'id en bd
        type_tranches_list.push("0");
        innerText="Tranche"+(cpte_tr+1)+"     "+heure_deb+"   ----    "+heure_next;
        cpte_tr++;
        heure_list.push(heure_next)


        let parent = document.getElementById('contenu');
        let child = document.createElement('h6')
        child.textContent = innerText
        parent.appendChild(child)

        console.log("List: ",heure_list)
        document.getElementById('type_tranches_list').value = type_tranches_list;
        document.getElementById('id_tranches_list').value = id_tranches_list;
        document.getElementById('heure_list').value = heure_list;
        // sethasChanged(1);
    }
    function ajouterPause(){
        let item = document.getElementById('id_pause').value;
        let id_pause = item.split("_")[0];
        let duree = item.split("_")[1];
        console.log(item)

        let heure_deb;
        let heure_next;
        let innerText;
        if (heure_list.length ==0){
            heure_deb = addMinutes(currentUiContext.formInputs[9],'00')
            heure_next = addMinutes(heure_deb, duree)
            heure_list.push(heure_deb)

        }
        else{
            heure_deb = heure_list[heure_list.length - 1]
            heure_next = addMinutes(heure_deb, duree)
        }

        id_tranches_list.push(id_pause); 
        type_tranches_list.push("1");
        innerText="Pause"+(cpte_pause+1)+"     "+heure_deb+"   ----    "+heure_next;
        cpte_pause++;
        heure_list.push(heure_next)


        let parent = document.getElementById('contenu');
        let child = document.createElement('h6')
        child.textContent = innerText
        parent.appendChild(child)

        document.getElementById('type_tranches_list').value = type_tranches_list;
        document.getElementById('id_tranches_list').value = id_tranches_list;
        document.getElementById('heure_list').value = heure_list;
        // sethasChanged(1);
    }
    function enleverTranche(){
        let child = document.querySelector("h6:last-child");
        let item ,t_tranche;
        console.log(child!==null)
        // if(id_tranches_list.length>0 && hasChanged!=2){
        if (child !==null){
            heure_list.pop();
            item= id_tranches_list.pop();
            t_tranche = type_tranches_list.pop();
            if (item !== undefined){
                if (t_tranche =="0"){
                    cpte_tr--
                }
                else{
                    cpte_pause--
                }
            child.parentElement.removeChild(child)
            console.log("item: ",item)
            document.getElementById('type_tranches_list').value = type_tranches_list;
            document.getElementById('id_tranches_list').value = id_tranches_list;
            document.getElementById('heure_list').value = heure_list;
            }
            // child.parentElement.removeChild(child)
            // if (document.querySelector("h6:last-child")!==null)
            //     sethasChanged(1);
            // else 
            // {
            //     cpte_pause = 0;
            //     cpte_tr = 0
            //     document.getElementById('type_tranches_list').value = "";
            //     document.getElementById('id_tranches_list').value = "";
            //     document.getElementById('heure_list').value = addMinutes(currentUiContext.formInputs[9],'00');
            //     // setHeures([]);
            //     // sethasChanged(2);

            // }

            // if (child !==null){
            //     sethasChanged(1);
            // }
            // else sethasChanged(2);
        }
        // else{
        //     document.getElementById('type_tranches_list').value = "";
        //     document.getElementById('id_tranches_list').value = "";
        //     document.getElementById('heure_list').value = addMinutes(currentUiContext.formInputs[9],'00');
        //     cpte_pause = 0;
        //     cpte_tr = 0
        //     sethasChanged(2);
        // }

        // document.getElementById('type_tranches_list').value = type_tranches_list;
        // document.getElementById('id_tranches_list').value = id_tranches_list;
        // document.getElementById('heure_list').value = heure_list;
    }
    function dropDownPauseChangeHandler(e){
        console.log(e);
    }

    /************************************ JSX Code ************************************/

    return (
        <div className={classes.formStyle}>
            <div className={classes.inputRowLabel}>                   
                    <h5 id="libelle">{currentUiContext.formInputs[0]}</h5>
            </div>
                <div className={classes.buttonRow}>
                    <CustomButton
                        btnText='  +Tranche  ' 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={ajouterTranche}
                    />
                    <CustomButton
                        btnText='  +Pause  ' 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={ajouterPause}
                    />
                    {<select className={classes.comboBoxStyle} id="id_pause" style={{color:getSelectDropDownTextColr(), width:'9.3vw',borderColor:getSelectDropDownTextColr()}}
                        onChange={dropDownPauseChangeHandler}
                        >  
                            {                        
                            (opt||[]).map((option)=> {
                                return(
                                    <option key={option.value} style={{color:'black'}} value={option.value}>{option.label}</option>
                                );
                            })}
                    </select>}
                   
                    <CustomButton
                        btnText='-Last' 
                        buttonStyle={getButtonStyle()}
                        btnTextStyle = {classes.btnTextStyle}
                        btnClickHandler={enleverTranche}
                    />
                </div>
            <div id="contenu">
            { (()=>{
                    let h_debs = (currentUiContext.formInputs[7]).split(',')
                    let h_fins = (currentUiContext.formInputs[8]).split(',')
                    let t_tranches = (currentUiContext.formInputs[4]).split(',')
                    let id_tranches = (currentUiContext.formInputs[1]).split(',')
                    let ligne = []
                    duree_periode = currentUiContext.formInputs[6]
            
                    console.log(currentUiContext.formInputs[7],h_debs.length,h_debs)
                    if (h_debs.length >0 && h_debs!=''){
                        var nbre = h_debs.length ;
                        var innerText="";
            
                        let parent = document.getElementById('contenu');
                        let child;
            
                        for(let i=0;i<nbre;i++){
                            console.log(t_tranches[i],h_debs.length)
                            
                            if(t_tranches[i]==0){  // C'est une tranche
                                type_tranches_list.push("0");
                                id_tranches_list.push(id_tranches[i]);
                                innerText="Tranche"+(cpte_tr+1)+"     "+h_debs[i]+"   ----    "+h_fins[i];
                                cpte_tr++;
                                console.log("ici")
                            }
                            else{
                                type_tranches_list.push("1");
                                id_tranches_list.push(t_tranches[i]);
                                innerText="Pause"+(cpte_pause+1)+"     "+h_debs[i]+"   ----    "+h_fins[i];
                                cpte_pause++;
                            }
                            if(i==0){

                                heure_list.push(h_debs[i]);
                                heure_list.push(h_fins[i]);
                            }
                            else
                            heure_list.push(h_fins[i]);
                            
                            ligne.push(<h6 key={"key_"+i}>{innerText}</h6>)
                        }
                        
                        // document.getElementById('type_tranches_list').value = type_tranches_list;
                        // document.getElementById('id_tranches_list').value = id_tranches_list;
                        // document.getElementById('heure_list').value = heure_list;
                    }
                    return ligne;
                    // else{
                    //     let heure_debut_cours_jour = currentUiContext.formInputs[9]
                    //     heure_list.push(heure_debut_cours_jour)
                    // }
                })
                ()}
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

                <input id="idJour" type="hidden"  value={currentUiContext.formInputs[2]}/>
                <input id="a_change" type="text"  value={hasChanged}/>
                <input id="heure_list" type="text" /> <br />
                <input id="type_tranches_list" type="text" /><br />
                <input id="id_tranches_list" type="text" />


        </div>
       
     );
 }
 export default AddTrancheHoraire;
 