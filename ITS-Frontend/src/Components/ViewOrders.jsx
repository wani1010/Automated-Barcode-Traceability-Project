import React, { Component } from "react";
import Loading from "./Loading";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  RadioGroup,
  TextField,
  Button,
  IconButton,
  TableContainer,
  TableCell,
  TableHead,
  Paper,
  TableRow,
  Typography,
  TableBody,
  Table,
  Radio,
  FormControlLabel,
  FormControl
} from "@material-ui/core";
import axios from "axios";
import config from "./config";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ViewBarcodes from "./ViewBarcodes";
import DeleteIcon from "@material-ui/icons/Delete";


const styles = theme => ({
  mainTablePaper: {
    padding: 20,
    paddingTop: 15
  },
  dropDown: {
    [theme.breakpoints.up("xs")]: {
      bottom: theme.spacing(2),
      left: theme.spacing(0.2),
      width: "100%"
    },
  },
  tableContainer: {
    maxHeight: "64vh"
  },
  tableBorder: {
    border: "0.5px solid #D3D3D3"
  }
});

class ViewOrders extends Component {
  state = {
    customers: [],
    orderTableHeading: ["Sr No.", "Order ID", "Customer Name", "Issued on", "Completed on", "Status", "Actions"],
    orders: [],
    temporaryOrders: [],
    temporaryCompleteOrders: [],
    filteredOrders: [],
    loading: true,
    selectedCustomer: 0,
    filteredOrdersCount: 0,
    filteredCustName: '',
    selectedOrder: {},
    showBarcodeDialog: false
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    var { customers, orders } = this.state;

    axios.get(config.baseUrl + "/customers").then(result => {
      customers = JSON.parse(JSON.stringify(result.data.data));
      customers.unshift({ _id: 0, customerName: "All" });
      console.log("Customers:", customers);
      this.fetchOrders();
      this.setState({ customers });
    }).catch(err => {
      alert("Error fetching customer list!");
    });
  }

  fetchOrders = () => {
    var { orders, filteredOrders } = this.state;

    axios.get(config.baseUrl + "/orders").then(result => {
      orders = result.data.data;
      filteredOrders = JSON.parse(JSON.stringify(orders));
      this.setState({ orders, filteredOrders, loading: false });
      console.log('filteredOrders', filteredOrders);
    }).catch(err => {
      alert("Error fetching orders!");
    });

  }

  handleChange = (event) => {
    var { filteredOrders, orders, filteredOrdersCount, filteredCustName, temporaryOrders } = this.state;

    if (event.target.value === "") {
      filteredOrders = orders;
    }
    else {
      filteredOrders = orders.filter(od => od.customerName.toLowerCase().includes(event.target.value.toLowerCase()) || od.barCode.toLowerCase().includes(event.target.value.toLowerCase()));
      // filteredOrders.map(filteredOrder => filteredCustName = filteredOrder.customerName);
    }

    console.log('Orders:', filteredOrders);
    filteredOrdersCount = filteredOrders.length;

    temporaryOrders = JSON.parse(JSON.stringify(filteredOrders));

    this.setState({
      filteredOrders,
      selectedCustomer: event.target.value,
      filteredOrdersCount,
      filteredCustName,
      temporaryOrders
    });
  };

  handleTableRow = (orderId) => {
    this.props.history.push("./ViewBoxes/" + orderId);
  };

  getLinkedStatus = (status) => {
    var displayColor = ""
    var state = ""
    if (!status) {
      displayColor = "red"
      state = "In Progress"
    } else {
      displayColor = "green"
      state = "Completed"
    }
    return (
      <Grid container alignItems="center" justify="flex-start" spacing={1} >
        <Grid item >
          <span style={{ height: 10, width: 10, backgroundColor: displayColor, borderRadius: "50%", display: "inline-block" }}></span>
        </Grid>
        <Grid item >
          {state}
        </Grid>
      </Grid>
    )
  }

  handleRadioChange = (event) => {
    var { filteredOrders, orders, temporaryOrders, temporaryCompleteOrders } = this.state;
    var ordersCompleted = [];
    var ordersPending = [];

    if (temporaryOrders.length == 0) {
      temporaryCompleteOrders = JSON.parse(JSON.stringify(orders));
    } else {
      temporaryCompleteOrders = JSON.parse(JSON.stringify(temporaryOrders));
    }
    this.setState({ temporaryCompleteOrders });

    filteredOrders = JSON.parse(JSON.stringify(temporaryCompleteOrders));
    this.setState({ filteredOrders });

    filteredOrders.map(order => {
      if (order.linkStatus === 1) {
        ordersCompleted.push(order);
      } else if (order.linkStatus == 0) {
        ordersPending.push(order);
      }
    });

    temporaryCompleteOrders = JSON.parse(JSON.stringify(filteredOrders))
    this.setState({ temporaryCompleteOrders });

    if (event.target.value === "completed") {
      filteredOrders = JSON.parse(JSON.stringify(ordersCompleted));
    } else if (event.target.value === "in progress") {
      filteredOrders = JSON.parse(JSON.stringify(ordersPending));
    }

    this.setState({ filteredOrders });
  }


