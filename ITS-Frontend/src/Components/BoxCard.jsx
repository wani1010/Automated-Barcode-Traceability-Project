import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Clear as ClearIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { withStyles } from "@material-ui/styles";
import { Grid, Divider } from "@material-ui/core";
import Parts from "./Parts";

const styles = (theme) => ({
  nonClickableCard: {
    width: 200,
    height: 150,
    textAlign: "center",
    color: "secondary",
  },
  clickableCard: {
    width: 200,
    height: 150,
    textAlign: "center",
    color: "secondary",
    "&:hover": {
      backgroundColor: "rgba(192,192,192,0.3)",
    },
  },
  title: {
    fontSize: 12,
  },
});

class BoxCard extends Component {
  countNoOFPolytheneBags() {
    var numberOfPolytheneBags = 0;
    this.props.box.products.map(
      (pb) =>
        (numberOfPolytheneBags =
          numberOfPolytheneBags + Number(pb.noOfPolybags))
    );
    return numberOfPolytheneBags;
  }

  getSubContent(classes) {
    if (this.props.box) {
      var box = this.props.box;
      if (this.props.box.type === "BB") {
        return (
          <Grid item xs={12}>
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              style={{ fontSize: 13 }}
            >
              <strong>
                Total<br></br>Small boxes:{" "}
                {box.smallBoxes ? box.smallBoxes.length : 0}
              </strong>
            </Typography>
          </Grid>
        );
      } else if (this.props.box.type === "SB") {
        return (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              style={{ fontSize: 12 }}
            >
              <strong>Products: {box.products.length}</strong>
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              style={{ fontSize: 12 }}
            >
              <strong>Total Polybags: {this.countNoOFPolytheneBags()}</strong>
            </Typography>
          </Grid>
        );
      } else {
        return (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              style={{ paddingBottom: 0, fontSize: 12 }}
            >
              <strong>Polybags: {box.noOfPolybags}</strong>
            </Typography>
            <Typography
              variant="subtitle2"
              className={classes.title}
              color="textSecondary"
              style={{ paddingBottom: 0, fontSize: 12 }}
            >
              <strong>Quantity per bag: {box.quantityPerBag}</strong>
            </Typography>
            <Typography
              variant="subtitle2"
              className={classes.title}
              color="textSecondary"
              style={{ paddingBottom: 0, fontSize: 12 }}
            >
              <strong>
                total weight:{" "}
                {box.noOfPolybags * box.quantityPerBag * box.weight + "mg"}
              </strong>
            </Typography>
          </Grid>
        );
      }
    }
  }
  //   console.log(box.weight);
  onCardClicked = () => {
    if (
      this.props.box.type === "PD" &&
      (this.props.parentComponent === "NewOrder" ||
        this.props.parentComponent === "TrackOrder")
    )
      return;
    this.props.handleCardClicked(this.props.box);
  };

  getBackgroundColor = () => {
    var color = "white";
    if (this.props.box.type === "SB" && this.props.isSelected)
      color = "rgba(192,192,192,0.3)";

    console.log(color);
    console.log("isSelected: ", this.props.isSelected);
    return color;
  };
  render() {
    const { classes } = this.props;
    console.log("Correct Barcode: " + this.props.correctBarcode);
    return (
      <Card
        className={
          this.props.box.type === "PD" &&
          (this.props.parentComponent == "NewOrder" ||
            this.props.parentComponent == "TrackOrder")
            ? classes.nonClickableCard
            : classes.clickableCard
        }
        style={{ backgroundColor: this.getBackgroundColor() }}
        variant="outlined"
        onClick={() => this.onCardClicked()}
      >
        <CardContent style={{ padding: "0px", height: "100%" }}>
          <Grid container justify="space-between" alignItems="center">
            <Grid
              item
              style={{ marginLeft: 20, paddingTop: 5, paddingBottom: 5 }}
            >
              <Typography
                className={classes.title}
                color="textSecondary"
                style={{ padding: 3 }}
              >
                <strong>
                  {this.props.box.type === "PD"
                    ? "PRODUCT "
                    : this.props.box.type === "SB"
                    ? "SMALL BOX "
                    : "BIG BOX "}
                </strong>
              </Typography>
            </Grid>
            <Grid item>
              {this.props.parentComponent === "NewOrder" ? (
                <IconButton
                  style={{ fontSize: 20 }}
                  onClick={(e) => this.props.cardDelete(e, this.props.box)}
                >
                  <ClearIcon></ClearIcon>
                </IconButton>
              ) : undefined}
            </Grid>
          </Grid>
          <Divider light variant="middle"></Divider>

          <Grid
            container
            style={{ height: "70%" }}
            justify="space-between"
            alignContent="space-between"
          >
            <Grid item xs={12} style={{ paddingLeft: 3, paddingRight: 3 }}>
              {this.props.box.type === "PD" ? (
                <Typography
                  variant="h5"
                  color="secondary"
                  style={{ lineHeight: 0.7, marginBottom: 8, marginTop: 3 }}
                >
                  <strong style={{ fontSize: 14 }}>
                    {this.props.box.partNo}
                  </strong>
                </Typography>
              ) : (
                <Typography variant="h5" color="secondary">
                  <strong>{this.props.box.name}</strong>
                </Typography>
              )}
            </Grid>

            {this.getSubContent(classes)}
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{
                  paddingTop: 3,
                  fontSize: 14,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {this.props.box.type !== "PD" ? (
                  <strong>Packed</strong>
                ) : (
                  <strong>Scanned</strong>
                )}
                {this.props.box.isLinked ? (
                  <CheckCircleIcon
                    style={{
                      color: "green",
                      height: 18,
                      width: 18,
                      marginLeft: 7,
                      alignSelf: "center",
                    }}
                  ></CheckCircleIcon>
                ) : (
                  <CancelIcon
                    style={{
                      color: "red",
                      height: 18,
                      width: 18,
                      marginLeft: 7,
                      alignSelf: "center",
                    }}
                  ></CancelIcon>
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(BoxCard);
