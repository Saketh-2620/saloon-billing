import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ProductCard({product}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Product ID: {product.id}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Product Code: {product.code}
        </Typography>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant='h7' component="div">
            Price: {product.price}
        </Typography>
        <Typography variant='h7' component="div">
            Incentive: {product.incentive}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Details</Button>
      </CardActions> */}
    </Card>
  );
}
