import { useForm } from 'react-hook-form'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogSubmitButtons,
	ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import { addShiftSchema } from '@/services/shift.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export function ShiftDialog({ defaultValues }: { defaultValues?: z.infer<typeof addShiftSchema> }) {
	const form = useForm<z.infer<typeof addShiftSchema>>({
		resolver: zodResolver(addShiftSchema),
		defaultValues,
	})
	const handleSubmit = (values: z.infer<typeof addShiftSchema>) => {}
	return (
		<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit)}>
			<ResponsiveDialog>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Add Shift</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>add shift to your </ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogContent>
					<div className='w-full h-[400px] flex justify-center items-center'>
						<h1>Hellow world</h1>
					</div>
				</ResponsiveDialogContent>
				<ResponsiveDialogSubmitButtons />
			</ResponsiveDialog>
		</ResponsiveDialogForm>
	)
}
