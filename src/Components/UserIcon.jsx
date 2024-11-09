import React from 'react'
import styled from 'styled-components'

const UserIcon = ({nickName}) => {
  return (
    <UserIconWrap >
        <Icon/>
        <span>{nickName}</span>
    </UserIconWrap>
  )
}

const Icon = styled.div`
  width: 80px;
  height: 110px;
  margin-top: 10px;
  margin-left: 22px;
  margin-right: 22px;
  margin-bottom: 7px;
  border-radius: 20px;
  background-image: url("snowman.png");
  background-repeat: no-repeat;
  background-cover: contain;
  background-size: 150%;
  background-position: center center;
  
`

const UserIconWrap = styled.div`
    float: left;
`
export default UserIcon