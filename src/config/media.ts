// Editorial images, replace here with licensed company photography before launch.
export const media = {
  hero: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7',
  leisure: 'https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7',
  water: 'https://images.unsplash.com/photo-1530549387789-4c1017266635',
  pool: 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc',
};
export const photo = (url: string, width = 1200) => url.includes('images.unsplash.com') ? `${url}?auto=format&fit=crop&w=${width}&q=85` : url;
