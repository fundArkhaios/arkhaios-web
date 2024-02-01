'use client'
import { useState, useContext } from 'react';
import RecoveryContext from './RecoveryContext';

export default function RecoveryFlow() {
    
    const { sendEmailPage,
        setSendEmailPage,
        codeRecoveryPage,
        setCodeRecoveryPage,
        newPasswordPage,
        setNewPasswordPage,
        emailError,
        setEmailError,
        recoveryCodeError,
        setRecoveryCodeError,
        emailComponent, 
        codeRecoveryComponent,
        newPasswordComponent,
        isLoading,
        setIsLoading,
        renderLoading
        } = useContext(RecoveryContext);

  const renderComponentFlow = () => {
    if (sendEmailPage && !codeRecoveryPage && !newPasswordPage) {
        return (
            <>
            {emailComponent()}
            </>
        )
    } else if (!sendEmailPage && codeRecoveryPage && !newPasswordPage) {
        return (
            <>
            {codeRecoveryComponent()}
            </>
        )
    } else if (!sendEmailPage && !codeRecoveryPage && newPasswordPage) {
        return (
            <>{newPasswordComponent()}</>
        )
    } else {
        return (
            <div>
                Error!
            </div>
        )
    }
}

return(
    <>{renderComponentFlow()}</>
    
)


    
    
}