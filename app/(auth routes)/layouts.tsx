'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

interface AuthRoutesProps {
    children: React.ReactNode;
}

const AuthRoutesLayout = ({ children }: AuthRoutesProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
        router.refresh();
        });
    }, [router, startTransition]);


    if (isPending) return <Loading />;

    return 
        <>
            {children}
        </>;
};

export default AuthRoutesLayout;
