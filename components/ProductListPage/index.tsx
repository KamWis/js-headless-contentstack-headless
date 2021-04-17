import { useMemo, useCallback, useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useSelector, shallowEqual } from 'react-redux'

import PageTitle from '../../components/PageTitle'
import Section from '../../components/Section'
import ProductList from '../../components/ProductList'
import Select from '../../components/Select'
import Layout from '../../components/Layout'
import Button from '../../components/Button'
import { getList } from '../../libs/postHelpers'
import { getPosts, getPostCount } from '../../libs/apis'

interface Props {
  list: Post[]
  errorMessage?: string
  slug: string
  postCount: number
}

const getOptionsMap = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option

    return acc
  }, {})
}

const filterOptions = [
  {
    value: 'latest',
    label: 'Breaking skills',
    filter: {
      _sort: 'created_at:DESC',
      _where: { expiresAt_gt: new Date() }
    }
  },
  {
    value: 'votes',
    label: 'Highest voted',
    filter: {
      _sort: 'voteCount:DESC',
      _where: { expiresAt_gt: new Date() }
    }
  },
  {
    value: 'expires',
    label: 'Closest to expire',
    filter: {
      _sort: 'expiresAt:ASC',
      _where: { expiresAt_gt: new Date() }
    }
  }
]

const getStartOffset = (isFetchingInitial, initialList, filterList) => {
  if (isFetchingInitial) {
    return initialList.length
  }

  return filterList.length
}

const concatListByType = (isFetchingInitial, initialList, filterList, data) => {
  if (isFetchingInitial) {
    return [...initialList, ...getList(data)]
  }

  return [...filterList, ...getList(data)]
}

const ProductListPage: React.FC<Props> = ({
  list,
  errorMessage,
  slug,
  postCount
}) => {
  const [selectedFilter, setSelectedFilter] = useState('latest')
  const [postListFromFilter, setPostListFromFilter] = useState([])
  const [postCountFromFilter, setPostCountFromFilter] = useState(0)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [session, isSessionLoading] = useSession()

  const optionsMap = useMemo(() => getOptionsMap(filterOptions), [])

  const categories = useSelector(
    (state: InitialState) => state.categories.rawList,
    shallowEqual
  )

  const fetchPosts = async (
    selectedOptionParam,
    isFetchingMore = false,
    isFetchingInitial = false
  ) => {
    const selectedOption = selectedOptionParam || optionsMap[selectedFilter]

    const [
      { data, responseStatus, message },
      {
        data: postCountResponse,
        responseStatus: countResponseStatus,
        message: countMessage
      }
    ] = await Promise.all([
      getPosts(
        {
          ...selectedOption.filter,
          _limit: 6,
          _start: isFetchingMore
            ? getStartOffset(isFetchingInitial, list, postListFromFilter)
            : undefined,
          _where: [selectedOption.filter._where, { 'categories.id': slug }]
        },
        session?.jwt
      ),
      getPostCount({
        ...selectedOption.filter,
        _where: [selectedOption.filter._where, { 'categories.id': slug }]
      })
    ])

    if (responseStatus === 'error' || countResponseStatus === 'error') {
      setFetchError(message || countMessage)

      return
    }

    const postList = isFetchingMore
      ? concatListByType(isFetchingInitial, list, postListFromFilter, data)
      : getList(data)

    setPostCountFromFilter(postCountResponse)
    setPostListFromFilter(postList)
    setSelectedFilter(selectedOption.value)
    setIsLoadingPosts(false)
  }

  const category = categories.find(
    (category) => category.id.toString() === slug
  )

  useEffect(() => {
    setPostListFromFilter([])
    setSelectedFilter('latest')
  }, [slug])

  const handleOnSelectChange = useCallback(
    async (selectedOption) => {
      setIsLoadingPosts(true)

      await fetchPosts(selectedOption)
    },
    [selectedFilter, slug]
  )

  const handleLoadMoreInitial = useCallback(async (event) => {
    event.preventDefault()

    await fetchPosts(undefined, true, true)
  }, [])

  const handleLoadMoreFilter = useCallback(
    async (event) => {
      event.preventDefault()

      await fetchPosts(undefined, true, false)
    },
    [selectedFilter, postListFromFilter, postCountFromFilter]
  )

  const shouldShowLoadMore =
    !postListFromFilter.length && list.length < postCount
  const shouldShowLoadMoreFilter =
    !!postListFromFilter.length &&
    postListFromFilter.length < postCountFromFilter

  return (
    <Layout title="Futuretrap portal">
      <Section>
        <PageTitle
          title={slug ? category.name : 'where skills come first.'}
          description="Join our community and learn unique skills."
        />
      </Section>
      <Section>
        {fetchError && <div className="error">{fetchError}</div>}
        <Select
          instanceId="select-posts"
          value={optionsMap[selectedFilter]}
          onChange={handleOnSelectChange}
          options={filterOptions}
          placeholder="Pick a filter"
          className="select_as_title"
          isLoading={isLoadingPosts || isSessionLoading}
          isDisabled={isLoadingPosts || isSessionLoading}
          isSearchable={false}
        />
        {!errorMessage && (
          <>
            <ProductList
              list={postListFromFilter.length ? postListFromFilter : list}
            />
            {shouldShowLoadMore && (
              <Button
                outline
                onClick={handleLoadMoreInitial}
                disabled={isLoadingPosts}
                className="load-more-button-center"
              >
                Load more
              </Button>
            )}
            {shouldShowLoadMoreFilter && (
              <Button
                outline
                onClick={handleLoadMoreFilter}
                disabled={isLoadingPosts}
                className="load-more-button-center"
              >
                Load more
              </Button>
            )}
          </>
        )}
        {errorMessage ? errorMessage : null}
      </Section>
    </Layout>
  )
}

export default ProductListPage
