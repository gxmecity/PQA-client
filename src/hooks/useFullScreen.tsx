import { useCallback } from 'react'

const useFullscreen = (targetRef?: React.RefObject<HTMLElement>) => {
  const activateFullscreen = useCallback(() => {
    const element = targetRef?.current || document.documentElement

    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      // Safari compatibility
      ;(element as any).webkitRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      // Firefox compatibility
      ;(element as any).mozRequestFullScreen()
    } else if ((element as any).msRequestFullscreen) {
      // IE/Edge compatibility
      ;(element as any).msRequestFullscreen()
    } else {
      console.error('Fullscreen mode is not supported in this browser.')
    }
  }, [targetRef])

  return activateFullscreen
}

export default useFullscreen
