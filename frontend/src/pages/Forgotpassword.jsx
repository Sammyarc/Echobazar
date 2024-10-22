// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import PasswordReset from '../components/Signin/PasswordReset'
import Footer from '../components/Footer/Footer'
import Newsletter from '../components/Newsletter/Newsletter'

const Forgotpassword = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <main>
                <PasswordReset/>
                <Newsletter />
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default Forgotpassword