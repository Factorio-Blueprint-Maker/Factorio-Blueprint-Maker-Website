import React, { useState, useEffect } from 'react';
import { ref, set, get, push, child, onValue } from "firebase/database";
import { Link } from 'react-router-dom'; 


import { database } from "../firebase.js";
import { useAuth } from "../Context/authContext.js"

// import the styling
import "../App.css";


const Content = (props) => {

    const [blueprintTitle, setBlueprintTitle] = useState("");
    const [blueprintDescription, setBlueprintDescription] = useState("");
    const [blueprint, setBlueprint] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); 

    const { currentUser } = useAuth();

    useEffect(() => {

        // the database reference to the blueprints objects
        const blueprintRef = ref(database, "blueprints/");

        // get data from the blueprint reference
        const listener = onValue(blueprintRef, (snapshot) => {

            const data = snapshot.val();

            // check if there is any data
            if (data) {
                const blueprintList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key]
                }));

                // import data into blueprint array
                setBlueprint(blueprintList);
            }
        });

        return () => {
            listener();
        };
    }, []);


    // this function upload the blueprint to the database
    const uploadBlueprint = () => {

        const newList = blueprint.concat({

            blueprintTitle: blueprintTitle,
            blueprintDescription: blueprintDescription,
            id: blueprint.length === 0 ? 1 : blueprint[blueprint.length - 1].id + 1

        });

        setBlueprint(newList);

        // database reference to the blueprints
        const blueprintRef = ref(database, "blueprints/");

        // push the data to retrive a unique key for each blueprint
        const uniqueKey = push(blueprintRef).key;

        // create a blueprint object that will be imported into the database
        const blueprintObject = {
            blueprintTitle: blueprintTitle,
            blueprintDescription: blueprintDescription,
            likes: []
        };

        // fetch the data to the database
        set(child(blueprintRef, uniqueKey), blueprintObject);
    }

    // this function handles deleting blueprints from both the database and the explorer
    const deleteBlueprint = (id) => {

        // filter the explorer list by which items are available
        setBlueprint(blueprint.filter((item) => item.id !== id));

        // blueprint reference to the database
        const blueprintRef = ref(database, "blueprints/" + id);
        set(blueprintRef, null);
    }

    const handleSearch = (value) => {
        setSearchInput(value);
        setCurrentPage(1);
    }

    const indexOfLastBlueprint = currentPage * itemsPerPage;
    const indexOfFirstBlueprint = indexOfLastBlueprint - itemsPerPage;

    const currentBlueprints = searchInput
        ? blueprint.filter((item) =>  

            // filter the blueprints by checking if the search input is included in the blueprint object
            item.blueprintTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
            item.blueprintDescription.toLowerCase().includes(searchInput.toLowerCase())

          ).slice(indexOfFirstBlueprint, indexOfLastBlueprint)

        : blueprint.slice(indexOfFirstBlueprint, indexOfLastBlueprint);

        const handlePageChange = (pageNumber) => {

            // set the new page index
            setCurrentPage(pageNumber);

            // scroll to the top of the page when a new page is seleccted
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        };


        const handleLikeChange = async (blueprintId) => {        
            if (currentUser) {
                const likeRef = ref(database, `blueprints/${blueprintId}/likes/${currentUser.uid}`);
                
                // Check if the user has liked this blueprint
                const snapshot = await get(likeRef);
    
                if (snapshot.exists()) {
                    // User has already liked, you can implement an "unlike" functionality here
                    console.log("User already liked this blueprint.");
                    // Remove the like
                    set(likeRef, null);
                } else {
                    // User hasn't liked, you can implement a "like" functionality here
                    console.log("User liked this blueprint.");
                    // Set the like
                    set(likeRef, true);
                }
            }
        };










    return (
        <div className="blueprint-content">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>

            <div className="add-blueprint-container">
                <input
                    type="text"
                    id="blueprint-title"
                    placeholder="Enter the blueprint title"
                    value={blueprintTitle}
                    onChange={(e) => setBlueprintTitle(e.target.value)}
                />
                <input
                    type="text"
                    id="blueprint-description"
                    placeholder="Enter the blueprint description"
                    value={blueprintDescription}
                    onChange={(e) => setBlueprintDescription(e.target.value)}
                />
                <button type="button" onClick={uploadBlueprint}>Upload</button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    id="search-input"
                    placeholder="Search for blueprints"
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button type="button">Search</button>
            </div>

            {currentBlueprints.length > 0 ? (
                <>
                <div className="blueprint-container">
                <ul>
                    {currentBlueprints.map((item) => (          
                                <li className="blueprintCard">   
                                <Link to={`/explore/blueprint/${item.id}`} key={item.id}>
                        
                                    <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />
                                    <h1>{item.blueprintTitle}</h1>
                                    <p>{item.blueprintDescription}</p>

                                </Link>

                            <hr />
                            <button
                                className="delete-blueprint-button"
                                onClick={() => deleteBlueprint(item.id)}
                            >
                                Delete Blueprint
                            </button>
                            {currentUser && (
                                <button className={` ${item.likes && item.likes[currentUser?.uid] ? 'like-blueprint-button-liked' : 'like-blueprint-button'}`}
                                onClick={() => handleLikeChange(item.id)}>Like</button>
                            )}

                            <p>Likes: {item.likes ? Object.keys(item.likes).length : 0}</p>
                        </li>
                    ))}
                </ul>
                </div>
                <div className="pagination">
                {Array.from({ length: Math.ceil(blueprint.length / itemsPerPage) }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>
                        {index+1}
                    </button>
                ))}
                </div>
                </>
            )    
            : (
                <div className="no-results">
                    <p>No Blueprints found</p>
                </div>
            )}
        </div>
    );
}

export default Content;