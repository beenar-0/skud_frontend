import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import classes from "./CalendarForm.module.css";
import PostService from "../../API/postService";
import Spinner from 'react-bootstrap/Spinner';

const CalendarPage = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [resultData, setResultData] = useState({});

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await PostService.get_vredniki();
                console.log(response.data.recordset)
                const employeesData = response.data.recordset.map(employee => ({
                    id: employee.ID,
                    name: employee.FullName,
                    dates: {}
                }));
                setEmployees(employeesData);
                initializeResultData(employeesData);
            } catch (error) {
                console.error("Ошибка при загрузке сотрудников:", error);
            } finally {
                setTimeout(()=>{
                    setIsLoading(false);
                },500)

            }
        };

        fetchEmployees();
    }, []);

    const initializeResultData = (employeesData) => {
        const initialData = {};
        employeesData.forEach(employee => {
            initialData[employee.id] = []; // Используем ID сотрудника вместо его имени
        });
        setResultData(initialData);
    };

    // Функция для получения даты в формате dd.mm (для отображения)
    const getDisplayDate = (date) => {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
        }).replace(/\//g, '.');
    };

    // Функция для получения даты в формате dd.mm.yyyy (для сохранения)
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
                displayDate: getDisplayDate(date), // Для отображения в заголовке
                fullDate: getFullDate(date)      // Для сохранения в результатах
            });
        }
        return dates;
    };

    const datesArray = generateDatesArray(currentYear, currentMonth,
        new Date(currentYear, currentMonth + 1, 0).getDate());

    const handleCellChange = (employeeIndex, dateObj, value) => {
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
            const employeeId = employees[employeeIndex].id; // Используем ID сотрудника вместо имени
            const newData = { ...prev };

            const dateIndex = newData[employeeId].findIndex(item => item.date === dateObj.fullDate);

            if (dateIndex >= 0) {
                newData[employeeId][dateIndex].value = value;
            } else {
                newData[employeeId].push({
                    date: dateObj.fullDate,
                    value
                });
            }

            return newData;
        });
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
        if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
        if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    };

    const handleSave = () => {
        console.log('Результирующие данные:', resultData);
        alert('Данные сохранены в консоли!');
    };

    if (isLoading) {
        return <div className={classes.spinnerContainer}><Spinner
            animation="border"
            role="status"
            style={{width: '200px', height: '200px'}}
        >
            <span className="visually-hidden">Loading...</span>
        </Spinner></div>;
    }

    return (
        <div className={classes.container}>
            <div className={classes.headerControls}>

                <h5 className={classes.monthTitle}>
                    {new Date(currentYear, currentMonth, 1).toLocaleDateString('ru-RU', {
                        month: 'long',
                        year: 'numeric'
                    })}
                </h5>

            </div>

            <div className={classes.saveButtonContainer}>
                <Button variant="outline-secondary" size="sm" onClick={handlePrevMonth}>
                    ← Пред
                </Button>
                <Button variant="primary"  onClick={handleSave}>
                    Сохранить
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={handleNextMonth}>
                    След →
                </Button>
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
                        <div className={classes.nameCell}>{employee.name}</div>
                        {datesArray.map((dateObj, dateIndex) => (
                            <div key={dateIndex} className={classes.inputCell}>
                                <input
                                    placeholder={'-'}
                                    type="text"
                                    maxLength={1}
                                    value={employee.dates[dateObj.displayDate] || ''}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value) && e.target.value.length <= 1) {
                                            handleCellChange(empIndex, dateObj, e.target.value);
                                        }
                                    }}
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

export default CalendarPage;