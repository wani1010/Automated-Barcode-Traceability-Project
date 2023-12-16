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
import Loading from "./Loading";
import axios from "axios";
import config from "./config";

class ScanProductDialog extends Component {
  state = {
    selectedProduct: {},
    isScanning: true,
    productBarcodeArr: [],
    scannedBarcode: "",
    errMsg: "",
    savingScannedItems: false,
  };

  componentDidMount() {
    console.log("Selected Product: ", this.props.selectedProduct);
    this.setState({
      selectedProduct: this.props.selectedProduct,
    });

    document.body.addEventListener("keypress", this.onKeyScanned);
  }

  onKeyScanned = (e) => {
    var { productBarcodeArr, isScanning, errMsg, scannedBarcode } = this.state;
    if (e.key === "Enter") {
      if (
        scannedBarcode !== "" &&
        this.props.checkBarcode(scannedBarcode, this.props.correctBarcode) &&
        !productBarcodeArr.includes(scannedBarcode)
      ) {
        errMsg = "";
        console.log(scannedBarcode);
        productBarcodeArr.push(scannedBarcode);
        if (
          productBarcodeArr.length === this.state.selectedProduct.noOfPolybags
        ) {
          isScanning = false;
          document.body.removeEventListener("keypress", this.onKeyScanned);
        }

        this.setState({ productBarcodeArr, isScanning });
      } else {
        errMsg = "Invalid! Please scan a valid barcode.";
      }
      scannedBarcode = "";
      this.setState({ errMsg });
    } else {
      /**
       *  To be uncommented while deployment. Commented for testing
       */
      // scannedBarcode += e.key
    }
    this.setState({
      scannedBarcode,
    });
  };

  // productScanned = () => {
  //     //While Sanning if the Barcode contains "EX" at the beginning then also push it to orders.extraCodes
  //     var { isScanning, productBarcodeArr, scannedBarcode, errMsg } = this.state
  //     if (scannedBarcode !== "" && !productBarcodeArr.includes(scannedBarcode)) {
  //         errMsg = ""

  //         productBarcodeArr.push(scannedBarcode)
  //         scannedBarcode = ""
  //         if (productBarcodeArr.length === this.state.selectedProduct.noOfPolybags) {
  //             isScanning = false
  //         }
  //     }
  //     else {
  //         errMsg = "Invalid! Please scan a valid barcode."
  //     }
  //     this.setState({
  //         productBarcodeArr,
  //         errMsg,
  //         isScanning,
  //         scannedBarcode
  //     })
  // }

  productScannedSave = () => {
    var { productBarcodeArr } = this.state;
    this.setState({
      savingScannedItems: true,
    });
    var postData = {
      orderId: this.props.orderId,
      bigBoxId: this.props.bigBoxId,
      smallBoxId: this.props.smallBoxId,
      productId: this.props.selectedProduct._id,
      scannedBarcodes: productBarcodeArr,
    };
    axios
      .put(config.baseUrl + "/link/product", postData)
      .then((result) => {
        // this.props.handleScanDialogCancel()
        console.log("result data: ", result.data.data);
        this.setState({ savingScannedItems: false });

        this.props.updateOrder("PD", result.data.data);
        this.props.allPolyBagsScanned();
      })
      .catch((err) => {
        console.log("Err: ", err);
      });
  };

  render() {
    console.log("Scan Correct Barcode is: " + this.props.correctBarcode);
    return (
      <Dialog maxWidth="md" fullWidth open={this.props.setDialog}>
        <Loading
          loading={this.state.savingScannedItems}
          loadingMsg="Saving Scanned Products"
        ></Loading>
        <DialogTitle>
          <div>
            <Typography variant="h6" style={{ color: "secondary" }}>
              {"Packaging"}
            </Typography>
          </div>
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
                {"Product Number: "}
                <span style={{ fontWeight: "bold" }}>
                  {this.state.selectedProduct.productNo}
                </span>
              </Typography>
              <Typography variant="subtitle1">
                {"Product Name: "}
                <span style={{ fontWeight: "bold" }}>
                  {this.state.selectedProduct.name}
                </span>
              </Typography>
              <Typography variant="subtitle1">
                {"Total Number of polybags: "}
                <span style={{ fontWeight: "bold" }}>
                  {this.state.selectedProduct.noOfPolybags}
                </span>
              </Typography>
              <Typography variant="subtitle1">
                {"Quantity per polybag: "}
                <span style={{ fontWeight: "bold" }}>
                  {this.state.selectedProduct.quantityPerBag}
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
              {this.state.productBarcodeArr.map((code) => (
                <div>{code}</div>
              ))}
            </Grid>
            <Grid item container xs={4} spacing={1}>
              <Grid item xs={12} container justify="center">
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
                  {this.state.isScanning ? (
                    <span style={{ verticalAlign: "middle" }}>
                      {"Scanning... "}
                      <br></br>
                      <span style={{ verticalAlign: "middle" }}>
                        {"Polybags Scanned - "}
                      </span>
                      <span
                        style={{
                          letterSpacing: 5,
                          fontSize: 25,
                          fontWeight: "bold",
                          verticalAlign: "middle",
                        }}
                      >{`${this.state.productBarcodeArr.length}/${this.state.selectedProduct.noOfPolybags}`}</span>
                    </span>
                  ) : (
                    `All Polybags Scanned.`
                  )}
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
          {this.state.isScanning ? //     variant="contained" //     color="secondary" // <Button
          //     onClick={() => this.productScanned()}
          // >
          //     Scan
          // </Button>
          undefined : (
            <Button
              color="secondary"
              variant="contained"
              disabled={this.state.savingScannedItems}
              onClick={() => this.productScannedSave()}
            >
              Save
            </Button>
          )}
          <Button onClick={() => this.props.handleScanDialogCancel()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ScanProductDialog;
