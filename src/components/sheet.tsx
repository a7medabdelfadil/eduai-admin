import React, { ReactNode } from "react";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-[150] bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      } flex justify-end`}
      onClick={onClose}
    >
      <div
        className={`h-full w-[400px] max-w-full transform bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute right-4 top-4 text-lg" onClick={onClose}>
          ✕
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
    //   const [isSheetOpen, setIsSheetOpen] = useState(false);

    //   const handleOpen = () => setIsSheetOpen(true);
    //   const handleClose = () => setIsSheetOpen(false);
    //     <div className="p-8">
    //     <button
    //       className="bg-blue-500 text-white px-4 py-2 rounded"
    //       onClick={handleOpen}
    //     >
    //       Open Sheet
    //     </button>
    //     <Sheet isOpen={isSheetOpen} onClose={handleClose}>
    //       <h2 className="text-2xl font-semibold mb-4">Sheet Content</h2>
    //       <p>This is some content inside the sheet.</p>
    //     </Sheet>
    //   </div>
  );
};

export default Sheet;
