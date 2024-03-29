const knex = require('knex')(require('../knexfile'));
const { spawn } = require('child_process');

// Function to expand query using the get_synonyms.py script
function expand_query_with_synonyms(query) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('/Users/chiamakaaghaizu/.pyenv/versions/venv34/bin/python3', ['get_synonyms.py']);

        pythonProcess.stdin.write(JSON.stringify({ query }) + '\n');

        pythonProcess.stdout.once('data', (data) => {
            const synonyms = JSON.parse(data);
            resolve(synonyms);
        });

        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });

        pythonProcess.on('error', (error) => {
            reject(error.message);
        });

        pythonProcess.stdin.end();
    });
}



const index = async (_req, res) => {
    try {
        const data = await knex("medications");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving medications: ${err}`);
    }
};
const conditionMedications = async (req, res) => {
    const { query } = req.query;
     console.log('query',query);
    try {
        // const synonyms = await expand_query_with_synonyms(query);
        const searchResults = await knex('medications')
            .where('indications','like',`%${query}%`)
            .select('*');
       
        console.log(searchResults)
        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving medications: ${err}`);
    }
};


module.exports = {
    index,
    conditionMedications,
};
