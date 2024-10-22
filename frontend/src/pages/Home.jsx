// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Homehero from '../components/Hero/Homehero'
import Homefeature from '../components/Features/Homefeature'
import ProductCategories from '../components/Categories/ProductCategories'
import ProductGrid from '../components/ProductGrid/ProductGrid'
import NewProducts from '../components/ProductGrid/NewProducts'
import SummerSaleBanner from '../components/Banner/SummerSaleBanner'
import Footer from '../components/Footer/Footer'
import Newsletter from '../components/Newsletter/Newsletter'

const Home = () => {
    return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            <Homehero />
            <Homefeature />
            <ProductCategories />
            <ProductGrid />
            <NewProducts />
            <SummerSaleBanner />
            <Newsletter />
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
    )
}

export default Home