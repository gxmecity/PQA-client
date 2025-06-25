import { useEffect } from 'react'

function QuizEnded() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload()
    }, 10000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <section className=' h-full w-full max-w-5xl mx-auto overflow-hidden grid place-items-center p-5'>
      <div className=''>
        <h1 className='text-game text-3xl font-bold text-center'>Quiz Ended</h1>
        <p className='text-center text-lg text-muted-foreground font-medium mt-2'>
          Your Quiz has ended and quiz room has closed.
        </p>
      </div>
    </section>
  )
}

export default QuizEnded
