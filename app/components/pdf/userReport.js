import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoBase64 from '../app/public/base64logo.js';
import styles from 'pdfStyles.js';


const UserReport = ( {userReportInfo} ) => (
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
                  {userReportInfo.personName}
              </Text>
          </View>
          {/* Header Section */}
          <View style={styles.divider}></View>
          <View style={styles.headerSection}>
              <View style={styles.headerSectionPart}>
                  <Text style={styles.headerLabelBold}>Account Number: </Text>
                  <Text style={styles.userNameText}>{userReportInfo.userID} </Text>
              </View>
              <View style={styles.headerSectionPart}>
                  <Text style={styles.headerLabelBold}>Monthly Statement</Text>
              </View>
              <View style={styles.headerSectionPart}>
                  <Text style={styles.headerLabelBold}>Statement Period: </Text>
                  <Text style={styles.userNameText}>{userReportInfo.statementPeriod}</Text>
              </View>
          </View>
          <View style={styles.divider}></View>
          {/* Balance Sheet */}
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Term</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Initial Balance</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Ending Balance</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Percent P/L</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Total P/L</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Arkhaios Fee</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>Total Balance</Text></View>
            </View>

            {/* Data Row */}
            <View style={styles.tableRow}>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}> { userReportInfo.statementLength }</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>{ userReportInfo.initBalance }</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>{ userReportInfo.endingBalance }</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>+{ userReportInfo.plPerc }%</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>+ ${ userReportInfo.totalPL }</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>{ userReportInfo.arkhaiosFee }%</Text></View>
              <View style={{...styles.tableCol, width: "14.28%"}}><Text style={styles.tableCell}>${ userReportInfo.totalBalance }</Text></View>
            </View>
          </View>

          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Fund Report Profit</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Portfolio Manager Performance Fee</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Portfolio Manager Performance Fee Percentage</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Portfolio Manager Fee</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Investor Fund P/L Distribution</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Investor Fund Percentage P/L</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Deposit</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>Total Balance</Text></View>
            </View>

            {/* Data Row */}
            <View style={styles.tableRow}>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>${ userReportInfo.fundReportProfit }</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>{ userReportInfo.pmPerformanceFee }</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>{ userReportInfo.pmFeePerc }%</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>${ userReportInfo.pmFee }</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>- ${ userReportInfo.ifDistribution }</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>- { userReportInfo.ifPerc }%</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>${ userReportInfo.deposit }</Text></View>
              <View style={{...styles.tableCol, width: "12.5%"}}><Text style={styles.tableCell}>{ userReportInfo.totalFundBalance }</Text></View> 
            </View>
          </View>
        </View>
      </Page>
    </Document>
);
export default UserReport;



