import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from "../../Styles/BlueprintCard.module.scss";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../../Context/authContext';

function FavoriteBlueprintCard({ blueprint, handleLikeChange, currentUser }) {

  const { authenticated, getUsernameFromId } = useAuth();
  const [blueprintCreator, setBlueprintCreator] = useState("");

  useEffect(() => {
    getUsernameFromId(blueprint.userId).then((username) => {setBlueprintCreator(username)});
  }, [blueprint, getUsernameFromId])

  return (

    <div className={styles.BlueprintCard}>
      <li>

        <Link className={styles.BlueprintImage} to={`/explore/blueprint/${blueprint.id}`}>
        <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />
        </Link>
        <div className={styles.BlueprintTextContainer}>

          <h1>{blueprint.blueprintTitle}</h1>
          <p>{blueprint.blueprintDescription}</p>

        </div>
        <div className={styles.BlueprintLowerContainer}>

          <p>Created by: {blueprintCreator}</p>

          <div className={styles.BlueprintLikesContainer}>

            <button onClick={currentUser && (() => handleLikeChange(blueprint.id))}>
              {authenticated ? 
                (blueprint.likes && blueprint.likes[currentUser?.uid] ? <FavoriteIcon/> : <FavoriteBorderIcon/>)
              : <FavoriteIcon/> }
            </button>

            <p>{ blueprint.likes ? Object.keys(blueprint.likes).length : 0 }</p>

          </div>
        </div>
      </li>
    </div>
  );
}




  export default FavoriteBlueprintCard;