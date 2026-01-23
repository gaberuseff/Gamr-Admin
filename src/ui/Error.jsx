function Error({ message }) {
    return (
        <div className="flex flex-col items-center p-20">
            <span className="text-text text-lg">يبدوا أن هناك خطأ</span>
            <p className="text-red-500 text-lg">{message}</p>
        </div>
    )
}

export default Error
