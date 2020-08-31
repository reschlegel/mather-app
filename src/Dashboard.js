import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CodeIcon from "@material-ui/icons/Code";
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Copyright, Title } from './function';
import { Auth } from "aws-amplify";
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { TextField } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table'
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const drawerWidth = 240;

const toolbarRelativeProperties = (property, modifier = value => value) => theme =>
  Object.keys(theme.mixins.toolbar).reduce((style, key) => {
    const value = theme.mixins.toolbar[key];
    if (key === 'minHeight') {
      return { ...style, [property]: modifier(value) };
    }
    if (value.minHeight !== undefined) {
      return { ...style, [key]: { [property]: modifier(value.minHeight) } };
    }
    return style;
  }, {});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // height: toolbarRelativeProperties('height', value => `calc(100% - ${value}px)`)(theme),
  },
  premiumNo: {
    margin: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: theme.palette.error.main,
  },
  premiumYes: {
    margin: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: theme.palette.success.main,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  sendButton: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 360,
  },
  title: {
    flexGrow: 1,
  },
  paperTitle: {
    textAlign: 'left'
  },
  tableHeader: {
    backgroundColor: theme.palette.secondary.main,
  },
  card: {
    display: 'flex',
    height: '100%',
    flexGrow: '1',
  }
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(false);

  const tableIcons = {
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  };
  
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleDetails = () => {
    setDetails(!details);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  async function signOut() {
    try {
      setLoading(true);
      await Auth.signOut();
      props.onStateChange("signedOut", {});
    } catch (err) {
      setLoading(false);
      console.log('error signing out: ', err)
    }
    setLoading(false)
  }

  function showLoading() {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>)
  }

  function premiumIconRender(rowData) {
    if (rowData.premium) {
      return (
        <Avatar className={classes.premiumNo}><LockOutlinedIcon fontSize="small"/></Avatar>
      )
    } else {
      return (
        <Avatar className={classes.premiumYes}><MonetizationOnIcon fontSize="small"/></Avatar>
      )
    }
  }

  if (props.authState === "signedIn") {
    return (
      <div className={classes.root}>
        {loading && showLoading()}
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              LISTENER&trade; DASH
            </Typography>
            <IconButton 
              color="inherit"
              onClick={signOut}>
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
          <ListItem button selected={true}>
        <ListItemIcon>
          <CodeIcon />
        </ListItemIcon>
        <ListItemText primary="Content Scoring" />
      </ListItem></List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {!details ? (<Grid container spacing={3}>
              <Grid item container xs={12} md={3}>
                <Paper className={classes.paper}>
                  <TextField label="Enter an article ID" variant="filled" />
                  <Typography className={classes.title} color="primary" gutterBottom variant="h5">
                        ID 
                      </Typography>
                      <Typography className={classes.title} color="primary" gutterBottom variant="h5">
                        DD-MM-YYYY 
                      </Typography>
                      <Typography className={classes.title} color="primary" gutterBottom variant="h5">
                        Other Stats 
                      </Typography>
                  <Divider />
                </Paper>
              </Grid>
              <Grid item xs={12} md={9}>
                <MaterialTable
                  title="Recent Articles"
                  columns={[
                    { title: 'ID', field: 'id' },
                    { title: 'Title', field: 'title' },
                    { title: 'Premium', field: 'premium', render: rowData => premiumIconRender(rowData) },
                    {
                      title: 'Birth Place',
                      field: 'birthCity',
                      lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
                    },
                  ]}
                  data={[
                    { id: 'Mehmet', title: 'Baran', birthYear: 1987, birthCity: 63, premium: true },
                    { id: 'Zerya Betül', title: 'Baran', birthYear: 2017, birthCity: 34, premium: false },
                    { id: 'Mehmet', title: 'Baran', birthYear: 1987, birthCity: 63 },
                    { id: 'Zerya Betül', title: 'Baran', birthYear: 2017, birthCity: 34 },
                    { id: 'Mehmet', title: 'Baran', birthYear: 1987, birthCity: 63 },
                    { id: 'Zerya Betül', title: 'Baran', birthYear: 2017, birthCity: 34 },
                  ]}        
                  options={{
                    search: true,
                    headerStyle: {
                      fontWeight: 'bold'
                    }
                  }
                  }
                  icons={tableIcons}
                  onRowClick={handleDetails}
                />
              </Grid>
            </Grid>) : 
            (<Grid container spacing={3}>
              <Grid item xs={12} md={1}>
                  <IconButton onClick={handleDetails}>
                    <ChevronLeftIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography className={classes.title} color="primary" gutterBottom variant="h5">
                        Article 
                      </Typography>
                      <Typography variant="h6" component="h2" color="textSecondary">
                        #863459
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                <Card className={classes.card}>
                <CardContent>
                      <Typography className={classes.title} color="primary" gutterBottom variant="h5">
                        Score
                      </Typography>
                      <CardMedia
                        className={classes.cover}
                        image="/static/images/cards/live-from-space.jpg"
                        title="Live from space album cover"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>)}           
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    );
        } else {
          return null;
        }
}