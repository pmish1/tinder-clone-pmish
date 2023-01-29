import Nav from "../components/Nav"
import {useState} from "react"

import AuthModal from "../components/AuthModal"

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)

    const authToken = false

    const handleClick = () => {
        console.log("clicked")
        setShowModal(true)
        setIsSignUp(true)
    }
    return (
        <div className="overlay">

            { showModal && 
                <AuthModal 
                    setShowModal={setShowModal} 
                    isSignUp={isSignUp}
                />
            }

            <Nav 
                minimal={false} 
                setShowModal={setShowModal} 
                showModal={showModal}
                setIsSignUp={setIsSignUp}
            />

            <div className="home">

                <h1 className='primary_title'>Swipe Right</h1>

                <button className='primary_button' onClick={handleClick}>
                    {authToken ? "signout" : "create account"}
                </button>

            </div>

        </div>
    )
}

export default Home