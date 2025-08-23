export interface Login {
    user:string
    password:string
}

export interface AuthResponse {
    success: boolean
    token: string | null
    user: User
}

export interface User {
  id: string
  username: string
  role: string
}