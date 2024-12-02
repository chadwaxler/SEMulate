# SEMulate

SEMulate is a web application that simulates the scanning electron microscope (SEM) imaging process. The goal of this side project was to create a very simplified analytical linescan model.

Demo: [https://chadwaxler.github.io/SEMulate/](https://chadwaxler.github.io/SEMulate/)

**Built With:** Angular (v19), NgRx Signal Store, p5.js, Highcharts, TailwindCSS, and DaisyUI.

<p align="center">
<img src="/docs/SEMulate.png"
  alt="Screenshot of the SEMulate web application"
  width="auto" height="700">
</p>

## Parameters

- **Geometry: Number of Lines**: This allows the user to modify the number of resist lines on the image.  Currently, the line widths and line spacing are equal.
- **Interaction Volume: Depth**: This is the depth of the interaction volume within the pattern.
- **Interaction Volume: Radius**: The interaction volume is modeled as a simple circle.  Users can control the radius of the circle using this parameter.
- **Secondary Electrons: Electrons Per Frame**: This controls the number of secondary electrons emitted per frame.
- **Secondary Electrons: Energy Mean**: This is the mean energy of the secondary electrons.
- **Secondary Electrons: Energy Std Dev**: This is the standard deviation of the energy of the secondary electrons.

