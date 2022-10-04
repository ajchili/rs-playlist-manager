import { Alert, AlertTitle, Link } from "@mui/material"

export default () => {
  return <Alert severity="info">
    <AlertTitle>Support Ukraine</AlertTitle>
    Stand in solidarity with the Ukrainian people against the Russian invasion.
    <br />
    <Link href="https://war.ukraine.ua/support-ukraine/" variant="subtitle2" target="_blank">Find out how you can help.</Link>
  </Alert>
};