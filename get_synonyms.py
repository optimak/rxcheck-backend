import openai

# Set up OpenAI API key
# api_key = "YOUR_API_KEY"
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.getenv("API_KEY")

openai.api_key = api_key

# Function to expand query with synonyms using GPT-3
def expand_query_with_synonyms(query):
    # Generate text based on the query context
    response = openai.Completion.create(
        engine="text-davinci",  # Choose the GPT-3 model variant
        prompt=f"What are some synonyms for '{query}'?",
        max_tokens=50,
        n=5,  # Generate 5 completions
        stop=None,
        temperature=0.5
    )

    # Extract and return the generated text
    synonyms = [choice["text"].strip() for choice in response["choices"]]
    return synonyms
print(expand_query_with_synonyms("headache"))

# import spacy

# # Load pre-trained word vectors using spaCy
# nlp = spacy.load("en_core_web_md")

# # Function to expand query with synonyms
# def expandQueryWithWord2Vec(query):
#     synonyms = []

#     # Tokenize the query
#     query_token = nlp(query)

#     # Retrieve similar words using word vectors
#     for token in query_token:
#         if token.is_alpha:
#             most_similar_words = nlp.vocab[token.text.lower()].similarity
#             similar_words = sorted(most_similar_words, key=lambda x: -x.i)  # Sort by similarity score
#             for word in similar_words[:5]:  # Get top 5 similar words
#                 synonyms.append(word.text)

#     return synonyms




# import gensim.downloader as api

# # Get and load pre-trained Word2Vec model
# word2vec_model = api.load("word2vec-google-news-300")

# #  expand query with synonyms
# def expand_query_with_synonyms(query):
#     synonyms = []

#     # compute similarity with the query
#     similar_words = word2vec_model.most_similar(query, topn=5)

#     # get similar words
#     for word, _ in similar_words:
#         synonyms.append(word)

#     return synonyms
