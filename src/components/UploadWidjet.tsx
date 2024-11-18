import { useEffect, useRef } from 'react'

import {
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetError,
  CloudinaryUploadWidgetInstanceMethods,
} from '@cloudinary-util/types'

type CloudinaryInstance = any

interface UploadWidgetProps {
  children?: ({
    open,
  }: {
    open: CloudinaryUploadWidgetInstanceMethods['open']
  }) => JSX.Element
  onUpload?: (
    error: CloudinaryUploadWidgetError,
    result: CloudinaryUploadWidgetResults,
    widget?: CloudinaryUploadWidgetInstanceMethods
  ) => void
}

let cloudinary: CloudinaryInstance

const UploadWidget = ({ children, onUpload }: UploadWidgetProps) => {
  const widgetRef = useRef<CloudinaryUploadWidgetInstanceMethods>()
  const cloudinaryRef = useRef<CloudinaryInstance>()

  useEffect(() => {
    if (!cloudinaryRef.current) {
      cloudinaryRef.current = (window as any).cloudinary
    }

    function onIdle() {
      if (!widgetRef.current) {
        widgetRef.current = createWidget()
      }
    }

    'requestIdleCallback' in window
      ? requestIdleCallback(onIdle)
      : setTimeout(onIdle, 1)

    return () => {
      widgetRef.current?.destroy()
      widgetRef.current = undefined
    }
    // eslint-disable-next-line
  }, [])

  function createWidget() {
    const cloudName = 'dzfmf7nk8'
    const uploadPreset = 'c4sqfrww'

    if (!cloudName || !uploadPreset) {
      console.warn(`Kindly ensure you have the cloudName and UploadPreset 
      setup in your .env file at the root of your project.`)
    }
    const options = {
      cloudName,
      uploadPreset,
    }

    return cloudinaryRef.current?.createUploadWidget(
      options,
      function (
        error: CloudinaryUploadWidgetError,
        result: CloudinaryUploadWidgetResults
      ) {
        if (
          (error || result.event === 'success') &&
          typeof onUpload === 'function'
        ) {
          onUpload(error, result, widgetRef.current)
        }
      }
    )
  }

  /**
   * open
   * @description When triggered, uses the current widget instance to open the upload modal
   */

  function open() {
    if (!widgetRef.current) {
      widgetRef.current = createWidget()
    }
    widgetRef.current && widgetRef.current.open()
  }

  return <>{typeof children === 'function' && children({ open })}</>
}

export default UploadWidget
