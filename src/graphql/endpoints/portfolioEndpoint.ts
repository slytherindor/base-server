import {GQLProject, GQLResolvers} from '../../generated/schema';
import logger from '../../utils/logger';

export class PortfolioEndpoint {
  public portFolioResolvers!: GQLResolvers;
  public initialize() {
    this.portFolioResolvers = {
      Query: {
        repos: PortfolioEndpoint.getProjects,
      },
    };
    return this.portFolioResolvers;
  }

  private static async getProjects(
    parent: any,
    args: any,
    context: any,
    info: any
  ): Promise<GQLProject[]> {
    logger.info('Resolving graphql request to get repos');
    return context.dataSources.githubAPI.getRepos();
  }
}
