export function setupEmailObfuscation(elementId: string): void {
  document.addEventListener('DOMContentLoaded', function() {
    const emailElement = document.getElementById(elementId);
    if (!emailElement) return;
    
    let emailRevealed = false;
    
    emailElement.addEventListener('click', function(e) {
      e.preventDefault();
      if (!emailRevealed) {
        // First click reveals the email and updates the element
        const email = 'ricardo' + '@' + 'rsousa.co';
        emailElement.href = 'mailto:' + email;
        emailRevealed = true;
        // Trigger the mailto on the same click
        window.location.href = emailElement.href;
      }
    });
  });
}
