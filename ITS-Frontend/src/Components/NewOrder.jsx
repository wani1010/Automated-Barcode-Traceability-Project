import React, { Component } from "react";
import CustomerDetails from "./CustomerDetails";
import InputLabel from '@material-ui/core/InputLabel';
import BigBoxes from "./BigBoxes";
import Select from '@material-ui/core/Select';

import {
  Add as AddIcon
} from "@material-ui/icons";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutlineRounded";
//import Pdf from "react-to-pdf";
import { withStyles } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import {
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  Fab,
  Divider,
  InputAdornment,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Tooltip
} from "@material-ui/core";
import AddBoxDialog from "./AddBoxDialog";
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import axios from "axios";
import config from "./config";
import Loading from "./Loading";
import ViewBarcodes from "./ViewBarcodes";


const styles = theme => ({
  fabAdd: {
    position: "fixed",
    color: "white",

    [theme.breakpoints.up("xs")]: {
      bottom: theme.spacing(3),
      right: theme.spacing(3)
    },

    [theme.breakpoints.up("md")]: {
      bottom: theme.spacing(5),
      right: theme.spacing(15)
    },
  },
  fabSave: {
    position: "fixed",
    color: "white",

    [theme.breakpoints.up("xs")]: {
      bottom: theme.spacing(3),
      right: theme.spacing(12)
    },

    [theme.breakpoints.up("md")]: {
      bottom: theme.spacing(5),
      right: theme.spacing(24)
    },
  },
  dropDown: {
    [theme.breakpoints.up("xs")]: {
      bottom: theme.spacing(2),
      left: theme.spacing(0.2),
      width: "100%"
    }
  }
});

class NewOrder extends Component {
  state = {
    order: {
      bigBoxes: []
    },
    linkstatus: 0,
    addDialogOpen: false,
    selectedBox: {},
    customers: [],
    selectedCustomer: null,
    showCustDetailsComponent: false,
    loading: true,
    showBarcodeDialog: false,
    isSaveSuccess: true,
    barcodes: [],
    savedOrderID: "",
    parts: [],
    downloadLoading: false,
    orderNo: "",
    poNo: ""
  }

  handleAddDialogOpen = idx => {
    this.setState({
      addDialogOpen: true,
      selectedBox: {}
    });
  };

  handleAddDialogSave = (newBox) => {
    var { bigBoxes } = this.state.order;
    newBox.smallBoxes = [];
    var isredundant = false;
    bigBoxes.forEach(bb => {
      if (bb.name === newBox.name) {
        alert("Big Box with the same name is already present!")
        isredundant = true
        return;
      }
    })
    if (!isredundant){
      newBox.bbWeight=0 // abhi
    bigBoxes.push(newBox);
  }
    this.setState({
      bigBoxes,
      addDialogOpen: false
    });
    console.log("Order in handleAddDialogSaveForBigBox: ", this.state.order);
  };


  handleTextChange = (status, e) => {
    var { selectedBox } = this.state;

    if (status === 1) {
      selectedBox._id = e.target.value;
    } else if (status === 2) {
      selectedBox.name = e.target.value;
    }
    selectedBox.type = "BB";

    this.setState({
      selectedBox
    });
  };

  handleBoxCardClicked = () => {
    var { selectedBox } = this.state;

    selectedBox.smallBoxes = []

    this.setState({
      selectedBox
    });
  }

  handleAddDialogClose = () => {
    this.setState({
      addDialogOpen: false
    });
  }

  handleChange = (_, val) => {
    console.log("jsdofjsdfjsds: ", val);
    var { showCustDetailsComponent, selectedCustomer, customers } = this.state
    selectedCustomer = val
    if (!selectedCustomer) {
      showCustDetailsComponent = false
    }
    else {
      showCustDetailsComponent = true
    }
    this.setState({
      showCustDetailsComponent,
      selectedCustomer
    });
  };

  componentDidMount() {

    this.fetchCustomers();
  }

  fetchCustomers = () => {
    var { customers } = this.state;

    axios.get(config.baseUrl + "/customers").then(result => {
      customers = JSON.parse(JSON.stringify(result.data.data));
      this.setState({ customers, loading: false });
      // this.fetchParts();
    }).catch(err => {
      alert("Error fetching customer list!");
      this.fetchCustomers();
    });
  }



