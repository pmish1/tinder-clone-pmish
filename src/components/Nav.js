import whitelogo from '../images/white-tinder2.png';
import colorlogo from '../images/Tinder-logo.png';

const Nav = ({minimal, authToken, setShowModal, showModal}) => {

    const handleClick = () => {
        setShowModal(true)
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