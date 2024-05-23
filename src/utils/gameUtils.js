


export function scrollToNext(additionalOffset = 0) {
  const element = document.getElementById('modal');
  const offset = 120; // Extra offset for the fixed navbar

  // Get the element's position relative to the viewport
  const elementRect = element.getBoundingClientRect();

  // Calculate the absolute top position of the element
  const absoluteElementTop = elementRect.top + window.pageYOffset;

  // Calculate the target scroll position
  const scrollPosition = absoluteElementTop - window.innerHeight + elementRect.height + offset + additionalOffset;

  // Scroll to the calculated position with smooth behavior
  window.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  });
}

//resets game to beginning
export function handlePlayAgain() {
  window.location.reload()
}

//takes user to home page
export function handleGoHome() {
  window.history.back()
}