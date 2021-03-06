import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserParams } from '../../interfaces/definition';
import config from '../../../config/config';

// middlware function
function admin(req: UserParams, res: Response, next:NextFunction) {
// to fetch the token
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send({ message: 'Authorization Denied!', status: false });
  }
  try {
    const decoded: any = jwt.verify(token, config.APP_JWT_SECRET);
    // TAKE USER FROM THE TOKEN; checl if the role is admin then proceed
    const { role } = decoded;
    if (role !== 'admin' && role !== 'superadmin') {
      return res
        .status(401)
        .json({ message: 'Not authorized to view this resource. Only Admin can access this route', status: false });
    }
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(400).json({ message: 'Token not valid' });
  }
}

export default admin;
