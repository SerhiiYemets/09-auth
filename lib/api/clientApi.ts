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

    const response = await nextServer.post<Note>(endPoint);

    return response.data;
}

//видалити нотатки
export const deleteNote = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const response = await nextServer.delete<Note>(endPoint);

    return response.data;
}

//Реєстрація 
export const registerUser = async (userData: LoginRequest): Promise<Note> => {
    const endPoint = `/app/api/auth/register`;

    const response = await nextServer.post<User>(endPoint, userData);

    return response.data;
}

//Аутентицікація
export const loginUser = async (userData: LoginRequest): Promise<Note> => {
    const endPoint = `/app/api/auth/login`;

    const response = await nextServer.post<User>(endPoint, userData);

    return response.data;
}

//Вихід користувача
export const logoutUser = async (id: string): Promise<Note> => {
    const endPoint = `/app/api/auth/logout`;

    const response = await nextServer.post<User>(endPoint);

    return response.data;
}

//Перевірка сессії користувача 
export const checkSession = async (): Promise<Note> => {
    const endPoint = `/app/api/auth/session`;

    const response = await nextServer.get<StatusMessage>(endPoint);

    return response.data;
}

//отримати профіль користувача 
export const getMe = async(): Promise<Note> => {
    const endPoint = `/app/api/users/me`;

    const response = await nextServer.get<User>(endPoint);

    return response.data;
}

//Оновлення профілю
export const updateMe= async (userData: UpdateUser): Promise<User> =>  {
    const endPoint = '/app/api/users/me';

    const response = await nextServer.patch<User>(endPoint, userData);
    
    return response.data;
}
