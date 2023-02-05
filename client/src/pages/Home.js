import Nav from "../components/Nav"
import {useState} from "react"
import { useCookies } from "react-cookie"


import AuthModal from "../components/AuthModal"

const Home = () => {
    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    
    const authToken = cookies.AuthToken

    const handleClick = () => {

        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }

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
                authToken={authToken}
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