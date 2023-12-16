import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import axios from "axios";
import config from "./config";

class ScanBoxDialog extends Component {
  state = {
    isScanning: true,
    scannedBarcode: "",
    errMsg: "",
  };

  componentDidMount() {
    document.body.addEventListener("keypress", this.onKeyScanned);
  }

  onKeyScanned = (e) => {
    var { scannedBarcode, isScanning, errMsg } = this.state;
    if (e.key === "Enter") {
      if (
        scannedBarcode !== "" &&
        this.props.checkBarcode(scannedBarcode, this.props.correctBarcode)
      ) {
        errMsg = "";
        console.log(scannedBarcode);
        isScanning = false;
        this.setState({ isScanning });
        document.body.removeEventListener("keypress", this.onKeyScanned);
      } else {
        errMsg = "Invalid! Please scan a valid barcode.";
        scannedBarcode = "";
        this.setState({ scannedBarcode, errMsg });
      }
    } else {
      /**
       *  To be uncommented while deployment. Commented for testing
       */
      // scannedBarcode += e.key
      this.setState({
        scannedBarcode,
      });
    }
  };

  render() {
    var { boxDetails, setDialog } = this.props;
    console.log("Scan Correct Barcode is: " + this.props.correctBarcode);
    return (
      <Dialog maxWidth="sm" fullWidth open={setDialog}>
        <DialogTitle>
          <Typography variant="h6" style={{ color: "secondary" }}>
            {`Packing ${boxDetails.type === "SB" ? "Small Box" : "Big Box"}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item xs={4}>
              <Typography variant="subtitle1">
                {"Box: "}
                <span style={{ fontWeight: "bold" }}>{boxDetails.name}</span>
              </Typography>
              <Typography variant="subtitle1">
                {"Description: "}
                <span style={{ fontWeight: "bold" }}>
                  {boxDetails.description}
                </span>
              </Typography>
              <Typography variant="subtitle1">
                {boxDetails.type === "SB"
                  ? "Number of Products: "
                  : "Number of Small Boxes: "}
                <span style={{ fontWeight: "bold" }}>
                  {boxDetails.type === "SB"
                    ? boxDetails.products.length
                    : boxDetails.smallBoxes.length}
                </span>
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              style={{
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                Scanned Barcodes:{" "}
              </Typography>
              {this.state.isScanning ? "" : this.state.scannedBarcode}
            </Grid>
            <Grid item container xs={4} spacing={1} align="center">
              <Grid item xs={12}>
                {this.state.isScanning ? (
                  <CircularProgress
                    style={{
                      height: 60,
                      width: 60,
                      color: "#0958a5",
                    }}
                  ></CircularProgress>
                ) : (
                  <CheckOutlineIcon
                    style={{
                      color: "green",
                      height: 60,
                      width: 60,
                    }}
                  ></CheckOutlineIcon>
                )}
              </Grid>

              <Grid item xs={12} container justify="center">
                <Typography variant="subtitle1" style={{ textAlign: "center" }}>
                  {this.state.isScanning
                    ? "Please scan the barcode."
                    : `Barcode Scanned.`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {this.state.isScanning && (
            /**
             *  To be commented while deployment. Uncommented for testing
             */
            <TextField
              id="outlined-basic"
              size="small"
              value={this.state.scannedBarcode}
              placeholder="Enter Barcode"
              variant="outlined"
              onChange={(e) => {
                this.setState({ scannedBarcode: e.target.value });
              }}
            ></TextField>
          )}
          {this.state.isScanning ? undefined : ( // </Button> //     Scan // > //     onClick={() => { this.setState({ isScanning: false }) }} //     variant="contained" //     color="secondary" // <Button
            <Button
              color="secondary"
              variant="contained"
              disabled={this.state.savingScannedItems}
              onClick={() =>
                this.props.boxScanned(
                  boxDetails.type,
                  this.state.scannedBarcode
                )
              }
            >
              Save
            </Button>
          )}
          {/* <Button
                        onClick={() => this.props.handleScanDialogCancel()}
                    >
                        Cancel
                    </Button> */}
        </DialogActions>
      </Dialog>
    );
  }
}

export default ScanBoxDialog;
