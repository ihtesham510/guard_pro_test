import { AppSidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Bell, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { LoaderComponent } from '@/components/LoaderComponent'
import { CommandMenu } from '@/components/utils/command-menu'
import { RenderDialogs } from '@/components/dialogs'
import { DialogContextProvider } from '@/components/context/dialog-context'

export const Route = createFileRoute('/dashboard')({
	component: () => (
		<DialogContextProvider>
			<RouteComponent />
		</DialogContextProvider>
	),
	beforeLoad({ context: { userSession } }) {
		if (!userSession) {
			throw redirect({
				to: '/sign-in',
			})
		}
	},
})

function RouteComponent() {
	const { userSession } = Route.useRouteContext()
	if (!userSession) return <LoaderComponent />
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--sidebar-height': 'calc(var(--spacing) * 16)',
				} as React.CSSProperties
			}
		>
			<AppSidebar
				user={{
					email: userSession.user.email,
					name: userSession.user.name,
					image: userSession.user.image ?? undefined,
				}}
				variant='inset'
				collapsible='icon'
			/>
			<CommandMenu />
			<SidebarInset className='p-4'>
				<header className='flex justify-between items-center mb-4 w-full'>
					<div className='flex gap-2 items-center'>
						<SidebarTrigger />
						<div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6 max-w-[400px]'>
							<div className='relative flex flex-1 items-center  bg-secondary rounded-md p-1'>
								<Search className='absolute left-2 h-4 w-4 text-muted-foreground' />
								<div className='pl-7 w-full max-w-lg flex justify-between items-center px-2 gap-4'>
									<p className='text-xs'>Search shifts, actions and more</p>
								</div>
							</div>
						</div>
					</div>
					<Button variant='ghost' size='sm' className='relative'>
						<Bell className='h-5 w-5' />
						<Badge className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary'>3</Badge>
					</Button>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
