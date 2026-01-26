"use client";

import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import css from "@/app/notes/[id]/NoteDetails.module.css"

export default function NoteDetailsClient({ id }: { id: string }) {
    const {
        data: note,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        enabled: !!id,
        refetchOnMount: false,
    });

    if (isLoading) return <p>Loading, please wait...</p>;
    if (error) return <p>Something went wrong.</p>;
    if (!note) return <p>Note not found.</p>;

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

    return (
        <div className={css.container}>
            <div className={css.item}>
                <div className={css.header}>
                    <h2>{note.title}</h2>
                </div>
                <p className={css.content}>{note.content}</p>
                <p className={css.date}>
                    {note?.createdAt
                        ? `Created at: ${note.createdAt}`
                        : `Updated at: ${note.updatedAt}`}
                </p>
            </div>
        </div>
    );
}

