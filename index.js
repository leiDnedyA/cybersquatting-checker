const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/domains', (req, res) => {
  // Replace this with your actual domain similarity and maliciousness check logic
  const domains = [
    {
      domain: req.query.domain,
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

  res.json(domains);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
