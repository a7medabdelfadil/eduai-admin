export default function CardBackComponent() {
  return (
    <div className="relative h-full min-h-[200px] w-full min-w-[400px] overflow-hidden rounded-md font-sans shadow-xl">
      <img
        src="/images/card_frame.png"
        alt="Card Background"
        className="absolute left-0 top-0 z-0 h-full w-full object-cover"
      />

      {/* Scrollable Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between overflow-hidden px-4 pb-3 pt-10 text-[8px] font-semibold leading-snug text-gray-900">
        <div className="max-h-[80%] overflow-y-auto pr-1">
          <p className="mb-2">
            This card certifies that Wade Warren is a registered student at
            School. It serves as proof of identity and affiliation with our
            institution.
          </p>
          <p className="mb-2">
            This card is non-transferable and should be carried at all times
            while on school premises or participating in school-related
            activities. It must be presented upon request by school staff or
            authorized personnel.
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
