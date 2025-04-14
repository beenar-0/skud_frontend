import classes from "./DepartmentList.module.css";
import { useMemo } from "react";

const DepartmentList = ({ reqList, setReqList, sortedPersons }) => {
    // Получаем уникальные департаменты
    const departments = useMemo(() => {
        const uniqueDepartments = [];
        const seenIds = new Set();

        for (const person of sortedPersons) {
            if (!seenIds.has(person.DepartmentID)) {
                seenIds.add(person.DepartmentID);
                uniqueDepartments.push({
                    Department: person.Department,
                    DepartmentID: person.DepartmentID
                });
            }
        }

        return uniqueDepartments;
    }, [sortedPersons]);

    // Проверяем, выбран ли хотя бы один сотрудник в отделе
    const isDepartmentPartiallySelected = (departmentId) => {
        const deptPersons = sortedPersons.filter(p => p.DepartmentID === departmentId);
        return deptPersons.some(person => reqList.includes(person.ID));
    };

    // Проверяем, выбран ли весь отдел полностью
    const isDepartmentFullySelected = (departmentId) => {
        const deptPersons = sortedPersons.filter(p => p.DepartmentID === departmentId);
        return deptPersons.length > 0 && deptPersons.every(person => reqList.includes(person.ID));
    };

    // Обработчик переключения отдела
    const handleDepartmentToggle = (departmentId) => {
        const deptPersons = sortedPersons.filter(p => p.DepartmentID === departmentId);
        const allDeptPersonIds = deptPersons.map(p => p.ID);
        const shouldSelect = !isDepartmentFullySelected(departmentId);

        setReqList(prev => {
            if (shouldSelect) {
                // Добавляем всех сотрудников отдела
                const newList = [...prev];
                allDeptPersonIds.forEach(id => {
                    if (!newList.includes(id)) newList.push(id);
                });
                return newList;
            } else {
                // Удаляем всех сотрудников отдела
                return prev.filter(id => !allDeptPersonIds.includes(id));
            }
        });
    };

    return (
        <ul className={classes.departmentList}>
            {departments.map(department => {
                const isFullySelected = isDepartmentFullySelected(department.DepartmentID);
                const isPartiallySelected = isDepartmentPartiallySelected(department.DepartmentID) && !isFullySelected;

                return (
                    <li className={classes.listItem} key={department.DepartmentID}>
                        <label className={classes.listItem__inner}>
                            {department.Department}
                            <input
                                type="checkbox"
                                checked={isFullySelected}
                                ref={input => {
                                    if (input) {
                                        input.indeterminate = isPartiallySelected;
                                    }
                                }}
                                onChange={() => handleDepartmentToggle(department.DepartmentID)}
                            />
                        </label>
                        <div className={classes.separator}></div>
                    </li>
                );
            })}
        </ul>
    );
};

export default DepartmentList;