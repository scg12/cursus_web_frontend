import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import Filigrane from "../../../filigrane/Filigrane";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import { useTranslation } from "react-i18next";
import '../../../../translation/i18n';


Font.register({
    family: "MyBold",
    // fontWeight: '1200', 
    src: fontBold 
  });
  Font.register({
    family: "MyItalic",
    src: fontItalic 
  });




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
                <Text style={{fontSize:9, fontFamily:"MyBold", textTransform:'uppercase', fontWeight:'ultrabold', color:'rgb(6, 83, 134)'}}>{props.page.centerHeaders[0]}</Text>
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
            <View size='A8' orientation='landscape' style={styles.cardPage} key={0}>
                <Filigrane photoStyle={{width:"20vw", height:"17vw"}} style={{zIndex:0, marginTop:"1vh"}} />                    
                <View style={styles.header}>
                    <CardHeadLeft  style={styles.headerLeft}   page={props.page}   />
                    <CardLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.page.pageImagesDefault[0]}/>
                    <CardLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyleDefault} imageSrc={props.page.pageImages[0]}/>              
                    <CardHeadRight style={styles.headerRight}  page={props.page}  />                                     
                </View>
                <View style = {styles.drapeau}>
                    <View style={styles.green}></View>
                    <View style={styles.red}> <Image style={styles.etoile} src={'images/etoile.png'}/> </View>
                    <View style={styles.yellow}></View>
                </View>
                
                <CardHeadCenter style={styles.headerCenter} page={props.page}/>
                
                <View style={styles.main}>
                    <View style={{display:"flex", flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                        <CardPHOTO photoStyle={styles.photoStyle} imageSrc={props.eleve.photo_url.length>0? props.eleve.photo_url :'images/photo4Fois4P.png'}/>
                        <Image style={styles.QRCodeStyle} src={'images/QRCode.png'}/>  
                    </View>
                    

                    <View style={styles.cardInfo}>
                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, fontWeight:'black'}}>Nom/Name:</Text>
                                <Text style={{fontSize:7.7, fontFamily:'MyBold', color:'rgb(6, 83, 134)', textTransform:'uppercase', paddingBottom:'1px'}}>{props.eleve.nom}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, color:'black'}}>Prenom/surname:</Text>
                                <Text style={{fontSize:7.7, fontFamily:'MyBold', color:'rgb(6, 83, 134)', textTransform:'uppercase', paddingBottom:'1px'}}>{props.eleve.prenom}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, color:'black'}}>Ne(e) Le/Born on:</Text>
                                <Text style={{fontSize:7, fontFamily:'MyBold', color:'rgb(6, 83, 134)',}}>{props.eleve.date_naissance}</Text>
                            </View>
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                    <Text style={{fontSize:6, color:'black'}}>A/At:</Text>
                                    <Text style={{fontSize:7, fontFamily:'MyBold', color:'rgb(6, 83, 134)'}}>{props.eleve.lieu_naissance}</Text>
                            </View>                           
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, color:'black'}}>Classe/Class:</Text>
                                <Text style={{fontSize:7, fontFamily:'MyBold', color:'rgb(6, 83, 134)'}}>{props.page.currentClasse}</Text>
                            </View>                            
                        </View>

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:6, color:'black'}}>Matricule:</Text>
                                <Text style={{fontSize:7, fontFamily:'MyBold', color:'rgb(6, 83, 134)'}}>{props.eleve.matricule}</Text>
                            </View>
                        </View>
                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:7, color:'black', color:'red', paddingTop:'1px'}}>Annee:</Text>
                                <Text style={{fontSize:8, fontWeight:'black', color:'red'}}>{props.page.anneeScolaire}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.fieldZone}>
                        <View style={styles.StampStyle}>
                            <CardPHOTO photoStyle={styles.cachetStyle} imageSrc={'images/cachet.png'}/>                        
                        </View>
                        
                        <View style={styles.signatureAndDate}>
                            <Text style={{fontSize:5, fontWeight:'black'}}>{props.page.dateText}</Text>
                        </View>
                    </View> 

                </View>
              
                <View style={styles.footer}>
                    <Text style={styles.adresse}>{props.page.centerHeaders[2]} </Text>
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
        alignItems:'center',
        width: "100%",
        height: "100%",      
    },

    cardPage: {
        display: "flex",
        flexDirection: "row",
        flexWrap:'wrap',
        justifyContent:'center',
        width: "40vw",
        height: "17.7vh",
        border: "1.5px solid black",
        borderRadius:5,
        marginLeft:'1.3vw',
        marginBottom:'2vh'

    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-start',
        height: '20%',
        width: "100%",
        marginBottom:'1.3px'           
    },

    headerLeft:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignSelf:'center',
        width: "43%",        
    },

    headerRight:{
        textAlign:'center',
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        width: "43%",        
    },

    pageLogoContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-end',
        width: "14%",
    },

    imagestyle:{
        position:"absolute",
        top:"-3.3vh",
        left:0,
        zIndex:3,       
        width:'6vw',
        height:'5vw',
        // alignSelf:'flex-end'
        marginLeft:"2vw",
    },

    imagestyleDefault:{
        position:"absolute",
        top:"-3.3vh",
        left:0,
        zIndex:0,       
        width:'6vw',
        height:'5vw',
        // alignSelf:'flex-end',
        marginLeft:"-3vw"
    },

    cachetStyle:{
        width:'10vw',
        height:'10vw',
        borderRadius:"7vw"
    },

    photoStyle:{
        width:50,
        height:50,
        borderRadius:3,
        marginRight:"1vw"
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
        marginBottom:'2px',
        position:'relative',
        zIndex:2,
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
        height: '0.7vh',
        borderTop: "1px solid black",

    },

    green:{
        width:'33.3%',
        height:'100%',
        backgroundColor:'darkgreen'
    },

    red:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'33.3%',
        height:'100%',
        backgroundColor:'red',
        display: "flex",
    },

    yellow:{
        width:'33.3%',
        height:'100%',
        backgroundColor:'yellow'
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"3.3px",
        height:"12%",
        paddingTop:"1px",
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
        marginBottom:'1.7px',
        marginLeft:'1.7px'
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
        // backgroundColor: "white",
        height: "50%",
        width: "97%",
    },

    StampStyle:{
        position:'relative',
        zIndex:1,

    },
    
    footer: {
        position:'absolute',
        bottom:0,
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center',
        textAlign: "center",
        height: "7%",
        width: "100%",
        /*backgroundColor:'rgb(41, 131, 6)',*/
        backgroundColor:'rgb(3, 48, 78)',
        borderBottomLeftRadius:6,
        borderBottomRightRadius:6
        
    },

    adresse:{
        color: "white",
        fontSize:6.3,
        fontWeight:'extrabold'
    },

    etoile:{
        width:'1.5vw',
        height:'1.5vw'
    },

    QRCodeStyle:{
        marginTop:"1vh",
        marginLeft:"-1vh",
        width:20,
        height:20,
    }

});

export default CardListTemplate;