import React, { useState, useEffect }from "react";

import CardLayout from "./CardLayout";
import FavoriteBlueprintCard from "../Pages/MyFavorites/FavoriteBlueprintCard";

import { useBlueprint } from "../Context/blueprintContext.js";
import { useAuth } from "../Context/authContext.js"

import styles from '../Styles/MyBlueprints.module.scss'
import { useParams } from "react-router-dom";

const ExploreUserBlueprint = () => {

    const { userId } = useParams();

    const { blueprints, handleLikeChange } = useBlueprint();
    const { currentUser, getUsernameFromId } = useAuth();

    const [currentBlueprints, setCurrentBlueprints] = useState([]);
    const [username, setUsername] = useState("");
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    }, [])

    useEffect(() => {

        const filterBlueprints = () => {

            const filteredBlueprints = blueprints.filter((blueprint) => {
                return blueprint.userId === userId;
            });
            
            setCurrentBlueprints(filteredBlueprints);
        };
    
        filterBlueprints();

        getUsernameFromId(userId).then((username) => {
            setUsername(username);
        })

    }, [blueprints, currentUser]);


    return (
        <div className={styles.myBlueprintsContainer}>
            <div className={styles.upperContainer}>
                <h1>{username}'s Blueprints</h1>
            </div>
            <hr/>
            <div className={styles.myBlueprintsContent}>
                {currentBlueprints.length > 0 ? 
                    <CardLayout>
                        {currentBlueprints.map((blueprint) => (
                            <FavoriteBlueprintCard blueprint={blueprint} currentUser={currentUser} handleLikeChange={handleLikeChange} />
                        ))}
                    </CardLayout>

                : <p>{userId}</p>}
            </div>
        </div>
    );

}


export default ExploreUserBlueprint;