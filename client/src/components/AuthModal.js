import {useState} from 'react'
import axios from 'axios'  
import {useNavigate} from 'react-router-dom'
import {useCookies} from'react-cookie'

const AuthModal = ({setShowModal, isSignUp}) => {
    const [email, setEmail]  = useState(null)
    const [password, setPassword]  = useState(null)
    const [confirmPassword, setConfirmPassword]  = useState(null)
    const [error, setError]  = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    let navigate = useNavigate()

    isSignUp ? console.log(email, password, confirmPassword) : console.log(email, password)


    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault() //prevents page from refreshing
        try {
            if (isSignUp && (password !== confirmPassword)) {
                setError('Passwords do not match')
                return
            }

            // posts the email and password to the signup in backend or to login depending
            console.log('before axios post')
            console.log('isSignUp', isSignUp)
            const response = await axios.post(`https://tinderclonepmish.herokuapp.com/${isSignUp ? 'signup': 'login'}`, {email, password})
            console.log('after axios.post')
            
            console.log('response', response)
            //these are the parameters returned from the jsonwebtoken response status code
            setCookie('AuthToken', response.data.token)
            setCookie('UserId', response.data.userId)

            const success = response.status === 201
            if (success && isSignUp) navigate ('/onboarding') //if post request successful and sigin up, navigate to onboarding page
            if (success && !isSignUp) navigate ('/dashboard') //if post request successful and loggin in, navigate to dashboard page
        
            window.location.reload() //make sure auth token is read by /onboarding and /dashboard

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="auth_modal">
            <div className='close_icon' onClick={handleClick}>✕</div>
            <h2>{isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}</h2>
            <p>By Logging In you agree to our T&Cs</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type='email' 
                    id='email' 
                    name='email' 
                    placeholder='email' 
                    required={true} 
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input 
                    type='password' 
                    id='password' 
                    name='password' 
                    placeholder='password' 
                    required={true} 
                    onChange={(e) => setPassword(e.target.value)}
                />

                {isSignUp && <input 
                    type='password' 
                    id='password-check' 
                    name='password-check' 
                    placeholder='confirm password' 
                    required={true} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                /> }

                <input className='secondary_button' type='submit' />
                <p>{error}</p>

            </form>

            <hr/>
            <h2>GET THE APP</h2>

        </div>
    )
}

export default AuthModal