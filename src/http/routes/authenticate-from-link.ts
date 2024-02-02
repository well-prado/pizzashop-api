import Elysia, { t } from 'elysia'
import dayjs from 'dayjs'
import { authentication } from '../authentication'
// import { db } from '@/db/connection'
// import { authLinks } from '@/db/schema'
// import { eq } from 'drizzle-orm'
import { UnauthorizedError } from './errors/unauthorized-error'
import { api } from '@/axios'
import { AuthLink } from './send-authentication-link'

export const authenticateFromLink = new Elysia().use(authentication).get(
  '/auth-links/authenticate',
  async ({ signUser, query, set }) => {
    const { code, redirect } = query

    // const authLinkFromCode = await db.query.authLinks.findFirst({
    //   where(fields, { eq }) {
    //     return eq(fields.code, code)
    //   },
    // })

    const authLinkFromCode = await api.get<AuthLink>('/auth_links', {
      params: {
        where: [
          {
            attribute: 'code',
            operator: '=',
            value: code,
          },
        ],
      },
    })

    if (!authLinkFromCode) {
      throw new UnauthorizedError()
    }

    if (dayjs().diff(authLinkFromCode.data.createdAt, 'hour') > 1) {
      throw new UnauthorizedError()
    }

    // const managedRestaurant = await db.query.restaurants.findFirst({
    //   where(fields, { eq }) {
    //     return eq(fields.managerId, authLinkFromCode.data.user_id)
    //   },
    // })

    const managedRestaurant = await api.get('/restaurants', {
      params: {
        where: [
          {
            attribute: 'manager_id',
            operator: '=',
            value: authLinkFromCode.data.user_id,
          },
        ],
      },
    })

    await signUser({
      sub: authLinkFromCode.data.user_id,
      restaurantId: managedRestaurant?.data.uid,
    })

    // await db.delete(authLinks).where(eq(authLinks.code, code))

    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await api.delete(`/auth_links/${authLinkFromCode.data.uid}`)

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
