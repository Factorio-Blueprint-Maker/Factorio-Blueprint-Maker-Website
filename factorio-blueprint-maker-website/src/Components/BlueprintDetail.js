import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from "firebase/database";
import { database } from "../firebase.js";


export const BlueprintDetail = () => {

  // get the blueprintId
  const { blueprintId } = useParams();

  const [blueprintTitle, setBlueprintTitle] = useState("");
  const [blueprintDescription, setBlueprintDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // queries the blueprint data from the database
  const getBlueprintData = () => {

    // the database reference for the blueprint objects
    const blueprintRef = ref(database, "blueprints/" + blueprintId);

    // get the data at blueprintRef from the database
    onValue(blueprintRef, (snapshot) => {

      // check if there are any blueprints
      if (snapshot.exists()) {

        const blueprintData = snapshot.val();

        // set the ui elements
        setBlueprintTitle(blueprintData.blueprintTitle);
        setBlueprintDescription(blueprintData.blueprintDescription);

      } else {
        setError("Blueprint not found");
      }

      setLoading(false);
      
    }, (error) => {
      setError("Error fetching blueprint data");
      setLoading(false);
    });
  }

  // call getBlueprintData on load
  useEffect(() => {
    getBlueprintData();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Blueprint Details</h2>
      <p>Blueprint Name: {blueprintTitle}</p>
      <p>Blueprint Description: {blueprintDescription}</p>
    </div>
  );
};

export default BlueprintDetail;