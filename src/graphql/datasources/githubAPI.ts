import {RequestOptions, RESTDataSource} from "apollo-datasource-rest";
import {GITHUB_TOKEN} from "../../utils/secrets";
import {GQLProject} from "../../generated/schema";
import projects from "../../config/github-projects-list";

export class GithubAPI extends RESTDataSource {
  private username: string;
  private token: string;
  constructor() {
    super();
    this.baseURL = 'https://api.github.com/'
    this.username = 'slytherindor';
    this.token = Buffer.from(`${this.username}:${GITHUB_TOKEN}`).toString("base64");
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', `Basic ${this.token}`);
  }

  async getRepos(): Promise<GQLProject[]> {
    let repos = await this.get(`user/repos`);
    // console.log(repos);
    repos = repos.filter((data: any) => data.name.toLowerCase() in projects)
    console.log(repos);
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

  }

}
