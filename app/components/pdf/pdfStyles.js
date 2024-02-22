import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  tableContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  leftColumn: { width: '50%'},
  rightColumn: { width: '40%', marginLeft: 10 },
  appNameText: { fontSize: 20, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
  holdingsHeaderText: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Helvetica-Bold' },
  userNameSection: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end'},
  userNameText: {fontSize: 12, textAlign: 'right', fontFamily: 'Helvetica', marginBottom: 5},
  logoHeaderSection: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 },
  headerSection: { flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerLabelBold: { fontWeight: 'bold', fontSize: 12, fontFamily: 'Helvetica-Bold' },
  headerSectionPart: { flex: 1, flexDirection: 'row', justifyContent: 'center' },
  divider: { borderBottomWidth: 1, borderBottomColor: '#55595D', marginBottom: 20 },
  logo: {width: 40, height: 40 },
  page: { flexDirection: 'row', backgroundColor: '#FFFFFF' },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, marginBottom: 30 },
  tableCell: { width: "100%", textAlign: 'left', padding: 3, fontSize: 8, fontWeight: 900 },
  dataTableCell: { width: "100%", textAlign: 'right', padding: 3, fontSize: 8, fontWeight: 900 }, 
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: { borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, width: "33.33%" },
  stockTableCol: { borderStyle: "solid", borderWidth: 1 },
  subHeader: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderBottomWidth: 1, borderTopColor: '#55595D', borderBottomColor: '#55595D', borderRightWidth: 1, borderRightColor: '#55595D',width: "100%", flexDirection: "row"},
  subHeaderCell: { width: "100%", alignItems: 'left', padding: 5, fontSize: 8, fontWeight: 900 },
  holdingsTableRow: {
      flexDirection: "row",
      margin: 0, // Set margin to 0
      padding: 0, // Set padding to 0
      borderBottomWidth: 1, // Optional: Add a border to separate rows
      borderColor: '#d3d3d3', // Optional: Set border color
  },
  holdingsTable: {
      display: "table",
      width: "auto",
      marginTop: 20,
      marginLeft: 10, // Add left margin
      marginRight: 10, // Add right margin
  },
});

export default styles;