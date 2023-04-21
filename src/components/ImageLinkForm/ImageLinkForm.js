import React from "react";
import './ImageLinkForm.css'
const ImageLinkForm = () => {
    return (
        <div>
            <p>
                {'This Magic Brain will detect faces in your picutres. Give it a try.'}
            </p>
            <div className="center">
                <div className="center form pa4 br3 shadow-5">
                    <input className="center f4 w-70" type="text" />
                    <button className="center w-30 grow f4 link ph3 pv2 dib white bg-light-purple">Detect</button>
                </div>    
            </div>
            

        </div>
    );
}

export default ImageLinkForm;