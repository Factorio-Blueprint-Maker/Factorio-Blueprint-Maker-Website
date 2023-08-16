import React from 'react';
import styles from "../Styles/BlueprintList.module.scss";
import BlueprintCard  from './BlueprintCard';

function BlueprintList({ blueprintList, usernames, handleLikeChange, currentUser}) {

    return (
        <ul className={styles.blueprintListContainer}>
        {blueprintList.map((blueprint) => (
            <BlueprintCard
                blueprint={blueprint}
                currentUser={currentUser}
                usernames={usernames}
                handleLikeChange={handleLikeChange}
            />
        ))}
        </ul>

    );
  }

export default BlueprintList;