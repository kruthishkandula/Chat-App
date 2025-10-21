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
            <Card className={`text-left px-4 py-4 rounded-[1rem] bg-${is_u ? 'primary' : 'secondary'} ${is_u ? 'rounded-br-[0px]' : 'rounded-bl-[0px]'}`} >
                <h4 className='font-medium text-lg text-card-foreground text-center'>{d?.message}</h4>
            </Card>
            <div className={`flex flex-col gap-0 ${is_u ? 'items-end' : 'items-start'}`} >
                <h4 className={`font-semibold text-[0.8rem] text-muted-foreground ${is_u ? 'text-end' : 'text-start'}`}>{dayjs(d?._creationTime).format('hh:mm a')}</h4>
                {/* <p className={`font-light text-[0.6rem] text-muted-foreground ${is_u ? 'text-end' : 'text-start'}`}>seen</p> */}
            </div>
        </div>
    )
}

export default ChatCard