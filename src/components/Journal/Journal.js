import React, { useEffect, useState } from 'react';
import classes from "./Journal.module.css";
import PostService from "../../API/postService";
import Spinner from 'react-bootstrap/Spinner';

const JournalPage = ({privileges}) => {
    const [saveMsg, setSaveMsg] = useState('')
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resultData, setResultData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchEmployeesAndData();
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [currentYear, currentMonth]);

    const fetchEmployeesAndData = async () => {

        try {
            // Загружаем список сотрудников
            const employeesResponse = await PostService.get_vredniki();
            console.log(employeesResponse)
            const employeesData = employeesResponse.data.recordset.map(employee => ({
                id: employee.ID,
                name: employee.FullName,
                dates: {}
            }));

            // Загружаем данные за текущий месяц
            const calendarResponse = await PostService.getCalendarData(
                currentYear,
                currentMonth + 1
            );

            // Формируем начальные данные
            const initialData = {};
            employeesData.forEach(employee => {
                initialData[employee.id] = [];
            });

            // Заполняем данные из сервера
            if (calendarResponse.data) {
                Object.entries(calendarResponse.data).forEach(([employeeId, dates]) => {
                    if (initialData[employeeId]) {
                        initialData[employeeId] = dates.map(item => ({
                            date: item.date,
                            value: item.hours?.toString() || ''
                        }));

                        // Обновляем данные для отображения
                        const employeeIndex = employeesData.findIndex(
                            e => e.id.toString() === employeeId
                        );
                        if (employeeIndex !== -1) {
                            dates.forEach(item => {
                                const displayDate = item.date.split('.').slice(0, 2).join('.');
                                employeesData[employeeIndex].dates[displayDate] = item.hours?.toString() || '';
                            });
                        }
                    }
                });
            }

            setEmployees(employeesData);
            setResultData(initialData);
        } catch (error) {
            console.log("Ошибка при загрузке данных:", error);
        } finally {

        }
    };

    const getDisplayDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        }).replace(/\//g, '.');
    };

    const getFullDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
    };

    const generateDatesArray = (year, month, daysInMonth) => {
        const dates = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            dates.push({
                displayDate: getDisplayDate(date),
                fullDate: getFullDate(date)
            });
        }
        return dates;
    };

    const datesArray = generateDatesArray(
        currentYear,
        currentMonth,
        new Date(currentYear, currentMonth + 1, 0).getDate()
    );

    const handleCellChange = (employeeIndex, dateObj, value) => {
        if (!/^\d*$/.test(value) || value.length > 1) return;

        setEmployees(prev => {
            const updatedEmployees = [...prev];
            updatedEmployees[employeeIndex] = {
                ...updatedEmployees[employeeIndex],
                dates: {
                    ...updatedEmployees[employeeIndex].dates,
                    [dateObj.displayDate]: value
                }
            };
            return updatedEmployees;
        });

        setResultData(prev => {
            const employeeId = employees[employeeIndex].id;
            const newData = { ...prev };
            const dateIndex = newData[employeeId]?.findIndex(
                item => item.date === dateObj.fullDate
            );

            if (value === '') {
                // Если значение очищено - помечаем для удаления
                if (dateIndex >= 0) {
                    newData[employeeId][dateIndex].value = '';
                }
            } else {
                // Обновляем или добавляем запись
                if (dateIndex >= 0) {
                    newData[employeeId][dateIndex].value = value;
                } else {
                    if (!newData[employeeId]) {
                        newData[employeeId] = [];
                    }
                    newData[employeeId].push({
                        date: dateObj.fullDate,
                        value
                    });
                }
            }

            return newData;
        });
    };

    const handlePrevMonth = () => {
        setIsLoading(true);
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleNextMonth = () => {
        setIsLoading(true);
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Формируем данные для отправки
            const dataToSend = {
                year: currentYear,
                month: currentMonth + 1,
                employeesData: employees.map(employee => {
                    const employeeData = resultData[employee.id] || [];
                    return {
                        employeeId: employee.id,
                        employeeName: employee.name, // Добавляем ФИО сотрудника
                        dates: employeeData
                            .filter(date => date.value !== '')
                            .map(date => ({
                                date: date.date,
                                hours: parseInt(date.value) || 0
                            })),
                        datesToDelete: employeeData
                            .filter(date => date.value === '')
                            .map(date => date.date)
                    };
                }).filter(employee =>
                    employee.dates.length > 0 ||
                    employee.datesToDelete.length > 0
                )
            };

            await PostService.saveCalendarData(dataToSend);
            console.log(dataToSend);
            setTimeout(() => {
                setSaveMsg('Данные успешно сохранены');
            }, 1100);
            await fetchEmployeesAndData();
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            setTimeout(() => {
                setSaveMsg('Произошла ошибка при сохранении данных');
            }, 1100);
        } finally {
            setTimeout(() => {
                setIsSaving(false);
            }, 1000);
            setTimeout(() => {
                setSaveMsg('');
            }, 5000);
        }
    };

    function convertName(fullName){
        const [surname, name, patronymic]= fullName.split(/\s+/)
        return `${surname} ${name[0]}.${patronymic[0]}.`
    }

    if (isLoading) {
        return (
            <div className={classes.spinnerContainer}>
                <Spinner
                    animation="border"
                    role="status"
                    style={{ width: '200px', height: '200px' }}
                >
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.headerControls}>
                <h5 className={classes.monthTitle}>
                    {(() => {
                        const dateStr = new Date(currentYear, currentMonth, 1)
                            .toLocaleDateString('ru-RU', {
                                month: 'long',
                                year: 'numeric'
                            });
                        const [month, year] = dateStr.split(' ');
                        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year.toLowerCase()} г.`;
                    })()}
                </h5>
            </div>

            <div className={classes.saveButtonContainer}>
                <button className={classes.prevBtn} onClick={handlePrevMonth}></button>
                <div className={classes.saveButtonWrapper}>
                    <div
                        className={isSaving ? classes.buttonPressed : classes.button}
                        onClick={handleSave}
                    >
                        {isSaving ? <Spinner animation="border"/> : 'Сохранить'}
                    </div>
                </div>
                <button className={classes.nextBtn} onClick={handleNextMonth}></button>
            </div>

            <div className={classes.scrollContainer}>
                <div className={classes.headerRow}>
                    <div className={classes.firstNameCell}>ФИО</div>
                    {datesArray.map((dateObj, index) => (
                        <div key={index} className={classes.dateCell}>{dateObj.displayDate}</div>
                    ))}
                </div>

                {employees.map((employee, empIndex) => (
                    <div key={empIndex} className={classes.dataRow}>
                        <div className={classes.nameCell}>
                            {convertName(employee.name)}
                        </div>
                        {datesArray.map((dateObj, dateIndex) => (
                            <div key={dateIndex} className={classes.inputCell}>
                                <input
                                    placeholder={'-'}
                                    type="text"
                                    maxLength={1}
                                    value={employee.dates[dateObj.displayDate] || ''}
                                    onChange={(e) => handleCellChange(empIndex, dateObj, e.target.value)}
                                    className={classes.inputField}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JournalPage;