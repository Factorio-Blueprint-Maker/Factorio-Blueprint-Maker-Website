import React from 'react';
import styles from "../Styles/MyBlueprintList.module.scss";
import MyBlueprintCard  from './MyBlueprintCard';

function MyBlueprintList({ blueprintList, handleDeleteBlueprint, handlePublishBlueprint}) {

    return (

        <ul className={styles.blueprintListContainer}>
        {blueprintList.map((blueprint) => (
            <MyBlueprintCard
                blueprint={blueprint}
                handleDeleteBlueprint={handleDeleteBlueprint}
                handlePublishBlueprint={handlePublishBlueprint}
            />
        ))}
        </ul>

    );
  }

export default MyBlueprintList;