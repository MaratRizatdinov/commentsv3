import { prepareDate } from '../scripts/prepareDate.js'

export const createMainPageContent = (comments) => {
    const listHtml = []

    comments.map((comment) => {
        listHtml.push(
            `<li class="comment" data-index =${comment.id}>
            <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${prepareDate(comment.date)}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${comment.text}
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button  ${
                    comment.isLiked === true
                        ? 'class="like-button -active-like"'
                        : 'class="like-button"'
                } data-index=${comment.id}></button>
              </div>
            </div>
          </li>`,
        )
    })
    return listHtml.join('')
}
