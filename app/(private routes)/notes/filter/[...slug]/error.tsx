"use client";

type Props = {
    error: Error;
};

const NotesError = ({ error }: Props) => {
    return <p>Could not fetch the list of notes. {error.message}</p>;
};

export default NotesError;