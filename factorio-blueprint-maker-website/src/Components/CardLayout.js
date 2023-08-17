import React from "react";
import styles from "../Styles/BlueprintList.module.scss";

const CardLayout = ({ children }) => {
    return (
        <ul className={styles.blueprintListContainer}>
            {children}
        </ul>
    );
}

export default CardLayout;