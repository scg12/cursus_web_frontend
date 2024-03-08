import React from 'react';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import UiContext from "../../../../store/UiContext";
import AppContext from '../../../../store/AppContext';
import { useContext, useState, useEffect } from "react";
import axiosInstance from '../../../../axios';
import MsgBox from '../../../msgBox/MsgBox';
import BackDrop from "../../../backDrop/BackDrop";
import { alpha, styled } from '@mui/material/styles';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {convertDateToUsualDate,ajouteZeroAuCasOu} from '../../../../store/SharedData/UtilFonctions';
import { useTranslation } from "react-i18next";



var cur_coursId = undefined;

let CURRENT_CLASSE_ID;
let CURRRENT_COURS_ID;

var ELEVES_ABSENTS='';
var LISTE_COURS=[];

var listElt ={
    rang:1, 
    presence:1, 
    matricule:"", 
    nom: '', 
    date_naissance: '', 
    lieu_naissance:'', 
    date_entree:'', 
    nom_pere: '',  
    redouble: '',  
    id:1,
}

var chosenMsgBox;
const MSG_SUCCESS_APPEL =11;
const MSG_WARNING_APPEL =12;
const MSG_ERROR_APPEL   =13;


function Appel(props) {

    const { t, i18n } = useTranslation();
    const currentUiContext = useContext(UiContext);
    const currentAppContext= useContext(AppContext);

    const selectedTheme = currentUiContext.theme;
    const [isValid, setIsValid] = useState(false);
    const [gridRows, setGridRows] = useState([]);
    const [present, setPresent]= useState(0);
    const [absent, setAbsent]= useState(0);
    const [modalOpen, setModalOpen] = useState(0); //0 = close, 1=creation, 2=modif
    
    const [optClasse, setOpClasse] = useState([]);
    const [optCours, setOptCours] = useState([]);
    

    useEffect(()=> {
        currentUiContext.setIsParentMsgBox(false);

        if(gridRows.length ==0){
            CURRENT_CLASSE_ID = undefined;
        }    
        getEtabListClasses();  
        getCoursClasse(currentAppContext.currentEtab, 0);  
        console.log(currentUiContext.emploiDeTemps);
        console.log(currentAppContext.infoUser);
       
      
    },[]);

    const getEtabListClasses=()=>{
        var tempTable=[{value: '0',      label:'Choisir une classe'    }]
        let classes = currentAppContext.infoClasses.filter(classe=>classe.id_setab == currentAppContext.currentEtab);
        console.log(classes)
        let classes_user;
        if(currentAppContext.infoUser.is_prof_only) 
            classes_user = currentAppContext.infoUser.prof_classes;
        else{
            classes_user = currentAppContext.infoUser.admin_classes;
            let prof_classes = currentAppContext.infoUser.prof_classes;
            // console.log(pp_classes)
            prof_classes.forEach(classe => {
                if((classes_user.filter( cl => cl.id === classe.id)).length<=0)
                    classes_user.push({"id":classe.id,"libelle":classe.libelle})

            });
        }

        let n = classes_user.length;
        let m = classes.length;
        let i = 0;
        let j = 0;
       while(i<n){
        j = 0;
        while(j<m){
            if(classes_user[i].id==classes[j].id_classe){
                tempTable.push({value:classes_user[i].id, label:classes_user[i].libelle})
                break;
            }
            j++;
        }
        i++;
       }
           
        setOpClasse(tempTable); 
    }

    const  getClassStudentList=(classId)=>{
        var listEleves = []
        axiosInstance.post(`list-eleves/`, {
            id_classe: classId,
        }).then((res)=>{
            console.log(res.data);
            listEleves = [...formatList(res.data)]
            console.log(listEleves);
            setGridRows(listEleves);
            setPresent(listEleves.length)
            console.log(gridRows);
        })  
        return listEleves;     
    }

    function getCoursClasse(sousEtabId, classeId){
        var tempTable=[{value: 0,      label: (i18n.language=='fr') ? '  ----- Choisir un cours ----- ' : ' ------ Select course ------ '  }]
        LISTE_COURS = [];    
       
        if(classeId!=0){
            if(currentAppContext.infoUser.is_prof_only)
                LISTE_COURS = currentAppContext.infoUser.prof_cours.filter(cours=>cours.id_classe == classeId)
            else
                LISTE_COURS = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)


                LISTE_COURS.map((cours)=>{
                tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
                }) 
            // LISTE_COURS = currentAppContext.infoCours.filter((cours)=>cours.id_setab==sousEtabId && cours.id_classe == classeId)
            // LISTE_COURS.map((cours)=>{
            //     tempTable.push({value:cours.id_cours, label:cours.libelle_cours});
            // })
        }       
        
        console.log('cours',LISTE_COURS,tempTable);
        setOptCours(tempTable);
        
        if( document.getElementById('optCours').options[0]!= undefined)
        document.getElementById('optCours').options[0].selected=true;     
    }

    function classeChangeHandler(e){  
        currentUiContext.setIsParentMsgBox(false);     
        if(e.target.value != optClasse[0].value){
            CURRENT_CLASSE_ID = e.target.value;
            getCoursClasse(currentAppContext.currentEtab, CURRENT_CLASSE_ID);
        }else{
            CURRENT_CLASSE_ID = undefined;
            getCoursClasse(currentAppContext.currentEtab, 0);
        }
    }

    function coursChangeHandler(e){
        if(e.target.value != optCours[0].value){
            CURRRENT_COURS_ID = e.target.value;
            var grdRows = getClassStudentList(CURRENT_CLASSE_ID);
            var presents =  getPresentCount(grdRows);
            var absents = getAbsentCount(grdRows);
            
            //Obtenir les differents jour du cours en question et verifier que le jour actuel en fait parti
            var listeCoursdays = getCourseDays(CURRENT_CLASSE_ID, CURRRENT_COURS_ID);

            //Obtenir le numero du jour correspondant a cette date
            var todayNumber = getTodayNumber()
           
            
            if(listeCoursdays.includes(todayNumber)){
                setGridRows(grdRows);
                setPresent(presents);
                setAbsent(absents);

            }else{
                chosenMsgBox = MSG_WARNING_APPEL;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("error_M"), 
                    message:t("day_not_matching")
                }) 
            }
            
        } else {
            document.getElementById('optClasse').options[0].selected=true;
            CURRRENT_COURS_ID = undefined;
            setGridRows([]);
            setPresent(0);
            setAbsent(0); 
        }

    }

    const formatList=(list) =>{
        var rang = 1;
        var formattedList =[]
        list.map((elt)=>{
            listElt={};
            listElt.id = elt.id;
            listElt.nom  = elt.nom +' '+elt.prenom;
            listElt.rang = ajouteZeroAuCasOu(rang); 
            listElt.presence = 1; 
            listElt.matricule = elt.matricule;
            listElt.date_naissance = convertDateToUsualDate(elt.date_naissance);
            listElt.lieu_naissance = elt.lieu_naissance;
            listElt.date_entree = convertDateToUsualDate(elt.date_entree);
            listElt.nom_pere = elt.nom_pere;
            listElt.redouble = (elt.redouble == false) ? "nouveau" : "Redoublant"; 
            formattedList.push(listElt);
            rang ++;

        })
        return formattedList;
    }
    
