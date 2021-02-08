import styled from 'styled-components'

const theme = {
  primary: {
    bgColor: 'var(--accent-base)',
    color: 'var(--bg-base)',
    hover: {
      bgColor: 'var(--accent-light)',
      color: 'var(--bg-light)',
    },
  },
  secondary: {
    bgColor: 'var(--fg-base)',
    color: 'var(--bg-base)',
    hover: {
      bgColor: 'var(--fg-light)',
      color: 'var(--bg-light)',
    },
  },
  neutral: {
    bgColor: 'var(--nt-base)',
    color: 'var(--bg-base)',
    hover: {
      bgColor: 'var(--nt-light)',
      color: 'var(--bg-light)',
    },
  },
}

const Button = styled.button`
  display: inline-block;
  background-color: ${props => theme[props.theme].bgColor};
  color: ${props => theme[props.theme].color};
  font-size: ${props => (props.size ? props.size : '1em')};
  font-weight: bold;
  padding: 10px 30px;
  border-radius: 500px;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => theme[props.theme].hover.bgColor};
    color: ${props => theme[props.theme].hover.color};
  }

  &[disabled] {
    cursor: not-allowed;
  }

  :focus {
    outline: none;
  }

  :focus-visible {
    box-shadow: 0 0 3px 2px var(--focus-outline);
  }

  :focus:not(:focus-visible) {
    box-shadow: none;
  }
`

Button.defaultProps = {
  theme: 'primary',
}

export default Button
