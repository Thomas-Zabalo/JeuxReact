
const Primary = ({ children, onClick, disabled }) => {
    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <div 
            onClick={handleClick} 
            className={`flex w-full items-center justify-center bg-white text-black px-4 py-2 rounded-2xl hover:bg-gray-300 transition ${disabled ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}`}
        >
            <p>{children}</p>
        </div>
    );
};

export { Primary };