/*************************** DataGrid Declaration ***************************/    
    const columns = [
        {
            field: 'rang',
            headerName: 'N°',
            width: 33,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'presence',
            headerName: t('present')+'?',
            width: 80,
            editable: false,
            headerClassName:classes.GridColumnStyle,
           
            renderCell: (params)=>{
                return(
                    (params.value == 1)?
                    <div className={classes.inputRow}>
                        <img src="images/check_trans.png"  
                            width={17} 
                            height={13} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                    </div>
                    :
                    <div className={classes.inputRow} >
                        <img src="images/delete.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            onClick={(event)=> {
                                event.ignore = true;
                            }}
                            alt=''
                        />
                    </div>

                    
                )
            }         
        },
       
        {
            field: 'matricule',
            headerName: t('matricule_short_M'),
            width: 100,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'nom',
            headerName: t('displayedName_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_naissance',
            headerName: t('form_dateNaiss_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'lieu_naissance',
            headerName: t('form_lieuNaiss_M'),
            width: 120,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },
        {
            field: 'date_entree',
            headerName: t('date_entree_M'),
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },
        {
            field: 'nom_pere',
            headerName: t('nom_parent_M'),
            width: 200,
            editable: false,
            headerClassName:classes.GridColumnStyle
        },

        {
            field: 'redouble',
            headerName: 'SITUATION',
            width: 110,
            editable: false,
            headerClassName:classes.GridColumnStyle,
                
        },

        {
            field: 'id',
            headerName: '',
            width: 15,
            editable: false,
            headerClassName:classes.GridColumnStyle,
            hide:(props.formMode=='ajout')? false : true,
            renderCell: (params)=>{
                return(
                    <div className={classes.inputRow}>
                        <img src="icons/baseline_delete.png"  
                            width={17} 
                            height={17} 
                            className={classes.cellPointer} 
                            //onClick={deleteRow}
                            alt=''
                        />
                    </div>
                );
                
            }
        },
    ];

/*************************** Theme Functions ***************************/
    function getGridButtonStyle()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P ;
            case 'Theme2': return classes.Theme2_gridBtnstyle + ' '+ classes.margRight5P;
            case 'Theme3': return classes.Theme3_gridBtnstyle + ' '+ classes.margRight5P;
            default: return classes.Theme1_gridBtnstyle + ' '+ classes.margRight5P;
        }
    }
    
