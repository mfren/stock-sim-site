import { Paper, Grid, Typography, Divider, TextField, Button } from "@mui/material";
import StockPicker from "./StockPicker";

export default function SettingsPanel(props: { 
    stock: string, setStock: (s: string) => void,
    numSims: number, setNumSims: (n: number) => void,
    simLength: number, setSimLength: (n: number) => void,
    runOnClick: () => void
}) {
    
    const stockOnChange = (value: string | null) => {
        if (value !== null) {
            props.setStock(value)
        }
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        Settings
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StockPicker
                        value={props.stock}
                        onChange={stockOnChange}
                    />
                </Grid>
                <Divider />
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Number of Simulations"
                        type="number"
                        value={props.numSims}
                        onChange={e => props.setNumSims(parseFloat(e.target.value))}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Simulation Length (Days)"
                        type="number"
                        value={props.simLength}
                        onChange={e => props.setSimLength(parseFloat(e.target.value))}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={props.runOnClick}>
                        Run
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}