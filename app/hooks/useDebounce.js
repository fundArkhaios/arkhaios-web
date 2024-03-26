import { useState, useEffect } from "react";

export default function useDebounce(value, delay) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect( () => {

        const id = window.setTimeout( () => {
            setDebouncedValue(value);
        }, [delay])


        return () => {
            window.clearTimeout(id)
        }
    }, [value, delay])
    return debouncedValue
}