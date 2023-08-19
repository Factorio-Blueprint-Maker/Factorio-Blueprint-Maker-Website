import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue } from "firebase/database";
import { database } from "../firebase.js";
import styles from '../Styles/BlueprintDetail.module.scss';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '../Context/authContext.js';
import { useBlueprint } from '../Context/blueprintContext.js';


const  BlueprintDetail = () => {

  const { blueprintId } = useParams();

  const [blueprintData, setBlueprintData] = useState({});
  const [ blueprintCreator, setBlueprintCreator ] = useState("");
  const [favoriteState, setFavoriteState] = useState(false);

  const { currentUser, getUsernameFromId } = useAuth();
  const { getBlueprintData, handleFavorite } = useBlueprint();

  const navigate = useNavigate();

  // get the 
  useEffect(() => {

    const favoriteRef = ref(database, "blueprints/" + blueprintId + "/favorites/" + currentUser?.uid);

    // Update favoriteState when favorite status changes
    const handleFavoriteStatusChange = (snapshot) => {
      setFavoriteState(snapshot.exists());
    };

    // Set up listener for favorite status changes
    const favoriteStatusListener = onValue(favoriteRef, handleFavoriteStatusChange);

    return () => {
      // Clean up the listener when the component unmounts
      favoriteStatusListener();
    };
  }, [blueprintId, currentUser]);


  // get blueprint data by calling the getBlueprintData from blueprintContext
  useEffect(() => {

    const handleGetBlueprintData = async () => {
        const blueprintData = await getBlueprintData(blueprintId);
        
        // set the blueprint data to the result
        setBlueprintData(blueprintData);
    }

    handleGetBlueprintData();

  }, [blueprintId, currentUser, getBlueprintData]);


  useEffect(() => {
    getUsernameFromId(blueprintData.userId)
    .then(username => {
        setBlueprintCreator(username);
    })
  }, [blueprintData, getUsernameFromId])


  // only allow access to the blueprint details if the blueprint is published or if the user is the owner
  useEffect(() => {
    if (!blueprintData.publish && blueprintData.userId && blueprintData.userId !== currentUser?.uid) {
      navigate('/explore');
    }
  }, [blueprintData, currentUser, navigate]);
  
  console.log("detail rendered");

  return (
    <>
      <div className={styles.blueprintDetailContainer}>
      <h2>Blueprint Details</h2>
      <p>Blueprint Name: {blueprintData.blueprintTitle}</p>
      <p>Blueprint Description: {blueprintData.blueprintDescription}</p>
      <p>Blueprint String: {blueprintData.blueprintString}</p>
      <p>Creator: {blueprintCreator}</p>
      <button className={styles.favoriteButton} onClick={() => handleFavorite(blueprintId)}>
      
     {favoriteState ? <StarIcon/> : <StarBorderIcon/>}
      
    </button>
  </div> 
   </>
  );
};

export default BlueprintDetail;