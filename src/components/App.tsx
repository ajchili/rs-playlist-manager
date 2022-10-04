import { Container, Stack } from "@mui/material"
import AppTitle from "./AppTitle"
import UkraineAlert from "./UkraineAlert"

export default (): JSX.Element => {
    return <>
        <AppTitle />
        <Container style={{ marginTop: "16px" }}>
            <Stack spacing={2}>
                <UkraineAlert />
            </Stack>
        </Container>
    </>
}