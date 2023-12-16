import XlsxPopulate from "xlsx-populate";

const COMMON_HEADING_STYLES = {
  bold: true,
  fontFamily: "Bookman Old Style",
  fontSize: 12,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};

const COMMON_DATA_STYLES = {
  fontFamily: "Bookman Old Style",
  fontSize: 12,
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};

const COMPANY_NAME = "FLUID CONTROLS PVT.LTD.";
const SUB_HEADING =
  "ISO 9001:2015, ISO 14001:2015 & OHSAS 18001:2007 Certified company   PR-03/10/00/261117";
var CUSTOMER_NAME = "";
var DATA_START_ROW = 6;
var DATA_START_ROW1 = 10; //abhi
const TABLE_HEADING_ROW = 5;

export const makeExcel = (order, products) => {
  DATA_START_ROW = 6;
  CUSTOMER_NAME = order.customerName.toUpperCase();
  var documentName = order.barCode + "-" + CUSTOMER_NAME + ".xlsx";

  XlsxPopulate.fromBlankAsync().then((workbook) => {
    workbook = makeOutline(workbook, order);
    workbook = injectData(workbook, products);
    workbook = injectData2(workbook, order); // abhi
    console.log("PRODUCTS: ", products);
    console.log("ORDER: ", order);

    var BigBoxNo = order.bigBoxes;
    // order.bigBoxes.forEach(bb => {

    //     console.log("Excel Big Box array : ", bb);
    //     BigBoxNo += 1
    //  })
    console.log("No Of BB : ", BigBoxNo);
    workbook.outputAsync().then((blob) => {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, documentName);
      } else {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = documentName;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    });
  });
};

