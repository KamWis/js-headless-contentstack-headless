import React, { useState, useCallback } from 'react'
import { omit } from 'lodash'

import InputRow from '../InputRow'
import Button from '../Button'

import { NO_VALUE_ERROR_MESSAGE } from '../../constants'

import styles from './SignUpSignInForm.module.css'
import { input } from '@aws-amplify/ui'

interface Props {
  onSubmit: (
    event: React.MouseEvent<HTMLElement>,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => void
  onDescriptionButtonClick: (event: React.MouseEvent<HTMLElement>) => void
  variant: 'signup' | 'signin'
  isLoading?: boolean
  authError?: string
}

interface InputMeta {
  value: string
  error: string
  pristine: boolean
}

interface InputValues {
  username: InputMeta
  password: InputMeta
  firstName: InputMeta
  lastName: InputMeta
}

const initialFieldState = {
  value: '',
  error: '',
  pristine: true
}

const getMappedFieldsWithError = (
  inputValues: InputValues,
  fieldsToOmit?: string[]
): {
  hasError: boolean
  mappedInputValues: InputValues
} => {
  const omitedInputValues = omit(inputValues, fieldsToOmit)

  const hasError = Object.keys(omitedInputValues).some((key) => {
    return !!omitedInputValues[key].error || !omitedInputValues[key].value
  })

  const inputValuesCopy = { ...omitedInputValues }

  const mappedWithErrors = Object.keys(inputValuesCopy).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        ...inputValuesCopy[key],
        error: inputValuesCopy[key].value ? '' : NO_VALUE_ERROR_MESSAGE
      }
    }
  }, {}) as InputValues

  return { hasError, mappedInputValues: mappedWithErrors }
}

const useForm = (onSubmit, variant) => {
  const [inputValues, setInputValues] = useState<InputValues>({
    username: initialFieldState,
    password: initialFieldState,
    firstName: initialFieldState,
    lastName: initialFieldState
  })
  const [hasFormError, setHasFormError] = useState(false)
  const fieldsToOmit = variant === 'signin' ? ['firstName', 'lastName'] : []

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target
      const value = target.value
      const name = target.name

      const newInputValues = {
        ...inputValues,
        [name]: {
          ...inputValues[name],
          value: value,
          error:
            inputValues[name].pristine || (!inputValues[name].pristine && value)
              ? ''
              : NO_VALUE_ERROR_MESSAGE
        }
      }

      setInputValues(newInputValues)

      const { hasError } = getMappedFieldsWithError(
        newInputValues,
        fieldsToOmit
      )

      setHasFormError(hasError)
    },
    [inputValues]
  )

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const target = event.target
      const name = target.name

      setInputValues({
        ...inputValues,
        [name]: {
          ...inputValues[name],
          pristine: false
        }
      })
    },
    [inputValues]
  )

  const onFormSubmit = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      const { hasError, mappedInputValues } = getMappedFieldsWithError(
        inputValues,
        fieldsToOmit
      )

      setHasFormError(hasError)
      setInputValues(mappedInputValues)

      if (hasError) {
        return
      }

      if (variant === 'signIn') {
        onSubmit(event, inputValues.username.value, inputValues.password.value)

        return
      }

      onSubmit(
        event,
        inputValues.username.value,
        inputValues.password.value,
        inputValues.firstName.value,
        inputValues.lastName.value
      )
    },
    [inputValues]
  )

  return {
    onFormSubmit,
    handleInputChange,
    handleInputFocus,
    hasFormError,
    usernameField: inputValues.username,
    passwordField: inputValues.password,
    firstNameField: inputValues.firstName,
    lastNameField: inputValues.lastName
  }
}

const variants = {
  signup: {
    mainText: 'Sign up',
    descriptionText: 'Already have an account?',
    descriptionButtonText: 'Sign in'
  },
  signin: {
    mainText: 'Sign in',
    descriptionText: 'Don’t have an account?',
    descriptionButtonText: 'Sign up'
  }
}

const SignUpSignInForm: React.FC<Props> = ({
  onSubmit,
  variant,
  onDescriptionButtonClick,
  isLoading = false,
  authError = ''
}) => {
  const {
    onFormSubmit,
    handleInputChange,
    handleInputFocus,
    hasFormError,
    usernameField,
    passwordField,
    firstNameField,
    lastNameField
  } = useForm(onSubmit, variant)

  const { mainText, descriptionText, descriptionButtonText } = variants[variant]

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>{mainText}</h2>
      <div>
        {descriptionText}{' '}
        <button
          className="textM strong textButton active"
          onClick={onDescriptionButtonClick}
        >
          {descriptionButtonText}
        </button>
      </div>
      <form>
        <InputRow
          labelText="Username (email)"
          id="username"
          name="username"
          type="text"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={usernameField.error}
          value={usernameField.value}
        />
        {variant === 'signup' && (
          <>
            <InputRow
              labelText="First name"
              id="firstName"
              name="firstName"
              type="text"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={firstNameField.error}
              value={firstNameField.value}
            />
            <InputRow
              labelText="Last name"
              id="lastName"
              name="lastName"
              type="text"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              error={lastNameField.error}
              value={lastNameField.value}
            />
          </>
        )}
        <InputRow
          labelText="password"
          id="password"
          name="password"
          type="password"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          error={passwordField.error}
          value={passwordField.value}
        />
        <Button
          type="submit"
          className={styles.button}
          onClick={onFormSubmit}
          disabled={hasFormError || isLoading}
        >
          {mainText}
        </Button>
      </form>
      {authError && <div className={styles.error}>{authError}</div>}
    </div>
  )
}

export default SignUpSignInForm
