import React, { useEffect, useState } from "react";

import { useAuth } from "../../Context/authContext.js"
import { useBlueprint } from "../../Context/blueprintContext.js";

import MyBlueprintList from "./MyBlueprintList.js";
import ImportBlueprint from "./ImportBlueprint.js";

import styles from '../../Styles/MyBlueprints.module.scss'


const MyBlueprints = (props) => {

    // states
    const [currentBlueprints, setCurrentBlueprints] = useState([]);
    const [popupState, setPopupState] = useState(false);

    // contexts
    const { currentUser } = useAuth();
    const { deleteBlueprint, blueprints, publishBlueprint } = useBlueprint();


    const handleDeleteBlueprint = (blueprintId) => {
            deleteBlueprint(blueprintId);

            const updatedBlueprints = currentBlueprints.filter((blueprint) => blueprint.id !== blueprintId);
            setCurrentBlueprints(updatedBlueprints);
    }


    const handlePublishBlueprint = (blueprintId, publishState) => {
        publishBlueprint(blueprintId, publishState);
    };


    // filter the blueprints list to the users own blueprints
    useEffect(() => {

        const filterBlueprints = () => {

            const filteredBlueprints = blueprints.filter((blueprint) => {
                return blueprint.userId === currentUser.uid
            });
            
            setCurrentBlueprints(filteredBlueprints);
        };
    
        filterBlueprints();
    }, [currentUser, blueprints]);


    // this function toogles scrooling on popup
    const handleTogglePopup = () => {
        setPopupState(!popupState);
          if (!popupState) {
            document.body.style.overflow = "hidden"; 
        } else {
            document.body.style.overflow = ""; 
        }
    }
    
    
    return (
        <>  
        {popupState && <ImportBlueprint closePopup={handleTogglePopup} />}

        <div className={styles.myBlueprintsContainer}>
            <div className={styles.upperContainer}>
                <h1>My Blueprints</h1>
                <button onClick={handleTogglePopup}>Import Blueprint</button>
            </div>
            <hr/>
            <div className={styles.myBlueprintsContent}>
            {currentBlueprints.length > 0 ? <MyBlueprintList blueprintList={currentBlueprints} handleDeleteBlueprint={handleDeleteBlueprint} handlePublishBlueprint={handlePublishBlueprint}/> : <p>No blueprints where found ...</p>}
        </div>
        </div>
        </>
    );
}

export default MyBlueprints;