import React, { Component } from "react";
import { Grid, Paper } from "@material-ui/core";
import BoxCard from "./BoxCard";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Draggable from "react-draggable";
import AddBoxDialog from "./AddBoxDialog";
import { withStyles } from "@material-ui/styles";
import { Typography, TextField } from "@material-ui/core";
import ScanProductDialog from "./ScanProductDialog";
import axios from "axios";
import Loading from "./Loading";
import config from "./config";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import ScanBoxDialog from "./ScanBoxDialog";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const styles = (theme) => ({
  itemsPaper: {
    padding: 10,
    width: "100%",
    height: "100%",
  },
});

function PaperComponentSmallBoxDialog(props) {
  return (
    <Draggable
      handle="#smallBoxDialog"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
function PaperComponentProductDialog(props) {
  return (
    <Draggable
      handle="#productDialog"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
class BigBoxes extends Component {
  state = {
    openBoxDialog: false,
    openProductDialog: false,
    selectedBigBox: {
      smallBoxes: [],
    },
    selectedSmallBox: {
      products: [],
    },
    scanProductDialogOpen: false,
    selectedProduct: {},
    addDialogOpen: false,
    selectedItemType: "",
    smallBoxScannedBarcode: "",
    bigBoxScannedBarcode: "",
    loading: false,
    setScanBoxDialog: false,
    boxToBeScanned: "",
    parts: [],
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.isUpdate) {
      var { selectedBigBox, selectedSmallBox, selectedProduct } = this.state;
      selectedBigBox = this.props.order.bigBoxes.find(
        (bb) => bb._id === selectedBigBox._id
      );
      // console.log("aejfijwefnjkwefnkjwnfo ijQ EJFOIQEJF OQEJFOI EJFJI: ", selectedBigBox);
      if (this.props.updateFor === "SB")
        selectedSmallBox = selectedBigBox.smallBoxes.find(
          (sb) => sb._id === selectedSmallBox._id
        );
      else if (this.props.updateFor === "PD") {
        selectedSmallBox = selectedBigBox.smallBoxes.find(
          (sb) => sb._id === selectedSmallBox._id
        );
        selectedProduct = selectedSmallBox.products.find(
          (pd) => pd._id === selectedProduct._id
        );
      }

      this.setState({
        selectedBigBox,
        selectedSmallBox,
        selectedProduct,
      });
    }
  }

  handleCardDelete = (e, box) => {
    e.stopPropagation();

    if (box.type === "BB") {
      if (window.confirm("Are you sure you want to delete this item?")) {
        var { selectedBigBox } = this.state;
        this.props.order.bigBoxes.map((bb) =>
          bb.name === box.name ? (selectedBigBox = bb) : undefined
        );
        selectedBigBox.smallBoxes = [];
        this.setState(selectedBigBox);

        this.props.order.bigBoxes = this.props.order.bigBoxes.filter(
          (bigBox) => bigBox.name != box.name
        );
      }
    } else if (box.type === "SB") {
      if (window.confirm("Are you sure you want to delete this item?")) {
        var { selectedBigBox } = this.state;
        var { selectedSmallBox } = this.state;
        selectedBigBox.smallBoxes.map((sb) =>
          sb.name === box.name ? (selectedSmallBox = sb) : undefined
        );
        selectedSmallBox.products = [];

        const filteredSmallBoxes = selectedBigBox.smallBoxes.filter(
          (smallBox) => smallBox.name !== box.name
        );
        selectedBigBox.smallBoxes = filteredSmallBoxes;

        this.setState({ selectedBigBox, selectedSmallBox });
      }
    } else if (box.type === "PD") {
      if (window.confirm("Are you sure you want to delete this item?")) {
        var { selectedSmallBox, selectedBigBox } = this.state;
        const filteredProducts = selectedSmallBox.products.filter(
          (product) => product.name !== box.name
        );
        selectedSmallBox.products = filteredProducts;
        this.setState({ selectedSmallBox, selectedBigBox });
        selectedBigBox.bbWeight =
          selectedBigBox.bbWeight -
          box.weight * box.noOfPolybags * box.quantityPerBag;
      }
    }
  };

  checkInnerProductsScanned = (box) => {
    for (let product in box.products) {
      if (!box.products[product].isLinked) {
        return false;
      }
    }
    return true;
  };

  checkInnerSmallBoxesScanned = (box) => {
    for (let smallBox in box.smallBoxes) {
      if (!box.smallBoxes[smallBox].isLinked) {
        return false;
      }
    }
    return true;
  };

  handleBoxCardClicked = (box) => {
    console.log("Selected box's type: ", box.type);
    if (box.type === "BB") {
      this.setState({
        selectedBigBox: box,
        selectedSmallBox: box.smallBoxes[0],
        openBoxDialog: true,
      });
      if (this.checkInnerSmallBoxesScanned(box) && box.isLinked === false) {
        console.log("BB is linked: ", this.state.selectedBigBox.isLinked);
        this.setState({ boxToBeScanned: "BB", setScanBoxDialog: true });
      }
    } else if (box.type === "SB") {
      this.setState({ selectedSmallBox: box });
      if (this.checkInnerProductsScanned(box) && box.isLinked === false) {
        this.setState({ boxToBeScanned: "SB", setScanBoxDialog: true });
      }
    } else {
      this.setState({ selectedProduct: box, scanProductDialogOpen: true });
    }
  };

  handleAddDialogSave = (newItem) => {
    var { selectedBigBox } = this.state;
    var { selectedSmallBox, selectedSmallBox } = this.state;

    if (newItem.type === "SB" && selectedBigBox) {
      console.log(newItem);
      newItem.products = [];
      var isredundant = false;
      selectedBigBox.smallBoxes.forEach((sb) => {
        if (sb.name === newItem.name) {
          alert("Small Box with the same name is already present!");
          isredundant = true;
          return;
        }
      });
      if (!isredundant) selectedBigBox.smallBoxes.push(newItem);

      if (selectedBigBox.smallBoxes.length == 1) selectedSmallBox = newItem;
    } else if (newItem.type === "PD" && selectedSmallBox) {
      selectedSmallBox.products.push(newItem);
      selectedBigBox.bbWeight = Number(
        selectedBigBox.bbWeight +
          newItem.weight * newItem.noOfPolybags * newItem.quantityPerBag
      ); // abhi
      console.log("item check:", newItem);
      console.log("weight check ", selectedBigBox);
    }

    this.setState({
      selectedBigBox,
      selectedSmallBox,
      addDialogOpen: false,
    });
  };

  handleAddDialogClose = () => {
    this.setState({
      addDialogOpen: false,
    });
  };

  handleAddDialogOpen = (itemType) => {
    this.setState(
      {
        selectedItemType: itemType,
      },
      () => {
        this.fetchParts();
        this.setState({
          addDialogOpen: true,
        });
      }
    );
  };
  fetchParts = () => {
    var { parts } = this.state;
    axios
      .get(config.baseUrl + "/parts")
      .then((result) => {
        parts = result.data.data;
        this.setState({ parts });
      })
      .catch((err) => {
        console.log("Error fetching parts: ", err);
      });
  };
  smallBoxScannedSave = (barcode) => {
    var { smallBoxScannedBarcode, boxToBeScanned, setScanBoxDialog } =
      this.state;
    if (barcode !== "") {
      // var isAllowedToScan = true;
      // for (let pd in this.state.selectedSmallBox.products) {
      //     if (!this.state.selectedSmallBox.products[pd].isLinked) {
      //         isAllowedToScan = false
      //         break;
      //     }
      // }
      // if (isAllowedToScan) {

      var postData = {
        orderId: this.props.order._id,
        bigBoxId: this.state.selectedBigBox._id,
        smallBoxId: this.state.selectedSmallBox._id,
        scannedBarcode: barcode,
      };
      this.setState({ loading: false });
      axios
        .put(config.baseUrl + "/link/smallBox", postData)
        .then((result) => {
          boxToBeScanned = "BB";

          for (let box in this.state.selectedBigBox.smallBoxes) {
            if (
              !this.state.selectedBigBox.smallBoxes[box].isLinked &&
              this.state.selectedBigBox.smallBoxes[box]._id !=
                this.state.selectedSmallBox._id
            ) {
              boxToBeScanned = "SB";
              setScanBoxDialog = false;
              // isAllowedToScan = false
              break;
            }
          }
          this.setState({
            loading: false,
            boxToBeScanned,
            setScanBoxDialog: false,
          });
          if (boxToBeScanned == "BB") {
            this.setState({ setScanBoxDialog: true });
          }
          // this.setState({ smallBoxScannedBarcode: "", loading: false })
          this.props.updateOrder("SB", result.data.data);
        })
        .catch((err) => {
          console.log("Err: ", err);
          this.setState({ loading: false });
        });

      // }
    }
  };
  bigBoxScannedSave = (barcode) => {
    var { bigBoxScannedBarcode, boxToBeScanned } = this.state;
    if (barcode !== "") {
      // var isAllowedToScan = true;
      // for (let box in this.state.selectedBigBox.smallBoxes) {
      //     if (!this.state.selectedBigBox.smallBoxes[box].isLinked) {
      //         isAllowedToScan = false
      //         break;
      //     }
      // }
      // console.log(isAllowedToScan);
      // if (isAllowedToScan) {

      var postData = {
        orderId: this.props.order._id,
        bigBoxId: this.state.selectedBigBox._id,
        scannedBarcode: barcode,
      };
      this.setState({ loading: false });
      axios
        .put(config.baseUrl + "/link/bigBox", postData)
        .then((result) => {
          this.setState({ loading: false, setScanBoxDialog: false });

          // this.setState({ bigBoxScannedBarcode: "", loading: false })
          this.props.updateOrder("BB", result.data.data);
        })
        .catch((err) => {
          console.log("Err: ", err);
          this.setState({ loading: false });
        });

      // }
    }
  };
  handleScanDialogCancel = () => {
    this.setState({ scanProductDialogOpen: false, selectedProduct: {} });
  };
  allPolyBagsScanned = () => {
    var { selectedSmallBox, selectedProduct, setScanBoxDialog } = this.state;
    setScanBoxDialog = true;
    this.handleScanDialogCancel();
    for (let product in selectedSmallBox.products) {
      if (!selectedSmallBox.products[product].isLinked) {
        // console.log("sdfgsgs: ", selectedSmallBox[product]);
        setScanBoxDialog = false;
        break;
      }
    }
    this.setState({
      boxToBeScanned: "SB",
      setScanBoxDialog,
    });
    console.log(this.state.selectedSmallBox);
  };

  boxScanned = (type, barcode) => {
    if (type == "BB") {
      this.bigBoxScannedSave(barcode);
    } else {
      this.smallBoxScannedSave(barcode);
    }
  };
  boxScannedDialogClose = () => {
    this.setState({
      setScanBoxDialog: false,
    });
  };

  checkBarcode = (barcode, correctBarcode) => {
    var order = this.props.order;

    if (order.barCode !== barcode.substr(0, barcode.indexOf("-"))) {
      console.log(
        "ERROR: barcode not for this order ",
        barcode.slice(0, barcode.lastIndexOf("-"))
      );
      return false;
    }

    // for (let bbItr in order.bigBoxes) {
    //   if (barcode === order.bigBoxes[bbItr].barCode) {
    //     console.log("ERROR: ", order.bigBoxes[bbItr]);

    //     return false;
    //   }

    //   for (let sbItr in order.bigBoxes[bbItr].smallBoxes) {
    //     if (barcode === order.bigBoxes[bbItr].smallBoxes[sbItr].barCode) {
    //       console.log("ERROR: ", order.bigBoxes[bbItr].smallBoxes[sbItr]);
    //       return false;
    //     }

    //     for (let pdItr in order.bigBoxes[bbItr].smallBoxes[sbItr].products) {
    //       if (
    //         order.bigBoxes[bbItr].smallBoxes[sbItr].products[
    //           pdItr
    //         ].barCodes.includes(barcode)
    //       ) {
    //         console.log(
    //           "ERROR: ",
    //           order.bigBoxes[bbItr].smallBoxes[sbItr].products[pdItr]
    //         );

    //         return false;
    //       }
    //     }
    //   }
    // }
    let isValid = false;
    console.log(`Scan returned -----> ${isValid}`);
    if (barcode.search("PB") !== -1) {
      isValid = barcode.slice(0, barcode.lastIndexOf("-")) === correctBarcode;
      let barcodePolybagNo = barcode.slice(barcode.lastIndexOf("-") + 3);
      console.log("BARCODE POLYBAG NO: ", barcodePolybagNo);
      isValid =
        isValid &&
        barcodePolybagNo <= this.state.selectedProduct.noOfPolybags &&
        barcodePolybagNo > 0;
    } else if (
      this.state.boxToBeScanned === "BB" ||
      this.state.boxToBeScanned === "SB" ||
      this.state.selectedProduct.noOfPolybags === 1
    ) {
      isValid = barcode === correctBarcode;
    }
    return isValid;
  };

  render() {
    const { classes } = this.props;
    let correctBarcode = "";
    return (
      <React.Fragment>
        <Loading loading={this.state.loading}></Loading>

        {this.props.order && this.props.order.bigBoxes ? (
          <>
            {!this.props.order.bigBoxes.length &&
            this.props.showCustomerDetails ? (
              <Typography color="textSecondary">
                Please add Big Boxes.
              </Typography>
            ) : (
              <Grid container spacing={4}>
                {this.props.order.bigBoxes.map((bb, bbIdx) => {
                  let correctBarcode = `${this.props.order.barCode}-BB${
                    bbIdx + 1
                  }`;
                  return (
                    <Grid item key={bbIdx}>
                      <BoxCard
                        parentComponent={this.props.parentComponent}
                        correctBarcode={correctBarcode}
                        box={bb}
                        cardDelete={this.handleCardDelete}
                        handleCardClicked={this.handleBoxCardClicked}
                      ></BoxCard>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            <Dialog
              maxWidth="xl"
              fullWidth
              PaperComponent={PaperComponentSmallBoxDialog}
              open={this.state.openBoxDialog}
              onClose={() => {
                this.setState({ openBoxDialog: false });
              }}
            >
              <DialogTitle>
                <Grid
                  container
                  justify="space-between"
                  alignItems="center"
                  style={{ width: "100%" }}
                >
                  <Typography variant="h6" style={{ color: "secondary" }}>
                    {`Big Box:`}
                    <strong>{` ${this.state.selectedBigBox.name}`}</strong>
                  </Typography>
                </Grid>
              </DialogTitle>
              <DialogContent
                style={{
                  height: "90vh",
                  width: "100%",
                  padding: 0,
                  paddingLeft: 15,
                  overflow: "hidden",
                }}
              >
                <Grid
                  container
                  style={{ width: "100%", height: "100%" }}
                  spacing={2}
                >
                  <Grid item xs={6} style={{ width: "100%", height: "100%" }}>
                    <Paper className={classes.itemsPaper}>
                      <Grid container justify="space-between">
                        {this.state.selectedBigBox.smallBoxes.length === 0 ? (
                          <Typography color="textSecondary">
                            No small boxes to display
                          </Typography>
                        ) : (
                          <Grid item>
                            <Typography
                              variant="subtitle1"
                              style={{
                                letterSpacing: "1px",
                                fontSize: "16px",
                                marginBottom: "10px",
                              }}
                            >
                              Small Boxes
                            </Typography>
                          </Grid>
                        )}
                        <Grid item>
                          {this.props.parentComponent === "NewOrder" ? (
                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                backgroundColor: "#0958a5",
                                fontSize: 15,
                                color: "#FFFFFF",
                              }}
                              onClick={() => this.handleAddDialogOpen("SB")}
                            >
                              <span>ADD</span>
                            </Button>
                          ) : undefined}
                        </Grid>
                      </Grid>
                      <Grid container spacing={3} style={{ marginTop: 7 }}>
                        {this.state.selectedBigBox.smallBoxes.map(
                          (sb, smIdx) => {
                            let correctBarcode = `${
                              this.props.order.barCode
                            }-BB${this.state.selectedBigBox.boxNo}-SB${
                              smIdx + 1
                            }`;
                            var isSelected =
                              sb.name === this.state.selectedSmallBox.name
                                ? true
                                : false;
                            return (
                              <Grid item key={smIdx}>
                                <BoxCard
                                  isSelected={isSelected}
                                  correctBarcode={correctBarcode}
                                  parentComponent={this.props.parentComponent}
                                  box={sb}
                                  cardDelete={this.handleCardDelete}
                                  handleCardClicked={this.handleBoxCardClicked}
                                ></BoxCard>
                              </Grid>
                            );
                          }
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                  {this.state.selectedBigBox.smallBoxes.length != 0 ? (
                    <Grid item xs={6}>
                      {this.state.selectedSmallBox ? (
                        <Paper
                          className={classes.itemsPaper}
                          style={{
                            width: "100%",
                            height: "200",
                            position: "relative",
                          }}
                        >
                          <Grid container justify="space-between">
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                style={{
                                  letterSpacing: "1px",
                                  fontSize: "16px",
                                  marginBottom: "10px",
                                }}
                              >
                                {this.state.selectedSmallBox.products.length ===
                                0 ? (
                                  <Typography color="textSecondary">
                                    No products to display in{" "}
                                    {this.state.selectedSmallBox.name}
                                  </Typography>
                                ) : (
                                  <Typography>
                                    Products in{" "}
                                    {this.state.selectedSmallBox.name}
                                  </Typography>
                                )}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {this.props.parentComponent === "NewOrder" ? (
                                <Button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    backgroundColor: "#0958a5",
                                    fontSize: 15,
                                    color: "#FFFFFF",
                                  }}
                                  onClick={() => this.handleAddDialogOpen("PD")}
                                >
                                  <span>ADD</span>
                                </Button>
                              ) : undefined}
                            </Grid>
                          </Grid>

                          <Grid container spacing={3} style={{ marginTop: 7 }}>
                            {this.state.selectedSmallBox.products.map(
                              (pd, pdIdx) => {
                                let correctBarcode = `${
                                  this.props.order.barCode
                                }-BB${this.state.selectedBigBox.boxNo}-SB${
                                  this.state.selectedSmallBox.boxNo
                                }-P${pdIdx + 1}`;
                                return (
                                  <Grid item key={pdIdx}>
                                    <BoxCard
                                      parentComponent={
                                        this.props.parentComponent
                                      }
                                      correctBarcode={correctBarcode}
                                      box={pd}
                                      cardDelete={this.handleCardDelete}
                                      handleCardClicked={
                                        this.handleBoxCardClicked
                                      }
                                    ></BoxCard>
                                  </Grid>
                                );
                              }
                            )}
                          </Grid>
                          {this.props.parentComponent !== "NewOrder" ? (
                            <Grid
                              container
                              style={{ position: "absolute", bottom: 0 }}
                              justify="center"
                              alignItems="center"
                              spacing={2}
                            >
                              <Grid item>
                                {this.state.selectedSmallBox.isLinked ? (
                                  <CheckOutlineIcon
                                    style={{
                                      color: "green",
                                      height: 40,
                                      width: 40,
                                    }}
                                  ></CheckOutlineIcon>
                                ) : (
                                  <ErrorOutlineIcon
                                    style={{
                                      color: "red",
                                      height: 40,
                                      width: 40,
                                    }}
                                  ></ErrorOutlineIcon>
                                )}
                              </Grid>
                              <Grid item>
                                {this.state.selectedSmallBox.isLinked
                                  ? "THIS SMALL BOX IS PACKED AND SCANNED."
                                  : "SMALL BOX NOT PACKED YET."}
                              </Grid>
                            </Grid>
                          ) : undefined}
                        </Paper>
                      ) : undefined}
                    </Grid>
                  ) : undefined}
                </Grid>
              </DialogContent>
              <DialogActions>
                {this.props.parentComponent !== "NewOrder" ? (
                  <Grid
                    container
                    style={{ position: "absolute", bottom: 0, padding: 10 }}
                    justify="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      {this.state.selectedBigBox.isLinked ? (
                        <CheckOutlineIcon
                          style={{
                            color: "green",
                            height: 40,
                            width: 40,
                          }}
                        ></CheckOutlineIcon>
                      ) : (
                        <ErrorOutlineIcon
                          style={{
                            color: "red",
                            height: 40,
                            width: 40,
                          }}
                        ></ErrorOutlineIcon>
                      )}
                    </Grid>
                    <Grid item>
                      {this.state.selectedBigBox.isLinked
                        ? "THIS BIG BOX IS PACKED AND SCANNED."
                        : "BIG BOX NOT PACKED YET."}
                    </Grid>
                  </Grid>
                ) : undefined}
                <Button
                  onClick={() => {
                    this.setState({ openBoxDialog: false });
                  }}
                >
                  Ok
                </Button>
              </DialogActions>
            </Dialog>

            {(this.state.selectedItemType === "SB" ||
              this.state.selectedItemType === "PD") &&
            this.state.addDialogOpen ? (
              <AddBoxDialog
                type={this.state.selectedItemType}
                setDialog={this.state.addDialogOpen}
                handleItemCancel={this.handleAddDialogClose}
                handleItemSave={this.handleAddDialogSave}
                parts={this.state.parts}
              ></AddBoxDialog>
            ) : undefined}

            {this.state.scanProductDialogOpen &&
            !this.state.selectedProduct.isLinked &&
            this.props.parentComponent !== "TrackOrder"
              ? ((correctBarcode = `${this.props.order.barCode}-BB${this.state.selectedBigBox.boxNo}-SB${this.state.selectedSmallBox.boxNo}-P${this.state.selectedProduct.productNo}`),
                (
                  <ScanProductDialog
                    setDialog={this.state.scanProductDialogOpen}
                    selectedProduct={this.state.selectedProduct}
                    orderId={this.props.order._id}
                    bigBoxId={this.state.selectedBigBox._id}
                    smallBoxId={this.state.selectedSmallBox._id}
                    updateOrder={this.props.updateOrder}
                    handleScanDialogCancel={this.handleScanDialogCancel}
                    allPolyBagsScanned={this.allPolyBagsScanned}
                    checkBarcode={this.checkBarcode}
                    correctBarcode={correctBarcode}
                  ></ScanProductDialog>
                ))
              : undefined}
            {this.state.setScanBoxDialog
              ? ((correctBarcode =
                  this.state.boxToBeScanned === "BB"
                    ? `${this.props.order.barCode}-BB${this.state.selectedBigBox.boxNo}`
                    : `${this.props.order.barCode}-BB${this.state.selectedBigBox.boxNo}-SB${this.state.selectedSmallBox.boxNo}`),
                (
                  <ScanBoxDialog
                    setDialog={this.state.setScanBoxDialog}
                    boxScanned={this.boxScanned}
                    orderId={this.props.order._id}
                    boxDetails={
                      this.state.boxToBeScanned === "SB"
                        ? this.state.selectedSmallBox
                        : this.state.selectedBigBox
                    }
                    onClose={this.boxScannedDialogClose}
                    checkBarcode={this.checkBarcode}
                    correctBarcode={correctBarcode}
                  ></ScanBoxDialog>
                ))
              : undefined}
          </>
        ) : undefined}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(BigBoxes);
