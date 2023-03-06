import { useState } from "react";
import CommentAddForm from "../comment-add-form/comment-add-form";
import styled from "styled-components";
import iconReply from './icons/icon-reply.svg'

const CommentItem = styled.div`
  background: #fff;
  width: 100%;
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 4px 4px 4px -4px rgba(34, 60, 80, 0.2);
  padding: 20px;

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

  .reply-btn{
    color: hsl(238, 40%, 52%);
    font-weight: 700;
    cursor: pointer;
  }

  .reply-btn img{
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
`

const Comment = ({ item, currentUser, addCommentReply }) => {

  const [openAddForm, setOpenAddForm] = useState(false)
  const [replyId, setReplyId] = useState(null)

  const replyClick = (id) => {
    setReplyId(id)
    setOpenAddForm(openAddForm => !openAddForm)
  }

  return (
    <>
      <CommentItem>
        <div className="item-box">
          <div className="count-box">
            <div className="plus">+</div>
            <div className="count">{item.score}</div>
            <div className="minus">-</div>
          </div>
          <div className="content-box">
            <div className="header">
              <div className="user-box">
                <div className="user">
                  <img src={item.user?.image.png} alt="" />
                  <div className="username">{item.user?.username}</div>
                </div>
                <div className="created">{item.createdAt}</div>
              </div>
              <div className="reply-btn" onClick={() => replyClick(item.id)}>
                <img src={iconReply} alt="" />
                Reply
              </div>
            </div>
            <div className="content">{item.content}</div>
          </div>
        </div>
      </CommentItem>
      {openAddForm ?
        <CommentAddForm
          currentUser={currentUser}
          reply={true}
          replyToName={item.user?.username}
          replyToId={replyId}
          addCommentReply={addCommentReply} />
        :
        null
      }

      {item.replies && item.replies.length ?
        <div className="replies-box">
          {
            item.replies.map((element, index) => {
              return <Comment item={element} currentUser={currentUser} key={element.id} addCommentReply={addCommentReply} />
            })
          }
        </div>
        : null}

    </>

  )
}

export default Comment