export default function CardBackComponent() {
  return (
    <div className="relative w-full h-full min-w-[400px]  min-h-[200px] rounded-md shadow-xl overflow-hidden font-sans">
      <img
        src="/images/card_frame.png"
        alt="Card Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Scrollable Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between font-semibold px-4 pt-10 pb-3 text-gray-900 text-[8px] leading-snug overflow-hidden">
        <div className="overflow-y-auto max-h-[80%] pr-1">
          <p className="mb-2">
            This card certifies that Wade Warren is a registered student at School.
            It serves as proof of identity and affiliation with our institution.
          </p>
          <p className="mb-2">
            This card is non-transferable and should be carried at all times while
            on school premises or participating in school-related activities. It must
            be presented upon request by school staff or authorized personnel.
          </p>
          <p className="mb-2">
            Please report any loss or damage from this card to the school
            administration immediately. Replacement cards may be issued subject
            to applicable fees and procedures.
          </p>
          <p>
            By presenting this card, the student agrees to abide by the rules,
            regulations, and code of conduct set forth by School.
          </p>
        </div>

        <div className="flex items-center justify-around pb-6 text-[8px]">
          <div className="flex items-center gap-1">
            <span>📞</span> <span>+123-456-7890</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌐</span> <span>www.reallygreatsite.com</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span> <span>+123 Anywhere St Any City</span>
          </div>
        </div>
      </div>
    </div>
  );
}
