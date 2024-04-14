import { FormEvent, useState } from 'react';
import { Box, TextField, Button,CircularProgress, Typography } from '@mui/material';
import { DomainInfo } from '../types/DomainInfo';
import DomainRecordsTable from '../components/DomainRecordsTable';

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
          required
          label="Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          sx={{ marginBottom: 2, marginRight: "5px" }}
        />
        <TextField
          label="Search keywords"
          sx={{ marginBottom: 2, marginLeft: "5px" }}
        />
      </form>
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
      <DomainRecordsTable domainRecords={similarDomains}/>
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
