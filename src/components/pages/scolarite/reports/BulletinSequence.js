import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
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

function BulletinSequence(props) {

    function truncate(string,limit){
        if(string.length <= limit) return string;
        else return string.slice(0,limit)+"...";
    }

    return (
        <Document>
        {Array.from(props.data.eleveNotes ,
        (el, index) => (
            <Page size="A4"  style={styles.page} key={index}>
                <View style={styles.header}>
                <View style={styles.header1}>
                    <View style={styles.header1_1}>
                        <View style={[styles.header1_ligne,{}]}><Text style={{fontSize:"10px"}}>{props.data.entete_fr.pays}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px",fontWeight:"900"}]}><Text>{props.data.entete_fr.ministere}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"10px"}]}><Text>{props.data.entete_fr.etab}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>{props.data.entete_fr.devise}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>BP:{props.data.entete_fr.bp} Tel:{props.data.entete_fr.tel}</Text></View> 
                    </View>
                    <View style={styles.header1_2}><Image src={props.data.etabLogo} /></View>
                    <View style={styles.header1_3}>
                    <View style={[styles.header1_ligne,{}]}><Text style={{fontSize:"10px"}}>{props.data.entete_en.pays}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px",fontWeight:"900"}]}><Text>{props.data.entete_en.ministere}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"10px"}]}><Text>{props.data.entete_en.etab}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>{props.data.entete_en.devise}</Text></View>
                        <View style={[styles.header1_ligne,{fontSize:"8px"}]}><Text>POBOX:{props.data.entete_en.bp} Tel:{props.data.entete_en.tel}</Text></View> 
                    </View>
                </View>
                
                <View style={styles.header2}>
                    <View style={styles.header2_cadre}>
                        <Text>{props.data.titreBulletin.titre}</Text>
                    </View>             
                </View>

                <View style={styles.header3}>
                    {/* {el.resultat.split("~~~").filter((item,id)=> id==1).map((it,k)=>(<View key={k} break><Text>{it}</Text></View>))} */}
                    <View style={styles.header3_1}>
                    {el.resultat.split("~~~").filter((item,id)=> id===1).map((it,k)=>(
                    it.split("²²").map((elem,i)=>(
                        ((i===0)&&
                        <View style={{textAlign:"left",marginLeft:"5px"}} key={i}>
                        <Text>Nom et Prénom: {elem} {el.resultat.split("²²")[1]}</Text>
                        <Text>Sexe: {el.resultat.split("²²")[3]}</Text>
                        <Text>Né(e) le: {el.resultat.split("²²")[5]} A: {el.resultat.split("²²")[6].split("~~~")[0]}</Text>
                        <Text>Matricule: {el.resultat.split("²²")[2]} Redoublant:{el.resultat.split("²²")[4]} </Text>
                        </View>
                        )
                    //  ||(i===3&&<View key={i} break><Text>Sexe: {elem} </Text></View>)
                    //  ||(i===5&&<View key={i} break><Text>Né(e) le: {elem}</Text><Text> A: {el.resultat.split("²²")[6].split("~~~")[0]} </Text></View>)
                    //  ||(i===2&&<View key={i} break><Text>Matricule: {elem} Redoublant:{el.resultat.split("²²")[4]} </Text></View>)


                    ))))}
                    </View>
                    <View style={[styles.header3_2,{textAlign:"right"}]}>
                    <Text>Classe: {props.data.classeLabel}</Text>
                    <Text>Effectif: {props.data.eleveNotes.length}</Text>
                    <Text>Année Scolaire: {props.data.entete_fr.annee_scolaire}</Text>
                    <Text>Prof Principal: {props.data.profPrincipal}</Text>
                    </View>
                    <View style={[styles.header3_3,{margin:"2px"}]}>
                        <Text>Photo</Text>
                    </View>
                    {/* <Image src={Lebron} /> */}
                </View>
                </View>
                <View style={styles.main}>
                <View style={styles.ligne_entete_note}>
                        <View style={styles.ligne_entete_note__matiere}><Text>MATIERE</Text></View>
                        <View style={styles.ligne_entete_note__competence}><Text>COMPETENCE VISEE</Text></View>
                        <View style={styles.ligne_entete_note__moy}><Text>MOY</Text></View>
                        <View style={styles.ligne_entete_note__coef}><Text>COEF</Text></View>
                        <View style={styles.ligne_entete_note__nxc}><Text>NXC</Text></View>
                        <View style={styles.ligne_entete_note__rang}><Text>RANG</Text></View>
                        <View style={styles.ligne_entete_note__borne}><Text>BORNES</Text></View>
                        <View style={styles.ligne_entete_note__appreciation}><Text>APPRECIATION</Text></View>
                </View>
                {
                    el.resultat.split("~~~").map( 
                    (notes,id) =>  
                    (id<el.resultat.split("~~~").length-1&&
                        notes.split("~~").map((note,id_note)=>(
                        (id>1&&id_note===notes.split("~~").length-1&&
                        <View style={styles.ligne_groupe} key={id_note+20000}>
                            <View key={id_note+30000} style={styles.ligne_entete_groupe__libelle}>
                            {
                            props.data.groupeRecaps.map((group,id_group)=> (
                                group.resultat.split("~~").map((item_group,id_item)=>
                                (
                                id_item===id-1&&<Text style={{fontFamily:"MyBold"}} key={id_item}>Groupe: {item_group.split("²²")[3]}</Text>))
                                )
                            )
                            }
                            </View>
                            <View key={id_note+40000} style={[styles.ligne_entete_groupe__moy,{fontFamily:"MyBold"}]}>
                            <Text>{note.split("²²")[4]}</Text>
                            </View>
                            <View key={id_note+50000} style={[styles.ligne_entete_groupe__coef,{fontFamily:"MyBold"}]}>
                            <Text>{note.split("²²")[0]}</Text>
                            </View>
                            <View key={id_note+60000} style={[styles.ligne_entete_groupe__nxc,{fontFamily:"MyBold"}]}>
                            <Text>{note.split("²²")[2]}</Text>
                            </View>
                            <View key={id_note+70000} style={[styles.ligne_entete_groupe__rang,{fontFamily:"MyBold"}]}>
                            <Text>{note.split("²²")[3]}</Text>
                            </View>
                            <View key={id_note+80000} style={[styles.ligne_entete_groupe__borne,{fontFamily:"MyBold"}]}>

                            {
                            props.data.groupeRecaps.map((group,id_group)=> (
                                group.resultat.split("~~").map((item_group,id_item)=>
                                (
                                id_item===id-1&&<Text key={id_item}>[{item_group.split("²²")[0]},
                                {item_group.split("²²")[1]}]</Text>))
                                )
                            )
                            }
                            </View>
                            <View key={id_note+90000} style={styles.ligne_entete_groupe__appreciation}>
                            <Text>{note.split("²²")[5]}</Text>
                            </View>
                            {/* <View key={id_note} break><Text>{note}</Text><Text> </Text></View> */}
                        </View>
                        
                        )
                        ||(
                            note.split("²²").map((mark,id_mark)=>(
                            id>1&&id<el.resultat.split("~~~").length-1&&id_note<notes.split("~~").length-1&&id_mark===0&&
                        <View key={id_note+1000} style={styles.ligne_note}>
                            
                            {
                            props.data.noteRecaps.map((recap_note,id_group)=> (
                                recap_note.resultat.split("~~").map((item_recap,id_recap)=>
                                (
                                id_recap===parseInt(note.split("²²")[4])&&
                                    (
                                        <View key={id_note} style={styles.ligne_entete_note__matiere2}>
                                        <Text style={{fontFamily:"MyBold"}} >{truncate(item_recap.split("²²")[4],35)}</Text>
                                        <Text style={{fontFamily:"MyItalic"}} >MBALLA Serge</Text>
                                        </View>
                                    )
                                ))
                                )
                            )
                            }
                            
                            <View key={id_note+2000} style={styles.ligne_entete_note__competence}>
                            <Text>Calculer rapidement</Text>
                            </View>
                            <View key={id_note+3000} style={styles.ligne_entete_note__moy}>
                            <Text>{mark}</Text>
                            </View>
                            <View key={id_note+4000} style={styles.ligne_entete_note__coef}>
                            {
                            props.data.noteRecaps.map((recap_note,id_group)=> (
                                recap_note.resultat.split("~~").map((item_recap,id_recap)=>
                                (
                                id_recap===parseInt(note.split("²²")[4])&&<Text key={id_recap}>{item_recap.split("²²")[0]}</Text>))
                                )
                            )
                            }
                            </View>
                            <View key={id_note+5000} style={styles.ligne_entete_note__nxc}>
                            <Text>{note.split("²²")[1]}</Text>
                            </View>
                            <View key={id_note+6000} style={styles.ligne_entete_note__rang}>
                            <Text>{note.split("²²")[3]}</Text>
                            </View>
                            <View key={id_note+7000} style={styles.ligne_entete_note__borne}>

                            {
                            props.data.noteRecaps.map((recap_note,id_group)=> (
                                recap_note.resultat.split("~~").map((item_recap,id_recap)=>
                                (
                                id_recap===parseInt(note.split("²²")[4])&&<Text key={id_recap}>[{item_recap.split("²²")[1]},
                                {item_recap.split("²²")[2]}]</Text>))
                                )
                            )
                            }
                            </View>
                            <View key={id_note+8000} style={styles.ligne_entete_note__appreciation}>
                            <Text>Très Bien</Text>
                            </View>
                        </View>
                            ))
                            )
                        )
                        )
                    )
                    // ||(id===el.resultat.split("~~~").length-1&&
                    // <View key={id} break><Text>Fini {notes}</Text></View>)
                    )
            } 

                </View>
                <View style={styles.footer}> 
                    <View style={styles.footer_row1}>
                    <View style={styles.footer_row1_box}>
                        <View style={styles.box_header}><Text>RESULTAT DE L'ELEVE</Text></View>

                        
                    {el.resultat.split("~~~").filter((item,id)=> id===el.resultat.split("~~~").length-1).map((it,k)=>(
                    it.split("²²").map((elem,i)=>(
                        (
                        i===0&&
                        <View key={i} style={styles.box_corps}>
                            <View style={styles.box_corps_ligne}>
                            <Text style={{fontFamily:"MyBold"}}>Total Points:  </Text>
                            <Text style={[styles.special_text,{fontFamily:"MyBold"}]}>{it.split("²²")[3]}</Text>
                            </View>
                            <View style={styles.box_corps_ligne}>
                            <Text style={{fontFamily:"MyBold"}}>Total Coefs:  </Text>
                            <Text style={[styles.special_text,{fontFamily:"MyBold"}]}>{it.split("²²")[1]}</Text>
                            </View>
                            <View style={styles.box_corps_ligne}>
                            <Text style={{fontFamily:"MyBold"}}>Moyenne:  </Text>
                            <Text style={[styles.special_text,{fontFamily:"MyBold"}]}>{it.split("²²")[2]}</Text>
                            </View>
                            <View style={styles.box_corps_ligne}>
                            <Text style={{fontFamily:"MyBold"}}>Rang:  </Text>
                            <Text style={[styles.special_text,{fontFamily:"MyBold"}]}>{it.split("²²")[5]}</Text>
                            </View>
                        </View>
                        )
                    ))))}
                    
                    </View>
                    <View style={styles.footer_row1_box}>
                        <View style={styles.box_header}><Text>RESULTATS DE LA CLASSE</Text></View>
                        <View style={styles.box_corps}></View>
                    </View>
                    <View style={styles.footer_row1_box}>
                        <View style={styles.box_header}><Text>DISCIPLINE</Text></View>
                        <View style={styles.box_corps}></View>
                    </View>
                    <View style={styles.footer_row1_box}>
                        <View style={styles.box_header}><Text>RAPPEL MOYENNE</Text></View>
                        <View style={styles.box_corps}>         
                        </View>
                    </View>
                    <View style={styles.footer_row1_box}>
                    <View style={styles.box_header}><Text>TRAVAIL</Text></View>
                        <View style={styles.box_corps}></View>
                    </View>
                    </View>

                    <View style={styles.footer_ligne2}>
                    <View style={styles.footer_ligne2_1}>
                        <View style={styles.footer_ligne2_1_1}>
                            <View style={styles.footer_ligne2_1_1_box}>
                                <View style={styles.box_header}><Text>APPRECIATION TRAVAIL</Text></View>
                                <View style={styles.box_corps}></View>
                            </View>
                            <View style={styles.footer_ligne2_1_1_box}>
                                <View style={styles.box_header}><Text>OBSERVATIONS</Text></View>
                                <View style={styles.box_corps}></View>
                            </View> 
                        </View>
                        <View style={styles.footer_ligne2_1_1}>
                            <View style={styles.footer_ligne2_1_1_box}>
                            <View style={styles.box_header}><Text>VISA DES PARENTS</Text></View>
                                <View style={styles.box_corps}></View>
                            </View>
                            <View style={styles.footer_ligne2_1_1_box}>
                            <View style={styles.box_header}><Text>VISA PROF PRINCIPAL</Text></View>
                                <View style={styles.box_corps}></View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer_ligne2_2}>
                        <View style={styles.box_header}><Text>Visa Principal</Text></View>
                        <View style={styles.box_corps}></View>
                    </View>
                    </View>
                    {/* <View style={styles.footer_row2_3}></View> */}

                    {/* <View style={styles.footer_row2_1}></View>
                    <View style={styles.footer_row2_2}></View> */}
                </View>       

                </Page>
            ))}
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
      width: "100 vw",
      height: "100 vh",
      justifyContent:"space-between",
      fontSize:"12px",
  
    },
    header: {
      boxSizing:"border-box",
      height: "20%",
      minHeight:"10%",
      width: "100%",
  
      display: "flex",
      justifyContent:"space-between",
    },
    header1: {
      boxSizing: "border-box",
      margin: 0,
      marginTop:"5px",
      textAlign: "center",
      height:"50%",
      minHeight:"30px",
      width: "100%",
      // border: "1px 1px solid black",
      display: "flex",
      flexDirection:"row",
      justifyContent:"space-between",
    },
    header1_1:{
      width:"37%",
      display: "flex",
      flexDirection:"column",
      justifyContent:"space-between",
    },
    header1_2:{
      width:"25%",
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
      // border: "1px 1px solid black",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
    },
    header2_cadre:{
      border: "2px 2px solid black",
      borderRadius:"5px",
      backgroundColor:"#ebebe0",
      width:"50%",
      height:"90%",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
    },
    header3: {
      textAlign: "center",
      height:"40%",
      minHeight:"30px",
      width: "97%",
      paddingLeft:"3%",
      // border: "1px 1px solid black",
      display: "flex",
      flexDirection:"row",
      justifyContent:"space-between",
      boxSizing: "border-box",
      margin: 0,
    },
    header3_1:{
      width:"50%",
      height:"100%",
      // border: "1px 1px solid black",
    },
    header3_2:{
      width:"30%",
      height:"100%",
      // border: "1px 1px solid black",
    },
    header3_3:{
      width:"18%",
      height:"85%",
      marginBottom:"15%",
      marginLeft:"10%",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      border: "1px 1px solid black",
    },
    main: {
      boxSizing:"border-box",
      textAlign: "center",
      backgroundColor: "white",
      color: "black",
      height: "55%",
      width: "97%",
      paddingLeft:"3%",
      // border: "1px 1px solid black",
      display:"flex",
      flexDirection:"column",
      justifyContent:"flex-start",
      alignItems:"center",
    },
    ligne_entete_note:{
      boxSizing:"border-box",
      width: "100%",
      height:"4%",
      color: "black",
      fontSize:"10px",
      backgroundColor:"#40689c",
      borderRadius:"5px",
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
      color: "black",
      fontSize:"12px",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
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
      textAlign: "center",
      height: "25%",
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
      fontSize:"12px",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },
    special_text:{
      backgroundColor:"#66b3ff",
      borderRadius:"2px",
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
  

export default BulletinSequence;
