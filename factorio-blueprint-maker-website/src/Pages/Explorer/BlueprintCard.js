import React, {memo} from 'react';
import { Link } from 'react-router-dom';
import styles from "../../Styles/BlueprintCard.module.scss";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../../Context/authContext';

const BlueprintCard = memo(({ blueprint, usernames, handleLikeChange, currentUser }) => {

    const { authenticated } = useAuth();

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

            <p><Link to={`/explore/${blueprint.userId}`}>Created by: {usernames[blueprint.userId]}</Link></p>

            <div className={styles.BlueprintLikesContainer}>

            <button onClick={authenticated ? () => handleLikeChange(blueprint.id) : undefined}>
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
  });




  export default BlueprintCard;