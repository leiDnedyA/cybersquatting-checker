import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function DomainRecordsTable() {
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
            {similarDomains.map((item, index) => (
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
