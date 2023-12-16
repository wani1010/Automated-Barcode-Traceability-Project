import React, { Component } from "react";
import {
    Grid,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    Fab,
    Divider,
    InputAdornment,
    DialogContent,
    TextField,
    DialogActions,
    Button
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import ClearIcon from "@material-ui/icons/ClearRounded";
import axios from "axios";
import config from "./config";



const styles = theme => ({
    fabAdd: {
        position: "fixed",
        color: "white",

        [theme.breakpoints.up("xs")]: {
            bottom: theme.spacing(3),
            right: theme.spacing(3)
        },

        [theme.breakpoints.up("md")]: {
            bottom: theme.spacing(5),
            right: theme.spacing(10)
        }
    }
});


class AddBoxDialog extends Component {

    state = {
        newBox: {
            description: "",
            name: "",
            type: this.props.type === "PD" ? "SB" : this.props.type
        },
        newProduct: {
            description: "",
            name: "",
            type: "PD",
            size: "",
            weight:"", // abhishek
            partNo: "",
            noOfPolybags: 1,
            quantityPerBag: 1
        },
        selectedPart: {}
    }



    handleTextChange = (status, e) => {
        var { newBox } = this.state;
        var { newProduct } = this.state;

        if (status === 1) {
            if (this.props.type === "SB" || this.props.type === "BB")
                newBox.description = e.target.value;
            else
                newProduct.description = e.target.value;

        } else if (status === 2) {
            if (this.props.type === "SB" || this.props.type === "BB")
                newBox.name = e.target.value;
            else
                newProduct.name = e.target.value;
        } else if (status === 3) {                   // abhi
            if (this.props.type === "SB" || this.props.type === "BB")
                newBox.weight = Number(e.target.value);
            else
                newProduct.weight = Number(e.target.value);
        } 

        else if (status === 4) {
            if (e.target.value > 0)
                newProduct.noOfPolybags = e.target.value;
        } else if (status === 5) {
            if (e.target.value > 0)
                newProduct.quantityPerBag = e.target.value;
        }

        this.setState({
            newBox,
            newProduct
        });
    };

    save = () => {
        var { newProduct, selectedPart } = this.state
        if (this.props.type == "PD") {
            newProduct.name = selectedPart.partName
            newProduct.size = selectedPart.size
            newProduct.weight=selectedPart.weight // abhi
            newProduct.partNo = selectedPart.partNo
            this.props.handleItemSave(newProduct);
        }
        else if (this.props.type == "SB")
            this.props.handleItemSave(this.state.newBox);
        else
            this.props.handleDialogSave(this.state.newBox);

        this.setState({
            newBox: {
                description: "",
                name: "",
                type: this.props.type === "PD" ? "SB" : this.props.type
            },
            newProduct: {
                description: "",
                name: "",
                type: "PD",
                size: "",
                weight:"", //abhi
                partNo: "",
                noOfPolybags: 1,
                quantityPerBag: 1
            }
        });
    }

    close = () => {
        if (this.props.type == "PD" || this.props.type == "SB")
            this.props.handleItemCancel();
        else
            this.props.handleDialogClose();

        this.setState({
            newBox: {
                description: "",
                name: "",
                type: this.props.type === "PD" ? "SB" : this.props.type
            },
            newProduct: {
                description: "",
                name: "",
                weight:"", // abhi
                type: "PD",
                noOfPolybags: 1,
                quantityPerBag: 1
            },
            selectedPart: {},
        });
    }

    setDialogTitle = () => {
        if (this.props.type === "BB")
            return <strong>Add Big Box</strong>;
        else if (this.props.type === "SB")
            return <strong>Add Small Box</strong>;
        else if (this.props.type === "PD")
            return <strong>Add Product Details</strong>;
    }

    setIdLabel = () => {
        if (this.props.type === "BB" || this.props.type === "SB")
            return "Box Id";
        else if (this.props.type === "PD")
            return "Product Id";
    }

    setNameLabel = () => {
        if (this.props.type === "BB" || this.props.type === "SB")
            return "Box Name";
        else if (this.props.type === "PD")
            return "Product Name";
    }

    handleChange = (_, val) => {
        var { selectedPart } = this.state
        selectedPart = val
        if (!selectedPart) {
            selectedPart = {}
        }
        console.log("SelectedPart", selectedPart);
        this.setState({
            selectedPart
        });
    };

    setProductContents = () => {
        return <Grid
            container
            justify="space-between"
            alignItems="center"
            style={{ width: "100%" }}
            spacing={2}
        >
            <Grid item xs={12}>
                <TextField
                    multiline
                    fullWidth
                    label={"Description"}
                    value={
                        this.state.selectedPart.partName ? this.state.selectedPart.partName : "Please select Part Number."
                    }
                    disabled
                    margin="dense"
                    variant="outlined"

                />
            </Grid>
                   
              <Grid item xs={12}>
                <TextField
                    multiline
                    fullWidth
                    label={"weight"}
                    value={
                        this.state.selectedPart.weight ? this.state.selectedPart.weight : "Please select Part Number."
                    }
                    disabled
                     onChange={e => this.handleTextChange(3, e)}
                    margin="dense"
                    variant="outlined"

                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    id="selectCustomer"
                    autoSelect
                    size="small"
                    onChange={this.handleChange}
                    options={this.props.parts}
                    getOptionLabel={(option) => option.partNo}
                    renderInput={(params) => (
                        <TextField {...params}
                            label="Part No." variant="outlined" margin="dense" />
                    )}
                    renderOption={(option, { inputValue }) => {
                        const matches = match(option.partNo, inputValue);
                        const parts = parse(option.partNo, matches);

                        return (
                            <div>
                                {parts.map((part, index) => (
                                    <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                        {part.text}
                                    </span>
                                ))}
                            </div>
                        );
                    }}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    type="number"
                    label="Polybags"
                    fullWidth
                    value={
                        this.state.newProduct.noOfPolybags
                    }

                    onChange={e => this.handleTextChange(4, e)}
                    margin="dense"
                    variant="outlined"

                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type="number"
                    label="Quantity per bag"
                    fullWidth
                    value={
                        this.state.newProduct.quantityPerBag
                    }

                    onChange={e => this.handleTextChange(5, e)}
                    margin="dense"
                    variant="outlined"

                />
            </Grid>

        </Grid>
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                open={this.props.setDialog}
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
                                {this.setDialogTitle()}
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
                    {this.props.type === "PD" ? this.setProductContents() : (

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label={this.setNameLabel()}
                                    value={
                                        this.props.type === "PD" ? this.state.newProduct.name : this.state.newBox.name
                                    }

                                    onChange={e => this.handleTextChange(2, e)}
                                    margin="dense"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">

                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label={"Description"}
                                    value={
                                        this.props.type === "PD" ? this.state.newProduct.description : this.state.newBox.description
                                    }
                                    onChange={e => this.handleTextChange(1, e)}
                                    margin="dense"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">

                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() => this.save()}
                        color="secondary"
                        autoFocus
                        style={{ backgroundColor: "secondary", color: "white", width: 150 }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AddBoxDialog;

