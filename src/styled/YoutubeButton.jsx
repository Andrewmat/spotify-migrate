import styled from 'styled-components'

const YoutubeButton = styled.button`
  border: none;
  background-color: #212121;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 500px;
  font-weight: 600;
  cursor: pointer;

  [disabled] {
    opacity: 0.6;
  }

  :hover {
    background-color: #414141;
  }
`

export default YoutubeButton
