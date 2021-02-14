import styled from 'styled-components'
import {Theme} from '@Type'

interface RoundButtonProps {
  theme: Theme.Theme;
  fontSize: string;
  variant: Theme.VariantChoices;
}

const RoundButton = styled.button<RoundButtonProps>`
  display: inline-block;
  background-color: ${themeValue('bg')};
  color: ${themeValue('fg')};
  font-size: 1em;
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 500px;
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

RoundButton.defaultProps = {
  fontSize: '1em',
  variant: 'base',
}

/** @param {ColorOptions} colorName */
function themeValue(colorName: Theme.ColorOptions): (props: RoundButtonProps) => string {
  return props => props.theme[props.variant][colorName]
}

export default RoundButton
