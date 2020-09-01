import React, { forwardRef } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Tooltip } from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import MUIDataTable from "mui-datatables";

const styles = theme => ({
    title: {
        flexGrow: '1'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    card: {
        display: 'flex',
        height: '100%',
        flexGrow: '1',
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
});

function ContentScoring(props) {
   
    const { classes, details, handleDetails } = props;

    const AddArticle = () => (
        <Tooltip disableFocusListener title="Add Article">
            <IconButton onClick={() => alert("clicked")}>
                <PostAddIcon />
            </IconButton>
        </Tooltip>
    )

    const columns = [
        {
            name: "id",
            label: "Article ID",
            options: {
                sortThirdClickReset: true
            }
        },
        {
            name: "headline",
            label: "Headline",
        },
        {
            name: "premium",
            label: "Premium",
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    if (value) {
                        return (<Avatar className={classes.premiumNo}><LockOutlinedIcon fontSize="small" /></Avatar>)
                 } else {
                     return (<Avatar className={classes.premiumYes}><MonetizationOnIcon fontSize="small" /></Avatar>)
                    }
                },
            }
        },
        {
            name: "risk",
            label: "Risk"
        },
    ];
       
    const data = [
        { id: "Joe James", headline: "Test Corp", premium: true, state: "NY" },
        { id: "John Walsh", headline: "Test Corp", premium: false, state: "CT" },
        { id: "Bob Herm", headline: "Test Corp", premium: true, state: "FL" },
        { id: "James Houston", headline: "Test Corp", premium: false, state: "TX" },
    ];
       
    const options = {
        selectableRows: "none",
        print: false,
        onRowClick: () => {
            handleDetails()
        },
        customToolbar: AddArticle,
        download: false,
        filter: false,
        viewColumns: false

    };

    if (!details) {
        return (
            <MUIDataTable
                title={"Article Scoring"}
                data={data}
                columns={columns}
                options={options}
            />
        )
    } else {
        return (
            <Grid container spacing={3}>
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
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )

    }
}

export default withStyles( styles )(ContentScoring);