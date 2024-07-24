using SEMulate.API.Models;

namespace SEMulate.API.Services;

public struct SEMulateParameters
{
    public int ScanWidth { get; set; }
    public int NumberOfElectrons { get; set; }
    public int NumberOfLines { get; set; }
}

public class SEMulateService
{
    public List<int> Run(SEMulateParameters parameters)
    {
        var detections = new List<int>();

        var geometry = new GeometryLines(parameters.NumberOfLines, 100, parameters.ScanWidth);

        for (var xPostion = 0; xPostion < parameters.ScanWidth; xPostion++)
        {
            // Determine the height of the geometry at the current x position
            float height = geometry.GetLineHeight(xPostion);

            // Create the interaction volume at the current x and y position
            var radius = 10;
            var depth = 10;
            float yPostion = height - radius - depth;
            var volume = new InteractionVolume(new Position(xPostion, yPostion), radius);

            var escapedElectrons = 0;
            for (var i = 0; i < parameters.NumberOfElectrons; i++)
            {
                // Get a random position within the interaction volume
                var startingPosition = volume.GetRandomPosition();

                // Check if the starting position is not within the substrate
                if (!geometry.IsPointInSubstrate(startingPosition))
                {
                    continue;
                }

                // Create the secondary electron and simulate its path
                var energy = new Random().Next(30, 90);
                var angle = new Random().NextDouble() * 2 * Math.PI;
                var secondaryElectron = new SecondaryElectron(startingPosition, energy, angle);

                // Check if the secondary electron escapes the geometry
                if (!geometry.IsPointInSubstrate(secondaryElectron.EndPosition))
                {
                  escapedElectrons++;
                }
            }
            detections.Add(escapedElectrons);
        }

        return detections;
    }
}
