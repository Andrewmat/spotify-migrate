import * as React from 'react'

export default function Join({
  children,
  separator,
}: React.PropsWithChildren<{separator: React.ReactNode}>) {
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
