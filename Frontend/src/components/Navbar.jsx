const Navbar = ({ user }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 shadow-sm">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">
        TAC Services <span className="block sm:inline">Pvt. Ltd</span>
      </h1>

      <div className="text-gray-600 text-sm truncate">
        Welcome,&nbsp;
        <span className="font-semibold text-gray-800">{user.name}</span>&nbsp;
        ({user.role})
      </div>
    </div>
  );
};

export default Navbar;
