import express, {Application, Request, Response} from 'express';

const app: Application = express();

app.get('/', (req: Request, res: Response): Response => {
  return  res.send('Well done!');
})

app.listen(8000, () => {
    console.log('The application is listening on port 8000!');
})