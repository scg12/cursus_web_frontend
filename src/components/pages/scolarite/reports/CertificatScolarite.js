import React from "react";
import { Page, Text, View, Image, Document, StyleSheet, Font} from "@react-pdf/renderer";
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


function CertificatScolarite(props){
    const { t, i18n } = useTranslation();


    const PageHeadLeft = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.leftHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10}}>{props.page.leftHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.leftHeaders[2]}</Text>
            </View>
        );
    }

    const PageHeadRight = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:10, textTransform:"uppercase"}}>{props.page.rightHeaders[2]}</Text>
            </View>
        );
    }

    
    const PageHeadCenter = (props) =>{
        return(
            <View style={props.style}>
                <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:12, textTransform:'uppercase', fontWeight:'heavy'}}>{props.page.centerHeaders[0]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:12}}>{props.page.centerHeaders[1]}</Text>
                <Text style={{fontFamily:"Times-Roman", fontSize:8.7}}>{props.page.centerHeaders[2]}</Text>
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


    const CertificatText = (props) =>{
       return(
            <View style={{display:"flex", flexDirection:"column", justifyContent:"flex-start"}}>
                <View style={{display:"flex", flexDirection:"row", marginLeft:'7vw'}}>
                    <Text style={{fontSize:12, textAlign:'justify'}}>Je soussigné {props.nomDirecteur},</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row", marginLeft:'3vw'}}>
                    <Text style={{fontSize:12, textAlign:'justify'}}>{props.qualite} de  {props.schoolName},</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row", marginTop:"1.7vh",  marginLeft:'7vw'}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Certifie que l'élève </Text> 
                    <Text style={{fontSize:13.7, textAlign:'justify', fontFamily:"MyBold"}}> {props.eleve.displayedName},</Text>
                </View> 
                
                <View style={{display:"flex", flexDirection:"row",marginTop:"1vh", marginLeft:'3vw'}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Né(e) le  </Text>
                    <Text style={{fontSize:13, textAlign:'justify', fontFamily:"MyBold"}}> {props.eleve.date_naissance}  </Text>
                    <Text style={{fontSize:12, textAlign:'justify'}}> à </Text>
                    <Text style={{fontSize:13, textAlign:'justify', fontFamily:"MyBold"}}> {props.eleve.lieu_naissance}, </Text>
                </View>

               {/* <View style={{display:"flex", flexDirection:"row"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Né(e) le {props.eleve.dateNaiss}  à {props.eleve.lieuNaiss}</Text>
                    </View>*/}

                <View style={{display:"flex", flexDirection:"row",marginTop:"1vh", marginLeft:'3vw'}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Est inscrit dans mon établissement pour le compte de l'année scolaire </Text>
                    <Text style={{fontSize:13,textAlign:'justify', fontFamily:"MyBold"}}> {props.anneeScolaire}.</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row",marginTop:"1vh", marginLeft:'3vw'}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>Ayant pour numéro matricule </Text>
                    <Text style={{fontSize:12, textAlign:'justify', fontFamily:"MyBold"}}> {props.eleve.matricule}.</Text>
                </View>

                <View style={{display:"flex", flexDirection:"row", marginLeft:'7vw', marginTop:"1vh"}}>
                    <Text style={{fontSize:12,textAlign:'justify'}}>En foi de quoi ce document est délivré pour servir et valoir ce que de droit.</Text>
                </View>
                
                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:"14vw", marginTop:"3vh", marginLeft:'3vw'}}>
                    <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:13, textTransform:'uppercase', fontWeight:'heavy'}}>Le {props.qualite}</Text>                       
                </View>
                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:"10vw", marginTop:"3vh", marginTop:"1vh"}}>
                    <Image style={{width:"23vw", height:"23vw"}} src={'images/cachet.png'}/>                       
                </View>

                <View style={{display:"flex", flexDirection:"row", justifyContent:"flex-end", marginRight:"12vw", marginTop:"0.7vh", marginLeft:'3vw'}}>
                    <Text style={{fontSize:12}}> {props.dateText}</Text>                       
                </View>         

            </View>
        );
   }

    return (
        <Page size='A4' style={styles.page} key={0}>
            <View style={styles.header}>
                <PageHeadLeft  style={styles.headerLeft}   page={props.pageSet}   />
                <PageLOGO      style={styles.pageLogoContainer} imagestyle={styles.imagestyle} imageSrc={props.pageSet.pageImages[0]}/>
                <PageHeadRight style={styles.headerRight}  page={props.pageSet}  />                                     
            </View>
            
            <PageHeadCenter style={styles.headerCenter} page={props.pageSet}/>
            
            <View style={styles.pageTitleContainer}>
                <Text style={{fontFamily:"Times-Roman", fontFamily:"MyBold", fontSize:13, textTransform:'uppercase', fontWeight:'heavy'}}>{props.pageSet.pageTitle}</Text>
            </View>
            
            <View style={styles.main}>
                <CertificatText dateText    = {props.dateText} 
                    anneeScolaire           = {props.anneeScolaire}
                    nomDirecteur            = {props.nomDirecteur}
                    qualite                 = {props.qualite}
                    schoolName              = {props.schoolName}
                    ville                   = {props.ville}
                    eleve                   = {props.eleve}                        
                />                  
            </View>
            
           {/* <View style={styles.footer}> 
                <Text>{props.pageSet.pageNumber} / {props.pageSet.length}</Text> 
            </View>   */} 
        </Page>
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

    imagestyle:{
        width:'12vw',
        height:'11vw',
        borderRadius:3
    },

    headerCenter:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        marginBottom:"2vh",
        height:"4.7%",
        width:'100%',
        borderBottom: "1px solid black",       
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

   
    pageTitleContainer:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'center',
        alignItems:'center',
        width:'85%',
        height:'3%',
        border:"1.3px solid black",
        
        //borderBottom: "1.3px solid black",
        borderRadius:'3px',
        marginBottom:"3vh",       
    },

    titleStyle:{
        fontSize:12,
        fontWeight:'ultrabold',
        textTransform:'uppercase',
        fontFamily:"Times-Roman",
    },

    headerColumnStyle:{
        display: "flex",
        flexDirection: "row",
        justifyContent: 'space-evenly',
        alignItems:'center',
        width:'97%',
        height:'2.7vh',
        backgroundColor:'rgb(6, 83, 134)',
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
        alignItems:"center"
    }, 

    main: {
        textAlign: "center",
        backgroundColor: "white",
        height: "70%",
        width: "97%",
        color:'black',
        paddingLeft:'2vw'
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

export default CertificatScolarite;