import { Autocomplete, CircularProgress, MenuItem, Select, TextField } from "@mui/material"
import React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"

const fetcher = (url: URL) => fetch(url).then(r => r.json())

export default function StockPicker(props: { value: string | null, onChange: (s: string | null) => void }) {

    const { data, error, isLoading } = useSWR("/api/stocks", fetcher)
    const [options, setOptions] = useState<{ name: string, ticker: string }[]>()
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!data) return
        console.log(data)
        setOptions(data)
    }, [data, error, isLoading])

    return (
        <Autocomplete
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options ?? []}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}      
            loading={isLoading}
            onChange={(e, v) => props.onChange(v?.ticker ?? null)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Stock"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    
    )
}