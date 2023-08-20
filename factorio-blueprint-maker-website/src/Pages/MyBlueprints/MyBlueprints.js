import React, { useEffect, useState } from "react";

import { useAuth } from "../../Context/authContext.js"
import { useBlueprint } from "../../Context/blueprintContext.js";

import ImportBlueprint from "./ImportBlueprint.js";
import CardLayout from "../../Components/CardLayout.js";
import MyBlueprintCard from "./MyBlueprintCard.js"
import LockIcon from '@mui/icons-material/Lock';

import styles from '../../Styles/MyBlueprints.module.scss'
import Backdrop from '@mui/material/Backdrop';


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
    }

    useEffect(() => {
        const filteredBlueprints = blueprints.filter((blueprint) => {
            return blueprint.userId === currentUser.uid;
        })

        setCurrentBlueprints(filteredBlueprints);
    }, [currentUser, blueprints])


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
        {popupState && 
        <>
            <ImportBlueprint closePopup={handleTogglePopup} />
            <Backdrop
            sx={{ color: '#fff', zIndex: 2 }}
            open={popupState}
            ></Backdrop>
        </>
        }
        
        <div className={styles.myBlueprintsContainer}>
            <div className={styles.upperContainer}>
                <h1><p><LockIcon fontSize="inherit"/></p>My Blueprints</h1>
                <button onClick={handleTogglePopup}>Import Blueprint</button>
            </div>
            <hr/>
            <div className={styles.myBlueprintsContent}>
                {currentBlueprints.length > 0 ? 
                            <CardLayout>
                                {currentBlueprints.map((blueprint) => (
                                    <MyBlueprintCard
                                    key={blueprint.id} 
                                    blueprint={blueprint}
                                    handleDeleteBlueprint={handleDeleteBlueprint}
                                    handlePublishBlueprint={handlePublishBlueprint}
                                />
                                ))}
                            </CardLayout>
                
                : <p>No blueprints where found ...</p>}
        </div>
        </div>
        </>
    );
}

export default MyBlueprints;