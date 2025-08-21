export interface Login {
    user:string
    password:string
}

export interface AuthResponse {
    success: boolean
    token: string | null
    user: null | { id: string; name: string }
}