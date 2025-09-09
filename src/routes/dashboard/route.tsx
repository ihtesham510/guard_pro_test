import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
	component: RouteComponent,
	beforeLoad({ context: { userSession } }) {
		if (!userSession) {
			throw redirect({
				to: '/sign-in',
			})
		}
	},
})

function RouteComponent() {
	const router = useRouter()
	const { queryClient } = Route.useRouteContext()
	return (
		<div>
			Hello "/dashboard"!
			<Button
				onClick={async () => {
					await authClient.signOut()
					await queryClient.invalidateQueries()
					await router.invalidate()
				}}
			>
				Sign Out
			</Button>
		</div>
	)
}
