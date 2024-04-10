import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DomainInfo, RiskStyle } from '../types/DomainInfo';

type props = {
  domainRecords: DomainInfo[];
}

function getRiskLevelStyle(level: 1 | 2 | 3) : RiskStyle {
  const result: RiskStyle = {
    padding: '3px 10px',
    borderRadius: '3px',
    display: 'inline-block'
  };
  if (level === 1) {
    result.color = 'text.secondary';
  } else if (level === 2) {
    result.backgroundColor = '#ffaa00';
  } else {
    result.backgroundColor = '#ff3333';
    result.color = '#ffffff';
  }
  return result;
}

function DomainRecordsTable({domainRecords}: props) {
  return (
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>URL Construction</TableCell>
              <TableCell>Detected in Search</TableCell>
              <TableCell>Logo Detected</TableCell>
              <TableCell>Risk Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domainRecords.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.domain}</TableCell>
                <TableCell>{item.ipAddress}</TableCell>
                <TableCell>{item.urlConstruction}</TableCell>
                <TableCell>{item.detectedInSearch ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.logoDetected ? 'Yes' : 'No'}</TableCell>
                <TableCell><Box sx={getRiskLevelStyle(item.riskLevel)}>
                  {item.riskLevel}
                </Box></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default DomainRecordsTable;
