import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import classes from "./Login.module.css";
import PostService from "../../API/postService";
import er from "react-datepicker";

const Login = ({block, setBlock, setUserFullName, userFullName}) => {
    const [err, setErr] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <h1 className={classes.title}>Вход в систему контроля посещаемости</h1>
                <form
                    className={classes.form}
                    onSubmit={async (e) => {
                        e.preventDefault()
                        try {
                            const response = await PostService.login([username, password])
                            if (response.data.status === 'success') {
                                const regex = new RegExp(/^(\S+)\s+(\S+)\s+(\S+)$/)
                                const match = (response.data.displayName).match(regex)
                                setUserFullName({surname:match[1],name:match[2],patronymic:match[3]})
                                setBlock(false)
                            }
                        } catch (err) {
                            setBlock(true)
                            console.log(err)
                            switch (err.response.status) {
                                case 401:
                                    setErr('Неверный логин или пароль')
                                    break
                                case 500:
                                    setErr('Внутренняя ошибка сервера')
                                    break
                                default:
                                    setErr(err.response.data)
                            }
                        }
                    }}
                >
                    <Form.Control
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        placeholder={'Логин'}
                        value={username}
                        required
                    />
                    <Form.Control
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        type={'password'}
                        placeholder={'Пароль'}
                        value={password}
                        required
                    />
                    {
                        <div className={classes.errMsg}>{err}</div>
                    }

                    <button type={"submit"} className={classes.submitBtn}>Войти</button>
                </form>
            </div>
        </div>
    );
};

export default Login;