  handleOrderSave = () => {
    var { selectedCustomer, orderNo } = this.state;
    var boxEmptyCancelClicked = false
    console.log("Selected customer:", selectedCustomer);
    if (this.state.order.bigBoxes.length && this.state.selectedCustomer != null) {

      this.state.order.bigBoxes.map((bigBox, index) => {
        if (bigBox.smallBoxes.length === 0) {
          if (window.confirm("Big box " + bigBox.name + " is empty. Are you sure you want to delete it?")) {
            var { order } = this.state;

            bigBox.smallBoxes = [];
            order.bigBoxes = order.bigBoxes.filter(bb => bb.name != bigBox.name);

            this.setState(order);
            boxEmptyCancelClicked = false
          }
          else
            boxEmptyCancelClicked = true
        }

        bigBox.smallBoxes.map((smallBox) => {
          if (smallBox.products.length === 0) {
            if (window.confirm("Small box " + smallBox.name + " is empty. Are you sure you want to delete it?")) {
              var { order } = this.state;

              smallBox.products = [];
              order.bigBoxes[index].smallBoxes = order.bigBoxes[index].smallBoxes.filter(sb => sb.name != smallBox.name);
              if (bigBox.smallBoxes.length === 0) {
                order.bigBoxes = order.bigBoxes.filter(bb => bb.name != bigBox.name);
              }
              this.setState(order);
              boxEmptyCancelClicked = false
            }
            else
              boxEmptyCancelClicked = true
          }
        })
      });
      if (!boxEmptyCancelClicked && this.state.order.bigBoxes.length !== 0) {
        this.setState({ loading: true });

        var order = {
          customerId: selectedCustomer._id,
          customerName: selectedCustomer.customerName,
          bigBoxes: this.state.order.bigBoxes,
          barCode: orderNo,
          poNo: this.state.poNo
        }

        axios.post(config.baseUrl + "/orders/add", order).then(result => {
          console.log("Success: ", result.data.success);
          console.log("Barcodes: ", result.data.data.barcodes);
          this.setState({

            order: { bigBoxes: [] },
            showBarcodeDialog: true,
            loading: false,
            isSaveSuccess: result.data.success,
            savedOrderID: result.data.data.generatedCode,
            barcodes: result.data.data.barcodes,
            orderNo: "",
            poNo: ""
          });
          console.log('Result:', result.data.data);
        }).catch(err => {
          console.log('Error:', err);
          this.setState({
            loading: false,
            showBarcodeDialog: true,
            isSaveSuccess: false,
          })
        });
      }

    }
  }



  handleOrderNoText = (e) => {
    var { orderNo } = this.state
    orderNo = e.target.value
    this.setState({ orderNo })
  }
  handlePoNoText = (e) => {
    var { poNo } = this.state
    poNo = e.target.value
    this.setState({ poNo })
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
            </Grid>
            <Grid item xs={12} lg={10}>
              
              <NativeSelect
                id="demo-customized-select-native"
                value={this.state.selectedCustomer ? this.state.selectedCustomer._id : null}
                onChange={this.handleChange}
                input={<BootstrapInput />}
                style={{ width: "100%" }}
              >
                <option key={0} value={null} ></option>
                {this.state.customers.map(cust => (
                  <option key={cust._id} value={cust._id} label={cust.customerName}></option>
                ))}
              </NativeSelect>
            </Grid>
          </Grid> */}
          <Autocomplete
            id="selectCustomer"
            fullWidth
            autoSelect
            size="small"
            onChange={this.handleChange}
            options={this.state.customers}
            getOptionLabel={(option) => option.customerName}
            renderInput={(params) => (
              <TextField {...params} label="Enter Customer Name" variant="outlined" margin="normal" />
            )}
            renderOption={(option, { inputValue }) => {
              const matches = match(option.customerName, inputValue);
              const parts = parse(option.customerName, matches);

              return (
                <div>
                  {parts.map((part, index) => (
                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                      {part.text}
                    </span>
                  ))}
                </div>
              );
            }}
          />

          <TextField
            fullWidth
            label={"FC Order Number"}
            value={this.state.orderNo}
            onChange={this.handleOrderNoText}
            margin="dense"
            variant="outlined"

          />
          <TextField
            fullWidth
            label={"PO Number"}
            value={this.state.poNo}
            onChange={this.handlePoNoText}
            margin="dense"
            variant="outlined"

          />
        </FormControl>

        {
          this.state.showCustDetailsComponent ? (
            <>
              <CustomerDetails custName={this.state.selectedCustomer.customerName} parentComponent="NewOrder"></CustomerDetails>
            </>
          ) : (undefined)
        }

        {
          this.state.showCustDetailsComponent && this.state.poNo !== "" && this.state.orderNo !== "" ? (
            <>
              <Tooltip title="Add Big Box" arrow>
                <Fab
                  color="secondary"
                  aria-label="Add"
                  className={classes.fabAdd}
                  onClick={() => this.handleAddDialogOpen()}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>

              <Tooltip title="Save Order" arrow>
                <Fab
                  style={{ paddingLeft: 30, paddingRight: 30 }}
                  variant="extended"
                  color="secondary"
                  aria-label="Add"
                  className={classes.fabSave}
                  onClick={() => this.handleOrderSave()}
                >
                  Save

                </Fab>
              </Tooltip>
            </>
          ) : (undefined)
        }

        <AddBoxDialog type="BB" setDialog={this.state.addDialogOpen} handleDialogClose={this.handleAddDialogClose} handleDialogSave={this.handleAddDialogSave}></AddBoxDialog>

        <BigBoxes
          order={this.state.order}
          parentComponent="NewOrder"
          showCustomerDetails={this.state.showCustDetailsComponent}
        ></BigBoxes>

        {this.state.showBarcodeDialog ? (
          <ViewBarcodes
            open={this.state.showBarcodeDialog}
            onClose={() => { this.setState({ showBarcodeDialog: false }); }}
            barcodes={this.state.barcodes}
            savedOrderID={this.state.savedOrderID}
          >
          </ViewBarcodes>
        ) : (undefined)}


      </div >
    );
  }


}



export default withStyles(styles)(NewOrder);