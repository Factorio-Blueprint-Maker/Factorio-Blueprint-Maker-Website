import React, { useState, useEffect } from 'react';
import { ref, set, get, onValue } from "firebase/database";
import { Link } from 'react-router-dom'; 


import { database } from "../firebase.js";
import { useAuth } from "../Context/authContext.js"

// import the styling
import "../App.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const Content = (props) => {

    const [blueprint, setBlueprint] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); 
    const [usernames, setUsernames] = useState({}); // Add this state
    const [sortOption, setSortOption] = useState('default');

    const { currentUser } = useAuth();

    const sortingOptions = [
        { value: 'default', label: 'Default' },
        { value: 'topRated', label: 'Top Rated' },
        { value: 'byDate', label: 'Newest'}
        // Add more sorting options as needed
      ];

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

    
    const handleSearch = (value) => {
        setSearchInput(value);
        setCurrentPage(1);
    }
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
    };
    
    const indexOfLastBlueprint = currentPage * itemsPerPage;
    const indexOfFirstBlueprint = indexOfLastBlueprint - itemsPerPage;

    const currentBlueprints = searchInput
    ? blueprint.filter((item) => {
        const lowerCaseSearchInput = searchInput.toLowerCase();
        const lowerCaseUserName = usernames[item.userId]?.toLowerCase() || "";
  
        return (
          item.blueprintTitle.toLowerCase().includes(lowerCaseSearchInput) ||
          item.blueprintDescription.toLowerCase().includes(lowerCaseSearchInput) ||
          lowerCaseUserName.includes(lowerCaseSearchInput)
        );
      }).slice(indexOfFirstBlueprint, indexOfLastBlueprint)
    : blueprint.slice(indexOfFirstBlueprint, indexOfLastBlueprint);

        const handlePageChange = (pageNumber) => {

            // set the new page index
            setCurrentPage(pageNumber);

            // scroll to the top of the page when a new page is seleccted
            window.scrollTo({ top: 0, behavior: "smooth" }); 
        };


        // This function handles the like system
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
            console.log(`Sorting by: ${optionValue}`);
            // Implement your sorting logic here
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
                <input type="text" id="search-input" placeholder="Search for blueprints" value={searchInput} onChange={(e) => handleSearch(e.target.value)}/>
                <button type="button">Search</button>
            </div>

            {/* Check if there are any blueprints */}
            {sortedBlueprints.length > 0 ? (
                <>
                <div className="blueprint-container">
                <div className="sort-container">
                    <p className="result-text">{sortedBlueprints.length} results found</p>

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
                <ul>
                    {sortedBlueprints.map((item) => ( 

                        <li className="blueprintCard" key={item.id}>   

                                {/* Create an dynamic link to the blueprint page */}
                                <Link to={`/explore/blueprint/${item.id}`} key={item.id}>
                                    <img src="https://autosaved.org/img/oil2.762ee113.jpg" alt="Blueprint" />
                                    <div className="test">

                                    <h1>{item.blueprintTitle}</h1>
                                    <p>{item.blueprintDescription}</p>

                         </div>
                                </Link>


                            <div className="likeContainer">
                            <p>Created By: <a href="./">{usernames[item.userId]}</a></p>
                            <div className="likestuff">
                                {currentUser && (
                                    <button className="like-blueprint-button"
                                    onClick={() => handleLikeChange(item.id)}>{item.likes && item.likes[currentUser?.uid] ? <FavoriteIcon/> : <FavoriteBorderIcon/>}</button>
                                )}
                                <p>{item.likes ? Object.keys(item.likes).length : 0} Likes</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                </div>

                <div className="pagination">
                    {Array.from({ length: Math.ceil(blueprint.length / itemsPerPage) }, (_, index) => (
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