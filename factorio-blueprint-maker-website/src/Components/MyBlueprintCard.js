import React from 'react';
import styles from '../Styles/MyBlueprintCard.module.scss';


function BlueprintCard({ blueprint, handleDeleteBlueprint, handlePublishBlueprint}) {

  
    return (
      <div className={styles.BlueprintCard}>
        <li key={blueprint.id}>
          <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />

          <div className={styles.BlueprintTextContainer}>

            <h1>{blueprint.blueprintTitle}</h1>
            <p>{blueprint.blueprintDescription}</p>

          </div>

          <div className={styles.BlueprintLowerContainer}>
            <button className={styles.deleteBlueprintBtn} onClick={() => handleDeleteBlueprint(blueprint.id)}>Delete</button>
            <button className={styles.publishBlueprintBtn} onClick={() => handlePublishBlueprint(blueprint.id, blueprint.publish)}>
              {blueprint.publish ? "Unpublish" : "Publish"}
            </button>
          </div>
        </li>
      </div>
    );
  }




  export default BlueprintCard;