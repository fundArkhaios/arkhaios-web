// fundManagerReport.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logoBase64 from '../app/public/base64logo.js';
import styles from 'pdfStyles.js';

const FundManagerReport = ( {fundManagerReportInfo} ) => (
<Document>
    <Page size="A4" style={styles.page}>
        <View style={styles.section}>
            {/* Logo Header Section */}
            <View style={styles.logoHeaderSection}>
                {/* Logo */}
                <Image style={styles.logo} src={logoBase64} />
                {/* App Name */}
                <Text style={styles.appNameText}>Arkhaios</Text>
            </View>
            {/* User Name Section */}
            <View style={styles.userNameSection}>
                <Text style={styles.userNameText}>
                    {fundManagerReportInfo.personName}
                </Text>
            </View>
            {/* Header Section */}
            <View style={styles.divider}></View>
            <View style={styles.headerSection}>
                <View style={styles.headerSectionPart}>
                    <Text style={styles.headerLabelBold}>Account Number: </Text>
                    <Text style={styles.userNameText}>{fundManagerReportInfo.userID} </Text>
                </View>
                <View style={styles.headerSectionPart}>
                    <Text style={styles.headerLabelBold}>Monthly Statement</Text>
                </View>
                <View style={styles.headerSectionPart}>
                    <Text style={styles.headerLabelBold}>Statement Period: </Text>
                    <Text style={styles.userNameText}>{fundManagerReportInfo.statementPeriod}</Text>
                </View>
            </View>
            <View style={styles.divider}></View>
            {/* Tables Section */}
            <View style={styles.tableContainer}>
                {/* Left Column for First Three Tables */}
                <View style={styles.leftColumn}>
                    {/* Cash Summary Table */}
                    <View style={styles.table}>
                        {/* Header Row */}
                        <View style={{...styles.tableRow, backgroundColor: "#d3d3d3"}}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.subHeaderCell}>Cash Summary</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.subHeaderCell}>This Period</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.subHeaderCell}>Year to Date</Text>
                            </View>
                        </View>
                        {/* Data Rows */}
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Beginning Balance</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.beginningBalanceTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.beginningBalanceYtD}</Text>
                            </View>
                        </View>
                        {/* Repeat this structure for each row */}
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Addition</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.additionTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.additionYtD}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Subtraction</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.subtractionTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.subtractionYtD}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Trade Transaction</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.tradeTransactionTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.tradeTransactionYtD}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Cost and Fees</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.costAndFeesTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.costAndFeesYtD}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>Ending Value</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.endingValueTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.endingValueYtD}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Account Summary Table */}
                    <View style={styles.table}>
                        {/* Subheader */}
                        <View style={{...styles.tableRow, backgroundColor: "#d3d3d3"}}>
                            <View style={{...styles.subHeader, backgroundColor: "#d3d3d3"}}>
                                <Text style={styles.subHeaderCell}>Account Summary</Text>
                            </View>
                        </View>
                        {/* Data Rows */}
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.tableCell}>Long</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "70%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.accountSummaryLong}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.tableCell}>Short</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "70%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.accountSummaryShort}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.tableCell}>Equity</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "70%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.accountSummaryEquity}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Income Summary Table */}
                    <View style={styles.table}>
                        {/* Header Row */}
                        <View style={{...styles.tableRow, backgroundColor: "#d3d3d3"}}>
                            <View style={{...styles.tableCol, width: "40%"}}>
                                <Text style={styles.tableCell}>Income Summary</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.tableCell}>This Period</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.tableCell}>Year to Date</Text>
                            </View>
                        </View>
                        {/* Data Rows for Dividend */}
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "40%"}}>
                                <Text style={styles.tableCell}>Dividend</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.dividendTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.dividendYtD}</Text>
                            </View>
                        </View>
                        {/* Data Rows for Interest */}
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "40%"}}>
                                <Text style={styles.tableCell}>Interest</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.interestTP}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "30%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo.interestYtD}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Right Column for Realized Gain/Loss Table */}
                <View style={styles.rightColumn}>
                    {/* Realized Gain/Loss from Sales Table */}
                    <View style={styles.table}>
                        {/* Subheader and Rows for Short Term */}
                        <View style={{...styles.subHeader, backgroundColor: "#d3d3d3"}}>
                            <Text style={styles.subHeaderCell}>Short Term Realized Gain/Loss from Sales</Text>
                        </View>
                        {['Gain', 'Loss', 'Net'].map((item, index) => (
                        <View key={`short-${index}`} style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>{item}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo[`st${item}TP`]}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo[`st${item}YtD`]}</Text>
                            </View>
                        </View>
                        ))}
                    </View>
                    <View style={styles.table}>
                        {/* Subheader and Rows for Long Term */}
                        <View style={{...styles.subHeader, backgroundColor: "#d3d3d3"}}>
                            <Text style={styles.subHeaderCell}>Long Term Realized Gain/Loss from Sales</Text>
                        </View>
                        {['Gain', 'Loss', 'Net'].map((item, index) => (
                        <View key={`long-${index}`} style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: "50%"}}>
                                <Text style={styles.tableCell}>{item}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo[`lt${item}TP`]}</Text>
                            </View>
                            <View style={{...styles.tableCol, width: "25%"}}>
                                <Text style={styles.dataTableCell}>${fundManagerReportInfo[`lt${item}YtD`]}</Text>
                            </View>
                        </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    </Page>

    <Page size = "A4" style={styles.page}>
        {/* Holdings Table */}
        <View style={{ ...styles.holdingsTable}}>
        {/* App Name */}
            <Text style={{...styles.holdingsHeaderText, marginLeft: 5, marginTop: 5}}>Holdings</Text>
            {/* Header Row */}
            <View style={{...styles.holdingsTableRow, backgroundColor: "#d3d3d3", marginTop: 20}}>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Symbol</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "20%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Description</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Quantity</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Market Price</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Market         Value</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Cost Price</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Unrealized P/L</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "20%"}}>
                    <Text style={{...styles.tableCell, ...styles.tableColHeader}}>Cost Basis</Text>
                </View>
            </View>
            {/* Dynamic Data Rows */}
            {fundManagerReportInfo.stockPositions.map((position, index) => (
            <View key={index} style={styles.holdingsTableRow}>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.tableCell}>{position.symbol}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "20%"}}>
                    <Text style={styles.tableCell}>{position.description}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.dataTableCell}>{position.quantity}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.dataTableCell}>{position.marketPrice}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.dataTableCell}>{position.marketValue}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.dataTableCell}>{position.costPrice}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "10%"}}>
                    <Text style={styles.dataTableCell}>{position.unrealizedPL}</Text>
                </View>
                <View style={{...styles.stockTableCol, width: "20%"}}>
                    <Text style={styles.dataTableCell}>{position.costBasis}</Text>
                </View>
            </View>
            ))}
        </View>
    </Page> 
</Document>
);

export default FundManagerReport;
