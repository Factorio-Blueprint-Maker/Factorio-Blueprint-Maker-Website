import React, { useState, useEffect }from "react";

import CardLayout from "../../Components/CardLayout";
import FavoriteBlueprintCard from "./FavoriteBlueprintCard";

import { useBlueprint } from "../../Context/blueprintContext.js";
import { useAuth } from "../../Context/authContext.js"

import styles from '../../Styles/MyBlueprints.module.scss'

const MyFavoriteBlueprints = () => {

    const { blueprints, handleLikeChange } = useBlueprint();
    const { currentUser } = useAuth();

    const [currentBlueprints, setCurrentBlueprints] = useState([]);

    
    useEffect(() => {

        const filterBlueprints = () => {

            const filteredBlueprints = blueprints.filter((blueprint) => {
                return blueprint.favorites && blueprint.favorites[currentUser?.uid];
            });
            
            setCurrentBlueprints(filteredBlueprints);
        };
    
        filterBlueprints();

    }, [blueprints, currentUser]);


    return (
        <div className={styles.myBlueprintsContainer}>
            <div className={styles.upperContainer}>
                <h1>My Favorite Blueprints</h1>
            </div>
            <hr/>
            <div className={styles.myBlueprintsContent}>
                {currentBlueprints.length > 0 ? 
                    <CardLayout>
                        {currentBlueprints.map((blueprint) => (
                            <FavoriteBlueprintCard blueprint={blueprint} currentUser={currentUser} handleLikeChange={handleLikeChange} />
                        ))}
                    </CardLayout>

                : <p>No favorite blueprints was found</p>}
            </div>
        </div>
    );

}


export default MyFavoriteBlueprints;