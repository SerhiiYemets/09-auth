import type { Note, NotesResponse, NoteTag } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";

// отримати список нотато
export const fetchNotesServer = async (
    page: number,
    perPage: number,
    search?: string,
    tag?: NoteTag 
): Promise<NotesResponse> => {
    const params: Record<string, string | number> = { page, perPage };
    if (search) params.search = search;
    if (tag) params.tag = tag;
    
    const endPoint = '/notes';

    const cookiesStore = await cookies();

    const response = await nextServer.get<NotesResponse>(endPoint, {
        params,
        headers: {
            Cookie: cookiesStore.toString(),
        }
    });
    
    return response.data;
};

//Отримати нотатку за ID
export const fetchNoteByIDServer = async (id: string): Promise<Note> => {
    const endPoint = `/notes/${id}`;

    const cookiesStore = await cookies();

    const response = await nextServer.get<Note>(endPoint, {
    headers: {
        Cookie: cookiesStore.toString(),
    },
});
        
    return response.data;
}

//отримати профіль користувача 
export const getMeServer = async (): Promise<User> => {
    const endPoint = `/users/me`;
    const cookieStore = await cookies();

    const response = await nextServer.get<User>(endPoint, {
        headers: {
            Cookie: cookieStore.toString(), 
        }, 
    });
        
    return response.data;
}

//Перевірка сессії користувача 
export const checkSessionServer = async() => {
    const endPoint =`/auth/session`
    const cookieStore = await cookies();
    
    const response = await nextServer.get(endPoint, { 
        headers: { 
            Cookie: cookieStore.toString(), 
        }, 
    });
        
    return response.data;
}