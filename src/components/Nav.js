import whitelogo from '../images/white-tinder2.png';
import colorlogo from '../images/Tinder-logo.png';

const Nav = ({minimal, setShowModal, showModal, setIsSignUp}) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    const authToken = false

    return (
        <nav>
            <div className='logo_container'>
                <img className='logo' src={minimal ? colorlogo : whitelogo} />
            </div>
            {!authToken && !minimal && 
                <button
                    className='nav_button'
                    onClick={handleClick}
                    disabled={showModal}
                >
                    Log in
                </button>}
        </nav>
    )
}

export default Nav