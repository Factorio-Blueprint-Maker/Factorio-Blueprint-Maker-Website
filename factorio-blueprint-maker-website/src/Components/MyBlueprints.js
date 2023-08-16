import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext.js"
import { onValue, ref, remove, update } from "firebase/database";
import { database } from "../firebase";
import MyBlueprintList from "./MyBlueprintList";
import styles from '../Styles/MyBlueprints.module.scss'
import ImportBlueprint from "./ImportBlueprint.js";

const MyBlueprints = (props) => {

    const [currentBlueprints, setCurrentBlueprints] = useState([]);
    const { currentUser } = useAuth();


    const handleDeleteBlueprint = async (blueprintId) => {
        try {
            const blueprintRef = ref(database, `blueprints/${blueprintId}`);
            await remove(blueprintRef);

            const updatedBlueprints = currentBlueprints.filter((blueprint) => blueprint.id !== blueprintId);
            setCurrentBlueprints(updatedBlueprints);

        } catch (error) {
            console.error(error.message);
        }
    }

    const handlePublishBlueprint = async (blueprintId, publishState) => {
        const currentPublishState = publishState;
        const blueprintRef = ref(database, `blueprints/${blueprintId}`);
        
        try {
            await update(blueprintRef, { publish: !currentPublishState});
            
        } catch (error) {
            console.error(error.message);
        }
    };

    // load the blueprints from the database
    useEffect(() => {

        // the database reference to the blueprints objects
        const blueprintRef = ref(database, "blueprints/");

        // get data from the blueprint reference
        const listener = onValue(blueprintRef, (snapshot) => {

            const data = snapshot.val();

            // check if there is any data
            if (data) {
                const blueprintList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key]
                }));

                // Filter blueprints based on the current user's uid
                const filteredBlueprints = blueprintList.filter((blueprint) => {
                    return blueprint.userId === currentUser.uid;
                });

                setCurrentBlueprints(filteredBlueprints);
            }
        });

        return () => {
            listener();
        };
    }, [currentUser]);

    const [popupState, setPopupState] = useState(false);

    const handleTogglePopup = () => {
        setPopupState(!popupState);

          // Toggle body scrolling
          if (!popupState) {
            document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
            document.body.style.overflow = ""; // Enable scrolling
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