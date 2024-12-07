import UserAccount from "../components/Dashboard/UserAccount"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/Navbar/Navbar"
import Newsletter from "../components/Newsletter/Newsletter"

const UserDashboard = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <main>
                <UserAccount />
                <Newsletter/>
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>
    )
}

export default UserDashboard