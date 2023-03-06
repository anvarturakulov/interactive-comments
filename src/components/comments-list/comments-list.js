import Comment from "../comment/comment";

import styled from "styled-components";

const CommentsList = ({ comments, currentUser, addCommentReply }) => {
  return (
    <>
      {comments.map((item, index) => {
        return <Comment item={item} key={item.id} currentUser={currentUser} addCommentReply={addCommentReply} />
      })}
    </>
  )
}

export default CommentsList