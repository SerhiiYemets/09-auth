import type { NewNote, Note, NotesResponse, NoteTag } from "@/types/note";
import { nextServer } from "./api";
import type { LoginRequest, UpdateUser, User, StatusMessage } from "@/types/user";


// отримати список нотаток
export const fetchNotes = async (
    page: number,
    perPage: number,
    search?: string,
    tag?: NoteTag 
): Promise<NotesResponse> => {
    const params: Record<string, string | number> = { page, perPage };
    if (search) params.search = search;
    if (tag) params.tag = tag;
    
    const endPoint = '/notes';

    const response = await nextServer.get<NotesResponse>(endPoint, { params});
    
    return response.data;
};

//Отримати нотатку за ID
export const fetchNoteByID = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.get<Note>(endPoint);
        
    return response.data;
}

//створити нотатку
export const createNote = async (note: NewNote): Promise<Note> => {
    const endPoint = `/notes`;

    const response = await nextServer.post<Note>(endPoint, note);

    return response.data;
}

//видалити нотатки
export const deleteNote = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.delete<Note>(endPoint);

    return response.data;
};

//Реєстрація 
export const registerUser = async (userData: LoginRequest): Promise<User> => {
    return (
        await nextServer.post<User>('/auth/register', userData)).data;
}

//Аутентицікація
export const loginUser = async (userData: LoginRequest): Promise<User> => {
    return (
        await nextServer.post<User>('/auth/login', userData)).data;
}

//Вихід користувача
export const logoutUser = async (): Promise<StatusMessage> => {
    return (
        await nextServer.post<StatusMessage>('/auth/logout')).data;
}

//Перевірка сессії користувача 
export const checkSession = async (): Promise<User | StatusMessage> => {
    return (
        await nextServer.get<User | StatusMessage>('/auth/session')).data;
}

//отримати профіль користувача 
export const getMe = async (): Promise<User> => {
    return (
        await nextServer.get<User>('/users/me')).data;
}

//Оновлення профілю
export const updateMe = async (userData: UpdateUser): Promise<User> =>  {
    const endPoint = '/users/me';

    const response = await nextServer.patch<User>(endPoint, userData);
    
    return response.data;
}