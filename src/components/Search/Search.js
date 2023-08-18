import React from 'react';
import classes from "./Search.module.css";

const MySearch = (props) => {

    return (
        <div className={classes.searchContainer}>
            <div className={classes.lupa}></div>
            <input className={classes.search} onChange={()=>{}} {...props} type="text"></input>
        </div>
    );
};

export default MySearch;