import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles/BlueprintCard.module.scss";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


function BlueprintCard({ blueprint, usernames, handleLikeChange, currentUser }) {

    return (
      <div className={styles.BlueprintCard}>
        <li>
          <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />

          <div className={styles.BlueprintTextContainer}>

            <h1>{blueprint.blueprintTitle}</h1>
            <p>{blueprint.blueprintDescription}</p>

          </div>

          <div className={styles.BlueprintLowerContainer}>

            <p>Created by: {usernames[blueprint.userId]}</p>

            <div className={styles.BlueprintLikesContainer}>

              <button onClick={currentUser && (() => handleLikeChange(blueprint.id))}>
                  {blueprint.likes && blueprint.likes[currentUser?.uid] ? <FavoriteIcon/> : <FavoriteBorderIcon/>}            
              </button>

              <p>{ blueprint.likes ? Object.keys(blueprint.likes).length : 0 }</p>

            </div>
          </div>
        </li>
      </div>
    );
  }




  export default BlueprintCard;