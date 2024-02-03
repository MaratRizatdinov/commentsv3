import { errorHandling } from '../scripts/errorHandle.js'

export const createApiEndpoints = (endpoint) => {
    //---------------------------------- АПИ С АВТОРИЗАЦИЕЙ-------------------------

    let url = `https://wedev-api.sky.pro/api/v2/marat-rizatdinov1/comments`

    //-------------------------------- АПИ БЕЗ АВТОРИЗАЦИИ----------------------------

    // let url = `https://wedev-api.sky.pro/api/v1/marat-rizatdinov3/comments`;

    //--------------------------------  АПИ АВТОРИЗАЦИИ-------------------------------

    let loginurl = 'https://wedev-api.sky.pro/api/user'

    //--------------------------------ТОКЕН ИЗ ЛОКАЛСТОРАДЖА------------------------

    // const storageHeader = new Headers({
    //   Authorization: `Bearer ${localStorage.getItem("token")}`,
    // });

    // const stateHeader = new Headers({
    //   Authorization: `Bearer ${state.init.token}`,
    // });

    switch (endpoint) {
        //----------------------------------------------------------------

        case 'getComments':
            return function tryGet(isLoading) {
                const stateHeader = new Headers({
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                })
                isLoading(true)
                return fetch(url, {
                    method: 'GET',
                    headers: stateHeader,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json()
                        } else if (response.status === 500) {
                            throw new Error('500')
                        } else {
                            throw new Error('400')
                        }
                    })
                    .then((data) => {
                        const comments = data.comments
                        return { comments }
                    })
                    .catch((error) => {
                        if (error.message === '500') {
                            return tryGet(isLoading)
                        } else {
                            errorHandling(error)
                        }
                    })
                    .finally(() => isLoading(false))
            }

        //----------------------------------------------------------------

        case 'addComment':
            return function tryAdd(body, isLoading) {
                const stateHeader = new Headers({
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                })
                isLoading(true)
                return fetch(url, {
                    method: 'POST',
                    headers: stateHeader,
                    body,
                })
                    .then((response) => {
                        if (response.status === 201) {
                            return response.json()
                        } else if (response.status === 500) {
                            throw new Error('500')
                        } else {
                            throw new Error(
                                'Комментарий должен быть не короче 3 символов',
                            )
                        }
                    })
                    .then((response) => {
                        return { response }
                    })
                    .catch((error) => {
                        if (error.message === '500') {
                            return tryAdd(body, isLoading)
                        } else {
                            isLoading(false)
                            errorHandling(error)
                            return { error }
                        }
                    })
            }
        //---------------------------------------------------------------------

        case 'toggleLike':
            return function (id, isLoading) {
                const stateHeader = new Headers({
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                })
                isLoading(true)

                return fetch(url + `/${id}/toggle-like`, {
                    method: 'POST',
                    headers: stateHeader,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json()
                        } else if (response.status === 500) {
                            throw new Error('500')
                        } else {
                            throw new Error('400')
                        }
                    })
                    .then((response) => {
                        return { response }
                    })
                    .catch((error) => {
                        isLoading(false)
                        errorHandling(error)
                    })
            }

        //---------------------------------------------------------------------

        case 'getUsers':
            return () => {
                return fetch(loginurl)
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        console.log(data)
                    })
            }

        // -----------------------------------------------------------------------

        case 'authUser':
            return (body) => {
                return fetch(loginurl, {
                    method: 'POST',
                    body,
                })
                    .then((response) => {
                        if (response.status === 400) {
                            throw new Error(
                                'Пользователь с таким логином уже существует',
                            )
                        }
                        return response.json()
                    })
                    .then((data) => {
                        return data
                    })
                    .catch((error) => {
                        errorHandling(error)
                        return 'error'
                    })
            }

        // -----------------------------------------------------------------------

        case 'loginUser':
            return (body) => {
                return fetch(loginurl + '/login', {
                    method: 'POST',
                    body,
                })
                    .then((response) => {
                        if (response.status === 400) {
                            throw new Error('Неправильный логин или пароль!')
                        }
                        return response.json()
                    })
                    .then((data) => {
                        return data.user
                    })
                    .catch((error) => {
                        errorHandling(error)
                        return 'error'
                    })
            }
        // -----------------------------------------------------------------------

        default:
            break
    }
}
