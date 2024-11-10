import React, { createRef, useEffect } from 'react'

type Props = {
  value: number
  total: number
}

export default function CircularProgress({ value, total }: Props) {
  const ref = createRef<HTMLDivElement>()

  const percentageValue = (value / total) * 100

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.setProperty('--progress', percentageValue + '%')
    ref.current.setAttribute('data-value', value.toString())
  }, [value])

  return <div className='progress' ref={ref} data-value={value}></div>
}
