import react, { useState, useEffect, createContext, useContext } from 'react';
import { ref, remove, onValue, update, set, push } from 'firebase/database';

import { database } from '../firebase';

const blueprintContext = createContext();

export function useBlueprint() {
    return useContext(blueprintContext);
}

export function BlueprintProvider({ children }) {

    const [errorMessage, setErrorMessage] = useState("");
    const [blueprints, setBlueprints] = useState([]);


    // this function handles the creation of a blueprint given the blueprint object
    const createBlueprint = async (blueprintObject) => {

        const blueprintRef = await push(ref(database, "blueprints/"));

        await set(blueprintRef, blueprintObject);
    }


    // this function handles the deletion of a given blueprint ID
    const deleteBlueprint = async (blueprintId) => {
        try {
            const blueprintRef = ref(database, "blueprints/" + blueprintId);
            await remove(blueprintRef);

        } catch (error) {
            setErrorMessage(error);
        }
    }


    // this method handles the publish state
    const publishBlueprint = async (blueprintId, publishState) => {        
        try {
            const blueprintRef = ref(database, `blueprints/${blueprintId}`);
            await update(blueprintRef, { publish: !publishState});
            
        } catch (error) {
            console.error(error.message);
        }
    }
    

    // this method gets blueprint data of a given reference
    const getBlueprintData = async (blueprintId) => {
        try {
            const blueprintRef = ref(database, "blueprints/" + blueprintId);
            
            return new Promise((resolve, reject) => {
                onValue(blueprintRef, (snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val());
                    } else {
                        reject("Blueprint not found");
                    }
                });
            });
        } catch (error) {
            setErrorMessage(error);
        }
    }
    

    // download all the blueprints and store them in the blueprints list
    useEffect(() => {
        const blueprintRef = ref(database, "blueprints/");

        const listener = onValue(blueprintRef, (snapshot) => {
            const blueprintData = snapshot.val();
            if (blueprintData) {
                const blueprintList = Object.keys(blueprintData).map((key) => ({
                    id: key,
                    ...blueprintData[key]
                }));
                setBlueprints(blueprintList);
            }
        });

        return (listener);
    }, []);


    const value = {
        blueprints,
        errorMessage,
        deleteBlueprint,
        publishBlueprint,
        createBlueprint,
        getBlueprintData
    };

    return (
        <blueprintContext.Provider value={value}>
            { children }
        </blueprintContext.Provider>
    );

}




