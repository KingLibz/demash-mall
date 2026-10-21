/**
 * Safe navigation utility avoiding window.open/window.alert restrictions
 */

export function openWhatsAppLink(phoneWithCountryCode: string, message: string) {
  const cleanPhone = phoneWithCountryCode.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
  
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    window.location.href = url;
  }
}
