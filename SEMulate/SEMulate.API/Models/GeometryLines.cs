namespace SEMulate.API.Models;

/**
 * This class is responsible for creating the geometry of lines on a canvas.
 * The geometry consists of a series of elevated features (lines) separated by flat substrate areas.
 * The number of lines (`NumberOfLines`) determines the pattern of these features.
 *
 * For example, with `NumberOfLines = 3`, the pattern is visualized as follows:
 *
 *     _____       _____       _____
 *    |     |     |     |     |     |
 * ___|     |_____|     |_____|     |____
 *
 * Each line represents an elevated feature, and the spaces in between represent the substrate.
 */
public class GeometryLines
{
  public int NumberOfLines { get; init; }
  public int LineHeight { get; init; }
  public int ScanWidth { get; init; }

  public GeometryLines(int numberOfLines, int lineHeight, int scanWidth)
  {
    NumberOfLines = numberOfLines;
    LineHeight = lineHeight;
    ScanWidth = scanWidth;
  }

  // This method calculates the height of the line at a given x position.
  public int GetLineHeight(int xPosition)
  {
    // If the x position is in a gap region, the height is 0.
    // Otherwise, the height is the specified line height.
    return IsInGapRegion(xPosition) ? 0 : LineHeight;
  }

  public bool IsInGapRegion(float xPosition)
  {
    var numberOfSections = 2 * NumberOfLines + 1;
    var sectionWidth = (float)ScanWidth / numberOfSections;

    var positionInPattern = xPosition % (2 * sectionWidth);
    return positionInPattern < sectionWidth;
  }

  public bool IsPointInSubstrate(Position position)
  {
    // If the x position is less than 0, it is in the substrate.
    if (position.Y < 0)
    {
      return true;
    }

    // If the x position is greater than the line height, it is above the substrate.
    if(position.Y > LineHeight)
    {
      return false;
    }

    // If the x position is in a gap region, it is not in the substrate.
    if(IsInGapRegion(position.X))
    {
      return false;
    }

    // Otherwise, the x position is in the substrate.
    return true;
  }

}
