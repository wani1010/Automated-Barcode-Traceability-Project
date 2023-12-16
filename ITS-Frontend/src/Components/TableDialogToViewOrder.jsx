import React, { Component } from "react";
import {
    Grid,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    DialogActions,
    Button
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/ClearRounded";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DownloadIcon from "@material-ui/icons/GetAppRounded";
import { makeExcel } from "./Excel";
import { Tooltip, Fab } from "@material-ui/core";

class TableDialogToViewOrder extends Component {
    state = {
        orderTableHeading: ["Sr No.", "Description", "Size","Fluid Control's Part No.", "Qty in Nos.", "Qty in small box (Products * Bags)", "Small Box", "Big Box"],
        products: [],
        order: {}
    };

    componentDidMount() {
        var { order } = this.state
        order = JSON.parse(JSON.stringify(this.props.order))
        var products = this.getProducts(order);
        this.setState({ products, order });
    }

    close = () => {
        console.log("In the close function");
        this.props.handleDialogClose();
    }

    getProducts = (order) => {

        console.log('Order in the function:', order);
        var tempProducts = []
        order.bigBoxes.forEach(bb => {
            console.log("Big Box array : ", bb);
            bb.smallBoxes.forEach(sb => {
                console.log("Small Box array : ", sb);

                sb.products.forEach(product => {
                    console.log("Product array : ", product);

                    var index = tempProducts.findIndex(prod => prod.partNo === product.partNo)
                    if (index == -1) {
                        var newProduct = {
                            name: product.name,
                            size: product.size,
                            partNo: product.partNo,
      
                        
                            totalQuantity: product.quantityPerBag * product.noOfPolybags,
                            multipleDetails: [{
                                qtyInSmallBox: (product.noOfPolybags * product.quantityPerBag) + ` (${product.quantityPerBag}X${product.noOfPolybags})`,
                                smallBox: sb.name,
                                bigBox: bb.name
                            }]
                        }
                        tempProducts.push(newProduct);
                    }
                    else {
                        tempProducts[index].totalQuantity = tempProducts[index].totalQuantity + (product.quantityPerBag * product.noOfPolybags)
                        tempProducts[index].multipleDetails.push({
                            qtyInSmallBox: (product.noOfPolybags * product.quantityPerBag) + ` (${product.quantityPerBag}X${product.noOfPolybags})`,
                            smallBox: sb.name,
                            bigBox: bb.name
                        })
                    }

                })
            })
        })
        return tempProducts
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.setDialog}
                    maxWidth='lg'
                >
                    <DialogTitle>
                        <Grid
                            container
                            justify="space-between"
                            alignItems="center"
                            style={{ width: "100%" }}
                        >
                            <Grid item xs="auto">
                                <Typography variant="h6" style={{ color: "secondary" }}>
                                    <strong style={{ fontSize: 25 }}>{"Order Details  And Total Order Weight "+this.state.order.totalWeight/1000+"KG"}</strong> 
                                     
                                </Typography>
                            </Grid>
                            <Grid item xs="auto">
                                <IconButton
                                    onClick={() => {
                                        this.close();
                                    }}
                                >
                                    <ClearIcon></ClearIcon>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <Divider light />
                    <DialogContent>
                        <Paper style={{ padding: 20 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {this.state.orderTableHeading.map(heading => (
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                <Typography
                                                    variant="body1"
                                                    color="textPrimary"
                                                    style={{ fontWeight: "bold" }}
                                                >
                                                    {heading}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.products.map((product, index) => (
                                        <TableRow>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {index + 1}
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.name}
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.size}
                                            </TableCell>
                                            
                                            
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.partNo}
                                            </TableCell>
                                             
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.totalQuantity}
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.multipleDetails.map((detail, idx) => (
                                                    <TableRow>
                                                        <TableCell>
                                                            {detail.qtyInSmallBox}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.multipleDetails.map((detail, idx) => (
                                                    <TableRow>
                                                        <TableCell>
                                                            {detail.smallBox}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableCell>
                                            <TableCell style={{ border: "1px solid #D3D3D3" }}>
                                                {product.multipleDetails.map((detail, idx) => (
                                                    <TableRow>
                                                        <TableCell>
                                                            {detail.bigBox}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    
                                    ))}

                                </TableBody>
                            </Table>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        <Tooltip title="Download Excel Report" arrow>
                            <Fab
                                variant="contained"
                                onClick={() => {
                                    var { order, products } = this.state
                                    console.log("Order from tableDialog : ", order) 
                                    makeExcel(order, products )
                                }}
                                color="secondary"
                                autoFocus
                                style={{ backgroundColor: "secondary", color: "white", width: 120, marginRight: 15 }}
                            >
                                <DownloadIcon style={{ marginRight: 3 }}></DownloadIcon>
                                REPORT
                            </Fab>
                        </Tooltip>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default TableDialogToViewOrder;