import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { registerRestaurant } from './http/routes/register-restaurant'
import { registerCustomer } from './http/routes/register-customer'
import { sendAuthenticationLink } from './http/routes/send-authentication-link'
import { createOrder } from './http/routes/create-order'
import { approveOrder } from './http/routes/approve-order'
import { cancelOrder } from './http/routes/cancel-order'
import { getOrders } from './http/routes/get-orders'
import { createEvaluation } from './http/routes/create-evaluation'
import { getEvaluations } from './http/routes/get-evaluations'
import { updateMenu } from './http/routes/update-menu'
import { updateProfile } from './http/routes/update-profile'
import { authentication } from './http/authentication'
import { getProfile } from './http/routes/get-profile'
import { authenticateFromLink } from './http/routes/authenticate-from-link'
import { getManagedRestaurant } from './http/routes/get-managed-restaurant'
import { signOut } from './http/routes/sign-out'
import { getOrderDetails } from './http/routes/get-order-details'
import { getMonthReceipt } from './http/routes/get-month-receipt'
import { getMonthOrdersAmount } from './http/routes/get-month-orders-amount'
import { getDayOrdersAmount } from './http/routes/get-day-orders-amount'
import { getMonthCanceledOrdersAmount } from './http/routes/get-month-canceled-orders-amount'
import { getDailyReceiptInPeriod } from './http/routes/get-daily-receipt-in-period'
import { getPopularProducts } from './http/routes/get-popular-products'
import { dispatchOrder } from './http/routes/dispatch-order'
import { deliverOrder } from './http/routes/deliver-order'

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      allowedHeaders: ['content-type'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      origin: (request): boolean => {
        const origin = request.headers.get('origin')

        if (!origin) {
          return false
        }

        return true
      },
    }),
  )
  .use(authentication)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(registerRestaurant)
  .use(registerCustomer)
  .use(sendAuthenticationLink)
  .use(authenticateFromLink)
  .use(createOrder)
  .use(approveOrder)
  .use(cancelOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(getOrders)
  .use(getOrderDetails)
  .use(createEvaluation)
  .use(getEvaluations)
  .use(updateMenu)
  .use(updateProfile)
  .use(getMonthReceipt)
  .use(getMonthOrdersAmount)
  .use(getDayOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getDailyReceiptInPeriod)
  .use(getPopularProducts)

app.listen(3333)

console.log(
  `🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
)
