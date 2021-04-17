import React, { forwardRef, ForwardedRef } from 'react'
import classNames from 'classnames'

import styles from './InputRow.module.css'

interface Props {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void
  onPaste?: (
    event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLElement>) => void
  error?: string
  value: string | number | readonly string[]
  type?: string
  name: string
  id?: string
  labelText?: string
  withLabel?: boolean
  className?: string
  showError?: boolean
  placeholder?: string
  maxCount?: number
  withTextArea?: boolean
}

const InputRow: React.ForwardRefRenderFunction<
  HTMLInputElement | HTMLTextAreaElement,
  Props
> = (
  {
    onChange,
    onFocus,
    onBlur,
    onPaste,
    onKeyDown,
    onKeyUp,
    error,
    value,
    type,
    name,
    id,
    labelText,
    maxCount,
    withTextArea,
    placeholder = '',
    withLabel = true,
    className,
    showError = true
  },
  ref
) => (
  <div className={classNames([styles.inputRow, className])}>
    {withLabel && (
      <label htmlFor={id}>
        <span>{labelText}</span>
        {maxCount > 0 && typeof value !== 'number' && (
          <span className={styles.valueCount}>
            {value.length}/{maxCount}
          </span>
        )}
      </label>
    )}
    {!withTextArea ? (
      <input
        type={type}
        name={name}
        id={id}
        onChange={onChange}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={error ? 'error' : undefined}
        value={value}
        ref={ref as ForwardedRef<HTMLInputElement>}
        placeholder={placeholder}
      />
    ) : (
      <textarea
        name={name}
        id={id}
        onChange={onChange}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        className={error ? 'error' : undefined}
        value={value}
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
        placeholder={placeholder}
      />
    )}
    {error && showError && <div className={styles.errorMessage}>{error}</div>}
  </div>
)

export default forwardRef(InputRow)
