'use client';
import { useLocale } from "use-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition, useEffect } from "react";
import { usePathname } from 'next/navigation';
import styles from './Switcher.module.css';

function Switcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const localActive = useLocale();
    const pathname = usePathname();

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale && savedLocale !== localActive) {
            const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${savedLocale}/`);
            router.replace(newPath);
        }
    }, []);

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        localStorage.setItem('locale', nextLocale);
        startTransition(() => {
            // Создаем новый путь, заменяя текущую локаль на новую
            const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${nextLocale}/`);

            // Выполняем переход на новый путь
            router.replace(newPath);
        });
    };

    return (
        <select className={styles.sel} onChange={onSelectChange} defaultValue={localActive}>
            <option style={{ cursor: 'pointer' }} value='en'>English</option>
            <option style={{ cursor: 'pointer' }} value='uk'>Українська</option>
        </select>
    );
}

export default Switcher;
