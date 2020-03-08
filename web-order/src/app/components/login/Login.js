import React, { useState, useEffect } from "react"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import TextField from "@material-ui/core/TextField"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import { Redirect } from "react-router"
// import { v4 as uuidv4 } from "uuid"

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

export default function Login() {
  const classes = useStyles()
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [redirect, setRedirect] = useState(false)

  const validLogin = (user, pass) => {
    if (user === "admin" && pass === "000000") {
      localStorage.setItem("emp_code", user)
      localStorage.setItem("table_no", null)
      localStorage.setItem("order_no", null)
      console.log("Logged in success")
      setRedirect(true)
    }
  }

  useEffect(() => {
    console.log("Login startup")
    return function() {
      console.log("Login cleanup")
    }
  }, [])

  if (redirect) {
    return <Redirect push to="/table" />
  } else {
    localStorage.removeItem("emp_code")
    localStorage.removeItem("table_no")
    localStorage.removeItem("order_no")
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          เข้าสู่ระบบ
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={e => e.preventDefault()}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="empCode"
            label="Employee Code"
            name="empCode"
            autoComplete="email"
            autoFocus
            value={user}
            onChange={e => setUser(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => validLogin(user, pass)}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}