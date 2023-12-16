import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import config from "./config";
import axios from "axios";
import BigBoxes from "./BigBoxes";
import Loading from "./Loading";
import CustomerDetails from "./CustomerDetails";

const styles = (theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
});

class TrackOrder extends Component {
  state = {
    scannedText: "",
    order: {},
    loading: false,
  };

  handleTextChange = (e) => {
    this.setState({
      scannedText: e.target.value,
    });
  };

  handleButtonClick = () => {
    console.log("Button text:", this.state.scannedText);

    var { scannedText, order } = this.state;
    this.setState({ loading: true });
    if (scannedText !== "") {
      axios
        .get(config.baseUrl + "/orders/barcode/" + scannedText)
        .then((result) => {
          console.log("Result:", result);
          order = result.data.data.order;
          this.setState({
            order,
            loading: false,
          });
          console.log("Order:", order);
        })
        .catch((err) => {
          alert("Error loading the order.");
        });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Loading loading={this.state.loading}></Loading>

        <div>
          <TextField
            id="outlined-basic"
            label="Enter the Big Box barcode"
            variant="outlined"
            value={this.state.scannedText}
            onChange={(e) => this.handleTextChange(e)}
            style={{ width: "90%", paddingRight: 10 }}
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={() => this.handleButtonClick()}
            style={{ width: "10%", minHeight: 55 }}
          >
            Scan
          </Button>
        </div>
        <br></br>
        {this.state.order.customerName !== undefined && (
          <CustomerDetails
            custName={this.state.order.customerName}
            parentComponent="NewOrder"
          ></CustomerDetails>
        )}
        {this.state.order ? (
          <BigBoxes
            order={this.state.order}
            parentComponent="TrackOrder"
          ></BigBoxes>
        ) : undefined}
      </div>
    );
  }
}

export default withStyles(styles)(TrackOrder);
