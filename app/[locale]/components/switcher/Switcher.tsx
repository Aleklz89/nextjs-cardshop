'use client';
import { useLocale } from "use-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition, useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import styles from './Switcher.module.css';
import Image from "next/image";
import '../globals.css'

const options = [
    { value: 'en', label: 'English', imgSrc: 'https://i.ibb.co/mF214kL/en.png' },
    { value: 'uk', label: 'Українська', imgSrc: 'https://i.ibb.co/MN3NTMY/ukr.png' }
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
        <div className={styles.customSelect}>
            <div className={styles.selectedOption}>
                <Image src={selectedOption.imgSrc} alt={selectedOption.label} width={20} height={20} />
                <span className={styles.text}>{selectedOption.label}</span>
            </div>
            <div className={styles.options}>
                {options.map(option => (
                    <div
                        key={option.value}
                        className={styles.option}
                        onClick={() => handleOptionClick(option)}
                    >
                        <Image src={option.imgSrc} alt={option.label} width={20} height={20} />
                        <span className={styles.droptext}>{option.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Switcher;
