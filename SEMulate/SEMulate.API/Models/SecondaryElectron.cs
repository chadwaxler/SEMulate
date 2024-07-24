namespace SEMulate.API.Models;

public class SecondaryElectron
{
    public Position StartPosition { get; init; }
    public Position EndPosition { get; set; }
    public float Energy { get; init; }

    /// Random angle between 0 and 2π
    public double AngleRadians { get; init; }

    public SecondaryElectron(Position startPosition, float energy, double angleRadians)
    {
        StartPosition = startPosition;
        Energy = energy;
        AngleRadians = angleRadians;
        EndPosition = CalculateEndPosition();
    }

    // Method to calculate the end position of the secondary electron
    private Position CalculateEndPosition()
    {
        // Calculate the end position based on the energy and angle of the secondary electron
        var xEnd = StartPosition.X + Energy * (float)Math.Cos(AngleRadians);
        var yEnd = StartPosition.Y + Energy * (float)Math.Sin(AngleRadians);
        return new Position(xEnd, yEnd);
    }
}
