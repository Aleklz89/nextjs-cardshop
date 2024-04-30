import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';
import styles from './Date.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';


const DateRangeComp = ({ setDateRange }) => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection',
        },
    ]);

    const [open, setOpen] = useState(false);
    const refOne = useRef(null);

    useEffect(() => {
        document.addEventListener("keydown", hideOnEscape, true);
        document.addEventListener("click", hideOnClickOutside, true);

        return () => {
            document.removeEventListener("keydown", hideOnEscape, true);
            document.removeEventListener("click", hideOnClickOutside, true);
        };
    }, []);

    const hideOnEscape = (e) => {
        if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false);
        }
    };

    const handleSelect = (ranges) => {
        const formattedStartDate = format(ranges.selection.startDate, 'MM/dd/yyyy');
        const formattedEndDate = format(ranges.selection.endDate, 'MM/dd/yyyy');
        
 
        const formattedSelection = {
            ...ranges.selection,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        };
    
        setRange([ranges.selection]);
        setDateRange(formattedSelection);
    
        console.log(`DateRange selected: ${formattedStartDate} to ${formattedEndDate}`);
    };

    return (
        <div className="calendarWrap">
            <input
                value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(range[0].endDate, "MM/dd/yyyy")}`}
                readOnly
                onClick={() => setOpen(open => !open)}
                className={styles.dates}
            />
            <div ref={refOne}>
                {open && (
                    <DateRange
                        onChange={handleSelect}
                        editableDateInputs={true}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={1}
                        direction="horizontal"
                        className={styles.dropdownCalendar}
                    />
                )}
            </div>
        </div>
    );
};

export default DateRangeComp;
