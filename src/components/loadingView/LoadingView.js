import React from 'react';
import { useTranslation } from "react-i18next";



function LoadingView(props) {

    const { t, i18n } = useTranslation();
    
    return(
        <div style={{display:"flex", flexDirection:"center", justifyContent:"center", alignItems:"center"}}>            
            <div style={{ alignSelf: 'center',position:'absolute', top:"56.7vh",  fontSize:'1.2vw', fontWeight:'800', color:'#4d4848', zIndex:'1207',marginTop:'-5.7vh',...props.loadingTextStyle}}> 
                {props.loadinText}...
            </div>                    
            

            <div style={{   
                alignSelf: 'center',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '13vw',
                height: '3.13vh',
                position: 'absolute',
                top:'54.3vh',
                backgroundColor: 'white',
                zIndex: 1207,
                overflow: 'hidden', ...props.loadingImgStyle
            }}
            >
                <img src='images/Loading2.gif' alt="loading..." style={{width:'24.1vw'}} />
            </div>                    

        </div>

    );
} 
export default LoadingView;




