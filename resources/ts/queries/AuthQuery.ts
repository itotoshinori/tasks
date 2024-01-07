import * as api from "../api/AuthAPI"
import { useQuery, useMutation } from 'react-query'
import { toast } from "react-toastify"
import { useAuth } from '../hooks/AuthContext';
import { useHistory } from "react-router-dom";

const useUser = () => {
    return useQuery('users', api.getUser)
}

const useLogin = () => {
    let history = useHistory();
    const { setIsAuth } = useAuth()
    return useMutation(api.login, {
        onSuccess: (user) => {
            if (user) {
                setIsAuth(true)
            }
            history.push("/tasks");
            toast.success('ログインに成功しました')
        },
        onError: () => {
            toast.error('ログインに失敗しました')
        }
    })
}

const useLogout = () => {
    const { setIsAuth } = useAuth()
    return useMutation(api.logout, {
        onSuccess: (user) => {
            if (user) {
                setIsAuth(false)
            }
            toast.success('ログアウトに成功しました')
            window.location.reload()        
        },
        onError: () => {
            toast.error('ログアウトに失敗しました')
        }
    })
}

export { useUser, useLogin, useLogout }
