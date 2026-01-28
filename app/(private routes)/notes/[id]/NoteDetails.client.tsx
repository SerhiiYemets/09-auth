"use client";

import { fetchNoteByID } from "@/lib/api/clientApi"; 
import { useQuery } from "@tanstack/react-query";
import css from "@/app/notes/[id]/NoteDetails.module.css";
import type { Note } from "@/types/note";

export default function NoteDetailsClient({ id }: { id: string }) {
    const { data: note, isLoading, error } = useQuery<Note, Error>({
        queryKey: ["note", id],
        queryFn: () => fetchNoteByID(id),
        enabled: !!id,
        refetchOnMount: false,
    });

    if (isLoading) return <p>Loading, please wait...</p>;
    if (error) return <p>Something went wrong.</p>;
    if (!note) return <p>Note not found.</p>;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: note.title,
                    description: note.content.substring(0, 160),
                    url: `https://notehub.com/notes/${id}`,
                }),
            }}
        />

        <div className={css.container}>
            <div className={css.item}>
            <div className={css.header}>
                <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
                {note.createdAt
                ? `Created at: ${note.createdAt}`
                : note.updatedAt
                ? `Updated at: ${note.updatedAt}`
                : "No date available"}
            </p>
            </div>
        </div>
        </>
    );
}

