import React, { useState, useCallback, useRef, useMemo } from 'react'
import Auth from '@aws-amplify/auth'

import Button from '../Button'
import InputRow from '../InputRow'
import { NO_VALUE_ERROR_MESSAGE } from '../../constants'

import styles from './VerificationCode.module.css'

interface Props {
  username: string
  onConfirmSuccess?: (event: React.MouseEvent<HTMLElement>) => void
  onConfirmError?: (errorMessage: string) => void
}

interface FieldsState {
  value: string
  error: string
  pristine: boolean
}

const INPUT_COUNT = 6
const VERIFICATION_CODE_KEY = 'verificationCode'
const VERIFICATION_CODE_REF_KEY = `${VERIFICATION_CODE_KEY}Ref`

const initialFieldState = {
  value: '',
  error: '',
  pristine: true
}

const getFieldsObject = (
  key: string,
  value: FieldsState | typeof useRef,
  argument?: unknown
) => {
  const list = new Array(INPUT_COUNT).fill(value).map((value) => {
    if (typeof value === 'function') {
      return value(argument)
    }

    return value
  })

  return list.reduce((acc, item, index) => {
    acc[`${key}${index + 1}`] = item

    return acc
  }, {})
}

const getFormError = (fields: { [x: string]: FieldsState }) => {
  return Object.values<FieldsState>(fields)
    .map((field) => field.error)
    .find((error) => error)
}

const useVerficationCodeForm = ({
  username,
  onConfirmSuccess,
  onConfirmError
}: Props) => {
  const initialFieldsState = useMemo(
    () => getFieldsObject(VERIFICATION_CODE_KEY, initialFieldState),
    []
  )

  const fieldRefs = getFieldsObject(VERIFICATION_CODE_REF_KEY, useRef, null)

  const [verificationCode, setVerificationCode] = useState(initialFieldsState)
  const [confirmError, setConfirmError] = useState('')
  const formErrorMessage = confirmError || getFormError(verificationCode)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { target } = event

      const value = target.value.slice(
        target.value.length - 1,
        target.value.length
      )
      const name = target.name

      setVerificationCode({
        ...verificationCode,
        [name]: {
          ...verificationCode[name],
          value: value,
          error:
            verificationCode[name].pristine ||
            (!verificationCode[name].pristine && value)
              ? ''
              : NO_VALUE_ERROR_MESSAGE
        }
      })
    },
    [verificationCode]
  )

  const onKeyUp = useCallback(
    (event) => {
      const {
        key,
        code,
        target: { name }
      } = event

      const inputNumber = name.slice(name.length - 1, name.length)

      if (code.slice(0, 5) !== 'Digit' && key !== 'Backspace') {
        return
      }

      if (key === 'Backspace' && parseInt(inputNumber) > 1) {
        const inputField =
          fieldRefs[`${VERIFICATION_CODE_REF_KEY}${parseInt(inputNumber) - 1}`]
            .current

        inputField.focus()
        inputField.select()

        return
      }

      if (key !== 'Backspace' && parseInt(inputNumber) < INPUT_COUNT) {
        const inputField =
          fieldRefs[`${VERIFICATION_CODE_REF_KEY}${parseInt(inputNumber) + 1}`]
            .current

        inputField.focus()
        inputField.select()

        return
      }
    },
    [verificationCode]
  )

  const onFocus = useCallback(
    (event) => {
      event.stopPropagation()
      const name = event.target.name

      setVerificationCode({
        ...verificationCode,
        [name]: {
          ...verificationCode[name],
          pristine: false
        }
      })
    },
    [verificationCode]
  )

  const onSignUpConfirm = useCallback(
    async (event) => {
      event.preventDefault()
      const code = Object.values<FieldsState>(verificationCode)
        .map((fieldState) => fieldState.value)
        .join('')

      try {
        await Auth.confirmSignUp(username, code)

        onConfirmSuccess && onConfirmSuccess(event)
      } catch (error) {
        setConfirmError(error.message)
        onConfirmError && onConfirmError(error.message)
      }
    },
    [username, verificationCode]
  )

  const onPaste = useCallback(
    (event) => {
      event.preventDefault()
      const values = event.clipboardData.getData('Text')

      if (values.length !== INPUT_COUNT) {
        return
      }

      const mappedValues = values.split('').reduce((acc, value, index) => {
        const verificationCodeKey = `${VERIFICATION_CODE_KEY}${index + 1}`
        acc[verificationCodeKey] = {
          ...verificationCode[verificationCodeKey],
          value,
          error: '',
          pristine: false
        }

        return acc
      }, initialFieldsState)

      fieldRefs[`${VERIFICATION_CODE_REF_KEY}${INPUT_COUNT}`].current.focus()
      setVerificationCode(mappedValues)
    },
    [verificationCode]
  )

  return {
    formErrorMessage,
    onChange,
    onKeyUp,
    onFocus,
    onSignUpConfirm,
    onPaste,
    verificationCode,
    fieldRefs
  }
}

const VerificationCode: React.FC<Props> = (props) => {
  const fields = new Array(INPUT_COUNT).fill(0)
  const {
    formErrorMessage,
    onChange,
    onKeyUp,
    onFocus,
    onSignUpConfirm,
    onPaste,
    verificationCode,
    fieldRefs
  } = useVerficationCodeForm(props)

  return (
    <div>
      <h2>Verification Code</h2>
      <div>
        Please type in verification code we’ve sent to
        <br /> {props.username}
      </div>
      <form>
        <div>
          {fields.map((field, index) => (
            <InputRow
              key={`${VERIFICATION_CODE_KEY}${index + 1}`}
              showError={false}
              className={styles.inputRow}
              withLabel={false}
              name={`${VERIFICATION_CODE_KEY}${index + 1}`}
              type="text"
              onChange={onChange}
              onFocus={onFocus}
              error={
                verificationCode[`${VERIFICATION_CODE_KEY}${index + 1}`].error
              }
              value={
                verificationCode[`${VERIFICATION_CODE_KEY}${index + 1}`].value
              }
              onPaste={onPaste}
              ref={fieldRefs[`${VERIFICATION_CODE_REF_KEY}${index + 1}`]}
              onKeyUp={onKeyUp}
            />
          ))}
        </div>
        <Button
          type="submit"
          className={styles.button}
          onClick={onSignUpConfirm}
        >
          Activate account
        </Button>
      </form>
      {formErrorMessage && (
        <div className={styles.error}>{formErrorMessage}</div>
      )}
    </div>
  )
}
export default VerificationCode
