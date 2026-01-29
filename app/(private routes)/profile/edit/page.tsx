'use client';
import { useRouter } from 'next/navigation';
import css from './EditProfilePage.module.css';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUserAuthStore } from '@/lib/store/authStore';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { UpdateUser, User } from '@/types/user';
import Loading from '@/app/loading';

export default function ProfileEditPage() {
    const router = useRouter();
    const { user, setUser } = useUserAuthStore();
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCancel = () => {
        router.back();
    };

    useEffect(() => {
        if (!user) {
        getMe()
            .then((data: User) => {
            setUser(data);
            setUserName(data.username);
            })
            .catch(error => setError(error.message));
        } else {
        setUserName(user.username);
        }
    }, [user, setUser]);

    const handleSubmit = async (formData: FormData) => {

    setIsLoading(true);

        try {
        const userCng: UpdateUser = {
            username: formData.get('username') as string,
        };

        const updUser = await updateMe(userCng);
        setUser(updUser);
        router.push('/profile');
        } catch (error) {
        setError(
            `Something went wrong. Try again.
            ERR: ${error}`
        );
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <main className={css.mainContent}>
        <div className={css.profileCard}>
            {isLoading && <Loading />}

            {error && <p className={css.error}>{error}</p>}

            <h1 className={css.formTitle}>Edit Profile</h1>

            <Image
            src={user ? user.avatar : '/default-avatar.svg'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            />

            <form action={handleSubmit} className={css.profileInfo}>
            <div className={css.usernameWrapper}>
                <label htmlFor="username">Username: {userName}</label>
                <input
                id="username"
                type="text"
                className={css.input}
                value={userName}
                name="username"
                onChange={ev => setUserName(ev.target.value)}
                />
            </div>

            <p>Email: {user?.email}</p>

            <div className={css.actions}>
                <button type="submit" className={css.saveButton}>
                Save
                </button>
                <button
                onClick={handleCancel}
                type="button"
                className={css.cancelButton}
                >
                Cancel
                </button>
            </div>
            </form>
        </div>
        </main>
    );
}