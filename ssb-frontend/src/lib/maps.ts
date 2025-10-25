 // load Google Maps JS

export async function loadGMaps() {
  if ((window as any).google) return;
  await new Promise<void>(res => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GMAPS_KEY}&libraries=geometry`;
    s.async = true; s.onload = () => res(); document.head.appendChild(s);
  });
}
