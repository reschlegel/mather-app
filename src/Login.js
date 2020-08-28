import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Copyright } from './function.js';
import { Auth } from "aws-amplify";
import BGImage from './img/bg-image.jpg'


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  image: {
    backgroundImage: `url(${BGImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {
  const classes = useStyles();

  const _validAuthStates = ["signIn", "signedOut"];

  const [username, setUsername] = useState("");
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    try {
      setLoading(true);
      await Auth.signIn(inputs.username, inputs.password);
      props.onStateChange("signedIn", {});
      setLoading(false);
    } catch (err) {
      if (err.code === "UserNotConfirmedException") {
        props.updateUsername(username);
        await Auth.resendSignUp(username);
        props.onStateChange("confirmSignUp", {});
      } else if (err.code === "NotAuthorizedException") {
        // The error happens when the incorrect password is provided
        setError("Login failed." );
      } else if (err.code === "UserNotFoundException") {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
        setError("Login failed.");
      } else {
        setError("An error has occurred.");
        console.error(err);
      }
    }
  }

  function showLoading() {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>)
  }

  function handleInputChange(evt) {
    setInputs(inputs || {});
    const { name, value, type, checked } = evt.target;
    const check_type = ["radio", "checkbox"].includes(type);
    inputs[name] = check_type ? checked : value;
    inputs["checkedValue"] = check_type ? value : null;
    setError("");
  }

  function handleFormSubmission(evt) {
    evt.preventDefault();
    signIn();
  }
  if (_validAuthStates.includes(props.authState)) {
    return (
      <Grid container component="main" className={classes.root}>
        {loading && showLoading()}
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
          </Typography>
              <form className={classes.form} noValidate onSubmit={handleFormSubmission}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
            </Button>
                <Box mt={5}>
                  <Copyright />
                </Box>
              </form>
            </div>
          </Grid>
      </Grid>
    );
        } else {
          return null;
        }
}