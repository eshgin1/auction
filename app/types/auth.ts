export interface CreateCodeResponse {
  status: boolean
  newClient?: boolean
  message?: string
}

export interface ValidCodeResponse {
  status: boolean
  token: string
  message?: string
}

export interface GetUserResponse {
  status: boolean
  user?: {
    name: string
  }
  message?: string
}
