import React from 'react';
import classes from "./Header.module.css";
import Search from "../Search/Search";
import Pepa from "../Pepa/Pepa";


const Header = ({searchQuery, setSearchQuery, userFullName, setPersons, setDepartments, setBlock}) => {
    return (
        <header className={classes.header}>
            <div className={classes.innerContainer}>
                <div className={classes.atomtexLogo}></div>
            </div>
            <div className={classes.usernameContainer}>
                <div className={classes.entryMsg}>
                    Вы вошли как:
                </div>
                <div className={classes.userName}>
                    {`${userFullName.surname} ${userFullName.name} ${userFullName.patronymic}`}
                </div>
            </div>
            <Pepa></Pepa>
            <Search
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value)
                }}
                type="text"
                placeholder="Поиск"
            />
            <div
                className={classes.exitBtn}
                onClick={()=>{
                    setPersons([])
                    setDepartments([])
                    setBlock(true)
                }}
            ></div>
        </header>
    );
};

export default Header;