import React from 'react';
import classes from "./Filter.module.css";
import DepartmentList from "../DepartmentList/DepartmentList";
import DateRange from '../DateRange/DateRange'
import postService from '../../API/postService'
import useFetching from "../../Hooks/useFetching";
import {Spinner} from "react-bootstrap";
import additionalDay from "../AdditionalDay/AdditionalDay";

const Filter = ({
                    additionalWork,
                    additionalRest,
                    modalActive,
                    setModalActive,
                    excludedDate,
                    setExcludedDate,
                    persons,
                    excludeList,
                    setExcludeList,
                    reqDepartments,
                    setReqDepartments,
                    startDate,
                    endDate,
                    setEndDate,
                    setStartDate
                }) => {
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
    const additionalRestDates = additionalRest.map(item=>{
        return item.date
    })
    const additionalWorkDates = additionalWork.map(item=>{
        return item.date
    })

    const [generateRecap, isLoading, error, setError] = useFetching(async () => {
        const query = {
            startDate: {
                day: new Date(startDate).getDate().toString().padStart(2, '0'),
                month: (new Date(startDate).getMonth() + 1).toString().padStart(2, '0'),
                year: new Date(startDate).getFullYear().toString()
            },
            endDate: {
                day: new Date(endDate).getDate().toString().padStart(2, '0'),
                month: (new Date(endDate).getMonth() + 1).toString().padStart(2, '0'),
                year: new Date(endDate).getFullYear().toString()
            },
            excludeList: [...excludeList],
            reqDepartments: [...reqDepartments],
            additionalWork:[...additionalWorkDates],
            additionalRest:[...additionalRestDates]
        }
        await postService.get_recap(query)
    })
    return (
        <div className={classes.wrapper}>
            <div className={[classes.container, classes.categoriesContainer].join(' ')}>
                <div
                    className={isLoading ? classes.buttonPressed : classes.button}
                    onClick={async () => {
                        if (!isLoading) generateRecap()
                    }}
                >
                    {
                        isLoading ? <Spinner animation="border"/> : 'Сгенерировать отчёт'
                    }
                </div>
                <div className={[classes.title, classes.categories].join(' ')}>
                    Даты:
                </div>
                <DateRange
                    excludedDate={excludedDate}
                    setExcludedDate={setExcludedDate}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    endDate={endDate}
                ></DateRange>
                <div
                    className={classes.additionalDate__container}
                    onClick={()=>{
                        setModalActive({type: "rest", isActive: true})
                    }}
                >
                    <span className={classes.additionalDate}>Дополнительные выходные дни</span>
                </div>
                <div
                    className={classes.additionalDate__container}
                    onClick={()=>{
                        setModalActive({type: "work", isActive: true})
                    }}
                >
                    <span className={classes.additionalDate}>Дополнительные рабочие дни</span>
                </div>
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
    )
        ;
};

export default Filter;