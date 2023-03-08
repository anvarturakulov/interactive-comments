import { useState, useEffect } from "react";
import CommentAddForm from "../comment-add-form/comment-add-form";
import styled from "styled-components";
import iconReply from './icons/icon-reply.svg'
import iconDelete from './icons/icon-delete.svg'
import iconEdit from './icons/icon-edit.svg'

const CommentItem = styled.div`
  background: #fff;
  /* width: 100%; */
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: 4px 4px 4px -4px rgba(34, 60, 80, 0.2);
  padding: 20px;
  font-size: 15px;
  transition: all 2s ease-out;

  .item-box{
    display: flex;
    align-items: self-start;
  }

  .header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
    height: 30px;
  }

  .btn{
    font-weight: 700;
    cursor: pointer;
  }

  .reply-edit{
    color: hsl(238, 40%, 52%);
  }

  .delete{
    color:#e9625e;
  }
  .btn img{
    margin-right: 10px;
  }

  .count-box{
    background-color: #f5f6fa;
    color: hsl(238, 40%, 52%);
    font-weight: 700;
    padding: 5px 8px;
    border-radius: 5px;
    text-align: center;
    margin-right: 20px;
    font-size: 17px;
    
  }
  
  .count{
    margin: 3px 0;
    width: 20px;
  }

  .user{
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .user img{
    width: 30px;
    height: 30px;
    margin-right: 15px;
  }

  .username{
    font-weight: 700;
  }
  
  .user-box{
    display: flex;
    align-items: center;
  }

  .content{
    color: #797c81;
  }

  .created{
    color: #797c81;
    font-weight: 500;
  }

  .plus, .minus{
    cursor: pointer;
    color:hsl(211, 10%, 80%);
    :hover{
      color: hsl(238, 40%, 52%);
    }
  }

  .content-box{
    width: 100%;
  }

  .btn-box{
    display: flex;
    .reply-edit{
      margin-left: 20px;
    }
  }

  .you{
    background-color: hsl(238, 40%, 52%);
    color: #fff;
    padding: 1px 5px;
    margin-left: 5px;
    font-size: 14px;
  }

  .bottom-box{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .count-box{
      display: flex;
      width: 50px;
      align-items: center;
      justify-content: space-between;
      padding: 0px 8px;
    }
  }
`

const Comment = ({ item, currentUser, addCommentReply, flagsOpenedReplyForms, incDecScore, comments, deleteComment }) => {

  const [replyId, setReplyId] = useState(null)
  const [flagReplyEdit, setflagReplyEdit] = useState('REPLY')
  const [openReplyForm, setOpenReplyForm] = useState(false)


  const replyClick = (id) => {
    setReplyId(id)
    setOpenReplyForm(!openReplyForm)
  }

  const editClick = (id) => {
    setReplyId(id)
    setOpenReplyForm(!openReplyForm)
    setflagReplyEdit('EDIT')
  }

  useEffect(() => {
    if (flagsOpenedReplyForms) {
      setOpenReplyForm(flagsOpenedReplyForms[item.id])
    }
  }, [flagsOpenedReplyForms])

  let itsMe = currentUser.username === item.user.username

  let itsMobayl = false
  if (window.innerWidth < 576) itsMobayl = true

  return (
    <>
      <CommentItem>
        <div className="item-box">
          {itsMobayl ? null :
            <div className="count-box">
              <div className="plus" onClick={() => incDecScore(item.id, +1)}>+</div>
              <div className="count">{item.score}</div>
              <div className="minus" onClick={() => incDecScore(item.id, -1)}>-</div>
            </div>
          }
          <div className="content-box">
            <div className="header">
              <div className="user-box">
                <div className="user">
                  <img src={item.user?.image.png} alt="" />
                  <div className="username">{item.user?.username}</div>
                  {itsMe ?
                    <div className="you">you</div>
                    : null
                  }
                </div>
                <div className="created">{item.createdAt}</div>
              </div>

              {itsMobayl ? null : itsMe ?
                <div className="btn-box">
                  <div className="btn delete" onClick={() => deleteComment(item.id)}>
                    <img src={iconDelete} alt="" />
                    Delete
                  </div>
                  <div className="btn reply-edit" onClick={() => editClick(item.id)}>
                    <img src={iconEdit} alt="" />
                    Edit
                  </div>
                </div>
                :
                <div className="btn reply-edit" onClick={() => replyClick(item.id)}>
                  <img src={iconReply} alt="" />
                  Reply
                </div>
              }

            </div>
            <div className="content">{item.content}</div>
            <div className="bottom-box">
              {!itsMobayl ? null :
                <div className="count-box">
                  <div className="plus" onClick={() => incDecScore(item.id, +1)}>+</div>
                  <div className="count">{item.score}</div>
                  <div className="minus" onClick={() => incDecScore(item.id, -1)}>-</div>
                </div>
              }

              {!itsMobayl ? null : itsMe ?

                <div className="btn-box">
                  <div className="btn delete" onClick={() => deleteComment(item.id)}>
                    <img src={iconDelete} alt="" />
                    Delete
                  </div>
                  <div className="btn reply-edit" onClick={() => editClick(item.id)}>
                    <img src={iconEdit} alt="" />
                    Edit
                  </div>
                </div>
                :
                <div className="btn reply-edit" onClick={() => replyClick(item.id)}>
                  <img src={iconReply} alt="" />
                  Reply
                </div>
              }
            </div>
          </div>
        </div>
      </CommentItem>
      {openReplyForm ?
        <CommentAddForm
          currentUser={currentUser}
          reply={flagReplyEdit}
          replyToName={item.user?.username}
          replyToId={replyId}
          addCommentReply={addCommentReply}
          comments={comments} />
        :
        null
      }

      {item.replies && item.replies.length ?
        <div className="replies-box">
          {
            item.replies.map((element, index) => {
              return <Comment
                item={element}
                currentUser={currentUser}
                key={element.id}
                addCommentReply={addCommentReply}
                flagsOpenedReplyForms={flagsOpenedReplyForms}
                incDecScore={incDecScore}
                comments={comments}
                deleteComment={deleteComment} />
            })
          }
        </div>
        : null}

    </>

  )
}

export default Comment