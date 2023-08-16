import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue, get, set } from "firebase/database";
import { database } from "../firebase.js";
import styles from '../Styles/BlueprintDetail.module.scss';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '../Context/authContext.js';

export const BlueprintDetail = () => {

  // get the blueprintId
  const { blueprintId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [blueprintData, setBlueprintData] = useState({});
  const [favoriteState, setFavoriteState] = useState(false);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  // queries the blueprint data from the database
  const getBlueprintData = () => {

    // the database reference for the blueprint objects
    const blueprintRef = ref(database, "blueprints/" + blueprintId);

    // get the data at blueprintRef from the database
    onValue(blueprintRef, (snapshot) => {

      // check if there are any blueprints
      if (snapshot.exists()) {

        const blueprintData = snapshot.val();
        setBlueprintData(blueprintData); 
        
      } else {
        setError("Blueprint not found");
      }

      setLoading(false);
      
    }, (error) => {
      setError("Error fetching blueprint data");
      setLoading(false);
    });
  }

  const handleFavorite = async () => {
    const favoriteRef = await ref(database, "users/" + currentUser?.uid + "/favorites/" + blueprintId);

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
    getBlueprintData();

    const favoriteRef = ref(database, "users/" + currentUser?.uid + "/favorites/" + blueprintId);
    get(favoriteRef).then(snapshot => {
      setFavoriteState(snapshot.exists()); 
    });


  }, []);

  useEffect(() => {
    if (!blueprintData.publish && blueprintData.userId && blueprintData.userId !== currentUser?.uid) {
      navigate('/explore');
    }
  }, [blueprintData, currentUser, navigate]);
  


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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