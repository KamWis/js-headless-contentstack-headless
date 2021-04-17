import React, { useCallback, useState, useMemo } from 'react'
import { GetServerSideProps } from 'next'
import DatePicker from 'react-datepicker'
import { shallowEqual, useSelector } from 'react-redux'
import { getSession } from 'next-auth/client'
import { omit } from 'lodash'

import Layout from '../components/Layout'
import PageTitle from '../components/PageTitle'
import InputRow from '../components/InputRow'
import Select from '../components/Select'
import Checkbox from '../components/Checkbox'
import Button from '../components/Button'
import PostSuccessMessage from '../components/PostSuccessMessage'

import { postCreatePost } from '../libs/apis'

import styles from '../styles/SubmitPost.module.css'

interface SubmitSkillForm {
  title: string
  description: string
  link: string
  startTime: number
  endTime: number
  category: number
}

interface Props {
  token?: string
  author: string
  authorId: string
}

const getOptionsMap = (options) => {
  return options.reduce((acc, option) => {
    acc[option.name] = {
      value: option.id,
      label: option.name
    }

    return acc
  }, {})
}

const getOptions = (options) => {
  return options.map((option) => ({
    value: option.id,
    label: option.name
  }))
}

const MAX_TITLE_LENGTH = 256
const MAX_DESCRIPTION_LENGTH = 2000

const initialFieldsState = {
  title: '',
  description: '',
  link: '',
  startTime: null,
  endTime: null,
  category: null
}

const shouldDisableSubmit = (formValues) => {
  const values = omit(formValues, 'link')
  return Object.values(values).some((value) => !value)
}

const SubmitSkill: React.FC<Props> = ({ token, author, authorId }) => {
  const [skillFormValues, setSkillFormValues] = useState<SubmitSkillForm>(
    initialFieldsState
  )
  const [isPosting, setIsPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [postError, setPostingError] = useState('')
  const [isTermsChecked, setIsTermsChecked] = useState(false)
  const [createdPost, setCreatedPost] = useState(null)
  const categoryList = useSelector(
    (state: InitialState) => state.categories.rawList,
    shallowEqual
  )
  const options = useMemo(() => getOptions(categoryList), [categoryList])
  const optionsMap = useMemo(() => getOptionsMap(categoryList), [categoryList])
  const today = useMemo(() => new Date(), [])

  const handleOnChange = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const {
        target: { name, value }
      } = event

      if (name === 'title' && value.length > MAX_TITLE_LENGTH) {
        return
      }

      if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
        return
      }

      if (postError) {
        setPostingError('')
      }

      setSkillFormValues({
        ...skillFormValues,
        [name]: value
      })
    },
    [skillFormValues]
  )

  const handleOnSelectChange = useCallback(
    (selectedOption) => {
      setSkillFormValues({
        ...skillFormValues,
        category: selectedOption.value
      })

      if (postError) {
        setPostingError('')
      }
    },
    [skillFormValues]
  )

  const handleOnTimeChange = useCallback(
    (fieldName) => (date) => {
      setSkillFormValues({
        ...skillFormValues,
        [fieldName]: new Date(date).getTime()
      })

      if (postError) {
        setPostingError('')
      }
    },
    [skillFormValues]
  )

  const handleTermCheckbox = useCallback(() => {
    setIsTermsChecked(!isTermsChecked)

    if (postError) {
      setPostingError('')
    }
  }, [isTermsChecked])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      setIsPosting(true)
      setPostingError('')

      const { data, responseStatus, message } = await postCreatePost(
        token,
        author,
        authorId,
        skillFormValues.title,
        skillFormValues.description,
        skillFormValues.category,
        skillFormValues.endTime,
        skillFormValues.startTime,
        skillFormValues.link
      )

      if (responseStatus === 'error') {
        setPostingError(message)
        setIsPosting(false)

        return
      }

      setCreatedPost(data)
      setPostSuccess(true)
      setIsPosting(false)
    },
    [skillFormValues]
  )

  const handleDiscardChanges = useCallback((event) => {
    event.preventDefault()

    setSkillFormValues(initialFieldsState)
  }, [])

  return (
    <Layout title="Futuretrap - Submit Skill">
      {postSuccess && (
        <PostSuccessMessage
          postId={createdPost.id}
          categoryId={skillFormValues.category}
        />
      )}
      {!postSuccess && (
        <div className={styles.narrowColumn}>
          <PageTitle
            className={styles.centerTitle}
            title="Submit skill"
            description="Join our community and learn unique skills."
          />

          <div className={styles.fieldGroup}>
            <h3>Skill details</h3>
            <Select
              instanceId="select-category"
              value={optionsMap[skillFormValues.category]}
              onChange={handleOnSelectChange}
              options={options}
              placeholder="Pick a category"
            />
            <InputRow
              type="text"
              id="title"
              name="title"
              value={skillFormValues.title}
              labelText="Title"
              onChange={handleOnChange}
              placeholder="The most important sentence you’ll write today..."
              maxCount={MAX_TITLE_LENGTH}
            />
            <InputRow
              type="text"
              withTextArea
              id="description"
              name="description"
              value={skillFormValues.description}
              labelText="Description"
              onChange={handleOnChange}
              placeholder="Tell us more..."
              maxCount={MAX_DESCRIPTION_LENGTH}
            />
          </div>
          <div className={styles.fieldGroup}>
            <h3>Links</h3>
            <InputRow
              type="text"
              id="link"
              name="link"
              value={skillFormValues.link}
              labelText="URL/Link"
              onChange={handleOnChange}
              placeholder="e.g. http://futuretrap.com/"
            />
          </div>
          <div className={styles.fieldGroup}>
            <h3>Set timer</h3>
            <div className={styles.fieldMargin}>
              <DatePicker
                minDate={today}
                showTimeSelect
                selected={
                  skillFormValues.startTime
                    ? new Date(skillFormValues.startTime)
                    : null
                }
                onChange={handleOnTimeChange('startTime')}
                dateFormat="Pp"
                placeholderText="Start time"
                wrapperClassName={styles.datePicker}
              />
              <DatePicker
                minDate={today}
                showTimeSelect
                selected={
                  skillFormValues.endTime
                    ? new Date(skillFormValues.endTime)
                    : null
                }
                onChange={handleOnTimeChange('endTime')}
                dateFormat="Pp"
                placeholderText="End time"
                wrapperClassName={styles.datePicker}
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <Checkbox checked={isTermsChecked} onChange={handleTermCheckbox}>
              I agree to{' '}
              <a href="/" className={styles.termsLink}>
                Terms and Conditions
              </a>
            </Checkbox>
          </div>
          <div className={styles.fieldGroup}>
            {postError ? postError : null}
            <Button
              big
              fullWidth
              onClick={handleSubmit}
              disabled={
                isPosting ||
                shouldDisableSubmit(skillFormValues) ||
                !isTermsChecked
              }
            >
              Submit skill
            </Button>
            <Button
              big
              fullWidth
              outline
              noBorder
              className={styles.disardChangesButton}
              onClick={handleDiscardChanges}
            >
              Discard changes
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context)

    if (!session) {
      return {
        props: {},
        redirect: {
          destination: '/',
          pernament: false
        }
      }
    }

    return {
      props: {
        token: session.jwt,
        author: session.user?.name,
        authorId: session.id
      }
    }
  } catch (error) {
    console.log(error.message)

    return {
      props: {},
      redirect: {
        destination: '/',
        pernament: false
      }
    }
  }
}

export default SubmitSkill