const makeOutline = function (workbook, order) {
  const sheet = workbook.sheet(0);

  const heading = sheet.range("A1:H1");
  heading.value(COMPANY_NAME);
  heading.merged(true);
  heading.style(COMMON_HEADING_STYLES);
  heading.style({
    fontSize: 36,
    wrapText: false,
    fontFamily: "Times New Roman",
  });

  const subHeading = sheet.range("A2:H2");
  subHeading.value(SUB_HEADING);
  subHeading.merged(true);
  subHeading.style(COMMON_HEADING_STYLES);
  subHeading.style({
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  const subHeading2 = sheet.range("A3:H3");
  subHeading2.value(
    `CLIENT:- ${CUSTOMER_NAME}                                                                             PACKING LIST`
  );
  subHeading2.merged(true);
  subHeading2.style(COMMON_HEADING_STYLES);
  subHeading2.style({
    horizontalAlignment: "left",
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  const poCell = sheet.cell("A4");
  poCell.value(`PO NO`);
  poCell.style(COMMON_HEADING_STYLES);

  const poDataCell = sheet.cell("B4");
  poDataCell.value(order.poNo);
  poDataCell.style(COMMON_HEADING_STYLES);

  const DTDCell = sheet.cell("C4");
  DTDCell.value(`DTD:- ${new Date(order.issuedOn).toDateString()}`);
  DTDCell.style(COMMON_HEADING_STYLES);

  const FCNoCell = sheet.cell("D4");
  FCNoCell.value(`${order.barCode}`);
  FCNoCell.style(COMMON_HEADING_STYLES);

  const completedDateCell = sheet.range("E4:H4");
  completedDateCell.merged(true);
  completedDateCell.value(
    `Date:- ${
      order.completedOn ? new Date(order.completedOn).toDateString() : ""
    }`
  );
  completedDateCell.style(COMMON_HEADING_STYLES);

  const TABLE_HEADINGS = [
    {
      //SRNO
      name: "SR.\nNO.",
      width: 6,
      style: COMMON_HEADING_STYLES,
    },
    {
      //DESCRIPTION
      name: "DESCRIPTION",
      width: 37,
      style: COMMON_HEADING_STYLES,
    },
    {
      //SIZE
      name: "SIZE",
      width: 37,
      style: COMMON_HEADING_STYLES,
    },
    {
      //PART NO
      name: "FLUID CONTROLS PART NO.",
      width: 40,
      style: COMMON_HEADING_STYLES,
    },
    {
      //Quantity in Nos
      name: "QTY IN\nNOS.",
      width: 14,
      style: COMMON_HEADING_STYLES,
    },
    {
      //Bags and Quantity per bag
      name: "QTY IN SMALL BOX (PRODUCTS * BAGS)",
      width: 11,
      style: { ...COMMON_HEADING_STYLES, fontSize: 8 },
    },
    {
      //SMALL BOX
      name: "SMALL BOX",
      width: 19,
      style: COMMON_HEADING_STYLES,
    },
    {
      //BIG BOX
      name: "BIG BOX",
      width: 19,
      style: COMMON_HEADING_STYLES,
    },
  ];

  //HEADINGS
  var columnNameASCII = 65; //STARTING WITH A
  TABLE_HEADINGS.forEach((col) => {
    var colName = String.fromCharCode(columnNameASCII);
    sheet.column(colName).width(col.width);

    var cell = sheet.cell(colName + TABLE_HEADING_ROW);
    cell.value(col.name);
    cell.style(col.style);

    columnNameASCII++;
  });

  return workbook;
};

const injectData = (workbook, products) => {
  const sheet = workbook.sheet(0);

  products.forEach((product, index) => {
    if (index != 0) {
      DATA_START_ROW++;
      DATA_START_ROW1++; // abhi
    }

    //SR NO DATA
    const srNoDataCell = sheet.cell("A" + DATA_START_ROW);
    srNoDataCell.value(index + 1);

    //DESCRIPTION DATA
    const descDataCell = sheet.cell("B" + DATA_START_ROW);
    descDataCell.value(product.name);

    //SIZE DATA
    const sizeDataCell = sheet.cell("C" + DATA_START_ROW);
    sizeDataCell.value(product.size);

    //    const weightDataCell = sheet.cell("I" + DATA_START_ROW)
    //     weightDataCell.value(product.Weight);

    //PART NO DATA
    const partNoDataCell = sheet.cell("D" + DATA_START_ROW);
    partNoDataCell.value(product.partNo);

    //TOTAL QUANTITY
    const quantityDataCell = sheet.cell("E" + DATA_START_ROW);
    quantityDataCell.value(product.totalQuantity);
    console.log("Product array : ", product);
    product.multipleDetails.forEach((details, detailIdx) => {
      console.log("Details : ", details, " DetailIdx : ", detailIdx);
      if (detailIdx != 0) {
        DATA_START_ROW++;
        DATA_START_ROW++; // abhi
      }
      sheet.row(DATA_START_ROW).style(COMMON_DATA_STYLES);

      //NO OF BAGS (QUANTITY PER BAG)
      const bagsDataCell = sheet.cell("F" + DATA_START_ROW);
      bagsDataCell.value(details.qtyInSmallBox);

      //SMALL BOX
      const sbDataCell = sheet.cell("G" + DATA_START_ROW);
      sbDataCell.value(details.smallBox);

      //BIG BOX
      const bbDataCell = sheet.cell("H" + DATA_START_ROW);
      bbDataCell.value(details.bigBox);

      // const bbDataCell1 = sheet.cell("I" + DATA_START_ROW)
      // bbDataCell1.value(this.state.order.totalweight);
    });

    console.log(product);
  });

  return workbook;
};
const injectData2 = (workbook, order) => {
  const sheet = workbook.sheet(0);

  // total box no
  var BigBoxNo = 0;
  order.bigBoxes.forEach((bb) => {
    console.log("Excel Big Box array : ", bb);
    BigBoxNo += 1;
  });
  DATA_START_ROW += 2;

  const pos1 = "A" + DATA_START_ROW;
  const pos2 = ":B" + DATA_START_ROW;
  const totalBoxNo = sheet.range(pos1 + pos2);
  totalBoxNo.merged(true);
  totalBoxNo.value(`TOTAL BOX NO : ${BigBoxNo} NOS`);
  totalBoxNo.style(COMMON_HEADING_STYLES);
  totalBoxNo.style({
    horizontalAlignment: "left",
    fontSize: 14,
    fontFamily: "Times New Roman",
  });
  DATA_START_ROW++;

  // Sr no of Box
  const srNoOfBox = sheet.range("A" + DATA_START_ROW + ":B" + DATA_START_ROW);
  srNoOfBox.merged(true);
  srNoOfBox.value(`SR.NO. OF BOX: 1/${BigBoxNo} TO ${BigBoxNo}/${BigBoxNo}`);
  srNoOfBox.style(COMMON_HEADING_STYLES);
  srNoOfBox.style({
    horizontalAlignment: "left",
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  DATA_START_ROW++;

  //     // Net wt in kg
  const netWt = sheet.range("A" + DATA_START_ROW + ":B" + DATA_START_ROW);
  netWt.merged(true);
  netWt.value(`NET WT. IN KGS: ${order.totalWeight / 1000}   KGS`);
  netWt.style(COMMON_HEADING_STYLES);
  netWt.style({
    horizontalAlignment: "left",

    fontSize: 14,
    fontFamily: "Times New Roman",
  });
  DATA_START_ROW++;

  //    // Gross wt
  const subHeading3 = sheet.range("A" + DATA_START_ROW + ":B" + DATA_START_ROW);
  subHeading3.merged(true);
  subHeading3.value(`GROSS WT. IN KGS: =          KGS`);
  subHeading3.style(COMMON_HEADING_STYLES);
  subHeading3.style({
    horizontalAlignment: "left",
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  DATA_START_ROW += 2;

  //     //Prepared By
  const preparedBy = sheet.range(
    "A" + DATA_START_ROW + ":" + "B" + DATA_START_ROW
  );
  preparedBy.merged(true);
  preparedBy.value("PREPARED BY ");
  preparedBy.style(COMMON_HEADING_STYLES);
  preparedBy.style({
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  //    // Packed By
  const packedBy = sheet.cell("C" + DATA_START_ROW);
  packedBy.value("PACKED BY ");
  packedBy.style(COMMON_HEADING_STYLES);
  packedBy.style({
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  const checkedBy = sheet.range(`D${DATA_START_ROW}:E${DATA_START_ROW}`);
  checkedBy.merged(true);
  checkedBy.value("CHECKED BY");
  checkedBy.style(COMMON_HEADING_STYLES);
  checkedBy.style({
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  const verifiedBy = sheet.range(`F${DATA_START_ROW}:H${DATA_START_ROW}`);
  verifiedBy.merged(true);
  verifiedBy.value("VERIFIED BY QC");
  verifiedBy.style(COMMON_HEADING_STYLES);
  verifiedBy.style({
    fontSize: 14,
    fontFamily: "Times New Roman",
  });

  return workbook;
};
