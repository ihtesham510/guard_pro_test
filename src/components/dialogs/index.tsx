import React from 'react'
import * as Dialogs from '.'

export function RenderDialogs() {
	return (
		<React.Fragment>
			{(Object.keys(Dialogs) as Array<keyof typeof Dialogs>).map(key => {
				const Component = Dialogs[key]
				if (typeof Component !== 'function') return null
				return <Component key={key as string} />
			})}
		</React.Fragment>
	)
}
