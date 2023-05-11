import { Autocomplete, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import useSWR from "swr"

const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function StockPicker(props: { value: string, onChange: (s: string) => void }) {

    const { data, error, isLoading } = useSWR('/api/stock', fetcher)
    const [stocks, setStocks] = useState<string[]>()

    useEffect(() => {
        if (!data) return
        console.log(data)
        setStocks(data)
    }, [data, error, isLoading])

    return (
        <Autocomplete 
            disablePortal
            options={stocks ?? []}
            renderInput={(params) => <TextField {...params} label="Stock" />}
        />        
    )
}