import React, { memo } from "react";
import styles from "../Styles/BlueprintList.module.scss";

const CardLayout = memo(({ children }) => {
    return (
        <ul className={styles.blueprintListContainer}>
            {children}
        </ul>
    );
})

export default CardLayout;