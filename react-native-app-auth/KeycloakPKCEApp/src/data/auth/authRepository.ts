import { authorize } from 'react-native-app-auth'
import { authConfig } from '../../core/config'

export class AuthRepository {

    async loginWithPKCE (){

            try{
                const result = await authorize(authConfig)
                return result

            } catch(error){
                throw new Error('login failed: '+ error)
            }
    }
}