import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
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



function RecuPaiementFrais(props){
    const { t, i18n } = useTranslation();

    const RecuCachet = (props) =>{
        return(            
            <Image style={props.photoStyle} src={props.imageSrc}/>                                    
        );
    }
    

    const RecuTemplate = (props) =>{

        return (       
            <View  style={{display:"flex", flexDirection:"column", marginTop:"3vh", width:"63vw", height:"21.7vh", justifyContent:"flex-start", borderStyle:"solid", borderWidth:"2px", borderRadius:3}} key={0}>
                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", alignSelf:"center", width:"93%", marginTop:"1.3vh"}}>
                    
                    <View style={{width:"24vw",height:"2vh", borderBottomStyle:"solid", borderBottomWidth:"1px", borderBottomColor:"black"}}>
                        <Text style={{fontWeight:"900", fontSize:10, textTransform:"uppercase"}}>ANNEE SCOLAIRE : {props.recu.anneeScolaire}</Text>
                    </View>
                    
                    <View style={{color:"white", /*backgroundColor:"#80abd6",*/ backgroundColor:"#5576b5", borderRadius:2.3, height:"2vh", width:"23vw", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>RECU N°: {props.recu.numeroRecu}</Text>
                    </View>                                     
                </View>

                <View style={{display:"flex", flexDirection:"row", alignSelf:"center", justifyContent:"center", alignItems:"center", borderStyle:"solid", borderWidth:"1px", width:"93%", height:"2.3vh", marginTop:"1.3vh"}}>
                    <Text style={{fontFamily:"MyBold", fontSize:11, textTransform:"uppercase"}}>RECU DE PAIEMENT DES FRAIS DE SCOLARITE</Text>
                </View>


                <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start",alignSelf:"center", marginTop:"1vh", width:"97%"}}>
                    <View style={{display:"flex", flexDirection:"row", width:"80%"}}>
                        <Text style={{fontFamily:"Times-Roman", width:"17.7vw", fontSize:9, textTransform:"uppercase"}}>Nom(s) & Prenom(s) :</Text>
                        <Text style={{fontFamily:"Times-Roman", marginLeft:"1vw", fontSize:10, fontFamily:"MyBold" }}>{props.recu.eleveNom}</Text>
                    </View>

                    <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh", width:"80%"}}>
                        <Text style={{fontFamily:"Times-Roman", width:"17.7vw", fontSize:9, textTransform:"uppercase"}}>Classe :</Text>
                        <Text style={{fontFamily:"Times-Roman", marginLeft:"1vw", fontSize:10, fontFamily:"MyBold"}}>{props.recu.eleveClasse}</Text>

                        <View style={{display:"flex", flexDirection:"row",  marginLeft:"3vw", marginTop:"0 .7vh"}}>
                            <Text style={{fontFamily:"Times-Roman",  width:"10vw", fontSize:9, textTransform:"uppercase"}}>Matricule :</Text>
                            <Text style={{fontFamily:"Times-Roman", marginLeft:"1vw",fontSize:10, fontFamily:"MyBold"}}>{props.recu.matricule}</Text>
                        </View>
                    </View>

                    <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh", width:"97%"}}>
                        <Text style={{fontFamily:"Times-Roman", width:"17.7vw", fontSize:9, textTransform:"uppercase"}}>Montant Verse :</Text>
                        <Text style={{fontFamily:"Times-Roman", marginLeft:"1vw", fontSize:10, fontFamily:"MyBold"}}>{props.recu.montant} FCFA</Text>
                    </View>

                    <View style={{display:"flex", flexDirection:"row", marginTop:"0.7vh"}}>
                        <Text style={{fontFamily:"Times-Roman",  width:"17.7vw", fontSize:9, textTransform:"uppercase"}}>Tranche associee :</Text>
                        <Text style={{fontFamily:"Times-Roman", marginLeft:"1vw",fontSize:10, fontFamily:"MyBold"}}>{props.recu.tranchePaye}</Text>
                    </View>

                    

                </View>

                <View style={{...styles.fieldZone, alignItems:"flex-end",marginTop:"-3.7vh", width:"93%"}}>
                    <View style={styles.StampStyle}>
                        <RecuCachet photoStyle={styles.photoStyle} imageSrc={'images/cachet.png'}/>                        
                    </View>
                    
                    <View style={{...styles.signatureAndDate,marginTop:"-3vh"}}>
                        <Text style={{fontSize:9, fontWeight:'black'}}>{props.recu.dateVerse}</Text>
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
            <Page size="A4"   style={styles.page} key={1}>
                <RecuTemplate recu={props.recuInfo} />  
            </Page>
          
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
        margin: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        alignItems:"center",
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
        width:'12vw',
        height:'12vw',
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
        backgroundColor:'gray', 
        position:"absolute",
        bottom:0       
    },

    adresse:{
        color: "white",
        fontSize:7,
        fontWeight:'extrabold'
    }

  });

export default RecuPaiementFrais;