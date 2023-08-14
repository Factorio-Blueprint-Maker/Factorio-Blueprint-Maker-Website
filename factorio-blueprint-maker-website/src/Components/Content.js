import React, { useState, useEffect } from 'react';
import { ref, set, get, onValue } from "firebase/database";


import { database } from "../firebase.js";
import { useAuth } from "../Context/authContext.js"

// import the styling
import "../App.css";

import BlueprintList from './BlueprintList.js';

const Content = (props) => {

    const [blueprints, setBlueprint] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); 
    const [usernames, setUsernames] = useState({}); // Add this state
    const [sortOption, setSortOption] = useState('default');
    const [searchResult, setSearchResult] = useState(0);
    const [currentBlueprints, setCurrentBlueprints] = useState([]);

    const { currentUser } = useAuth();

    const sortingOptions = [
        { value: 'default', label: 'Default' },
        { value: 'topRated', label: 'Top Rated' },
        { value: 'byDate', label: 'Newest'}
      ];

    const handleLikeChange = async (blueprintId) => {        
        if (currentUser) {
            const likeRef = ref(database, `blueprints/${blueprintId}/likes/${currentUser.uid}`);
            
            // Check if the user has liked this blueprint
            const snapshot = await get(likeRef);

            if (snapshot.exists()) {
                set(likeRef, null);
            } else {
                set(likeRef, true);
            }
        }
    };

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

    
    const getUsernameFromId = async (userId) => {
        const userRef = ref(database, `users/${userId}`);
    
        try {
            const snapshot = await get(userRef);
    
            if (snapshot.exists()) {
                const userData = snapshot.val();
                const userName = userData.userName;
                return userName; // Return userName
            } else {
                console.log("User data does not exist");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error; // Rethrow the error to handle it later
        }
    }

    
    /* Update the blueprint list everytime we use the search input, 
       change items per page, change current page or if the blueprints gets updated */
    useEffect(() => {

        const filterBlueprints = async () => {

            // calculate the indices for the pagination
            const indexOfLastBlueprint = currentPage * itemsPerPage;
            const indexOfFirstBlueprint = indexOfLastBlueprint - itemsPerPage;

            // get usernames of all the blueprints
            const getUsernamePromises = blueprints.map(async (blueprint) => {
                return await getUsernameFromId(blueprint.userId);
            });

            const usernames = await Promise.all(getUsernamePromises);

            // filter the blueprints by search input
            const filteredBlueprints = blueprints.filter((blueprint, index) =>

                blueprint.blueprintTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
                blueprint.blueprintDescription.toLowerCase().includes(searchInput.toLowerCase()) ||
                (usernames[index] && usernames[index].toLowerCase().includes(searchInput.toLowerCase()))

            );

            // set the search result before proceeding to pagination
            setSearchResult(filteredBlueprints.length);

            // split the blueprints into different pages
            const currentBlueprints = filteredBlueprints.slice(indexOfFirstBlueprint, indexOfLastBlueprint);

            // store the currentBlueprints list
            setCurrentBlueprints(currentBlueprints); 

        }

        filterBlueprints();

    }, [searchInput, currentPage, blueprints, itemsPerPage]);
        


    const handlePageChange = (pageNumber) => {

        // set the new page index
        setCurrentPage(pageNumber);

        // scroll to the top of the page when a new page is seleccted
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    };

    const sortByTopRated = (blueprints) => {
        return blueprints.slice().sort((a, b) => {
            const likesA = a.likes ? Object.keys(a.likes).length : 0;
            const likesB = b.likes ? Object.keys(b.likes).length : 0;
            return likesB - likesA;
        });
    };
        
    const sortByDate = (blueprints) => {
        return blueprints.slice().sort((a, b) => {
            const dateB = new Date(a.createdAt);
            const dateA = new Date(b.createdAt);
            return dateA - dateB;
        });
    };

    const sortedBlueprints = sortOption === 'topRated' ? sortByTopRated(currentBlueprints) : sortOption === "byDate" ? sortByDate(currentBlueprints) : currentBlueprints;

    const handleSortOptionChange = (optionValue) => {
        setSortOption(optionValue);
    };
        
    useEffect(() => {
        currentBlueprints.forEach(item => {
            getUsernameFromId(item.userId)
                .then(userName => {
                    setUsernames(prevUsernames => ({
                        ...prevUsernames,
                        [item.userId]: userName
                    }));
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        });
    }, [currentBlueprints]);


    return (
        <div className="blueprint-content">
            
            {/* This container contains the jsx part of the search input*/}

            <div className="search-container">
                <input type="text" id="search-input" placeholder="Search for blueprints" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
            </div>

            {/* Check if there are any blueprints */}
            {sortedBlueprints.length > 0 ? (
                <>
                <div className="blueprint-container">
                <div className="sort-container">
                    <p className="result-text">{searchResult} results found</p>

                    <div className="sorting-button">
                        <label>Sort By :</label>
                        <select
                        className="sort-select"
                        value={sortOption}
                        onChange={(e) => handleSortOptionChange(e.target.value)}
                        >      {sortingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}                      
                        </select>
                    </div>
                </div>

                <hr />
                    <BlueprintList blueprintList={sortedBlueprints} usernames={usernames} handleLikeChange={handleLikeChange} currentUser={currentUser}/>
                </div>

                <div className="pagination">
                    {Array.from({ length: Math.ceil(blueprints.length / itemsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
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