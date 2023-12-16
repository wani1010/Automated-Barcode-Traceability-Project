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
    Button,

} from "@material-ui/core";
import Barcode from "react-barcode";
import ClearIcon from "@material-ui/icons/Clear";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const barcodesPerPage = 30;
const barcodeWidth = "66"
const barcodeHeight = "29"
const barcodesPerColumn = 10
const barcodesPerRow = 3
const topPaperMargin = 5
const leftPaperMargin = 4
const paperHeight = "297"
const paperWidth = "203"
class ViewBarcodes extends Component {
    state = {}


    setUpPdf = () => {
        var HTMLpages = []
        var barCodeHtml = [];
        for (let index = 0; index < this.props.barcodes.length; index++) {
            var code = this.props.barcodes[index]
            barCodeHtml.push(
                <Grid item key={index} style={{ width: barcodeWidth + "mm", height: barcodeHeight + "mm", marginBottom: "1.5mm", paddingTop: "17px" }} xs={4} align="center">
                    <Barcode margin={0} height={50} width={1} value={code} fontSize="16"  ></Barcode>
                </Grid>
            )
            if (((index + 1) % barcodesPerPage == 0 || index + 1 == this.props.barcodes.length) && index != 0) {
                HTMLpages.push(

                    <Grid container id={"page" + Math.floor(index / barcodesPerPage)} style={{ width: Number(paperWidth) + 10 + "mm" }}>
                        {barCodeHtml.map((html) => html)}
                    </Grid>
                )
                barCodeHtml = []
            }
        }
        return HTMLpages
    }

    downloadPDF = () => {
        // var images = this.getPdf()
        // var { images } = this.state
        this.setState({ downloadLoading: true })
        const pdf = new jsPDF("p", "mm", "a4");
        // var width = pdf.internal.pageSize.getWidth();
        // var height =  pdf.internal.pageSize.getHeight();
        var width = paperWidth
        var height = paperHeight
        console.log(height);
        var imgurl = []
        var imagesLength = Math.ceil(this.props.barcodes.length / barcodesPerPage)
        // console.log(imagesLength);
        for (let i = 0; i < imagesLength; i++) {
            var divToDisplay = document.getElementById("page" + i)
            html2canvas(divToDisplay, { scale: 5 }).then(canvas => {
                // var url = canvas.toDataURL("image/jpeg")
                imgurl.push(canvas);
                if (i != 0)
                    pdf.addPage()


                if (i + 1 == imagesLength) {

                    //finding remainign barcodes to be printed on the last page
                    var remainingBarcodes = this.props.barcodes.splice(barcodesPerPage * i, this.props.barcodes.length);
                    var newHeight = Math.ceil(remainingBarcodes.length / barcodesPerRow) * (barcodeHeight)
                    console.log(newHeight);
                    pdf.addImage(imgurl[i], "PNG", leftPaperMargin, topPaperMargin, Number(width), Number(newHeight))
                    pdf.save(`${this.props.savedOrderID}.pdf`)
                    this.props.onClose();
                }
                else {
                    pdf.addImage(imgurl[i], "PNG", leftPaperMargin, topPaperMargin, Number(width), Number(height) - 4)

                }
            })
        }
    }

    render() {
        var { classes } = this.props
        return (
            <Dialog
                maxWidth="lg"
                open={this.props.open}
            >
                <DialogTitle>
                    <Grid
                        container
                        justify="space-between"
                        alignItems="center"
                        style={{ padding: 0 }}
                    >
                        <Grid item  >
                            <Typography style={{ color: "secondary", fontSize: 19 }}>
                                {"Barcodes"}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={() => this.props.onClose()}
                            >
                                <ClearIcon></ClearIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider light />
                <DialogContent>
                    {this.setUpPdf().map(page => page)}
                </DialogContent>
                <Divider light />

                <DialogActions>
                    <Button
                        variant="contained"
                        // onClick={toPdf}
                        onClick={() => this.downloadPDF()}
                        color="secondary"
                        autoFocus
                        style={{ backgroundColor: "secondary", color: "white" }}
                    >
                        Download Barcodes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ViewBarcodes;