import React, { useState, useEffect, useLayoutEffect, memo, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue } from "firebase/database";
import { database, storage } from "../firebase.js";
import styles from '../Styles/BlueprintDetail.module.scss';
import { useAuth } from '../Context/authContext.js';
import { useBlueprint } from '../Context/blueprintContext.js';
import pako from "pako";
import { Link } from 'react-router-dom';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PersonIcon from '@mui/icons-material/Person';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star'


const  BlueprintDetail = memo(() => {

  const { blueprintId } = useParams();

  const [blueprintData, setBlueprintData] = useState({});
  const [ blueprintCreator, setBlueprintCreator ] = useState("");
  const [favoriteState, setFavoriteState] = useState(false);
  const [ blueprintJson, setBlueprintJson] = useState([]);
  const [blueprintEnergyConsumption, setBlueprintEnergyConsumption] = useState("");

  const { currentUser, getUsernameFromId, authenticated } = useAuth();
  const { getBlueprintData, handleFavorite, handleLikeChange, getEnergyConsumption } = useBlueprint();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    setLoading(true);
    if (blueprintEnergyConsumption) {
      setLoading(false);
    } 
  }, [blueprintEnergyConsumption]) 

  const decodeBlueprintString = (blueprintString) => {
    try {
        // Step 1: Skip the first byte
        const compressedData = blueprintString.slice(1);

        // Step 2: Base64 decode the string
        const decodedData = atob(compressedData);

        // Convert decoded data to an array of bytes
        const decodedBytes = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
          decodedBytes[i] = decodedData.charCodeAt(i);
        }

        // Step 3: Decompress using Zlib Inflate
        const decompressedData = pako.inflate(decodedBytes, { level: 9, to: 'string' });

        // Parse the JSON representation of the blueprint
        const blueprint = JSON.parse(decompressedData);

        return blueprint;
    } catch (error) {
      console.error('Error decoding blueprint string:', error);
      return null;
    }
  };


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
  }, [blueprintId]);


  // get blueprint data by calling the getBlueprintData from blueprintContext
  useEffect(() => {

    const handleGetBlueprintData = async () => {
        const blueprintData = await getBlueprintData(blueprintId);

        // set the blueprint data to the result
        await setBlueprintData(blueprintData);
    }

    handleGetBlueprintData();
    

  }, [blueprintId, currentUser, getBlueprintData]);


  useEffect(() => {

    if (blueprintData.blueprintString) {

      // Decode the blueprint string and set blueprintJson
      const decodedBlueprint = decodeBlueprintString(blueprintData.blueprintString);
      setBlueprintJson(decodedBlueprint);
      
    }
  }, [blueprintData]);


  const iblueprintEnergyConsumption = useMemo(() => {
    // This is an async function that will handle getting the energy consumption
    const fetchEnergyConsumption = async () => {
      try {
        if (blueprintJson.blueprint?.entities) {
          const energyConsumption = await getEnergyConsumption(blueprintJson);
          const units = ["W", "kW", "MW", "GW", "TW"];
          
          let unitIndex = 0;
          let reducedNumber = energyConsumption;
          
          while (reducedNumber >= 1000 && unitIndex < units.length - 1) {
            reducedNumber /= 1000;
            unitIndex++;
          }
          
          const formattedEnergy = reducedNumber.toFixed(2) + ' ' + units[unitIndex];
          setBlueprintEnergyConsumption(formattedEnergy);
        }
      } catch (error) {
        console.error("Error fetching energy consumption:", error);
      }
    };

    // Call the function to fetch energy consumption
    fetchEnergyConsumption();
  }, [blueprintJson]);


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

  const [copyStringClicked, setCopyStringClicked] = useState(false);

  const handleCopyStringToClipboard = () => {
    const string = blueprintData.blueprintString;
    navigator.clipboard.writeText(string);
    
    setCopyUrlClicked(false);
    setCopyStringClicked(true);

    setTimeout(() => {
      setCopyStringClicked(false);
    }, 2000)
  }

  const [copyUrlClicked, setCopyUrlClicked] = useState(false);

  const handleCopyUrlToClipboard = () => {
    const string = window.location.href;
    navigator.clipboard.writeText(string);

    setCopyStringClicked(false);
    setCopyUrlClicked(true);

    setTimeout(() => {
      setCopyUrlClicked(false);
    }, 2000)
  }

  const [loading, setLoading] = useState(false);


  return (
       <>
    {!loading ? (

      <div className={styles.blueprintDetailContainer}>

        <div className={styles.blueprintDetailHeader}>
          <div className={styles.copyButtons}>
            <button className={styles.copyStringToClipboardBtn} onClick={handleCopyStringToClipboard}>{!copyStringClicked ? "Copy String" : "Copied"}</button>
            <button className={styles.copyUrlToClipboardBtn} onClick={handleCopyUrlToClipboard}>{!copyUrlClicked ? "Copy URL" : "Copied"}</button>
          </div>
          <button className={styles.favoriteButton} onClick={() => handleFavorite(blueprintId)}>{favoriteState ? <StarIcon fontSize='inherit'/> : <StarBorderIcon fontSize='inherit'/>}</button>
        </div>

        <div className={styles.blueprintDetailMain}>
          <div className={styles.previewImage}>
            <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />
          </div>
          <div className={styles.mainContent}>
            <div className={styles.content}>
              <h1>{blueprintData.blueprintTitle}</h1>
              <h2>{blueprintData.blueprintDescription}</h2>
              <h3>Details</h3>
              <ul>
                <li> 
                  <PersonIcon/>
                  <p>Created by: <Link to={`/explore/${blueprintData.userId}`}>{blueprintCreator}</Link></p>
                </li>
                <li>
                  <DateRangeIcon/>
                  <p>Created at: {blueprintData.createdAt}</p>
                </li>
                <li>
                  <ElectricBoltIcon className={styles.energy}/>
                  <p>Energy Consumption: {blueprintEnergyConsumption}</p>
                </li>
                <li>
                  <PrecisionManufacturingIcon/>
                  <p>Part Count: {blueprintJson.blueprint?.entities.length} items</p>
                </li>
              </ul>
            </div>
          </div> 
        </div>

        <div className={styles.blueprintDetailFooter}>
        <button onClick={authenticated ? () => handleLikeChange(blueprintId) : undefined}>
            {authenticated ? 
              (blueprintData.likes && blueprintData.likes[currentUser?.uid] ? <FavoriteIcon/> : <FavoriteBorderIcon/>)
            : <FavoriteIcon/> }
            </button>
          <p>{blueprintData.likes ? Object.keys(blueprintData.likes).length : 0} likes</p>
        </div>

      </div> 
            
      
    ): (
    <>
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    </>
    ) }
    </>
  );
});

export default BlueprintDetail;