import * as React from 'react'
import {ThemeProvider} from 'styled-components'
import {Theme} from '@/styled'

const youtubeTheme: Theme.Theme = {
  accent: {
    bg: '#ff0000',
    bgLight: '#ff3333',
    bgOutline: '#ff3333',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: 'transparent',
  },

  base: {
    bg: '#212121',
    bgLight: '#414141',
    bgOutline: '#414141',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: 'transparent',
  },

  neutral: {
    bg: '#616161',
    bgLight: '#818181',
    bgOutline: '#818181',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: 'transparent',
  },
}

export function YoutubeThemeProvider({children}) {
  return <ThemeProvider theme={youtubeTheme}>{children}</ThemeProvider>
}

export {youtubeTheme, ThemeProvider}
