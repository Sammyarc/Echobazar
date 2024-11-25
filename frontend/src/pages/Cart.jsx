import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"
import CartPage from "../components/Shop/CartPage"


const Cart = () => {
  return (
    <div>
         <header>
            <Navbar />
        </header>
        <main>
            <CartPage />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Cart