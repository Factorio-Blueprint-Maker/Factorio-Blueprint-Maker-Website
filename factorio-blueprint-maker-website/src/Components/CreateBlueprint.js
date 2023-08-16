import React, { useState } from 'react';
import { useAuth } from '../Context/authContext.js';
import { ref, set, push, serverTimestamp } from "firebase/database";
import { database } from '../firebase.js';


const CreateBlueprint = () => {

    const { currentUser } = useAuth();

    const [blueprintTitle, setBlueprintTitle] = useState("");
    const [blueprintDescription, setBlueprintDescription] = useState("");
    const [blueprintString, setBlueprintString] = useState("");
    const [blueprintPublishState, setBlueprintPublishState] = useState(false);


    const handleCreateBlueprint = () => {

        const blueprintData = {
            blueprintTitle: blueprintTitle,
            blueprintDescription: blueprintDescription,
            blueprintString: blueprintString,
            publish: blueprintPublishState,
            userId: currentUser.uid,
            createdAt: serverTimestamp(),
        }

        const databaseRef = push(ref(database, "blueprints/"));
        set(databaseRef, blueprintData);
    }

    return (
        <>
            <input type="text" placeholder="Blueprint Title" onChange={(e) => setBlueprintTitle(e.target.value)} />
            
            <textarea placeholder="Blueprint Description" onChange={(e) => setBlueprintDescription(e.target.value)} /><br/>

            <textarea placeholder="Blueprint String" onChange={(e) => setBlueprintString(e.target.value)} /><br/>

            <label>Publish<input type="checkbox" onChange={(e) => setBlueprintPublishState(e.target.checked)}/></label><br/>

            <button type="button" onClick={handleCreateBlueprint}>Create Blueprint</button>
        </>
        
    );

}

export default CreateBlueprint;