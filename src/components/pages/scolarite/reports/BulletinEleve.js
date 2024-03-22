import React from "react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
import Filigrane from "../../../filigrane/Filigrane";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";

Font.register({
  family: "MyBold",
  // fontWeight: '1200', 
  src: fontBold 
});
Font.register({
  family: "MyItalic",
  src: fontItalic 
});

function BulletinEleve(props) {

    const [ELEVES_DATA, setElevesData] = useState([]);
    const [seq1, setSeq1] = useState("1");
    const [seq2, setSeq2] = useState("2");
    const { t, i18n } = useTranslation();
    

    useEffect(()=> {
        if(props.data.typeBulletin==2) getTrimSequences(props.data.periode);
        setElevesData(props.data.elvToPrintData); 
    },[]);

    function getTrimSequences(trimestre){
        switch(trimestre){
         case "Trimestre1": {setSeq1("1"); setSeq2("2");   return;} 
         case "Trimestre2": {setSeq1("3"); setSeq2("4");   return;}
         case "Trimestre3": {setSeq1("5"); setSeq2("6");   return;}
        }
    }

    function getPrefixeRang(rang){
        if(i18n.language =='fr'){
            switch(parseInt(rang)){
                case 1 : return 'er';
                default: return 'ieme';
            }

        } else {
            switch(parseInt(rang)){
                case 1 : return 'st';
                case 2 : return 'nd';
                case 3 : return 'rd';
                default: return 'th';
            }
        }
    }

    function calcTop(index){
        var val = index*10;
        return (val).toString()+"vh";
    }

    function PageHeader(props){
        return(
            <View style={styles.header1}>
                <View style={styles.header1_1}>
                    <View style={[styles.header1_ligne,{}]}><Text style={{fontSize:"10px"}}>{props.entete_fr.pays}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px",fontWeight:"900"}]}><Text>{props.entete_fr.ministere}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"10px"}]}><Text>{props.entete_fr.etab}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>{props.entete_fr.devise}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>BP:{props.entete_fr.bp} Tel:{props.entete_fr.tel}</Text></View> 
                </View>
                    
                <View style={styles.header1_2}><Image src={props.etabLogo} style={{width:"16.3vw", height:"38.3vw"}}/></View>
                    
                <View style={styles.header1_3}>
                    <View style={[styles.header1_ligne,{}]}><Text style={{fontSize:"10px"}}>{props.entete_en.pays}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px",fontWeight:"900"}]}><Text>{props.entete_en.ministere}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"10px"}]}><Text>{props.entete_en.etab}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>{props.entete_en.devise}</Text></View>
                    <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>POBOX:{props.entete_en.bp} Tel:{props.entete_en.tel}</Text></View> 
                </View>              
            </View>               
        );
    }

    const EleveGenInfo = (props) =>{
        return(
            <View style={styles.header3}>
                <View style={styles.header3_3}>
                    <Text>Photo</Text>
                </View>
            
                <View style={styles.header3_1}>                   
                    <View style={{textAlign:"left",marginLeft:"5px"}}>
                        <Text style={{fontFamily:"MyBold"}}>{props.eleveEntete.nom + " "+props.eleveEntete.prenom }</Text>
                        <Text>{t('form_sexe')}: {props.eleveEntete.sexe}</Text>
                        <Text>{t('born_on')}: {props.eleveEntete.dateNaiss} A: {props.eleveEntete.lieuNaiss}</Text>
                        <Text>{t('matricule_short')}: {props.eleveEntete.matricule}  {t('redoublant')}:{props.eleveEntete.redouble? t("yes"):t("no")}</Text>
                    </View>                   
                </View>            
            
                <View style={[styles.header3_2,{textAlign:"left"}]}>
                    <Text style={{fontFamily:"MyBold"}}>{props.classeLabel}</Text>
                    <Text>{t('effectif')}: {props.effectif}</Text>
                    <Text>{t('annee_scolaire')}: {props.annee_scolaire}</Text>
                    <Text style={{minWidth:"20vw"}}>{t('prof_principal_ab')}: {props.profPrincipal}</Text>
                </View>
            </View>
        );
    }

    
    const EleveRowHeader = (props) =>{
        switch(props.typeBulletin){
            case 1:{  //Bulletin sequentiel
                return( 
                    <View style={styles.ligne_entete_note}>
                        <View style={styles.ligne_entete_note__matiere}><Text>{t('lesson_M')}</Text></View>
                        <View style={styles.ligne_entete_note__competence}><Text>{t('lesson_goal_M')}</Text></View>
                        <View style={styles.ligne_entete_note__moy}><Text>{t('moy_M')}</Text></View>
                        <View style={styles.ligne_entete_note__coef}><Text>{t('COEF')}</Text></View>
                        <View style={styles.ligne_entete_note__nxc}><Text>{t('TOTAL')}</Text></View>
                        <View style={styles.ligne_entete_note__rang}><Text>{t('rang_M')}</Text></View>
                        <View style={styles.ligne_entete_note__borne}><Text>{t('bornes_M')}</Text></View>
                        <View style={styles.ligne_entete_note__appreciation}><Text>{t('APPRECIATION')}</Text></View>
                    </View>
                );

            }
            
            case 2:{  //Bulletin trimestriel
                return(
                    <View style={styles.ligne_entete_note}>
                        <View style={styles.ligne_entete_note__matiere}><Text>{t('lesson_M')}</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_seq_M')}{seq1}.</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_seq_M')}{seq2}.</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_trim_M')}</Text></View>
                        <View style={styles.ligne_entete_note__rang}><Text>{t('rang_M')}</Text></View>
                        <View style={styles.ligne_entete_note__appreciation}><Text>{t('APPRECIATION')}</Text></View>
                    </View>
                );

            }

            case 3:{   //Bulletin annuel
                return(
                    <View style={styles.ligne_entete_note}>
                        <View style={styles.ligne_entete_note__matiere}><Text>{t('lesson_M')}</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_trim_M')}1</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_trim_M')}2</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moy_trim_M')}3</Text></View>
                        <View style={styles.ligne_entete_note__moySeq}><Text>{t('moyGenAN_M')}</Text></View>
                        <View style={styles.ligne_entete_note__rang}><Text>{t('rang_M')}</Text></View>
                        <View style={styles.ligne_entete_note__appreciation}><Text>{t('APPRECIATION')}</Text></View>
                    </View>
                );

            }
        }
       
    }


    const EleveNoteRow = (props) =>{
        switch(props.typeBulletin){
            case 1:{  //Bulletin sequentiel
                return(                   
                    <View style={styles.ligne_note}>
                        <View style={styles.ligne_entete_note__matiere2}>
                            <Text style={{fontFamily:"MyBold"}} > {props.eleve.libelleMatiere}</Text>
                            <Text style={{fontFamily:"MyItalic"}}>{props.eleve.nomProf}</Text>
                        </View>       
                                        
                        <View style={styles.ligne_entete_note__competence}>
                            <Text>{props.eleve.compVisee}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moy}>
                            <Text>{props.eleve.moyenne}</Text>
                        </View>
                        <View style={styles.ligne_entete_note__coef}>
                            <Text>{props.eleve.coefMatiere}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__nxc}>
                            <Text>{props.eleve.nxc}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__rang}>
                            <Text>{props.eleve.rang}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__borne}>
                            <Text>[{props.eleve.borneInf}, {props.eleve.borneSup}]</Text>
                        </View>

                        <View style={styles.ligne_entete_note__appreciation}>
                            <Text>{props.eleve.appreciation}</Text>
                        </View>
                    </View>
                );

            }


            case 2:{  //Bulletin trimestriel
                return(
                    <View style={styles.ligne_note}>
                        <View style={styles.ligne_entete_note__matiere2}>
                            <Text style={{fontFamily:"MyBold"}} > {props.eleve.libelleMatiere}</Text>
                            <Text style={{fontFamily:"MyItalic"}}>{props.eleve.nomProf}</Text>
                        </View>       
                                        
                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moySeq1}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moySeq2}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moyenne}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__rang}>
                            <Text>{props.eleve.rang}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__appreciation}>
                            <Text>{props.eleve.appreciation}</Text>
                        </View>
                    </View>
                );

            }

            case 3:{   //Bulletin annuel
                return(
                    <View style={styles.ligne_note}>
                        <View style={styles.ligne_entete_note__matiere2}>
                            <Text style={{fontFamily:"MyBold"}} > {props.eleve.libelleMatiere}</Text>
                            <Text style={{fontFamily:"MyItalic"}}>{props.eleve.nomProf}</Text>
                        </View>       
                                        
                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moyTrim1}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moyTrim2}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moyTrim3}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__moySeq}>
                            <Text>{props.eleve.moyenne}</Text>
                        </View>
                        
                        <View style={styles.ligne_entete_note__rang}>
                            <Text>{props.eleve.rang}</Text>
                        </View>

                        <View style={styles.ligne_entete_note__appreciation}>
                            <Text>{props.eleve.appreciation}</Text>
                        </View>
                    </View>
                );

            }
        }
    }
   
    const EleveRecapGroupe = (props) =>{
        switch(props.typeBulletin){
            case 1:{  //Bulletin sequentiel
                return(
                    <View style={styles.ligne_groupe}>
                        <View style={styles.ligne_entete_groupe__libelle}>
                            <Text style={{fontFamily:"MyBold"}} >{t('group')}: {props.eleveGroupRecap.libelleGroup}</Text>
                        </View>
                       
                        <View style={[styles.ligne_entete_groupe__moy,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.moyGroup}</Text>
                        </View>
                       
                        <View style={[styles.ligne_entete_groupe__coef,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.coefTotalgroup}</Text>
                        </View>
                        
                        <View style={[styles.ligne_entete_groupe__nxc,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.nxcTotal}</Text>
                        </View>
                        
                        <View style={[styles.ligne_entete_groupe__rang,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.rangGroupe}</Text>
                        </View>
                        
                        <View style={[styles.ligne_entete_groupe__borne,{fontFamily:"MyBold"}]}>
                            <Text style={{fontSize:"1.7vw"}}>[{props.eleveGroupRecap.borneInf},{props.eleveGroupRecap.borneSup}]</Text>                                
                        </View>
        
                        <View style={styles.ligne_entete_groupe__appreciation}>
                            <Text>{props.eleveGroupRecap.apprecGroupe}</Text>
                        </View>
                            
                    </View>
                );

            }
            
            case 2:{  //Bulletin trimestriel
                return(
                    <View style={{...styles.ligne_groupe}}>
                        <View style={{...styles.ligne_entete_groupe__libelle}}>
                            <Text style={{fontFamily:"MyBold"}} >{t('group')}: {props.eleveGroupRecap.libelleGroup}</Text>
                        </View>

                        <View style={{...styles.ligne_entete_groupe__moy,fontFamily:"MyBold"}}>
                            <Text style={{paddingLeft:"3vw"}}>{props.eleveGroupRecap.moyGroup}</Text>
                        </View>
                       
                        
                        <View style={{...styles.ligne_entete_groupe__rang, fontFamily:"MyBold", /*marginLeft:"0vw"*/}}>
                            <Text style={{paddingLeft:"8vw"}}>{props.eleveGroupRecap.rangGroupe}</Text>
                        </View>
                    
                        <View style={{...styles.ligne_entete_groupe__appreciation,fontFamily:"MyBold"}}>
                            <Text style={{paddingLeft:"9vw"}}>{props.eleveGroupRecap.apprecGroupe}</Text>
                        </View>
                            
                    </View>
                );

            }

            case 3:{   //Bulletin annuel
                return(
                    <View style={styles.ligne_groupe}>
                        <View style={styles.ligne_entete_groupe__libelle}>
                            <Text style={{fontFamily:"MyBold"}} >{t('group')}: {props.eleveGroupRecap.libelleGroup}</Text>
                        </View>
                       
                        <View style={[styles.ligne_entete_groupe__moy,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.moyGroup}</Text>
                        </View>
                       
                        
                        <View style={[styles.ligne_entete_groupe__rang,{fontFamily:"MyBold"}]}>
                            <Text>{props.eleveGroupRecap.rangGroupe}</Text>
                        </View>
                        
                       
                        <View style={styles.ligne_entete_groupe__appreciation}>
                            <Text>{props.eleveGroupRecap.apprecGroupe}</Text>
                        </View>
                            
                    </View>
                );

            }

        }
        
    }


    const EleveGroupe = (props) =>{
        return(
            <View style={{...props.style, display:"flex",flexDirection:"column",justifyContent:"flex-start", alignItems:"center", height:"50vh", width:"100%", /*marginBottom:"-10vh"*/}}>
                {  props.eleveInfos.map((elv)=>{
                   return( 
                        <EleveNoteRow typeBulletin ={props.typeBulletin} eleve={elv}/>
                    );                   
                })} 
                <EleveRecapGroupe typeBulletin={props.typeBulletin} eleveGroupRecap={props.eleveGroupRecap}/>
            </View>
        );
    }

   

    const EleveGroupNoteList = (props) =>{
        return(
            <View style={{...props.style, display:"flex",flexDirection:"column",justifyContent:"flex-start", alignItems:"center", height:"70%", width:"100%",}}>
               
                { props.groupesInfos.map((grp, index)=>{                   
                   return(
                        <EleveGroupe style={{position:"absolute", top:calcTop(index)}} index={index} typeBulletin={props.typeBulletin} eleveInfos={grp.eleveInfos} eleveGroupRecap={grp.eleveGroupRecap}/>
                   );                   
                })}
            </View>           
        );
    }

    const EleveRecap = (props) =>{
        return(
            <View style={styles.footer}> 
                <View style={styles.footer_row1}>
                    <View style={{...styles.footer_row1_box, width:props.typeBulletin==1? "38.3%":"26.7%"}}>
                        <View style={styles.box_header}><Text>{t('student_results_M')}</Text></View>
                        <View style={{...styles.box_corps,  widht:"100%", marginLeft:"1.3vw", paddingTop:"1.7vh"}}>
                            <View style={{...styles.box_corps_ligne, justifyContent:"flex-start", widht:"100%", marginBottom:"2vh"}}>
                              <Text style={{/*fontFamily:"MyBold",*/ width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('Total Points')}:  </Text>
                              <Text style={{/*fontFamily:"MyBold"*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.totalPoints}</Text>
                            </View>
                            <View style={{...styles.box_corps_ligne, justifyContent:"flex-start", widht:"100%", marginBottom:"2vh"}}>
                              <Text style={{/*fontFamily:"MyBold",*/width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('Total Coefs')}:  </Text>
                              <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.totalcoef}</Text>
                            </View>
                            <View style={{...styles.box_corps_ligne, justifyContent:"flex-start", widht:"100%", marginBottom:"2vh"}}>
                              <Text style={{fontFamily:"MyBold",width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moyenne')}:  </Text>
                              <Text style={[styles.special_textP,{fontFamily:"MyBold",width:"7vw", marginRight:"1.7vw"}]}>{props.recapGeneral.MoyGenerale}</Text>
                            </View>
                            <View style={{...styles.box_corps_ligne, justifyContent:"flex-start", widht:"100%", marginBottom:"2vh"}}>
                              <Text style={{fontFamily:"MyBold",width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('rang')}:  </Text>
                              <View style={{...styles.special_textP,display:"flex",flexDirection:"row",justifyContent:"center",minWidth:"7vw", maxWidth:"13vw",  width:"auto", marginRight:"1.7vw"}}> 
                                <Text style={{fontFamily:"MyBold",}}>{props.recapGeneral.rangGeneral}</Text>

                                {(props.isElevesclasse) &&
                                    <Text style={{fontFamily:"MyBold", verticalAlign:"super",marginRight:"0.7vw",paddingTop:"0.7vh", fontSize:"0.7vh"}}>{getPrefixeRang(props.recapGeneral.rangGeneral)} {props.recapGeneral.isExeco ? " ex":""}</Text>
                                }
                                
                                {(props.isElevesclasse) &&
                                    <Text style={{fontFamily:"MyBold",}}> / {props.effectifTotal}</Text>
                                }

                              </View>
                           
                            </View>
                        </View>
                    </View>
                  
                    <View style={{...styles.footer_row1_box, width:props.typeBulletin==1? "38.3%":"26.7%"}}>
                        <View style={styles.box_header}><Text>{t('disciplin_M')}</Text></View>
                        <View style={{...styles.box_corps, alignItems:"flex-start", paddingLeft:"0.3vw", paddingBottom:"0.3vh"}}>
                            <Text style={{fontFamily:"MyBold",fontSize:"11px", marginBottom:"0.27vh", marginLeft:"1.3vw"}}>{t('absences')}</Text>
                            <View style={{display:"flex",flexDirection:"column",  marginBottom:"0.7vh"}}>
                                <View style={{display:"flex",flexDirection:"row", paddingHorizontal:"0.7vw", justifyContent:"flex-start"}}>
                                    <Text style={{fontSize:"9.7px", width:"20%", marginLeft:"0.7vw"}}>{t('Total')}</Text>
                                    <Text style={{fontSize:"9.7px", width:"30%", marginLeft:"0.7vw"}}>{t('Just.')}</Text>
                                    <Text style={{fontSize:"9.7px", width:"40%", marginLeft:"0.7vw"}}>{t('Non just.')}</Text>
                                </View>

                                <View style={{display:"flex",flexDirection:"row", paddingHorizontal:"0.7vw", justifyContent:"flex-start"}}>
                                    <Text style={{fontFamily:"MyBold", width:"20%", marginLeft:"0.7vw", fontSize:"9.7px"}}>{props.recapGeneral.absTotal}</Text>
                                    <Text style={{fontFamily:"MyBold", width:"30%", marginLeft:"0.7vw", fontSize:"9.7px"}}>{props.recapGeneral.absJ}</Text>
                                    <Text style={{fontFamily:"MyBold", width:"40%", marginLeft:"0.7vw", fontSize:"9.7px"}}>{props.recapGeneral.absNJ}</Text>
                                </View>
                            </View>

                            <Text style={{fontFamily:"MyBold",fontSize:"11px", marginBottom:"0.27vh", marginLeft:"1.3vw"}}>{t('sanctions')}</Text>

                            <View style={{display:"flex",flexDirection:"column", marginBottom:"0.7vh"}}>
                                {(props.recapGeneral.sanction!="R.A.S")?
                                    props.recapGeneral.sanction.map((sct)=>{
                                        return (
                                            <View style={{display:"flex",flexDirection:"row", paddingHorizontal:"0.7vw", justifyContent:"flex-start"}}>
                                                <Text style={{fontSize:"9.7px", width:"50%", /*textOverflow:"ellipsis",*/ marginLeft:"0vw"}}>{sct.split("_")[0]}:</Text>
                                                <Text style={{fontSize:"9.7px", width:"50%", fontFamily:"MyBold", marginLeft:"0.7vw"}}>{sct.split("_")[1]}</Text>
                                            </View>
                                        )
                                    })
                                    : <Text style={{fontSize:"9.7px", width:"50%", marginLeft:"0.7vw"}}>{props.recapGeneral.sanction}</Text>                                
                                }
                           
                            </View>
                        </View>
                    </View>

                    {(props.typeBulletin>1) &&
                        <View style={{...styles.footer_row1_box, width:"23%"}}>
                            <View style={styles.box_header}>
                                <Text>{t('score_remind_M')}</Text>
                            </View>
                            {(props.typeBulletin==2)?
                                <View style={styles.box_corps}>
                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh",marginTop:"1.3vh"}}>
                                        <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_seq')}{seq1}:  </Text>
                                        <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moy_seq1}</Text>
                                    </View>

                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                                        <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_seq')}{seq2}:  </Text>
                                        <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moy_seq2}</Text>
                                    </View>

                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                                        <Text style={{fontFamily:"MyBold", fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_generale')}:  </Text>
                                        <Text style={{...styles.special_textP, fontFamily:"MyBold", width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.MoyGenerale}</Text>
                                    </View>
                                </View> 
                                :
                                <View style={styles.box_corps}>
                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh",marginTop:"1.3vh"}}>
                                        <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_trim')}1:  </Text>
                                        <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moy_trim1}</Text>
                                    </View>

                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                                        <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_trim')}2:  </Text>
                                        <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moy_trim2}</Text>
                                    </View>

                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                                        <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_trim')}3:  </Text>
                                        <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moy_trim3}</Text>
                                        </View>

                                    <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                                        <Text style={{fontFamily:"MyBold", fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>%  {t('moy_generale')}:  </Text>
                                        <Text style={{...styles.special_text, fontFamily:"MyBold", width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.MoyGenerale}</Text>
                                    </View>
                                </View> 
                            }     
                        
                        </View>
                    }

                    <View style={{...styles.footer_row1_box, width:"23%"}}>
                        <View style={styles.box_header}><Text>{t('class_results_M')}</Text></View>
                        <View style={styles.box_corps}>
                            <View style={{...styles.box_corps_ligne, marginBottom:"2vh",marginTop:"1.3vh"}}>
                              <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_generale')}:  </Text>
                              <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moyGenClasse}</Text>
                            </View>

                            <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                              <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_max')}:  </Text>
                              <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moyMaxClasse}</Text>
                            </View>

                            <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                              <Text style={{fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>{t('moy_min')}:  </Text>
                              <Text style={{/*fontFamily:"MyBold",*/width:"7vw", marginRight:"0.7vw"}}>{props.recapGeneral.moyMinClasse}</Text>
                            </View>

                            <View style={{...styles.box_corps_ligne, marginBottom:"2vh"}}>
                              <Text style={{fontFamily:"MyBold", fontSize:"10px", width:"20vw", textAlign:"left", marginLeft:"1.3vw"}}>%  {t('reussite')}:  </Text>
                              <Text style={{...styles.special_text,fontFamily:"MyBold", width:"9vw", marginRight:"0.7vw", color:"white"}}>{props.recapGeneral.tauxReussite}%</Text>
                            </View>

                        </View>
                    </View>
                                   
                    {/* <View style={styles.footer_row1_box}>
                        <View style={styles.box_header}>
                            <Text>{t('work_M')}</Text>
                        </View>
                        <View style={styles.box_corps}></View>
                    </View> */}
                    </View> 

                    <View style={styles.footer_ligne2}>
                        <View style={styles.footer_ligne2_1}>
                            <View style={styles.footer_ligne2_1_1}>
                                <View style={styles.footer_ligne2_1_1_box}>
                                    <View style={styles.box_header}><Text>{t('work_appreciation_M')}</Text></View>
                                    <View style={styles.box_corps}></View>
                                </View>
                                <View style={styles.footer_ligne2_1_1_box}>
                                    <View style={styles.box_header}><Text>{t('work_observation_M')}</Text></View>
                                    <View style={styles.box_corps}></View>
                                </View> 
                            </View>
                            <View style={styles.footer_ligne2_1_1}>
                                <View style={styles.footer_ligne2_1_1_box}>
                                <View style={styles.box_header}><Text>{t('visa_parent_M')}</Text></View>
                                    <View style={styles.box_corps}></View>
                                </View>
                                <View style={styles.footer_ligne2_1_1_box}>
                                <View style={styles.box_header}><Text>{t('head_teacher_visa_M')}</Text></View>
                                    <View style={styles.box_corps}></View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.footer_ligne2_2}>
                        <View style={styles.box_header}><Text>{t('visa_principal_M')}</Text></View>
                        <View style={styles.box_corps}></View>
                    </View>
                </View>                   
            </View>           
        );
    }
    

    return (
        
        <Document>
            {Array.from(ELEVES_DATA,
                (eleve, index) => (
                    <Page size="A4"  style={styles.page} key={index}> 
                        <Filigrane photoStyle ={{width:"73vw", height:"70vw"}} style={{zIndex:0}} imageSrc="images/collegeVogt_fil.png"/>                    
                        <View style={styles.header}>
                            <PageHeader titreBulletin={props.data.titreBulletin.titre} 
                                entete_fr = {props.data.entete_fr} 
                                entete_en = {props.data.entete_en} 
                                etabLogo  = {props.data.etabLogo}
                            />

                            <View style={styles.header2}>
                                <View style={styles.header2_cadre}>
                                    <Text style={{textTransform:"uppercase"}}>{props.data.titreBulletin.split('-')[0]}</Text>
                                    <Text> - {props.data.titreBulletin.split('-')[1]}</Text>
                                </View>             
                            </View>

                            <EleveGenInfo 
                                eleveEntete    = {eleve.entete}
                                classeLabel    = {props.data.classeLabel}
                                effectif       = {props.data.effectif}
                                annee_scolaire = {props.data.entete_fr.annee_scolaire}
                                profPrincipal  = {props.data.profPrincipal}                     
                            />
                        </View>

                        <View style={styles.main}>
                            <EleveRowHeader     typeBulletin = {props.data.typeBulletin}/>
                            <EleveGroupNoteList typeBulletin = {props.data.typeBulletin} groupesInfos={eleve.groupesInfos}/>
                        </View> 
                        
                        <View style={styles.footer}> 
                            <EleveRecap  typeBulletin = {props.data.typeBulletin} recapGeneral = {eleve.recapGeneral} isElevesclasse = {props.data.isElevesclasse} effectifTotal={props.data.effectif}/>
                        </View>
                    </Page>
                ))
            }
        </Document>
    );

}

const styles = StyleSheet.create({
    page: {
      boxSizing: "border-box",
      margin: 0,
      textAlign: "justify",
      fontFamily: "Times-Roman",
      display: "flex",
      flexDirection: "column",
      justifyContent:"flex-start",
      width: "100vw",
      height: "100vh",     
      fontSize:"12px",  
    },

    header: {
      boxSizing:"border-box",
      height: "43vh",
      width: "100%",
      display: "flex",
      justifyContent:'flex-start',
    //   marginBottom:"3vh",
      position:"absolute",
      top:0
    },

    header1: {
      boxSizing: "border-box",
      margin: 0,
      marginTop:"7px",
      // marginB:"7px",
      textAlign: "center",
      height:"17%",
      minHeight:"30px",
      width: "100%",
      display: "flex",
      flexDirection:"row",
      justifyContent:"space-evenly",
    },

    header1_1:{
      width:"37%",
      display: "flex",
      flexDirection:"column",
      justifyContent:"space-between",
    },
    header1_2:{
      width:"26%",
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"

      // border: "1px 1px solid black",
    },
    header1_3:{
      width:"37%",
      // border: "1px 1px solid black",
    },
    header1_ligne:{
      height:"20%",
      width:"100%",
      fontFamily:"MyBold",
      boxSizing: "border-box",
      margin: 0,
      color:"black",
      // border: "1px 1px solid black",
    },

    header2: {
      textAlign: "center",
      height:"8%",
      minHeight:"20px",
      width: "100%",
      fontFamily:"MyBold",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      marginBottom:"3vh"
    },

    header2_cadre:{
      border: "2px 2px solid black",
      borderRadius:"5px",
      backgroundColor:"#ebebe0",
      width:"50%",
      height:"77%",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },

    header3: {
      textAlign: "center",
      height:"40%",
      minHeight:"30px",
      width: "93%",
      paddingLeft:"3%",
      // border: "1px 1px solid black",
      display: "flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:'center',
      boxSizing: "border-box",
      margin: 0,
      marginBottom:"2vh"
    },

    header3_1:{
      width:"50%",
      height:"100%",
      // marginLeft:"3vw",
      // border: "1px 1px solid black",
    },

    header3_2:{
      width:"30%",
      height:"100%",
      display:"flex",
      flexDirection:"column",
      justifyContent:"flex-start",
      alignItems:"flex-start",
      marginLeft:"4vw",
      // border: "1px 1px solid black",
    },

    header3_3:{
      width:"13vw",
      height:"12vw",
      marginTop:"-2vh",
      marginLeft:"5vw",
      display:"flex",
      justifyContent:'center',
      alignItems:"center",
      alignSelf:"flex-start",
      border: "1px 1px solid black",
    },

    main: {
      position:"absolute",
      top:"23vh",
      boxSizing:"border-box",
      textAlign: "center",
    //   backgroundColor: "white",
      color: "black",
      height: "60vh",
      width: "97%",
      paddingLeft:"3%",
      // border: "1px 1px solid black",
      display:"flex",
      flexDirection:"column",
      justifyContent:"flex-start",
      alignItems:"center",
      //marginTop:"-23vh"
    },
    ligne_entete_note:{
      boxSizing:"border-box",
      width: "100%",
      height:"4%",
      color: "white",
      fontSize:"10px",
      backgroundColor:"#40689c",
      //borderRadius:"5px",
      // #dfede3,#bedbfa
      border: "2px 2px solid black",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },
    ligne_entete_note__matiere:{
      // border: "1px 1px solid black",
      boxSizing:"border-box",
      width:"24%",
      height:"100%",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center", 
    },
    ligne_entete_note__matiere2:{
      // border: "1px 1px solid black",
      boxSizing:"border-box",
      width:"24%",
      height:"100%",
      display:"flex",
      fontSize:"7px",
      flexDirection:"column",
      justifyContent:"flex-start",
      alignItems:"flex-start", 
    },
    ligne_entete_note__competence:{
      width:"21%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_note__moy:{
      width:"6%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },

    ligne_entete_note__moySeq:{
        width:"13%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        borderLeft:"1px",
        // border: "1px 1px solid black",
      },
    ligne_entete_note__coef:{
      width:"6%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_note__nxc:{
      width:"6%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_note__rang:{
      width:"6%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_note__borne:{
      width:"10%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_note__appreciation:{
      // border: "1px 1px solid black",
      width:"21%",
      height:"100%",
      justifyContent:"center",
      alignItems:"center",
      borderLeft:"1px",
    },
  
    ligne_entete_groupe__libelle:{
      // border: "1px 1px solid black",
      width:"45%",
     
    },
    ligne_entete_groupe__moy:{
      width:"6%",
     
      // borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_groupe__coef:{
      width:"6%",
     
      // borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_groupe__nxc:{
      width:"6%",
     
      // borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_groupe__rang:{
      width:"6%",
     
      // borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_groupe__borne:{
      width:"10%",
     
      // borderLeft:"1px",
      // border: "1px 1px solid black",
    },
    ligne_entete_groupe__appreciation:{
      // border: "1px 1px solid black",
      width:"21%",
     
      // borderLeft:"1px",
    },
  
    ligne_groupe:{
      boxSizing:"border-box",
      width: "100%",
      height:"4%",
    //color: "black",
      color: "white",
      fontSize:"12px",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:"gray"
    },
    ligne_note:{
      boxSizing:"border-box",
      width: "100%",
      height:"4%",
      color: "black",
      fontSize:"10px",
      border: "1px 1px solid black",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },
    footer: {
      position:"absolute",
      bottom:0,
     // marginTop:"-17.7vh",
      textAlign: "center",
      height: "30vh",
      minHeight:"20%",
      width: "100%",
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      alignItems:"center",
    },

    footer_ligne2: {
      textAlign: "center",
      height: "59.8%",
      width: "100%",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-around",
      alignItems:"center",
    },
    footer_ligne2_1: {
      boxSizing:"border-box",
      textAlign: "center",
      height: "100%",
      width: "60%",
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      alignItems:"center",
    },
    footer_ligne2_1_1: {
      boxSizing:"border-box",
      height: "49.8%",
      width: "100%",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-around",
      alignItems:"flex-start",
      // border: "1px 1px solid black",
    },
    footer_ligne2_1_1_box: {
      boxSizing:"border-box",
      width: "49.8%",
      height: "100%",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      border: "1px 1px solid black",
    },
    footer_ligne2_2: {
      textAlign: "center",
      height: "100%",
      width: "39.9%",
      justifyContent:"flex-start",
      alignItems:"flex-start",
      border: "1px 1px solid black",
    },
    footer_row1:{
      boxSizing:"border-box",
      width:"100%",
      height:"39.8%",
      display:"flex",
      flexDirection:"row",
      justifyContent:"space-around",
      alignItems:"center",
    },
    footer_row1_box:{
      boxSizing:"border-box",
      width:"19.8%",
      height:"100%",
      display:"flex",
      flexDirection:"column",
      border: "1px 1px solid black",
      justifyContent:"center",
      alignItems:"center",
    },
    box_header:{
      width:"100%",
      height:"20%",
      backgroundColor:"#ebebe0",
      fontSize:"9px",
      justifyContent:"center",
      alignItems:"center",
      fontFamily:"MyBold",
    },
    box_corps:{
      width:"100%",
      height:"80%",
      fontSize:"9px",
      display:"flex",
      flexDirection:"column",
      justifyContent:"flex-start",
      alignItems:"center",
    },
    box_corps_ligne:{
      width:"100%",
      height:"auto",
      fontSize:"11px",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },
    special_text:{
      backgroundColor:"#66b3ff",
      borderRadius:"2px",
    },
    special_textP:{
      backgroundColor:"#eb1e1ede",
      //backgroundColor:"#e15c2ade",
      borderRadius:"2px",
      color:"white"
    },
    title: {
      fontSize: 14,
      textAlign: "center",
    },
    text: {
      margin: 12,
      fontSize: 12,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },
   
  });
  

export default BulletinEleve;
