import FAQSection from "../components/FAQ/FAQSection"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"


const FaQ = () => {
  return (
    <div>
         <header>
            <Navbar />
        </header>
        <main>
            <FAQSection /> 
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default FaQ