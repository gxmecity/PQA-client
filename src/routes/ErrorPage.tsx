const ErrorPage = () => {
  return (
    <div className=' h-[100dvh] flex items-center justify-center'>
      <div className=' w-[90%] max-w-[700px] flex gap-5'>
        <div className=' flex items-center border-r border-r-black-900 pr-5'>
          <h1 className=' font-bold text-4xl'>404</h1>
        </div>
        <div>
          <h1 className=' font-bold text-2xl'>Opps!</h1>
          <p>
            Sorry the page you are looking for does not exist or has been
            deleted
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
