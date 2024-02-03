import { createApiEndpoints } from '../api/apiModule.js'
import { renderList } from '../scripts/render.js'
import { safeInput } from '../scripts/safeInput.js'
import { appRouter } from '../app.js'

// ----------------------Статичная разметка страницы----------------------------------------

export const renderMainPage = (state) => {
    console.log(state)
    const appEl = document.getElementById('app')
    const appHtml = `<div class="container">
                  <ul class="comments" id="list"></ul>
                  <div class="add-form">
                    <div id="load" class="add-form-load">
                      <input
                        type="text"
                        class="add-form-name"
                        id="name-input"
                        value ="${state.init.login}"
                        disabled
                        placeholder="Введите ваше имя"
                      />
                      <textarea
                        type="textarea"
                        class="add-form-text"
                        id="comment-input"
                        placeholder="Введите ваш коментарий"
                        rows="4"
                      ></textarea>
                      <div class="add-form-row">
                        <button class="add-form-button add-form-button-deactive" id="add-button" disbled >Написать</button>
                        <button class="exit-form-button" id="exit-button">Выйти</button>
                      </div>
                    </div>
                    <span id="load-text" class="load-comment"
                      >Комментарий загружается...</span
                    >
                  </div>
                  <div class="is-auth-no">
                    Чтобы добавить комментарий <span class ="link">авторизуйтесь</span>
                  </div>
                </div>`

    appEl.innerHTML = appHtml

    //-----------------------ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ-------------------------------------

    const listElement = document.getElementById('list')
    const buttonElement = document.getElementById('add-button')
    const nameElement = document.getElementById('name-input')
    const commentElement = document.getElementById('comment-input')
    const loadingField = document.getElementById('load')
    const loadTextElement = document.getElementById('load-text')
    const addFormElement = document.querySelector('.add-form')
    const unAuthElement = document.querySelector('.is-auth-no')
    const linkElement = document.querySelector('.link')
    const exitElement = document.getElementById('exit-button')

    // ----------------Подключаем АПИ Функционал------------------------------------------

    const getComments = createApiEndpoints('getComments', state)
    const addComment = createApiEndpoints('addComment', state)
    const toggleLike = createApiEndpoints('toggleLike', state)

    //---------------Отрисовка страницы в зависимости от состояния авторизации------------

    const isAuth = state.init.isAuth

    if (!isAuth) {
        addFormElement.style.display = 'none'
        unAuthElement.style.display = 'block'
    } else {
        addFormElement.style.display = 'block'
        unAuthElement.style.display = 'none'
    }

    //---------------- Функционал Лоадинга страницы -------------------------------------

    const isLoading = (flag) => {
        if (flag) {
            loadingField.style.display = 'none'
            loadTextElement.style.display = 'inline'
            buttonElement.disabled = true
        } else {
            loadingField.style.display = 'flex'
            loadTextElement.style.display = 'none'
            buttonElement.disabled = false
        }
    }

    //-----------------Функционал Валидации Инпута на заполненность------------------------

    const validateFn = () => {
        if (nameElement.value === '' || commentElement.value === '') {
            buttonElement.disabled = true
            buttonElement.classList.add('add-form-button-deactive')
        } else {
            buttonElement.disabled = false
            buttonElement.classList.remove('add-form-button-deactive')
        }
    }
    nameElement.addEventListener('input', validateFn)
    commentElement.addEventListener('input', validateFn)

    //-----------------Первичный рендер----------------

    renderList({
        listElement,
        getComments,
        toggleLike,
        isLoading,
    })
    buttonElement.disabled = true
    buttonElement.classList.add('add-form-button-deactive')

    //----------------Обрабочик клика отправки комментария ( плюс отправка при нажатии Enter)

    const addCommentOnEvent = () => {
        if (nameElement.value === '' || commentElement.value === '') {
            return
        }
        const body = JSON.stringify({
            text: safeInput(commentElement.value),
            name: safeInput(nameElement.value),
            forceError: true,
        })
        addComment(body, isLoading).then((data) => {
            if (data.response) {
                renderList({
                    listElement,
                    getComments,
                    toggleLike,
                    isLoading,
                })

                // nameElement.value = "";
                commentElement.value = ''
                buttonElement.disabled = true
                buttonElement.classList.add('add-form-button-deactive')
            } else {
                return
            }
        })
    }

    buttonElement.addEventListener('click', addCommentOnEvent)

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            addCommentOnEvent()
        }
    })

    //---------------Обработчик перехода на страницу Логина---------------------------

    linkElement.addEventListener('click', () => {
        state.init.page = 'auth'
        state.init.authMode = 'login'
        appRouter(state)
    })

    //---------------Обработчик кнопки выхода ---------------------------

    exitElement.addEventListener('click', () => {
        state.init.page = 'auth'
        state.init.authMode = 'login'
        state.init.name = ''
        state.init.password = ''
        state.init.token = ''
        state.init._id = ''
        state.init.isAuth = false
        localStorage.removeItem('token')
        appRouter(state)
    })
}
