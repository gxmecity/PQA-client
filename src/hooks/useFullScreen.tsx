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

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        // Safari compatibility
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        // Firefox compatibility
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        // IE/Edge compatibility
        ;(document as any).msExitFullscreen()
      } else {
        console.error('Exiting fullscreen is not supported in this browser.')
      }
    }
  }, [])

  return { activateFullscreen, exitFullscreen }
}

export default useFullscreen
