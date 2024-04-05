import { useState } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

type DomainInfo = {
  domain: string;
  ipAddress: string;
  urlConstruction: string;
  category: string;
  logoDetected: boolean;
  riskLevel: 1 | 2 | 3 | 4 | 5;
};

const DomainSearchPage = () => {
  const [domain, setDomain] = useState('');
  const [similarDomains, setSimilarDomains] = useState<DomainInfo[]>([]);

  const handleSearch = () => {
    const similarDomains: DomainInfo[] = [
      {
        domain: 'example.com',
        ipAddress: '192.168.1.100',
        urlConstruction: 'legitimate',
        category: 'business',
        logoDetected: true,
        riskLevel: 1,
      },
      {
        domain: 'exmple.com',
        ipAddress: '10.0.0.1',
        urlConstruction: 'suspicious',
        category: 'unknown',
        logoDetected: false,
        riskLevel: 4,
      },
      {
        domain: 'examle.com',
        ipAddress: '172.16.0.50',
        urlConstruction: 'legitimate',
        category: 'personal',
        logoDetected: true,
        riskLevel: 2,
      },
      {
        domain: 'exampple.com',
        ipAddress: '8.8.8.8',
        urlConstruction: 'suspicious',
        category: 'malware',
        logoDetected: false,
        riskLevel: 5,
      },
    ];
    setSimilarDomains(similarDomains);
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
                <TableCell>{item.riskLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DomainSearchPage;
