import TableBody from '../molecules/TableBody'
import TableHead from '../molecules/TableHead'

export function RoutesTable() {
    return (
        <div className='rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white'>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <TableHead />
                    <TableBody />
                </table>
            </div>
        </div>
    )
}

export default RoutesTable
