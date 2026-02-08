interface HeroProps {
  title: string;
  imageSrc: string;
}

const PagesHero = ({ title, imageSrc }: HeroProps) => {
  return (
    <section className={`relative w-full h-50 md:h-75 mb-8 mt-20`}>
      {/* Pozadinska slika */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover blur-[3px]"
      />

      {/* Tamni overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Tekst */}
      <div className="relative z-20 w-full h-full flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default PagesHero;
