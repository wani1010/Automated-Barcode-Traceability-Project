import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  title: {
    flexGrow: 1,
    letterSpacing: 3,
    [theme.breakpoints.up("xs")]: {
      fontSize: 20,
      padding: 5
    },
    [theme.breakpoints.up("md")]: {
      fontSize: 30,
      padding: 20
    }
  }
});

function Header(props) {
  const { classes, onDrawerToggle } = props;

  return (
    <React.Fragment>
      <AppBar
        position="sticky"
        elevation={0}
        style={{
          backgroundColor: "primary"
        }}
      >
        <Toolbar>
          <Hidden smUp>
            <IconButton
              aria-label="Open drawer"
              onClick={onDrawerToggle}
              className={classes.menuButton}
              style={{
                color: "secondary"
              }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography
            variant="h4"
            className={classes.title}
          >
            Inventory Tracking System
          </Typography>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      />
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);
