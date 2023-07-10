import "./LatestOrder.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { latestorders } from "../../data/dummy";

const List = ({latestorders}) => {

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{backgroundColor:"white"}}>
          <TableRow>
            <TableCell className="tableCell">Product</TableCell>
            <TableCell className="tableCell">Seller</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Quantity</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {latestorders.map((row) => (
            <TableRow >
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  {row.productname}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.creator}</TableCell>
              <TableCell className="tableCell">{row.buyername}</TableCell>
              <TableCell className="tableCell">{row.buyerpurchasedata}</TableCell>
              <TableCell className="tableCell">{row.productprice}</TableCell>
              <TableCell className="tableCell">{row.productquantity}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;