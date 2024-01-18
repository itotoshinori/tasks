import * as api from "../api/TaskAPI"
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from "react-toastify"
import { AxiosError } from "axios"

const useTasks = () => {
    return useQuery('tasks', async () => {
        // データの取得前に1秒遅らせる
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await api.getTasks();
        return data;
    });
}

const useTask = (id: number) => {
    return useQuery(['task', id], async () => {
        return api.getTask(id);
    });
}

const useCreateTask = () => {
    const queryClient = useQueryClient()
    return useMutation(api.postTasks, {
        onSuccess: async (data) => {
            await queryClient.invalidateQueries('tasks')
            toast.success(`${data.title} (期限:${data.term}) の登録に成功しました`,
                {
                    autoClose: 15000, // 表示時間を15秒に設定
                    position: 'top-center'
                });
        },
        onError: (error: AxiosError) => {
            if (error.response?.data.errors) {
                Object.values(error.response?.data.errors).map(
                    (message: any) => {
                        message.map((message: string) => {
                            toast.error(message)
                        })
                    }
                )
            } else {
                toast.error('登録に失敗しました')
            }
        }
    })
}

const useUpdateTask = () => {
    const queryClient = useQueryClient()
    return useMutation(api.updateTask, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('tasks')
            toast.success(`${data.title} (期限:${data.term}) の更新に成功しました`,
                {
                    autoClose: 15000, // 表示時間を15秒に設定
                    position: 'top-center'
                });
        },
        onError: (error: AxiosError) => {
            if (error.response?.data.errors) {
                Object.values(error.response?.data.errors).map(
                    (message: any) => {
                        message.map((message: string) => {
                            toast.error(message)
                        })
                    }
                )
            } else {
                toast.error('更新に失敗しました。データは更新されてません。')
            }
        }
    })
}

const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation(api.deleteTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('削除に成功しました')
        },
        onError: () => {
            toast.error('削除に失敗しました')
        }
    })
}

const useUpdateDoneTask = () => {
    const queryClient = useQueryClient()

    return useMutation(api.updatetoDoneTask, {
        onSuccess: () => {
            queryClient.invalidateQueries('tasks')
            toast.success('処理に成功しました')
        },
        onError: () => {
            toast.error('処理に失敗しました')
        }
    })
}
export { useTasks, useTask, useUpdateDoneTask, useCreateTask, useUpdateTask, useDeleteTask }
