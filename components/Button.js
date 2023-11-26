const Button = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`mr-2 px-4 py-2 ${
        isActive
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "bg-gray-300 hover:bg-gray-400 text-gray-700"
      } rounded focus:outline-none focus:ring focus:border-blue-300 transition-all duration-300`}
      onClick={() => onClick()}>
      {label}
    </button>
  );
};

export default Button;
