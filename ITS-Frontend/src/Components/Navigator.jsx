import React, { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Add from "@material-ui/icons/AddBoxRounded";
import PageviewIcon from "@material-ui/icons/Pageview";
import { NavLink } from "react-router-dom";
import logo from "./CompanyLogo.png";
import PeopleIcon from "@material-ui/icons/People";
import BuildIcon from "@material-ui/icons/Build";

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 5,
    paddingBottom: 5,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "hrgba(255, 255, 255, 0.08)",
    },
  },
  itemCategory: {
    backgroundColor: "secondary",
    boxShadow: "0 -1px 0 secondary inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  header: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: "#0958a5",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "150px",
    flexShrink: 0,
    width: "100%",
    backgroundColor: "white",
    borderTop: "2px solid #0958a5",
  },
  logoLink: {
    fontSize: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    cursor: "pointer",
  },
  logoDivider: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class Navigator extends Component {
  state = {
    categories: [
      {
        id: "View Orders",
        icon: <VisibilityIcon />,
        route: "/ui/viewOrders",
        admin: true,
      },
      {
        id: "New Order",
        icon: <Add />,
        route: "/ui/newOrder",
        admin: true,
      },
      {
        id: "Track Order",
        icon: <PageviewIcon />,
        route: "/ui/trackOrder",
        admin: true,
      },
      {
        id: "Customers",
        icon: <PeopleIcon />,
        route: "/ui/customers",
        admin: true,
      },
      {
        id: "Parts",
        icon: <BuildIcon />,
        route: "/ui/parts",
        admin: true,
      },
    ],
  };

  render() {
    const { classes, ...other } = this.props;

    return (
      <Drawer variant="permanent" {...other}>
        <div className={classes.logoWrapper}>
          <img
            style={{ width: "70%" }}
            className={classes.logoImage}
            src={logo}
          />
        </div>

        <List disablePadding className={classes.root}>
          <ListItem
            className={clsx(classes.header)}
            style={{
              backgroundColor: "#232f3e",
            }}
          >
            <Grid
              container
              style={{
                width: "100%",
              }}
            >
              <Grid item xs={12} style={{ width: "100%" }} align="center">
                <Typography variant="h6">ITS</Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography variant="subtitle2">
                  @ BTech Project 2023-24
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider className={classes.profileDivider} />

          {this.state.categories.map(({ id, icon, route }) => (
            <React.Fragment key={id}>
              <ListItem
                button
                component={NavLink}
                to={route}
                className={classes.item}
                activeClassName={classes.itemActiveItem}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                  {id}
                </ListItemText>
              </ListItem>

              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
