import ContactForm from "../components/Contact/ContactForm"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"


const Contact = () => {
  return (
    <div>
         <header>
            <Navbar />
        </header>
        <main>
            <ContactForm />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Contact