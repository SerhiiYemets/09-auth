import css from "./NoteList.module.css";
import type { Note, NoteId } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/api"
import Link from "next/link"

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    console.log('NoteList notes:', notes);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: NoteId) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            console.error("Error deleting note:", error);
        },
    });

    if (!notes || notes.length === 0) {
        return <p className={css.empty}>No notes found.</p>;
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag || "No tag"}</span>
                        <Link
                            href={`/notes/${note.id}`}
                            className={css.link}
                            aria-label={`View details of note ${note.title}`}
                        >
                            View details
                        </Link>
                        <button
                            className={css.button}
                            onClick={() => deleteMutation.mutate(note.id)}  
                            disabled={deleteMutation.isPending}            
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}


