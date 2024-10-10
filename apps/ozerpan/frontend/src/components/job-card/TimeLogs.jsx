import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
const TimeLogs = ({ times, employee }) => {
    return (
        <div className="mt-10">
            <Table>
                <TableHeader>
                    <TableRow className="text-left">
                        <TableHead className="w-[100px]">Employee</TableHead>
                        <TableHead>From Time</TableHead>
                        <TableHead>To Time</TableHead>
                        <TableHead>Time in Mins</TableHead>
                        <TableHead>Durma Sebebi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        // eslint-disable-next-line react/prop-types
                        times?.map((log) => {
                            return (
                                <TableRow key={log.name} className="text-left">
                                    <TableCell className="font-medium">{employee}</TableCell>
                                    <TableCell>{log.from_time}</TableCell>
                                    <TableCell>{log.to_time}</TableCell>
                                    <TableCell>{log.time_in_mins}</TableCell>
                                    <TableCell>{log.custom_reason}</TableCell>

                                </TableRow>
                            )

                        })
                    }

                </TableBody>
            </Table>
        </div>
    )
}

export default TimeLogs