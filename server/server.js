import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;
app.use(cors());

const token = process.env.GITHUB_TOKEN;
const username = 'kamnajain06'; 

const query = `
  {
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

const getContributions = async () => {
    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data.data.user.contributionsCollection.contributionCalendar;
};

app.use(express.static('public'));

app.get('/api/contributions', async (req, res) => {
    try {
        const calendar = await getContributions();
        res.json(calendar);
    } catch (error) {
        res.status(500).send('Error fetching contributions');
    }
});
app.get('/', () => {
    console.log("Hello");
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
