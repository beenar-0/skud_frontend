import React, {useEffect, useMemo, useState} from 'react';
import Table from 'react-bootstrap/Table';
import postService from './API/postService';
import Header from './components/Header/Header';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import Filter from "./components/Filter/Filter";
import AdditionalDay from "./components/AdditionalDay/AdditionalDay";
import Login from "./components/Login/Login";


function App() {
    const [isStrict, setIsStrict] = useState(true)
    const [block, setBlock] = useState(true)
    const [persons, setPersons] = useState([]);
    const [departments, setDepartments] = useState([])
    const [reqDepartments, setReqDepartments] = useState([])
    useEffect(() => {
        postService.getPersons()
            .then((res) => {
                setPersons(res.data.persons);
                setDepartments(res.data.departments)
            });
    }, []);
    const [excludeList, setExcludeList] = useState([])
    const [startDate, setStartDate] = useState(Date.now());
    const [excludedDate, setExcludedDate] = useState([])
    const [endDate, setEndDate] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState('')
    const [modalActive, setModalActive] = useState({isActive: false, type: ''})
    const [additionalRest, setAdditionalRest] = useState([])
    const [additionalWork, setAdditionalWork] = useState([])
    const searchedPosts = useMemo(() => {
        if (searchQuery) return [...persons].filter((person) => {
            let reg = new RegExp(`${searchQuery.toLowerCase()}`)
            return reg.test(person.SurName.toLowerCase()) || reg.test(person.Name.toLowerCase()) || reg.test(person.Patronymic.toLowerCase()) || reg.test(person.Department.toLowerCase())
        })
        else return persons
    }, [searchQuery, persons])
    useEffect(() => {
        // Загрузка состояний из localStorage при загрузке страницы
        const storedReqDepartments = localStorage.getItem('reqDepartments');
        const storedExcludeList = localStorage.getItem('excludeList');
        const storedIsStrict = localStorage.getItem('isStrict')
        storedIsStrict === 'true' ? setIsStrict(true) : setIsStrict(false)
        if (storedReqDepartments) {
            setReqDepartments(JSON.parse(storedReqDepartments));
        }

        if (storedExcludeList) {
            setExcludeList(JSON.parse(storedExcludeList));
        }
    }, []);
    useEffect(() => {
        const storedReqDepartments = localStorage.getItem('reqDepartments');
        if (!storedReqDepartments) {
            setReqDepartments(departments.map(department => department.ID))
        }
    }, [departments])
    useEffect(() => {
        // Сохранение состояний в localStorage перед закрытием страницы
        window.onbeforeunload = () => {
            localStorage.setItem('isStrict', JSON.stringify(isStrict))
            localStorage.setItem('reqDepartments', JSON.stringify(reqDepartments));
            localStorage.setItem('excludeList', JSON.stringify(excludeList));
        };

        // Очистка обработчика перед удалением компонента
        return () => {
            window.onbeforeunload = null;
        };
    }, [reqDepartments, excludeList, isStrict]);

    return (
        block ?
            <Login
                block={block}
                setBlock={setBlock}
            ></Login>
            : <div className={modalActive.isActive ? "App _modalActive" : "App"}>
                <AdditionalDay
                    additionalWork={additionalWork}
                    setAdditionalWork={setAdditionalWork}
                    additionalRest={additionalRest}
                    setAdditionalRest={setAdditionalRest}
                    modalActive={modalActive}
                    setModalActive={setModalActive}
                />
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <main className='main'>
                    <Filter
                        isStrict={isStrict}
                        setIsStrict={setIsStrict}
                        additionalRest={additionalRest}
                        additionalWork={additionalWork}
                        setModalActive={setModalActive}
                        modalActive={modalActive}
                        excludedDate={excludedDate}
                        setExcludedDate={setExcludedDate}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                        endDate={endDate}
                        persons={persons}
                        setReqDepartments={setReqDepartments}
                        reqDepartments={reqDepartments}
                        departments={departments}
                        excludeList={excludeList}
                        setExcludeList={setExcludeList}
                    />
                    <div className='table__container'>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th className="name">Фамилия</th>
                                <th className="surName">Имя</th>
                                <th className="patronymic">Отчество</th>
                                <th className="department">Отдел</th>
                                <th className="checkBox">
                                    <Form.Check
                                        type="checkbox"
                                        checked={excludeList.length === 0}
                                        onChange={() => {
                                            if (excludeList.length === persons.length) {
                                                setExcludeList([])
                                                let temp = new Set()
                                                persons.map((person) => {
                                                    temp.add(person.DepartmentID)
                                                })
                                                setReqDepartments([...temp])
                                            } else if (excludeList.length > 0) {
                                                setExcludeList([])
                                                let temp = new Set()
                                                persons.map((person) => {
                                                    temp.add(person.DepartmentID)
                                                })
                                                setReqDepartments([...temp])
                                            } else {
                                                let temp = []
                                                persons.map((person) => {
                                                    temp.push(person.ID)
                                                })
                                                setExcludeList([...temp])
                                                setReqDepartments([])
                                            }
                                        }}
                                    />
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {searchedPosts.map((employee, index) => {
                                let isChef = false
                                let isZam = false
                                if (employee.job === 'начальник') isChef = true
                                if (employee.job === 'заместитель') isZam = true
                                return (
                                    <tr key={index}>
                                        <td className={isChef ? 'fat' : isZam ? 'fatGray' : ''}>{employee.SurName}</td>
                                        <td className={isChef ? 'fat' : isZam ? 'fatGray' : ''}>{employee.Name}</td>
                                        <td className={isChef ? 'fat' : isZam ? 'fatGray' : ''}>{employee.Patronymic}</td>
                                        <td className={isChef ? 'fat' : isZam ? 'fatGray' : ''}>{employee.Department}</td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={!excludeList.find(el => el === employee.ID)}
                                                onChange={() => {
                                                    if (excludeList.includes(employee.ID)) setExcludeList(prevList => prevList.filter(el => el !== employee.ID))
                                                    else {
                                                        setExcludeList((prevList) => {
                                                            const res = [...prevList, employee.ID]
                                                            let countedAll = persons.reduce((counter, person) => {
                                                                if (person.DepartmentID === employee.DepartmentID) return counter + 1
                                                                return counter
                                                            }, 0)
                                                            let countedCurr = res.reduce((counter, excludeEl) => {
                                                                if (persons.find(person => person.ID === excludeEl && person.DepartmentID === employee.DepartmentID)) return counter + 1
                                                                else return counter
                                                            }, 0)
                                                            if (countedAll === countedCurr) setReqDepartments(prevState => prevState.filter(el => el !== employee.DepartmentID))
                                                            return res
                                                        })
                                                    }
                                                    if (!persons.find((el) => el.DepartmentID === employee.DepartmentID)) setReqDepartments(prevList => prevList.filter(el => el !== employee.DepartmentID))
                                                    if (!reqDepartments.includes(employee.DepartmentID)) setReqDepartments(prevState => [...prevState, employee.DepartmentID])
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </div>
                </main>
            </div>
    );
}

export default App;
