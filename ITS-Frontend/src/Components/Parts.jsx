import React, { Component } from "react";
import axios from "axios";
import config from "./config";
import Paper from "@material-ui/core/Paper";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { withStyles } from "@material-ui/core";
import {
    Grid,
    Typography,
    Fab,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    InputAdornment,
    IconButton,
    TextField,
    Button,
    TableContainer
} from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/ClearRounded";
import DeleteIcon from "@material-ui/icons/Delete";
import Loading from "./Loading";

const styles = theme => ({
    // fabAdd: {
    //     position: "fixed",
    //     color: "white",

    //     [theme.breakpoints.up("xs")]: {
    //         bottom: theme.spacing(3),
    //         right: theme.spacing(3)
    //     },

    //     [theme.breakpoints.up("md")]: {
    //         bottom: theme.spacing(5),
    //         right: theme.spacing(6)
    //     },
    // },
    tableBorder: {
        border: "0.5px solid #D3D3D3"
    },
    tableContainer: {
        maxHeight: "72vh"
    },
    paper: {
        padding: 20,
        paddingTop: 15
    }
});

class Parts extends Component {
    state = {
        parts: [],
        orderTableHeading: ["Sr.No.", "Part No.", "Description", "Part Size","Weight (Mg)", "Actions"],
        setPartDialogOpen: false,
        partToBeAdded: {
            partName: "",
            description: "",
            size: "",
            weight:"",
            partNo: ""
        },
        selectedPart: {},
        loading: true
    }

    componentDidMount() {
        this.fetchParts();
    }

    fetchParts = () => {
        var { parts } = this.state;
        this.setState({ loading: true })

        axios.get(config.baseUrl + "/parts").then(result => {
            parts = JSON.parse(JSON.stringify(result.data.data));
            this.setState({ parts, loading: false });
            console.log("parts.........:", this.state.parts);
        }).catch(err => {
            alert("Error fetching customer list!");
            this.fetchParts()
        });
    }

    handleAddPart = () => {
        this.setState({ setPartDialogOpen: true });
    }

    handleClosePartsDialog = () => {
        this.setState({
            partToBeAdded: {
                partName: "",
                description: "",
                size: "",
                weight:"",
                partNo: ""
            },
            setPartDialogOpen: false
        })
    }

    savePartDetails = () => {
        var { partToBeAdded } = this.state
          var { parts } = this.state
          var isredundant=false
            console.log(" part cha array:",parts);
         parts.forEach(part => {
      if (part.partNo === partToBeAdded.partNo) {
        alert("Part no. with the same no. is already present!")

        isredundant = true
        return
      }
    })
    if(!isredundant){

      
        this.setState({ loading: true })
        console.log('Part size just before posting:', partToBeAdded.size);
        axios.post(config.baseUrl + "/parts/add", partToBeAdded).then(result => {
            this.setState({
                partToBeAdded: {
                    partName: "",
                    description: "",
                    size: "",
                    weight:"",
                    partNo: ""
                },
                setPartDialogOpen: false
            });
            this.fetchParts()
        }).catch(err => {
            alert("Error Adding part.")
            console.log("Error adding part: ", err);
            this.setState({ loading: false })
        })
    }else{
          console.log(" part cha array:",parts);
    }
    }

    handleChange = (state, e) => {
        var { partToBeAdded } = this.state
        switch (state) {
            case 1: {
                partToBeAdded.partNo = e.target.value
            }
                break;
            case 2: {
                partToBeAdded.partName = e.target.value
            }
                break;
            case 3: {
                partToBeAdded.size = e.target.value
            }
                break;
             case 4: {
                partToBeAdded.weight = Number(e.target.value) 
            }
                break;    
        }

        this.setState({ partToBeAdded })
    }

    handlePartDelete = (part) => {
        if (window.confirm(`Do you want to delete the part ${(part.partNo)}?`)) {
            axios.delete(config.baseUrl + "/parts/" + part._id).then(res => {
                this.fetchParts()
            }).catch(err => {
                console.log("Error deleting part: ", err);
                alert("Sorry! An unexpected error occured.")
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Loading loading={this.state.loading}></Loading>

                <Paper className={classes.paper}>
                    <Grid container justify="space-between" alignItems="center" style={{ marginBottom: 20 }}>
                        <Grid item>

                            <Typography variant="h6" color="textSecondary" >
                                <span style={{ fontWeight: "bold", fontSize: 22, color: "black" }}>
                                    {"Parts "}
                                </span>
                                {`(total: ${this.state.parts.length})`}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                aria-label="Add"
                                onClick={() => this.handleAddPart()}
                            >
                                <AddIcon style={{ fontSize: 20 }}></AddIcon> Add Part
                            </Button>
                        </Grid>
                    </Grid>
                    <TableContainer className={classes.tableContainer}>

                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {this.state.orderTableHeading.map(heading => (
                                        <TableCell className={classes.tableBorder}>
                                            <Typography
                                                variant="body1"
                                                color="textPrimary"
                                                style={{ fontWeight: "bold" }}
                                            >
                                                {heading}
                                            </Typography>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {this.state.parts.map((part, index) => (
                                    <TableRow>
                                        <TableCell className={classes.tableBorder}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {part.partNo}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {part.partName}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {part.size ? part.size : "-"}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {part.weight ? part.weight : "-"}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            <IconButton
                                                style={{ fontSize: 18 }}
                                                onClick={() => this.handlePartDelete(part)}
                                            >
                                                <DeleteIcon></DeleteIcon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* <Tooltip title="Add new part" arrow>
                    <Fab
                        color="secondary"
                        aria-label="Add"
                        className={classes.fabAdd}
                        onClick={() => this.handleAddPart()}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip> */}

                <Dialog
                    open={this.state.setPartDialogOpen}
                >
                    <DialogTitle>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                            style={{ width: "100%" }}
                        >
                            <Grid item xs="auto">
                                <Typography variant="h6" style={{ color: "secondary" }}>
                                    Add Part
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton
                                    onClick={() => this.handleClosePartsDialog()}
                                >
                                    <ClearIcon></ClearIcon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <Divider light />
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Part No."}
                                    margin="dense"
                                    value={this.state.partToBeAdded.partNo}
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(1, e)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Description"}
                                    margin="dense"
                                    value={this.state.partToBeAdded.partName}
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(2, e)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Part Size"}
                                    margin="dense"
                                    value={this.state.partToBeAdded.size}
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(3, e)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Part weight (Mg)"}
                                    type="number" // abhi
                                    margin="dense"
                                    value={this.state.partToBeAdded.weight}
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(4, e)}
                                />
                            </Grid>

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => this.savePartDetails()}
                            color="secondary"
                            autoFocus
                            style={{ backgroundColor: "secondary", color: "white", width: 150 }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(styles)(Parts);