import React from 'react';
import { Link } from 'react-router-dom';

import styles from '../../Styles/MyBlueprintCard.module.scss';

import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function BlueprintCard({ blueprint, handleDeleteBlueprint, handlePublishBlueprint}) {

  
    return (
      <div className={styles.BlueprintCard}>
        <li key={blueprint.id}>
          <Link className={styles.BlueprintImage} to={`/explore/blueprint/${blueprint.id}`}>
            <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />
          </Link>

          <div className={styles.BlueprintTextContainer}>

            <h1>{blueprint.blueprintTitle}</h1>
            <p>{blueprint.blueprintDescription}</p>

          </div>

          <div className={styles.BlueprintLowerContainer}>
          <div class={styles.BlueprintStats}>
            <p>{ blueprint.likes ? Object.keys(blueprint.likes).length : 0 } Likes</p>
            <p>{ blueprint.favorites ? Object.keys(blueprint.favorites).length :0 } Favorites</p>
          </div>
            <button className={styles.deleteBlueprintBtn} onClick={() => handleDeleteBlueprint(blueprint.id)}><DeleteIcon/></button>
            <button className={styles.editBlueprintBtn}><EditIcon/></button>
            <button className={styles.publishBlueprintBtn} onClick={() => handlePublishBlueprint(blueprint.id, blueprint.publish)}>
              {blueprint.publish ? <UnpublishedIcon/> : <PublishIcon/>}
            </button>
          </div>
        </li>
      </div>
    );
  }




  export default BlueprintCard;