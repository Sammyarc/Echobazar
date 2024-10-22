// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Signin from '../components/Signin/Signin'
import Newsletter from '../components/Newsletter/Newsletter'
import Footer from '../components/Footer/Footer'

const Signup = () => {
  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <Signin />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Signup