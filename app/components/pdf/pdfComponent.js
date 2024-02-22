import React, { useState, useEffect } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import UserReport from 'userReport.js';
import FundManagerReport from 'fundManagerReport.js';

const PDFComponent = () => {
  const [userReportUrl] = useState('');
  const [fundManagerReportUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGeneratingUserReport, setIsGeneratingUserReport] = useState(false);
  const [isGeneratingFundManagerReport, setIsGeneratingFundManagerReport] = useState(false);

  useEffect(() => {
    if (userReportUrl) {
      window.open(userReportUrl, '_blank');
    }
  }, [userReportUrl]);

  useEffect(() => {
    if (fundManagerReportUrl) {
      window.open(fundManagerReportUrl, '_blank');
    }
  }, [fundManagerReportUrl]);

  const handleViewUserReport = () => {
    setLoading(true);
    setIsGeneratingUserReport(true);
  };
  
  const handleViewFundManagerReport = () => {
    setLoading(true);
    setIsGeneratingFundManagerReport(true);
  };

  const GeneratePdf = ({ document, onGenerated }) => {
    return (
      <BlobProvider document={document}>
        {({ url }) => {
          if (url) {
            onGenerated(url);
          }
          return null;
        }}
      </BlobProvider>
    );
  };

  const userReportInfo = { 
    userID: '1233210', 
    personName: 'John Hancock', 
    statementPeriod: 'March 2024',
    statementLength: '2 Weeks', 
    initBalance: '100,000',
    endingBalance: '110,000',
    plPerc: 10,
    totalPL: '10,000',
    arkhaiosFee: 3,
    totalBalance: '10,000',
    fundReportProfit: 0, 
    pmPerformanceFee: 'NO', 
    pmFeePerc: 0,
    pmFee: 0,
    ifDistribution: 17500,
    ifPerc: 17.55,
    deposit: 500,
    totalFundBalance: '--',
  }

  const fundManagerReportInfo = {
    userID: '1233210', 
    personName: 'John Hancock', 
    statementPeriod: 'March 2024',
    beginningBalanceTP: 0,
    additionTP: 0,
    subtractionTP: 0,
    tradeTransactionTP: 0,
    costAndFeesTP: 0,
    endingValueTP: 0,
    beginningBalanceYtD: 0,
    additionYtD: 0,
    subtractionYtD: 0,
    tradeTransactionYtD: 0,
    costAndFeesYtD: 0,
    endingValueYtD: 0,
    accountSummaryLong: 0,
    accountSummaryShort: 0,
    accountSummaryEquity: 0,
    dividendTP: 0,
    interestTP: 0,
    dividendYtD: 0,
    interestYtD: 0,
    stGainTP: 0,
    stLossTP: 0,
    stNetTP: 0,
    stGainYtD: 0,
    stLossYtD: 0,
    stNetYtD: 0,
    ltGainTP: 0,
    ltLossTP: 0,
    ltNetTP: 0,
    ltGainYtD: 0,
    ltLossYtD: 0,
    ltNetYtD: 0,
    stockPositions: [
      {
        symbol: "Cash USD",
        description: "",
        quantity: "",
        marketPrice: "",
        marketValue: "",
        costPrice: "$1,061.76",
        unrealizedPL: "",
        costBasis: ""
      },
      {
        symbol: "AAPL",
        description: "APPLE INC COM",
        quantity: "1",
        marketPrice: "$189.95",
        marketValue: "$189.95",
        costPrice: "$172.80",
        unrealizedPL: "$17.15",
        costBasis: "$172.80"
      },
      {
        symbol: "TSLA",
        description: "TESLA INC COM",
        quantity: "1",
        marketPrice: "$207.50",
        marketValue: "$207.50",
        costPrice: "$0",
        unrealizedPL: "$0",
        costBasis: "$0"
      }
      // ... other stock positions ...
    ]
  }

  return (
    <div>
      <button onClick={handleViewUserReport} disabled={loading}>View User Report</button>
      <button onClick={handleViewFundManagerReport} disabled={loading}>View Fund Manager Report</button>
      {loading && <div>Loading...</div>}
  
      {isGeneratingUserReport && (
        <GeneratePdf document={<UserReport userReportInfo={userReportInfo} />} onGenerated={(url) => {
          window.open(url, '_blank');
          setLoading(false);
          setIsGeneratingUserReport(false);
        }} />
      )}
  
      {isGeneratingFundManagerReport && (
        <GeneratePdf document={<FundManagerReport fundManagerReportInfo={fundManagerReportInfo} />} onGenerated={(url) => {
          window.open(url, '_blank');
          setLoading(false);
          setIsGeneratingFundManagerReport(false);
        }} />
      )}
    </div>
  );

}


export default PDFComponent;