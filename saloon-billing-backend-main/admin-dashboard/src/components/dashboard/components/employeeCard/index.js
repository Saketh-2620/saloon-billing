import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function EmployeeCard({id, name, phoneNumber}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Employee ID: {id}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant='h5' component="div">
            {phoneNumber}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
      </CardActions>
    </Card>
  );
}
