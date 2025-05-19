export default function TimeSlot({ time }) {
    return (
      <div className="p-2 mb-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
        {time}
      </div>
    );
  }