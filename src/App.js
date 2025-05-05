import React, {useEffect, useMemo, useState} from 'react';
import Table from 'react-bootstrap/Table';
import postService from './API/postService';
import Header from './components/Header/Header';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css'
import Filter from "./components/Filter/Filter";
import AdditionalDay from "./components/AdditionalDay/AdditionalDay";
import Login from "./components/Login/Login";
import JournalPage from "./components/Journal/Journal";


function App() {
    const [privileges, setPrivileges] = useState({})
    const [currentPage, setCurrentPage] = useState('login')
    const [userFullName, setUserFullName] = useState({name: '', surname: '', patronymic: ''})
    const [username, setUsername] = useState('')
    const [reqList, setReqList] = useState([])
    const [isStrict, setIsStrict] = useState(true)
    const [block, setBlock] = useState(true)
    const [persons, setPersons] = useState([]);
    const [departments, setDepartments] = useState([])
    useEffect(() => {
        if (!block) {
            if (privileges.isAdmin || privileges.isHeadOfDepartment) {
                setCurrentPage('main')
                postService.getPersons(userFullName, username)
                    .then((res) => {
                        setPersons(res.data.persons);
                        setDepartments(res.data.departments)
                    });
            }
            if (!privileges.isAdmin && !privileges.isHeadOfDepartment && privileges.isJournalAdmin) setCurrentPage('journal')
        }
    }, [block, privileges]);
    const [startDate, setStartDate] = useState(Date.now());
    const [excludedDate, setExcludedDate] = useState([])
    const [endDate, setEndDate] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState('')
    const [modalActive, setModalActive] = useState({isActive: false, type: ''})
    const [additionalRest, setAdditionalRest] = useState([])
    const [additionalWork, setAdditionalWork] = useState([])
    const [reducedDays, setReducedDays] = useState([])
    const searchedPosts = useMemo(() => {
        if (searchQuery) return [...persons].filter((person) => {
            let reg = new RegExp(`${searchQuery.toLowerCase()}`)
            return reg.test(person.SurName.toLowerCase()) || reg.test(person.Name.toLowerCase()) || reg.test(person.Patronymic.toLowerCase()) || reg.test(person.Department.toLowerCase())
        })
        else return persons
    }, [searchQuery, persons])
    useEffect(() => {
        // Загрузка состояний из localStorage при загрузке страницы
        const storedIsStrict = localStorage.getItem('isStrict')
        storedIsStrict === 'true' ? setIsStrict(true) : setIsStrict(false)
    }, []);
    useEffect(() => {
        // Сохранение состояний в localStorage перед закрытием страницы
        window.onbeforeunload = () => {
            localStorage.setItem('isStrict', JSON.stringify(isStrict))
        };

        // Очистка обработчика перед удалением компонента
        return () => {
            window.onbeforeunload = null;
        };
    }, [isStrict]);

    return (
        block && currentPage === 'login' &&
        <Login
            privileges={privileges}
            setPrivileges={setPrivileges}
            username={username}
            setUsername={setUsername}
            setUserFullName={setUserFullName}
            userFullName={userFullName}
            block={block}
            setBlock={setBlock}
        ></Login> ||
        currentPage === 'journal' &&
        <>
            <Header
                privileges={privileges}
                setPrivileges={setPrivileges}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setBlock={setBlock}
                setPersons={setPersons}
                setDepartments={setDepartments}
                userFullName={userFullName}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            >
            </Header>
            <JournalPage
            privileges={privileges}
            ></JournalPage>
        </> ||
        currentPage === 'main' &&
        <div className={modalActive.isActive ? "App _modalActive" : "App"}>
            <AdditionalDay
                reducedDays={reducedDays}
                setReducedDays={setReducedDays}
                additionalWork={additionalWork}
                setAdditionalWork={setAdditionalWork}
                additionalRest={additionalRest}
                setAdditionalRest={setAdditionalRest}
                modalActive={modalActive}
                setModalActive={setModalActive}
            />
            <Header
                privileges={privileges}
                setPrivileges={setPrivileges}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setBlock={setBlock}
                setPersons={setPersons}
                setDepartments={setDepartments}
                userFullName={userFullName}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <main className='main'>
                <Filter
                    userFullName={userFullName}
                    reducedDays={reducedDays}
                    setReducedDays={setReducedDays}
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
                    departments={departments}
                    reqList={reqList}
                    setReqList={setReqList}
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
                                    checked={reqList.length === persons.length}
                                    onChange={() => {
                                        if (reqList.length === persons.length) {
                                            // Снимаем выделение со всех
                                            setReqList([]);
                                        } else {
                                            // Выделяем всех
                                            setReqList(persons.map(person => person.ID));
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
                                            checked={reqList.includes(employee.ID)}
                                            onChange={() => {
                                                setReqList(prev => {
                                                    // Если сотрудник уже выбран - убираем его
                                                    if (prev.includes(employee.ID)) {
                                                        return prev.filter(id => id !== employee.ID);
                                                    }
                                                    // Если не выбран - добавляем
                                                    else {
                                                        return [...prev, employee.ID];
                                                    }
                                                });
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
