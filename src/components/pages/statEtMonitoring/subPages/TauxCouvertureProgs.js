import React from 'react';
import ReactDOM from 'react-dom';
import classes from "./SubPages.module.css";
import CustomButton from "../../../customButton/CustomButton";
import FormPuce from "../../../formPuce/FormPuce";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Select from 'react-select';

import { useContext, useState } from "react";
import UiContext from "../../../../store/UiContext";
import {Bar} from 'react-chartjs-2';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
    } from 'chart.js'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend   
  );


var groupWidth;
var libelleClasse='';
var curentClasse=''
var suffixeClasse='';
var sectionTitle = "Evolution Generale Du Taux de Couverture des Programmes Sur les 5 dernieres Annees";

function TauxCouvertureProgs(props){
    
    const currentUiContext = useContext(UiContext);
    const [isValid, setIsValid] = useState(false);
    const [titleSuffix, setTitleSuffix] = useState('');
    const selectedTheme = currentUiContext.theme;

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

    function getPuceByTheme()
    { // Choix du theme courant
        switch(selectedTheme){
            case 'Theme1': return 'puceN1.png' ;
            case 'Theme2': return 'puceN2.png' ;
            case 'Theme3': return 'puceN3.png' ;
            default: return 'puceN1.png' ;
        }
    }

    const optClasse=[
        {value: '0',      label:'Choisir une classe' },
        {value: '6em1',   label:'6ieme 1'            },
        {value: '5em2',   label:'5ieme 2'            },
        {value: '4A2',    label:'4ieme A2'           },
        {value: '3E',     label:'3ieme Esp'          },
        {value: '2c1',    label:'2nd C1'             },
        {value: '1L',     label:'1ere L'             },
        {value: 'TD',     label:'Tle D'              }
    ];

    const listMatieres = [
        "2+Francais*1*75_Anglais*1*80_Histoire*1*72_ECM*1*80_SVT*2*80_PCT*2*80_Maths*2*75_Sport*1*100_TM*1*100_ESF*1*100_Latin*1*45_vdvdvd*2*12_vdvddd*2*25_dcdcdc*1*32_dgdggd*2*40",
        "3+Allemand*1*78_Francais*1*84_Anglais*1*62_Histoire*2*73_ECM*2*75_SVT*2*82_PCT*2*93_Maths*2*72_Sport*3*100_TM*3*100_ESF*3*100",
        "3+Espagno*1*72_Francais*1*65_Anglais*1*95_Histoire*2*62_ECM*2*95_SVT*2*94_PCT*2*86_Maths*2*88_Sport*3*98_TM*3*100_ESF*3*98",
        "3+Espagnol*1*82_Philo*1*95_Francais*1*73_Anglais*1*72_Histoire*2*83_ECM*2*49_SVT*2*58_PCT*2*34_Maths*2*65_Sport*3*100_TM*3*100_ESF*3*100",
        "4+Francais*3*84_Anglais*3*62_Histoire*2*73_ECM*2*75_SVT*1*82_PCT*1*93_Maths*1*72_Sport*4*100_TM*4*100_ESF*4*100",
    ];
    
    const listProgressions =[
        "2018_2019_2020_2021_2022*65_59_80_81_56",
        "2018_2019_2020_2021_2022*85_80_82_65_57",
        "2018_2019_2020_2021_2022*84_82_84_58_68",
        "2018_2019_2020_2021_2022*65_80_80_48_74",
        "2018_2019_2020_2021_2022*65_59_90_81_79",
    ];

    function getMatieres(classe){
        switch(classe){
            case '6em1': return listMatieres[0] ;
            case '5em2': return listMatieres[0] ;
            case '4A2':  return listMatieres[1] ;
            case '3E':   return listMatieres[2] ;
            case '2c1':  return listMatieres[4] ;
            case '1E':   return listMatieres[2] ;
            case 'TE':   return listMatieres[3] ;
        }      
    }   

    function getProgressions(classe){
        switch(classe){
            case '6em1': return listProgressions[0] ;
            case '5em2': return listProgressions[1] ;
            case '4A2':  return listProgressions[3] ;
            case '3E':   return listProgressions[4] ;
            case '2c1':  return listProgressions[0] ;
            case '1E':   return listProgressions[1] ;
            case 'TE':   return listProgressions[2] ;
        }      
    }

    function getStringAtPosition(examSting,pos){
        var tabResult = examSting.split('*');
        if (tabResult.length==0) return undefined;
        if((pos >= 0)&&(pos<=tabResult.length-1)) return tabResult[pos];
        else return undefined;
        
    }

    function getProgressColor(matiereCode){
        switch(matiereCode){
            case '1': return 'success' ;
            case '2': return 'info' ;
            case '3':  return 'warning' ;
            case '4':  return 'danger' ;           
        }      
    }  
    
    const MatieresProgressDiagram =(props) =>{
        return(
            <Bar
                data={props.state}
                options={{
                    title:{
                        display:true,
                        text: props.ChartTextTitle, 
                        fontSize:20
                    },
                    legend:{
                        display:true,
                        position:'right'
                    }
                }}
            />
        );

    }

    const MatiereProgress = (props) =>{
        return(            
            <div className={classes.fontNormal + ' ' + classes.fontSize1}>
                {getStringAtPosition(props.matiereInfo,0)+ '('+getStringAtPosition(props.matiereInfo,2)+'%)' }
                <ProgressBar style={{width:(groupWidth-3)+'vw'}} striped variant= {getProgressColor(getStringAtPosition(props.matiereInfo,1))} now= {getStringAtPosition(props.matiereInfo,2)} key={1}/>
            </div>              
        );
    }

    /******************************* <Handlers> *******************************/
    function createProgressionMatieres(classe){
        var tabMatieres=[];
        var listMat;
        var matTab=[];
        var groupCount;
        var parentDiv,j;

        //initialisation de la div conteneur.
        parentDiv = document.getElementById('matieresProgress');
        groupCount = parentDiv.childNodes.length;
        
        if(groupCount>0){           
            for(var i = 1; i <= groupCount; i++){
                document.getElementById('sousGroupe'+i).remove();
            }
        }    
        if(classe != undefined) {
            //Recuperation De la liste des matieres avc leur infos.        
            listMat = getMatieres(classe);

            //Extraction du nombre de groupes et calcul de la largeur d'un groupe. 
            matTab = listMat.split('+');
            groupCount = matTab[0];
            groupWidth = (groupCount!=0)? (groupCount==2)? 20: (Math.round(80/groupCount)-7) :20;

            //Creation du tableau des matieres.
            tabMatieres = matTab[1].split('_');
        
            //Creation des sous Divs conteneurs et
            //Ajout des matieres avec leur progression.
            for (var i = 1; i <=groupCount; i++) {
                var cell = document.createElement('div');
                cell.id='sousGroupe'+i;
                cell.className=classes.matiereProgress;
                cell.style.width = groupWidth;
                cell.style.fontWeight='bold';
                cell.textContent='Matieres du Groupe '+i; 

                parentDiv.appendChild(cell);  

                for (var j = 0; j < tabMatieres.length; j++) {

                    if(getStringAtPosition(tabMatieres[j],1)==i){
                        var sousDiv = document.createElement('div');
                        sousDiv.className= classes.inputRowLeft;
                        document.getElementById('sousGroupe'+i).appendChild(sousDiv);
                        ReactDOM.render(<MatiereProgress matiereInfo={tabMatieres[j]}/>,sousDiv)
                    }                    
                }         
            }
        } 
    }

    function EvolutionDiagram(classeId){
        var tabProgress=[];
        var currentProgressionList;
        var containerDiv;
        var title = 'Progression du taux de couverture des programmes'+ ' en '+libelleClasse;
        if(classeId != undefined){
            currentProgressionList = getProgressions(classeId);
            tabProgress = currentProgressionList.split('*');

            var selectedState = {
                labels: [...tabProgress[0].split('_')],
                datasets: [
                {
                    label: 'Progression de la couverture des progrmmes de '+libelleClasse,
                    backgroundColor: '#2FDE00',
                    borderColor: 'rgba(255,255,255,1)',
                    borderWidth: 2,
                    data: [...tabProgress[1].split('_')]
                }
                ]
            }
            containerDiv = document.getElementById('matieresProgressDiagramm');       
            ReactDOM.render(<MatieresProgressDiagram ChartTextTitle= {title} state={selectedState}/>,containerDiv);
        } else {
            containerDiv = document.getElementById('matieresProgressDiagramm');       
            ReactDOM.render(null,containerDiv);
        }        
    }

    function dropDownHandler(e){
        if(e.target.value != optClasse[0].value){
            curentClasse = e.target.value;
            var cur_index = optClasse.findIndex((index)=>index.value == curentClasse);
            libelleClasse = optClasse[cur_index].label;

            console.log(libelleClasse);
            suffixeClasse = ' en '+libelleClasse;     
        } else {
            curentClasse = undefined;
            libelleClasse ='';
            suffixeClasse = '';
        }  
        
        setTitleSuffix(suffixeClasse);          
        createProgressionMatieres(curentClasse);
        EvolutionDiagram(curentClasse);   
    }

    function cancelHandler() {
        var sideNav = document.getElementById('side-menu');
        var backDrop = document.querySelectorAll('.sidenav-overlay');
       
        backDrop.forEach(element => {
            element.style.display='none';
            element.style.opacity='0';
          });
          
        sideNav.style.transform='translateX(105%)';
    }
     /******************************* </Handlers> *******************************/
        
    return (          
        <div className={classes.formStyle}>
            <div className={classes.inputRow}> 
                <div className={classes.formTitle +' '+classes.margBottom3}>
                    TABLEAU DE BORD DE PRESENTATION DE L'EVOLUTION DU TAUX DECOUVERTURE DES PROGRAMMES
                </div>
            </div>

            <div className={classes.inputRow23}>
                <div className={classes.bold+ ' '+classes.fontSize1} style={{alignSelf:'center'}}>
                    CLASSE  :                       
                </div>
                <div>
                    <select onChange={dropDownHandler} className={classes.comboBoxStyle} style={{width:'11.3vw', marginBottom:1}}>
                        {(optClasse||[]).map((option)=> {
                            return(
                                <option  value={option.value}>{option.label}</option>
                            );
                        })}
                    </select>
                </div>            
            </div>
                   
            <FormPuce menuItemId ='1' isSimple={true} noSelect={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle="Taux de Couverture des Programmes Par Matieres"  itemSelected={null}> </FormPuce>
            <div id='matieresProgress' className={classes.inputRow +' '+ classes.spaceAround}/>
           
            <FormPuce menuItemId ='1' isSimple={true} imgSource={'images/' + getPuceByTheme()} withCustomImage={true} imageStyle={classes.PuceStyle}    libelle={sectionTitle + titleSuffix}  itemSelected={null}> </FormPuce>
            <div id='matieresProgressDiagramm' className={classes.inputRow33 +' '+ classes.spaceAround}/>
            
            
             {/*<div className={classes.buttonRow+' '+classes.margLeft5 }>
               <CustomButton
                    btnText='Annuler' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    btnClickHandler={cancelHandler}
                />
                                
                <CustomButton
                    btnText='Valider' 
                    buttonStyle={getButtonStyle()}
                    btnTextStyle = {classes.btnTextStyle}
                    disable={(isValid == false)}
                  
            </div>/>*/}  

        </div>
       
    );
 }
 
 export default TauxCouvertureProgs;