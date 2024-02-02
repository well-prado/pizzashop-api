import Elysia, { t } from 'elysia'
// import { db } from '@/db/connection'
// import { authLinks } from '@/db/schema'
// import { createId } from '@paralleldrive/cuid2'
import { resend } from '@/mail/client'
import { AuthenticationMagicLinkTemplate } from '@/mail/templates/authentication-magic-link'
import { env } from '@/env'
import { UnauthorizedError } from './errors/unauthorized-error'
import { api } from '@/axios'
export interface AuthLink {
  createdAt: string
  code: string
  user_id: string
  updatedAt: string
  uid: string
}

export const sendAuthenticationLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email, uid } = body

    // const userFromEmail = await db.query.users.findFirst({
    //   where(fields, { eq }) {
    //     return eq(fields.email, email)
    //   },
    // })

    const userFromEmail = await api.get<AuthLink>(`/auth_links/${uid}`)

    if (!userFromEmail) {
      throw new UnauthorizedError()
    }

    // const authLinkCode = createId()

    // await db.insert(authLinks).values({
    //   userId: userFromEmail.data.uid,
    //   code: userFromEmail.data.code,
    // })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
    authLink.searchParams.set('code', userFromEmail.data.code)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())

    await resend.emails.send({
      from: 'Pizza Shop <naoresponda@globaldesk.com.br>',
      to: email,
      subject: '[Pizza Shop] Link para login',
      react: AuthenticationMagicLinkTemplate({
        userEmail: email,
        authLink: authLink.toString(),
      }),
    })
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
      uid: t.String(),
    }),
  },
)
