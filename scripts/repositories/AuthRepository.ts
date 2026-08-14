import { User } from '../models/User'
import { Repository } from './Repository'

export class AuthRepository extends Repository<User> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, User)
  }

  async login(email: string, password: string): Promise<User> {
    try {
      await this.get('/sanctum/csrf-cookie')
      const data = {
        email,
        password,
      }
      const response = this.post<any>(`${this.resourceUrl}/login`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = this.post<boolean>(`${this.resourceUrl}/logout`, {})
      return response
    } catch (error) {
      throw error
    }
  }

  async register(email: string, password: string, passwordConfirmation: string): Promise<User> {
    try {
      await this.get('/sanctum/csrf-cookie')
      const data = {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
      const response = this.post<any>(`${this.resourceUrl}/register`, data)
      return response
    } catch (error) {
      throw error
    }
  }

  async forgotPassword(email: string, redirectUrl: string): Promise<any> {
    const data = { email, redirect_url: redirectUrl }
    const response = await this.post<any>(`${this.resourceUrl}/forgot-password`, data)
    return response
  }

  async resetPassword(resetPasswordId: string, password: string, passwordConfirmation: string): Promise<any> {
    const data = {
      reset_password_id: resetPasswordId,
      password,
      password_confirmation: passwordConfirmation
    }
    const response = await this.post<any>(`${this.resourceUrl}/reset-password`, data)
    return response
  }
}
