import React from "react";
import PropTypes from "prop-types";
import { createMuiTheme, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch, Redirect } from "react-router-dom";

import Hidden from "@material-ui/core/Hidden";
import Navigator from "./Components/Navigator";
import Header from "./Components/Header";

import ViewBoxes from "./Components/ViewBoxes";
import NewOrder from "./Components/NewOrder";
import ViewOrders from "./Components/ViewOrders";
import TrackOrder from "./Components/TrackOrder";
import Customers from "./Components/Customers";
import Parts from "./Components/Parts";

let theme = createMuiTheme({

  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  palette: {
    primary: {
      main: "#232f3e"
    },
    secondary: {
      main: "#0958a5"
    }
  },
  shape: {
    borderRadius: 8
  }
});

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c"
      }
    },
    MuiButton: {
      label: {
        textTransform: "none"
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none"
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854"
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48
    }
  }
};

const drawerWidth = 256;

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  mainContent: {
    flex: 1,
    padding: "30px 36px 0",
    background: "#eaeff1"
  }
};

class App extends React.Component {
  state = {
    mobileOpen: false,

    routingPages: [
      {
        path: "/ui/newOrder",
        exact: "exact",
        component: NewOrder,
        admin: true
      },
      {
        path: "/ui/viewOrders",
        exact: "exact",
        component: ViewOrders,
        admin: true
      },
      {
        path: "/ui/trackOrder",
        exact: "exact",
        component: TrackOrder,
        admin: true
      },
      {
        path: "/ui/ViewBoxes/:orderId",
        exact: "exact",
        component: ViewBoxes,
        admin: true
      },
      {
        path: "/ui/customers",
        exact: "exact",
        component: Customers,
        admin: true
      },
      {
        path: "/ui/parts",
        exact: "exact",
        component: Parts,
        admin: true
      }
    ]
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <nav className={classes.drawer}>
            <Hidden smUp implementation="js">
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
              />
            </Hidden>
            <Hidden xsDown implementation="css">
              <Navigator PaperProps={{ style: { width: drawerWidth } }} />
            </Hidden>
          </nav>
          <div className={classes.appContent}>
            <Header onDrawerToggle={this.handleDrawerToggle} />
            <main className={classes.mainContent}>
              <Switch>
                <Route exact path="/">

                  <Redirect to="/ui/viewOrders" />
                </Route>
                {this.state.routingPages.map(rp => {
                  return (
                    <Route path={rp.path} exact component={rp.component} />
                  );
                })}
              </Switch>
            </main>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
