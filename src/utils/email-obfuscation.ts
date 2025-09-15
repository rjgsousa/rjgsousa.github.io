export function setupEmailObfuscation(elementId: string, source: string = 'unknown'): void {
  document.addEventListener('DOMContentLoaded', function() {
    const emailElement = document.getElementById(elementId) as HTMLAnchorElement;
    if (!emailElement) return;
    
    let emailRevealed = false;
    
    emailElement.addEventListener('click', function(e) {
      e.preventDefault();
      if (!emailRevealed) {
        // First click reveals the email and updates the element
        const email = 'ricardo' + '@' + 'rsousa.co';
        emailElement.href = 'mailto:' + email;
        emailRevealed = true;
        // Track email reveal event
         if (typeof (window as any).Lit !== 'undefined') {
           (window as any).Lit.event('email-reveal', { metadata: { source: source } });
        }
        // Trigger the mailto on the same click
        window.location.href = emailElement.href;
      }
    });
  });
}
