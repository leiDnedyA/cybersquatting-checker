import { FormEvent, useEffect, useState } from 'react';
import { Box, TextField, Button,CircularProgress, Typography } from '@mui/material';
import { DomainInfo, Report } from '../types/DomainInfo';
import DomainRecordsTable from '../components/DomainRecordsTable';

type Props = {
  authenticated: boolean;
};

async function getUserRecords(): Promise<Report> {
  const result = await fetch('/api/user_records');
  if (!result.ok) {
    return {
      domains: [],
      keywords: [],
      records: []
    };
  }
  const resultJSON = await result.json();
  return resultJSON;
}

function DomainSearchPage({authenticated}: Props) {
  const [domains, setDomains] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [similarDomains, setSimilarDomains] = useState<DomainInfo[]>([]);

  useEffect(() => {
    // hit endpoint and check if user already has domains + records to show
    (async () => {
      const report = await getUserRecords();
      console.log(report);
      if (report.domains.length > 0) {
        setDomains(report.domains);
      }
      if (report.keywords.length > 0) {
      }
     })();
  }, [authenticated]);

  const handleSearchSubmit =  (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  }

  const handleSearch = async () => {
    console.log(domains)
    console.log(keywords)
    if (!domains) {
      // Stop user from sending requests if domain field is empty
      return;
    }
    setLoading(true);
    setInitialized(true);
    setSimilarDomains([]);
    try {
        const response = await fetch('/api/domains?domain=' + encodeURI(domains[0]));
        if (!response.ok) {
          alert(`Error: There was an error processing the domain "${domains[0]}".`);
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
          value={domains.join(', ')}
          onChange={(e) => setDomains(e.target.value.split(', '))}
          sx={{ marginBottom: 2, marginRight: "5px" }}
        />
        <TextField
          label="Search keywords"
          value={keywords.join(', ')}
          onChange={(e) => setKeywords(e.target.value.split(', '))}
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
