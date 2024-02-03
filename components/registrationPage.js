// --------------------------------------------------------------------------------------
// --------------------------------<< СТРАНИЦА РЕГИСТРАЦИИ >>----------------------------
// --------------------------------------------------------------------------------------

import { safeInput } from '../scripts/safeInput.js'
import { createApiEndpoints } from '../api/apiModule.js'
import { appRouter } from '../app.js'

export const registrationPage = (state) => {
    // ---------------------Статичная разметка-----------------------------------------

    const appEl = document.getElementById('app')
    const appHtml = `<div class="containera container__auth">        
                        <div class="auth__form">
                            <h2 class="field__title">Форма регистрации</h2>
                            <input type="text" class="name__field" placeholder="Имя">
                            <input type="text" class="log__field" placeholder="Логин">
                            <input type="text" class="pass__field" placeholder="Пароль">
                            <button class="button__field registration">Зарегистрироваться</button>          
                            <button class="button__field button__field__link login">Войти</button>          
                        </div>
                    </div>`

    appEl.innerHTML = appHtml

    //-------------------------Переменные-------------------------------------------

    const nameField = document.querySelector('.name__field')
    const loginField = document.querySelector('.log__field')
    const passwordField = document.querySelector('.pass__field')
    const buttonField = document.querySelector('.registration')
    const loginButton = document.querySelector('.login')

    //-----------------Создаем функционал для работы с АПИ---------------------------

    const authUser = createApiEndpoints('authUser')

    //----------------Обрабочик клика отправки комментария---------------------------

    buttonField.addEventListener('click', () => {
        if (
            nameField.value === '' ||
            passwordField.value === '' ||
            loginField.value === ''
        ) {
            alert('Не все поля заполнены!')
            return
        }
        const body = JSON.stringify({
            login: safeInput(loginField.value),
            name: safeInput(nameField.value),
            password: safeInput(passwordField.value),
        })
        authUser(body).then((data) => {
            buttonField.disabled = true
            if (data === 'error') {
                const answer = confirm(
                    'К сожалению зарегистрироваться не удалось. \n Хотите продолжить без авторизации?',
                )
                if (answer) {
                    state.init.page = 'main'
                    appRouter(state)
                } else {
                    buttonField.disabled = false
                }
            } else {
                state.init.page = 'main'
                state.init.login = data.login
                state.init.main = data.main
                state.init.password = data.password
                state.init.token = data.token
                state.init._id = data._id
                state.init.isAuth = true
                state.init.page = 'main'
                appRouter(state)
            }
        })
    })

    //---------------Обработчик перехода на страницу Логина---------------------------

    loginButton.addEventListener('click', () => {
        state.init.authMode = 'login'
        appRouter(state)
    })
}
