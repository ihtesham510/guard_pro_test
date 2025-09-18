import React from 'react'
import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'
import { NavUser } from './nav-user'
import { useUser } from '@/lib/auth-client'
import { NavMain, NavMainProps } from './nav-main'
import { useMatchRoute, useRouter } from '@tanstack/react-router'
import { LayoutIcon } from 'lucide-react'

interface SideBarProps extends React.ComponentProps<typeof Sidebar> {
	user: {
		email: string
		name: string
		image?: string
	}
}

export function AppSidebar(props: SideBarProps) {
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
						avatar: props.user.image ?? undefined,
						email: props.user.email,
						name: props.user.name,
					}}
				/>
			</SidebarHeader>
			<NavMain items={items} />
		</Sidebar>
	)
}
