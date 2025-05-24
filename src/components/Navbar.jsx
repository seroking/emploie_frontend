export default function Navbar() {

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow px-4 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg text-gray-800">OFPPT</h1>
      <div className="flex gap-4 cursor-pointer">
        <i className="fa-solid fa-moon"></i>
      </div>
    </nav>
  );
}
