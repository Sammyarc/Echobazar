import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"
import Illustration from "../assets/Icons/Illustration.svg"
import { Link } from "react-router-dom"

const ErrorPage = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <main>
                <section>
                    <div
                        className="flex flex-col items-center justify-center bg-white my-[10vw] md:my-[3vw] text-center">
                        <img src={Illustration} alt='404 not found' className="w-[90vw] h-[50vw] md:w-[60vw] md:h-[20vw]"/>
                        <div className="text-[4vw] md:text-[1.5vw] font-Poppins font-semibold mt-4 text-gray-800">
                            Oops! Page not found
                        </div>
                        <p className="text-[3.5vw] md:text-[1vw] font-Poppins text-Gray600 mt-2 md:max-w-[35vw]">
                            Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros. Maecenas
                            sagittis tortor at metus mollis.
                        </p>
                        <Link to="/" onClick={() => window.scrollTo(0,0)}
                            className="mt-6 bg-Primary text-white font-medium font-Poppins py-[2vw] px-[5vw] md:py-[0.7vw] md:px-[1.5vw] rounded-full text-[3vw] md:text-[1vw]">
                            Back to Home
                        </Link>
                    </div>
                </section>
                <section>
                <Newsletter/>
                </section>
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default ErrorPage