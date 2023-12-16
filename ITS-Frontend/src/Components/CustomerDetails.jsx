import React, { Component } from "react";
import { Paper, Typography } from "@material-ui/core";

class CustomerDetails extends Component {
    state = {}
    render() {
        return (
            <Paper style={{ marginTop: 10, marginBottom: 20, height: 120 }}>
                <br></br>
                <br></br>
                <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 1, textAlign: "center", marginLeft: "2%" }}
                >
                    
                    Customer Name: {this.props.custName}
                   
                    {
                        this.props.parentComponent != "NewOrder" ? (
                            <div style={{ marginTop: "-2%" }}>
                                Total number of orders: {this.props.noOfOrders}
                            </div>
                        ) : (undefined)
                    }
                </Typography>
                <br></br>
                <br></br>
                <br></br>
            </Paper>
        );
    }
}

export default CustomerDetails;