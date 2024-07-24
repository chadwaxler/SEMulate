namespace SEMulate.API.Models;

public class InteractionVolume
{
  public Position Center { get; init; }
  public float Radius { get; init; }

  public InteractionVolume(Position center, float radius)
  {
    Center = center;
    Radius = radius;
  }

  public Position GetRandomPosition()
  {
    var random = new Random();
    var randomAngle = (float)(random.NextDouble() * 2 * Math.PI);
    var randomRadius = (float)(random.NextDouble() * Radius);
    var x = Center.X + randomRadius * (float)Math.Cos(randomAngle);
    var y = Center.Y + randomRadius * (float)Math.Sin(randomAngle);
    return new Position(x, y);
  }
}
