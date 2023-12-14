using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDBProject.Services;
using MongoDBProject.Models;

namespace MongoDBProject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MoviesService _moviesService;

        public MoviesController(MoviesService moviesService) =>
            _moviesService = moviesService;

        [HttpGet]
        public long Get() =>
            _moviesService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Movie>> Get(string id)
        {
            var movie = await _moviesService.GetAsync(id);

            if (movie is null)
            {
                return NotFound();
            }

            return movie;
        }

        [HttpGet("{skip}")]
        public async Task<List<Movie>> Get(int skip) =>
            await _moviesService.GetAsync(skip);

        [HttpPost]
        public async Task<IActionResult> Post(Movie newMovie)
        {
            await _moviesService.CreateAsync(newMovie);

            return CreatedAtAction(nameof(Get), new { id = newMovie.Id }, newMovie);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Movie updatedMovie)
        {
            var movie = await _moviesService.GetAsync(id);

            if (movie is null)
            {
                return NotFound();
            }

            updatedMovie.Id = movie.Id;

            await _moviesService.UpdateAsync(id, updatedMovie);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var movie = await _moviesService.GetAsync(id);

            if (movie is null)
            {
                return NotFound();
            }

            await _moviesService.RemoveAsync(id);

            return NoContent();
        }
        [HttpGet("sort")]
        public async Task<List<Movie>> Get(int skip, string sort) =>
            await _moviesService.GetAsync(skip, sort);
    }
}

