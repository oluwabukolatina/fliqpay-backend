import { Response } from 'express';
import { RequestInterface } from '../../../interfaces/request/request.interface';
import { UserParams } from '../../../interfaces/definition';
import RequestService from '../../../services/requests/customers/request.service';
import SingleRequest from '../../../services/requests/shared/request.service';

/**
 * authenticated customer requests controller perform
 * fetching signed in user requests,
 * getting a particular request
 *making a request
 * */

class RequestController {
  /**
   * @description retrieve and return all signed in user requests
   * @param {object} req
   * @param user
   * @param {object} res
   * @returns {Array}
   */
  // static async getAUserRequests({ user }: User, res: Response) {
  static async getAUserRequests(req: UserParams, res: Response) {
    const { id } = req.user;
    const query: any = { creator: id };

    try {
      const requests = await RequestService.fetchAllRequests(query);
      if (!requests) return res.status(400).json({ message: 'Unable to get requests', status: false });
      return res.status(200).json({
        message: 'Fetched requests',
        status: true,
        requests,
      });
    } catch (e) {
      return res.status(400).json({ message: 'Something went wrong while getting requests!' });
    }
  }

  /**
   * @description create a request with the id of the curently logged in user
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static async createRequest(req: UserParams, res: Response): Promise<Response> {
    const { name } = req.body;
    const { user } = req;
    const { id } = user;
    if (!name) return res.status(400).json({ status: false, message: 'Name of request required' });

    try {
      const newRequest:any = {
        name,
        creator: id,
      };

      const request = await RequestService.createARequest(newRequest);
      if (!request) return res.status(400).json({ message: 'Unable to create request' });
      return res.status(201).json({
        message: 'Request created!',
        request: {
          status: request.status,
          id: request.id,
          name: request.name,
          createdAt: request.createdAt,
        },
      });
    } catch (e) {
      return res.status(400).send('Something went wrong!');
    }
  }

  // a customer can only get her own single request
  /**
   * @description get a specific request belonging to the currently logged in user
   * @param {object} req
   * @param {object} res
   * @returns {object} request
   */
  static async getARequest(req: UserParams, res: Response) {
    const { id } = req.params;
    const { user } = req;
    const query: any = { _id: id, creator: user.id };
    try {
      const request = await SingleRequest.getARequest(query);
      if (!request) return res.status(404).json({ message: 'Request not found', status: false });
      return res.status(200).json({ message: 'Fetched a request', status: true, request });
    } catch (error) {
      return res.status(400).json({ message: 'Something went wrong here!' });
    }
  }
}
export default RequestController;
