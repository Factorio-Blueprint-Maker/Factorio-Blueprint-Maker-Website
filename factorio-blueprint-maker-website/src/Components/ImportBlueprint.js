import React, { useState, useEffect } from "react";
import styles from '../Styles/ImportBlueprint.module.scss';
import CloseIcon from '@mui/icons-material/Close'; 
import { useAuth } from '../Context/authContext.js';
import { ref, set, push, serverTimestamp } from "firebase/database";
import { database } from '../firebase.js';


const ImportBlueprint = ({closePopup}) => {

    const { currentUser } = useAuth();

    const [blueprintTitle, setBlueprintTitle] = useState("");
    const [blueprintDescription, setBlueprintDescription] = useState("");
    const [blueprintString, setBlueprintString] = useState("");
    const [blueprintPublishState, setBlueprintPublishState] = useState(false);


    const handleCreateBlueprint = async () => {

        const blueprintData = {
            blueprintTitle: blueprintTitle,
            blueprintDescription: blueprintDescription,
            blueprintString: blueprintString,
            publish: blueprintPublishState,
            userId: currentUser.uid,
            createdAt: serverTimestamp(),
            likes: [],
            favorites: []
        }

        const databaseRef = await push(ref(database, "blueprints/"));
        await set(databaseRef, blueprintData);

        closePopup();

    }

    return (
        <div className={styles.blur}>
            <div className={styles.importBlueprintPopup}>
                <button className={styles.closePopup} onClick={closePopup}><CloseIcon/></button>
                <h1>Import Blueprint</h1>
                <hr/>

                <label>Blueprint Title</label>
                <input type="text" className={styles.titleField} placeholder="Blueprint Title" onChange={(e) => setBlueprintTitle(e.target.value)} />
            
                <label>Blueprint Description</label>
                <textarea className={styles.descriptionField} placeholder="Blueprint Description" onChange={(e) => setBlueprintDescription(e.target.value)} /><br/>

                <label>Import your blueprint string</label>
                <textarea className={styles.stringField} placeholder="Blueprint String" onChange={(e) => setBlueprintString(e.target.value)} /><br/>

                <div className={styles.publishBlueprint}>
                    <label>Publish<input type="checkbox" onChange={(e) => setBlueprintPublishState(e.target.checked)}/></label><br/>
                </div>

                <button className={styles.importButton} type="button" onClick={handleCreateBlueprint}>Import</button>            
            </div>
        </div>
    );
}

export default ImportBlueprint;


