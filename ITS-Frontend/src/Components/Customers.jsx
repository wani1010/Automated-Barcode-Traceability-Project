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
import Loading from "./Loading";
import DeleteIcon from "@material-ui/icons/Delete";


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
    paper: {
        padding: 20,
        paddingTop: 15
    },
    tableContainer: {
        maxHeight: "72vh"
    }
});

class Customers extends Component {
    state = {
        customers: [],
        orderTableHeading: ["Sr.No.", "Customer name", "Description", "Actions"],
        setCustomerDialogOpen: false,
        customerToBeAdded: {
            customerName: "",
            description: ""
        },
        loading: true
    }

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = () => {
        var { customers, loading } = this.state;
        this.setState({ loading: true })

        axios.get(config.baseUrl + "/customers").then(result => {
            customers = JSON.parse(JSON.stringify(result.data.data));
            this.setState({ customers, loading: false });
            console.log("Customers.........:", this.state.customers);
        }).catch(err => {
            alert("Error fetching customer list!");
            this.fetchCustomers()
        });
    }

    handleAddCustomer = () => {
        this.setState({ setCustomerDialogOpen: true });
    }

    handleCloseCustomersDialog = () => {
        this.setState({
            customerToBeAdded: {
                customerName: "",
                description: ""
            },
            setCustomerDialogOpen: false
        })
    }

    saveCustomerDetails = () => {
        var { customerToBeAdded } = this.state
        this.setState({ loading: true })
        axios.post(config.baseUrl + "/customers/add", customerToBeAdded).then(result => {
            this.setState({
                customerToBeAdded: {
                    customerName: "",
                    description: ""
                },
                setCustomerDialogOpen: false
            });
            this.fetchCustomers()
        }).catch(err => {
            alert("Error Adding Customer.")
            console.log("Error adding Customer: ", err);
            this.setState({ loading: false })
        })
    }

    handleChange = (state, e) => {
        var { customerToBeAdded } = this.state
        switch (state) {
            case 1: {
                customerToBeAdded.customerName = e.target.value
            }
                break;
            case 2: {
                customerToBeAdded.description = e.target.value
            }
                break;
        }

        this.setState({ customerToBeAdded })
    }

    handleCustomerDelete = (customer) => {
        if (window.confirm(`Do you want to remove the customer ${(customer.customerName)}?`)) {
            axios.delete(config.baseUrl + "/customers/" + customer._id).then(res => {
                this.fetchCustomers()
            }).catch(err => {
                console.log("Error deleting customer: ", err);
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
                                    {"Customers "}
                                </span>
                                {`(total: ${this.state.customers.length})`}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                aria-label="Add"
                                onClick={() => this.handleAddCustomer()}
                            >
                                <AddIcon style={{ fontSize: 20 }}></AddIcon> Add Customer
                            </Button>
                        </Grid>
                    </Grid>
                    <TableContainer className={classes.tableContainer}>

                        <Table size="small">
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
                                {this.state.customers.map((customer, index) => (
                                    <TableRow>
                                        <TableCell className={classes.tableBorder}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {customer.customerName}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            {customer.description ? customer.description : "-"}
                                        </TableCell>
                                        <TableCell className={classes.tableBorder}>
                                            <IconButton
                                                style={{ fontSize: 18 }}
                                                onClick={() => this.handleCustomerDelete(customer)}
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

                {/* <Tooltip title="Add new customer" arrow>
                    <Fab
                        color="secondary"
                        aria-label="Add"
                        className={classes.fabAdd}
                        onClick={() => this.handleAddCustomer()}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip> */}

                {!this.state.loading && <Dialog
                    open={this.state.setCustomerDialogOpen}
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
                                    Add Customer
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton
                                    onClick={() => this.handleCloseCustomersDialog()}
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
                                    label={"Customer Name"}
                                    margin="dense"
                                    value={this.state.customerToBeAdded.customerName}
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(1, e)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Description"}
                                    value={this.state.customerToBeAdded.description}
                                    margin="dense"
                                    variant="outlined"
                                    onChange={(e) => this.handleChange(2, e)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => this.saveCustomerDetails()}
                            color="secondary"
                            autoFocus
                            style={{ backgroundColor: "secondary", color: "white", width: 150 }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>}

            </div>
        );
    }
}

export default withStyles(styles)(Customers);