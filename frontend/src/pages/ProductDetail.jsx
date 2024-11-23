import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"
import ProductDescription from "../components/Shop/ProductDescription"


const ProductDetail = () => {
  return (
    <div>
    <header>
        <Navbar />
    </header>
    <main>
        <ProductDescription />
        <Newsletter />
    </main>
    <footer>
        <Footer />
    </footer>
</div>
  )
}

export default ProductDetail