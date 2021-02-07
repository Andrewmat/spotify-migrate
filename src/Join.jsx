import * as React from 'react'

/**
 * @typedef {import('react').ReactChild} ReactChild
 * @typedef {import('react').ReactElement} ReactElement
 */

/**
 * @param {{
 *   children: ReactChild,
 *   separator: ReactElement
 * }}
 */
export default function Join({children, separator}) {
  const count = React.Children.count(children)
  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (i === count - 1) {
          return child
        }
        return (
          <>
            {child}
            {separator}
          </>
        )
      })}
    </>
  )
}
