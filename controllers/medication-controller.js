const knex = require('knex')(require('../knexfile'));
const { spawn } = require('child_process');





const index = async (_req, res) => {
    try {
        const data = await knex("public.medications");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error retrieving medications: ${err}`);
    }
};

const conditionMedications = async (req, res) => {
    const { query } = req.query;
    try {
        const searchResults = await knex('medications')
            .where('indications', 'like', `%${query}%`)
            .select('*');

        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving medications: ${err}`);
    }
};

const comments = async (req, res) => {
    //get comments for a user

    try {

        const searchResults = await knex('public.comments')
            .join('users', 'comments.user_id', '=', 'users.id')
            .join('medications', 'comments.medication_id', '=', 'medications.id')
            .where({ 'comments.user_id': req.params.user_id })
        .select('public.comments.*', 'public.users.full_name as user_name','public.medications.name as med_name')
        res.json(searchResults);
    } catch (err) {
        res.status(400).send(`Error retrieving user comments: ${err}`);
    }
};
const medComments = async (req, res) => {
    //get comments on a medication

    try {

        const searchResults = await knex('comments')
            .join('users', 'comments.user_id', '=', 'users.id')
            .where({ 'comments.medication_id': req.params.med_id })
            .select('comments.*', 'users.full_name as user_name');

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

        const existingComment = await knex('comments')
            .where({ medication_id: medication_id, user_id: user_id, content: content });
        if (existingComment.length) {
            await knex('comments')
                .where({ medication_id: medication_id, user_id: user_id, content: content }).del();
        }
        await knex('comments')
            .insert(newComment);

        res.json(newComment);
    } catch (err) {
        res.status(400).send(`Error sending comment: ${err}`);
    }
};
const deleteMedComment = async (req, res) => {
    //DELETE comment on a medication
    //receives comment_id) 


    const { comment_id } = req.params;


    try {

        const deletedComments = await knex('comments')
            .where({ 'id': comment_id })
            .del();
        if (deletedComments.length === 0) {
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
    comments,
    medComments,
    addMedComment,
    deleteMedComment
};
