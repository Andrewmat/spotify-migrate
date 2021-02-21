import styled from 'styled-components'

interface TextMarginProps {
  margin?: number
}

const TextMargin = styled.span<TextMarginProps>`
  display: inline-block;
  margin: ${props => props.margin ?? 5}px;
`

export default TextMargin
