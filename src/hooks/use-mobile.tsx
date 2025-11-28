import { useState, useEffect } from 'react'

export const MOBILE_BREAKPOINT = 768

export function useMobile() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width < MOBILE_BREAKPOINT
}