export const getList: (list: Post[], categoryName?: string) => Post[] = (
  list,
  categoryName
) => list.map((item) => getItem(item, categoryName))

export const getItem: (item: Post, categoryName?: string) => Post = (
  item,
  categoryName
) => ({
  ...item,
  category: categoryName || item.categories[0].name,
  commentsCount: item.comments ? item.comments.length : 0
})

export const getNestedComments: (
  comments: CommentMessageResponse[]
) => CommentMessage[] = (comments) => {
  const firstLevelComments = comments
    .filter((comment) => !comment.threadOf)
    .map((comment) => ({
      ...comment,
      createdAt: comment.created_at,
      level: 1
    }))

  const nestComments = (
    listToMap: CommentMessageResponse[],
    relatedList: CommentMessageResponse[]
  ) => {
    return listToMap.map((comment) => {
      const relatedComments = relatedList
        .filter((commentToFind) => comment.id === commentToFind.threadOf)
        .map((relatedComment) => ({
          ...relatedComment,
          comments: [],
          createdAt: relatedComment.created_at,
          level: comment.level + 1
        }))

      return {
        ...comment,
        comments: nestComments(relatedComments, comments)
      }
    })
  }

  return nestComments(firstLevelComments, comments)
}
