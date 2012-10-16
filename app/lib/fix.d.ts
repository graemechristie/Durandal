// Fix for missing touch events from standard lib
interface HTMLElement {
    ontouchmove: (event: MouseEvent) =>any; // Oddly compiler shows a Duplicate identifier error .. however this still compiles fine
    onorientationchange: (event: MouseEvent)=>any; // Oddly compiler shows a Duplicate identifier error .. however this still compiles fine
}
