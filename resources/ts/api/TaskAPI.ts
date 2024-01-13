import axios from 'axios'
import { Task } from '../types/Task'

const getTasks = async () => {
    const { data } = await axios.get<Task[]>('api/tasks')
    return data
}

const postTasks = async ({ title, body, link, term }: { title: string, body: string, link: string, term: string }) => {
    const { data } = await axios.post<Task>
        (`api/tasks/`, { title: title, body: body, link: link, term: term })
    return data
}

const getTask = async (id: number) => {
    const { data } = await axios.get<Task[]>(`api/tasks/${id}`)
    return data[0]
}

const updateTask = async ({ id, task }: { id: number, task: Task }) => {
    const { data } = await axios.patch<Task>
        (`api/tasks/${id}`, task)
    return data
}

const deleteTask = async (id: number) => {
    const { data } = await axios.delete<Task>
        (`api/tasks/${id}`)
    return data
}

const updatetoDoneTask = async ({ id, is_done }: Task) => {
    const { data } = await axios.patch<Task>
        (`api/tasks/update-done/${id}`, { is_done: !is_done })
    return data
}

export {
    getTasks,
    postTasks,
    getTask,
    updateTask,
    deleteTask,
    updatetoDoneTask
}
