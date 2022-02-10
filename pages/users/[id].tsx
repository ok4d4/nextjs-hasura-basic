import { GetStaticPaths, GetStaticProps } from 'next'
import { initializeApollo } from '../../lib/apolloClient'
import {
  GetUserIdsQuery,
  GetUserByIdQuery,
  Users,
} from '../../types/generated/graphql'
import { GET_USERIDS, GET_USER_BYID } from '../../queries/queries'
import { VFC } from 'react'
import { Layout } from '../../components/Layout'
import Link from 'next/link'
import { ChevronDoubleLeftIcon } from '@heroicons/react/solid'

interface Props {
  user: {
    __typename?: 'users'
  } & Pick<Users, 'id' | 'name' | 'created_at'>
}
const UserDetail: VFC<Props> = ({ user }) => {
  if (!user) {
    return <Layout title="Loading">Loading...</Layout>
  }

  return (
    <Layout title={user.name}>
      <p className="text-xl font-bold">User Detail</p>

      <p className="m-4">
        {'ID : '}
        {user.id}
      </p>
      <p className="mb-4 text-xl font-bold">{user.name}</p>
      <p className="mb-12">{user.created_at}</p>
      <Link href="/hasura-ssg">
        <div className="flex cursor-pointer mt-12">
          <ChevronDoubleLeftIcon
            data-testid="auth-to-main"
            className="h-4 w-5 mr-3 text-blue-500"
          />
          <span data-testid="back-to-main">Back to main-ssg-page</span>
        </div>
      </Link>
    </Layout>
  )
}

export default UserDetail
export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<GetUserIdsQuery>({
    query: GET_USERIDS,
  })
  const paths = data.users.map((user) => ({
    params: {
      id: user.id,
    },
  }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo()
  const { data } = await apolloClient.query<GetUserByIdQuery>({
    query: GET_USER_BYID,
    variables: { id: params.id },
  })
  return {
    props: {
      user: data.users_by_pk,
    },
    revalidate: 1,
  }
}
