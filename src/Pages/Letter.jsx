import React from 'react'
import styled from 'styled-components'

const Letter = () => {
  return (
    <Wrap>
        <Text>
            flkasdl;kfjads;lfjl;kadsjf;lkadsjfkl;dsajflkdsjalkjfㅣㅏ얾ㄴ;ㅏㅣㅓ리;ㅏㅇㄴ머라ㅣ ㅏㅣ러 ㅣㅏㄴ얼 ㅣㅏㄴㅇ머 리ㅏ;언ㅁ ㅣㅏ;ㅓㄹ ㅣㄴㅇ멀 ㅏㅣㅇㅁ너ㅣ ㄹ;ㅓㅁㄴㅇ ㅣㅏㅓㄹㄴㅁ이ㅏ ㅓ리ㅏㅁㅇㄴ ㄴㄴㄴ
            ㄹㅇㄴㄹㅁ
        </Text>
        <From>
            From. 서준이가
        </From>
    </Wrap>
  )
}

const Wrap = styled.div`
    width: 100%;
    padding: 5px 15px;
    border: 2px solid black;
    border-radius: 9px;
    margin-bottom: 35px;
    word-break: break-word; /* 긴 단어가 화면을 넘어갈 때 자동으로 줄바꿈 */
    
    @media (max-width: 768px) {
        padding: 5px 10px; /* 화면이 작아지면 padding을 줄임 */
    }
    
    @media (max-width: 480px) {
        padding: 5px 8px;  /* 더 작은 화면에서는 padding을 더 줄임 */
    }
`

const Text = styled.p`
    font-size: 22px;
    line-height: 1.5;

    @media (max-width: 768px) {
        font-size: 18px; /* 화면이 작아지면 폰트 크기를 줄임 */
    }
    
    @media (max-width: 480px) {
        font-size: 16px; /* 작은 화면에서 더 작은 폰트 */
    }
`

const From = styled.p`
    font-size: 25px;
    text-align: end;

    @media (max-width: 768px) {
        font-size: 20px; /* 화면이 작아지면 폰트 크기를 줄임 */
    }
    
    @media (max-width: 480px) {
        font-size: 18px; /* 작은 화면에서 더 작은 폰트 */
    }
`

export default Letter