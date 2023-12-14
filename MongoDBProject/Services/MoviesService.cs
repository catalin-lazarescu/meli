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

        public async Task<List<Movie>> GetAsync() =>
            await _moviesCollection.Find(_ => true).Limit(100).ToListAsync();

        public async Task<Movie?> GetAsync(string id) =>
            await _moviesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Movie newMovie) =>
            await _moviesCollection.InsertOneAsync(newMovie);

        public async Task UpdateAsync(string id, Movie updatedMovie) =>
            await _moviesCollection.ReplaceOneAsync(x => x.Id == id, updatedMovie);

        public async Task RemoveAsync(string id) =>
            await _moviesCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<List<Movie>> GetFilteredAsync(double minRating, double maxRating, List<string> genres)
        {
            var builder = Builders<Movie>.Filter;
            var filter = builder.Gte("Imdb.Rating", minRating) & builder.Lte("Imdb.Rating", maxRating) & builder.In("Genres", genres);
            return await _moviesCollection.Find(filter).ToListAsync();
        }

        public async Task<FilterBoundaries> GetFilterBoundariesAsync()
        {
            var minRating = await _moviesCollection.Find(_ => true).SortBy(m => m.Imdb.Rating).Limit(1).FirstOrDefaultAsync();
            var maxRating = await _moviesCollection.Find(_ => true).SortByDescending(m => m.Imdb.Rating).Limit(1).FirstOrDefaultAsync();
            var genres = await _moviesCollection.Distinct<string>("Genres", new BsonDocument()).ToListAsync();

            return new FilterBoundaries
            {
                MinRating = minRating.Imdb.Rating ?? 0.0,
                MaxRating = maxRating.Imdb.Rating ?? 10.0,
                Genres = genres
            };
        }
    }
}
