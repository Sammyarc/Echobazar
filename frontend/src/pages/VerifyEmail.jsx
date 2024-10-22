/* eslint-disable no-unused-vars */
import React from 'react'
import VerifyUser from '../components/Signin/EmailVerificationPage'
import Navbar from '../components/Navbar/Navbar'
import Newsletter from '../components/Newsletter/Newsletter'
import Footer from '../components/Footer/Footer'

const VerifyEmail = () => {
  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <VerifyUser />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default VerifyEmail