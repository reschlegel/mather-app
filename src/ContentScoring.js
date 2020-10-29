import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { Tooltip } from '@material-ui/core'
import MUIDataTable from "mui-datatables";

const styles = theme => ({
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
        backgroundColor: theme.palette.success.main,
    },
    premiumYes: {
        margin: theme.spacing(1),
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: theme.palette.secondary.main,
    },
});

function ContentScoring(props) {
   
    const { classes, table } = props;

    const [searchText, setSearchText] = useState("");
    const [details, setDetails] = useState(false);

    const AddArticle = () => (
        <Tooltip disableFocusListener title="Add Article">
            <IconButton onClick={async () => props.scoreArticle(searchText)}>
                <PostAddIcon />
            </IconButton>
        </Tooltip>
    )

    const columns = [
        {
            name: "id",
            label: "Article ID",
            filter: true,
            options: {
                sortThirdClickReset: true
            }
        },
        {
            name: "prem",
            label: "Premium",
            filter: true,
            options: {
                customBodyRender: (value, tableMeta, updateValue) => {
                    if (value) {
                        return (<Avatar className={classes.premiumNo}><LockOutlinedIcon fontSize="small" /></Avatar>)
                 } else {
                     return (<Avatar className={classes.premiumYes}><LockOpenOutlinedIcon fontSize="small" /></Avatar>)
                    }
                },
                sortThirdClickReset: true
            }
        },
        {
            name: "title",
            label: "Title",
            filter: true,
            options: {
                sortThirdClickReset: true
            }
        },
        {
            name: "author",
            label: "Author",
            filter: true,
            options: {
                sortThirdClickReset: true
            }
        },
        {
            name: "sec",
            label: "Section",
            filter: true,
            options: {
                sortThirdClickReset: true
            }
        },
        {
            name: "scoredAt",
            label: "Scored At",
            filter: true,
            options: {
                sortThirdClickReset: true
            }
        },
    ];
       
    const options = {
        selectableRows: "none",
        print: false,
        onRowClick: async (rowData, rowMeta) => {
            setDetails(true);
            await props.getArticleDetails(rowData[0]);
        },
        customToolbar: AddArticle,
        download: false,
        filter: false,
        viewColumns: false,
        searchText: searchText,
        customSearch: (searchQuery, currentRow, columns) => {
            let isFound = false;

            currentRow.forEach(col => {
                if (col.toString().toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
                    isFound = true;
                }
            });

            return isFound;
        },
        onSearchChange: (searchQuery) => {
            setSearchText(searchQuery);
        }

    };

    if (!details) {
        return (
            <MUIDataTable
                title={"Article Scoring"}
                data={table}
                columns={columns}
                options={options}
            />
        )
    } else {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={1}>
                    <IconButton onClick={ () => {
                        setSearchText('');
                        setDetails(false);                        
                    }}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Article ID
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.id}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Title
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.title}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Author
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.author}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Premium
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.prem ? "Premium": "Not Premium"}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Section
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.sec}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Sub Section
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.subsec}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Publish Date
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.pubDate}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Source
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.source}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Page Type
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.pageType}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Article Type
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.artType}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classes.card}>
                    <CardContent>
                        <Typography align="left" color="primary" gutterBottom variant="h5">
                        Text
                        </Typography>
                        <Typography align="left" variant="h6" component="h2" color="textSecondary">
                        {props.detailInfo.text}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )

    }
}

export default withStyles( styles )(ContentScoring);