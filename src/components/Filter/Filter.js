import React from 'react';
import classes from "./Filter.module.css";
import DepartmentList from "../DepartmentList/DepartmentList";
import DateRange from '../DateRange/DateRange'
import postService from '../../API/postService'
import useFetching from "../../Hooks/useFetching";
import {Spinner} from "react-bootstrap";

const Filter = ({persons, excludeList, setExcludeList, reqDepartments, setReqDepartments, startDate, endDate, setEndDate, setStartDate}) => {
    let personsDepartments = new Set()
    persons.forEach((person) => {
        personsDepartments.add(person.Department)
    })
    personsDepartments = [...personsDepartments]
    const sortedPersons = []
    personsDepartments.forEach((department) => {
        persons.forEach((person) => {
            if (person.Department === department) sortedPersons.push(person)
        })
    })
    const [generateRecap, isLoading, error, setError] = useFetching(async ()=>{
        const query = {
            startDate: {
                day: new Date(startDate).getDate().toString().padStart(2,'0'),
                month: (new Date(startDate).getMonth()+1).toString().padStart(2,'0'),
                year: new Date(startDate).getFullYear().toString()
            },
            endDate: {
                day: new Date(endDate).getDate().toString().padStart(2,'0'),
                month: (new Date(endDate).getMonth()+1).toString().padStart(2,'0'),
                year: new Date(endDate).getFullYear().toString()
            },
            excludeList: [...excludeList],
            reqDepartments: [...reqDepartments]
        }
        await postService.get_recap(query)
    })
    return (
        <div className={classes.wrapper}>
            <div className={[classes.container, classes.categoriesContainer].join(' ')}>
                <div
                    className={isLoading ? classes.buttonPressed : classes.button}
                    onClick={async ()=>{
                        console.log('click')
                        if (!isLoading) generateRecap()
                    }}
                >
                    {
                        isLoading ? <Spinner animation="border" /> : 'Сгенерировать отчёт'
                    }
                </div>
                <div className={[classes.title, classes.categories].join(' ')}>
                    Даты:
                </div>
                <DateRange
                    startDate={startDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    endDate={endDate}
                ></DateRange>
                <div className={[classes.title, classes.categories].join(' ')}>
                    Отделы:
                </div>
                <DepartmentList
                    excludeList={excludeList}
                    setExcludeList={setExcludeList}
                    setReqDepartments={setReqDepartments}
                    reqDepartments={reqDepartments}
                    sortedPersons={sortedPersons}
                />
            </div>
        </div>
    );
};

export default Filter;