  onViewBarcodes = (e, order) => {
    e.stopPropagation();

    var { selectedOrder, showBarcodeDialog } = this.state
    selectedOrder = order;
    console.log("selectedOrder: ", selectedOrder);
    showBarcodeDialog = true
    this.setState({ selectedOrder, showBarcodeDialog })

  }
  handleOrderDelete = (e, order) => {
    e.stopPropagation();

    if (window.confirm(`Do you want to delete the order ${(order.barCode)}?`)) {
      axios.delete(config.baseUrl + "/orders/" + order._id).then(res => {
        this.fetchOrders()
      }).catch(err => {
        console.log("Error deleting the order: ", err);
        alert("Sorry! An unexpected error occured.")
      })
    }
  }

  render() {

    const { classes } = this.props;


    return (
      <div>
        <Loading loading={this.state.loading}></Loading>
        <FormControl className={classes.dropDown}>

          {/* <Grid container alignItems="center">
            <Grid item xs={12} lg={2} >
              <strong style={{ fontSize: 18 }}>Select customer name</strong>

            </Grid> */}
          {/* <Grid item xs={12} lg={10}> */}

          {/* <NativeSelect
                id="demo-customized-select-native"
                value={this.state.selectedCustomer}
                onChange={this.handleChange}
                input={<BootstrapInput />}
                style={{ width: "100%" }}
              >
                {this.state.customers.map(cust => (
                  <option key={cust._id} value={cust._id} label={cust.customerName}></option>
                ))}
              </NativeSelect> */}

          <Autocomplete
            // freeSolo
            id="searchOrder"
            size="small"
            options={this.state.orders}
            getOptionLabel={(order) => order.barCode}
            filterOptions={() => this.state.filteredOrders}
            renderOption={(order) => (
              <div>
                <Typography variant="subtitle1">{order.barCode}</Typography>
                <Typography variant="subtitle2" color="textSecondary">{`Customer: ${order.customerName}`}</Typography>
              </div>
            )}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search by"
                focused
                onSelect={this.handleChange}
                onChange={this.handleChange}
                placeholder="Order ID or Customer Name"
                margin="normal"
                variant="outlined"

              />
            )}
          />
          {/* </Grid>
          </Grid> */}

        </FormControl>

        <Paper className={classes.mainTablePaper}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="textSecondary">
                <span style={{ fontWeight: "bold", fontSize: 22, color: "black" }}>
                  {"Orders "}
                </span>
                {`(total: ${this.state.orders.length})`}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <RadioGroup defaultValue onChange={this.handleRadioChange}>
                <Grid container justify="space-around">
                  <Grid item >
                    <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                  </Grid>
                  <Grid item >
                    <FormControlLabel value="in progress" control={<Radio />} label="In Progress" />
                  </Grid>
                  <Grid item >
                    <FormControlLabel value="both" control={<Radio />} label="Both" />
                  </Grid>
                </Grid>
              </RadioGroup>
            </Grid>
          </Grid>
          <br></br>
          <TableContainer className={classes.tableContainer}>

            <Table stickyHeader size="medium">
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

                {this.state.filteredOrders.map((order, idx) => (
                  <TableRow hover key={idx} onClick={() => this.handleTableRow(order._id)}>
                    <TableCell className={classes.tableBorder}>
                      {idx + 1}
                    </TableCell>
                    <TableCell className={classes.tableBorder}>
                      {order.barCode}
                    </TableCell>

                    <TableCell className={classes.tableBorder}>
                      {order.customerName}
                    </TableCell>

                    <TableCell className={classes.tableBorder}>


                      {order.issuedOn
                        ? new Date(order.issuedOn).toDateString()
                        : "---"}


                    </TableCell>
                    <TableCell className={classes.tableBorder}>
                      {order.completedOn
                        ? new Date(order.completedOn).toDateString()
                        : "---"}
                    </TableCell>
                    <TableCell className={classes.tableBorder}>
                      {this.getLinkedStatus(order.linkStatus)}
                    </TableCell>
                    <TableCell className={classes.tableBorder}>
                      <Grid container justify="space-around" alignItems="center">
                        <Grid item>

                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={(e) => this.onViewBarcodes(e, order)}
                          >
                            Barcodes
                          </Button>
                        </Grid>
                        <Grid item>

                          <IconButton
                            style={{ fontSize: 18 }}
                            onClick={(e) => this.handleOrderDelete(e, order)}
                          >

                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>'
        {this.state.showBarcodeDialog ? (
          <ViewBarcodes
            open={this.state.showBarcodeDialog}
            onClose={() => { this.setState({ showBarcodeDialog: false }); }}
            barcodes={this.state.selectedOrder.barcodes}
            savedOrderID={this.state.selectedOrder.barCode}>
          </ViewBarcodes>
        ) : (undefined)}
      </div>
    );
  }
}

export default withStyles(styles)(ViewOrders);

