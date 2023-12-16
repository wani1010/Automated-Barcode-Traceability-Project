import { withStyles, Tooltip, Fab } from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import BigBoxes from "./BigBoxes";
import config from "./config";
import Loading from "./Loading";
import TableDialogToViewOrder from "./TableDialogToViewOrder";

const styles = (theme) => ({
  fabSave: {
    position: "fixed",
    color: "white",

    [theme.breakpoints.up("xs")]: {
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },

    [theme.breakpoints.up("md")]: {
      bottom: theme.spacing(5),
      right: theme.spacing(15),
    },
  },
});

class ViewBoxes extends Component {
  state = {
    order: {},
    linkstatus: 0,
    loading: true,
    hasUpdate: false,
    itemType: "",
    setReportDialog: false,
  };

  componentDidMount() {
    console.log("Order Id: ", this.props.match.params.orderId);

    this.getOrder();
  }

  getOrder = () => {
    var orderId = this.props.match.params.orderId;
    var { order } = this.state;
    this.setState({ loading: true });
    axios
      .get(config.baseUrl + "/orders/" + orderId.toString())
      .then((result) => {
        order = result.data.data;
        this.setState({ order, loading: false, hasUpdate: false });
        console.log("Order in viewBoxes:cust name", order.customerName);
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };
  updateOrder = (itemType, order) => {
    this.setState({ order, hasUpdate: true, itemType });
  };

  getDialogComponent = () => {
    console.log("Over here!");
    this.setState({ setReportDialogOpen: true });
  };

  setReportDialogClose = () => {
    this.setState({ setReportDialogOpen: false });
  };

  render() {
    var { classes } = this.props;
    return (
      <div>
        <Loading loading={this.state.loading}></Loading>

        <BigBoxes
          order={this.state.order}
          orderId={this.props.orderId}
          parentComponent="ViewOrder"
          updateOrder={this.updateOrder}
          isUpdate={this.state.hasUpdate}
          updateFor={this.state.itemType}
        ></BigBoxes>

        <Tooltip title="View Report" arrow>
          <Fab
            style={{ paddingLeft: 30, paddingRight: 30 }}
            variant="extended"
            color="secondary"
            aria-label="Add"
            className={classes.fabSave}
            onClick={() => this.getDialogComponent()}
          >
            REPORT
          </Fab>
        </Tooltip>
        {this.state.setReportDialogOpen ? (
          <TableDialogToViewOrder
            setDialog={this.state.setReportDialogOpen}
            handleDialogClose={this.setReportDialogClose}
            order={this.state.order}
          ></TableDialogToViewOrder>
        ) : undefined}
      </div>
    );
  }
}

export default withStyles(styles)(ViewBoxes);
