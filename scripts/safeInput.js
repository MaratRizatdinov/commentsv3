//-----------------Функционал защиты инпута--------------------------------------------

export const safeInput = (string) => {
    if (string.includes('&nbsp;')) {
        return string
            .replaceAll('&nbsp;', '<p class="fidback">')
            .replaceAll('&thinsp;', '</p>')
    }
    return string
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
}
