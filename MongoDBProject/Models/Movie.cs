using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MongoDBProject.Models
{
    [BsonIgnoreExtraElements]

    public class Movie
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; } = null!;

        [BsonElement("genres")]
        public string[] Genres { get; set; } = null!;

        [BsonElement("cast")]
        public string[] Cast { get; set; } = null!;

        [BsonElement("fullplot")]
        public string Plot { get; set; } = null!;

        [BsonElement("directors")]
        public string[] Directors { get; set; } = null!;
        [BsonElement("imdb")]
        [BsonIgnoreIfNull]
        public Imdb Imdb { get; set; } = null!;
    }
    [BsonIgnoreExtraElements]
    
    public class Imdb
    {
        [BsonElement("rating")]
        [BsonIgnoreIfNull]
        [BsonDefaultValue(0)]
        public double Rating { get; set; }
        [BsonIgnoreIfNull]
        [BsonElement("votes")]
        public int? Votes { get; set; }
    }

}
