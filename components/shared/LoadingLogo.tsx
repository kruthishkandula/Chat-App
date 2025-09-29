import Image from 'next/image';

type Props = {
    size?: number;
}

export const LoadingLogo = ({ size = 500 }: Props) => {
    return (
        <div className="flex items-center justify-center w-full h-screen">
            <Image src={'/logo.svg'} alt="Loading..." className='animate-pulse duration-700' width={size} height={size} />
        </div>
    )
}