/*************************** Handler functions ***************************/
    function consultRowData(row){
        var inputs=[];

        inputs[0]= row.nom;
        inputs[1]= row.prenom;
        inputs[2]= row.date_naissance;
        inputs[3]= row.lieu_naissance;
        inputs[4]= row.etab_origine;

        inputs[5]= row.nom_pere;
        inputs[6]= row.email_pere;
        inputs[7]= row.tel_pere;

        inputs[8]= row.nom_mere;
        inputs[9]= row.email_mere;
        inputs[10]= row.tel_mere;

        inputs[11]= row.matricule;
     
        currentUiContext.setFormInputs(inputs)
        setModalOpen(3);
    }   
    
    function quitForm() {
        setModalOpen(0)
    }


    function getTrancheHoraires(classeId, coursId, numeroJour){
        var liste_tranches = [];
        var cours = LISTE_COURS.find((cours)=>(cours.id_cours == coursId && cours.id_classe == classeId));
        var idMatiere = (cours != undefined) ? cours.id_matiere : '';
        if(idMatiere!=''){
            var ETMatiereJour = currentUiContext.emploiDeTemps.filter((em)=>em.id_classe == classeId && em.id_matiere == idMatiere && em.id_jour == numeroJour)
            if(ETMatiereJour.length>0){
                ETMatiereJour.map((empt)=>liste_tranches.push(empt.id_tranche))
            }
        }
        return liste_tranches
    }

    function getCourseDays(classeId,coursId){
        console.log("ET",currentUiContext.emploiDeTemps);
        var liste_jour_cours =[];
        var cours = LISTE_COURS.find((cours)=>(cours.id_cours == coursId && cours.id_classe == classeId));
        
        var idMatiere = (cours != undefined) ? cours.id_matiere : '';
        
        if(idMatiere!=''){
            var ETCoursJour = currentUiContext.emploiDeTemps.filter((em)=>em.id_classe == classeId && em.id_matiere == idMatiere)
           
            if(ETCoursJour.length>0){
                ETCoursJour.map((empt)=>liste_jour_cours.push(empt.id_jour))
            }
        }
        return liste_jour_cours;
    }

    function getTodaysDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2,'0');
        var mm = String(today.getMonth()+1).padStart(2,'0');
        var yyyy = today.getFullYear();
        today = yyyy+'-'+mm+'-'+dd;
        
        return today; 
    }

    function getTodayNumber(){
        return new Date().getDay();
    }

    function getTodayCurrentHours(){
        var today = new Date();
        var time = today.getHours()+"h"+ today.getMinutes();
    }

    

    

    function savePresenceHandler(e){
        currentUiContext.setIsParentMsgBox(false);
        console.log("absents",ELEVES_ABSENTS);
        //Obtenir la date d'aujourd'hui
        var todayDate = getTodaysDate();
        //Obtenir le numero du jour correspondant a cette date
        var todayNumber = getTodayNumber()
        
        //Obtenir les tranches a partir de l'ET de la classe pour le jour et la classe et le cours
        var tranchesHoraires =  getTrancheHoraires(CURRENT_CLASSE_ID, CURRRENT_COURS_ID, todayNumber)

        //Obtenir les differents jour du cours en question et verifier que le jour actuel en fait parti
        var listeCoursdays = getCourseDays(CURRENT_CLASSE_ID, CURRRENT_COURS_ID);

        console.log("absents",ELEVES_ABSENTS, todayNumber, tranchesHoraires, listeCoursdays);
        console.log("date",LISTE_COURS,CURRRENT_COURS_ID, CURRENT_CLASSE_ID);
        
        if(listeCoursdays.includes(todayNumber)){
        
            axiosInstance.post(`save-appel/`, {
                date1       : todayDate,
                id_classe   : CURRENT_CLASSE_ID,
                id_cours    : CURRRENT_COURS_ID,
                id_eleves   : ELEVES_ABSENTS,
                id_etab     : currentAppContext.currentEtab,
                numero_jour : todayNumber,
                id_tranches : tranchesHoraires.join('_'),
                id_user     : currentAppContext.idUser
    
            }).then((res)=>{   
                //setModalOpen(3);
                console.log("status",res.status); 
               
                chosenMsgBox = MSG_SUCCESS_APPEL;
                currentUiContext.showMsgBox({
                    visible:true, 
                    msgType:"info", 
                    msgTitle:t("success_operation_M"), 
                    message:t("success_operation")
                })     
                          
            })    

        } else {
            //setModalOpen(3);
            chosenMsgBox = MSG_WARNING_APPEL;
            currentUiContext.showMsgBox({
                visible:true, 
                msgType:"info", 
                msgTitle:t("ERROR"), 
                message:t("day not matching")
            })   
               
        }
   
    }


    function getPresentCount(tab){
        var countPresent = 0;
        for(var i=0; i<tab.length;i++){
            if(tab[i].presence == 1) countPresent++;
        }
        return countPresent;
    }

    function getAbsentCount(tab){
        var countAbsent = 0;
        for(var i=0; i<tab.length;i++){
            if(tab[i].presence == 0) countAbsent++;
        }
        return countAbsent;
    } 

    function handlePresence(params){
        console.log(params);
        if(params.presence == 0) {
            params.presence = 1;
            setPresent(present+1);
            setAbsent(absent-1);
            if(ELEVES_ABSENTS.includes(params.id)){
                var index = ELEVES_ABSENTS.indexOf(params.id);
                if(index==0) ELEVES_ABSENTS.replace(params.id+'_','');
                else{
                    ELEVES_ABSENTS.replace('_'+params.id,'');               
                }             
            }
        }
        else{
            params.presence = 0;
            setPresent(present-1);
            setAbsent(absent+1);
            if(ELEVES_ABSENTS.length==0)  ELEVES_ABSENTS = params.id;
            else  ELEVES_ABSENTS += '_' + params.id;
           
        } 
    }

    const acceptHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_APPEL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
                currentUiContext.setIsParentMsgBox(true);
                return 1;
                
            }

            case MSG_WARNING_APPEL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
                currentUiContext.setIsParentMsgBox(true);
                setGridRows([]);
                setPresent(0);
                setAbsent(0);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }        
    }

    const rejectHandler=()=>{
        
        switch(chosenMsgBox){

            case MSG_SUCCESS_APPEL: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                }) 
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }

            case MSG_WARNING_APPEL :{
                    currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
                return 1;
            }
            
           
            default: {
                currentUiContext.showMsgBox({
                    visible:false, 
                    msgType:"", 
                    msgTitle:"", 
                    message:""
                })  
               // currentUiContext.setIsParentMsgBox(true);
            }
        }
        
    }

    /********************************** JSX Code **********************************/   
    const ODD_OPACITY = 0.2;
    
    const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
      [`& .${gridClasses.row}.even`]: {
        backgroundColor: theme.palette.grey[200],
        '&:hover, &.Mui-hovered': {
          backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        '&.Mui-selected': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
          '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              ODD_OPACITY +
                theme.palette.action.selectedOpacity +
                theme.palette.action.hoverOpacity,
            ),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
              ),
            },
          },
        },
      },
    }));

    return (
        <div className={classes.formStyleP}>
            {(currentUiContext.msgBox.visible == true) && <BackDrop/>}
            {(currentUiContext.msgBox.visible == true) && !currentUiContext.isParentMsgBox &&
                <MsgBox 
                    msgTitle = {currentUiContext.msgBox.msgTitle} 
                    msgType  = {currentUiContext.msgBox.msgType} 
                    message  = {currentUiContext.msgBox.message} 
                    customImg ={true}
                    customStyle={true}
                    contentStyle={classes.msgContent}
                    imgStyle={classes.msgBoxImgStyleP}
                    buttonAcceptText = {currentUiContext.msgBox.msgType == "question" ? t('yes'):t('ok')}
                    buttonRejectText = {t('no')}  
                    buttonAcceptHandler = {acceptHandler}  
                    buttonRejectHandler = {rejectHandler}            
                />                 
            }
            <div className={classes.inputRow}>
                {(props.formMode=='appel')?  
                    <div className={classes.formTitle}>
                        {t('check_students_M')}  
                    </div>
                    :
                    <div className={classes.formTitle}>
                        {t('look_students_presence_M')}  
                    </div>
                }
            </div>
            <div className={classes.formGridContent}>
              
                <div className={classes.gridTitleRow}> 
                    <div className={classes.gridTitle}>                  
                        <div className={classes.gridTitleText}>
                            {t('class_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optClasse' onChange={classeChangeHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optClasse||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>

                    <div className={classes.gridTitle} style={{marginLeft:"-7.3vw"}}>                  
                        <div className={classes.gridTitleText}>
                            {t('course_M')} :
                        </div>
                      
                        <div className={classes.selectZone}>
                            <select id='optCours' onChange={coursChangeHandler} className={classes.comboBoxStyle} style={{width:'13.3vw', marginBottom:1, marginLeft:'1vw'}}>
                                {(optCours||[]).map((option)=> {
                                    return(
                                        <option value={option.value}>{option.label}</option>
                                    );
                                })}
                            </select>               
                        </div>
                    </div>


                   
                                
                    <div className={classes.gridAction}> 
                        {(props.formMode=='appel')?
                            <CustomButton
                                btnText={t('save')}
                                hasIconImg= {true}
                                imgSrc='images/saveToDisk_trans.png'
                                imgStyle = {classes.grdBtnImgStyle}  
                                buttonStyle={getGridButtonStyle()}
                                btnTextStyle = {classes.gridBtnTextStyle}
                                btnClickHandler={savePresenceHandler}
                                disable={(modalOpen==1||modalOpen==2)}   
                            />
                            :
                            null
                        }

                        <CustomButton
                            btnText={t('imprimer')}
                            hasIconImg= {true}
                            imgSrc='images/printing1.png'
                            imgStyle = {classes.grdBtnImgStyle}  
                            buttonStyle={getGridButtonStyle()}
                            btnTextStyle = {classes.gridBtnTextStyle}
                            btnClickHandler={()=>{setModalOpen(1); currentUiContext.setFormInputs([])}}
                            disable={(modalOpen==1||modalOpen==2)}   
                        />

                    </div>
                        
                </div>
                    
                

                {(modalOpen==0) ?
                    <div className={classes.gridDisplay} >
                        <StripedDataGrid
                            rows={gridRows}
                            columns={columns}
                            getCellClassName={(params) => (params.field==='nom')? classes.gridMainRowStyle : classes.gridRowStyle }
                            
                            onCellClick={(params,event)=>{
                                if(event.ignore) {
                                    //console.log(params.row);
                                    handlePresence(params.row)
                                }
                            }}  
                            
                        //    onRowDoubleClick ={(params, event) => {
                        //        if(!event.ignore){
                        //             event.defaultMuiPrevented = true;
                        //             consultRowData(params.row);
                        //         }
                        //     }}
                            
                            //loading={loading}
                            //{...data}
                            sx={{
                                //boxShadow: 2,
                                //border: 2,
                                //borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover': {
                                  color: 'primary.main',
                                  border:0,
                                  borderColor:'none'
                                },
                              
                            }}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' + classes.gridRowStyle : 'odd '+ classes.gridRowStyle
                            }
                        />
                    </div>
                    :
                    null
                }
            
            </div>
            <div className={classes.infoPresence}>
                <div className={classes.presentZone}>
                    <div> {t('present')}(s) :</div>
                    <div> {present} </div>
                </div>

                <div className={classes.absentZone}>
                    <div> {t('absent')}(s) :</div>
                    <div> {absent} </div>
                </div>
            </div>
        </div>
        
    );
} 
export default Appel;