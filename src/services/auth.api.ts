import { auth } from '@/lib/auth'
import { getWebRequest } from '@tanstack/react-start/server'
import { createMiddleware, createServerFn, json } from '@tanstack/react-start'
import { UserMetaSchema } from './auth.schema'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { eq } from 'drizzle-orm'

export const getUserSession = createServerFn({ method: 'GET' }).handler(async () => {
	const request = getWebRequest()

	if (!request?.headers) {
		return null
	}

	const userSession = await auth.api.getSession({ headers: request.headers })

	return userSession
})

export const userMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
	const userSession = await getUserSession()

	return next({ context: { userSession } })
})

export const userRequiredMiddleware = createMiddleware({ type: 'function' })
	.middleware([userMiddleware])
	.server(async ({ next, context }) => {
		if (!context.userSession) {
			throw json({ message: 'You must be logged in to do that!' }, { status: 401 })
		}

		return next({ context: { userSession: context.userSession } })
	})

export const updateUser = createServerFn()
	.validator(UserMetaSchema)
	.middleware([userRequiredMiddleware])
	.handler(async ({ data, context: { userSession } }) => {
		const update: Record<string, unknown> = { name: data.username }
		if (data.imageUrl) {
			update.image = data.imageUrl
		}

		await db.update(schema.user).set(update).where(eq(schema.user.id, userSession.user.id))
	})
