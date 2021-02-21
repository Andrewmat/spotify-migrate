import styled from 'styled-components'
import {Theme} from '@Type'

interface RoundSquaredButtonProps {
  theme: Theme.Theme
  fontSize?: string
  variant?: Theme.VariantChoices
}

const RoundSquaredButton = styled.button<RoundSquaredButtonProps>`
  display: inline-block;
  background-color: ${themeValue('bg')};
  color: ${themeValue('fg')};
  font-size: ${props => props.fontSize};
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${themeValue('bgLight')};
    color: ${themeValue('fgLight')};
  }

  &[disabled] {
    cursor: not-allowed;
  }

  :focus {
    outline: none;
  }

  :focus-visible {
    box-shadow: 0 0 3px 2px ${themeValue('bgOutline')};
  }

  :focus:not(:focus-visible) {
    box-shadow: none;
  }
`
RoundSquaredButton.defaultProps = {
  fontSize: '1em',
  variant: 'base',
}

function themeValue(
  colorName: Theme.ColorOptions
): (props: RoundSquaredButtonProps) => string {
  return props => props.theme[props.variant][colorName]
}

export default RoundSquaredButton
