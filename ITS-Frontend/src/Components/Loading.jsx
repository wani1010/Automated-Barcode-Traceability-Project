import React, { Component } from "react";
import { Backdrop, CircularProgress, withStyles } from "@material-ui/core";

const styles = theme => ({

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
});

class Loading extends Component {
  state = {};
  render() {
    const { classes } = this.props

    return (
        <Backdrop open={this.props.loading} className={classes.backdrop}>
          <span style={{ marginRight: 10 }}>{this.props.loadingMsg}</span>
          <CircularProgress
            style={{
              color: "inherit",
              height: 80,
              width: 80,
              marginLeft: "10%"
            }}
          />
        </Backdrop>
    );
  }
}

export default withStyles(styles)(Loading);
