import {useState} from "react";

export default function useFetching (callback) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function fetching(arg) {
        try {
            setIsLoading(true)
            await callback(arg)
        } catch (e) {
            setError(e.message)
        } finally {
            setTimeout(()=>{
                setIsLoading(false)
            },1000)

        }
    }

    return [fetching, isLoading, error, setError]
}

