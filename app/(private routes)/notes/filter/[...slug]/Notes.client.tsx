"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import css from "./NotesClient.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

interface NotesClientProps {
    tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const perPage = 8;

    const { data, isLoading } = useQuery({
        queryKey: ["notes", tag, currentPage, perPage, search],
        queryFn: () =>
            fetchNotes(
                currentPage,
                perPage,
                search || undefined,
            ),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearch(searchInput.trim());
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 1;
    const hasResults = notes.length > 0;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={searchInput} onChange={setSearchInput} />
                <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
            </header>

            <main className="notes-list">
                {isLoading && <p>Loading...</p>}

                {!isLoading && hasResults && (
                    <>
                        <NoteList notes={notes} />

                        {totalPages > 1 && (
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onSelectPage={setCurrentPage}
                            />
                        )}
                    </>
                )}

                {data && !isLoading && !hasResults && (
                    <p>No notes found</p>
                )}
            </main>
        </div>
    );
}
