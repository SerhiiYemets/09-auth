"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./NotesClient.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import type { NoteTag, NotesResponse } from "@/types/note";

interface NotesClientProps {
    initialData: NotesResponse;
    tag?: NoteTag;
}

function NotesPageClient({ initialData, tag }: NotesClientProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");

    const { data, isError, isFetching, isSuccess } = useQuery<NotesResponse>({
        queryKey: ["notes", query, currentPage, tag],
        queryFn: () => fetchNotes(currentPage, 8, query, tag),
        placeholderData: keepPreviousData,
        initialData,
});

    const totalPages = data?.totalPages ?? 0;

  // debounce setter
    const debouncedSetQuery = useDebouncedCallback((value: string) => {
        setQuery(value);
        setCurrentPage(1);
    }, 500);

  // normal onChange handler
    const handleChangeQuery = (value: string) => {
        debouncedSetQuery(value);
};

    return (
        <div className={css.app}>
        <header className={css.toolbar}>
            <SearchBox inputValue={query} onChange={handleChangeQuery} />

            <Link href="/notes/action/create" className={css.button}>
            Create note +
            </Link>
        </header>

        <main className="notes-list">
            {isError && <p>Error. Try again.</p>}

            {isFetching && <p>Loading...</p>}

            {isSuccess && data?.notes.length === 0 && (
            <p>Data not found. Please try other query.</p>
            )}

            {isSuccess && data?.notes.length > 0 && (
            <>
                <NoteList notes={data.notes} />

                {totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onSelectPage={setCurrentPage}
                />
                )}
            </>
            )}
        </main>
        </div>
    );
}

export default NotesPageClient;
