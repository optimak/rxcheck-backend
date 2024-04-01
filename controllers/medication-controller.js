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
    console.log('query', query);
    try {
        // const synonyms = await expand_query_with_synonyms(query);
        const searchResults = await knex('medications')
            .where('indications', 'like', `%${query}%`)
            .select('*');

        console.log(searchResults)
        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving medications: ${err}`);
    }
};

const medComments = async (req, res) => {
    //get comments on a medication
    // const { query } = req.params;
    //  console.log('query',query);
    try {
   
        const searchResults = await knex('comments')
            .join('users', 'comments.user_id', '=', 'users.id') 
            .where({ 'comments.medication_id': req.params.med_id }) 
            .select('comments.*', 'users.full_name as user_name'); 

        console.log(searchResults)
        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving comments: ${err}`);
    }
};

const addMedComment = async (req, res) => {
    //add comments on a medication
    //receives user_id, medication_id, content) 
    // will add  summary later)

    const { user_id, medication_id, content } = req.body;

    if (!content) {
        return res.status(400).send("Please enter a comment");
    }
    const newComment = {
        user_id,
        medication_id,
        content
    };

    try {
        // const synonyms = await expand_query_with_synonyms(query); USE FOR SUMMARY? OPEN_AI
        ///// ONE MORE THING CHi
        // first check if there's a userid med combo for the user. if yes, do a put/replace in the knex
        const existingComment = await knex('comments')
            .where({ medication_id: medication_id, user_id: user_id, content: content });
        if (existingComment.length) {
            await knex('comments')
                .where({ medication_id: medication_id, user_id: user_id, content: content }).del();
            console.log("deleted extra")
        }
        await knex('comments')
            .insert(newComment);

        console.log(newComment, existingComment)
        res.json(newComment);
    } catch (err) {
        res.status(400).send(`Error sending comment: ${err}`);
    }
};
const deleteMedComment = async (req, res) => {
    //DELETE comment on a medication
    //receives user_id, medication_id) 

    // const { user_id, medication_id } = req.body;

    const { id } = req.body;


    try {
        // const synonyms = await expand_query_with_synonyms(query);
        ///// ONE MORE THING CHi
        // first check if there's a userid med combo for the user. if yes, delete in the knex
        // const deletedComments = await knex('comments')
        //     .where({ medication_id: medication_id, user_id: user_id });
        const deletedComments = await knex('comments')
            .where({ id: id });
        if (deletedComments === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }


        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(`Error deleting comment: ${err}`);
    }
};

module.exports = {
    index,
    conditionMedications,
    medComments,
    addMedComment,
    deleteMedComment
};
