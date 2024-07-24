namespace SEMulate.API.Models;

public class Position
{
  public float X { get; init; }
  public float Y { get; init; }

  public Position(float x, float y)
  {
    X = x;
    Y = y;
  }
}
