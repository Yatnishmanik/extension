# 📚 @algorithmic-art

## 📌 Overview
- **Trigger**: `@algorithmic-art`
- **Category**: For Students (Study, Writing & Office Productivity)
- **Purpose**: Create interactive visual art, math-based animations, or coordinate geometry using code (specifically p5.js and canvas).
- **Best For**: Learning creative coding, building interactive visual portfolios, and designing dynamic elements.

---

## 🚀 How to Trigger
In your Promptimity AI chat, type:
```text
@algorithmic-art [describe the visual effect, mathematical shape, or animation style you want to create]
```

---

## 💡 Key Capabilities & Features

- **P5.js and HTML Canvas Integration**: Generates complete, functional p5.js sketch code or vanilla HTML5 Canvas JS code to draw shapes, lines, and gradients.
- **Mathematical Formulations**: Explains and implements math concepts like Trigonometry (sine/cosine waves), Fractals, L-systems, and Bezier curves.
- **Interactive Event Binding**: Wire mouse movements, click states, keypress events, and window resizing triggers to the canvas to make art responsive.
- **Physics and Particle Systems**: Models simple physics concepts such as gravity, velocity vector fields, friction, collisions, and particle trails.
- **Performance Optimization**: Focuses on rendering high frame-rate animations (60 FPS) by optimizing draw loops, utilizing pixel arrays, and minimizing garbage collection.

---

## 🛠️ Real-world Examples

### Example 1: Sine-Wave Particle Wave in P5.js
**Prompt:**
> `@algorithmic-art I want to create an interactive 2D particle wave using p5.js. The particles should move in a sine-wave pattern across the screen, changing color based on the mouse X position and creating trail traces.`

### Example 2: Fractal Tree drawing
**Prompt:**
> `@algorithmic-art write code for an HTML5 Canvas drawing of a recursive fractal tree. The user should be able to press the up/down arrows to increase/decrease the recursion depth dynamically.`

---

## 📘 Best Practices
1. **Always Handle Window Resize**: Include a listener or trigger to dynamically resize the canvas when the user changes their browser window size.
2. **Optimize Draw Loops**: Avoid heavy calculations or new object instantiations inside the `draw()` loop to prevent frame drops.
3. **Use Delta Time**: If frame rates might fluctuate, use time-based animation steps instead of frame-based increments for smooth movement.
