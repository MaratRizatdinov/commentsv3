//-------------------Обработка даты в требуемый формат------------------

import { format } from 'date-fns'

export const prepareDate = (str) => {
    let date = new Date(str)
    return format(date, 'dd.MM.yyyy hh:mm:ss') // 26.03.2023 10:33:41
}
