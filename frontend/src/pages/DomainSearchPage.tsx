import { useState } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

type DomainInfo = {
  domain: string;
  ipAddress: string;
  urlConstruction: string;
  category: string;
  logoDetected: boolean;
  riskLevel: 1 | 2 | 3;
};

type RiskStyle = {
  padding: string;
  borderRadius: string;
  display: string;
  color?: string;
  backgroundColor?: string;
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

function DomainSearchPage() {
  const [domain, setDomain] = useState('');
  const [similarDomains, setSimilarDomains] = useState<DomainInfo[]>([]);

  const handleSearch = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/domains?domain=' + encodeURI(domain));
        const data = await response.json();
        setSimilarDomains(data);
      } catch (error) {
        console.error('Error fetching domain data:', error);
      }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <TextField
        label="Enter a web domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>URL Construction</TableCell>
              <TableCell>Category</TableCell>
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
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.logoDetected ? 'Yes' : 'No'}</TableCell>
                <TableCell><Box sx={getRiskLevelStyle(item.riskLevel)}>
                  {item.riskLevel}
                </Box></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DomainSearchPage;
