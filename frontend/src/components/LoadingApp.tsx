export default function LoadingApp() {
  return (
    <div className="fixed w-full h-dvh top-0 left-0 bg-cream z-9999 flex justify-center items-center flex-col select-none">
      <img src="../public/ico.png" alt="cards" className="w-20" />
      <p className="font-display font-bold">Flashcards</p>
      <p className="text-brown animate-pulse">Loading application...</p>
    </div>
  );
}
