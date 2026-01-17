// src/sections/HeroObjekti.tsx

const HeroObjekti = () => {
  return (
    <section className="relative w-full h-[200px] md:h-[300px] mb-8 mt-20">
      {/* Slika pozadine */}
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
        alt="Lis"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Tekst */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center">
          Turistički objekti
        </h1>
      </div>
    </section>
  );
};

export default HeroObjekti;
