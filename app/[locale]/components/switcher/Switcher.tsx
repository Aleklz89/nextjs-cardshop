'use client';
import { useLocale } from "use-intl";
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import styles from './Switcher.module.css';
import Image from "next/image";
import '../globals.css'

const options = [
    { value: 'en', label: 'English', imgSrc: '/eng.svg' },
    { value: 'uk', label: 'Українська', imgSrc: '/ukr.svg' }
];

function Switcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const localActive = useLocale();
    const pathname = usePathname();
    const [selectedOption, setSelectedOption] = useState(
        options.find(option => option.value === localActive) || options[0]
    );

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale && savedLocale !== localActive) {
            const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${savedLocale}/`);
            router.replace(newPath);
        }
    }, []);

    const onSelectChange = (nextLocale: string) => {
        localStorage.setItem('locale', nextLocale);
        startTransition(() => {
            const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${nextLocale}/`);
            router.replace(newPath);
        });
    };

    const handleOptionClick = (option: { value: string; label: string; imgSrc: string }) => {
        setSelectedOption(option);
        onSelectChange(option.value);
    };

    return (
        <div className={styles.switcher}>
            {options.map((option, index) => (
                <div key={option.value} className={styles.optionContainer}>
                    <div
                        className={`${styles.option} ${selectedOption.value === option.value ? styles.selected : ''}`}
                        onClick={() => handleOptionClick(option)}
                    >
                        <Image src={option.imgSrc} alt={option.label} width={20} height={20} />
                    </div>
                    {index === 0 && <div className={styles.divider}></div>}
                </div>
            ))}
        </div>
    );
}

export default Switcher;
