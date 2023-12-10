import React from 'react'
import './VerifyEmail.scss'

const VerifyEmail = () => {
    const handleGoogleButtonClick = () => {
        const googleLink = 'https://mail.google.com/mail';
        sessionStorage.removeItem('decodedToken');
        window.open(googleLink, '_blank');
    };
    const handleYahooButtonClick = () => {
        const googleLink = 'https://login.yahoo.com/';
        sessionStorage.removeItem('decodedToken');
        window.open(googleLink, '_blank');
    };
    const handleOutlookButtonClick = () => {
        const googleLink = 'https://outlook.office365.com/mail';
        sessionStorage.removeItem('decodedToken');
        window.open(googleLink, '_blank');
    };

    return (
        <div>
            <div className="verify-email-main">
                <div className="image"></div>
                <h3 className="msg-header">Verify Your Email</h3>
                <p className="msg">We've just sent an email to your account at abc@gmail.com. To complete the verification process, please check your email inbox and follow the instructions provided to verify your email address. If you don't see the email in your inbox, please also check your spam or junk folder. Thank you for choosing our service!</p>
                <div className="buttons">
                    <button className="btn btn-outline-secondary" onClick={handleGoogleButtonClick}> <div className="google-icon"></div> Google</button>
                    <button className="btn btn-outline-secondary" onClick={handleYahooButtonClick}><div className="yahoo-icon"></div>Yahoo</button>
                    <button className="btn btn-outline-secondary" onClick={handleOutlookButtonClick}><div className="outlook-icon"></div>Outlook</button>
                </div>
                <p className="msg-login">After verifying your email, please log in again for the changes to take effect. Thank you!</p>
            </div>
        </div>
    )
}

export default VerifyEmail
