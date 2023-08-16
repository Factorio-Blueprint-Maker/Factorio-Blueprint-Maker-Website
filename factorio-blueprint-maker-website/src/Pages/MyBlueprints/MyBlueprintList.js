import React from 'react';
import MyBlueprintCard  from './MyBlueprintCard';
import styles from "../../Styles/MyBlueprintList.module.scss";


function MyBlueprintList({ blueprintList, handleDeleteBlueprint, handlePublishBlueprint}) {

    return (

        <ul className={styles.blueprintListContainer}>
        {blueprintList.map((blueprint) => (
            <MyBlueprintCard
                key={blueprint.id} 
                blueprint={blueprint}
                handleDeleteBlueprint={handleDeleteBlueprint}
                handlePublishBlueprint={handlePublishBlueprint}
            />
        ))}
        </ul>

    );
  }

export default MyBlueprintList;