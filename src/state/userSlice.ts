import type { RootState } from './store'

export type UserProfileType = 'admin' | 'professor' | 'student'

export interface UserState {
    id: number | undefined
    name: string | undefined
    email: string | undefined
    profileType: UserProfileType | undefined
    isAuthenticated: boolean
}

// Action types
const LOGIN = 'user/login' as const
const LOGOUT = 'user/logout' as const
const ME = 'user/me' as const
const UPDATE_PROFILE = 'user/updateProfile' as const

export interface LoginPayload {
    id?: number
    name?: string
    email?: string
    profileType?: UserProfileType
}

export interface MePayload {
    id: number
    name: string
    email: string
    profileType: UserProfileType
}

export interface UpdateProfilePayload {
    name?: string
    email?: string
}

type UserAction =
    | { type: typeof LOGIN; payload: LoginPayload }
    | { type: typeof LOGOUT }
    | { type: typeof ME, payload: MePayload }
    | { type: typeof UPDATE_PROFILE; payload: UpdateProfilePayload }

// Action creators
export const userLogin = (payload: LoginPayload): UserAction => ({
    type: LOGIN,
    payload,
})

export const userLogout = (): UserAction => ({
    type: LOGOUT,
})


export const userMe = (payload: MePayload): UserAction => ({
    type: ME,
    payload,
})

export const userUpdateProfile = (payload: UpdateProfilePayload): UserAction => ({
    type: UPDATE_PROFILE,
    payload,
})

// Reducer
const initialState: UserState = {
    id: undefined,
    name: undefined,
    email: undefined,
    profileType: undefined,
    isAuthenticated: false,
}

export function userReducer(state = initialState, action: UserAction): UserState {
    switch (action.type) {
        case LOGIN:
            return {
                id: action.payload.id ?? undefined,
                name: action.payload.name ?? undefined,
                email: action.payload.email ?? undefined,
                profileType: action.payload.profileType,
                isAuthenticated: true,
            }
        case LOGOUT:
            return initialState
        case UPDATE_PROFILE:
            return {
                ...state,
                name: action.payload.name ?? state.name,
                email: action.payload.email ?? state.email,
            }
        case ME:
            return {
                ...state,
                id: action.payload.id ?? undefined,
                name: action.payload.name ?? undefined,
                email: action.payload.email ?? undefined,
                profileType: action.payload.profileType,
                isAuthenticated: true
            }
        default:
            return state
    }
}

// Selectors
export const selectUser = (state: RootState) => state.user
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated
export const selectUserProfileType = (state: RootState) => state.user.profileType
export const selectUserName = (state: RootState) => state.user.name
export const selectUserEmail = (state: RootState) => state.user.email
