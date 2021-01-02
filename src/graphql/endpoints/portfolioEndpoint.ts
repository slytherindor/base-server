import {GQLProject, GQLResolvers} from "../../generated/schema";

export class PortfolioEndpoint {
  public portFolioResolvers!: GQLResolvers
  public  initialize() {
    this.portFolioResolvers = {
      Query: {
        repos: PortfolioEndpoint.getProjects
      }
    }
    return this.portFolioResolvers;
  }

  private static async getProjects(
    parent: any,
    args: any,
    context: any,
    info: any,
  ): Promise<GQLProject[]> {
    return context.dataSources.githubAPI.getRepos();
  }

}
