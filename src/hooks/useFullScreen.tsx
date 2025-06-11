import { useCallback, useEffect, useState } from 'react'

const useFullscreen = (targetRef?: React.RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activateFullscreen = useCallback(() => {
    const element = targetRef?.current || document.documentElement

    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if ((element as any).webkitRequestFullscreen) {
      ;(element as any).webkitRequestFullscreen()
    } else if ((element as any).mozRequestFullScreen) {
      ;(element as any).mozRequestFullScreen()
    } else if ((element as any).msRequestFullscreen) {
      ;(element as any).msRequestFullscreen()
    } else {
      console.error('Fullscreen mode is not supported in this browser.')
    }
  }, [targetRef])

  const exitFullscreen = useCallback(() => {
    if (
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        ;(document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        ;(document as any).msExitFullscreen()
      } else {
        console.error('Exiting fullscreen is not supported in this browser.')
      }
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen =
        !!document.fullscreenElement ||
        !!(document as any).webkitFullscreenElement ||
        !!(document as any).mozFullScreenElement ||
        !!(document as any).msFullscreenElement

      setIsFullscreen(isNowFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      )
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  return { isFullscreen, activateFullscreen, exitFullscreen }
}

export default useFullscreen
