import Comment from "../comment/comment";

import styled from "styled-components";

const CommentsList = ({ comments, currentUser }) => {
  console.log(comments)
  return (
    <>
      {comments.map((item, index) => {
        return <Comment item={item} key={item.id} currentUser={currentUser} />
      })}
    </>
  )
}

export default CommentsList