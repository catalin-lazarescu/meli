using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDBProject.Models;

namespace MongoDBProject.Services
{
    public class MoviesService
    {
        private readonly IMongoCollection<Movie> _moviesCollection;

        public MoviesService(
            IOptions<MoviesDatabaseSettings> moviesDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                moviesDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                moviesDatabaseSettings.Value.DatabaseName);

            _moviesCollection = mongoDatabase.GetCollection<Movie>(
                moviesDatabaseSettings.Value.MoviesCollectionName);
        }
        public long GetAsync() =>
            _moviesCollection.CountDocuments(Builders<Movie>.Filter.And(
                Builders<Movie>.Filter.Type(m => m.Imdb.Rating, BsonType.Double),
                Builders<Movie>.Filter.Type(m => m.Imdb.Votes, BsonType.Int32)
                ));

        public async Task<List<Movie>> GetAsync(int skip) =>
        await _moviesCollection.Find(Builders<Movie>.Filter.And(
            Builders<Movie>.Filter.Type(m => m.Imdb.Rating, BsonType.Double),
            Builders<Movie>.Filter.Type(m => m.Imdb.Votes, BsonType.Int32)
            )).Skip(skip*10).Limit(10).ToListAsync();

        public async Task<Movie?> GetAsync(string id) =>
            await _moviesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Movie newMovie) =>
            await _moviesCollection.InsertOneAsync(newMovie);

        public async Task UpdateAsync(string id, Movie updatedMovie) =>
            await _moviesCollection.ReplaceOneAsync(x => x.Id == id, updatedMovie);

        public async Task RemoveAsync(string id) =>
            await _moviesCollection.DeleteOneAsync(x => x.Id == id);
    }
}
