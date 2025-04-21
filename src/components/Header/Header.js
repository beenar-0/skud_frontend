import React from 'react';
import classes from "./Header.module.css";
import Search from "../Search/Search";
import Pepa from "../Pepa/Pepa";


const Header = ({
                    searchQuery,
                    setSearchQuery,
                    userFullName,
                    setPersons,
                    setDepartments,
                    setBlock,
                    setCurrentPage,
                    currentPage,
                    isVrednikiActive,
                    setIsVrednikiActive
                }) => {
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
            <nav className={classes.navContainer}>
                <div
                    className={currentPage === 'main' ? [classes.navbarItem, classes.Active].join(' ') : classes.navbarItem}
                    onClick={() => {
                        setCurrentPage('main')
                    }}
                >
                    Посещаемость
                </div>
                <div
                    className={!isVrednikiActive ? [classes.navbarItem, classes.Locked].join(' ') : currentPage === 'vredniki' ? [classes.navbarItem, classes.Active].join(' ') : classes.navbarItem}
                    onClick={() => {
                        if (isVrednikiActive) setCurrentPage('vredniki')
                    }}
                >
                    {isVrednikiActive ? 'Вредники' : <>Вредники<span className={classes.lock}></span></> }
                </div>
            </nav>
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
                onClick={() => {
                    setIsVrednikiActive()
                    setCurrentPage('login')
                    setPersons([])
                    setDepartments([])
                    setBlock(true)
                }}
            ></div>
        </header>
    );
};

export default Header;