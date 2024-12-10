import React, { useState, useEffect } from 'react'

const Clock = () => {
  const [days, setDays] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)

  useEffect(() => {
    let interval: any

    const countDown = () => {
      const destination = new Date('January 31, 2025').getTime()
      interval = setInterval(() => {
        const now = new Date().getTime()
        const difference = destination - now

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))

        const hrs = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )

        const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        const secs = Math.floor((difference % (1000 * 60)) / 1000)

        if (destination < 0) clearInterval(interval.current)
        else {
          setDays(days)
          setHours(hrs)
          setMinutes(mins)
          setSeconds(secs)
        }
      })
    }
    countDown()
  }, [])

  return (
    <div className='flex items-center gap-2 font-bold'>
      <div className='flex items-center gap-2'>
        <div className='text-center'>
          <h1 className=' text-3xl'>{days}</h1>
          <h5 className='text-sm font-normal'>Days</h5>
        </div>
        <span className=''>:</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='text-center'>
          <h1 className=' text-3xl'>{hours}</h1>
          <h5 className=' text-sm font-normal'>Hours</h5>
        </div>
        <span className=''>:</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='text-center'>
          <h1 className=' text-3xl'>{minutes}</h1>
          <h5 className=' text-sm font-normal'>Minutes</h5>
        </div>
        <span className=''>:</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='text-center'>
          <h1 className='text-3xl'>{seconds}</h1>
          <h5 className=' text-sm font-normal'>Seconds</h5>
        </div>
      </div>
    </div>
  )
}

export default Clock
