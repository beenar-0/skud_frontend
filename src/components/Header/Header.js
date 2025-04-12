import React from 'react';
import classes from "./Header.module.css";
import Search from "../Search/Search";
import Pepa from "../Pepa/Pepa";


const Header = ({searchQuery, setSearchQuery}) => {

    return (
        <header className={classes.header}>
            <div className={classes.innerContainer}>
                <div className={classes.atomtexLogo}></div>
            </div>
            <Search
                value={searchQuery}
                onChange={(e)=>{
                    setSearchQuery(e.target.value)
                }}
                type="text"
                placeholder="Поиск"
            />
            <Pepa></Pepa>

        </header>
    );
};

export default Header;