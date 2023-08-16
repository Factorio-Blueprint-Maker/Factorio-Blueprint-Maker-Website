import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, get, set } from "firebase/database";
import { database } from "../firebase.js";
import styles from '../Styles/BlueprintDetail.module.scss';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '../Context/authContext.js';
import { useBlueprint } from '../Context/blueprintContext.js';

export const BlueprintDetail = () => {

  // get the blueprintId
  const { blueprintId } = useParams();

  const [blueprintData, setBlueprintData] = useState({});
  const [favoriteState, setFavoriteState] = useState(false);

  const { currentUser } = useAuth();
  const { getBlueprintData } = useBlueprint();

  const navigate = useNavigate();

  const handleFavorite = async () => {
    const favoriteRef = await ref(database, "blueprints/" + blueprintId + "/favorites/" + currentUser.uid);

    const snapshot = await get(favoriteRef);

    if (snapshot.exists()) {
      set(favoriteRef, null);
      setFavoriteState(false); 
    } else {
      set(favoriteRef, true);
      setFavoriteState(true); 
    }
  }


  // call getBlueprintData on load
  useEffect(() => {
    const handleGetBlueprintData = async () => {
        const blueprintData = await getBlueprintData(blueprintId);
        setBlueprintData(blueprintData);
    }

    handleGetBlueprintData();

    const favoriteRef = ref(database, "blueprints/" + blueprintId + "/favorites/" + currentUser.uid);

    get(favoriteRef).then(snapshot => {
      setFavoriteState(snapshot.exists()); 
    });

  }, [blueprintId, currentUser, getBlueprintData]);

  useEffect(() => {
    if (!blueprintData.publish && blueprintData.userId && blueprintData.userId !== currentUser?.uid) {
      navigate('/explore');
    }
  }, [blueprintData, currentUser, navigate]);
  

  return (
    <>
      <div className={styles.blueprintDetailContainer}>
      <h2>Blueprint Details</h2>
      <p>Blueprint Name: {blueprintData.blueprintTitle}</p>
      <p>Blueprint Description: {blueprintData.blueprintDescription}</p>
      <p>Blueprint String: {blueprintData.blueprintString}</p>
      <button className={styles.favoriteButton} onClick={handleFavorite}>
      
     {favoriteState ? <StarIcon/> : <StarBorderIcon/>}
      
    </button>
  </div> 
   </>
  );
};

export default BlueprintDetail;