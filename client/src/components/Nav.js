import whitelogo from '../images/white-tinder2.png';
import colorlogo from '../images/Tinder-logo.png';

const Nav = ({authToken, minimal, setShowModal, showModal, setIsSignUp}) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }



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