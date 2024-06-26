import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
import fontBold from "../../../../fonts/timesBold.ttf";
import fontItalic from "../../../../fonts/timesItalic.ttf";
import Filigrane from "../../../filigrane/Filigrane";
import { formatCurrency } from "../../../../store/SharedData/UtilFonctions";
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

var pageSet = [];

var page = {
  
};


function ListingPaiements(props){
    const { t, i18n } = useTranslation();


    const PageHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10}}>{props.data.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.leftHeaders[2]}</Text>
            </View>
        );
    }

    const PageHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.data.rightHeaders[2]}</Text>
            </View>
        );
    }

    
    const PageHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy'}}>{props.data.centerHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>{props.data.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7}}>{props.data.centerHeaders[2]}</Text>
            </View>
        );
    }


    const PageLOGO = (props) =>{
        return(
            <View style={props.style}>
                <Image style={props.imagestyle} src={props.imageSrc}/>
            </View>                           
        );
    }


    const EmptyRow = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"row", justifyContent:"center",alignItems:"center", borderBottom: "1px solid black", width:"97%"}}>
               <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"Times-Roman"}}> R. A.S </Text>
            </View>
        );        

    }


    const Photo = (props) =>{
        return(            
            <Image style={props.photoStyle} src={props.imageSrc}/>                                    
        );
    }

    const EleveInfo = (props) =>{
        return(
            <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-start",marginBottom:"3vh", width:'100%'}}>
                <Photo photoStyle ={{...styles.photoStyle,alignSelf:"center", borderStyle:"solid", borderWidth:"1px", marginRight:"2vw", borderRadius:3}} imageSrc={props.eleve.photo_url.length>0? props.eleve.photo_url : 'images/photo4Fois4P.png'}/>
                
                <View style={{display:"flex", flexDirection:"row", backgroundColor:"lightgray", opacity:0.73, padding:7, borderRadius:3, width:"100%", marginRight:"3vw", paddingBottom:"3vh"}}> 
                    <View style={{display:"flex", flexDirection:"column", height:"5vh"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold", textTransform:"uppercase"}}>{t('nom_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.nom}  </Text>
                        </View>
                    
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold", textTransform:"uppercase"}}>{t('class_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.classeLabel}  </Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold", textTransform:"uppercase"}}>{t("age_M")} : </Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.age}  </Text>
                        </View>                   
                    </View>
                
                    <View style={{display:"flex", flexDirection:"column", height:"2vh", marginLeft:"2vw", paddingBottom:"2.7vh", alignSelf:"flex-end"}}>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy', fontFamily:"MyBold", textTransform:"uppercase"}}>{t('matricule_M')} :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{props.eleve.matricule}</Text>
                        </View>
                        <View style={{display:"flex",flexDirection:"row", marginTop:"2vh"}}>
                            <Text style={{fontSize:"1.3vh", fontWeight:'heavy' , fontFamily:"MyBold", textTransform:"uppercase"}}>{t('redouble')}  :</Text>
                            <Text style={{fontSize:"1.3vh", marginLeft:"0.3vw"}}>{(props.eleve.redouble)? t("yes"):t("no")}</Text>
                        </View>                    
                    </View>
                  
                </View>
                
            </View>
        );     

    }


    const PaiementRowHeader = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'12vw',  justifyContent:'flex-start',...styles.cell}}><Text>{t("date_versement")}</Text></View>
                <View style={{width:'14vw', justifyContent:'flex-start',...styles.cell}}><Text>{t("montant_verse")}   </Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{t("tranche")}   </Text></View>
            </View>             
        );
    }


    const PaiementRow = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'12vw',  justifyContent:'flex-start',...styles.cell}}><Text>{props.paiement.date}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{formatCurrency(parseInt(props.paiement.montant))} FCFA   </Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{props.paiement.libelle}        </Text></View>
            </View>             
        );
    }

    const PaiementRowFooter = (props) =>{
        return(
            <View style={props.style}>
                <View style={{width:'12vw',  justifyContent:'flex-start',...styles.cell, textTransform:"uppercase"}}><Text>{t("total_paye_M")}</Text></View>
                <View style={{width:'12vw',  justifyContent:'flex-start',...styles.cell, textTransform:"uppercase"}}><Text>{""}</Text></View>
                <View style={{width:'12vw', justifyContent:'flex-start',...styles.cell}}><Text>{formatCurrency(props.totalVerse)} FCFA  </Text></View>
            </View>             
        );
    }

    function calculSommeTotale(listPaiements){
        var somme = 0;
        listPaiements.map((paiement)=>{
            somme += parseInt(paiement.montant);
        })
        return somme;
    }

   

    return (
        <Document>
        
            <Page size="A4"  style={styles.page} key={1}>
                <Filigrane photoStyle ={{width:"76vw", height:"70vw"}} style={{zIndex:0}}/>                    
                <View style={styles.header}>
                    <PageHeadLeft  style={styles.headerLeft}  data={props.pageSet}   />
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.pageSet.pageImages[0]}/>
                    <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyleDefault} imageSrc={props.pageSet.pageImagesDefault[0]}/>
                    <PageHeadRight style={styles.headerRight} data={props.pageSet}  />                                     
                </View>
                
                <PageHeadCenter style={styles.headerCenter} data={props.pageSet}/>

                <View style={{display:"flex", width:"100vw", flexDirection:"row", justifyContent:"flex-end", alignItems:"center", marginRight:"3vw", marginBottom:"1vh" }}>
                    <Text style={{fontSize:"1.3vh", /*textTransform:'uppercase',*/ fontWeight:'heavy', fontFamily:"Times-Roman"}}>{props.pageSet.dateText}</Text>
                </View>
                
                
                <View style={styles.pageTitleContainer}>
                    <Text style={styles.titleStyle}>{props.pageSet.pageTitle}</Text>
                </View>
                

                <View style={styles.main}>                    
                    <EleveInfo eleve={props.pageSet.paiementData.eleveInfo} classeLabel={props.pageSet.classeLabel}/>
                    <PaiementRowHeader style={styles.headerColumnStyle} />
                    { Array.from(props.pageSet.paiementData.listePaiements,
                        (paie, index) => (
                            <PaiementRow style={styles.row} paiement={paie}/>                            
                        ))
                    } 
                    <PaiementRowFooter style={styles.footerColumnStyle} totalVerse={calculSommeTotale(props.pageSet.paiementData.listePaiements)} />
                    
                   
                </View>
              
                <View style={styles.footer}> 
                    <Text>{1} / {1}</Text> 
                </View>    
            </Page>
        
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
      margin: 0,
      /*textAlign: "justify",
      fontFamily: "Times-Roman",*/
      display: "flex",
      flexDirection: "column",
      justifyContent:'center',
      alignItems:'center',
      width: "98vw",
      height: "100%",      
    },

    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent:'center',
        alignSelf:'flex-start',
        height: '7%',
        width: "100%",
           
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

    imagestyleDefault:{
        position:"absolute",
        top:"-9.7vh",
        left:0,
        zIndex:2,       
        width :'14vw',
        height:'13vw',
        borderRadius:3,
        marginLeft:"-7vw"
    },

    imagestyle:{
        position:"absolute",
        top:"-9.7vh",
        left:30,
        zIndex:3,       
        width :'14vw',
        height:'13vw',
        borderRadius:3
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"1.3vh",
        height:"4.7%",
        width:'100%',
        borderBottom: "2px solid black",       
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

    photoStyle:{
        width:'15vw',
        height:'13vw',
        borderRadius:3
    },

   
    pageTitleContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        width:'auto',
        height:'2%',
        borderBottom: "1.3px solid black",
        marginBottom:"2vh",   
            
    },

    titleStyle:{
        fontSize:12,
        fontWeight:'ultrabold',
        textTransform:'uppercase',
        fontFamily:"Times-Roman",
        fontFamily:"Times-Roman", 
        fontFamily:"MyBold", 
        fontSize:12, 
        textTransform:'uppercase', 
        fontWeight:'heavy'
    },

    headerColumnStyle:{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems:'center',
        width:'97%',
        height:'2.3vh',
        backgroundColor:'rgb(6, 83, 134)',
        textTransform:'uppercase',
        fontSize:8,
        fontWeight:'heavy',
        color:'white'
    },

    footerColumnStyle:{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems:'center',
        width:'97%',
        height:'2.3vh',
        backgroundColor:'black',
        textTransform:'uppercase',
        fontSize:8,
        fontWeight:'heavy',
        color:'white'
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

    row:{
        display: "flex",
        flexDirection: "row",
        fontSize:9,
        color:'black',
        justifyContent:'space-evenly',
        alignItems:"center",
        borderBottom: "1px solid black",
        width:"97%"
    }, 

    main: {
        display:"flex",
        flexDirection:"column",
        textAlign: "center",
        // backgroundColor: "white",
        height: "70%",
        width: "97%",
        color:'black',
    },
    
    footer: {
        textAlign: "center",
        height: "3.3%",
        width: "100%",
        color: "black",
        fontSize:9
    },

    
   /* text: {
      margin: 12,
      fontSize: 12,
      textAlign: "justify",
      fontFamily: "Times-Roman",
    },*/
  
  });

export default ListingPaiements;