namespace MongoDBProject.Models
{
    public class MoviesDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string MoviesCollectionName { get; set; } = null!;
    }
}
