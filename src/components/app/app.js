import { useEffect, useState } from 'react';
import styled from 'styled-components';

import CommentsList from '../comments-list/comments-list';
import CommentAddForm from '../comment-add-form/comment-add-form';

import { data } from '../../data'

const Container = styled.div`
  max-width: 640px;
  padding: 0px 20px;
  margin: 0 auto;
`;

const getData = (def = false) => {
  let data = require('../../data.json')
  const defaultData = data
  let localData = JSON.parse(localStorage.getItem('data'))
  return (localData && !def) ? localData : defaultData
}

const newId = (comments) => {
  let arrayId = []
  comments.forEach(item => {
    arrayId.push(item.id)
    if (item.replies && item.replies.length) {
      // console.log(arrayId)
      arrayId.push([...newId(item.replies)])
      // console.log(...newId(item.replies))
    }
  })
  return arrayId
}


function App() {

  const [data, setData] = useState(getData())
  // console.log(data)
  console.log(newId(data.comments))
  return (
    <div className="App">
      <Container>
        <CommentsList comments={data.comments} currentUser={data.currentUser} />
        <CommentAddForm currentUser={data.currentUser} reply={false} replyTo={''} />
      </Container>
    </div>
  );
}

export default App;
