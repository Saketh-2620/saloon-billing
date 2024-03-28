import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function EmployeeTotalsTable({rows}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Employee ID</TableCell>
            <TableCell align="center">Employee Name</TableCell>
            <TableCell align="center">Total Billing</TableCell>
            <TableCell align="center">Total Incentive</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{row.employeeId}</TableCell>
              <TableCell align="center">{row.employeeName}</TableCell>
              <TableCell align="center">{row.totalBilling}</TableCell>
              <TableCell align="center">{row.totalIncentive}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}