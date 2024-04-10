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



function Billet_ES(props) {

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
                <Text style={{fontSize:9, fontFamily:"MyBold", textTransform:'uppercase', fontWeight:'ultrabold', color:'black'}}>{props.page.pageTitle}</Text>
                {/* <Text style={{fontSize:7, fontWeight:'heavy'}}>{props.page.pageTitle}</Text> */}
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

    const BilletTemplate = (props) =>{

        return (       
            <View size='A8' orientation='landscape' style={styles.cardPage} key={0}>
                <Filigrane photoStyle={{width:"26vw", height:"23vw"}} style={{zIndex:0, marginTop:"0vh",overflowY:"clip"}} />                    
                
                
                <CardHeadCenter style={styles.headerCenter} page={props.page}/>
                
                <View style={styles.main}>
                    <View style={styles.cardInfo}>
                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:8, fontWeight:'black', textTransform:'uppercase',}}>{t("form_nom")} :</Text>
                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black', textTransform:'uppercase', paddingBottom:'1px'}}>{props.page.billetInfos.nom_only}</Text>
                            </View>
                        </View>


                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:8, fontWeight:'black', textTransform:'uppercase',}}>{t("form_prenom")} :</Text>
                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black', textTransform:'uppercase', paddingBottom:'1px'}}>{props.page.billetInfos.prenom_only}</Text>
                            </View>
                        </View>
  

                        <View style={styles.fieldZone}>
                            <View style={styles.fieldZoneFrench}>
                                <Text style={{fontSize:8, color:'black', textTransform:'uppercase',}}>{t("class")} :</Text>
                                <Text style={{fontSize:9, fontFamily:'MyBold', color:'black'}}> {props.page.currentClasse}</Text>
                            </View>
                        </View>


                        

                        {(props.page.billetInfos.status == false) ?

                            (props.page.billetInfos.type_duree=="jour") ?
                                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                                    
                                    <View style={styles.fieldZone}>
                                        <View style={styles.fieldZoneFrench}>
                                                <Text style={{fontSize:8, color:'black', textTransform:'uppercase',}}>{t("date_deb")}:</Text>
                                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black'}}>{props.page.billetInfos.date_deb}</Text>
                                        </View>                           
                                    </View>

                                    <View style={styles.fieldZone}>
                                        <View style={styles.fieldZoneFrench}>
                                                <Text style={{fontSize:8, color:'black', textTransform:'uppercase',}}>{t("date_fin")}:</Text>
                                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black'}}>{props.page.billetInfos.date_fin}</Text>
                                        </View>                           
                                    </View>

                                </View>
                                :
                                <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                                    
                                    <View style={styles.fieldZone}>
                                        <View style={styles.fieldZoneFrench}>
                                                <Text style={{fontSize:8, color:'black', textTransform:'uppercase',}}>{t("heure_deb")}:</Text>
                                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black'}}>{props.page.billetInfos.date_deb}</Text>
                                        </View>                           
                                    </View>

                                    <View style={styles.fieldZone}>
                                        <View style={styles.fieldZoneFrench}>
                                                <Text style={{fontSize:8, color:'black', textTransform:'uppercase',}}>{t("heure_deb")}:</Text>
                                                <Text style={{fontSize:8, fontFamily:'MyBold', color:'black'}}>{props.page.billetInfos.date_fin}</Text>
                                        </View>                           
                                    </View>

                                </View>
                            
                            :                            

                            (props.page.billetInfos.type_duree=="jour") ?
                                <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start"}}>
                                    <View>
                                        <Text style={{fontSize:"1.7vw", fontFamily:'MyBold', marginBottom:"1vh"}}> {t('justify_exit_permission')} </Text>
                                    </View>
                                    <View>
                                        <Text style={{fontSize:"1.7vw", fontFamily:'MyBold',}}> {props.page.billetInfos.date_deb} {t("to")} : {props.page.billetInfos.date_fin}</Text>
                                    </View>
                                </View>
                                :
                                <View style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start"}}>
                                    <View>
                                        <Text style={{fontSize:"1.7vw", fontFamily:'MyBold', marginBottom:"1vh"}}>{t('justify_absence')} : {props.page.billetInfos.date_jour} </Text>
                                    </View> 
                                    <View>
                                        <Text style={{fontSize:"1.7vw", fontFamily:'MyBold',}}>{t('from_de')} : {props.page.billetInfos.date_deb} {t("to_a")} : {props.page.billetInfos.date_fin}</Text>
                                    </View>                                    
                                
                                </View>

                        }

                        <View style={{...styles.fieldZoneP,}}>
                            <View style={styles.StampStyle}>
                                <CardPHOTO photoStyle={styles.cachetStyle} imageSrc={'images/cachet.png'}/>                        
                            </View>
                            
                            <View style={styles.signatureAndDate}>
                                <Text style={{fontSize:8, fontWeight:'black'}}>{props.page.dateText}</Text>
                            </View>
                        </View> 

                    </View>

                </View>

            </View>               
 
        );
    }

    return (
        <Document>
         <Page size="A4"  style={styles.page} key={0}>
                <BilletTemplate page={props.pageSet} />                          
            </Page>
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
        width: "43vw",
        height: "18.7vh",
        border: "1.5px solid black",
        borderRadius:3,
        marginLeft:'1.3vw',
        marginBottom:'2vh',
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
        borderRadius:"7vw",
        marginTop:"-3.7vh"
    },

    photoStyle:{
        width:'8.7vw',
        height:'8.7vw',
        borderRadius:"1.7vw",
        marginRight:"1vw"
    },

    cardInfo:{
        display: "flex",
        flexDirection: "column",
        justifyContent:'flex-start',
        alignSelf:"flex-start",   
         width :"90%"     
    },

    fieldZone:{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"flex-start",
        marginBottom:'1.3vh',
        position:'relative',
        zIndex:2,
    },

    fieldZoneP:{
        display: "flex",
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"flex-end",
        marginBottom:'1.3vh',
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
        marginBottom:"1.3vh",
        height:"12%",
        paddingTop:"1px",
        width:'50%',
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

    signatureAndDate:{
        marginLeft:"2vh",
        marginTop:"-3vh"
    }

});

export default Billet_ES;