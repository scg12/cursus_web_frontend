import React from "react";
import { Page, Text, View, Image, Document, StyleSheet } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';
import { height } from "@mui/system";
import { yellow } from "@mui/material/colors";


var pageSet = [];

var el = {
    dateText:'Yaounde, le 14/03/2023',
    leftHeaders:["Republique Du Cameroun", "Paix-Travail-Patrie","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
    centerHeaders:["College francois xavier vogt", "Carte d'identite scolaire/school identity card"],
    rightHeaders:["Republic Of Cameroon", "Peace-Work-Fatherland","Ministere des enseignement secondaire","Delegation Regionale du centre", "Delegation Departementale du Mfoundi"],
    pageImages:["images/collegeVogt.png"],
    pageTitle: "" ,
    tableHeaderModel:["matricule", "nom et prenom(s)", "date naissance", "lieu naissance", "enrole en", "Nom Parent", "nouveau"],
    pageRows:[],
    pageNumber:0,
};



function CardListTemplate(props){
    const { t, i18n } = useTranslation();

    const CardHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:5, textTransform:"uppercase"}}>{props.page.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:5}}>{props.page.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.leftHeaders[2]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.rightHeaders[3]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.rightHeaders[4]}</Text>
            </View>
        );
    }

    const CardHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:5, textTransform:"uppercase"}}>{props.page.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:5 }}>{props.page.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.rightHeaders[2]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.rightHeaders[3]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:4, textTransform:"uppercase"}}>{props.page.rightHeaders[4]}</Text>
            </View>
        );
    }

    
    const CardHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontSize:9, textTransform:'uppercase', fontWeight:'heavy', color:'rgb(6, 83, 134)'}}>{props.page.centerHeaders[0]}</Text>
                <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.page.centerHeaders[1]}</Text>
            </View>
        );
    }


    const CardLOGO = (props) =>{
        return(
            <View style={props.style}>
                <Image style={props.imagestyle} src={props.imageSrc}/>
            </View>                           
        );
    }

    
    const CardPHOTO = (props) =>{
        return(            
            <Image style={props.photoStyle} src={props.imageSrc}/>                                    
        );
    }
   
    const CardTemplate = (props) =>{

        return (       
            <View size='A8' orientation='landscape' style={styles.page} key={0}>
                <View style={styles.header}>
                    <CardHeadLeft  style={styles.headerLeft}   page={props.page}   />
                    <CardLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.page.pageImages[0]}/>
                    <CardHeadRight style={styles.headerRight}  page={props.page}  />                                     
                </View>

                <View style = {styles.drapeau}>
                    <View style={styles.green}></View>
                    <View style={styles.red}></View>
                    <View style={styles.yellow}></View>
                </View>

                <CardHeadCenter style={styles.headerCenter} page={props.page}/>
                
                <View style={{backgroundImage:"images/collegeVogt.png" ,...styles.main}}>
                    <CardPHOTO photoStyle={styles.photoStyle} imageSrc={'images/profile.png'}/>

                    <View style={styles.cardInfo}>
                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Nom/Name:</Text>
                                <Text style={{fontSize:7, fontWeight:'heavy', color:'rgb(6, 83, 134)'}}>{props.eleve.nom}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Prenom/surname:</Text>
                                <Text style={{fontSize:7, fontWeight:'heavy', color:'rgb(6, 83, 134)'}}>{props.eleve.prenom}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Ne(e) Le/Born on:</Text>
                                <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.eleve.date_naissance}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                    <Text style={{fontSize:6, fontWeight:'black'}}>a/At:</Text>
                                    <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.eleve.lieu_naissance}</Text>
                            </View>                           
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Classe/Class:</Text>
                                <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.page.currentClasse}</Text>
                            </View>                            
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Matricule:</Text>
                                <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.eleve.matricule}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:7, fontWeight:'black', color:'red', paddingTop:'0.7vh'}}>Annee:</Text>
                                <Text style={{fontSize:8, fontWeight:'black', color:'red'}}>2022/2023</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.fieldZone}>
                        <View style={styles.StampStyle}>
                            <CardPHOTO photoStyle={styles.photoStyle} imageSrc={'images/cachet.png'}/>                        
                        </View>
                        
                        <View style={styles.signatureAndDate}>
                            <Text style={{fontSize:5, fontWeight:'black'}}>{props.page.dateText}</Text>
                        </View>
                    </View> 

                </View>
              
                <View style={styles.footer}>
                    <Text style={styles.adresse}> BP/PO BOX : 125 YAOUNDE Telephone : 222 52 52 63  </Text>
                </View>

            </View>
       
        );
    }

    return (
        <Document>
         { Array.from(props.pageSet,
          (el, index) => (
            <Page size="A4"  style={styles.page} key={index}>
                { Array.from(el.pageRows,
                    (row, index) => (
                        <CardTemplate page={el} eleve={row}/>
                    ))
                }                                
            </Page>
          ))}
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
        margin: 0,
        display: "flex",
        flexDirection: "row",
        flexWrap:'wrap',
        justifyContent:'center',
        /*alignItems:'center',*/
        width: "100%",
        height: "100%",      
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-start',
        height: '20%',
        width: "100%",
        marginBottom:'0.7vh'           
    },

    headerLeft:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        /*alignItems:'flex-start',*/
        marginTop:"0vh",
        alignSelf:'flex-start',
        /*marginLeft:"-1vw",*/
        width: "43%",
        
    },

    headerRight:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-end',
        alignItems:'center',
        marginTop:"0vh",
        alignSelf:'flex-start',
        width: "43%",
    },

    pageLogoContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
       
        marginTop:"0vh",
        alignSelf:'flex-end',
        width: "14%",
    },

    imagestyle:{
        width:'13vw',
        height:'13vw',
    },

    photoStyle:{
        width:'27vw',
        height:'27vw',
        borderRadius:3
    },

    cardInfo:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        alignSelf:"flex-start",
        
    },

    fieldZone:{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"flex-start",
        marginBottom:'1vh'
    },

    fieldZoneFrench:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
    },

    drapeau:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height: "6%",

    },

    green:{
        width:'33.3%',
        backgroundColor:'darkgreen'
    },

    red:{
        width:'33.3%',
        backgroundColor:'red'
    },

    yellow:{
        width:'33.3%',
        backgroundColor:'yellow'
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"3.3vh",
        height:"12%",
        paddingTop:"1vh",
        width:'100%',
        borderTop: "1px solid black",       
    },

    dateContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'flex-end',
        alignItems:'center',
        width:'97%'
    },

    dateStyle:{
        fontSize:10,
        fontFamily: "Times-Roman",
    }, 

    Pageheader:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'flex-start',
        marginBottom:'1.7vh',
        marginLeft:'1.7vw'
    },

   
    headercell:{      
        height:'15px',  
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row", 
        fontFamily: "Times-Roman"
    },

    cell:{
        height:'15px',
        display:"flex", 
        alignItems:'center', 
        flexDirection:"row",                 
    },

  

    main: {
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        backgroundColor: "white",
        height: "50%",
        width: "97%",
    },
    
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
        textAlign: "center",
        height: "7%",
        width: "100%",
        backgroundColor:'rgb(41, 131, 6)',
        
    },

    adresse:{
        color: "white",
        fontSize:4,
        fontWeight:'extrabold'
    }

  });

export default CardListTemplate;