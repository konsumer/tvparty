export default function Page({ children }) {
  return (
    <div className='flex flex-col min-h-screen bg-base-100'>
      <div className='navbar bg-base-200 shadow-md'>
        <div className='flex-1'>
          <a className='btn btn-ghost text-xl font-bold'>TV Party</a>
        </div>
      </div>
      <main className='flex-grow container mx-auto p-4'>{children}</main>
      <footer className='footer footer-center p-4 bg-base-200 text-base-content'>
        <div>
          <p>
            &copy; 2025 <a href='https://github.com/konsumer/tvparty'>TV Party</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
