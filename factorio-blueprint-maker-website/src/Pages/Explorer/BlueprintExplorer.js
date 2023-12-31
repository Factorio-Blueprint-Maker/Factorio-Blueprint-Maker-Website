import React, { useState, useEffect } from 'react';


import { useAuth } from "../../Context/authContext.js"
import { useBlueprint } from '../../Context/blueprintContext.js';

// import the styling
import "../../App.css";

import CardLayout from '../../Components/CardLayout.js';
import BlueprintCard from './BlueprintCard.js';

const Content = (props) => {

    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); 
    const [usernames, setUsernames] = useState({}); 
    const [sortOption, setSortOption] = useState('default');
    const [searchResult, setSearchResult] = useState(0);
    const [currentBlueprints, setCurrentBlueprints] = useState([]);

    const { currentUser, getUsernameFromId } = useAuth();
    const { blueprints, handleLikeChange } = useBlueprint();

    const sortingOptions = [
        { value: 'default', label: 'Default' },
        { value: 'topRated', label: 'Top Rated' },
        { value: 'byDate', label: 'Newest'}
      ];


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
                
            ).filter((blueprint) => blueprint.publish === true);

            // set the search result before proceeding to pagination
            setSearchResult(filteredBlueprints.length);

            // split the blueprints into different pages
            const currentBlueprints = filteredBlueprints.slice(indexOfFirstBlueprint, indexOfLastBlueprint);

            // store the currentBlueprints list
            setCurrentBlueprints(currentBlueprints); 

        }

        filterBlueprints();

    }, [searchInput, currentPage, blueprints, getUsernameFromId, itemsPerPage]);
        


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
        currentBlueprints.forEach(blueprint => {
            getUsernameFromId(blueprint.userId)
                .then(username => {
                    setUsernames(prevUsernames => ({
                        ...prevUsernames,
                        [blueprint.userId]: username
                    }));
                })
        });
    }, [currentBlueprints, getUsernameFromId]);


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
                <CardLayout>
                    {sortedBlueprints.map((blueprint) => (
                          <BlueprintCard
                            key = {blueprint.id}
                            blueprint={blueprint}
                            currentUser={currentUser}
                            usernames={usernames}
                            handleLikeChange={handleLikeChange}
                        />
                    ))}
                </CardLayout>
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