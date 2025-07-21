import { useState } from 'react'
import { LoginUseCase } from '../../domain/auth/loginUseCase'

export const useLoginViewModel = () => {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setLoading(true)
    try {
      const useCase = new LoginUseCase()
      const result = await useCase.execute()
      setToken(result.accessToken)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { login, token, error, loading }
}