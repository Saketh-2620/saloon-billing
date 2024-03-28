import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function ShopCard({shopId, shopName}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Shop ID: {shopId}
        </Typography>
        <Typography variant="h5" component="div">
          {shopName}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/shop/${shopId}`} style={{textDecoration: 'none'}}>
          <Button size="small">Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
