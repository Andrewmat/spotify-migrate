const size = {
  mobileS: '320px',
  mobileL: '480px',
  tablet: '960px',
  desktop: '1366px',
}

export const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  desktop: `(min-width: ${size.desktop})`,
}

export const textEllipsis = `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
