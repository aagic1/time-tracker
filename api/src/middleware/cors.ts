import cors from 'cors';

let origin = process.env.CORS_ORIGIN!;
if (origin.slice(-1) === '/') {
  origin = origin.slice(0, -1);
}

export default cors({
  credentials: true,
  origin: [origin],
  optionsSuccessStatus: 200,
});
