// --------------------------------------------------------------------------------------
// --------------------------------<< СТРАНИЦА АВТОРИЗАЦИИ >>----------------------------
// --------------------------------------------------------------------------------------

import { safeInput } from '../scripts/safeInput.js'
import { createApiEndpoints } from '../api/apiModule.js'
import { appRouter } from '../app.js'

export const loginPage = (state) => {
    // ---------------------Статичная разметка-----------------------------------------

    const appEl = document.getElementById('app')
    const appHtml = `<div class="containera container__auth">        
                        <div class="auth__form">
                            <h2 class="field__title">Форма логина</h2>                            
                            <input type="text" class="log__field" placeholder="Логин" value ="Марат Р">
                            <input type="text" class="pass__field" placeholder="Пароль" value ="123456">
                            <button class="button__field login">Войти</button>          
                            <button class="button__field button__field__link registration">К регистрации</button>          
                        </div>
                    </div>`

    appEl.innerHTML = appHtml

    //-------------------------Переменные-------------------------------------------

    const loginField = document.querySelector('.log__field')
    const passwordField = document.querySelector('.pass__field')
    const buttonField = document.querySelector('.login')
    const registrationButton = document.querySelector('.registration')

    //-----------------Создаем функционал для работы с АПИ---------------------------

    const loginUser = createApiEndpoints('loginUser')

    //----------------Обрабочик клика отправки данных

    buttonField.addEventListener('click', () => {
        if (passwordField.value === '' || loginField.value === '') {
            alert('Не все поля заполнены!')
            return
        }
        const body = JSON.stringify({
            login: safeInput(loginField.value),
            password: safeInput(passwordField.value),
        })

        buttonField.disabled = true

        loginUser(body).then((data) => {
            if (data === 'error') {
                const answer = confirm(
                    'К сожалению войти не удалось. \n Хотите продолжить без авторизации?',
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
                state.init.name = data.name
                state.init.password = data.password
                state.init.token = data.token
                state.init._id = data._id
                state.init.isAuth = true
                state.init.page = 'main'
                localStorage.setItem('token', data.token)
                appRouter(state)
            }
        })
    })

    //----------------Обработчик перехода на страницу Регистрации

    registrationButton.addEventListener('click', () => {
        state.init.authMode = 'registration'
        appRouter(state)
    })
}
