'use client'
import { useLocale } from "use-intl";
import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react"
import { usePathname } from 'next/navigation'

function Switcher() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const localActive = useLocale();
    const pathname = usePathname()

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {

            // Создаем новый путь, заменяя текущую локаль на новую
            const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${nextLocale}/`);

            // Выполняем переход на новый путь
            router.replace(newPath);
        });
    }
    return (
        <select style={{

            width: '200px',
            padding: '8px 12px',
            border: '2px solid #ccc',
            borderRadius: '8px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            fontSize: '16px',
            appearance: 'none',
            marginRight: '20px'
        }} onChange={onSelectChange} defaultValue={localActive}>
            <option style={{

                cursor: 'pointer'
            }} value='en'>English</option>
            <option style={{

                cursor: 'pointer'
            }} value='uk'>Ukrainian</option>
        </select>
    )
}

export default Switcher