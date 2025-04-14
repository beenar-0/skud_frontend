import React from 'react';
import classes from "./Filter.module.css";
import DepartmentList from "../DepartmentList/DepartmentList";
import DateRange from '../DateRange/DateRange'
import postService from '../../API/postService'
import useFetching from "../../Hooks/useFetching";
import {Spinner} from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Filter = ({
                    isStrict,
                    setIsStrict,
                    additionalWork,
                    additionalRest,
                    setModalActive,
                    excludedDate,
                    setExcludedDate,
                    persons,
                    reqList,
                    setReqList,
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
    const additionalRestDates = additionalRest.map(item => {
        return item.date
    })
    const additionalWorkDates = additionalWork.map(item => {
        return item.date
    })

    const [generateRecap, isLoading, error, setError] = useFetching(async () => {
        const excludeList = persons
            .filter(person => !reqList.includes(person.ID))
            .map(person => person.ID);

        const reqDepartments = [...new Set(
            persons
                .filter(person => reqList.includes(person.ID))
                .map(person => person.DepartmentID)
        )];
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
            reqList: [...reqList],
            excludeList: [...excludeList],
            reqDepartments: [...reqDepartments],
            additionalWork: [...additionalWorkDates],
            additionalRest: [...additionalRestDates],
            isStrict: isStrict
        }
        await postService.get_recap(query)
    })
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Если опция включена, то при наличии хотя бы одного случая «не прикладывал(а)» день считается полностью
            пропущенным и засчитывается как 0 часов.
            Если опция выключена, то дни, когда сотрудник утром и(или) вечером не прикладывал пропуск, не учитываются в
            общем количестве отработанных часов.
        </Tooltip>
    );
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
                    onClick={() => {
                        setModalActive({type: "rest", isActive: true})
                    }}
                >
                    <span className={classes.additionalDate}>Дополнительные выходные дни</span>
                </div>
                <div
                    className={classes.additionalDate__container}
                    onClick={() => {
                        setModalActive({type: "work", isActive: true})
                    }}
                >
                    <span className={classes.additionalDate}>Дополнительные рабочие дни</span>
                </div>
                <div className={classes.strictModeWrapper}>
                    <div className={classes.separator}></div>
                    <div className={classes.checkLineContainer}>
                        <span>Строгий подсчёт</span>
                        <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={renderTooltip}
                        >
                            <div className={classes.hintBtn}> ?</div>
                        </OverlayTrigger>
                        <input
                            type="checkbox"
                            checked={isStrict}
                            onChange={(e) => {
                                setIsStrict(e.target.checked)
                            }}
                        ></input>
                    </div>
                    <div className={classes.separator}></div>
                </div>
                <div className={[classes.title, classes.categories].join(' ')}>
                    Отделы:
                </div>
                <DepartmentList
                    reqList={reqList}
                setReqList={setReqList}
                    sortedPersons={sortedPersons}
                />
            </div>
        </div>
    )
        ;
};

export default Filter;