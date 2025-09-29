import { Card } from "@/components/ui/card";
import dayjs from "dayjs";

const ChatCard = ({ ...d }: {
    message: string,
    _creationTime: string,
    is_user: boolean
}) => {
    const is_u = d?.is_user;

    console.log('d', d)
    return (
        <div className={`flex flex-col min-w-[10%] max-w-[40%] ${is_u ? 'items-end self-end' : 'items-start self-start'}`} >
            <Card className={`text-left px-6 py-4 rounded-[24px] bg-${is_u ? 'primary' : 'secondary'} border-4 ${is_u ? 'rounded-br-[0px]' : 'rounded-tl-[0px]'}`} >
                <h4 className='font-medium ml-4 text-lg text-card-foreground text-end'>{d?.message}</h4>
            </Card>
            <div className={`flex flex-col gap-0 ${is_u ? 'items-end' : 'items-start'}`} >
                <h4 className='font-semibold ml-4 text-lg text-muted-foreground text-end'>{dayjs(d?._creationTime).format('hh:mm a')}</h4>
                <p className="font-light ml-4 text-sm text-muted text-end'">seen</p>
            </div>
        </div>
    )
}

export default ChatCard