import {RequestOptions, RESTDataSource} from 'apollo-datasource-rest';
import projects from '../../config/github-projects-list';
import {GQLProject} from '../../generated/schema';
import logger from '../../utils/logger';
import {GITHUB_TOKEN} from '../../utils/secrets';

export class GithubAPI extends RESTDataSource {
  private username: string;
  private token: string;
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/';
    this.username = 'slytherindor';
    this.token = Buffer.from(`${this.username}:${GITHUB_TOKEN}`).toString(
      'base64'
    );
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', `Basic ${this.token}`);
    logger.debug(
      `Using token ${this.token} for authorization of GitHub API requests.`
    );
  }

  async getRepos(): Promise<GQLProject[]> {
    try {
      logger.info('GithubAPI:getRepos: Fetching repos from GitHub.');
      let repos = await this.get('user/repos');
      repos = repos.filter((data: any) => data.name.toLowerCase() in projects);
      logger.info('GithubAPI:getRepos: Returning repos.');
      return repos.map((data: any) => {
        const prj: GQLProject = {
          name: data.name,
          description: data.description ? data.description : '',
          language: data.language,
          repoUrl: data.html_url,
          updatedAt: data.update_at,
        };
        return prj;
      });
    } catch (e) {
      logger.error(
        `GitHubAPI: There was an error while fetching repos from GitHub API: ${e}`
      );
      throw e;
    }
  }
}
