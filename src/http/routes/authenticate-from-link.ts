// authenticateFromLink.js
import Elysia, { t } from 'elysia'
import dayjs from 'dayjs'
import { authentication } from '../authentication'
import { UnauthorizedError } from './errors/unauthorized-error'
import { api } from '@/axios' // Updated import

export const authenticateFromLink = new Elysia().use(authentication).get(
  '/auth-links/authenticate',
  async ({ signUser, query, set }) => {
    const { code, redirect } = query

    const authLinkFromCodeResponse: any = await api.get('/auth_links', {
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

    console.log(authLinkFromCodeResponse.data)

    console.log(authLinkFromCodeResponse.data[0].attributes)

    if (!authLinkFromCodeResponse) {
      throw new UnauthorizedError()
    }

    const authLinkFromCode = authLinkFromCodeResponse.data[0]

    if (dayjs().diff(authLinkFromCode.attributes.createdAt, 'hour') > 1) {
      throw new UnauthorizedError()
    }

    const managedRestaurantResponse: any = await api.get('/restaurants', {
      params: {
        where: [
          {
            attribute: 'manager_id',
            operator: '=',
            value: authLinkFromCode.attributes.user_id,
          },
        ],
      },
    })

    const managedRestaurant = managedRestaurantResponse.data[0]

    await signUser({
      sub: authLinkFromCode.attributes.user_id,
      restaurantId: managedRestaurant?.uid,
    })

    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await api.delete(`/auth_links/${authLinkFromCode.uid}`)

    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
