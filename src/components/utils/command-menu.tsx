import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Building2, ClockIcon, User } from 'lucide-react'
import React from 'react'
import { useAppDialogs } from '../context/dialog-context'

export function CommandMenu() {
	const { dialogs, setState } = useAppDialogs()
	const open = dialogs.command
	const setOpen = (e: boolean) => {
		setState('command', e)
	}

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(!open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder='Type a command or search...' />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading='Actions'>
					<CommandItem>
						<User /> <span>Add Guard</span>
					</CommandItem>
					<CommandItem>
						<ClockIcon /> <span>Add Shift</span>
					</CommandItem>
					<CommandItem>
						<Building2 /> <span>Add Company</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
