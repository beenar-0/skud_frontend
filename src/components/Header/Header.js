import React from 'react';
import classes from "./Header.module.css";
import Search from "../Search/Search";
import Pepa from "../Pepa/Pepa";


const Header = ({
                    privileges,
                    searchQuery,
                    setSearchQuery,
                    userFullName,
                    setPersons,
                    setDepartments,
                    setBlock,
                    setCurrentPage,
                    currentPage,
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
                    className={!privileges.isAdmin && !privileges.isHeadOfDepartment ? [classes.navbarItem, classes.Locked].join(' ') : currentPage === 'main' ? [classes.navbarItem, classes.Active].join(' ') : classes.navbarItem}
                    onClick={() => {
                        if (privileges.isAdmin || privileges.isHeadOfDepartment) setCurrentPage('main')
                    }}
                >
                    {privileges.isHeadOfDepartment || privileges.isAdmin ? 'Посещаемость' : <>Посещаемость<span className={classes.lock}></span></>}
                </div>
                <div
                    className={!privileges.isAdmin && !privileges.isJournalAdmin ? [classes.navbarItem, classes.Locked].join(' ') : currentPage === 'journal' ? [classes.navbarItem, classes.Active].join(' ') : classes.navbarItem}
                    onClick={() => {
                        if (privileges.isAdmin || privileges.isJournalAdmin) setCurrentPage('journal')
                    }}
                >
                    {privileges.isJournalAdmin || privileges.isAdmin ? 'Вредники' : <>Вредники<span className={classes.lock}></span></>}
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