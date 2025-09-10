import React from 'react'
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'
import { NavUser } from './nav-user'
import { useUser } from '@/lib/auth-client'
import { NavMain, NavMainProps } from './nav-main'
import { useMatchRoute } from '@tanstack/react-router'
import { LayoutIcon } from 'lucide-react'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { user } = useUser()
	const route = useMatchRoute()
	const items: NavMainProps['items'] = [
		{
			title: 'Dashboard',
			icon: LayoutIcon,
			href: {
				to: '/dashboard',
			},
			isActive: !!route({
				to: '/dashboard',
				fuzzy: false,
			}),
		},
	]
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader className='pb-2'>
				<NavUser
					user={{
						avatar: user.image ?? undefined,
						email: user.email,
						name: user.name,
					}}
				/>
			</SidebarHeader>
			<NavMain items={items} />
		</Sidebar>
	)
}
