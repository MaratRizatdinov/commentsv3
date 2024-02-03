import { renderMainPage } from './components/index.js'
import { registrationPage } from './components/registrationPage.js'
import { loginPage } from './components/loginPage.js'
import './styles/styles.css'

// ------------------НАЧАЛЬНЫЕ ДАННЫЕ-------------------

const state = {
    init: {
        page: 'auth',
        isAuth: false,
        authMode: 'login',
    },
}

//----------------------РОУТЕР Ghb----------------------------

export const appRouter = (state) => {
    let flag = state.init.page
    let authMode = state.init.authMode

    switch (flag) {
        case 'main':
            console.log('first')
            renderMainPage(state)
            break
        case 'auth':
            authMode === 'registration'
                ? registrationPage(state)
                : loginPage(state)
            break
        default:
            break
    }
}
//------------------Запуск приложения------------------

appRouter(state)
