import React, {useEffect, useState} from 'react';
import classes from "./AdditionalDay.module.css";
import DatePicker from "react-datepicker";
import Table from "react-bootstrap/Table";

const AdditionalDay = ({
                           modalActive,
                           setModalActive,
                           additionalWork,
                           setAdditionalWork,
                           additionalRest,
                           setAdditionalRest,
                           reducedDays,
                           setReducedDays
                       }) => {
    const [startDate, setStartDate] = useState();
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedAdditionalWork = localStorage.getItem('additionalWork');
        const storedAdditionalRest = localStorage.getItem('additionalRest');
        const storedReducedDays = localStorage.getItem('reducedDays');

        if (storedAdditionalWork) setAdditionalWork(JSON.parse(storedAdditionalWork).map(item => {
            item.date = new Date(item.date);
            return item;
        }));
        if (storedAdditionalRest) setAdditionalRest(JSON.parse(storedAdditionalRest).map(item => {
            item.date = new Date(item.date);
            return item;
        }));
        if (storedReducedDays) setReducedDays(JSON.parse(storedReducedDays).map(item => {
            item.date = new Date(item.date);
            return item;
        }));

    }, []);

    useEffect(() => {
        // Сохранение состояний в localStorage перед закрытием страницы
        window.onbeforeunload = () => {
            localStorage.setItem('additionalWork', JSON.stringify(additionalWork));
            localStorage.setItem('additionalRest', JSON.stringify(additionalRest));
            localStorage.setItem('reducedDays', JSON.stringify(reducedDays));
        };

        // Очистка обработчика перед удалением компонента
        return () => {
            window.onbeforeunload = null;
        };
    }, [additionalWork, additionalRest, reducedDays]);

    function getHumanDate(pickedDate) {
        const date = new Date(pickedDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    const current = {
        oppositeDays: [],
        days: [],
        setDays: () => {}
    };

    if (modalActive.type === 'rest') {
        current.oppositeDays = [...additionalWork, ...reducedDays];
        current.days = additionalRest;
        current.setDays = setAdditionalRest;
    }
    if (modalActive.type === 'work') {
        current.oppositeDays = [...additionalRest];
        current.days = additionalWork;
        current.setDays = setAdditionalWork;
    }
    if (modalActive.type === 'reduced') {
        current.oppositeDays = [...additionalRest];
        current.days = reducedDays;
        current.setDays = setReducedDays;
    }

    return (
        <div
            className={modalActive.isActive ? [classes.modal__container, classes._modalActive].join(' ') : classes.modal__container}
            onClick={() => {
                setModalActive({isActive: false, type: ""});
                setError('');
                setStartDate(undefined);
                setNote('');
            }}
        >
            <div
                onClick={event => event.stopPropagation()}
                className={classes.container}
            >
                <div
                    className={classes.close_btn}
                    onClick={() => {
                        setModalActive({type: '', isActive: false});
                        setError('');
                        setStartDate(undefined);
                        setNote('');
                    }}
                ></div>
                <h1 className={classes.title}>
                    {modalActive.type === 'rest'
                        ? "Дополнительные выходные дни"
                        : modalActive.type === 'work'
                            ? "Дополнительные рабочие дни"
                            : "Сокращённые дни"}
                </h1>
                <div className={classes.datePicker__container}>
                    <div className={classes.input__wrapper}>
                        <div>
                            <DatePicker
                                calendarStartDay={1}
                                placeholderText="Выбрать дату"
                                dateFormat={'dd/MM/yyyy'}
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                            />
                        </div>
                        <input
                            value={note}
                            onChange={(event) => {
                                setNote(event.target.value);
                            }}
                            type={"text"}
                            placeholder={'Ввести примечание'}
                            className={classes.note}
                            maxLength={30}
                        ></input>
                        <div
                            className={classes.addButton}
                            onClick={() => {
                                if (current.oppositeDays.some(item => +item.date === +startDate)) setError('Дата не может быть одновременно в другом списке!');
                                else if (current.days.some(item => +item.date === +startDate)) setError('Дата уже находится в списке!');
                                else if (startDate !== undefined) {
                                    current.setDays((prevState) => ([...prevState, {
                                        date: startDate,
                                        note: note
                                    }].sort((a, b) => {
                                        if (a.date < b.date) return -1;
                                    })));
                                    setError('');
                                    setStartDate(undefined);
                                    setNote('');
                                }
                            }}
                        >Добавить
                        </div>
                        {
                            error && <div className={classes.error}>{error}</div>
                        }
                    </div>
                </div>
                <div className={classes.table__container}>
                    {
                        !current.days.length
                            ? <div className={classes.empty_cat}></div>
                            : <Table striped bordered>
                                <thead>
                                <tr className={classes.titleRow}>
                                    <th>Дата</th>
                                    <th>Примечание</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {current.days.length && current.days.map((item) => {
                                    return <tr key={+item.date}>
                                        <td className={classes.dateCell}>
                                            <span className={classes.restDate}>{getHumanDate(item.date)}</span>
                                        </td>
                                        <td className={classes.dateNote}>{item.note}</td>
                                        <td className={classes.rightColumnCell}>
                                            <div
                                                className={classes.removeBtn}
                                                onClick={() => {
                                                    current.setDays((prevState) => {
                                                        return prevState.filter((el) => {
                                                            return getHumanDate(item.date) !== getHumanDate(el.date);
                                                        });
                                                    });
                                                }}
                                            ></div>
                                        </td>
                                    </tr>;
                                })}
                                </tbody>
                            </Table>
                    }

                </div>

            </div>
        </div>);
};

export default AdditionalDay;
