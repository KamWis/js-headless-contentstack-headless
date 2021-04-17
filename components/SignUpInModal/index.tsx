import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Auth from '@aws-amplify/auth'

import Modal from '../Modal'
import SignUpSignInForm from '../SignUpSignInForm'
import { loginUser, logoutUser } from '../../actions'

import VerificationCode from '../VerificationCode'

interface Props {
  onClose: (event: React.MouseEvent<HTMLElement>) => void
  isActive: boolean
  variant: 'signin' | 'signup'
}

interface SignUpState {
  signUpError: string
  signUpResult: null | any
  isLoadingSignUp: boolean
}

interface SignInState {
  signInError: string
  signInResult: null | any
  isLoadingSignIn: boolean
}

interface UseSignUpFormResult extends SignUpState {
  onSubmit: (
    event: any,
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<any>
}

interface UseSignInFormResult extends SignInState {
  onSubmit: (event: any, username: string, password: string) => Promise<any>
}

const useSignUpState = () => {
  const [signUpState, setSignUpState] = useState<SignUpState>({
    signUpError: '',
    signUpResult: null,
    isLoadingSignUp: false
  })

  const appliedSetSignUpState = (
    error: string,
    result: null | any,
    loading: boolean
  ) => {
    setSignUpState({
      signUpError: error,
      signUpResult: result,
      isLoadingSignUp: loading
    })
  }

  return { state: signUpState, stateSetter: appliedSetSignUpState }
}

const useSignInState = () => {
  const [signInState, setSignInState] = useState<SignInState>({
    signInError: '',
    signInResult: null,
    isLoadingSignIn: false
  })

  const appliedSetSignInState = (
    error: string,
    result: null | any,
    loading: boolean
  ) => {
    setSignInState({
      signInError: error,
      signInResult: result,
      isLoadingSignIn: loading
    })
  }
  return { state: signInState, stateSetter: appliedSetSignInState }
}

const SignUpRequest = (
  username: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  return Auth.signUp({
    username: username,
    password: password,
    attributes: {
      email: username,
      given_name: firstName,
      family_name: lastName
    }
  })
}

const SignInRequest = (username: string, password: string) => {
  return Auth.signIn(username, password)
}

const stateVariants = {
  signup: useSignUpState,
  signin: useSignInState
}

const useSignUpInForm = (
  isActive: boolean,
  variant: 'signup' | 'signin',
  onClose?
) => {
  const { state, stateSetter } = stateVariants[variant]()
  const dispatch = useDispatch()

  useEffect(() => {
    return () => stateSetter('', null, false)
  }, [isActive])

  const onSubmit = useCallback(
    async (
      event: React.MouseEvent<HTMLElement>,
      username: string,
      password: string,
      firstName?: string,
      lastName?: string
    ) => {
      try {
        stateSetter('', null, true)

        if (variant === 'signup') {
          const result = await SignUpRequest(
            username,
            password,
            firstName,
            lastName
          )
          stateSetter('', result, false)

          return
        }

        if (variant === 'signin') {
          const result = await SignInRequest(username, password)
          stateSetter('', result, false)

          dispatch(
            loginUser(
              true,
              result.signInUserSession.idToken.jwtToken,
              result.attributes
            )
          )
          onClose(event)

          window.location.reload()
          return
        }
      } catch (err) {
        stateSetter(err.message, null, false)
        dispatch(logoutUser())
      }
    },
    []
  )

  return {
    ...state,
    onSubmit
  }
}

const SignUpModal: React.FC<Props> = ({ onClose, isActive, variant }) => {
  const {
    signUpResult,
    signUpError,
    isLoadingSignUp,
    onSubmit
  } = useSignUpInForm(isActive, 'signup') as UseSignUpFormResult
  const [currentVariant, setCurrentVariant] = useState(variant)

  const onCloseHandler = useCallback(
    (e) => {
      onClose(e)
      setCurrentVariant(variant)
    },
    [currentVariant]
  )
  const {
    signInError,
    isLoadingSignIn,
    onSubmit: onSignInSubmit
  } = useSignUpInForm(isActive, 'signin', onCloseHandler) as UseSignInFormResult
  const onSignUpDescriptionButtonClick = useCallback(() => {
    setCurrentVariant('signin')
  }, [])

  const onSignInDescriptionButtonClick = useCallback(() => {
    setCurrentVariant('signup')
  }, [])

  const shouldRenderVerificationCode =
    signUpResult && !signUpResult.userConfirmed

  return (
    <Modal onClose={onCloseHandler} isActive={isActive}>
      {currentVariant === 'signup' ? (
        <>
          {!signUpResult ? (
            <SignUpSignInForm
              variant="signup"
              authError={signUpError}
              isLoading={isLoadingSignUp}
              onSubmit={onSubmit}
              onDescriptionButtonClick={onSignUpDescriptionButtonClick}
            />
          ) : null}
          {shouldRenderVerificationCode ? (
            <VerificationCode
              username={signUpResult.user.username}
              onConfirmSuccess={onSignUpDescriptionButtonClick}
            />
          ) : null}
        </>
      ) : null}

      {currentVariant === 'signin' ? (
        <SignUpSignInForm
          variant="signin"
          authError={signInError}
          isLoading={isLoadingSignIn}
          onSubmit={onSignInSubmit}
          onDescriptionButtonClick={onSignInDescriptionButtonClick}
        />
      ) : null}
    </Modal>
  )
}

export default SignUpModal
