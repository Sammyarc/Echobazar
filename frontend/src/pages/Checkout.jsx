import CheckoutComponent from "../components/Checkout/CheckoutComponent"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"


const Checkout = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <main>
                <CheckoutComponent />
                <Newsletter/>
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default Checkout