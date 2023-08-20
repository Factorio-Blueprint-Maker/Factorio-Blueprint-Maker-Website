import React, { useRef, useState } from "react";
import { serverTimestamp } from "firebase/database";

import { useAuth } from '../../Context/authContext.js';
import { useBlueprint } from '../../Context/blueprintContext.js'

import styles from '../../Styles/ImportBlueprint.module.scss';
import CloseIcon from '@mui/icons-material/Close'; 


const ImportBlueprint = ( {closePopup} ) => {

    const { currentUser } = useAuth();
    const { createBlueprint } = useBlueprint();

    const [errorMessage, setErrorMessage] = useState("");

    const blueprintTitle = useRef();
    const blueprintDescription = useRef();
    const blueprintString = useRef();
    const blueprintPublishState = useRef();

    
    const handleCreateBlueprint = async (e) => {

        e.preventDefault();
        
        try {
            // run input form validation
            if (!blueprintTitle.current.value || !blueprintDescription.current.value || !blueprintString.current.value) {
                throw new Error("There's empty input fields");
            }

            const blueprintObject = {
                blueprintTitle: blueprintTitle.current.value.trim(),
                blueprintDescription: blueprintDescription.current.value.trim(),
                blueprintString: blueprintString.current.value.trim(),
                publish: blueprintPublishState.current.checked,
                userId: currentUser.uid,
                createdAt: serverTimestamp(),
            }

            await createBlueprint(blueprintObject);

            closePopup();
            
        } catch (error) {
            setErrorMessage(error);
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.importBlueprintPopup}  onSubmit={(e) => handleCreateBlueprint(e)}>

                <button className={styles.closePopup} onClick={closePopup}><CloseIcon/></button>
                <h1>Import Blueprint</h1>
                <hr/>

                <label>Blueprint Title</label>
                <input type="text" ref={blueprintTitle} className={styles.titleField} placeholder="Blueprint Title" required/>
            
                <label>Blueprint Description</label>
                <textarea ref={blueprintDescription} className={styles.descriptionField} placeholder="Blueprint Description" required/><br/>

                <label>Import your blueprint string</label>
                <textarea ref={blueprintString} className={styles.stringField} placeholder="Blueprint String" required/><br/>

                <div className={styles.publishBlueprint}>
                    <label>Publish<input type="checkbox" ref={blueprintPublishState}/></label><br/>
                </div>

                <button className={styles.importButton} type="submit">Import</button>          

                {errorMessage}  
            </form>
   
        </div>
    );
}

export default ImportBlueprint;


