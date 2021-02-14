import * as React from 'react'
import {ThemeProvider} from 'styled-components'
import { Theme } from '@/styled';

const spotifyTheme: Theme.Theme = {
  accent: {
    bg: '#1db954',
    bgLight: '#2bde6a',
    bgOutline: '#168d40',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: 'transparent',
  },

  base: {
    bg: '#191414',
    bgLight: '#362b2b',
    bgOutline: '#168d40',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: '#cccccc',
  },

  neutral: {
    bg: '#666666',
    bgLight: '#999999',
    bgOutline: '#191414',
    fg: '#ffffff',
    fgLight: '#ffffff',
    border: 'transparent',
  },
}

export function SpotifyThemeProvider({children}) {
  return <ThemeProvider theme={spotifyTheme}>{children}</ThemeProvider>
}

export {spotifyTheme}
