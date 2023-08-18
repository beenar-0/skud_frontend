import classes from "./DepartmentList.module.css";

const DepartmentList = ({excludeList, setExcludeList, sortedPersons, reqDepartments, setReqDepartments}) => {
    let departments = []
    sortedPersons.forEach((person) => {
        if (!departments.find(item => item.DepartmentID === person.DepartmentID)) departments.push({
            Department: person.Department,
            DepartmentID: person.DepartmentID
        })
    })

    function isChecked(temp) {
        let acc = 0
        temp.forEach((item) => {
            if (!excludeList.find((el => el === item.ID))) acc++
        })
        return !!acc
    }

    return (
        <ul className={classes.departmentList}>
            {departments.map(department => {
                let temp = sortedPersons.filter(el => el.DepartmentID === department.DepartmentID)
                return (
                    <li className={classes.listItem} key={department.DepartmentID}>
                        <label className={classes.listItem__inner}>
                            {department.Department}
                            <input
                                checked={isChecked(temp, department.DepartmentID)}
                                type="checkbox"
                                onChange={() => {
                                    let acc = 0
                                    temp.map((item) => {
                                        if (excludeList.includes(item.ID)) acc++
                                    })
                                    if (acc === temp.length) setReqDepartments(prevState => prevState.filter(el => el !== department.DepartmentID))
                                    if (reqDepartments.includes(department.DepartmentID)) {
                                        temp = temp.map(item => item.ID)
                                        temp = temp.filter((item) => {
                                            return !excludeList.find(el => el === item)
                                        })
                                        setExcludeList(prevList => [...prevList, ...temp]);
                                        setReqDepartments(prevState=>prevState.filter(el => el !== department.DepartmentID));
                                    } else {
                                        temp.forEach((item) => {
                                            setExcludeList(prevList => prevList.filter(el => el !== item.ID))
                                        })
                                        setReqDepartments(prevList=>[...prevList, department.DepartmentID])
                                    }
                                }}
                            />
                        </label>
                        <div className={classes.separator}></div>
                    </li>
                )
            })}
        </ul>
    );
};

export default DepartmentList;