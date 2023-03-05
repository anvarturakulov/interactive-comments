import Comment from "../comment/comment";

import styled from "styled-components";

const CommentsList = ({ comments, currentUser }) => {
  console.log(comments)
  return (
    <>
      {comments.map((item, index) => {
        return <Comment item={item} key={index} currentUser={currentUser} />
      })}
    </>
  )
}

export default CommentsList