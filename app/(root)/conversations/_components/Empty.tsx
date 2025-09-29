

const Empty = ({ title = "No conversations found" }: { title: string }) => {
    return (
        <div className="w-full h-full flex justify-center items-center" >
            <p className="text-gray-500">{title}</p>
        </div>
    )
}

export default Empty