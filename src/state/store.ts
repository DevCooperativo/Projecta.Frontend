import { createStore, combineReducers } from 'redux'
import { userReducer } from './userSlice'

const rootReducer = combineReducers({
    user: userReducer,
})

export const store = createStore(rootReducer)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
