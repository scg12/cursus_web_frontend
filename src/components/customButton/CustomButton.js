import React from 'react'; 
function CustomButton(props) {
   return (
        <div id={props.id} className={(props.disable) ? 'buttonDefault disable ' + props.buttonStyle : 'buttonDefault ' + props.buttonStyle } onClick={(props.disable==false || props.disable==undefined) ? props.btnClickHandler:null} style={props.style}> 
            {(props.hasIconImg) ?
                <img src={props.imgSrc}  className={props.imgStyle}  alt="my image"/>
                :
                null
            }
                
            <div className={props.btnTextStyle}> 
                {props.btnText}
            </div>
        </div>
    );
}

export default CustomButton;