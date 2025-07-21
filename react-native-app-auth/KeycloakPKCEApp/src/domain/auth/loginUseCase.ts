import { AuthRepository } from '../../data/auth/authRepository'

export class LoginUseCase {
  private authRepository = new AuthRepository()

  async execute() {
    return await this.authRepository.loginWithPKCE()
  }
}