import { createContext, PropsWithChildren, useContext, useReducer } from 'react'

// 👇 The only place you declare dialogs
const initialDialogs = {
	command: false,
	addShift: false,
	editShift: false,
}

type DialogState = typeof initialDialogs
type DialogKey = keyof DialogState

type DialogAction =
	| { type: 'OPEN_DIALOG'; dialog: DialogKey }
	| { type: 'CLOSE_DIALOG'; dialog: DialogKey }
	| { type: 'SET_DIALOG'; dialog: DialogKey; value: boolean }
	| { type: 'CLOSE_ALL' }

function reducer(state: DialogState, action: DialogAction): DialogState {
	switch (action.type) {
		case 'OPEN_DIALOG':
			return { ...state, [action.dialog]: true }
		case 'CLOSE_DIALOG':
			return { ...state, [action.dialog]: false }
		case 'SET_DIALOG':
			return { ...state, [action.dialog]: action.value }
		case 'CLOSE_ALL':
			return Object.fromEntries(Object.keys(state).map(key => [key, false])) as DialogState
		default:
			return state
	}
}

interface DialogContextValue {
	dialogs: DialogState
	open: (dialog: DialogKey) => void
	close: (dialog: DialogKey) => void
	setState: (dialog: DialogKey, value: boolean) => void
	closeAll: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

export function DialogContextProvider({ children }: PropsWithChildren) {
	const [dialogs, dispatch] = useReducer(reducer, initialDialogs)

	const open = (dialog: DialogKey) => dispatch({ type: 'OPEN_DIALOG', dialog })

	const close = (dialog: DialogKey) => dispatch({ type: 'CLOSE_DIALOG', dialog })

	const setState = (dialog: DialogKey, value: boolean) => dispatch({ type: 'SET_DIALOG', dialog, value })

	const closeAll = () => dispatch({ type: 'CLOSE_ALL' })

	return (
		<DialogContext.Provider value={{ dialogs, open, close, setState, closeAll }}>{children}</DialogContext.Provider>
	)
}

export function useAppDialogs() {
	const ctx = useContext(DialogContext)
	if (!ctx) {
		throw new Error('useAppDialogs must be used inside DialogContextProvider')
	}
	return ctx
}
