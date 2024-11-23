import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"
import Products from "../components/Shop/Products"


const ProductsLists = () => {
  return (
    <div>
    <header>
        <Navbar />
    </header>
    <main>
        <Products />
        <Newsletter />
    </main>
    <footer>
        <Footer />
    </footer>
</div>
  )
}

export default ProductsLists