import { initEventListeners } from './initEventListeners.js'
import { createMainPageContent } from '../components/mainPageContent.js'

export const renderList = ({
    listElement,
    getComments,
    toggleLike,
    isLoading,
}) => {
    getComments(isLoading).then(({ comments }) => {
        listElement.innerHTML = createMainPageContent(comments)

        const likeAction = (elem, event) => {
            event.stopPropagation()
            const id = elem.dataset.index
            toggleLike(id, isLoading).then(() => {
                renderList({ listElement, getComments, toggleLike, isLoading })
            })
        }

        initEventListeners('.like-button', 'click', comments, likeAction)
    })
}
