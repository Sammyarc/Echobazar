// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import ForgotPassword from '../components/Signin/ForgotPassword'
import Newsletter from '../components/Newsletter/Newsletter'
import Footer from '../components/Footer/Footer'

const Resetpassword = () => {
  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <ForgotPassword />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Resetpassword