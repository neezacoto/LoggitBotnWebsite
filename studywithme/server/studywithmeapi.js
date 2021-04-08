import Express from 'express';

const router = Express.Router();

import BodyParse from 'body-parser';

router.use(BodyParse.json());



export default router;