import Nav from "../components/Nav"
import {useState} from "react"

import AuthModal from "../components/AuthModal"

const Home = () => {
    const [showModal, setShowModal] = useState(false)

    const authToken = false

    const handleClick = () => {
        console.log("clicked")
        setShowModal(true)
    }
    return (
        <div className="overlay">

            { showModal && <AuthModal setShowModal={setShowModal} />}

            <Nav 
                minimal={false} 
                authToken={authToken} 
                setShowModal={setShowModal} 
                showModal={showModal}
            />

            <div className="home">

                <h1>Swipe Right</h1>

                <button className='primary_button' onClick={handleClick}>
                    {authToken ? "signout" : "create account"}
                </button>

            </div>

        </div>
    )
}

export default Home