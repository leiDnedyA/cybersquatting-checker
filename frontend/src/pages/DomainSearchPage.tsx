import { FormEvent, useState } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import { RiskStyle, DomainInfo } from '../types/DomainInfo';

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
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [similarDomains, setSimilarDomains] = useState<DomainInfo[]>([]);

  const handleSearchSubmit =  (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  }

  const handleSearch = async () => {
    if (!domain) {
      // Stop user from sending requests if domain field is empty
      return;
    }
    setLoading(true);
    setInitialized(true);
    setSimilarDomains([]);
    try {
        const response = await fetch('/api/domains?domain=' + encodeURI(domain));
        if (!response.ok) {
          alert(`Error: There was an error processing the domain "${domain}".`);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setLoading(false);
        setSimilarDomains(data);
      } catch (error) {
        console.error('Error fetching domain data:', error);
      }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <form onSubmit={handleSearchSubmit}>
        <TextField
          label="Enter a web domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </form>
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
      {
        loading ?
        (
          <Box sx={{marginTop: '30px'}}>
            <CircularProgress />
          </Box>
        ) :
        undefined
      }
      {
        (!loading && similarDomains.length === 0 && initialized) ?
        <Box sx={{marginTop: '25px'}}>
          <Typography>No similar domains detected.</Typography>
        </Box> :
        undefined
      }
    </Box>
  );
};

export default DomainSearchPage;
